'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useDebateStore, DebateMessage } from '@/lib/store/debateStore';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { 
  ArrowLeft, Play, Square, Clock, RotateCcw, 
  Loader2, MessageSquare, Copy, Check, Image as ImageIcon, X, Plus
} from 'lucide-react';
import AuthGuard from '@/components/auth/AuthGuard';

const models = [
  { name: 'GPT-5.2 Thinking (Guided)', provider: 'openai', short: 'GPT-5.2' },
  { name: 'GPT-5.2 Thinking (Custom)', provider: 'openai', short: 'GPT-5.2 Custom' },
  { name: 'Claude Opus 4.6 (Guided)', provider: 'anthropic', short: 'Claude 4.6' },
  { name: 'Claude Opus 4.6 (Custom)', provider: 'anthropic', short: 'Claude 4.6 Custom' },
  { name: 'Kimi K2.5 (Guided)', provider: 'moonshot', short: 'Kimi K2.5' },
  { name: 'Kimi K2.5 (Custom)', provider: 'moonshot', short: 'Kimi K2.5 Custom' },
  { name: 'Gemini 2.0 Flash (Guided)', provider: 'gemini', short: 'Gemini 2.0' },
  { name: 'Gemini 2.0 Flash (Custom)', provider: 'gemini', short: 'Gemini 2.0 Custom' },
];

const providerColor: Record<string, { dot: string; bg: string; text: string }> = {
  openai: { dot: 'bg-green-500', bg: 'bg-green-50 border-green-200', text: 'text-green-700' },
  anthropic: { dot: 'bg-orange-500', bg: 'bg-orange-50 border-orange-200', text: 'text-orange-700' },
  moonshot: { dot: 'bg-purple-500', bg: 'bg-purple-50 border-purple-200', text: 'text-purple-700' },
  gemini: { dot: 'bg-blue-500', bg: 'bg-blue-50 border-blue-200', text: 'text-blue-700' },
};

export default function DebatePage() {
  return (
    <AuthGuard>
      <DebateContent />
    </AuthGuard>
  );
}

