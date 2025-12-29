
import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true }) => {
  const sizeScale = {
    sm: 0.5,
    md: 1,
    lg: 1.5,
  };

  const currentScale = sizeScale[size];

  return (
    <div 
      className="flex flex-col items-center justify-center select-none"
      style={{ transform: `scale(${currentScale})` }}
    >
      <div className="relative flex items-center justify-center w-48 h-48">
        
        {/* Outer Gold Ring (Crest) */}
        <div className="absolute w-44 h-44 rounded-full border-4 border-yellow-600 shadow-[0_0_20px_rgba(0,0,0,0.5)] bg-gradient-to-b from-yellow-700 via-yellow-900 to-black"></div>
        <div className="absolute w-40 h-40 rounded-full border-2 border-yellow-500/30"></div>

        {/* The Open Book (Knowledge) */}
        <div className="relative z-10 flex flex-col items-center">
            <div className="relative w-28 h-20 bg-[#f4e4bc] rounded-sm shadow-xl flex border-x-4 border-yellow-800">
                {/* Book Pages Detail */}
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-black/20"></div>
                <div className="w-1/2 flex flex-col items-center justify-center p-2 opacity-30">
                    <div className="w-full h-1 bg-black/40 mb-1 rounded-full"></div>
                    <div className="w-4/5 h-1 bg-black/40 mb-1 rounded-full"></div>
                    <div className="w-full h-1 bg-black/40 rounded-full"></div>
                </div>
                <div className="w-1/2 flex flex-col items-center justify-center p-2 opacity-30">
                    <div className="w-full h-1 bg-black/40 mb-1 rounded-full"></div>
                    <div className="w-4/5 h-1 bg-black/40 mb-1 rounded-full"></div>
                    <div className="w-full h-1 bg-black/40 rounded-full"></div>
                </div>
            </div>

            {/* The Ceremonial Sword (Piercing the emblem background) */}
            <div className="absolute -top-12 flex flex-col items-center drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)]">
                {/* Sword Tip */}
                <div className="w-3 h-40 bg-gradient-to-r from-gray-400 via-white to-gray-400 rounded-t-full border-x border-gray-500"></div>
                {/* Hilt/Guard */}
                <div className="w-16 h-4 -mt-4 bg-gradient-to-b from-yellow-400 to-yellow-700 rounded-full border border-yellow-900 flex justify-center items-center">
                    <div className="w-2 h-2 bg-red-600 rounded-full border border-yellow-200 shadow-inner"></div>
                </div>
                {/* Grip */}
                <div className="w-4 h-8 bg-yellow-950 border-x border-yellow-600"></div>
                {/* Pommel */}
                <div className="w-6 h-6 -mt-1 bg-yellow-600 rounded-full border border-yellow-400 shadow-lg"></div>
            </div>
        </div>

        {/* Decorative Laurels (Optional Look) */}
        <div className="absolute inset-0 flex items-center justify-between px-2 text-yellow-600/40 text-4xl">
            <i className="fa-solid fa-leaf rotate-[-45deg]"></i>
            <i className="fa-solid fa-leaf rotate-[45deg]"></i>
        </div>
      </div>

      {showText && (
        <div className="mt-4 text-center relative">
          <h1 className="arabic-font font-black text-6xl tracking-tight leading-none px-4
            bg-gradient-to-b from-yellow-100 via-yellow-500 to-yellow-800 bg-clip-text text-transparent
            drop-shadow-[0_3px_1px_rgba(0,0,0,0.8)]
          ">
            سيف المعرفة
          </h1>
          <div className="flex items-center justify-center gap-2 mt-2">
            <div className="h-px w-10 bg-gradient-to-r from-transparent to-yellow-600"></div>
            <div className="text-[10px] font-bold text-yellow-600 tracking-widest uppercase">Ancient Wisdom</div>
            <div className="h-px w-10 bg-gradient-to-l from-transparent to-yellow-600"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Logo;
