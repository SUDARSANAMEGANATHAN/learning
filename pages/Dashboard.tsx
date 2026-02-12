
import React from 'react';
import { User, Document, FlashcardSet, QuizAttempt, Activity, AppView } from '../types';

interface DashboardProps {
  user: User;
  documents: Document[];
  flashcardSets: FlashcardSet[];
  quizAttempts: QuizAttempt[];
  activities: Activity[];
  onNavigate: (v: AppView) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, documents, flashcardSets, quizAttempts, activities, onNavigate }) => {
  const stats = [
    { label: 'Documents', value: documents.length, icon: 'fa-file-alt', color: 'emerald' },
    { label: 'Flashcards', value: flashcardSets.reduce((acc, s) => acc + s.cards.length, 0), icon: 'fa-clone', color: 'blue' },
    { label: 'Quizzes', value: quizAttempts.length, icon: 'fa-graduation-cap', color: 'indigo' },
    { label: 'Avg. Score', value: quizAttempts.length ? `${Math.round(quizAttempts.reduce((acc, q) => acc + q.score, 0) / quizAttempts.length)}%` : '0%', icon: 'fa-chart-line', color: 'rose' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-800">Hello, {user.name.split(' ')[0]}!</h1>
          <p className="text-slate-400 font-medium mt-2">Ready to optimize your learning session today?</p>
        </div>
        <button 
          onClick={() => onNavigate('documents')}
          className="bg-emerald-500 text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-emerald-50 hover:bg-emerald-600 transition-all flex items-center gap-3 w-fit"
        >
          <i className="fas fa-plus"></i>
          New Study Document
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 flex items-center gap-6 group hover:border-emerald-100 transition-colors">
            <div className={`w-16 h-16 rounded-2xl bg-${stat.color}-50 text-${stat.color}-500 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}>
              <i className={`fas ${stat.icon}`}></i>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-300 mb-1">{stat.label}</p>
              <p className="text-3xl font-black text-slate-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold text-slate-800">Recent Documents</h2>
            <button onClick={() => onNavigate('documents')} className="text-emerald-500 text-sm font-bold hover:underline">View All</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {documents.slice(-2).map((doc) => (
              <div key={doc.id} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-lg transition-all flex flex-col group">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-emerald-500 mb-6 group-hover:bg-emerald-50 transition-colors">
                  <i className="fas fa-file-pdf text-xl"></i>
                </div>
                <h3 className="font-bold text-slate-800 truncate mb-1">{doc.name}</h3>
                <p className="text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-6">{doc.uploadDate}</p>
                <button 
                   onClick={() => onNavigate('documents')}
                   className="mt-auto py-4 bg-slate-50 text-slate-500 rounded-2xl text-xs font-bold hover:bg-emerald-500 hover:text-white transition-all"
                >
                  Continue Studying
                </button>
              </div>
            ))}
            {documents.length === 0 && (
               <div className="bg-white p-12 rounded-[32px] border border-dashed border-slate-200 text-center col-span-2">
                  <p className="text-slate-400 font-medium">No documents yet. Start by uploading your study materials.</p>
               </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-800">Activity Timeline</h2>
          <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6 max-h-[500px] overflow-y-auto">
            {activities.length > 0 ? activities.map((act) => (
              <div key={act.id} className="flex gap-4 relative">
                <div className="w-10 h-10 rounded-xl bg-slate-50 shrink-0 flex items-center justify-center text-emerald-500">
                  <i className={`fas ${act.type === 'document_uploaded' ? 'fa-upload' : act.type === 'quiz_completed' ? 'fa-check-circle' : 'fa-brain'}`}></i>
                </div>
                <div>
                  <p className="text-sm text-slate-700 font-semibold leading-snug">{act.description}</p>
                  <p className="text-[10px] text-slate-300 font-bold mt-1 uppercase tracking-wider">{new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
            )) : (
              <p className="text-slate-400 text-center py-10 font-medium">No recent activity.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
