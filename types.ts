export interface VocabQuestion {
  question: string; // The Thai word or hint
  correctAnswer: string; // The English word
  options: string[]; // 4 options
  emoji: string; // A visual hint
}

export interface StoryLevel {
  title: string;
  story: string;
  question: string;
  options: string[];
  correctAnswer: string;
}

export enum AppMode {
  MENU = 'MENU',
  VOCAB = 'VOCAB',
  STORY = 'STORY',
  RESULTS = 'RESULTS'
}

export interface GameState {
  score: number;
  totalQuestions: number;
  history: { mode: string; score: number }[];
}