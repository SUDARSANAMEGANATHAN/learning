
import React, { useState } from 'react';

interface AuthProps {
  onAuthSuccess: (user: { name: string }) => void;
}

const Auth: React.FC<AuthProps> = ({ onAuthSuccess }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email) {
      onAuthSuccess({ name });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md bg-white rounded-[40px] shadow-2xl shadow-slate-200 overflow-hidden p-12 border border-slate-100">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-emerald-500 text-white rounded-3xl flex items-center justify-center text-4xl mx-auto mb-6 shadow-lg shadow-emerald-100">
             <i className="fas fa-brain"></i>
          </div>
          <h1 className="text-3xl font-black text-slate-800">MindFlow</h1>
          <p className="text-slate-400 mt-2 font-medium">Intelligent Learning Optimization</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-[2px] text-slate-400 ml-1">Full Name</label>
            <div className="relative group">
              <i className="far fa-user absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors"></i>
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex. Jane Doe"
                className="w-full pl-14 pr-6 py-5 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-emerald-500 text-sm font-semibold text-slate-700 placeholder:text-slate-300 transition-all"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-[2px] text-slate-400 ml-1">Email Address</label>
            <div className="relative group">
              <i className="far fa-envelope absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors"></i>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@mindflow.ai"
                className="w-full pl-14 pr-6 py-5 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-emerald-500 text-sm font-semibold text-slate-700 placeholder:text-slate-300 transition-all"
              />
            </div>
          </div>
          <button 
            type="submit"
            className="w-full py-5 bg-emerald-500 text-white rounded-2xl font-black hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-100 hover:shadow-emerald-200 active:scale-95 mt-4"
          >
            Start Learning
          </button>
        </form>

        <div className="mt-12 text-center">
           <p className="text-slate-300 text-xs font-bold leading-relaxed">
             Join 10,000+ students optimizing their study workflow with AI.
           </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
