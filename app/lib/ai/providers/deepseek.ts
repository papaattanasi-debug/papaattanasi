// DeepSeek V3.2 Provider - Multi-turn Chat

import { ChatResponse } from '../types';

interface ChatMessageInput {
  role: 'user' | 'assistant';
  content: string;
  imageUrl?: string;
}

export async function chatWithDeepSeekV32(
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
        // DeepSeek non supporta immagini - manda solo testo
        let text = msg.content;
        if (msg.imageUrl) {
          text += '\n\n[Note: This model does not support direct image analysis. Please describe the image or refer to vision-capable models.]';
        }
        apiMessages.push({ role: 'user', content: text });
      }
    }
    
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: apiMessages,
        max_tokens: 4000,
        temperature: 0.7
      })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'DeepSeek API error');
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
