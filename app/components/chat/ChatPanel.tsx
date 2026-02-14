'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Send, Image as ImageIcon, Loader2, AlertCircle, 
  Settings, X, Trash2, Clock, Copy, Check 
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useChatStore } from '@/lib/store/chatStore';
import { ChatMessage } from '@/lib/ai/types';
import { PROFESSIONAL_ANALYSIS_PROMPT, PROFESSIONAL_ANALYSIS_PROMPT_TEXT_ONLY } from '@/lib/ai/prompts';

interface ChatPanelProps {
  modelName: string;
  provider: 'openai' | 'anthropic' | 'moonshot' | 'gemini';
  hasSystemPrompt: boolean;
  supportsVision: boolean;
  fullSize?: boolean;
}

export function ChatPanel({ modelName, provider, hasSystemPrompt, supportsVision, fullSize = false }: ChatPanelProps) {
  const [input, setInput] = useState('');
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  const [pendingImageName, setPendingImageName] = useState<string>('');
  const [showSettings, setShowSettings] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const { 
    conversations, 
    initConversation, 
    addUserMessage, 
    addAssistantMessage, 
    setLoading, 
    setSystemPrompt,
    setConversationId,
    clearConversation 
  } = useChatStore();
  
  const defaultSystemPrompt = hasSystemPrompt
    ? (supportsVision ? PROFESSIONAL_ANALYSIS_PROMPT : PROFESSIONAL_ANALYSIS_PROMPT_TEXT_ONLY)
    : '';
  const conversation = conversations[modelName];
  const messages = conversation?.messages || [];
  const isLoading = conversation?.isLoading || false;
  const systemPrompt = conversation?.systemPrompt ?? defaultSystemPrompt;
  
  useEffect(() => {
    initConversation(modelName, defaultSystemPrompt);
  }, [modelName, defaultSystemPrompt, initConversation]);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);
  
  useEffect(() => {
    if (fullSize) {
      textareaRef.current?.focus();
    }
  }, [fullSize]);
  
  const compressImage = (file: File, maxWidth = 1024, quality = 0.7): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new window.Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let w = img.width;
          let h = img.height;
          if (w > maxWidth) {
            h = (h * maxWidth) / w;
            w = maxWidth;
          }
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d')!;
          ctx.drawImage(img, 0, 0, w, h);
          resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    });
  };
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPendingImageName(file.name);
      const compressed = await compressImage(file);
      setPendingImage(compressed);
    }
    // Reset input so same file can be selected again
    if (e.target) e.target.value = '';
  };
  
  const handleSend = async () => {
    const text = input.trim();
    if (!text && !pendingImage) return;
    if (isLoading) return;
    
    const messageContent = text || (pendingImage ? 'Analyze this image.' : '');
    const imageUrl = pendingImage || undefined;
    
    addUserMessage(modelName, messageContent, imageUrl);
    
    setInput('');
    setPendingImage(null);
    setPendingImageName('');
    
    // Build full message history for API
    const allMessages = [
      ...messages.map(m => ({ role: m.role, content: m.content, imageUrl: m.imageUrl })),
      { role: 'user' as const, content: messageContent, imageUrl }
    ];
    
    setLoading(modelName, true);
    
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          modelName,
          messages: allMessages,
          systemPrompt: systemPrompt.trim() ? systemPrompt : undefined,
          conversationId: conversation?.conversationId || null,
        })
      });
      
      const data = await res.json();
      
      if (data.success && data.response) {
        const assistantMsg: ChatMessage = {
          id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          role: 'assistant',
          content: data.response.content || '',
          tokensUsed: data.response.tokensUsed,
          responseTime: data.response.responseTime,
          error: data.response.error,
          createdAt: new Date().toISOString(),
        };
        addAssistantMessage(modelName, assistantMsg);
        
        if (data.conversationId) {
          setConversationId(modelName, data.conversationId);
        }
      } else {
        addAssistantMessage(modelName, {
          id: `${Date.now()}-err`,
          role: 'assistant',
          content: '',
          error: data.error || 'Failed to get response',
          createdAt: new Date().toISOString(),
        });
      }
    } catch (err: any) {
      addAssistantMessage(modelName, {
        id: `${Date.now()}-err`,
        role: 'assistant',
        content: '',
        error: err.message || 'Network error',
        createdAt: new Date().toISOString(),
      });
    } finally {
      setLoading(modelName, false);
      textareaRef.current?.focus();
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  const handleCopy = async (content: string, id: string) => {
    await navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };
  
  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      {/* System Prompt Editor */}
      {showSettings && (
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 shrink-0">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs text-gray-600 font-medium uppercase tracking-wide">System Prompt</label>
            <button onClick={() => setShowSettings(false)} className="p-1 hover:bg-gray-200 rounded">
              <X className="w-3 h-3 text-gray-400" />
            </button>
          </div>
          <textarea
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(modelName, e.target.value)}
            placeholder="Enter system prompt for this model..."
            className={`w-full ${fullSize ? 'h-24' : 'h-16'} px-3 py-2 bg-white border border-gray-300 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-500 resize-none font-light rounded`}
          />
          {hasSystemPrompt && (
            <p className="mt-2 text-[11px] text-gray-500 font-light">
              Default prompt loaded for Guided mode. You can edit it for this conversation.
            </p>
          )}
        </div>
      )}
      
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className={`${fullSize ? 'max-w-3xl mx-auto' : ''} px-4 py-4 space-y-4`}>
          {/* Empty state */}
          {messages.length === 0 && !isLoading && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-12 h-12 border border-gray-200 rounded-full flex items-center justify-center mb-4">
                <Send className="w-5 h-5 text-gray-300" />
              </div>
              <p className="text-sm text-gray-500 font-light mb-1">
                Start a conversation with {modelName.split(' (')[0]}
              </p>
              <p className="text-xs text-gray-400 font-light">
                {supportsVision 
                  ? 'Type a message or attach an image to begin.' 
                  : 'Type a message to begin. This model does not support images.'}
              </p>
              <button
                onClick={() => setShowSettings(true)}
                className="mt-4 text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1 transition-colors"
              >
                <Settings className="w-3 h-3" />
                {hasSystemPrompt ? 'View system prompt' : 'Configure system prompt'}
              </button>
            </div>
          )}
          
          {/* Messages */}
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`${fullSize ? 'max-w-[70%]' : 'max-w-[85%]'} rounded-lg ${
                msg.role === 'user' 
                  ? 'bg-gray-900 text-white px-4 py-3' 
                  : msg.error 
                    ? 'bg-red-50 border border-red-200 px-4 py-3'
                    : 'bg-white border border-gray-200 px-4 py-3 text-gray-900'
              }`}>
                {/* Image */}
                {msg.imageUrl && (
                  <img 
                    src={msg.imageUrl} 
                    alt="Attached" 
                    className={`${fullSize ? 'max-h-64' : 'max-h-40'} rounded mb-2 object-contain`}
                  />
                )}
                
                {/* Content */}
                {msg.error ? (
                  <div className="flex items-start gap-2 text-red-600">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span className="text-sm">{msg.error}</span>
                  </div>
                ) : msg.role === 'assistant' ? (
                  <div className={`text-sm leading-relaxed font-normal text-gray-900 prose ${fullSize ? 'prose-base' : 'prose-sm'} max-w-none prose-headings:font-semibold prose-headings:text-gray-900 prose-p:text-gray-900 prose-li:text-gray-900 prose-strong:text-gray-900 prose-code:text-gray-900 prose-code:bg-gray-100 prose-code:px-1 prose-code:rounded`}>
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                ) : (
                  <p className={`${fullSize ? 'text-sm' : 'text-xs'} whitespace-pre-wrap`}>{msg.content}</p>
                )}
                
                {/* Meta for assistant */}
                {msg.role === 'assistant' && !msg.error && msg.content && (
                  <div className="flex items-center gap-3 mt-2 pt-2 border-t border-gray-200/50">
                    {msg.responseTime && (
                      <span className="text-[10px] text-gray-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {(msg.responseTime / 1000).toFixed(1)}s
                      </span>
                    )}
                    {msg.tokensUsed && (
                      <span className="text-[10px] text-gray-400">
                        {msg.tokensUsed.toLocaleString()} tokens
                      </span>
                    )}
                    <button
                      onClick={() => handleCopy(msg.content, msg.id)}
                      className="ml-auto p-1 hover:bg-gray-200 rounded transition-colors"
                    >
                      {copiedId === msg.id 
                        ? <Check className="w-3 h-3 text-green-500" />
                        : <Copy className="w-3 h-3 text-gray-400" />
                      }
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {/* Loading */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
                  <span className="text-sm text-gray-500 font-light">Thinking...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Pending Image Preview */}
      {pendingImage && (
        <div className={`${fullSize ? 'max-w-3xl mx-auto w-full' : ''} px-4 py-2 border-t border-gray-100 shrink-0`}>
          <div className="flex items-center gap-3 bg-gray-50 rounded px-3 py-2">
            <img src={pendingImage} alt="Pending" className="w-12 h-12 object-cover rounded border border-gray-200" />
            <span className="text-xs text-gray-500 truncate flex-1">{pendingImageName}</span>
            <button 
              onClick={() => { setPendingImage(null); setPendingImageName(''); }} 
              className="p-1 hover:bg-gray-200 rounded"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>
      )}
      
      {/* Input Area */}
      <div className={`${fullSize ? 'max-w-3xl mx-auto w-full' : ''} px-4 py-3 border-t border-gray-200 bg-white shrink-0`}>
        <div className="flex items-end gap-2">
          {/* Action buttons */}
          <div className="flex items-center gap-1 shrink-0">
            {supportsVision && (
              <>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 hover:bg-gray-100 transition-colors rounded"
                  title="Attach image"
                >
                  <ImageIcon className="w-5 h-5 text-gray-400" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </>
            )}
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`p-2 hover:bg-gray-100 transition-colors rounded ${showSettings ? 'bg-gray-100' : ''}`}
              title="System prompt settings"
            >
              <Settings className="w-5 h-5 text-gray-400" />
            </button>
            <button
              onClick={() => clearConversation(modelName)}
              className="p-2 hover:bg-gray-100 transition-colors rounded"
              title="Clear conversation"
            >
              <Trash2 className="w-5 h-5 text-gray-300 hover:text-gray-500" />
            </button>
          </div>
          
          {/* Text input */}
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message... (Enter to send, Shift+Enter for new line)"
            rows={1}
            className={`flex-1 px-4 py-2.5 bg-gray-50 border border-gray-300 ${fullSize ? 'text-sm' : 'text-xs'} text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-500 focus:bg-white resize-none rounded-lg font-light transition-colors`}
            style={{ maxHeight: fullSize ? '120px' : '60px' }}
          />
          
          {/* Send button */}
          <button
            onClick={handleSend}
            disabled={(!input.trim() && !pendingImage) || isLoading}
            className="p-2.5 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 text-white rounded-lg shrink-0 transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
