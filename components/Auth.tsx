
import React, { useState } from 'react';
import { UserAccount } from '../types';
import Logo from './Logo';

interface AuthProps {
  onLogin: (user: UserAccount) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState('https://picsum.photos/seed/warrior/100/100');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const users = JSON.parse(localStorage.getItem('sword_knowledge_users') || '{}');

    if (isRegister) {
      if (users[username]) {
        setError('اسم المستخدم موجود بالفعل!');
        return;
      }
      const newUser: UserAccount = {
        username,
        avatar,
        totalScore: 0,
        level: 1,
        wins: 0,
        gamesPlayed: 0
      };
      users[username] = { ...newUser, password };
      localStorage.setItem('sword_knowledge_users', JSON.stringify(users));
      localStorage.setItem('sword_knowledge_current', JSON.stringify(newUser));
      onLogin(newUser);
    } else {
      const user = users[username];
      if (user && user.password === password) {
        const { password: _, ...userData } = user;
        localStorage.setItem('sword_knowledge_current', JSON.stringify(userData));
        onLogin(userData);
      } else {
        setError('خطأ في اسم المستخدم أو كلمة المرور');
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center parchment relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-black/50"></div>
      
      {/* Background Ambience */}
      <div className="absolute top-10 left-10 text-yellow-600 opacity-20 text-9xl animate-pulse-slow">
        <i className="fa-solid fa-shield-halved"></i>
      </div>
      <div className="absolute bottom-10 right-10 text-yellow-600 opacity-20 text-9xl animate-pulse-slow delay-700">
        <i className="fa-solid fa-chess-knight"></i>
      </div>

      <div className="z-10 bg-[#2d1a01] p-8 rounded-3xl border-8 border-[#8b4513] shadow-[0_0_50px_rgba(0,0,0,0.9)] w-full max-w-md mx-4 transform transition-all hover:scale-[1.01]">
        <div className="text-center mb-6">
          <Logo size="md" />
          <p className="text-yellow-500/60 text-xs mt-2 font-bold uppercase tracking-widest">
            {isRegister ? 'أنشئ حساباً جديداً للمحارب' : 'سجل دخولك لبدء المعركة'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1 mr-1">اسم المستخدم</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-yellow-600/50">
                <i className="fa-solid fa-user"></i>
              </span>
              <input 
                required
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-[#1a0f00] border-2 border-[#8b4513] rounded-xl pl-4 pr-10 py-3 text-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1 mr-1">كلمة المرور</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-yellow-600/50">
                <i className="fa-solid fa-lock"></i>
              </span>
              <input 
                required
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#1a0f00] border-2 border-[#8b4513] rounded-xl pl-4 pr-10 py-3 text-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all"
              />
            </div>
          </div>

          {isRegister && (
            <div className="animate-fade-in">
               <label className="block text-xs font-bold text-gray-500 mb-2 mr-1">اختر هويتك البصرية</label>
               <div className="flex gap-3 justify-center bg-[#1a0f00] p-3 rounded-2xl border border-[#8b4513]">
                  {['warrior', 'commander', 'sage', 'knight'].map(s => (
                    <img 
                      key={s}
                      src={`https://picsum.photos/seed/${s}/100/100`} 
                      onClick={() => setAvatar(`https://picsum.photos/seed/${s}/100/100`)}
                      className={`w-12 h-12 rounded-full cursor-pointer border-2 transition-all duration-300 ${avatar.includes(s) ? 'border-yellow-500 scale-125 shadow-[0_0_15px_rgba(234,179,8,0.5)]' : 'border-transparent opacity-50 grayscale hover:grayscale-0 hover:opacity-100'}`}
                      alt={s}
                    />
                  ))}
               </div>
            </div>
          )}

          {error && <p className="text-red-500 text-xs text-center font-bold bg-red-900/20 py-2 rounded-lg border border-red-900/50">{error}</p>}

          <button 
            type="submit"
            className="w-full bg-gradient-to-b from-yellow-500 to-yellow-700 hover:from-yellow-400 hover:to-yellow-600 py-4 rounded-xl text-xl font-bold arabic-font border-b-4 border-yellow-900 shadow-lg transform transition-all active:scale-95 active:border-b-0"
          >
            {isRegister ? 'إنشاء حساب جديد' : 'تسجيل الدخول'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => setIsRegister(!isRegister)}
            className="text-yellow-600/80 text-sm font-bold hover:text-yellow-400 transition-colors"
          >
            {isRegister ? 'هل تملك حساباً بالفعل؟ سجل دخولك' : 'جديد في المملكة؟ انضم إلينا الآن'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
