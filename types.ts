
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Document {
  id: string;
  userId: string;
  name: string;
  uploadDate: string;
  fileUrl: string;
  extractedText: string;
  summary?: string;
  status: 'processing' | 'ready';
}

export interface Flashcard {
  id: string;
  setId: string;
  front: string;
  back: string;
  isFavorite: boolean;
  reviewed: boolean;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface FlashcardSet {
  id: string;
  documentId: string;
  documentName: string;
  title: string;
  createdAt: string;
  cards: Flashcard[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface QuizAttempt {
  id: string;
  documentId: string;
  documentName: string;
  score: number;
  totalQuestions: number;
  answers: number[];
  questions: QuizQuestion[];
  attemptedAt: string;
}

export interface Activity {
  id: string;
  type: 'document_uploaded' | 'flashcards_generated' | 'quiz_completed' | 'chat_message';
  description: string;
  timestamp: string;
}

export type AppView = 'dashboard' | 'documents' | 'flashcards' | 'profile' | 'study-room' | 'auth';
