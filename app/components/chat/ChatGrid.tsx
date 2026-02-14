'use client';

import { ChatPanel } from './ChatPanel';

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

export function ChatGrid() {
  return (
    <div className="grid grid-cols-4 grid-rows-2 gap-2 h-full">
      {models.map((model) => (
        <ChatPanel
          key={model.name}
          modelName={model.name}
          provider={model.provider}
          hasSystemPrompt={model.hasSystemPrompt}
          supportsVision={model.supportsVision}
        />
      ))}
    </div>
  );
}
