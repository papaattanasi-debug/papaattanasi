// Google Gemini Provider - Multi-turn Chat

import { GoogleGenerativeAI, Content, Part } from '@google/generative-ai';
import { ChatResponse } from '../types';

interface ChatMessageInput {
  role: 'user' | 'assistant';
  content: string;
  imageUrl?: string;
}

export async function chatWithGemini(
  messages: ChatMessageInput[],
  apiKey: string,
  systemPrompt?: string
): Promise<ChatResponse> {
  const startTime = Date.now();
  
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash',
      systemInstruction: systemPrompt || undefined,
    });
    
    // Build conversation history for Gemini format
    const history: Content[] = [];
    
    for (let i = 0; i < messages.length - 1; i++) {
      const msg = messages[i];
      const parts: Part[] = [];
      
      if (msg.imageUrl) {
        const imageData = await fetchImageData(msg.imageUrl);
        if (imageData) {
          parts.push({ inlineData: imageData });
        }
      }
      
      parts.push({ text: msg.content || 'Analyze this image.' });
      
      history.push({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts,
      });
    }
    
    // Start chat with history
    const chat = model.startChat({ history });
    
    // Send the last message
    const lastMsg = messages[messages.length - 1];
    const lastParts: Part[] = [];
    
    if (lastMsg.imageUrl) {
      const imageData = await fetchImageData(lastMsg.imageUrl);
      if (imageData) {
        lastParts.push({ inlineData: imageData });
      }
    }
    
    lastParts.push({ text: lastMsg.content || 'Analyze this image.' });
    
    const result = await chat.sendMessage(lastParts);
    const response = result.response;
    const text = response.text();
    
    const usage = response.usageMetadata;
    const totalTokens = usage 
      ? (usage.promptTokenCount || 0) + (usage.candidatesTokenCount || 0)
      : undefined;
    
    return {
      content: text,
      tokensUsed: totalTokens,
      responseTime: Date.now() - startTime,
    };
  } catch (error: any) {
    return {
      content: '',
      responseTime: Date.now() - startTime,
      error: error.message,
    };
  }
}

async function fetchImageData(url: string): Promise<{ mimeType: string; data: string } | null> {
  try {
    if (url.startsWith('data:')) {
      // Parse data URL
      const match = url.match(/^data:([^;]+);base64,(.+)$/);
      if (match) {
        return { mimeType: match[1], data: match[2] };
      }
      return null;
    }
    
    // Fetch from URL
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    return { mimeType: contentType, data: base64 };
  } catch {
    return null;
  }
}
