
import React, { useState } from 'react';
import { Document } from '../types';

interface DashboardProps {
  documents: Document[];
  onUpload: (doc: Document) => void;
  onSelectDoc: (id: string) => void;
  onDeleteDoc: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ documents, onUpload, onSelectDoc, onDeleteDoc }) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      const reader = new FileReader();
      reader.onload = (event) => {
        const newDoc: Document = {
          id: Date.now().toString(),
          name: file.name,
          uploadDate: new Date().toLocaleDateString(),
          fileUrl: event.target?.result as string,
        };
        onUpload(newDoc);
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="h-full overflow-y-auto p-10 bg-slate-50">
      <header className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-black text-slate-800">Overview</h1>
          <p className="text-slate-400 mt-2 font-medium">Welcome back! You have <span className="text-emerald-500">{documents.length} active documents</span>.</p>
        </div>
        <label className="flex items-center gap-3 bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-2xl font-bold transition-all cursor-pointer shadow-lg shadow-emerald-100 active:scale-95">
          <i className={`fas ${isUploading ? 'fa-spinner fa-spin' : 'fa-plus'}`}></i>
          <span>{isUploading ? 'Processing...' : 'Add Document'}</span>
          <input type="file" className="hidden" accept=".pdf" onChange={handleFileChange} disabled={isUploading} />
        </label>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        {[
          { label: 'Total Files', value: documents.length, icon: 'fa-file-alt', color: 'emerald' },
          { label: 'Time Studied', value: '4.2h', icon: 'fa-clock', color: 'blue' },
          { label: 'Accuracy', value: '92%', icon: 'fa-check-circle', color: 'amber' },
          { label: 'Flashcards', value: '128', icon: 'fa-clone', color: 'indigo' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-6 group hover:border-emerald-100 transition-colors">
            <div className={`w-14 h-14 rounded-2xl bg-${stat.color}-50 text-${stat.color}-500 flex items-center justify-center text-xl`}>
              <i className={`fas ${stat.icon}`}></i>
            </div>
            <div>
              <p className="text-slate-400 text-xs font-black uppercase tracking-widest">{stat.label}</p>
              <p className="text-2xl font-black text-slate-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-slate-800 mb-8 flex items-center gap-2">
        Recent Documents
        <div className="h-px flex-1 bg-slate-100 ml-4"></div>
      </h2>
      
      {documents.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-[40px] p-24 flex flex-col items-center justify-center text-center">
          <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 text-4xl mb-6">
            <i className="fas fa-cloud-upload-alt"></i>
          </div>
          <h3 className="text-xl font-bold text-slate-700 mb-2">Your library is empty</h3>
          <p className="text-slate-400 max-w-xs mb-8">Upload a document to start using AI to optimize your study workflow.</p>
          <label className="bg-emerald-500 text-white px-8 py-3 rounded-xl font-bold cursor-pointer hover:bg-emerald-600 transition-all">
            Upload PDF
            <input type="file" className="hidden" accept=".pdf" onChange={handleFileChange} />
          </label>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {documents.map(doc => (
            <div key={doc.id} className="group bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative">
              <div className="h-40 bg-slate-50 flex items-center justify-center border-b border-slate-50 relative">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-emerald-500 text-2xl group-hover:scale-110 transition-transform">
                  <i className="fas fa-file-pdf"></i>
                </div>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button onClick={() => onDeleteDoc(doc.id)} className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center hover:bg-rose-600 shadow-lg">
                     <i className="fas fa-times text-xs"></i>
                   </button>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-slate-800 truncate mb-1" title={doc.name}>{doc.name}</h3>
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-300 mb-6">{doc.uploadDate}</p>
                <button 
                  onClick={() => onSelectDoc(doc.id)}
                  className="w-full bg-emerald-500 text-white py-4 rounded-2xl text-sm font-bold shadow-lg shadow-emerald-50 hover:bg-emerald-600 transition-all active:scale-95"
                >
                  Start Studying
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
