// Provider Factory - Multi-turn Chat

import { chatWithGPT52 } from './openai';
import { chatWithClaude46 } from './anthropic';
import { chatWithKimiK25 } from './moonshot';
import { chatWithGemini } from './gemini';
import { ChatResponse } from '../types';

interface ChatMessageInput {
  role: 'user' | 'assistant';
  content: string;
  imageUrl?: string;
}

export async function chatWithProvider(
  provider: string,
  messages: ChatMessageInput[],
  apiKey: string,
  systemPrompt?: string
): Promise<ChatResponse> {
  switch (provider) {
    case 'openai':
      return chatWithGPT52(messages, apiKey, systemPrompt);
    case 'anthropic':
      return chatWithClaude46(messages, apiKey, systemPrompt);
    case 'moonshot':
      return chatWithKimiK25(messages, apiKey, systemPrompt);
    case 'gemini':
      return chatWithGemini(messages, apiKey, systemPrompt);
    default:
      throw new Error(`Unknown provider: ${provider}`);
  }
}
