
import React from 'react';
import { Player, PlayerId } from '../types';

interface HeaderProps {
  players: Record<PlayerId, Player>;
  currentPlayerId: PlayerId;
  phase: string;
}

const Header: React.FC<HeaderProps> = ({ players, currentPlayerId, phase }) => {
  return (
    <div className="bg-[#2d1a01] border-b-4 border-[#8b4513] p-3 flex items-center justify-between text-white shadow-2xl relative z-20">
      <div className="flex items-center space-x-reverse space-x-4">
        {Object.values(players).map((p) => (
          <div 
            key={p.id} 
            className={`flex items-center p-2 rounded-xl transition-all duration-300 ${
              currentPlayerId === p.id ? 'bg-[#8b4513] ring-2 ring-yellow-400 scale-105 shadow-lg' : 'bg-[#1a0f00] opacity-70'
            }`}
          >
            <div className="relative">
                <img src={p.avatar} alt={p.name} className="w-10 h-10 rounded-full border-2 border-yellow-500" />
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-[#1a0f00] rounded-full"></div>
            </div>
            <div className="mx-2">
              <div className="text-[10px] font-bold text-gray-400 truncate w-20">{p.name}</div>
              <div className="text-sm font-black text-yellow-400 flex items-center gap-1">
                <i className="fa-solid fa-coins text-[10px]"></i>
                {p.score}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="hidden md:flex flex-col items-center">
        <h1 className="text-xl font-bold arabic-font text-yellow-500 drop-shadow-md">سيف المعرفة أونلاين</h1>
        <div className="flex items-center gap-2">
            <span className="text-[10px] px-2 py-0.5 bg-red-600 rounded-full animate-pulse font-bold">LIVE</span>
            <span className="text-[10px] uppercase font-bold text-gray-400">
                {phase === 'INITIAL_LANDING' ? 'مرحلة الإنزال' : 'مرحلة المعارك'}
            </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
         <div className="bg-[#0a0500] px-3 py-1.5 rounded-full border border-[#8b4513] flex items-center gap-2">
            <i className="fa-solid fa-hourglass-half text-yellow-500 text-xs"></i>
            <span className="text-xs font-bold text-yellow-400">{players[currentPlayerId].name}</span>
         </div>
      </div>
    </div>
  );
};

export default Header;
