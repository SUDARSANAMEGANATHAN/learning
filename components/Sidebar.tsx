
import React from 'react';
import { ViewState } from '../types';

interface SidebarProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  onLogout: () => void;
  userName: string;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, onLogout, userName }) => {
  const navItems = [
    { id: 'dashboard' as ViewState, label: 'Dashboard', icon: 'fa-th-large' },
    { id: 'documents' as ViewState, label: 'Documents', icon: 'fa-file-alt' },
    { id: 'flashcards-view' as ViewState, label: 'Flashcards', icon: 'fa-book-open' },
    { id: 'profile' as ViewState, label: 'Profile', icon: 'fa-user' },
  ];

  return (
    <aside className="w-72 bg-white border-r border-slate-100 flex flex-col h-full z-50">
      <div className="p-8">
        <div className="flex items-center gap-3 text-emerald-600 font-bold text-2xl mb-12">
          <div className="w-10 h-10 bg-emerald-500 text-white rounded-xl flex items-center justify-center">
            <i className="fas fa-brain"></i>
          </div>
          <span className="text-slate-800">MindFlow</span>
        </div>

        <nav className="space-y-3">
          {navItems.map((item) => {
            const isActive = currentView === item.id || (item.id === 'documents' && currentView === 'study-room');
            return (
              <button 
                key={item.id}
                onClick={() => setView(item.id)}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-200 group ${
                  isActive 
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-100 font-semibold' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                }`}
              >
                <div className={`text-xl transition-colors ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}`}>
                  <i className={`fas ${item.icon}`}></i>
                </div>
                <span className="text-base">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-8">
        <div className="bg-slate-50 p-4 rounded-2xl flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold shadow-inner">
            {userName[0]}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-bold text-slate-800 truncate">{userName}</p>
            <p className="text-xs text-slate-400 truncate">Pro Plan</p>
          </div>
        </div>
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-5 py-3 rounded-xl text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-all text-sm font-bold"
        >
          <i className="fas fa-sign-out-alt"></i>
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