function DebateContent() {
  const {
    modelA, modelB, topic, messages, isRunning, currentTurn, turnCount, maxTurns,
    setModels, setTopic, setMaxTurns, addMessage, setRunning, setCurrentTurn, incrementTurn, reset,
  } = useDebateStore();
  
  const [phase, setPhase] = useState<'setup' | 'debate'>('setup');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [debateImages, setDebateImages] = useState<string[]>([]);
  const [selectedA, setSelectedA] = useState<string | null>(null);
  const [selectedB, setSelectedB] = useState<string | null>(null);
  const [topicInput, setTopicInput] = useState('');
  const [turnsInput, setTurnsInput] = useState(20);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef(false);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isRunning]);
  
  const handleCopy = async (content: string, id: string) => {
    await navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };
  
  const runTurn = useCallback(async (
    currentModel: string,
    allMessages: DebateMessage[],
    debateTopic: string,
    imageUrl?: string
  ): Promise<DebateMessage | null> => {
    try {
      const res = await fetch('/api/debate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          modelName: currentModel,
          messages: allMessages.map(m => ({ modelName: m.modelName, content: m.content })),
          topic: debateTopic,
          imageUrl: imageUrl || null,
        })
      });
      
      let data;
      try {
        data = await res.json();
      } catch {
        return {
          id: `${Date.now()}-err`,
          modelName: currentModel,
          content: '',
          error: `Server error (${res.status}): ${res.statusText}. The image may be too large.`,
          createdAt: new Date().toISOString(),
        };
      }
      
      if (data.success && data.response) {
        return {
          id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          modelName: currentModel,
          content: data.response.content || '',
          tokensUsed: data.response.tokensUsed,
          responseTime: data.response.responseTime,
          error: data.response.error,
          createdAt: new Date().toISOString(),
        };
      } else {
        return {
          id: `${Date.now()}-err`,
          modelName: currentModel,
          content: '',
          error: data.error || 'Failed to get response',
          createdAt: new Date().toISOString(),
        };
      }
    } catch (err: any) {
      return {
        id: `${Date.now()}-err`,
        modelName: currentModel,
        content: '',
        error: err.message || 'Network error',
        createdAt: new Date().toISOString(),
      };
    }
  }, []);
  
  const startDebate = async (mA: string, mB: string, debateTopic: string, mTurns: number) => {
    // Set models in store
    setModels(mA, mB);
    setTopic(debateTopic);
    setMaxTurns(mTurns);
    setPhase('debate');
    
    abortRef.current = false;
    setRunning(true);
    
    let allMessages: DebateMessage[] = [];
    let turn: 'A' | 'B' = 'A';
    let turns = 0;
    
    const imageForFirstTurn = debateImages.length > 0 ? debateImages[0] : undefined;
    
    while (turns < mTurns && !abortRef.current) {
      const currentModel = turn === 'A' ? mA : mB;
      setCurrentTurn(turn);
      
      const imageUrl = turns === 0 ? imageForFirstTurn : undefined;
      const msg = await runTurn(currentModel, allMessages, debateTopic, imageUrl);
      
      if (abortRef.current) break;
      
      if (msg) {
        addMessage(msg);
        allMessages = [...allMessages, msg];
        incrementTurn();
        turns++;
        
        if (msg.error) break;
      }
      
      turn = turn === 'A' ? 'B' : 'A';
    }
    
    setRunning(false);
  };
  
  const continueDebate = async () => {
    if (!modelA || !modelB) return;
    
    abortRef.current = false;
    setRunning(true);
    
    let allMessages: DebateMessage[] = [...messages];
    let turn: 'A' | 'B' = currentTurn === 'A' ? 'B' : 'A'; // next turn after last
    let turns = turnCount;
    
    while (turns < maxTurns && !abortRef.current) {
      const currentModel = turn === 'A' ? modelA : modelB;
      setCurrentTurn(turn);
      
      const msg = await runTurn(currentModel, allMessages, topic);
      
      if (abortRef.current) break;
      
      if (msg) {
        addMessage(msg);
        allMessages = [...allMessages, msg];
        incrementTurn();
        turns++;
        
        if (msg.error) break;
      }
      
      turn = turn === 'A' ? 'B' : 'A';
    }
    
    setRunning(false);
  };
  
  const stopDebate = () => {
    abortRef.current = true;
    setRunning(false);
  };
  
  const resetDebate = () => {
    abortRef.current = true;
    setDebateImages([]);
    setSelectedA(null);
    setSelectedB(null);
    setTopicInput('');
    setTurnsInput(20);
    reset();
    setPhase('setup');
  };
  
  const modelAConfig = models.find(m => m.name === modelA);
  const modelBConfig = models.find(m => m.name === modelB);
  
  const canStart = !!selectedA && !!selectedB && !!topicInput.trim() && selectedA !== selectedB;
  
  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/analyze" className="p-2 hover:bg-gray-100 transition-colors rounded">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-xl font-normal text-gray-900">AI Communication</h1>
            <p className="text-xs text-gray-500 font-light">Two models communicate on a topic</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {phase === 'debate' && isRunning && (
            <button
              onClick={stopDebate}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm transition-colors flex items-center gap-2 rounded"
            >
              <Square className="w-4 h-4" />
              Stop
            </button>
          )}
          {phase === 'debate' && !isRunning && (
            <>
              <button
                onClick={resetDebate}
                className="px-3 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-600 text-sm transition-colors flex items-center gap-2 rounded"
              >
                <RotateCcw className="w-4 h-4" />
                New Session
              </button>
              {turnCount < maxTurns && (
                <button
                  onClick={continueDebate}
                  className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-sm transition-colors flex items-center gap-2 rounded"
                >
                  <Play className="w-4 h-4" />
                  Continue
                </button>
              )}
            </>
          )}
        </div>
      </div>
      
      {phase === 'setup' ? (
        <SetupView
          selectedA={selectedA}
          selectedB={selectedB}
          topic={topicInput}
          maxTurns={turnsInput}
          images={debateImages}
          onSelectA={setSelectedA}
          onSelectB={setSelectedB}
          onTopicChange={setTopicInput}
          onMaxTurnsChange={setTurnsInput}
          onImagesChange={setDebateImages}
          onStart={() => startDebate(selectedA!, selectedB!, topicInput, turnsInput)}
          canStart={canStart}
        />
      ) : (
        <div className="flex-1 overflow-y-auto min-h-0">
          {/* Info Bar */}
          <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-6 py-2 flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${providerColor[modelAConfig?.provider || 'openai'].dot}`} />
                {modelAConfig?.short}
              </span>
              <span>vs</span>
              <span className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${providerColor[modelBConfig?.provider || 'openai'].dot}`} />
                {modelBConfig?.short}
              </span>
              {debateImages.length > 0 && (
                <span className="flex items-center gap-1 text-gray-400">
                  <ImageIcon className="w-3 h-3" />
                  {debateImages.length} image{debateImages.length > 1 ? 's' : ''}
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <span className="truncate max-w-[200px]">{topic}</span>
              <span>Turn {turnCount}/{maxTurns}</span>
            </div>
          </div>
          
          {/* Messages */}
          <div className="max-w-3xl mx-auto px-6 py-6 space-y-4">
            {/* Topic banner */}
            <div className="text-center py-4 mb-4">
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Prompt</p>
              <p className="text-sm text-gray-700 font-light italic">&ldquo;{topic}&rdquo;</p>
              {debateImages.length > 0 && (
                <div className="flex justify-center gap-3 mt-4">
                  {debateImages.map((img, i) => (
                    <img key={i} src={img} alt={`Debate image ${i + 1}`} className="max-h-40 rounded border border-gray-200 object-contain" />
                  ))}
                </div>
              )}
            </div>
            
            {messages.map((msg) => {
              const isA = msg.modelName === modelA;
              const config = isA ? modelAConfig : modelBConfig;
              const color = providerColor[config?.provider || 'openai'];
              
              return (
                <div key={msg.id} className={`flex ${isA ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[75%] rounded-lg border px-4 py-3 ${color.bg}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-2 h-2 rounded-full ${color.dot}`} />
                      <span className={`text-xs font-medium ${color.text}`}>{config?.short}</span>
                    </div>
                    
                    {msg.error ? (
                      <p className="text-sm text-red-600">{msg.error}</p>
                    ) : (
                      <div className="prose prose-sm max-w-none prose-headings:font-medium prose-p:text-gray-700 prose-p:font-light prose-p:my-1">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    )}
                    
                    {!msg.error && msg.content && (
                      <div className="flex items-center gap-3 mt-2 pt-2 border-t border-gray-200/50">
                        {msg.responseTime && (
                          <span className="text-[10px] text-gray-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {(msg.responseTime / 1000).toFixed(1)}s
                          </span>
                        )}
                        {msg.tokensUsed && (
                          <span className="text-[10px] text-gray-400">{msg.tokensUsed.toLocaleString()} tokens</span>
                        )}
                        <button
                          onClick={() => handleCopy(msg.content, msg.id)}
                          className="ml-auto p-1 hover:bg-white/50 rounded"
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
              );
            })}
            
            {/* Loading */}
            {isRunning && (
              <div className={`flex ${currentTurn === 'A' ? 'justify-start' : 'justify-end'}`}>
                <div className={`border rounded-lg px-4 py-3 ${
                  providerColor[(currentTurn === 'A' ? modelAConfig : modelBConfig)?.provider || 'openai'].bg
                }`}>
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
                    <span className="text-xs text-gray-500">
                      {(currentTurn === 'A' ? modelAConfig : modelBConfig)?.short} is thinking...
                    </span>
                  </div>
                </div>
              </div>
            )}
            
            {!isRunning && messages.length > 0 && turnCount >= maxTurns && (
              <div className="text-center py-4 text-xs text-gray-400">
                Debate ended - maximum turns reached
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>
      )}
      
      {/* Footer */}
      <div className="flex items-center justify-center px-6 py-3 border-t border-gray-200 bg-gray-50 shrink-0">
        <span className="flex items-center gap-2 text-xs text-gray-400">
          Funded by
          <img src="/agentics-logo.svg" alt="Agentics" className="h-4 inline" />
        </span>
      </div>
    </div>
  );
}

// Setup component
function SetupView({
  selectedA, selectedB, topic, maxTurns, images,
  onSelectA, onSelectB, onTopicChange, onMaxTurnsChange, onImagesChange, onStart, canStart
}: {
  selectedA: string | null;
  selectedB: string | null;
  topic: string;
  maxTurns: number;
  images: string[];
  onSelectA: (name: string) => void;
  onSelectB: (name: string) => void;
  onTopicChange: (topic: string) => void;
  onMaxTurnsChange: (n: number) => void;
  onImagesChange: (images: string[]) => void;
  onStart: () => void;
  canStart: boolean;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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
    const files = e.target.files;
    if (!files) return;
    for (const file of Array.from(files)) {
      const compressed = await compressImage(file);
      onImagesChange([...images, compressed]);
    }
    if (e.target) e.target.value = '';
  };
  
  const removeImage = (index: number) => {
    onImagesChange(images.filter((_, i) => i !== index));
  };
  
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-2xl mx-auto py-10 px-6">
        <div className="text-center mb-10">
          <MessageSquare className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <h2 className="text-lg font-normal text-gray-900 mb-1">Setup AI Communication</h2>
          <p className="text-sm text-gray-500 font-light">
            Select two models, a topic, and optionally images to discuss.
          </p>
        </div>
        
        {/* Model Selection */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-xs text-gray-600 font-medium uppercase tracking-wide mb-3">Model A</label>
            <div className="space-y-1.5">
              {models.map((m) => {
                const color = providerColor[m.provider];
                const selected = selectedA === m.name;
                const disabled = selectedB === m.name;
                return (
                  <button
                    key={m.name}
                    onClick={() => onSelectA(m.name)}
                    disabled={disabled}
                    className={`w-full text-left px-3 py-2.5 border rounded transition-all text-sm ${
                      selected ? `${color.bg} border-2` : disabled ? 'border-gray-100 text-gray-300 cursor-not-allowed' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${disabled ? 'bg-gray-200' : color.dot}`} />
                      <span className={selected ? color.text : disabled ? 'text-gray-300' : 'text-gray-700'}>{m.short}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-600 font-medium uppercase tracking-wide mb-3">Model B</label>
            <div className="space-y-1.5">
              {models.map((m) => {
                const color = providerColor[m.provider];
                const selected = selectedB === m.name;
                const disabled = selectedA === m.name;
                return (
                  <button
                    key={m.name}
                    onClick={() => onSelectB(m.name)}
                    disabled={disabled}
                    className={`w-full text-left px-3 py-2.5 border rounded transition-all text-sm ${
                      selected ? `${color.bg} border-2` : disabled ? 'border-gray-100 text-gray-300 cursor-not-allowed' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${disabled ? 'bg-gray-200' : color.dot}`} />
                      <span className={selected ? color.text : disabled ? 'text-gray-300' : 'text-gray-700'}>{m.short}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        
        {/* Topic */}
        <div className="mb-6">
          <label className="block text-xs text-gray-600 font-medium uppercase tracking-wide mb-2">Initial Prompt</label>
          <textarea
            value={topic}
            onChange={(e) => onTopicChange(e.target.value)}
            placeholder="Enter the initial prompt or topic..."
            className="w-full h-24 px-4 py-3 bg-gray-50 border border-gray-300 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-500 focus:bg-white resize-none rounded-lg font-light transition-colors"
          />
        </div>
        
        {/* Images */}
        <div className="mb-6">
          <label className="block text-xs text-gray-600 font-medium uppercase tracking-wide mb-2">Images (optional)</label>
          <p className="text-xs text-gray-400 font-light mb-3">Upload images for the models to analyze and discuss.</p>
          <div className="flex flex-wrap gap-3">
            {images.map((img, i) => (
              <div key={i} className="relative group">
                <img src={img} alt={`Image ${i + 1}`} className="w-24 h-24 object-cover rounded border border-gray-200" />
                <button onClick={() => removeImage(i)} className="absolute -top-2 -right-2 p-1 bg-white border border-gray-300 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  <X className="w-3 h-3 text-gray-500" />
                </button>
              </div>
            ))}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-24 h-24 border-2 border-dashed border-gray-300 rounded flex flex-col items-center justify-center gap-1 hover:border-gray-400 hover:bg-gray-50 transition-colors"
            >
              <Plus className="w-5 h-5 text-gray-400" />
              <span className="text-[10px] text-gray-400">Add image</span>
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleFileChange} className="hidden" />
          </div>
        </div>
        
        {/* Max Turns */}
        <div className="mb-8">
          <label className="block text-xs text-gray-600 font-medium uppercase tracking-wide mb-2">Max turns: {maxTurns}</label>
          <input type="range" min={4} max={40} step={2} value={maxTurns} onChange={(e) => onMaxTurnsChange(Number(e.target.value))} className="w-full accent-gray-900" />
          <div className="flex justify-between text-[10px] text-gray-400 mt-1">
            <span>4 turns</span>
            <span>40 turns</span>
          </div>
        </div>
        
        {/* Start */}
        <button
          onClick={onStart}
          disabled={!canStart}
          className="w-full py-3 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 text-white text-sm font-normal transition-colors flex items-center justify-center gap-2 rounded-lg"
        >
          <Play className="w-4 h-4" />
          Start Communication
        </button>
        
        {selectedA && selectedB && selectedA === selectedB && (
          <p className="text-xs text-red-500 text-center mt-2">Select two different models</p>
        )}
      </div>
    </div>
  );
}
