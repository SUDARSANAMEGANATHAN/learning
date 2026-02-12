
import React from 'react';
import { FlashcardSet } from '../types';

interface FlashcardsProps {
  flashcardSets: FlashcardSet[];
  onStudySet: (setId: string) => void;
}

const Flashcards: React.FC<FlashcardsProps> = ({ flashcardSets, onStudySet }) => {
  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <header>
        <h1 className="text-4xl font-black text-slate-800">Study Decks</h1>
        <p className="text-slate-400 font-medium mt-2">Master your library one card at a time.</p>
      </header>

      {flashcardSets.length === 0 ? (
        <div className="bg-white p-24 rounded-[40px] border border-slate-100 shadow-sm flex flex-col items-center text-center">
          <div className="w-32 h-32 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 text-5xl mb-8">
            <i className="fas fa-layer-group"></i>
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-3">Decks are currently empty</h3>
          <p className="text-slate-400 max-w-sm font-medium">Head over to the documents section and use the AI tools to generate your first study deck.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {flashcardSets.map((set) => {
            const progress = Math.round((set.cards.filter(c => c.reviewed).length / set.cards.length) * 100);
            return (
              <div key={set.id} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-300 group flex flex-col">
                <div className="flex items-center justify-between mb-8">
                  <div className="w-14 h-14 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center text-xl">
                    <i className="fas fa-clone"></i>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-slate-800">{set.cards.length}</p>
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Cards</p>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-800 line-clamp-2 mb-2 group-hover:text-emerald-500 transition-colors">{set.title}</h3>
                <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-10">{set.documentName}</p>
                
                <div className="space-y-2 mb-8">
                   <div className="flex justify-between items-end text-[10px] font-black uppercase tracking-wider text-slate-400">
                      <span>Mastery</span>
                      <span>{progress}%</span>
                   </div>
                   <div className="h-2 bg-slate-50 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full transition-all duration-1000" style={{ width: `${progress}%` }}></div>
                   </div>
                </div>

                <button 
                  onClick={() => onStudySet(set.id)}
                  className="w-full py-5 bg-slate-900 text-white rounded-[24px] font-black text-xs uppercase tracking-[2px] shadow-xl shadow-slate-200 hover:bg-emerald-500 hover:shadow-emerald-100 transition-all mt-auto"
                >
                  Study Deck
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Flashcards;
