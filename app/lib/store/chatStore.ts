import { create } from 'zustand';
import { ChatMessage } from '@/lib/ai/types';

interface ConversationState {
  messages: ChatMessage[];
  isLoading: boolean;
  systemPrompt: string;
  conversationId: string | null; // DB id
}

interface ChatStore {
  conversations: Record<string, ConversationState>;
  
  // Initialize a conversation for a model
  initConversation: (modelName: string, defaultSystemPrompt?: string) => void;
  
  // Add user message
  addUserMessage: (modelName: string, content: string, imageUrl?: string) => void;
  
  // Add assistant message
  addAssistantMessage: (modelName: string, message: ChatMessage) => void;
  
  // Set loading state
  setLoading: (modelName: string, loading: boolean) => void;
  
  // Set system prompt for a model
  setSystemPrompt: (modelName: string, prompt: string) => void;
  
  // Set conversation DB id
  setConversationId: (modelName: string, id: string) => void;
  
  // Clear a conversation
  clearConversation: (modelName: string) => void;
  
  // Clear all conversations
  clearAll: () => void;
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export const useChatStore = create<ChatStore>((set) => ({
  conversations: {},
  
  initConversation: (modelName, defaultSystemPrompt = '') => {
    set((state) => {
      if (state.conversations[modelName]) return state;
      return {
        conversations: {
          ...state.conversations,
          [modelName]: {
            messages: [],
            isLoading: false,
            systemPrompt: defaultSystemPrompt,
            conversationId: null,
          }
        }
      };
    });
  },
  
  addUserMessage: (modelName, content, imageUrl) => {
    const msg: ChatMessage = {
      id: generateId(),
      role: 'user',
      content,
      imageUrl,
      createdAt: new Date().toISOString(),
    };
    set((state) => ({
      conversations: {
        ...state.conversations,
        [modelName]: {
          ...state.conversations[modelName],
          messages: [...(state.conversations[modelName]?.messages || []), msg],
        }
      }
    }));
  },
  
  addAssistantMessage: (modelName, message) => {
    set((state) => ({
      conversations: {
        ...state.conversations,
        [modelName]: {
          ...state.conversations[modelName],
          messages: [...(state.conversations[modelName]?.messages || []), message],
        }
      }
    }));
  },
  
  setLoading: (modelName, loading) => {
    set((state) => ({
      conversations: {
        ...state.conversations,
        [modelName]: {
          ...state.conversations[modelName],
          isLoading: loading,
        }
      }
    }));
  },
  
  setSystemPrompt: (modelName, prompt) => {
    set((state) => ({
      conversations: {
        ...state.conversations,
        [modelName]: {
          ...state.conversations[modelName],
          systemPrompt: prompt,
        }
      }
    }));
  },
  
  setConversationId: (modelName, id) => {
    set((state) => ({
      conversations: {
        ...state.conversations,
        [modelName]: {
          ...state.conversations[modelName],
          conversationId: id,
        }
      }
    }));
  },
  
  clearConversation: (modelName) => {
    set((state) => ({
      conversations: {
        ...state.conversations,
        [modelName]: {
          messages: [],
          isLoading: false,
          systemPrompt: state.conversations[modelName]?.systemPrompt || '',
          conversationId: null,
        }
      }
    }));
  },
  
  clearAll: () => {
    set({ conversations: {} });
  },
}));
