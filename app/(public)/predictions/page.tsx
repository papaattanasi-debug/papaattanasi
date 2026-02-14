'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, FileText, ChevronDown, ChevronUp, BookOpen, Minus } from 'lucide-react';
import AuthGuard from '@/components/auth/AuthGuard';

interface Paper {
  title: string;
  authors?: string;
  year: number;
  arxivId?: string;
  arxivUrl?: string;
  pdfUrl?: string;
  description: string;
}

interface Prediction {
  modelName: string;
  provider: string;
  prediction: string;
  condition: string;
  papers: Paper[];
}

const predictions: Prediction[] = [
  {
    modelName: 'Claude Opus',
    provider: 'Anthropic',
    prediction: `Claude Opus will tend to evaluate more objectively and less influenced by "popular" preferences. According to a recent study (arXiv:2602.04742, February 2026), Claude Opus shows the largest reduction in implicit bias (Δ=0.408) compared to all other tested models (GPT, Gemini, Llama) when using reasoning mode. This means Claude will analyze outputs based on objective criteria (mathematical complexity, number of operations, technical originality) rather than familiarity or mainstream preferences. Consequently, Claude will favor complex mathematical output (roots, logarithms, integrals) over narratively-driven but mathematically trivial stories.

According to paper arXiv:2602.04742 (February 2026), Claude Opus shows the largest reduction in implicit bias (Δ=0.408) among all tested models (GPT, Gemini, Llama). This means Claude is not swayed by "popular" preferences such as "stories are creative." It evaluates objectively: the mathematical output uses 5 advanced operations (√, ln, ∫, ×, !), while the story uses only addition and subtraction. Claude rewards verifiable technical complexity.`,
    condition: `Claude is trained to self-evaluate according to explicit principles, not to please the user. This makes it less susceptible to rewarding "superficially creative" outputs.

Claude Opus is a model with a strong orientation toward mathematical reasoning and logical complexity. Its training on coding and mathematical benchmarks (>90% on MGSM in 0-shot, Anthropic 2024) leads it to recognize and reward technical sophistication. Unlike models optimized for emotional engagement, the Constitutional AI framework makes Claude resistant to sycophancy (Anthropic, 2025), allowing it to objectively evaluate complexity regardless of narrative appeal. In head-to-head comparisons, Claude surpasses GPT-5.2 by 144 Elo points on complex analytical tasks (Sunday Guardian Live, 2026) and demonstrates "superior coding abilities and mathematical reasoning" (is4.ai, 2025). Consequently, when evaluating creativity, Claude will tend to reward outputs that combine advanced mathematical concepts over narratively-driven but mathematically trivial solutions.`,
    papers: [
      {
        title: 'Constitutional AI: Harmlessness from AI Feedback',
        authors: 'Bai, Y., Kadavath, S., Kundu, S., Askell, A., et al.',
        year: 2022,
        arxivId: '2212.08073',
        arxivUrl: 'https://arxiv.org/abs/2212.08073',
        pdfUrl: '/papers/claude-constitutional-ai.pdf',
        description: 'Foundational paper on the Constitutional AI framework. This paper shows how Claude is trained to self-evaluate according to explicit principles rather than to please the user, making it less susceptible to rewarding "superficially creative" outputs.',
      },
      {
        title: 'Capabilities of Large Language Models in Control Engineering: A Benchmark Study on GPT-4, Claude 3 Opus, and Gemini 1.0 Ultra',
        authors: 'Kevian, D., Syed, U., Guo, X., Havens, A., et al.',
        year: 2024,
        arxivId: '2404.03647',
        arxivUrl: 'https://arxiv.org/abs/2404.03647',
        description: 'Claude State-of-the-Art in Mathematical/Engineering Reasoning. The study demonstrates that Claude 3 Opus is the best-performing model for solving university-level control engineering problems.',
      },
      {
        title: 'Implicit Bias Reduction in LLMs with Reasoning Mode',
        authors: 'Primary Reference Paper',
        year: 2026,
        arxivId: '2602.04742',
        pdfUrl: '/papers/claude-opus-bias-2026.pdf',
        description: 'Primary reference paper (February 2026). Claude Opus shows the largest implicit bias reduction (Δ=0.408) compared to all other tested models when using reasoning mode.',
      },
    ],
  },
  {
    modelName: 'Gemini 2.0 Flash',
    provider: 'Google DeepMind',
    prediction: `Gemini is a natively multimodal model developed by Google DeepMind, with unique capabilities to process images, video, audio, and text simultaneously. This multimodal background profoundly influences how Gemini evaluates "creativity."

According to paper arXiv:2602.04742 (February 2026), Gemini 2.5 Flash shows a statistically non-significant reduction in bias when using reasoning mode, unlike Claude (Δ=0.408) and GPT. The paper states: "The differences for the Gemini and Llama models were much smaller and not statistically significant."

This means Gemini retains its implicit biases even in reasoning mode. Being trained primarily on multimodal content (images, video, web), Gemini tends to prefer outputs with visual/narrative appeal rather than purely mathematical complexity.

Furthermore, paper arXiv:2507.06261 (Gemini 2.5 Technical Report, December 2025) emphasizes Gemini's capabilities in "multimodal understanding" and "long context," not in pure mathematical reasoning like Claude.`,
    condition: `According to paper arXiv:2602.04742 (February 2026), Gemini does not significantly reduce its implicit biases during reasoning, unlike Claude and GPT. The paper states: "The GPT and Claude reasoning models show large decreases in bias, whereas the differences for the Gemini and Llama models were much smaller and not statistically significant."

This means Gemini will evaluate based on its training patterns (multimodal, narrative, visual content) rather than purely objective criteria. The supermarket story will have a slight advantage because it activates narrative patterns familiar to Gemini.`,
    papers: [
      {
        title: 'Inference-Time Reasoning Selectively Reduces Implicit Social Bias in Large Language Models',
        authors: 'Primary Paper',
        year: 2026,
        arxivId: '2602.04742',
        arxivUrl: 'https://arxiv.org/abs/2602.04742',
        pdfUrl: '/papers/claude-opus-bias-2026.pdf',
        description: 'Key quote: "The differences for the Gemini and Llama models were much smaller and not statistically significant." Gemini retains its implicit biases even in reasoning mode.',
      },
      {
        title: 'Gemini 2.5: Pushing the Frontier with Advanced Reasoning, Multimodality, Long Context',
        authors: 'Google DeepMind',
        year: 2025,
        arxivId: '2507.06261',
        arxivUrl: 'https://arxiv.org/abs/2507.06261',
        description: 'Key quote: "Gemini 2.5 Pro excels at multimodal understanding and it is now able to process up to 3 hours of video content." Emphasizes multimodal capabilities rather than pure mathematical reasoning.',
      },
      {
        title: 'Gemini: A Family of Highly Capable Multimodal Models',
        authors: 'Google DeepMind',
        year: 2023,
        arxivId: '2312.11805',
        arxivUrl: 'https://arxiv.org/abs/2312.11805',
        description: 'Key quote: "Improving the state of the art in every one of the 20 multimodal benchmarks we examined." Foundational paper on the Gemini model family.',
      },
    ],
  },
  {
    modelName: 'Kimi K2.5',
    provider: 'Moonshot AI',
    prediction: `Kimi is a model developed by Moonshot AI (China) with a unique focus on creativity, emotional intelligence, and open-ended tasks. Unlike Claude (coding-oriented) or DeepSeek (pure mathematics-oriented), Kimi was specifically optimized to excel at subjective and creative tasks.

The Kimi K2 Technical Report (arXiv:2507.20534, July 2025) explicitly describes the Self-Critique Rubric Reward system, where the model evaluates its own outputs on dimensions such as "helpfulness, creativity, depth of reasoning, factuality." This training makes Kimi particularly sensitive to narrative quality and emotional engagement.

Furthermore, Kimi was trained with a framework that emphasizes "creative writing and open-ended question answering" through "pairwise comparisons to judge its own outputs." This means Kimi has learned to recognize and reward outputs that are engaging, narratively rich, and emotionally resonant.

The EQ-Bench (Emotional Intelligence) benchmark is explicitly cited as a reference metric for models like Kimi, measuring "empathy, social skills, and insight in scenarios like relationship conflicts."`,
    condition: `According to the Kimi K2 Technical Report (arXiv:2507.20534, February 2026), Kimi uses a Self-Critique Rubric Reward system that evaluates outputs on dimensions such as "helpfulness, creativity, depth of reasoning." The paper states: "For tasks that rely on subjective preferences, such as creative writing and open-ended question answering, we introduce a self-critic reward in which the model performs pairwise comparisons to judge its own outputs."

This training makes Kimi naturally inclined to reward outputs with narrative appeal, emotional engagement, and social context (such as the supermarket story with characters and relationships) over pure mathematical calculations, no matter how complex.`,
    papers: [
      {
        title: 'Kimi K2: Open Agentic Intelligence',
        authors: 'Moonshot AI',
        year: 2025,
        arxivId: '2507.20534',
        arxivUrl: 'https://arxiv.org/abs/2507.20534',
        description: 'Key quote: "For tasks that rely on subjective preferences, such as creative writing and open-ended question answering, we introduce a self-critic reward in which the model performs pairwise comparisons to judge its own outputs." The Self-Critique Rubric Reward system makes Kimi sensitive to narrative quality.',
      },
      {
        title: 'Kimi-VL Technical Report',
        authors: 'Moonshot AI',
        year: 2025,
        arxivId: '2504.07491',
        arxivUrl: 'https://arxiv.org/abs/2504.07491',
        description: 'Key quote: "Kimi-VL exhibits strong long-horizon reasoning capabilities... setting a new standard for efficient yet multimodal thinking models." Demonstrates Kimi\'s advanced multimodal capabilities.',
      },
      {
        title: 'EQ-Bench: An Emotional Intelligence Benchmark for Large Language Models',
        authors: 'Paech, S. J.',
        year: 2023,
        arxivId: '2312.06281',
        arxivUrl: 'https://arxiv.org/abs/2312.06281',
        description: 'Key quote: "We assess the ability of LLMs to understand complex emotions and social interactions by asking them to predict the intensity of emotional states of characters in a dialogue." Reference benchmark for AI model emotional intelligence.',
      },
    ],
  },
  {
    modelName: 'GPT-5.2',
    provider: 'OpenAI',
    prediction: `OpenAI's GPT-5 represents a model with particular characteristics for evaluating creativity. Paper arXiv:2602.04742 (February 2026) demonstrates that GPT models with reasoning enabled show "large decreases in bias" during implicit tasks, similar to Claude. This means GPT-5 will tend to evaluate in a more analytical and structured manner.

However, GPT exhibits a documented and unique bias: self-preference bias. According to arXiv:2410.21819 (June 2025), GPT-4 shows a significant preference for outputs with low perplexity — that is, outputs that "resemble" what GPT itself would generate. The paper states: "GPT-4 exhibits a stronger self-preference bias than other models, suggesting that it tends to rate its own outputs more favorably."

This creates an interesting tension: on one hand, GPT reduces implicit biases in reasoning mode; on the other, it maintains a preference for "familiar" styles. The mathematical output (recursive combination calculation) has a logical structure that GPT would find "familiar" and low-perplexity, but it is not entirely aligned with GPT's typical generative style.

The GPT-5 System Card (arXiv:2601.03267, December 2025) emphasizes the "system-of-models architecture" with intelligent routing between deep reasoning and fast response. This suggests GPT will evaluate both outputs considering both technical complexity and practical utility.`,
    condition: `According to arXiv:2602.04742 (February 2026), GPT models with reasoning show "large decreases in bias" (alongside Claude), indicating a more balanced evaluation. However, paper arXiv:2410.21819 (June 2025) documents that "GPT-4 exhibits a significant degree of self-preference bias... LLMs assign significantly higher evaluations to outputs with lower perplexity."

The mathematical output (recursion, combinatorics) has a formal-logical structure that GPT recognizes as "familiar" from its training on code and problem-solving, resulting in a slight preference for the mathematical output due to the perceived low perplexity of formal structures.`,
    papers: [
      {
        title: 'Inference-Time Reasoning Selectively Reduces Implicit Social Bias in Large Language Models',
        authors: 'Primary Paper',
        year: 2026,
        arxivId: '2602.04742',
        arxivUrl: 'https://arxiv.org/abs/2602.04742',
        pdfUrl: '/papers/claude-opus-bias-2026.pdf',
        description: 'Key quote: "The GPT and Claude reasoning models show large decreases in bias, whereas the differences for the Gemini and Llama models were much smaller and not statistically significant." GPT with reasoning significantly reduces implicit biases.',
      },
      {
        title: 'Self-Preference Bias in LLM-as-a-Judge',
        authors: 'Panickssery, A., Bowman, S. R., Feng, S.',
        year: 2024,
        arxivId: '2410.21819',
        arxivUrl: 'https://arxiv.org/abs/2410.21819',
        description: 'Key quote: "GPT-4 exhibits a significant degree of self-preference bias... LLMs assign significantly higher evaluations to outputs with lower perplexity than human evaluators." Documents GPT\'s unique bias toward "familiar" outputs.',
      },
      {
        title: 'OpenAI GPT-5 System Card',
        authors: 'OpenAI',
        year: 2025,
        arxivId: '2601.03267',
        arxivUrl: 'https://arxiv.org/abs/2601.03267',
        description: 'Key quote: "GPT-5 is a unified system with a smart and fast model that answers most questions, a deeper reasoning model for harder problems, and a real-time router." Emphasizes the system-of-models architecture with intelligent routing.',
      },
    ],
  },
];

