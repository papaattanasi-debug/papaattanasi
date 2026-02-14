// OpenAI GPT-5.2 Provider - Multi-turn Chat

import OpenAI from 'openai';
import { ChatResponse } from '../types';

interface ChatMessageInput {
  role: 'user' | 'assistant';
  content: string;
  imageUrl?: string;
}

export async function chatWithGPT52(
  messages: ChatMessageInput[],
  apiKey: string,
  systemPrompt?: string
): Promise<ChatResponse> {
  const startTime = Date.now();
  const client = new OpenAI({ apiKey });
  
  try {
    const apiMessages: any[] = [];
    
    if (systemPrompt) {
      apiMessages.push({ role: 'system', content: systemPrompt });
    }
    
    for (const msg of messages) {
      if (msg.role === 'assistant') {
        apiMessages.push({ role: 'assistant', content: msg.content });
      } else {
        // User message - may include image
        if (msg.imageUrl) {
          apiMessages.push({
            role: 'user',
            content: [
              { type: 'text', text: msg.content || 'Analyze this image.' },
              {
                type: 'image_url',
                image_url: { url: msg.imageUrl, detail: 'high' }
              }
            ]
          });
        } else {
          apiMessages.push({ role: 'user', content: msg.content });
        }
      }
    }
    
    const response = await client.chat.completions.create({
      model: 'gpt-4o',
      max_tokens: 4000,
      messages: apiMessages,
    });
    
    return {
      content: response.choices[0]?.message?.content || '',
      tokensUsed: response.usage?.total_tokens,
      responseTime: Date.now() - startTime
    };
  } catch (error: any) {
    return {
      content: '',
      responseTime: Date.now() - startTime,
      error: error.message
    };
  }
}
