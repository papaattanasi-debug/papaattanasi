'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { ArrowLeft, Download, Clock, Copy, Check, LogOut } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import jsPDF from 'jspdf';
import AuthGuard from '@/components/auth/AuthGuard';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  imageUrl?: string;
  tokensUsed?: number;
  responseTime?: number;
  createdAt: string;
}

interface ConversationDetail {
  id: string;
  modelName: string;
  provider: string;
  hasSystemPrompt: boolean;
  systemPrompt?: string;
  createdAt: string;
  updatedAt: string;
}

const providerBadge: Record<string, string> = {
  openai: 'bg-green-50 text-green-700',
  anthropic: 'bg-orange-50 text-orange-700',
  moonshot: 'bg-purple-50 text-purple-700',
  deepseek: 'bg-blue-50 text-blue-700',
};

export default function ConversationDetailPage() {
  return (
    <AuthGuard>
      <ConversationDetailContent />
    </AuthGuard>
  );
}

function ConversationDetailContent() {
  const params = useParams();
  const router = useRouter();
  const [conversation, setConversation] = useState<ConversationDetail | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  useEffect(() => {
    if (params.id) {
      fetchConversation(params.id as string);
    }
  }, [params.id]);
  
  const fetchConversation = async (id: string) => {
    try {
      const res = await fetch(`/api/sessions/${id}`);
      const data = await res.json();
      if (data.success) {
        setConversation(data.conversation);
        setMessages(data.messages);
      }
    } catch (error) {
      console.error('Failed to fetch conversation:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleCopy = async (content: string, id: string) => {
    await navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };
  
  const exportToPDF = () => {
    if (!conversation) return;
    
    const doc = new jsPDF();
    
    doc.setFontSize(16);
    doc.text('AI Research Judgment Platform', 14, 20);
    doc.setFontSize(12);
    doc.text('PAPA ATTANASI', 14, 28);
    
    doc.setFontSize(10);
    doc.text(`Model: ${conversation.modelName}`, 14, 38);
    doc.text(`Provider: ${conversation.provider}`, 14, 44);
    doc.text(`Type: ${conversation.hasSystemPrompt ? 'Guided' : 'Custom Prompt'}`, 14, 50);
    doc.text(`Date: ${new Date(conversation.createdAt).toLocaleString()}`, 14, 56);
    doc.text(`Messages: ${messages.length}`, 14, 62);
    
    let yPos = 72;
    
    messages.forEach((msg, i) => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
      
      doc.setFontSize(9);
      doc.setFont(undefined!, 'bold');
      doc.text(`[${msg.role.toUpperCase()}] ${new Date(msg.createdAt).toLocaleTimeString()}`, 14, yPos);
      yPos += 5;
      
      doc.setFont(undefined!, 'normal');
      doc.setFontSize(8);
      
      if (msg.content) {
        const lines = doc.splitTextToSize(msg.content, 180);
        const maxLines = Math.min(lines.length, 30);
        doc.text(lines.slice(0, maxLines), 14, yPos);
        yPos += maxLines * 4 + 3;
        if (lines.length > 30) {
          doc.text('... [truncated]', 14, yPos);
          yPos += 5;
        }
      }
      
      if (msg.tokensUsed || msg.responseTime) {
        doc.setFontSize(7);
        doc.text(
          `Tokens: ${msg.tokensUsed || 'N/A'} | Time: ${msg.responseTime ? (msg.responseTime/1000).toFixed(2) + 's' : 'N/A'}`,
          14, yPos
        );
        yPos += 5;
      }
      
      yPos += 3;
    });
    
    doc.save(`chat_${conversation.modelName.replace(/\s+/g, '_')}_${conversation.id.substring(0, 8)}.pdf`);
  };
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-500 font-light">Loading conversation...</p>
      </div>
    );
  }
  
  if (!conversation) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4 font-light">Conversation not found</p>
          <Link href="/history" className="text-gray-900 hover:underline text-sm">Back to History</Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-300 bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/history" className="p-2 hover:bg-gray-100 transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-normal text-gray-900">{conversation.modelName}</h1>
                <span className={`text-xs px-2 py-0.5 rounded ${providerBadge[conversation.provider] || 'bg-gray-100 text-gray-700'}`}>
                  {conversation.provider}
                </span>
              </div>
              <p className="text-sm text-gray-500 font-light">
                {conversation.hasSystemPrompt ? 'Guided Analysis' : 'Custom Prompt'} · 
                {messages.length} messages · 
                {new Date(conversation.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={exportToPDF}
              className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-sm transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export PDF
            </button>
            <button
              onClick={handleLogout}
              className="px-3 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-600 text-sm transition-colors flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>
      
      {/* System Prompt */}
      {conversation.systemPrompt && (
        <div className="max-w-4xl mx-auto px-6 pt-4">
          <div className="bg-gray-50 border border-gray-200 p-4 rounded">
            <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">System Prompt</p>
            <p className="text-sm text-gray-700 font-light whitespace-pre-wrap">{conversation.systemPrompt}</p>
          </div>
        </div>
      )}
      
      {/* Messages */}
      <div className="max-w-4xl mx-auto p-6 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-lg px-4 py-3 ${
              msg.role === 'user' 
                ? 'bg-gray-900 text-white' 
                : 'bg-gray-50 border border-gray-200'
            }`}>
              {/* Image */}
              {msg.imageUrl && (
                <img src={msg.imageUrl} alt="Attached" className="max-w-full max-h-64 rounded mb-2 object-contain" />
              )}
              
              {/* Content */}
              {msg.role === 'assistant' ? (
                <div className="prose prose-sm max-w-none prose-headings:font-normal prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:font-light">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              ) : (
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              )}
              
              {/* Meta */}
              {msg.role === 'assistant' && (
                <div className="flex items-center gap-3 mt-2 pt-2 border-t border-gray-200/50">
                  {msg.responseTime && (
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {(msg.responseTime / 1000).toFixed(1)}s
                    </span>
                  )}
                  {msg.tokensUsed && (
                    <span className="text-xs text-gray-400">{msg.tokensUsed.toLocaleString()} tokens</span>
                  )}
                  <span className="text-xs text-gray-400">{new Date(msg.createdAt).toLocaleTimeString()}</span>
                  <button
                    onClick={() => handleCopy(msg.content, msg.id)}
                    className="ml-auto p-1 hover:bg-gray-200 rounded"
                  >
                    {copiedId === msg.id 
                      ? <Check className="w-3 h-3 text-green-500" />
                      : <Copy className="w-3 h-3 text-gray-400" />
                    }
                  </button>
                </div>
              )}
              
              {msg.role === 'user' && (
                <p className="text-[10px] text-gray-400 mt-1">{new Date(msg.createdAt).toLocaleTimeString()}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