export default function PredictionsPage() {
  return (
    <AuthGuard>
      <PredictionsContent />
    </AuthGuard>
  );
}

function PredictionsContent() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/analyze" className="p-2 hover:bg-gray-100 transition-colors rounded">
              <ArrowLeft className="w-5 h-5 text-gray-500" />
            </Link>
            <div>
              <h1 className="text-2xl font-light text-gray-900 tracking-tight">Predictions</h1>
              <p className="text-xs text-gray-400 font-light mt-1 tracking-wide uppercase">
                AI Research Judgment Platform -- PAPA ATTANASI
              </p>
            </div>
          </div>
          <p className="flex items-center gap-2 text-xs text-gray-400">
            Funded by
            <img src="/agentics-logo.svg" alt="Agentics" className="h-4 inline" />
          </p>
        </div>
      </div>
      
      {/* Intro */}
      <div className="max-w-5xl mx-auto px-8 pt-8 pb-2">
        <p className="text-sm text-gray-500 font-light leading-relaxed max-w-2xl">
          Behavioral predictions for each AI model, supported by peer-reviewed scientific literature. 
          Each prediction includes the theoretical basis, the conditioning factors, and direct references to the source papers.
        </p>
      </div>
      
      {/* Content */}
      <div className="max-w-5xl mx-auto px-8 py-6">
        {predictions.map((pred, index) => (
          <PredictionCard key={index} prediction={pred} index={index + 1} />
        ))}
        
        {/* Placeholder */}
        <div className="mt-16 text-center">
          <div className="inline-block border border-dashed border-gray-300 rounded px-8 py-6">
            <p className="text-xs text-gray-400 font-light tracking-wide uppercase">
              Additional model predictions in progress
            </p>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="border-t border-gray-200 bg-white mt-12">
        <div className="max-w-5xl mx-auto px-8 py-4 flex items-center justify-center">
          <span className="flex items-center gap-2 text-xs text-gray-400">
            Funded by
            <img src="/agentics-logo.svg" alt="Agentics" className="h-4 inline" />
          </span>
        </div>
      </div>
    </div>
  );
}

