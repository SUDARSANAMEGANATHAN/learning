
import React from 'react';
import { AppView } from '../types';

interface SidebarProps {
  currentView: AppView;
  setView: (view: AppView) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'fa-chart-pie' },
    { id: 'documents', label: 'Documents', icon: 'fa-file-lines' },
    { id: 'flashcards', label: 'Flashcards', icon: 'fa-layer-group' },
    { id: 'profile', label: 'Profile', icon: 'fa-user-circle' },
  ];

  return (
    <aside className="w-72 bg-white border-r border-slate-100 flex flex-col h-full shrink-0">
      <div className="p-8">
        <div className="flex items-center gap-3 text-emerald-600 font-black text-2xl mb-12 tracking-tight">
          <div className="w-10 h-10 bg-emerald-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-emerald-100">
            <i className="fas fa-brain"></i>
          </div>
          <span>MindFlow</span>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id as AppView)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all font-semibold ${
                currentView === item.id || (item.id === 'documents' && currentView === 'study-room')
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-50'
                  : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
              }`}
            >
              <i className={`fas ${item.icon} text-lg`}></i>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-8 border-t border-slate-50">
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-rose-400 hover:bg-rose-50 hover:text-rose-500 transition-all font-bold"
        >
          <i className="fas fa-arrow-right-from-bracket text-lg"></i>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
