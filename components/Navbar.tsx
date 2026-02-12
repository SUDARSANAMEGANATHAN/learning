
import React from 'react';
import { User } from '../types';

interface NavbarProps {
  user: User;
}

const Navbar: React.FC<NavbarProps> = ({ user }) => {
  return (
    <header className="h-20 bg-white border-b border-slate-50 flex items-center justify-between px-10 sticky top-0 z-40">
      <div className="flex items-center gap-2 text-slate-400">
        <i className="fas fa-search"></i>
        <input 
          type="text" 
          placeholder="Search your library..." 
          className="bg-transparent border-none focus:ring-0 text-sm font-medium w-64 placeholder:text-slate-300"
        />
      </div>

      <div className="flex items-center gap-8">
        <button className="relative w-10 h-10 flex items-center justify-center text-slate-400 hover:text-emerald-500 transition-colors">
          <i className="far fa-bell text-xl"></i>
          <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full border-2 border-white"></span>
        </button>

        <div className="flex items-center gap-4 pl-8 border-l border-slate-100">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-slate-800 leading-none">{user.name}</p>
            <p className="text-xs text-slate-400 font-medium mt-1">{user.email}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center overflow-hidden border-2 border-slate-50">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-lg font-black text-emerald-500">{user.name[0]}</span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