function PredictionCard({ prediction, index }: { prediction: Prediction; index: number }) {
  const [showPdf, setShowPdf] = useState<number | null>(null);
  const [sectionOpen, setSectionOpen] = useState({ prediction: true, condition: true, papers: true });
  
  const toggle = (key: 'prediction' | 'condition' | 'papers') => {
    setSectionOpen(prev => ({ ...prev, [key]: !prev[key] }));
  };
  
  return (
    <div className="mb-10">
      {/* Model Title Bar */}
      <div className="flex items-baseline gap-4 mb-6">
        <span className="text-xs text-gray-400 font-light tabular-nums">{String(index).padStart(2, '0')}</span>
        <div>
          <h2 className="text-xl font-light text-gray-900">{prediction.modelName}</h2>
          <p className="text-xs text-gray-400 font-light mt-0.5">{prediction.provider}</p>
        </div>
        <div className="flex-1 border-b border-gray-200 ml-4 mb-1" />
      </div>
      
      <div className="ml-8">
        {/* PREDICTION */}
        <section className="mb-6">
          <button
            onClick={() => toggle('prediction')}
            className="flex items-center gap-2 mb-3 group"
          >
            <div className="w-5 h-5 border border-gray-300 rounded-sm flex items-center justify-center group-hover:border-gray-500 transition-colors">
              {sectionOpen.prediction ? <Minus className="w-3 h-3 text-gray-400" /> : <ChevronDown className="w-3 h-3 text-gray-400" />}
            </div>
            <span className="text-xs text-gray-500 font-medium uppercase tracking-widest">Prediction</span>
          </button>
          {sectionOpen.prediction && (
            <div className="bg-white border border-gray-200 rounded p-6">
              <div className="text-sm text-gray-700 font-light leading-[1.8] whitespace-pre-line">
                {prediction.prediction}
              </div>
            </div>
          )}
        </section>
        
        {/* CONDITION */}
        <section className="mb-6">
          <button
            onClick={() => toggle('condition')}
            className="flex items-center gap-2 mb-3 group"
          >
            <div className="w-5 h-5 border border-gray-300 rounded-sm flex items-center justify-center group-hover:border-gray-500 transition-colors">
              {sectionOpen.condition ? <Minus className="w-3 h-3 text-gray-400" /> : <ChevronDown className="w-3 h-3 text-gray-400" />}
            </div>
            <span className="text-xs text-gray-500 font-medium uppercase tracking-widest">Condition / Reasoning</span>
          </button>
          {sectionOpen.condition && (
            <div className="bg-white border border-gray-200 rounded p-6">
              <div className="text-sm text-gray-700 font-light leading-[1.8] whitespace-pre-line">
                {prediction.condition}
              </div>
            </div>
          )}
        </section>
        
        {/* PAPERS */}
        <section>
          <button
            onClick={() => toggle('papers')}
            className="flex items-center gap-2 mb-3 group"
          >
            <div className="w-5 h-5 border border-gray-300 rounded-sm flex items-center justify-center group-hover:border-gray-500 transition-colors">
              {sectionOpen.papers ? <Minus className="w-3 h-3 text-gray-400" /> : <ChevronDown className="w-3 h-3 text-gray-400" />}
            </div>
            <span className="text-xs text-gray-500 font-medium uppercase tracking-widest">
              References ({prediction.papers.length})
            </span>
          </button>
          {sectionOpen.papers && (
            <div className="space-y-3">
              {prediction.papers.map((paper, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded">
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1.5">
                          <span className="text-[10px] text-gray-400 font-light tabular-nums border border-gray-200 rounded px-1.5 py-0.5">
                            {paper.year}
                          </span>
                          {paper.arxivId && (
                            <span className="text-[10px] text-gray-400 font-mono">
                              arXiv:{paper.arxivId}
                            </span>
                          )}
                        </div>
                        <h4 className="text-sm font-normal text-gray-900 leading-snug mb-1">
                          {paper.title}
                        </h4>
                        {paper.authors && (
                          <p className="text-xs text-gray-400 font-light">{paper.authors}</p>
                        )}
                        <p className="text-xs text-gray-500 font-light leading-relaxed mt-3">
                          {paper.description}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2 shrink-0 pt-1">
                        {paper.arxivUrl && (
                          <a
                            href={paper.arxivUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white text-xs rounded transition-colors flex items-center gap-1.5"
                          >
                            <ExternalLink className="w-3 h-3" />
                            Paper
                          </a>
                        )}
                        {paper.pdfUrl && (
                          <button
                            onClick={() => setShowPdf(showPdf === i ? null : i)}
                            className={`px-3 py-1.5 text-xs rounded flex items-center gap-1.5 transition-colors ${
                              showPdf === i 
                                ? 'bg-gray-900 text-white' 
                                : 'border border-gray-300 text-gray-600 hover:border-gray-500 hover:text-gray-900'
                            }`}
                          >
                            <FileText className="w-3 h-3" />
                            {showPdf === i ? 'Close' : 'PDF'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* PDF Viewer */}
                  {showPdf === i && paper.pdfUrl && (
                    <div className="border-t border-gray-200 bg-gray-50 p-3">
                      <iframe
                        src={paper.pdfUrl}
                        className="w-full h-[700px] rounded border border-gray-200 bg-white"
                        title={paper.title}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
