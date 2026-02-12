
import React, { useState, useEffect, useRef } from 'react';
import { Document, Flashcard, Quiz } from '../types';
import { generateSummary, generateFlashcards, generateQuiz, chatWithDocument } from '../geminiService';

interface StudyRoomProps {
  doc: Document;
  onUpdateDoc: (doc: Document) => void;
  onBack: () => void;
}

type ToolView = 'content' | 'chat' | 'ai-actions' | 'flashcards' | 'quiz';

const StudyRoom: React.FC<StudyRoomProps> = ({ doc, onUpdateDoc, onBack }) => {
  const [activeTool, setActiveTool] = useState<ToolView>('chat');
  const [loading, setLoading] = useState<boolean>(false);
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'model', parts: { text: string }[] }[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  // Flashcard states
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  
  // Quiz states
  const [quizResults, setQuizResults] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleAction = async (action: ToolView) => {
    if (loading) return;
    setActiveTool(action);

    if (action === 'content' || action === 'chat') return;

    setLoading(true);
    try {
      const docText = `Context from document "${doc.name}"`; 
      
      if (action === 'ai-actions' && !doc.summary) {
        const res = await generateSummary(docText);
        onUpdateDoc({ ...doc, summary: res });
      } else if (action === 'flashcards' && (!doc.flashcards || doc.flashcards.length === 0)) {
        const res = await generateFlashcards(docText);
        const formatted: Flashcard[] = res.map((f: any, i: number) => ({ ...f, id: i.toString(), isFavorite: false }));
        onUpdateDoc({ ...doc, flashcards: formatted });
      } else if (action === 'quiz' && (!doc.quizzes || doc.quizzes.length === 0)) {
        const res = await generateQuiz(docText);
        onUpdateDoc({ ...doc, quizzes: res });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChat = async () => {
    if (!chatInput.trim() || loading) return;
    const input = chatInput;
    setChatInput('');
    const newHistory: any = [...chatHistory, { role: 'user', parts: [{ text: input }] }];
    setChatHistory(newHistory);
    setLoading(true);

    try {
      const docText = `Context from document "${doc.name}"`;
      const aiResponse = await chatWithDocument(input, docText, chatHistory);
      setChatHistory([...newHistory, { role: 'model', parts: [{ text: aiResponse || 'No response' }] }]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleQuizAnswer = (idx: number, answerIdx: number) => {
    const newResults = [...quizResults];
    newResults[idx] = answerIdx;
    setQuizResults(newResults);
  };

  const tabs: {id: ToolView, label: string}[] = [
    { id: 'content', label: 'Content' },
    { id: 'chat', label: 'Chat' },
    { id: 'ai-actions', label: 'AI Actions' },
    { id: 'flashcards', label: 'Flashcards' },
    { id: 'quiz', label: 'Quizzes' },
  ];

  return (
    <div className="flex h-full flex-col bg-white overflow-hidden">
      {/* Tab Navigation from Screenshot 2 */}
      <div className="px-8 pt-6 border-b border-slate-100">
        <div className="flex items-center gap-10">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleAction(tab.id)}
              className={`pb-4 text-sm font-semibold transition-all relative ${
                activeTool === tab.id 
                  ? 'text-emerald-600' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab.label}
              {activeTool === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-emerald-500 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Workspace */}
        <div className={`flex-1 flex flex-col ${activeTool === 'content' ? 'w-full' : 'hidden lg:flex'}`}>
           <div className="flex-1 bg-slate-100 relative overflow-hidden">
            <iframe 
              src={doc.fileUrl} 
              className="w-full h-full border-none shadow-inner"
              title="PDF Viewer"
            />
          </div>
        </div>

        {/* AI Panel */}
        <div className={`flex flex-col bg-slate-50 transition-all duration-300 border-l border-slate-100 ${
          activeTool === 'content' ? 'w-0 overflow-hidden' : 'w-full lg:w-[500px]'
        }`}>
          <div className="flex-1 overflow-y-auto p-8">
            {activeTool === 'chat' && (
              <div className="flex flex-col h-full">
                <div className="flex-1 space-y-6 mb-6">
                  {chatHistory.length === 0 && (
                    <div className="bg-white p-8 rounded-3xl text-slate-700 border border-slate-100 text-center shadow-sm">
                      <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4">
                        <i className="fas fa-robot"></i>
                      </div>
                      <p className="font-bold text-lg mb-1">Study Assistant</p>
                      <p className="text-slate-400 text-sm">Ask anything about this document. I'm here to help you learn faster.</p>
                    </div>
                  )}
                  {chatHistory.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[90%] p-5 rounded-3xl text-sm leading-relaxed ${
                        msg.role === 'user' 
                          ? 'bg-emerald-500 text-white rounded-tr-none shadow-md shadow-emerald-50' 
                          : 'bg-white border border-slate-100 text-slate-700 shadow-sm rounded-tl-none'
                      }`}>
                        {msg.parts[0].text}
                      </div>
                    </div>
                  ))}
                  {loading && (
                    <div className="flex justify-start">
                      <div className="bg-white border border-slate-100 p-5 rounded-3xl rounded-tl-none flex gap-2 shadow-sm">
                        <div className="w-2 h-2 bg-emerald-300 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-emerald-300 rounded-full animate-bounce delay-100"></div>
                        <div className="w-2 h-2 bg-emerald-300 rounded-full animate-bounce delay-200"></div>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>
                <div className="flex gap-3 sticky bottom-0 bg-slate-50 py-2">
                  <input 
                    type="text" 
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleChat()}
                    placeholder="Type your question..."
                    className="flex-1 px-6 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm bg-white shadow-sm"
                  />
                  <button 
                    onClick={handleChat}
                    disabled={loading}
                    className="w-14 h-14 bg-emerald-500 text-white rounded-2xl flex items-center justify-center hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-100"
                  >
                    <i className="fas fa-paper-plane"></i>
                  </button>
                </div>
              </div>
            )}

            {activeTool === 'ai-actions' && (
              <div className="space-y-6">
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                  <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3">
                    <i className="fas fa-bolt text-emerald-500"></i>
                    Document Summary
                  </h3>
                  {loading ? (
                    <div className="animate-pulse space-y-3">
                      <div className="h-4 bg-slate-100 rounded w-full"></div>
                      <div className="h-4 bg-slate-100 rounded w-5/6"></div>
                      <div className="h-4 bg-slate-100 rounded w-full"></div>
                    </div>
                  ) : (
                    <div className="prose prose-emerald text-slate-600 leading-relaxed text-sm">
                      {doc.summary?.split('\n').map((line, i) => (
                        <p key={i} className="mb-2">{line}</p>
                      )) || 'Summary will appear here after generation.'}
                    </div>
                  )}
                </div>
                
                <button 
                  onClick={() => handleAction('ai-actions')}
                  className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-bold hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-50"
                >
                  Regenerate Summary
                </button>
              </div>
            )}

            {activeTool === 'flashcards' && (
              <div className="flex flex-col items-center">
                {loading ? (
                  <div className="w-full max-w-sm h-96 bg-white rounded-3xl border border-slate-100 shadow-sm flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-500 rounded-full animate-spin"></div>
                      <p className="text-slate-400 font-bold">Creating flashcards...</p>
                    </div>
                  </div>
                ) : doc.flashcards && doc.flashcards.length > 0 ? (
                  <div className="w-full max-w-sm flex flex-col gap-10">
                    <div 
                      onClick={() => setIsFlipped(!isFlipped)}
                      className="relative w-full h-[400px] cursor-pointer [perspective:1000px] group"
                    >
                      <div className={`relative w-full h-full transition-all duration-700 [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}>
                        <div className="absolute inset-0 bg-white p-10 rounded-[40px] shadow-xl shadow-slate-200 border border-slate-50 flex items-center justify-center text-center [backface-visibility:hidden]">
                           <span className="text-2xl font-bold text-slate-800 leading-tight">{doc.flashcards[currentFlashcardIndex].front}</span>
                           <div className="absolute bottom-10 text-[10px] text-slate-300 font-black tracking-widest uppercase group-hover:text-emerald-400 transition-colors">Tap to reveal answer</div>
                        </div>
                        <div className="absolute inset-0 bg-emerald-500 text-white p-10 rounded-[40px] shadow-xl shadow-emerald-200 flex items-center justify-center text-center [backface-visibility:hidden] [transform:rotateY(180deg)]">
                           <span className="text-xl leading-relaxed font-medium">{doc.flashcards[currentFlashcardIndex].back}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-6 px-4">
                      <button 
                        onClick={() => {
                          setCurrentFlashcardIndex((prev) => (prev > 0 ? prev - 1 : doc.flashcards!.length - 1));
                          setIsFlipped(false);
                        }}
                        className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg text-slate-400 hover:text-emerald-500 hover:scale-110 transition-all"
                      >
                        <i className="fas fa-chevron-left"></i>
                      </button>
                      <div className="bg-white px-6 py-2 rounded-full shadow-sm text-sm font-bold text-slate-400">
                        {currentFlashcardIndex + 1} <span className="text-slate-200 mx-1">/</span> {doc.flashcards.length}
                      </div>
                      <button 
                        onClick={() => {
                          setCurrentFlashcardIndex((prev) => (prev < doc.flashcards!.length - 1 ? prev + 1 : 0));
                          setIsFlipped(false);
                        }}
                        className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg text-slate-400 hover:text-emerald-500 hover:scale-110 transition-all"
                      >
                        <i className="fas fa-chevron-right"></i>
                      </button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => handleAction('flashcards')} className="bg-emerald-500 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-emerald-100">
                    Generate Flashcards
                  </button>
                )}
              </div>
            )}

            {activeTool === 'quiz' && (
              <div className="space-y-6">
                {loading ? (
                   <div className="space-y-6 animate-pulse">
                     {[1, 2, 3].map(i => <div key={i} className="h-40 bg-white rounded-3xl border border-slate-100"></div>)}
                   </div>
                ) : doc.quizzes && doc.quizzes.length > 0 ? (
                  <div className="space-y-8">
                    {doc.quizzes.map((q, idx) => (
                      <div key={idx} className={`bg-white p-8 rounded-[32px] border transition-all duration-300 shadow-sm ${showResults ? (quizResults[idx] === q.correctAnswer ? 'border-emerald-200' : 'border-rose-100') : 'border-slate-100'}`}>
                        <div className="flex items-start gap-4 mb-6">
                          <span className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-xs font-bold text-slate-400 shrink-0">{idx + 1}</span>
                          <p className="font-bold text-slate-800 leading-snug">{q.question}</p>
                        </div>
                        <div className="space-y-3">
                          {q.options.map((opt, optIdx) => (
                            <button
                              key={optIdx}
                              disabled={showResults}
                              onClick={() => handleQuizAnswer(idx, optIdx)}
                              className={`w-full text-left px-6 py-4 rounded-2xl text-sm border transition-all flex items-center gap-4 ${
                                showResults 
                                  ? optIdx === q.correctAnswer 
                                    ? 'bg-emerald-50 border-emerald-500 text-emerald-800' 
                                    : quizResults[idx] === optIdx 
                                      ? 'bg-rose-50 border-rose-500 text-rose-800'
                                      : 'bg-white border-slate-50 text-slate-300'
                                  : quizResults[idx] === optIdx
                                    ? 'bg-emerald-50 border-emerald-500 text-emerald-700 font-semibold'
                                    : 'bg-slate-50 border-slate-50 text-slate-600 hover:border-emerald-200 hover:bg-white'
                              }`}
                            >
                              <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black uppercase transition-colors ${quizResults[idx] === optIdx ? 'bg-emerald-500 text-white' : 'bg-white border border-slate-200 text-slate-400'}`}>
                                {String.fromCharCode(65 + optIdx)}
                              </span>
                              {opt}
                            </button>
                          ))}
                        </div>
                        {showResults && (
                          <div className={`mt-6 p-5 rounded-2xl text-xs leading-relaxed font-medium ${quizResults[idx] === q.correctAnswer ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                            <div className="flex items-center gap-2 mb-1 uppercase tracking-widest font-black text-[9px] opacity-60">
                              <i className="fas fa-info-circle"></i> Explanation
                            </div>
                            {q.explanation}
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {!showResults ? (
                      <button 
                        onClick={() => setShowResults(true)}
                        className="w-full py-5 bg-emerald-500 text-white rounded-[24px] font-bold shadow-xl shadow-emerald-100 hover:bg-emerald-600 transition-all scale-100 active:scale-95"
                      >
                        Submit Assessment
                      </button>
                    ) : (
                      <div className="flex gap-4 pb-10">
                        <button 
                          onClick={() => { setShowResults(false); setQuizResults([]); }}
                          className="flex-1 py-5 bg-white text-emerald-600 border border-emerald-200 rounded-[24px] font-bold hover:bg-emerald-50 transition-all shadow-sm"
                        >
                          Retry
                        </button>
                        <button 
                          onClick={() => { onUpdateDoc({...doc, quizzes: []}); handleAction('quiz'); }}
                          className="flex-1 py-5 bg-emerald-500 text-white rounded-[24px] font-bold hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-100"
                        >
                          New Quiz
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-20">
                     <div className="w-20 h-20 bg-slate-50 text-slate-200 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
                       <i className="fas fa-graduation-cap"></i>
                     </div>
                     <h4 className="text-lg font-bold text-slate-800 mb-2">Test Your Knowledge</h4>
                     <p className="text-slate-400 text-sm mb-8">Generate a custom AI quiz based on this document.</p>
                     <button onClick={() => handleAction('quiz')} className="bg-emerald-500 text-white px-10 py-4 rounded-2xl font-bold shadow-lg shadow-emerald-50">
                        Create Quiz
                      </button>
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
