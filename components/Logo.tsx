
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
        
        {/* Static Radiance Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-yellow-500/10 blur-[50px] rounded-full"></div>
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              background: 'conic-gradient(from 45deg, transparent, rgba(255,215,0,0.3), transparent 60deg)',
            }}
          ></div>
        </div>

        {/* Main Icon Group (Static) */}
        <div className="relative z-10 flex items-center justify-center">
          
          {/* Ancient Scroll Backdrop */}
          <div className="absolute w-32 h-24 bg-[#fdf2d5] border-x-8 border-[#8b4513] rounded-sm shadow-2xl overflow-hidden flex flex-col items-center justify-center">
            <div className="w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/old-map.png')] absolute inset-0"></div>
            {/* Scroll Lines (Knowledge) */}
            <div className="space-y-1 z-10 opacity-40">
              <div className="w-16 h-1 bg-[#8b4513] rounded-full"></div>
              <div className="w-20 h-1 bg-[#8b4513] rounded-full"></div>
              <div className="w-12 h-1 bg-[#8b4513] rounded-full"></div>
            </div>
          </div>

          {/* The Sword (Static) */}
          <div className="relative z-20 flex flex-col items-center">
            {/* Blade */}
            <div className="w-4 h-36 bg-gradient-to-r from-gray-300 via-white to-gray-300 rounded-t-full shadow-[0_0_10px_rgba(255,255,255,0.4)] border-x border-gray-400"></div>
            {/* Crossguard */}
            <div className="w-16 h-4 -mt-10 bg-gradient-to-b from-yellow-400 to-yellow-700 rounded-full border-2 border-yellow-900 shadow-lg relative">
               {/* Center Gem */}
               <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-red-600 rounded-full border border-yellow-200 shadow-[inset_0_0_5px_rgba(0,0,0,0.5)]"></div>
            </div>
            {/* Hilt */}
            <div className="w-4 h-10 bg-[#4a2e19] border-x-2 border-yellow-600 rounded-b-lg"></div>
            {/* Pommel */}
            <div className="w-6 h-6 -mt-1 bg-yellow-600 rounded-full border-2 border-yellow-400 shadow-md"></div>
          </div>

          {/* Static Decorative Sparkles */}
          <div className="absolute top-0 right-0 text-yellow-300 opacity-60">
            <i className="fa-solid fa-star text-sm"></i>
          </div>
          <div className="absolute bottom-10 left-0 text-yellow-300 opacity-40">
            <i className="fa-solid fa-star text-xs"></i>
          </div>
        </div>
      </div>

      {showText && (
        <div className="mt-2 text-center relative">
          <h1 className="arabic-font font-black text-5xl tracking-tight leading-tight px-4
            bg-gradient-to-b from-yellow-200 via-yellow-500 to-yellow-800 bg-clip-text text-transparent
            drop-shadow-[0_2px_0_rgba(139,69,19,1)] drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)]
          ">
            سيف المعرفة
          </h1>
          <div className="h-1 w-48 mx-auto mt-2 rounded-full bg-gradient-to-r from-transparent via-yellow-600/50 to-transparent"></div>
          
          <div className="mt-1 text-[10px] font-bold text-yellow-700/60 tracking-[0.4em] uppercase">
            BATTLE OF MINDS
          </div>
        </div>
      )}
    </div>
  );
};

export default Logo;
