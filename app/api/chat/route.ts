// Chat API Route - Send message to specific AI model

import { NextRequest, NextResponse } from 'next/server';
import { chatWithProvider } from '@/lib/ai/providers';
import { AI_MODELS } from '@/lib/ai/types';
import { PROFESSIONAL_ANALYSIS_PROMPT, PROFESSIONAL_ANALYSIS_PROMPT_TEXT_ONLY } from '@/lib/ai/prompts';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { modelName, messages, systemPrompt, conversationId } = await request.json();
    
    if (!modelName || !messages || messages.length === 0) {
      return NextResponse.json(
        { error: 'modelName and messages are required' },
        { status: 400 }
      );
    }
    
    // Find model config
    const model = AI_MODELS.find(m => m.name === modelName);
    if (!model) {
      return NextResponse.json(
        { error: `Unknown model: ${modelName}` },
        { status: 400 }
      );
    }
    
    // Determine system prompt
    let finalSystemPrompt: string | undefined;
    if (systemPrompt && systemPrompt.trim()) {
      finalSystemPrompt = systemPrompt;
    } else if (model.hasSystemPrompt) {
      finalSystemPrompt = model.supportsVision 
        ? PROFESSIONAL_ANALYSIS_PROMPT 
        : PROFESSIONAL_ANALYSIS_PROMPT_TEXT_ONLY;
    }
    
    // Call AI provider with full conversation history
    const response = await chatWithProvider(
      model.provider,
      messages,
      model.apiKey,
      finalSystemPrompt
    );
    
    // Save to database
    let dbConversationId = conversationId;
    try {
      // Create conversation if not exists
      if (!dbConversationId) {
        const { data: conv, error: convErr } = await supabase
          .from('conversations')
          .insert({
            model_name: modelName,
            provider: model.provider,
            has_system_prompt: model.hasSystemPrompt,
            system_prompt: finalSystemPrompt || null,
          })
          .select()
          .single();
        
        if (!convErr && conv) {
          dbConversationId = conv.id;
        }
      } else {
        // Update timestamp
        await supabase
          .from('conversations')
          .update({ updated_at: new Date().toISOString() })
          .eq('id', dbConversationId);
      }
      
      if (dbConversationId) {
        // Save user message (last one in the array)
        const lastUserMsg = messages[messages.length - 1];
        await supabase.from('chat_messages').insert({
          conversation_id: dbConversationId,
          role: 'user',
          content: lastUserMsg.content,
          image_url: lastUserMsg.imageUrl || null,
        });
        
        // Save assistant response
        if (response.content && !response.error) {
          await supabase.from('chat_messages').insert({
            conversation_id: dbConversationId,
            role: 'assistant',
            content: response.content,
            tokens_used: response.tokensUsed || null,
            response_time: response.responseTime || null,
          });
        }
      }
    } catch (dbError) {
      console.error('Database save error:', dbError);
      // Don't fail the request if DB save fails
    }
    
    return NextResponse.json({
      success: true,
      response,
      conversationId: dbConversationId,
    });
    
  } catch (error: any) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
