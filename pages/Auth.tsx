
import React, { useState } from 'react';
import { User } from '../types';

interface AuthProps {
  onAuthSuccess: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onAuthSuccess }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API delay
    setTimeout(() => {
      onAuthSuccess({
        id: Math.random().toString(36).substr(2, 9),
        name: mode === 'register' ? name : 'Jane Doe',
        email,
      });
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8 font-sans">
      <div className="w-full max-w-[500px] bg-white rounded-[60px] shadow-2xl shadow-slate-200 overflow-hidden p-16 border border-slate-100 relative">
        <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500"></div>
        
        <div className="text-center mb-16">
          <div className="w-20 h-20 bg-emerald-500 text-white rounded-[32px] flex items-center justify-center text-4xl mx-auto mb-8 shadow-xl shadow-emerald-100">
             <i className="fas fa-brain"></i>
          </div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight">MindFlow</h1>
          <p className="text-slate-400 mt-3 font-medium text-lg leading-relaxed">
             {mode === 'login' ? 'Welcome back to your study lab.' : 'Start your intelligent learning journey.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {mode === 'register' && (
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[3px] text-slate-300 ml-2">Full Name</label>
              <div className="relative group">
                <i className="far fa-user absolute left-6 top-1/2 -translate-y-1/2 text-slate-200 group-focus-within:text-emerald-500 transition-colors"></i>
                <input 
                  type="text" required value={name} onChange={e => setName(e.target.value)}
                  placeholder="Ex. Jane Doe"
                  className="w-full pl-16 pr-8 py-6 rounded-[28px] bg-slate-50 border-none focus:ring-2 focus:ring-emerald-500 text-base font-bold text-slate-700 placeholder:text-slate-200 transition-all"
                />
              </div>
            </div>
          )}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[3px] text-slate-300 ml-2">Email Address</label>
            <div className="relative group">
              <i className="far fa-envelope absolute left-6 top-1/2 -translate-y-1/2 text-slate-200 group-focus-within:text-emerald-500 transition-colors"></i>
              <input 
                type="email" required value={email} onChange={e => setEmail(e.target.value)}
                placeholder="jane@mindflow.ai"
                className="w-full pl-16 pr-8 py-6 rounded-[28px] bg-slate-50 border-none focus:ring-2 focus:ring-emerald-500 text-base font-bold text-slate-700 placeholder:text-slate-200 transition-all"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[3px] text-slate-300 ml-2">Password</label>
            <div className="relative group">
              <i className="fas fa-lock absolute left-6 top-1/2 -translate-y-1/2 text-slate-200 group-focus-within:text-emerald-500 transition-colors"></i>
              <input 
                type="password" required value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-16 pr-8 py-6 rounded-[28px] bg-slate-50 border-none focus:ring-2 focus:ring-emerald-500 text-base font-bold text-slate-700 placeholder:text-slate-200 transition-all"
              />
            </div>
          </div>
          
          <button 
            type="submit"
            disabled={loading}
            className="w-full py-7 bg-emerald-500 text-white rounded-[32px] font-black text-xl hover:bg-emerald-600 transition-all shadow-2xl shadow-emerald-100 hover:shadow-emerald-200 active:scale-95 disabled:opacity-50 mt-4"
          >
            {loading ? <i className="fas fa-spinner fa-spin mr-3"></i> : null}
            {mode === 'login' ? 'Enter Dashboard' : 'Create Account'}
          </button>
        </form>

        <div className="mt-12 text-center">
           <button 
             onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
             className="text-slate-400 text-sm font-bold hover:text-emerald-600 transition-colors"
           >
             {mode === 'login' ? "New here? Create an account" : "Already registered? Sign in"}
           </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
