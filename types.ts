
export enum PlayerId {
  USER = 'USER',
  BOT_1 = 'BOT_1',
  BOT_2 = 'BOT_2'
}

export interface UserAccount {
  username: string;
  avatar: string;
  totalScore: number;
  level: number;
  wins: number;
  gamesPlayed: number;
}

export interface Player {
  id: string; // Dynamic ID from PeerJS
  name: string;
  color: string;
  score: number;
  avatar: string;
  level: number;
  isHost: boolean;
}

export interface Territory {
  id: string;
  name: string;
  ownerId: string | null;
  points: number;
  path: string;
}

export interface TriviaQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  category: string;
}

export interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  type: 'system' | 'user' | 'bot';
  timestamp: Date;
}

export type GamePhase = 'AUTH' | 'LOBBY' | 'ROOM_WAITING' | 'INITIAL_LANDING' | 'BATTLE' | 'GAME_OVER';

export interface GameState {
  players: Player[];
  territories: Territory[];
  currentPlayerIndex: number;
  phase: GamePhase;
  round: number;
  selectedTerritoryId: string | null;
  chat: ChatMessage[];
  roomCode: string | null;
}

export type PeerMessage = 
  | { type: 'STATE_UPDATE'; state: GameState }
  | { type: 'CHAT'; message: ChatMessage }
  | { type: 'START_GAME' }
  | { type: 'QUESTION_TRIGGER'; question: TriviaQuestion };
