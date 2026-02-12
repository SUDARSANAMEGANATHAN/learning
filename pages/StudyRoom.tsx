
import React, { useState, useRef, useEffect } from 'react';
import { Document, FlashcardSet, QuizAttempt, Flashcard, QuizQuestion } from '../types';
import { generateDocumentSummary, generateStudyFlashcards, generateStudyQuiz, chatDocumentAssistant } from '../geminiService';

interface StudyRoomProps {
  doc: Document;
  flashcardSets: FlashcardSet[];
  quizAttempts: QuizAttempt[];
  onUpdateSets: (sets: FlashcardSet[]) => void;
  onAddQuizAttempt: (attempt: QuizAttempt) => void;
  onBack: () => void;
}

type Tab = 'content' | 'chat' | 'summary' | 'flashcards' | 'quiz';

const StudyRoom: React.FC<StudyRoomProps> = ({ doc, flashcardSets, quizAttempts, onUpdateSets, onAddQuizAttempt, onBack }) => {
  const [activeTab, setActiveTab] = useState<Tab>('chat');
  const [loading, setLoading] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Component state for flashcards study
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Quiz state
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [quizUserAnswers, setQuizUserAnswers] = useState<number[]>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const docFlashcardSet = flashcardSets.find(s => s.documentId === doc.id);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleGenerateSummary = async () => {
    setLoading(true);
    try {
      const summary = await generateDocumentSummary(doc.extractedText);
      // Logic to update document in parent state would go here
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateFlashcards = async () => {
    setLoading(true);
    try {
      const cards = await generateStudyFlashcards(doc.extractedText);
      const newSet: FlashcardSet = {
        id: Math.random().toString(36).substr(2, 9),
        documentId: doc.id,
        documentName: doc.name,
        title: `Flashcards: ${doc.name}`,
        createdAt: new Date().toISOString(),
        cards: cards.map((c: any) => ({ 
          ...c, 
          id: Math.random().toString(36).substr(2, 9),
          isFavorite: false,
          reviewed: false
        })),
      };
      onUpdateSets([...flashcardSets, newSet]);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateQuiz = async () => {
    setLoading(true);
    setQuizCompleted(false);
    setQuizUserAnswers([]);
    try {
      const questions = await generateStudyQuiz(doc.extractedText);
      setQuizQuestions(questions);
      setActiveTab('quiz');
    } finally {
      setLoading(false);
    }
  };

  const handleChat = async () => {
    if (!chatInput.trim() || loading) return;
    const userMsg = chatInput;
    setChatInput('');
    const newHistory = [...chatHistory, { role: 'user', parts: [{ text: userMsg }] }];
    setChatHistory(newHistory);
    setLoading(true);
    try {
      const aiResponse = await chatDocumentAssistant(userMsg, doc.extractedText, chatHistory);
      setChatHistory([...newHistory, { role: 'model', parts: [{ text: aiResponse || '' }] }]);
    } finally {
      setLoading(false);
    }
  };

  const submitQuiz = () => {
    let scoreCount = 0;
    quizQuestions.forEach((q, i) => {
      if (quizUserAnswers[i] === q.correctAnswer) scoreCount++;
    });
    const score = Math.round((scoreCount / quizQuestions.length) * 100);
    setQuizCompleted(true);
    
    const attempt: QuizAttempt = {
      id: Math.random().toString(36).substr(2, 9),
      documentId: doc.id,
      documentName: doc.name,
      score,
      totalQuestions: quizQuestions.length,
      answers: quizUserAnswers,
      questions: quizQuestions,
      attemptedAt: new Date().toISOString(),
    };
    onAddQuizAttempt(attempt);
  };

  return (
    <div className="flex h-full flex-col bg-white -m-10">
      <div className="px-10 py-6 border-b border-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button onClick={onBack} className="text-slate-400 hover:text-emerald-500 transition-colors">
            <i className="fas fa-arrow-left text-xl"></i>
          </button>
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center">
                <i className="fas fa-file-pdf"></i>
             </div>
             <div>
                <h2 className="text-xl font-black text-slate-800 leading-none">{doc.name}</h2>
                <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-1">Status: {doc.status}</p>
             </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button onClick={handleGenerateSummary} className="px-5 py-3 rounded-xl bg-slate-50 text-slate-500 font-bold text-xs hover:bg-emerald-50 hover:text-emerald-600 transition-all">
             <i className="fas fa-magic mr-2"></i>Summary
          </button>
          <button onClick={handleGenerateFlashcards} className="px-5 py-3 rounded-xl bg-slate-50 text-slate-500 font-bold text-xs hover:bg-emerald-50 hover:text-emerald-600 transition-all">
             <i className="fas fa-clone mr-2"></i>Generate Cards
          </button>
          <button onClick={handleGenerateQuiz} className="px-6 py-3 rounded-xl bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-50 hover:bg-emerald-600 transition-all">
             <i className="fas fa-graduation-cap mr-2"></i>Quick Quiz
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left: Content Viewer */}
        <div className="flex-1 bg-slate-100 relative shadow-inner">
           <iframe src={doc.fileUrl} className="w-full h-full border-none" />
        </div>

        {/* Right: AI Panel */}
        <div className="w-[550px] bg-slate-50 flex flex-col border-l border-slate-100">
           <div className="flex p-4 gap-2 bg-white border-b border-slate-100">
              {(['chat', 'summary', 'flashcards', 'quiz'] as Tab[]).map(t => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === t ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'}`}
                >
                  {t}
                </button>
              ))}
           </div>

           <div className="flex-1 overflow-y-auto p-8 relative">
              {activeTab === 'chat' && (
                <div className="flex flex-col h-full">
                  <div className="flex-1 space-y-6 mb-8">
                    {chatHistory.length === 0 && (
                      <div className="bg-white p-10 rounded-[40px] border border-slate-100 text-center shadow-sm">
                        <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-3xl flex items-center justify-center text-3xl mx-auto mb-6">
                           <i className="fas fa-robot"></i>
                        </div>
                        <h3 className="text-xl font-bold text-slate-800">Your Personal Tutor</h3>
                        <p className="text-slate-400 text-sm mt-2 leading-relaxed font-medium">Ask specific questions about concepts in this document. I'll explain them using only the provided context.</p>
                      </div>
                    )}
                    {chatHistory.map((msg, i) => (
                      <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] p-6 rounded-[32px] text-sm leading-relaxed ${msg.role === 'user' ? 'bg-emerald-500 text-white rounded-tr-none shadow-xl shadow-emerald-50' : 'bg-white border border-slate-100 text-slate-700 rounded-tl-none shadow-sm'}`}>
                          {msg.parts[0].text}
                        </div>
                      </div>
                    ))}
                    {loading && (
                      <div className="flex justify-start">
                         <div className="bg-white p-6 rounded-[32px] shadow-sm flex gap-2">
                            <div className="w-2 h-2 bg-emerald-300 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-emerald-300 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                            <div className="w-2 h-2 bg-emerald-300 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                         </div>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>
                  <div className="sticky bottom-0 bg-slate-50 py-2">
                    <div className="relative group">
                      <input 
                        type="text" 
                        value={chatInput}
                        onChange={e => setChatInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleChat()}
                        placeholder="Type your question..."
                        className="w-full px-8 py-5 rounded-[24px] bg-white border-none shadow-lg shadow-slate-200/50 focus:ring-2 focus:ring-emerald-500 text-sm font-semibold transition-all"
                      />
                      <button 
                        onClick={handleChat}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 bg-emerald-500 text-white rounded-2xl flex items-center justify-center hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-100"
                      >
                        <i className="fas fa-paper-plane"></i>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'flashcards' && (
                 <div className="flex flex-col items-center justify-center h-full">
                   {docFlashcardSet ? (
                     <div className="w-full max-w-sm space-y-12">
                        <div 
                          onClick={() => setIsFlipped(!isFlipped)}
                          className="relative h-[450px] w-full [perspective:1000px] cursor-pointer"
                        >
                          <div className={`relative h-full w-full transition-all duration-700 [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}>
                             <div className="absolute inset-0 bg-white p-12 rounded-[50px] shadow-2xl shadow-slate-200 border border-slate-100 flex items-center justify-center text-center [backface-visibility:hidden]">
                                <span className="text-2xl font-black text-slate-800 leading-tight">{docFlashcardSet.cards[currentCardIndex].front}</span>
                                <div className="absolute bottom-10 text-[10px] text-slate-300 font-black uppercase tracking-[3px]">Tap to reveal</div>
                             </div>
                             <div className="absolute inset-0 bg-emerald-500 text-white p-12 rounded-[50px] shadow-2xl shadow-emerald-200 flex items-center justify-center text-center [backface-visibility:hidden] [transform:rotateY(180deg)]">
                                <span className="text-xl font-medium leading-relaxed">{docFlashcardSet.cards[currentCardIndex].back}</span>
                             </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between gap-6">
                           <button 
                              onClick={() => { setCurrentCardIndex(p => Math.max(0, p - 1)); setIsFlipped(false); }}
                              className="w-16 h-16 rounded-3xl bg-white shadow-xl flex items-center justify-center text-slate-300 hover:text-emerald-500 transition-all active:scale-95"
                           >
                             <i className="fas fa-chevron-left text-xl"></i>
                           </button>
                           <div className="bg-white px-8 py-3 rounded-full shadow-sm text-sm font-black text-slate-400">
                             {currentCardIndex + 1} <span className="text-slate-100 mx-2">/</span> {docFlashcardSet.cards.length}
                           </div>
                           <button 
                              onClick={() => { setCurrentCardIndex(p => Math.min(docFlashcardSet.cards.length - 1, p + 1)); setIsFlipped(false); }}
                              className="w-16 h-16 rounded-3xl bg-white shadow-xl flex items-center justify-center text-slate-300 hover:text-emerald-500 transition-all active:scale-95"
                           >
                             <i className="fas fa-chevron-right text-xl"></i>
                           </button>
                        </div>
                     </div>
                   ) : (
                     <div className="text-center py-20">
                        <div className="w-24 h-24 bg-slate-50 text-slate-200 rounded-[32px] flex items-center justify-center text-4xl mx-auto mb-8">
                           <i className="fas fa-layer-group"></i>
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">No Study Cards Yet</h3>
                        <p className="text-slate-400 text-sm max-w-xs mx-auto mb-10">Generate AI flashcards to master the key concepts of this document.</p>
                        <button onClick={handleGenerateFlashcards} className="bg-emerald-500 text-white px-10 py-5 rounded-3xl font-bold shadow-xl shadow-emerald-50">Create Deck</button>
                     </div>
                   )}
                 </div>
              )}

              {activeTab === 'quiz' && (
                <div className="space-y-8">
                  {quizQuestions.length > 0 ? (
                    <div className="space-y-8 pb-10">
                       {quizQuestions.map((q, qIdx) => (
                         <div key={qIdx} className={`bg-white p-10 rounded-[40px] border shadow-sm transition-all duration-500 ${quizCompleted ? (quizUserAnswers[qIdx] === q.correctAnswer ? 'border-emerald-200 bg-emerald-50/20' : 'border-rose-100 bg-rose-50/20') : 'border-slate-100'}`}>
                            <div className="flex items-start gap-4 mb-8">
                               <span className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-[10px] font-black text-slate-400 shrink-0 uppercase">{qIdx + 1}</span>
                               <p className="text-lg font-bold text-slate-800 leading-tight">{q.question}</p>
                            </div>
                            <div className="space-y-3">
                               {q.options.map((opt, optIdx) => (
                                 <button
                                   key={optIdx}
                                   disabled={quizCompleted}
                                   onClick={() => {
                                      const next = [...quizUserAnswers];
                                      next[qIdx] = optIdx;
                                      setQuizUserAnswers(next);
                                   }}
                                   className={`w-full text-left px-8 py-5 rounded-[24px] text-sm border transition-all flex items-center gap-4 ${
                                      quizCompleted 
                                        ? optIdx === q.correctAnswer 
                                          ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg' 
                                          : quizUserAnswers[qIdx] === optIdx 
                                            ? 'bg-rose-500 border-rose-500 text-white'
                                            : 'bg-white border-slate-50 text-slate-300 opacity-60'
                                        : quizUserAnswers[qIdx] === optIdx
                                          ? 'bg-emerald-50 border-emerald-500 text-emerald-700 font-bold'
                                          : 'bg-slate-50 border-slate-50 text-slate-600 hover:bg-white hover:border-emerald-100'
                                   }`}
                                 >
                                   <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black uppercase tracking-widest ${quizUserAnswers[qIdx] === optIdx ? 'bg-white text-emerald-500' : 'bg-white border border-slate-100 text-slate-400'}`}>
                                      {String.fromCharCode(65 + optIdx)}
                                   </span>
                                   {opt}
                                 </button>
                               ))}
                            </div>
                            {quizCompleted && (
                               <div className={`mt-8 p-6 rounded-3xl text-xs font-bold leading-relaxed flex gap-3 ${quizUserAnswers[qIdx] === q.correctAnswer ? 'bg-emerald-100/50 text-emerald-800' : 'bg-rose-100/50 text-rose-800'}`}>
                                  <i className="fas fa-info-circle mt-0.5"></i>
                                  <div>
                                     <span className="uppercase tracking-[2px] opacity-60 block mb-1">Explanation</span>
                                     {q.explanation}
                                  </div>
                               </div>
                            )}
                         </div>
                       ))}
                       {!quizCompleted ? (
                         <button 
                           onClick={submitQuiz}
                           disabled={quizUserAnswers.length < quizQuestions.length}
                           className="w-full py-6 bg-emerald-500 text-white rounded-[32px] font-black text-lg shadow-2xl shadow-emerald-100 hover:bg-emerald-600 transition-all disabled:opacity-50"
                         >
                           Finish & Grade
                         </button>
                       ) : (
                         <button onClick={handleGenerateQuiz} className="w-full py-6 bg-slate-800 text-white rounded-[32px] font-black text-lg shadow-xl shadow-slate-200 hover:bg-slate-900 transition-all">
                            Retake Assessment
                         </button>
                       )}
                    </div>
                  ) : (
                    <div className="text-center py-24">
                       <div className="w-24 h-24 bg-slate-50 text-slate-200 rounded-[40px] flex items-center justify-center text-4xl mx-auto mb-8">
                          <i className="fas fa-graduation-cap"></i>
                       </div>
                       <h3 className="text-2xl font-black text-slate-800 mb-3">Knowledge Check</h3>
                       <p className="text-slate-400 text-sm max-w-xs mx-auto mb-10 font-medium">Verify your comprehension with a dynamic MCQs set generated from your reading material.</p>
                       <button onClick={handleGenerateQuiz} className="bg-emerald-500 text-white px-12 py-5 rounded-[24px] font-bold shadow-xl shadow-emerald-50">Generate Quiz</button>
                    </div>
                  )}
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default StudyRoom;
