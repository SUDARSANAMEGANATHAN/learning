
import React, { useState, useEffect } from 'react';
import { Document, ViewState, UserProgress } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import StudyRoom from './pages/StudyRoom';
import Auth from './pages/Auth';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('auth');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [activeDocId, setActiveDocId] = useState<string | null>(null);
  const [user, setUser] = useState<{ name: string } | null>(null);

  useEffect(() => {
    const savedDocs = localStorage.getItem('mindflow_docs');
    if (savedDocs) setDocuments(JSON.parse(savedDocs));
    
    const savedUser = localStorage.getItem('mindflow_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setView('dashboard');
    }
  }, []);

  const saveDocs = (newDocs: Document[]) => {
    setDocuments(newDocs);
    localStorage.setItem('mindflow_docs', JSON.stringify(newDocs));
  };

  const handleLogout = () => {
    localStorage.removeItem('mindflow_user');
    setUser(null);
    setView('auth');
  };

  const activeDoc = documents.find(d => d.id === activeDocId);

  if (view === 'auth') {
    return <Auth onAuthSuccess={(u) => {
      setUser(u);
      localStorage.setItem('mindflow_user', JSON.stringify(u));
      setView('dashboard');
    }} />;
  }

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      <Sidebar 
        currentView={view} 
        setView={(v) => {
          if (v === 'documents') setView('dashboard');
          else setView(v);
        }} 
        onLogout={handleLogout} 
        userName={user?.name || 'Student'}
      />
      
      <main className="flex-1 overflow-hidden relative">
        {(view === 'dashboard' || view === 'documents') && (
          <Dashboard 
            documents={documents} 
            onUpload={(doc) => saveDocs([...documents, doc])}
            onSelectDoc={(id) => {
              setActiveDocId(id);
              setView('study-room');
            }}
            onDeleteDoc={(id) => saveDocs(documents.filter(d => d.id !== id))}
          />
        )}
        
        {view === 'study-room' && activeDoc && (
          <StudyRoom 
            doc={activeDoc} 
            onUpdateDoc={(updatedDoc) => {
              saveDocs(documents.map(d => d.id === updatedDoc.id ? updatedDoc : d));
            }}
            onBack={() => setView('dashboard')}
          />
        )}

        {(view === 'flashcards-view' || view === 'profile') && (
           <div className="flex flex-col items-center justify-center h-full">
             <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-3xl flex items-center justify-center text-4xl mb-6">
               <i className={`fas ${view === 'flashcards-view' ? 'fa-book-open' : 'fa-user-circle'}`}></i>
             </div>
             <h2 className="text-2xl font-bold text-slate-800 mb-2">{view === 'flashcards-view' ? 'Flashcard Library' : 'Your Profile'}</h2>
             <p className="text-slate-400 max-w-sm text-center">This feature is coming soon to your intelligent learning optimization system.</p>
             <button 
                onClick={() => setView('dashboard')}
                className="mt-8 px-8 py-3 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 transition-all"
             >
               Back to Dashboard
             </button>
           </div>
        )}

        {!activeDoc && view === 'study-room' && (
           <div className="flex flex-col items-center justify-center h-full">
             <div className="text-slate-200 text-6xl mb-4"><i className="fas fa-file-invoice"></i></div>
             <p className="text-slate-500 font-bold">Document not found</p>
             <button 
                onClick={() => setView('dashboard')}
                className="mt-4 px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
             >
               Go to Dashboard
             </button>
           </div>
        )}
      </main>
    </div>
  );
};

export default App;
