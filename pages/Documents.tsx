
import React, { useState } from 'react';
import { Document } from '../types';

interface DocumentsProps {
  documents: Document[];
  onAddDocument: (doc: Document) => void;
  onSelectDocument: (id: string) => void;
  onDeleteDocument: (id: string) => void;
}

const Documents: React.FC<DocumentsProps> = ({ documents, onAddDocument, onSelectDocument, onDeleteDocument }) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setIsUploading(true);
      // Simulate backend processing and text extraction
      setTimeout(() => {
        const newDoc: Document = {
          id: Math.random().toString(36).substr(2, 9),
          userId: 'current-user',
          name: file.name,
          uploadDate: new Date().toLocaleDateString(),
          fileUrl: URL.createObjectURL(file),
          extractedText: `This is simulated extracted text from ${file.name}. It contains concepts about deep learning, AI ethics, and neural networks.`,
          status: 'ready',
        };
        onAddDocument(newDoc);
        setIsUploading(false);
      }, 1500);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight">Your Library</h1>
          <p className="text-slate-400 font-medium mt-2">Upload and organize your PDF study materials.</p>
        </div>
        <label className="bg-emerald-500 text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-emerald-50 hover:bg-emerald-600 transition-all cursor-pointer flex items-center gap-3">
          {isUploading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-cloud-arrow-up"></i>}
          <span>{isUploading ? 'Processing PDF...' : 'Upload Document'}</span>
          <input type="file" className="hidden" accept=".pdf" onChange={handleFileUpload} disabled={isUploading} />
        </label>
      </header>

      {documents.length === 0 ? (
        <div className="bg-white p-24 rounded-[40px] border-2 border-dashed border-slate-200 flex flex-col items-center text-center">
          <div className="w-32 h-32 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 text-5xl mb-8">
            <i className="fas fa-file-pdf"></i>
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-4">No documents uploaded yet</h3>
          <p className="text-slate-400 max-w-sm mb-10 font-medium leading-relaxed">
            Drag and drop your course materials, textbooks, or research papers here to unlock AI-powered study features.
          </p>
          <label className="text-emerald-500 font-bold hover:underline cursor-pointer">
            Browse files
            <input type="file" className="hidden" accept=".pdf" onChange={handleFileUpload} />
          </label>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {documents.map((doc) => (
            <div key={doc.id} className="group bg-white rounded-[32px] border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-300 relative overflow-hidden flex flex-col">
              <div className="h-40 bg-slate-50 flex items-center justify-center border-b border-slate-50">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-emerald-500 text-2xl group-hover:scale-110 transition-transform">
                  <i className="fas fa-file-pdf"></i>
                </div>
              </div>
              <div className="p-8">
                <h3 className="font-bold text-slate-800 truncate mb-1" title={doc.name}>{doc.name}</h3>
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-300 mb-8">{doc.uploadDate}</p>
                <div className="flex gap-3">
                  <button 
                    onClick={() => onSelectDocument(doc.id)}
                    className="flex-1 py-4 bg-emerald-500 text-white rounded-2xl font-bold shadow-lg shadow-emerald-50 hover:bg-emerald-600 transition-all text-xs"
                  >
                    Open Study Room
                  </button>
                  <button 
                    onClick={() => onDeleteDocument(doc.id)}
                    className="w-14 bg-slate-50 text-slate-300 rounded-2xl flex items-center justify-center hover:bg-rose-50 hover:text-rose-500 transition-all"
                  >
                    <i className="far fa-trash-can"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Documents;
