
import React, { useState } from 'react';
import { UserAccount } from '../types';
import Logo from './Logo';
import { UserDataServer } from '../services/db';

interface AuthProps {
  onLogin: (user: UserAccount) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [avatar, setAvatar] = useState('https://picsum.photos/seed/warrior/100/100');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        const newUser = await UserDataServer.register(username, password, avatar);
        onLogin(newUser);
      } else {
        const user = await UserDataServer.login(username, password, remember);
        onLogin(user);
      }
    } catch (err: any) {
      setError(err.message || 'حدث خطأ ما');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center parchment relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-black/50"></div>
      
      <div className="z-10 bg-[#2d1a01] p-8 rounded-3xl border-8 border-[#8b4513] shadow-[0_0_50px_rgba(0,0,0,0.9)] w-full max-w-md mx-4 transition-all">
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
                disabled={loading}
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-[#1a0f00] border-2 border-[#8b4513] rounded-xl pl-4 pr-10 py-3 text-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all disabled:opacity-50"
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
                disabled={loading}
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#1a0f00] border-2 border-[#8b4513] rounded-xl pl-4 pr-10 py-3 text-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all disabled:opacity-50"
              />
            </div>
          </div>

          <div className="flex items-center justify-between px-1">
             <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={remember} 
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-4 h-4 rounded border-yellow-600 bg-[#1a0f00] text-yellow-600 focus:ring-yellow-500"
                />
                <span className="text-xs text-gray-400 font-bold">تذكرني</span>
             </label>
             {!isRegister && (
               <button type="button" className="text-xs text-yellow-700 hover:text-yellow-600 font-bold">نسيت كلمة السر؟</button>
             )}
          </div>

          {isRegister && (
            <div className="animate-fade-in">
               <label className="block text-xs font-bold text-gray-500 mb-2 mr-1">اختر هويتك البصرية</label>
               <div className="flex gap-3 justify-center bg-[#1a0f00] p-3 rounded-2xl border border-[#8b4513]">
                  {['warrior', 'commander', 'sage', 'knight'].map(s => (
                    <img 
                      key={s}
                      src={`https://picsum.photos/seed/${s}/100/100`} 
                      onClick={() => !loading && setAvatar(`https://picsum.photos/seed/${s}/100/100`)}
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
            disabled={loading}
            className="w-full bg-gradient-to-b from-yellow-500 to-yellow-700 hover:from-yellow-400 hover:to-yellow-600 py-4 rounded-xl text-xl font-bold arabic-font border-b-4 border-yellow-900 shadow-lg transform transition-all active:scale-95 active:border-b-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <i className="fa-solid fa-sword animate-spin"></i> جارٍ الاتصال...
              </span>
            ) : (
              isRegister ? 'إنشاء حساب جديد' : 'دخول المعركة'
            )}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-yellow-900/30 pt-4">
          <button 
            disabled={loading}
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
