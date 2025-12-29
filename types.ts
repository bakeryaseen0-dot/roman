
export enum PlayerId {
  USER = 'USER',
  BOT_1 = 'BOT_1',
  BOT_2 = 'BOT_2'
}

export interface Player {
  id: PlayerId;
  name: string;
  color: string;
  score: number;
  avatar: string;
  level: number;
}

export interface Territory {
  id: string;
  name: string;
  ownerId: PlayerId | null;
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

export interface GameState {
  players: Record<PlayerId, Player>;
  territories: Territory[];
  currentPlayerId: PlayerId;
  phase: 'LOBBY' | 'MATCHMAKING' | 'INITIAL_LANDING' | 'BATTLE' | 'GAME_OVER';
  round: number;
  selectedTerritoryId: string | null;
  chat: ChatMessage[];
}
