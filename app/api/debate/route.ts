// Debate API - One turn at a time, with optional image context

import { NextRequest, NextResponse } from 'next/server';
import { chatWithProvider } from '@/lib/ai/providers';
import { AI_MODELS } from '@/lib/ai/types';

// Increase serverless function timeout and body size
export const maxDuration = 60; // 60 seconds for AI responses

export async function POST(request: NextRequest) {
  try {
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      return NextResponse.json(
        { error: 'Request body too large or invalid JSON. Try using a smaller image.' },
        { status: 413 }
      );
    }
    const { modelName, messages, topic, imageUrl } = body;
    
    if (!modelName || !topic) {
      return NextResponse.json(
        { error: 'modelName and topic are required' },
        { status: 400 }
      );
    }
    
    const model = AI_MODELS.find(m => m.name === modelName);
    if (!model) {
      return NextResponse.json(
        { error: `Unknown model: ${modelName}` },
        { status: 400 }
      );
    }
    
    const hasImage = !!imageUrl;
    
    // No system prompt - let models respond freely
    
    // Build messages for the API
    const apiMessages: Array<{ role: 'user' | 'assistant'; content: string; imageUrl?: string }> = [];
    
    if (messages && messages.length > 0) {
      for (const msg of messages) {
        if (msg.modelName === modelName) {
          apiMessages.push({ role: 'assistant', content: msg.content });
        } else {
          apiMessages.push({ role: 'user', content: msg.content });
        }
      }
    }
    
    // If first turn, use the topic as the initial prompt
    if (apiMessages.length === 0) {
      apiMessages.push({
        role: 'user',
        content: hasImage 
          ? topic
          : topic,
        imageUrl: imageUrl || undefined,
      });
    }
    
    // If last message is from this model, add a continuation prompt
    if (apiMessages.length > 0 && apiMessages[apiMessages.length - 1].role === 'assistant') {
      apiMessages.push({
        role: 'user',
        content: 'Continue.',
      });
    }
    
    const response = await chatWithProvider(
      model.provider,
      apiMessages,
      model.apiKey,
      undefined
    );
    
    return NextResponse.json({
      success: true,
      response: {
        content: response.content,
        tokensUsed: response.tokensUsed,
        responseTime: response.responseTime,
        error: response.error,
      }
    });
    
  } catch (error: any) {
    console.error('Debate error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
