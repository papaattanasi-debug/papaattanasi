'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { ArrowLeft, MessageSquare, Trash2, Download, LogOut } from 'lucide-react';

interface ConversationSummary {
  id: string;
  modelName: string;
  provider: string;
  hasSystemPrompt: boolean;
  messageCount: number;
  createdAt: string;
  updatedAt: string;
}

const providerColors: Record<string, string> = {
  openai: 'border-l-green-400',
  anthropic: 'border-l-orange-400',
  moonshot: 'border-l-purple-400',
  deepseek: 'border-l-blue-400',
};

export default function HistoryPage() {
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  
  useEffect(() => {
    fetchConversations();
  }, []);
  
  const fetchConversations = async () => {
    try {
      const res = await fetch('/api/sessions');
      const data = await res.json();
      if (data.success) {
        setConversations(data.conversations);
      }
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleDelete = async (id: string) => {
    if (!confirm('Delete this conversation?')) return;
    
    try {
      const res = await fetch(`/api/sessions/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setConversations(prev => prev.filter(c => c.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete:', error);
    }
  };
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };
  
  // Group by model
  const grouped = conversations.reduce<Record<string, ConversationSummary[]>>((acc, conv) => {
    if (!acc[conv.modelName]) acc[conv.modelName] = [];
    acc[conv.modelName].push(conv);
    return acc;
  }, {});
  
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-300 bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/analyze" className="p-2 hover:bg-gray-100 transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-2xl font-normal text-gray-900">Chat History</h1>
              <p className="text-sm text-gray-600 font-light">PAPA ATTANASI</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <span>
              {conversations.length} conversation{conversations.length !== 1 ? 's' : ''}
            </span>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-600 text-xs transition-colors flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              Logout
            </button>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="max-w-5xl mx-auto p-6">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500 font-light">Loading conversations...</p>
          </div>
        ) : conversations.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-light">No conversations yet</p>
            <Link 
              href="/analyze"
              className="inline-block mt-4 px-4 py-2 bg-gray-900 text-white text-sm hover:bg-gray-800"
            >
              Start Chatting
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(grouped).map(([modelName, convs]) => (
              <div key={modelName}>
                <h2 className="text-sm font-normal text-gray-900 mb-3 uppercase tracking-wide">
                  {modelName}
                </h2>
                <div className="space-y-2">
                  {convs.map((conv) => (
                    <div 
                      key={conv.id}
                      className={`border border-gray-200 border-l-4 ${providerColors[conv.provider] || 'border-l-gray-400'} p-4 hover:bg-gray-50 transition-colors`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div>
                            <p className="text-sm text-gray-900">
                              {conv.messageCount} messages
                            </p>
                            <p className="text-xs text-gray-500 font-light">
                              {conv.hasSystemPrompt ? 'Guided' : 'Custom Prompt'} · 
                              Started {new Date(conv.createdAt).toLocaleDateString()} · 
                              Updated {new Date(conv.updatedAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/history/${conv.id}`}
                            className="px-3 py-1.5 bg-white border border-gray-300 hover:bg-gray-100 text-gray-900 text-xs transition-colors"
                          >
                            View Chat
                          </Link>
                          <button
                            onClick={() => handleDelete(conv.id)}
                            className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
