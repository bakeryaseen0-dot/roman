
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
      style={{ transform: `scale(${currentScale})`, transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
    >
      <div className="relative group flex items-center justify-center w-48 h-48">
        
        {/* Divine Radiance / God Rays */}
        <div className="absolute inset-0 animate-pulse-slow">
          <div className="absolute inset-0 bg-yellow-500/20 blur-[60px] rounded-full"></div>
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              background: 'conic-gradient(from 0deg, transparent, rgba(255,215,0,0.4), transparent 40deg)',
              animation: 'spin 20s linear infinite'
            }}
          ></div>
        </div>

        {/* The Main Icon Group with Floating Animation */}
        <div className="relative z-10 animate-[float_4s_ease-in-out_infinite] flex items-center justify-center">
          
          {/* Ancient Scroll Backdrop */}
          <div className="absolute w-32 h-24 bg-[#fdf2d5] border-x-8 border-[#8b4513] rounded-sm shadow-2xl overflow-hidden flex flex-col items-center justify-center">
            <div className="w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/old-map.png')] absolute inset-0"></div>
            {/* Scroll Lines (Knowledge) */}
            <div className="space-y-1 z-10">
              <div className="w-16 h-1 bg-[#8b4513]/20 rounded-full"></div>
              <div className="w-20 h-1 bg-[#8b4513]/20 rounded-full"></div>
              <div className="w-12 h-1 bg-[#8b4513]/20 rounded-full"></div>
            </div>
          </div>

          {/* The Sword (Vertical and Regal) */}
          <div className="relative z-20 flex flex-col items-center">
            {/* Blade */}
            <div className="w-4 h-36 bg-gradient-to-r from-gray-300 via-white to-gray-300 rounded-t-full shadow-[0_0_15px_rgba(255,255,255,0.8)] border-x border-gray-400"></div>
            {/* Crossguard */}
            <div className="w-16 h-4 -mt-10 bg-gradient-to-b from-yellow-400 to-yellow-700 rounded-full border-2 border-yellow-900 shadow-lg relative">
               {/* Center Gem */}
               <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-red-600 rounded-full border border-yellow-200 shadow-[inset_0_0_5px_rgba(0,0,0,0.5)]"></div>
            </div>
            {/* Hilt */}
            <div className="w-4 h-10 bg-[#4a2e19] border-x-2 border-yellow-600 rounded-b-lg"></div>
            {/* Pommel */}
            <div className="w-6 h-6 -mt-1 bg-yellow-600 rounded-full border-2 border-yellow-400"></div>
          </div>

          {/* Sparkles */}
          <div className="absolute top-0 right-0 animate-ping text-yellow-300">
            <i className="fa-solid fa-sparkles text-sm"></i>
          </div>
          <div className="absolute bottom-10 left-0 animate-ping [animation-delay:1s] text-yellow-300">
            <i className="fa-solid fa-sparkles text-xs"></i>
          </div>
        </div>
      </div>

      {showText && (
        <div className="mt-2 text-center relative">
          <h1 className="arabic-font font-black text-5xl tracking-tight leading-tight px-4
            bg-gradient-to-b from-yellow-100 via-yellow-500 to-yellow-900 bg-clip-text text-transparent
            drop-shadow-[0_2px_0_rgba(139,69,19,1)] drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]
            before:content-['سيف_المعرفة'] before:absolute before:inset-0 before:text-transparent before:bg-gradient-to-r before:from-transparent before:via-white/50 before:to-transparent before:bg-clip-text before:animate-[sheen_3s_infinite]
          ">
            سيف المعرفة
          </h1>
          <div className="h-1.5 w-48 mx-auto mt-2 rounded-full bg-gradient-to-r from-transparent via-yellow-500 to-transparent shadow-[0_0_10px_rgba(234,179,8,0.5)]"></div>
          
          <div className="mt-2 text-[10px] font-bold text-yellow-700/80 tracking-[0.4em] uppercase">
            Battle of Minds
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes sheen {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}} />
    </div>
  );
};

export default Logo;
