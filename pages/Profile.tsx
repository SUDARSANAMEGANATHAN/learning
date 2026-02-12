
import React, { useState } from 'react';
import { User } from '../types';

interface ProfileProps {
  user: User;
  onUpdateUser: (u: User) => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onUpdateUser }) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [isSaving, setIsSaving] = useState(false);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      onUpdateUser({ ...user, name, email });
      setIsSaving(false);
    }, 1000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-12">
      <header>
        <h1 className="text-4xl font-black text-slate-800 tracking-tight">Profile Settings</h1>
        <p className="text-slate-400 font-medium mt-2">Manage your account information and preferences.</p>
      </header>

      <div className="grid grid-cols-1 gap-8">
        <div className="bg-white p-12 rounded-[50px] border border-slate-100 shadow-sm space-y-12">
          <div className="flex items-center gap-10">
             <div className="relative group">
                <div className="w-32 h-32 bg-emerald-50 rounded-[40px] flex items-center justify-center text-4xl text-emerald-500 font-black border-4 border-white shadow-xl overflow-hidden">
                   {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : user.name[0]}
                </div>
                <button className="absolute -bottom-2 -right-2 w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-xl hover:bg-emerald-500 transition-colors">
                   <i className="fas fa-camera"></i>
                </button>
             </div>
             <div>
                <h2 className="text-2xl font-black text-slate-800">{user.name}</h2>
                <p className="text-slate-400 font-bold text-sm">MindFlow Pro Member</p>
                <div className="mt-4 flex gap-2">
                   <span className="px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-wider">Active Subscription</span>
                </div>
             </div>
          </div>

          <form onSubmit={handleUpdate} className="space-y-8">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                   <input 
                      type="text" 
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full px-8 py-5 rounded-3xl bg-slate-50 border-none focus:ring-2 focus:ring-emerald-500 text-sm font-semibold"
                   />
                </div>
                <div className="space-y-3">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                   <input 
                      type="email" 
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full px-8 py-5 rounded-3xl bg-slate-50 border-none focus:ring-2 focus:ring-emerald-500 text-sm font-semibold"
                   />
                </div>
             </div>

             <div className="pt-8 border-t border-slate-50">
                <div className="flex justify-between items-center">
                   <div>
                      <h4 className="font-bold text-slate-800">Change Password</h4>
                      <p className="text-xs text-slate-400 font-medium">Keep your account secure with a strong password.</p>
                   </div>
                   <button type="button" className="px-6 py-3 bg-white border border-slate-200 text-slate-500 rounded-2xl text-xs font-bold hover:bg-slate-50 transition-all">Update Security</button>
                </div>
             </div>

             <button 
                disabled={isSaving}
                className="w-full py-5 bg-emerald-500 text-white rounded-3xl font-black shadow-xl shadow-emerald-50 hover:bg-emerald-600 transition-all disabled:opacity-50"
             >
                {isSaving ? <i className="fas fa-spinner fa-spin mr-2"></i> : null}
                Save Profile Changes
             </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
