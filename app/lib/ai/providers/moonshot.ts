// Moonshot AI Kimi K2.5 Provider - Multi-turn Chat

import { ChatResponse } from '../types';

interface ChatMessageInput {
  role: 'user' | 'assistant';
  content: string;
  imageUrl?: string;
}

export async function chatWithKimiK25(
  messages: ChatMessageInput[],
  apiKey: string,
  systemPrompt?: string
): Promise<ChatResponse> {
  const startTime = Date.now();
  
  try {
    const apiMessages: any[] = [];
    
    if (systemPrompt) {
      apiMessages.push({ role: 'system', content: systemPrompt });
    }
    
    for (const msg of messages) {
      if (msg.role === 'assistant') {
        apiMessages.push({ role: 'assistant', content: msg.content });
      } else {
        if (msg.imageUrl) {
          apiMessages.push({
            role: 'user',
            content: [
              { type: 'text', text: msg.content || 'Analyze this image.' },
              { type: 'image_url', image_url: { url: msg.imageUrl } }
            ]
          });
        } else {
          apiMessages.push({ role: 'user', content: msg.content });
        }
      }
    }
    
    const response = await fetch('https://api.moonshot.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'kimi-k2.5',
        messages: apiMessages,
        max_tokens: 4000,
        temperature: 1.0,
        top_p: 0.95
      })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Kimi API error');
    }
    
    return {
      content: data.choices[0]?.message?.content || '',
      tokensUsed: data.usage?.total_tokens,
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
