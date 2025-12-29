
import React from 'react';
import { Player } from '../types';
import Logo from './Logo';

interface HeaderProps {
  players: Record<string, Player>;
  currentPlayerId: string | undefined;
  phase: string;
}

const Header: React.FC<HeaderProps> = ({ players, currentPlayerId, phase }) => {
  const playerList = Object.values(players);

  return (
    <div className="bg-[#2d1a01] border-b-4 border-[#8b4513] p-3 flex items-center justify-between text-white shadow-2xl relative z-20">
      <div className="flex items-center space-x-reverse space-x-4">
        {/* Miniature Brand Logo */}
        <div className="flex items-center gap-2 border-l-2 border-[#8b4513] pl-4 ml-4">
          <Logo size="sm" showText={false} />
          <div className="hidden lg:block">
            <h1 className="arabic-font text-sm font-bold text-yellow-500 leading-none">سيف</h1>
            <h1 className="arabic-font text-sm font-bold text-yellow-500 leading-none">المعرفة</h1>
          </div>
        </div>

        {playerList.map((p) => (
          <div 
            key={p.id} 
            className={`flex items-center p-2 rounded-xl transition-all duration-300 ${
              currentPlayerId === p.id ? 'bg-gradient-to-r from-[#8b4513] to-[#5d4037] ring-2 ring-yellow-400 scale-105 shadow-xl' : 'bg-[#1a0f00] opacity-70'
            }`}
          >
            <div className="relative">
                <img src={p.avatar} alt={p.name} className="w-8 h-8 rounded-full border-2 border-yellow-500" />
                <div className={`absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-green-500 border-2 border-[#1a0f00] rounded-full ${currentPlayerId === p.id ? 'animate-pulse' : ''}`}></div>
            </div>
            <div className="mx-2">
              <div className="text-[10px] font-bold text-gray-400 truncate w-16">{p.name}</div>
              <div className="text-xs font-black text-yellow-400 flex items-center gap-1">
                <i className="fa-solid fa-coins text-[8px]"></i>
                {p.score}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="hidden md:flex flex-col items-center">
        <div className="flex items-center gap-3">
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-yellow-600"></div>
            <span className="text-[10px] uppercase font-bold text-yellow-500/80 tracking-widest px-2">
                {phase === 'INITIAL_LANDING' ? 'مرحلة الإنزال' : 'مرحلة المعارك'}
            </span>
            <div className="h-px w-8 bg-gradient-to-l from-transparent to-yellow-600"></div>
        </div>
      </div>

      <div className="flex items-center gap-3">
         <div className="bg-[#0a0500] px-4 py-1.5 rounded-full border-2 border-[#8b4513] flex items-center gap-2 shadow-inner">
            <div className="relative">
              <i className="fa-solid fa-crown text-yellow-500 text-xs"></i>
              <div className="absolute inset-0 blur-sm bg-yellow-500/20 rounded-full"></div>
            </div>
            <span className="text-xs font-bold text-yellow-400">
              {currentPlayerId ? players[currentPlayerId]?.name : 'في انتظار المحاربين'}
            </span>
         </div>
      </div>
    </div>
  );
};

export default Header;
