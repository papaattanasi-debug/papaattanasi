// Anthropic Claude Opus 4.6 Provider - Multi-turn Chat

import Anthropic from '@anthropic-ai/sdk';
import { ChatResponse } from '../types';

interface ChatMessageInput {
  role: 'user' | 'assistant';
  content: string;
  imageUrl?: string;
}

export async function chatWithClaude46(
  messages: ChatMessageInput[],
  apiKey: string,
  systemPrompt?: string
): Promise<ChatResponse> {
  const startTime = Date.now();
  const client = new Anthropic({ apiKey });
  
  try {
    const apiMessages: Anthropic.MessageParam[] = [];
    
    for (const msg of messages) {
      if (msg.role === 'assistant') {
        apiMessages.push({ role: 'assistant', content: msg.content });
      } else {
        if (msg.imageUrl) {
          const imageBase64 = await fetchImageAsBase64(msg.imageUrl);
          const mediaType = getMediaType(msg.imageUrl);
          apiMessages.push({
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: mediaType,
                  data: imageBase64
                }
              },
              { type: 'text', text: msg.content || 'Analyze this image.' }
            ]
          });
        } else {
          apiMessages.push({ role: 'user', content: msg.content });
        }
      }
    }
    
    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      system: systemPrompt || undefined,
      messages: apiMessages,
    });
    
    const textContent = response.content.find((c: any) => c.type === 'text');
    
    return {
      content: (textContent as any)?.text || '',
      tokensUsed: (response.usage?.input_tokens || 0) + (response.usage?.output_tokens || 0),
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

async function fetchImageAsBase64(url: string): Promise<string> {
  // If already a data URL, extract the base64 part
  if (url.startsWith('data:')) {
    return url.split(',')[1];
  }
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  return Buffer.from(buffer).toString('base64');
}

function getMediaType(url: string): 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp' {
  if (url.includes('.png') || url.includes('image/png')) return 'image/png';
  if (url.includes('.gif') || url.includes('image/gif')) return 'image/gif';
  if (url.includes('.webp') || url.includes('image/webp')) return 'image/webp';
  return 'image/jpeg';
}
