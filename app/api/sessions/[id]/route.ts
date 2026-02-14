// API to get single conversation with all messages
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Get conversation
    const { data: conv, error: convErr } = await supabase
      .from('conversations')
      .select('*')
      .eq('id', id)
      .single();
    
    if (convErr) throw convErr;
    
    // Get messages
    const { data: messages, error: msgErr } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('conversation_id', id)
      .order('created_at', { ascending: true });
    
    if (msgErr) throw msgErr;
    
    return NextResponse.json({
      success: true,
      conversation: {
        id: conv.id,
        modelName: conv.model_name,
        provider: conv.provider,
        hasSystemPrompt: conv.has_system_prompt,
        systemPrompt: conv.system_prompt,
        createdAt: conv.created_at,
        updatedAt: conv.updated_at,
      },
      messages: (messages || []).map((m: any) => ({
        id: m.id,
        role: m.role,
        content: m.content,
        imageUrl: m.image_url,
        tokensUsed: m.tokens_used,
        responseTime: m.response_time,
        createdAt: m.created_at,
      }))
    });
    
  } catch (error: any) {
    console.error('Get conversation error:', error);
    return NextResponse.json(
      { error: error.message || 'Conversation not found' },
      { status: 404 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const { error } = await supabase
      .from('conversations')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return NextResponse.json({ success: true });
    
  } catch (error: any) {
    console.error('Delete conversation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete' },
      { status: 500 }
    );
  }
}
