
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Header from './components/Header';
import GameMap from './components/GameMap';
import TriviaPanel from './components/TriviaPanel';
import { PlayerId, GameState, TriviaQuestion, Territory, ChatMessage } from './types';
import { INITIAL_PLAYERS, WORLD_TERRITORIES, CATEGORIES } from './constants';
import { fetchTriviaQuestion, generateChatReaction } from './services/geminiService';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    players: INITIAL_PLAYERS,
    territories: WORLD_TERRITORIES,
    currentPlayerId: PlayerId.USER,
    phase: 'LOBBY',
    round: 1,
    selectedTerritoryId: null,
    chat: [
      { id: '1', sender: 'النظام', text: 'مرحباً بك في سيف المعرفة أونلاين!', type: 'system', timestamp: new Date() }
    ]
  });

  const [activeQuestion, setActiveQuestion] = useState<TriviaQuestion | null>(null);
  const [timer, setTimer] = useState(20);
  const [isBotThinking, setIsBotThinking] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [gameState.chat]);

  const addChatMessage = useCallback(async (sender: string, text: string, type: 'user' | 'bot' | 'system' = 'bot') => {
    const newMessage: ChatMessage = {
      id: Math.random().toString(36).substr(2, 9),
      sender,
      text,
      type,
      timestamp: new Date()
    };
    setGameState(prev => ({ ...prev, chat: [...prev.chat.slice(-20), newMessage] }));
  }, []);

  const handleStartMatchmaking = () => {
    setGameState(prev => ({ ...prev, phase: 'MATCHMAKING' }));
    setTimeout(() => {
      addChatMessage('النظام', 'تم العثور على منافسين! جاري الاتصال بالسيرفر...', 'system');
      setTimeout(() => {
        setGameState(prev => ({ ...prev, phase: 'INITIAL_LANDING' }));
        addChatMessage('النظام', 'بدأت المعركة! اختر منطقتك الأولى.', 'system');
      }, 2000);
    }, 3000);
  };

  const nextTurn = useCallback(() => {
    const playerIds = [PlayerId.USER, PlayerId.BOT_1, PlayerId.BOT_2];
    const currentIndex = playerIds.indexOf(gameState.currentPlayerId);
    const nextIndex = (currentIndex + 1) % playerIds.length;
    const nextPlayerId = playerIds[nextIndex];
    const isAllOwned = gameState.territories.every(t => t.ownerId !== null);

    setGameState(prev => ({
      ...prev,
      currentPlayerId: nextPlayerId,
      phase: isAllOwned ? 'BATTLE' : 'INITIAL_LANDING',
      round: nextIndex === 0 ? prev.round + 1 : prev.round
    }));
  }, [gameState.currentPlayerId, gameState.territories]);

  const handleTerritoryClick = async (territoryId: string) => {
    if (gameState.currentPlayerId !== PlayerId.USER || gameState.phase === 'LOBBY' || gameState.phase === 'MATCHMAKING') return;
    
    const territory = gameState.territories.find(t => t.id === territoryId);
    if (!territory || (gameState.phase === 'INITIAL_LANDING' && territory.ownerId)) return;

    setGameState(prev => ({ ...prev, selectedTerritoryId: territoryId }));
    const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
    const question = await fetchTriviaQuestion(category);
    setActiveQuestion(question);
    setTimer(20);
  };

  const handleAnswer = async (correct: boolean) => {
    const territoryId = gameState.selectedTerritoryId;
    if (!territoryId) return;

    const territory = gameState.territories.find(t => t.id === territoryId);
    if (correct && territory) {
      setGameState(prev => {
        const updatedTerritories = prev.territories.map(t => 
          t.id === territoryId ? { ...t, ownerId: prev.currentPlayerId } : t
        );
        const updatedPlayers = { ...prev.players };
        updatedPlayers[prev.currentPlayerId].score += territory.points;
        return { ...prev, territories: updatedTerritories, players: updatedPlayers, selectedTerritoryId: null };
      });
      
      const reaction = await generateChatReaction('إجابة صحيحة وغزو', gameState.players[PlayerId.USER].name);
      addChatMessage('القائد خالد', reaction, 'bot');
    } else {
      setGameState(prev => ({ ...prev, selectedTerritoryId: null }));
      addChatMessage('الداهية عثمان', 'حظاً موفقاً في المرة القادمة!', 'bot');
    }

    setActiveQuestion(null);
    nextTurn();
  };

  useEffect(() => {
    let interval: any;
    if (activeQuestion && timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    } else if (timer === 0 && activeQuestion) {
      handleAnswer(false);
    }
    return () => clearInterval(interval);
  }, [activeQuestion, timer]);

  // Bot Logic with simulated chat
  useEffect(() => {
    if (gameState.currentPlayerId !== PlayerId.USER && !['LOBBY', 'MATCHMAKING', 'GAME_OVER'].includes(gameState.phase) && !activeQuestion && !isBotThinking) {
      setIsBotThinking(true);
      setTimeout(async () => {
        const available = gameState.territories.filter(t => !t.ownerId);
        let target = gameState.phase === 'INITIAL_LANDING' ? available[Math.floor(Math.random() * available.length)] : gameState.territories[Math.floor(Math.random() * gameState.territories.length)];

        if (target) {
          const isCorrect = Math.random() < 0.7;
          if (isCorrect) {
            setGameState(prev => {
              const updatedTerritories = prev.territories.map(t => t.id === target!.id ? { ...t, ownerId: prev.currentPlayerId } : t);
              const updatedPlayers = { ...prev.players };
              updatedPlayers[prev.currentPlayerId].score += target!.points;
              return { ...prev, territories: updatedTerritories, players: updatedPlayers, selectedTerritoryId: null };
            });
            if (Math.random() > 0.5) {
                const botName = gameState.players[gameState.currentPlayerId].name;
                const reaction = await generateChatReaction('فوز بمنطقة', botName);
                addChatMessage(botName, reaction, 'bot');
            }
          }
        }
        setIsBotThinking(false);
        nextTurn();
      }, 3000);
    }
  }, [gameState.currentPlayerId, gameState.phase, activeQuestion, isBotThinking]);

  return (
    <div className="h-screen w-screen flex flex-col bg-[#0f0a05] overflow-hidden text-white">
      {gameState.phase === 'LOBBY' ? (
        <div className="flex-1 flex flex-col items-center justify-center parchment relative">
           <div className="absolute top-0 left-0 w-full h-full bg-black/40"></div>
           <div className="z-10 bg-[#2d1a01] p-10 rounded-3xl border-8 border-[#8b4513] shadow-[0_0_60px_rgba(0,0,0,0.9)] text-center max-w-lg w-full mx-4">
              <img src="https://www.freeiconspng.com/uploads/swords-png-20.png" className="w-32 mx-auto mb-4 sword-glow" alt="logo" />
              <h1 className="text-5xl font-bold arabic-font text-yellow-500 mb-6 drop-shadow-lg">سيف المعرفة أونلاين</h1>
              <div className="mb-8">
                <label className="block text-sm text-gray-400 mb-2">اسم المستخدم</label>
                <input 
                  type="text" 
                  defaultValue={gameState.players[PlayerId.USER].name}
                  className="w-full bg-[#1a0f00] border-2 border-[#8b4513] rounded-xl px-4 py-3 text-center text-xl font-bold text-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>
              <button 
                onClick={handleStartMatchmaking}
                className="w-full bg-yellow-600 hover:bg-yellow-500 py-4 rounded-2xl text-2xl font-bold arabic-font border-b-8 border-yellow-800 transition-all hover:scale-105"
              >
                دخول السيرفر
              </button>
              <div className="mt-4 text-xs text-gray-500 flex items-center justify-center gap-2">
                 <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                 1,402 لاعب متصل الآن
              </div>
           </div>
        </div>
      ) : gameState.phase === 'MATCHMAKING' ? (
        <div className="flex-1 flex flex-col items-center justify-center bg-[#1a0f00]">
           <div className="text-center">
              <div className="w-24 h-24 border-8 border-yellow-600 border-t-transparent rounded-full animate-spin mx-auto mb-8"></div>
              <h2 className="text-3xl font-bold arabic-font text-yellow-500 mb-2">البحث عن خصوم...</h2>
              <p className="text-gray-400">جاري مطابقة مستواك مع لاعبين آخرين</p>
              <div className="mt-12 flex gap-4 justify-center">
                 <div className="w-16 h-16 rounded-full bg-gray-800 border-2 border-yellow-600 overflow-hidden">
                    <img src={gameState.players[PlayerId.USER].avatar} alt="me" />
                 </div>
                 <div className="text-4xl text-yellow-600 self-center">VS</div>
                 <div className="w-16 h-16 rounded-full bg-gray-800 border-2 border-dashed border-gray-600 animate-pulse"></div>
                 <div className="w-16 h-16 rounded-full bg-gray-800 border-2 border-dashed border-gray-600 animate-pulse"></div>
              </div>
           </div>
        </div>
      ) : (
        <div className="flex h-full">
          {/* Main Game Area */}
          <div className="flex-1 flex flex-col border-l-4 border-[#3d2b1f]">
            <Header players={gameState.players} currentPlayerId={gameState.currentPlayerId} phase={gameState.phase} />
            <div className="flex-1 relative bg-[#0a0500]">
              <GameMap 
                territories={gameState.territories} 
                players={gameState.players} 
                onTerritoryClick={handleTerritoryClick}
                selectedTerritoryId={gameState.selectedTerritoryId}
                phase={gameState.phase}
              />
              {isBotThinking && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/80 px-6 py-2 rounded-full border border-yellow-500 animate-pulse z-30">
                  <i className="fa-solid fa-user-astronaut ml-2"></i>
                  {gameState.players[gameState.currentPlayerId].name} يخطط لهجومه...
                </div>
              )}
            </div>
          </div>

          {/* Online Sidebar */}
          <div className="w-80 bg-[#1a0f00] flex flex-col shadow-2xl z-40 border-r-4 border-[#3d2b1f]">
            <div className="p-4 border-b border-[#3d2b1f] bg-[#2d1a01]">
               <h3 className="font-bold text-yellow-500 flex items-center gap-2">
                 <i className="fa-solid fa-comments"></i> الدردشة العالمية
               </h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
               {gameState.chat.map(msg => (
                 <div key={msg.id} className={`text-sm ${msg.type === 'system' ? 'text-center italic text-gray-500 py-1' : ''}`}>
                    {msg.type !== 'system' && (
                      <span className="font-bold" style={{ color: msg.type === 'user' ? '#dc2626' : '#2563eb' }}>{msg.sender}: </span>
                    )}
                    <span className={msg.type === 'system' ? 'text-[10px]' : 'text-gray-300'}>{msg.text}</span>
                 </div>
               ))}
               <div ref={chatEndRef} />
            </div>
            <div className="p-4 border-t border-[#3d2b1f] bg-[#0a0500]">
               <div className="flex items-center gap-2 bg-[#1a0f00] p-2 rounded-lg">
                  <input placeholder="اكتب رسالة..." className="bg-transparent border-none outline-none text-sm w-full" />
                  <i className="fa-solid fa-paper-plane text-yellow-600 cursor-pointer"></i>
               </div>
            </div>
            {/* Online Players List */}
            <div className="p-4 bg-[#2d1a01] border-t border-[#3d2b1f]">
               <h4 className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-tighter">متصلون الآن</h4>
               <div className="space-y-2">
                  {Object.values(gameState.players).map(p => (
                    <div key={p.id} className="flex items-center justify-between">
                       <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-xs font-semibold">{p.name}</span>
                       </div>
                       <span className="text-[10px] bg-[#1a0f00] px-2 py-1 rounded text-yellow-500">Lv.{Math.floor(p.score/200) + 1}</span>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        </div>
      )}

      {activeQuestion && (
        <TriviaPanel question={activeQuestion} onAnswer={handleAnswer} timer={timer} />
      )}
    </div>
  );
};

export default App;
