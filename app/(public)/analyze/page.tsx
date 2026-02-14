'use client';

import { useState } from 'react';
import { ChatPanel } from '@/components/chat/ChatPanel';
import { useChatStore } from '@/lib/store/chatStore';
import Link from 'next/link';
import { History, ArrowLeft, MessageSquare, Settings, Zap, Swords, BookOpen, LogOut } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import AuthGuard from '@/components/auth/AuthGuard';

const models = [
  { name: 'GPT-5.2 Thinking (Guided)', provider: 'openai' as const, hasSystemPrompt: true, supportsVision: true },
  { name: 'GPT-5.2 Thinking (Custom)', provider: 'openai' as const, hasSystemPrompt: false, supportsVision: true },
  { name: 'Claude Opus 4.6 (Guided)', provider: 'anthropic' as const, hasSystemPrompt: true, supportsVision: true },
  { name: 'Claude Opus 4.6 (Custom)', provider: 'anthropic' as const, hasSystemPrompt: false, supportsVision: true },
  { name: 'Kimi K2.5 (Guided)', provider: 'moonshot' as const, hasSystemPrompt: true, supportsVision: true },
  { name: 'Kimi K2.5 (Custom)', provider: 'moonshot' as const, hasSystemPrompt: false, supportsVision: true },
  { name: 'Gemini 2.0 Flash (Guided)', provider: 'gemini' as const, hasSystemPrompt: true, supportsVision: true },
  { name: 'Gemini 2.0 Flash (Custom)', provider: 'gemini' as const, hasSystemPrompt: false, supportsVision: true },
];

const providerStyle: Record<string, { dot: string; bg: string; border: string; label: string }> = {
  openai: { dot: 'bg-green-500', bg: 'hover:bg-green-50', border: 'border-l-green-400', label: 'OpenAI' },
  anthropic: { dot: 'bg-orange-500', bg: 'hover:bg-orange-50', border: 'border-l-orange-400', label: 'Anthropic' },
  moonshot: { dot: 'bg-purple-500', bg: 'hover:bg-purple-50', border: 'border-l-purple-400', label: 'Moonshot' },
  gemini: { dot: 'bg-blue-500', bg: 'hover:bg-blue-50', border: 'border-l-blue-400', label: 'Google' },
};

export default function AnalyzePage() {
  return (
    <AuthGuard>
      <AnalyzeContent />
    </AuthGuard>
  );
}

function AnalyzeContent() {
  const [activeModel, setActiveModel] = useState<string | null>(null);
  const { conversations } = useChatStore();
  const router = useRouter();
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };
  
  const activeModelConfig = models.find(m => m.name === activeModel);
  
  // Model list view
  if (!activeModel) {
    return (
      <div className="flex flex-col h-screen bg-white">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-gray-200 bg-white shrink-0">
          <div>
            <h1 className="text-2xl font-normal text-gray-900 tracking-tight">AI Research Judgment Platform</h1>
            <p className="text-sm text-gray-600 tracking-wide mt-0.5">PAPA ATTANASI</p>
            <p className="flex items-center gap-1.5 text-xs text-gray-400 mt-1">
              Funded by
              <a href="https://agentics.eu.com" aria-label="Agentics website">
                <img src="/agentics-logo.svg" alt="Agentics" className="h-4 inline" />
              </a>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link 
              href="/debate"
              className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-normal transition-colors flex items-center gap-2"
            >
              <Swords className="w-4 h-4" />
              AI Debate
            </Link>
            <Link 
              href="/predictions"
              className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-normal transition-colors flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              Predictions
            </Link>
            <Link 
              href="/history"
              className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-normal transition-colors flex items-center gap-2"
            >
              <History className="w-4 h-4" />
              History
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-white border border-gray-300 hover:bg-red-50 hover:border-red-300 hover:text-red-600 text-gray-700 text-sm font-normal transition-colors flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
        
        {/* Model List */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto py-8 px-6">
            <p className="text-sm text-gray-500 font-light mb-6">
              Select a model to start a conversation. Each model maintains its own chat history.
            </p>
            
            <div className="space-y-2">
              {models.map((model) => {
                const style = providerStyle[model.provider];
                const conv = conversations[model.name];
                const msgCount = conv?.messages?.length || 0;
                
                return (
                  <button
                    key={model.name}
                    onClick={() => setActiveModel(model.name)}
                    className={`w-full text-left border border-gray-200 border-l-4 ${style.border} ${style.bg} p-5 transition-all group`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-2.5 h-2.5 rounded-full ${style.dot}`} />
                        <div>
                          <h3 className="text-sm font-medium text-gray-900 group-hover:text-gray-700">
                            {model.name}
                          </h3>
                          <p className="text-xs text-gray-500 font-light mt-0.5">
                            {style.label} · {model.hasSystemPrompt ? 'Guided Analysis' : 'Custom Prompt'} · {model.supportsVision ? 'Vision' : 'Text only'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {msgCount > 0 && (
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <MessageSquare className="w-3 h-3" />
                            {msgCount}
                          </span>
                        )}
                        {model.hasSystemPrompt ? (
                          <Zap className="w-4 h-4 text-gray-300" />
                        ) : (
                          <Settings className="w-4 h-4 text-gray-300" />
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="flex items-center justify-center px-6 py-5 border-t border-gray-200 bg-gray-50 shrink-0">
          <span className="flex items-center gap-3 text-sm text-gray-500">
            Funded by
            <a href="https://agentics.eu.com" aria-label="Agentics website">
              <img src="/agentics-logo.svg" alt="Agentics" className="h-8 inline" />
            </a>
          </span>
        </div>
      </div>
    );
  }
  
  // Chat view for selected model
  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Chat Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200 bg-white shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveModel(null)}
            className="p-2 hover:bg-gray-100 transition-colors rounded"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h2 className="text-base font-normal text-gray-900">{activeModel}</h2>
            <p className="text-xs text-gray-500 font-light">
              {providerStyle[activeModelConfig!.provider].label} · 
              {activeModelConfig!.hasSystemPrompt ? ' Guided Analysis' : ' Custom Prompt'} · 
              {activeModelConfig!.supportsVision ? ' Vision enabled' : ' Text only'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link 
            href="/history"
            className="px-3 py-1.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-600 text-xs transition-colors flex items-center gap-1.5"
          >
            <History className="w-3.5 h-3.5" />
            History
          </Link>
        </div>
      </div>
      
      {/* Full-size Chat Panel */}
      <div className="flex-1 overflow-hidden">
        <ChatPanel
          modelName={activeModelConfig!.name}
          provider={activeModelConfig!.provider}
          hasSystemPrompt={activeModelConfig!.hasSystemPrompt}
          supportsVision={activeModelConfig!.supportsVision}
          fullSize
        />
      </div>
    </div>
  );
}
