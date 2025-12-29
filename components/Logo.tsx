
import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true }) => {
  const sizeClasses = {
    sm: { container: 'scale-50', text: 'text-xl' },
    md: { container: 'scale-75 md:scale-100', text: 'text-3xl' },
    lg: { container: 'scale-110 md:scale-150', text: 'text-5xl' },
  };

  return (
    <div className={`flex flex-col items-center transition-all duration-500 ${sizeClasses[size].container}`}>
      <div className="relative group">
        {/* Background Glow */}
        <div className="absolute inset-0 bg-yellow-500/20 blur-3xl rounded-full animate-pulse-slow"></div>
        
        {/* Shield and Swords */}
        <div className="relative flex items-center justify-center">
          {/* Main Shield Backdrop */}
          <div className="absolute w-24 h-24 bg-gradient-to-b from-yellow-600 to-yellow-900 rounded-full border-4 border-yellow-400 shadow-[0_0_20px_rgba(255,215,0,0.5)]"></div>
          
          {/* The Swords */}
          <div className="relative z-10 flex items-center justify-center">
            <i className="fa-solid fa-scimitar text-yellow-100 text-5xl rotate-[45deg] -mr-6 drop-shadow-[0_2px_5px_rgba(0,0,0,0.8)]"></i>
            <i className="fa-solid fa-scimitar text-yellow-100 text-5xl -rotate-[45deg] -ml-6 drop-shadow-[0_2px_5px_rgba(0,0,0,0.8)]"></i>
            
            {/* Center Gem */}
            <div className="absolute w-6 h-6 bg-red-600 rounded-full border-2 border-yellow-300 shadow-inner"></div>
          </div>
        </div>
      </div>

      {showText && (
        <div className="mt-4 text-center">
          <h1 className={`arabic-font font-black tracking-wider ${sizeClasses[size].text} bg-gradient-to-b from-yellow-200 via-yellow-500 to-yellow-800 bg-clip-text text-transparent drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]`}>
            سيف المعرفة
          </h1>
          <div className="h-1 w-32 mx-auto bg-gradient-to-r from-transparent via-yellow-500 to-transparent rounded-full mt-1"></div>
        </div>
      )}
    </div>
  );
};

export default Logo;
