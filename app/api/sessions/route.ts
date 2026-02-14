// API to list conversations
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    // Get all conversations with message count
    const { data: conversations, error } = await supabase
      .from('conversations')
      .select(`
        id,
        model_name,
        provider,
        has_system_prompt,
        system_prompt,
        created_at,
        updated_at,
        chat_messages(count)
      `)
      .order('updated_at', { ascending: false })
      .limit(100);
    
    if (error) throw error;
    
    // Format data
    const formatted = (conversations || []).map((conv: any) => ({
      id: conv.id,
      modelName: conv.model_name,
      provider: conv.provider,
      hasSystemPrompt: conv.has_system_prompt,
      messageCount: conv.chat_messages?.[0]?.count || 0,
      createdAt: conv.created_at,
      updatedAt: conv.updated_at,
    }));
    
    return NextResponse.json({
      success: true,
      conversations: formatted
    });
    
  } catch (error: any) {
    console.error('Get conversations error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch conversations' },
      { status: 500 }
    );
  }
}
