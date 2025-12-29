
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Header from './components/Header';
import GameMap from './components/GameMap';
import TriviaPanel from './components/TriviaPanel';
import Auth from './components/Auth';
import Logo from './components/Logo';
import { PlayerId, GameState, TriviaQuestion, Territory, ChatMessage, Player, GamePhase, PeerMessage, UserAccount } from './types';
import { WORLD_TERRITORIES, CATEGORIES } from './constants';
import { fetchTriviaQuestion, generateChatReaction } from './services/geminiService';
import { Peer, DataConnection } from 'peerjs';

const PLAYER_COLORS = ['#dc2626', '#2563eb', '#16a34a', '#d97706', '#7c3aed'];

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [myId, setMyId] = useState<string>('');
  const [roomCodeInput, setRoomCodeInput] = useState<string>('');
  
  const [gameState, setGameState] = useState<GameState>({
    players: [],
    territories: WORLD_TERRITORIES,
    currentPlayerIndex: 0,
    phase: 'AUTH',
    round: 1,
    selectedTerritoryId: null,
    chat: [{ id: '1', sender: 'النظام', text: 'مرحباً بك في سيف المعرفة أونلاين!', type: 'system', timestamp: new Date() }],
    roomCode: null
  });

  const [activeQuestion, setActiveQuestion] = useState<TriviaQuestion | null>(null);
  const [timer, setTimer] = useState(20);
  const peerRef = useRef<Peer | null>(null);
  const connectionsRef = useRef<DataConnection[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('sword_knowledge_current');
    if (saved) {
      setCurrentUser(JSON.parse(saved));
      setGameState(prev => ({ ...prev, phase: 'LOBBY' }));
    }
  }, []);

  const handleLogin = (user: UserAccount) => {
    setCurrentUser(user);
    setGameState(prev => ({ ...prev, phase: 'LOBBY' }));
  };

  const isHost = gameState.players.find(p => p.id === myId)?.isHost ?? false;
  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  const isMyTurn = currentPlayer?.id === myId;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [gameState.chat]);

  useEffect(() => {
    if (gameState.phase === 'AUTH') return;
    const peer = new Peer();
    peerRef.current = peer;
    peer.on('open', (id) => setMyId(id));
    peer.on('connection', (conn) => {
      if (!isHost && gameState.phase !== 'LOBBY') {
        conn.close();
        return;
      }
      conn.on('open', () => connectionsRef.current.push(conn));
      conn.on('data', (data: any) => handleIncomingData(data as PeerMessage, conn));
    });
    return () => peer.destroy();
  }, [isHost, gameState.phase]);

  const broadcast = (message: PeerMessage) => {
    connectionsRef.current.forEach(conn => {
      if (conn.open) conn.send(message);
    });
  };

  const handleIncomingData = (data: PeerMessage, conn?: DataConnection) => {
    switch (data.type) {
      case 'STATE_UPDATE':
        setGameState(data.state);
        break;
      case 'CHAT':
        setGameState(prev => ({ ...prev, chat: [...prev.chat, data.message].slice(-30) }));
        break;
      case 'QUESTION_TRIGGER':
        setActiveQuestion(data.question);
        setTimer(20);
        break;
      case 'START_GAME':
        setGameState(prev => ({ ...prev, phase: 'INITIAL_LANDING' }));
        break;
    }
  };

  const createRoom = () => {
    if (!currentUser) return;
    const shortCode = myId.substring(0, 6).toUpperCase();
    const me: Player = {
      id: myId,
      name: currentUser.username,
      color: PLAYER_COLORS[0],
      score: 0,
      avatar: currentUser.avatar,
      level: currentUser.level,
      isHost: true
    };
    setGameState(prev => ({
      ...prev,
      players: [me],
      roomCode: shortCode,
      phase: 'ROOM_WAITING'
    }));
  };

  const joinRoom = () => {
    if (!roomCodeInput || !currentUser) return;
    const conn = peerRef.current?.connect(roomCodeInput.toLowerCase());
    if (conn) {
      conn.on('open', () => {
        connectionsRef.current.push(conn);
      });
      conn.on('data', (data) => handleIncomingData(data as PeerMessage));
      setGameState(prev => ({ ...prev, phase: 'ROOM_WAITING', roomCode: roomCodeInput }));
    }
  };

  const startGame = () => {
    if (!isHost) return;
    const newState: GameState = { ...gameState, phase: 'INITIAL_LANDING' };
    setGameState(newState);
    broadcast({ type: 'START_GAME' });
    broadcast({ type: 'STATE_UPDATE', state: newState });
  };

  const handleTerritoryClick = async (territoryId: string) => {
    if (!isMyTurn || gameState.phase === 'ROOM_WAITING' || gameState.phase === 'GAME_OVER') return;
    const territory = gameState.territories.find(t => t.id === territoryId);
    if (!territory || (gameState.phase === 'INITIAL_LANDING' && territory.ownerId)) return;

    setGameState(prev => ({ ...prev, selectedTerritoryId: territoryId }));
    const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
    const question = await fetchTriviaQuestion(category);
    setActiveQuestion(question);
    setTimer(20);
    broadcast({ type: 'QUESTION_TRIGGER', question });
  };

  const handleAnswer = async (correct: boolean) => {
    if (!isMyTurn) return;
    const territoryId = gameState.selectedTerritoryId;
    if (!territoryId) return;

    setGameState(prev => {
      let newState = { ...prev, selectedTerritoryId: null };
      const territory = prev.territories.find(t => t.id === territoryId);
      if (correct && territory) {
        newState.territories = prev.territories.map(t => t.id === territoryId ? { ...t, ownerId: myId } : t);
        newState.players = prev.players.map(p => p.id === myId ? { ...p, score: p.score + territory.points } : p);
      }
      newState.currentPlayerIndex = (prev.currentPlayerIndex + 1) % prev.players.length;
      const isAllOwned = newState.territories.every(t => t.ownerId !== null);
      newState.phase = isAllOwned ? 'BATTLE' : 'INITIAL_LANDING';
      broadcast({ type: 'STATE_UPDATE', state: newState });
      return newState;
    });
    setActiveQuestion(null);
  };

  const sendChatMessage = (text: string) => {
    if (!text.trim() || !currentUser) return;
    const msg: ChatMessage = {
      id: Math.random().toString(36).substr(2, 9),
      sender: currentUser.username,
      text,
      type: 'user',
      timestamp: new Date()
    };
    setGameState(prev => ({ ...prev, chat: [...prev.chat, msg].slice(-30) }));
    broadcast({ type: 'CHAT', message: msg });
  };

  const handleLogout = () => {
    localStorage.removeItem('sword_knowledge_current');
    setCurrentUser(null);
    setGameState(prev => ({ ...prev, phase: 'AUTH' }));
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-[#0f0a05] overflow-hidden text-white">
      {gameState.phase === 'AUTH' ? (
        <Auth onLogin={handleLogin} />
      ) : gameState.phase === 'LOBBY' ? (
        <div className="flex-1 flex flex-col items-center justify-center parchment relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-full bg-black/40"></div>
           
           <div className="z-10 bg-[#2d1a01] p-10 rounded-3xl border-8 border-[#8b4513] shadow-[0_0_80px_rgba(0,0,0,1)] text-center max-w-lg w-full mx-4 relative overflow-hidden">
              {/* Background Glow Overlay */}
              <div className="absolute -top-24 -left-24 w-48 h-48 bg-yellow-500/10 blur-[100px]"></div>

              <div className="absolute top-4 right-4">
                 <button onClick={handleLogout} className="text-[10px] text-red-500 hover:text-red-400 font-bold uppercase tracking-tighter transition-colors">تسجيل الخروج</button>
              </div>

              <div className="mb-8">
                <Logo size="lg" />
              </div>

              <div className="mb-8 flex items-center justify-center gap-4 bg-[#1a0f00] p-4 rounded-3xl border border-yellow-700/50 shadow-inner">
                  <div className="relative">
                    <img src={currentUser?.avatar} className="w-16 h-16 rounded-full border-2 border-yellow-500 shadow-lg" alt="avatar" />
                    <div className="absolute -bottom-1 -right-1 bg-yellow-600 text-[10px] px-1.5 py-0.5 rounded-full font-bold border border-yellow-200">
                      LVL {currentUser?.level}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-yellow-400 text-xl arabic-font">{currentUser?.username}</p>
                    <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                       <i className="fa-solid fa-trophy text-yellow-600"></i>
                       {currentUser?.wins} انتصارات
                    </div>
                  </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <button 
                  onClick={createRoom}
                  className="w-full bg-gradient-to-b from-yellow-500 to-yellow-700 hover:from-yellow-400 hover:to-yellow-600 py-5 rounded-2xl text-2xl font-bold arabic-font border-b-8 border-yellow-900 shadow-xl transition-all active:scale-95 active:border-b-0"
                >
                  تحدي عالمي جديد
                </button>
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <input 
                      placeholder="أدخل كود الغرفة" 
                      className="w-full h-full bg-[#1a0f00] border-2 border-[#8b4513] rounded-xl px-4 text-center text-yellow-400 font-bold focus:ring-2 focus:ring-yellow-600 outline-none"
                      value={roomCodeInput}
                      onChange={(e) => setRoomCodeInput(e.target.value)}
                    />
                  </div>
                  <button 
                    onClick={joinRoom}
                    className="bg-gradient-to-b from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 px-8 py-5 rounded-xl font-bold border-b-4 border-blue-950 shadow-lg transition-all active:scale-95 active:border-b-0"
                  >
                    انضمام
                  </button>
                </div>
              </div>
           </div>
        </div>
      ) : gameState.phase === 'ROOM_WAITING' ? (
        <div className="flex-1 flex flex-col items-center justify-center bg-[#1a0f00] parchment relative">
           <div className="z-10 bg-[#2d1a01] p-10 rounded-3xl border-8 border-[#8b4513] shadow-2xl text-center max-w-xl w-full">
              <div className="mb-6">
                <Logo size="sm" />
              </div>
              <h2 className="text-3xl font-bold text-yellow-500 mb-4 arabic-font">غرفة انتظار المحاربين</h2>
              <div className="bg-[#1a0f00] p-6 rounded-2xl border-2 border-dashed border-yellow-600 mb-8 relative">
                 <p className="text-xs text-yellow-600/70 font-bold uppercase mb-2">شارك هذا الكود مع الحلفاء:</p>
                 <span className="text-5xl font-black text-white tracking-[0.2em] drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">{myId.substring(0, 6).toUpperCase()}</span>
                 <div className="absolute -top-3 -right-3 bg-red-600 text-white text-[10px] px-2 py-1 rounded-full font-bold animate-pulse">مباشر</div>
              </div>
              <div className="space-y-4 mb-8">
                <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest text-right">المحاربون المنضمون ({gameState.players.length})</h3>
                <div className="flex flex-wrap justify-center gap-6">
                  {gameState.players.map(p => (
                    <div key={p.id} className="flex flex-col items-center gap-2 group">
                       <div className="relative">
                         <img src={p.avatar} className="w-20 h-20 rounded-full border-4 border-yellow-600 shadow-lg transition-transform group-hover:scale-110" alt={p.name} />
                         {p.isHost && <i className="fa-solid fa-crown absolute -top-2 -right-2 text-yellow-400 drop-shadow-lg"></i>}
                       </div>
                       <span className={`text-sm font-bold ${p.id === myId ? 'text-yellow-400' : 'text-gray-300'}`}>
                         {p.name} {p.id === myId ? '(أنت)' : ''}
                       </span>
                    </div>
                  ))}
                </div>
              </div>
              {isHost ? (
                <button 
                  disabled={gameState.players.length < 1}
                  onClick={startGame}
                  className="w-full bg-gradient-to-b from-green-600 to-green-800 hover:from-green-500 hover:to-green-700 py-5 rounded-2xl text-2xl font-bold arabic-font border-b-8 border-green-950 shadow-xl transition-all active:scale-95 active:border-b-0 disabled:opacity-50"
                >
                  بدء الزحف المقدس
                </button>
              ) : (
                <div className="flex items-center justify-center gap-3 text-yellow-500 animate-pulse bg-yellow-900/20 py-4 rounded-xl border border-yellow-900/50">
                  <i className="fa-solid fa-hourglass-half"></i>
                  <p className="font-bold">في انتظار القائد لإصدار أوامر الحرب...</p>
                </div>
              )}
           </div>
        </div>
      ) : (
        <div className="flex h-full">
          <div className="flex-1 flex flex-col border-l-4 border-[#3d2b1f]">
            <Header players={gameState.players.reduce((acc, p) => ({...acc, [p.id]: p}), {})} currentPlayerId={currentPlayer?.id} phase={gameState.phase} />
            <div className="flex-1 relative bg-[#0a0500]">
              <GameMap 
                territories={gameState.territories} 
                players={gameState.players.reduce((acc, p) => ({...acc, [p.id]: p}), {})}
                onTerritoryClick={handleTerritoryClick}
                selectedTerritoryId={gameState.selectedTerritoryId}
                phase={gameState.phase}
              />
              {!isMyTurn && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/80 px-8 py-3 rounded-full border border-yellow-500/50 shadow-[0_0_20px_rgba(255,165,0,0.2)] animate-pulse z-30 flex items-center gap-3">
                  <i className="fa-solid fa-shield-halved text-yellow-500"></i>
                  <span className="font-bold tracking-wide">دور المحارب {currentPlayer?.name}...</span>
                </div>
              )}
            </div>
          </div>
          {/* Chat Sidebar */}
          <div className="w-85 bg-[#1a0f00] flex flex-col shadow-2xl z-40 border-r-4 border-[#3d2b1f]">
            <div className="p-4 border-b border-[#3d2b1f] bg-[#2d1a01] flex justify-between items-center shadow-lg">
               <h3 className="font-bold text-yellow-500 flex items-center gap-2">
                 <i className="fa-solid fa-scroll"></i> وقائع المعركة
               </h3>
               <div className="flex items-center gap-1">
                 <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                 <span className="text-[10px] text-green-500 font-black uppercase">LIVE</span>
               </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')]">
               {gameState.chat.map(msg => (
                 <div key={msg.id} className={`p-3 rounded-lg ${msg.type === 'system' ? 'bg-yellow-900/20 border border-yellow-900/50 italic text-center text-xs text-yellow-600/70' : 'bg-[#2d1a01] border-r-4 border-yellow-600 shadow-sm'}`}>
                    {msg.type !== 'system' && (
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-black text-[10px] text-yellow-600 uppercase">{msg.sender}</span>
                      </div>
                    )}
                    <p className="text-gray-300 text-sm leading-relaxed">{msg.text}</p>
                 </div>
               ))}
               <div ref={chatEndRef} />
            </div>
            <form onSubmit={(e) => { e.preventDefault(); const input = e.currentTarget.querySelector('input'); if(input) { sendChatMessage(input.value); input.value = ''; } }} className="p-4 border-t border-[#3d2b1f] bg-[#0a0500]">
               <div className="flex items-center gap-2 bg-[#1a0f00] p-2 rounded-2xl border border-[#3d2b1f] focus-within:border-yellow-600 transition-colors shadow-inner">
                  <input placeholder="أرسل رسالة إلى رفاقك..." className="bg-transparent border-none outline-none text-sm w-full py-2 px-2 text-yellow-100 placeholder:text-gray-600" />
                  <button type="submit" className="bg-yellow-600 text-[#1a0f00] w-10 h-10 rounded-xl hover:bg-yellow-500 transition-all active:scale-90 flex items-center justify-center">
                    <i className="fa-solid fa-paper-plane-top"></i>
                  </button>
               </div>
            </form>
          </div>
        </div>
      )}
      {activeQuestion && (
        <TriviaPanel question={activeQuestion} onAnswer={handleAnswer} timer={timer} disabled={!isMyTurn} />
      )}
    </div>
  );
};

export default App;
