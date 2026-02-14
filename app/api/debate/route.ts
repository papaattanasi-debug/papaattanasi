// Debate API - One turn at a time, with optional image context

import { NextRequest, NextResponse } from 'next/server';
import { chatWithProvider } from '@/lib/ai/providers';
import { AI_MODELS } from '@/lib/ai/types';

export async function POST(request: NextRequest) {
  try {
    const { modelName, messages, topic, imageUrl } = await request.json();
    
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
    
    // Build system prompt for debate
    const hasImage = !!imageUrl;
    const debateSystemPrompt = hasImage
      ? `You are participating in an intellectual debate/discussion with another AI model. You are analyzing and discussing image(s) that have been shared. The discussion topic is: "${topic}"

Rules:
- Analyze the image(s) carefully and reference specific visual elements in your arguments.
- Respond directly to what the other model said (or start the discussion if you go first).
- Be thoughtful, articulate, and bring unique perspectives about what you see.
- Keep responses concise but substantive (2-4 paragraphs max).
- You may agree, disagree, or build upon points made.
- Be respectful but don't hesitate to challenge ideas.
- Do NOT mention that you are an AI or reference your model name.`
      : `You are participating in an intellectual debate/discussion with another AI model. The topic is: "${topic}"

Rules:
- Respond directly to what the other model said (or start the discussion if you go first).
- Be thoughtful, articulate, and bring unique perspectives.
- Keep responses concise but substantive (2-4 paragraphs max).
- You may agree, disagree, or build upon points made.
- Be respectful but don't hesitate to challenge ideas.
- Do NOT mention that you are an AI or reference your model name.`;
    
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
    
    // If first turn, add starter with optional image
    if (apiMessages.length === 0) {
      apiMessages.push({
        role: 'user',
        content: hasImage 
          ? `Let's discuss this image. Topic: "${topic}". Please share your opening analysis and thoughts.`
          : `Let's discuss: "${topic}". Please share your opening thoughts.`,
        imageUrl: imageUrl || undefined,
      });
    }
    
    // If last message is from this model, add continuation prompt
    if (apiMessages.length > 0 && apiMessages[apiMessages.length - 1].role === 'assistant') {
      apiMessages.push({
        role: 'user',
        content: 'Please continue the discussion.',
      });
    }
    
    const response = await chatWithProvider(
      model.provider,
      apiMessages,
      model.apiKey,
      debateSystemPrompt
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
