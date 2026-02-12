
import React, { useState, useEffect } from 'react';
import { User, Document, FlashcardSet, QuizAttempt, Activity, AppView } from './types';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Documents from './pages/Documents';
import Flashcards from './pages/Flashcards';
import Profile from './pages/Profile';
import StudyRoom from './pages/StudyRoom';
import Auth from './pages/Auth';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('auth');
  const [user, setUser] = useState<User | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [flashcardSets, setFlashcardSets] = useState<FlashcardSet[]>([]);
  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [activeDocId, setActiveDocId] = useState<string | null>(null);

  useEffect(() => {
    // Initial data load from localStorage to simulate DB
    const storedUser = localStorage.getItem('mindflow_user');
    const storedDocs = localStorage.getItem('mindflow_docs');
    const storedSets = localStorage.getItem('mindflow_sets');
    const storedQuizzes = localStorage.getItem('mindflow_quizzes');
    const storedActivities = localStorage.getItem('mindflow_activities');

    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setView('dashboard');
    }
    if (storedDocs) setDocuments(JSON.parse(storedDocs));
    if (storedSets) setFlashcardSets(JSON.parse(storedSets));
    if (storedQuizzes) setQuizAttempts(JSON.parse(storedQuizzes));
    if (storedActivities) setActivities(JSON.parse(storedActivities));
  }, []);

  const persist = (key: string, data: any) => {
    localStorage.setItem(`mindflow_${key}`, JSON.stringify(data));
  };

  const addActivity = (type: Activity['type'], description: string) => {
    const newActivity: Activity = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      description,
      timestamp: new Date().toISOString(),
    };
    const updated = [newActivity, ...activities].slice(0, 20);
    setActivities(updated);
    persist('activities', updated);
  };

  const handleAuth = (u: User) => {
    setUser(u);
    persist('user', u);
    setView('dashboard');
    addActivity('document_uploaded', `User ${u.name} logged in.`);
  };

  const handleLogout = () => {
    localStorage.removeItem('mindflow_user');
    setUser(null);
    setView('auth');
  };

  const handleAddDocument = (doc: Document) => {
    const updated = [...documents, doc];
    setDocuments(updated);
    persist('documents', updated);
    addActivity('document_uploaded', `Uploaded document: ${doc.name}`);
  };

  const activeDoc = documents.find(d => d.id === activeDocId);

  if (!user || view === 'auth') {
    return <Auth onAuthSuccess={handleAuth} />;
  }

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      <Sidebar 
        currentView={view} 
        setView={setView} 
        onLogout={handleLogout} 
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar user={user} />
        
        <main className="flex-1 overflow-y-auto p-6 lg:p-10">
          {view === 'dashboard' && (
            <Dashboard 
              user={user}
              documents={documents}
              flashcardSets={flashcardSets}
              quizAttempts={quizAttempts}
              activities={activities}
              onNavigate={(v) => setView(v)}
            />
          )}

          {view === 'documents' && (
            <Documents 
              documents={documents}
              onAddDocument={handleAddDocument}
              onSelectDocument={(id) => {
                setActiveDocId(id);
                setView('study-room');
              }}
              onDeleteDocument={(id) => {
                const updated = documents.filter(d => d.id !== id);
                setDocuments(updated);
                persist('documents', updated);
              }}
            />
          )}

          {view === 'flashcards' && (
            <Flashcards 
              flashcardSets={flashcardSets}
              onStudySet={(setId) => {
                // In this simplified routing, we find the doc and enter study room
                const set = flashcardSets.find(s => s.id === setId);
                if (set) {
                  setActiveDocId(set.documentId);
                  setView('study-room');
                }
              }}
            />
          )}

          {view === 'profile' && (
            <Profile 
              user={user} 
              onUpdateUser={(u) => {
                setUser(u);
                persist('user', u);
              }}
            />
          )}

          {view === 'study-room' && activeDoc && (
            <StudyRoom 
              doc={activeDoc}
              flashcardSets={flashcardSets}
              quizAttempts={quizAttempts}
              onUpdateSets={(sets) => {
                setFlashcardSets(sets);
                persist('sets', sets);
                addActivity('flashcards_generated', `Generated flashcards for ${activeDoc.name}`);
              }}
              onAddQuizAttempt={(attempt) => {
                const updated = [attempt, ...quizAttempts];
                setQuizAttempts(updated);
                persist('quizzes', updated);
                addActivity('quiz_completed', `Completed quiz for ${activeDoc.name} with score ${attempt.score}%`);
              }}
              onBack={() => setView('documents')}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
