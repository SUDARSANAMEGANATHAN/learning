
export interface Document {
  id: string;
  name: string;
  uploadDate: string;
  fileUrl: string;
  summary?: string;
  concepts?: Concept[];
  flashcards?: Flashcard[];
  quizzes?: Quiz[];
}

export interface Concept {
  term: string;
  explanation: string;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  isFavorite: boolean;
}

export interface Quiz {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface UserProgress {
  documentsCount: number;
  flashcardsLearned: number;
  quizzesCompleted: number;
  averageScore: number;
}

export type ViewState = 'dashboard' | 'documents' | 'flashcards-view' | 'profile' | 'study-room' | 'auth';
