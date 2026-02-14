// AI Types and Configuration

export interface AIProviderConfig {
  name: string;
  provider: 'openai' | 'anthropic' | 'moonshot' | 'gemini';
  modelId: string;
  apiKey: string;
  supportsVision: boolean;
  hasSystemPrompt: boolean;
}

// Chat message for conversation history
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  imageUrl?: string;
  tokensUsed?: number;
  responseTime?: number;
  error?: string;
  createdAt: string;
}

// Chat request to API
export interface ChatRequest {
  modelName: string;
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
    imageUrl?: string;
  }>;
  systemPrompt?: string;
}

// Chat response from API
export interface ChatResponse {
  content: string;
  tokensUsed?: number;
  responseTime: number;
  error?: string;
}

// 8 modelli: GPT, Claude, Kimi, Gemini (ognuno Guided + Custom)
export const AI_MODELS: AIProviderConfig[] = [
  // GPT-5.2
  {
    name: 'GPT-5.2 Thinking (Guided)',
    provider: 'openai',
    modelId: 'gpt-4o',
    apiKey: process.env.OPENAI_API_KEY!,
    supportsVision: true,
    hasSystemPrompt: true
  },
  {
    name: 'GPT-5.2 Thinking (Custom)',
    provider: 'openai',
    modelId: 'gpt-4o',
    apiKey: process.env.OPENAI_API_KEY!,
    supportsVision: true,
    hasSystemPrompt: false
  },
  
  // Claude Opus 4.6
  {
    name: 'Claude Opus 4.6 (Guided)',
    provider: 'anthropic',
    modelId: 'claude-sonnet-4-20250514',
    apiKey: process.env.ANTHROPIC_API_KEY!,
    supportsVision: true,
    hasSystemPrompt: true
  },
  {
    name: 'Claude Opus 4.6 (Custom)',
    provider: 'anthropic',
    modelId: 'claude-sonnet-4-20250514',
    apiKey: process.env.ANTHROPIC_API_KEY!,
    supportsVision: true,
    hasSystemPrompt: false
  },
  
  // Kimi K2.5
  {
    name: 'Kimi K2.5 (Guided)',
    provider: 'moonshot',
    modelId: 'kimi-k2.5',
    apiKey: process.env.MOONSHOT_API_KEY!,
    supportsVision: true,
    hasSystemPrompt: true
  },
  {
    name: 'Kimi K2.5 (Custom)',
    provider: 'moonshot',
    modelId: 'kimi-k2.5',
    apiKey: process.env.MOONSHOT_API_KEY!,
    supportsVision: true,
    hasSystemPrompt: false
  },
  
  // Gemini 2.0 Flash
  {
    name: 'Gemini 2.0 Flash (Guided)',
    provider: 'gemini',
    modelId: 'gemini-2.0-flash',
    apiKey: process.env.GEMINI_API_KEY!,
    supportsVision: true,
    hasSystemPrompt: true
  },
  {
    name: 'Gemini 2.0 Flash (Custom)',
    provider: 'gemini',
    modelId: 'gemini-2.0-flash',
    apiKey: process.env.GEMINI_API_KEY!,
    supportsVision: true,
    hasSystemPrompt: false
  }
];

export type ModelName = typeof AI_MODELS[number]['name'];
