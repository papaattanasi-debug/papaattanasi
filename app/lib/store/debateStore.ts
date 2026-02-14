import { create } from 'zustand';

export interface DebateMessage {
  id: string;
  modelName: string;
  content: string;
  tokensUsed?: number;
  responseTime?: number;
  error?: string;
  createdAt: string;
}

interface DebateState {
  modelA: string | null;
  modelB: string | null;
  topic: string;
  messages: DebateMessage[];
  isRunning: boolean;
  isPaused: boolean;
  currentTurn: 'A' | 'B';
  turnCount: number;
  maxTurns: number;
  conversationId: string | null;
  
  setModels: (a: string, b: string) => void;
  setTopic: (topic: string) => void;
  setMaxTurns: (n: number) => void;
  addMessage: (msg: DebateMessage) => void;
  setRunning: (running: boolean) => void;
  setPaused: (paused: boolean) => void;
  setCurrentTurn: (turn: 'A' | 'B') => void;
  incrementTurn: () => void;
  setConversationId: (id: string) => void;
  reset: () => void;
}

function genId() {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export const useDebateStore = create<DebateState>((set) => ({
  modelA: null,
  modelB: null,
  topic: '',
  messages: [],
  isRunning: false,
  isPaused: false,
  currentTurn: 'A',
  turnCount: 0,
  maxTurns: 20,
  conversationId: null,
  
  setModels: (a, b) => set({ modelA: a, modelB: b }),
  setTopic: (topic) => set({ topic }),
  setMaxTurns: (n) => set({ maxTurns: n }),
  addMessage: (msg) => set((s) => ({ messages: [...s.messages, msg] })),
  setRunning: (running) => set({ isRunning: running }),
  setPaused: (paused) => set({ isPaused: paused }),
  setCurrentTurn: (turn) => set({ currentTurn: turn }),
  incrementTurn: () => set((s) => ({ turnCount: s.turnCount + 1 })),
  setConversationId: (id) => set({ conversationId: id }),
  reset: () => set({
    messages: [],
    isRunning: false,
    isPaused: false,
    currentTurn: 'A',
    turnCount: 0,
    conversationId: null,
  }),
}));
