# 🤖 Guida ai 4 Modelli AI (Febbraio 2026)

Questo documento descrive in dettaglio i 4 modelli AI utilizzati nella piattaforma.

## 📊 Tabella Comparativa

| Modello | Provider | Vision | Reasoning | Costo Input | Costo Output | Velocità |
|---------|----------|--------|-----------|-------------|--------------|----------|
| GPT-5.2 Thinking | OpenAI | ✅ | ✅ (High) | $5/1M | $15/1M | Media |
| Claude Opus 4.6 | Anthropic | ✅ | ✅ (Adaptive) | $5/1M | $25/1M | Media-Alta |
| Kimi K2.5 | Moonshot AI | ✅ | ✅ (Thinking) | ~$1/1M | ~$3/1M | Alta |
| DeepSeek V3.2 | DeepSeek | ❌ | ✅ (Reasoner) | $0.14/1M | $0.28/1M | Molto Alta |

---

## 1. 🟢 OpenAI GPT-5.2 Thinking

### Informazioni Generali
- **Release**: Gennaio 2026
- **Context Window**: 128K tokens
- **Max Output**: 16K tokens
- **Vision**: Sì (immagini ad alta risoluzione)

### Model IDs Disponibili
```typescript
'gpt-5.2-instant'   // Veloce, senza reasoning
'gpt-5.2-thinking'  // Con reasoning (raccomandato per questo progetto)
'gpt-5.2-pro'       // Massima qualità, più lento
```

### Reasoning Capabilities
GPT-5.2 introduce il **reasoning nativo** con parametro `reasoning.effort`:
- `none`: Nessun reasoning
- `low`: Reasoning leggero
- `medium`: Bilanciato
- `high`: Reasoning approfondito (usato nel progetto)
- `xhigh`: Massima profondità

### Vision Capabilities
- Supporta immagini PNG, JPG, GIF, WebP
- Detail level: `low`, `high`, `auto`
- Può analizzare composizione, colori, prospettiva

### Esempio Request
```typescript
{
  model: 'gpt-5.2-thinking',
  messages: [...],
  reasoning: {
    effort: 'high'
  }
}
```

### Punti di Forza
- ✅ Reasoning molto accurato
- ✅ Ottima comprensione del contesto
- ✅ Vision capabilities eccellenti
- ✅ Stile di scrittura naturale

### Limitazioni
- ❌ Costo medio-alto
- ❌ Velocità media con reasoning high

---

## 2. 🟠 Anthropic Claude Opus 4.6

### Informazioni Generali
- **Release**: Dicembre 2025
- **Context Window**: 200K tokens
- **Max Output**: 8K tokens
- **Vision**: Sì (supporto nativo base64)

### Model ID
```typescript
'claude-opus-4-6'
```

### Adaptive Thinking
Claude Opus 4.6 introduce **adaptive thinking** che si attiva automaticamente quando necessario:
```typescript
{
  thinking: {
    type: 'enabled',
    budget_tokens: 10000  // Max token dedicati al pensiero
  }
}
```

### Vision Capabilities
- Richiede immagini in **base64**
- Supporta: `image/jpeg`, `image/png`, `image/gif`, `image/webp`
- Eccellente nell'analisi artistica e compositiva

### Esempio Request
```typescript
{
  model: 'claude-opus-4-6',
  system: 'You are an art critic...',
  messages: [
    {
      role: 'user',
      content: [
        {
          type: 'image',
          source: {
            type: 'base64',
            media_type: 'image/jpeg',
            data: '...'
          }
        },
        { type: 'text', text: '...' }
      ]
    }
  ],
  thinking: { type: 'enabled', budget_tokens: 10000 }
}
```

### Punti di Forza
- ✅ Pensiero adattivo molto sofisticato
- ✅ Context window enorme (200K)
- ✅ Ottimo per analisi dettagliate
- ✅ Stile di scrittura molto umano

### Limitazioni
- ❌ Richiede conversione base64 delle immagini
- ❌ Output token limitati (8K)
- ❌ Costo output più alto

---

## 3. 🟣 Moonshot AI Kimi K2.5

### Informazioni Generali
- **Release**: Novembre 2025
- **Context Window**: 200K tokens
- **Max Output**: 16K tokens
- **Vision**: Sì (API OpenAI-compatible)
- **Endpoint**: `https://api.moonshot.cn/v1/chat/completions`

### Model ID
```typescript
'kimi-k2.5'
```

### Thinking Mode
Kimi supporta **4 modalità**:
- `instant`: Veloce, senza thinking
- `thinking`: Con reasoning (usato nel progetto)
- `agent`: Modalità agente autonomo
- `agent_swarm`: Multi-agente (beta)

### Configuration
```typescript
{
  model: 'kimi-k2.5',
  temperature: 1.0,  // Raccomandato per thinking mode
  top_p: 0.95,
  extra_body: {
    chat_template_kwargs: {
      thinking: true  // Abilita thinking
    }
  }
}
```

### Vision Capabilities
- API compatibile con OpenAI
- Supporta URL diretti alle immagini
- Ottimo per analisi visive dettagliate

### Punti di Forza
- ✅ Molto economico (~1/5 di GPT-5.2)
- ✅ Veloce anche con thinking
- ✅ Context window grande
- ✅ API semplice (OpenAI-compatible)

### Limitazioni
- ❌ Meno conosciuto in Occidente
- ❌ Documentazione principalmente in cinese
- ❌ Qualità leggermente inferiore a GPT/Claude

---

## 4. 🔵 DeepSeek V3.2

### Informazioni Generali
- **Release**: Gennaio 2026
- **Context Window**: 64K tokens
- **Max Output**: 8K tokens
- **Vision**: ❌ Non ancora supportata
- **Endpoint**: `https://api.deepseek.com/v1/chat/completions`

### Model IDs
```typescript
'deepseek-chat'      // Standard
'deepseek-reasoner'  // Con reasoning (usato nel progetto)
```

### Reasoning Capabilities
DeepSeek V3.2 Reasoner restituisce **reasoning_content** separato:
```typescript
{
  choices: [{
    message: {
      reasoning_content: '...',  // Pensiero interno
      content: '...'              // Risposta finale
    }
  }]
}
```

### Limitazioni Vision
⚠️ **IMPORTANTE**: DeepSeek V3.2 **non supporta ancora immagini**.

Nel progetto, quando si usa DeepSeek:
- Non viene inviata l'immagine
- Viene aggiunta una nota nel prompt
- Fornisce criteri generali di valutazione

### Punti di Forza
- ✅ Estremamente economico (~1/30 di GPT-5.2)
- ✅ Molto veloce
- ✅ Reasoning interno visibile
- ✅ Open source

### Limitazioni
- ❌ Nessun supporto vision (V4 atteso Q2 2026)
- ❌ Context window più piccolo
- ❌ Meno versatile senza immagini

---

## 🎯 Quando Usare Quale Modello?

### Per Analisi Artistica Professionale
1. **Claude Opus 4.6** - Pensiero adattivo + analisi profonda
2. **GPT-5.2 Thinking** - Reasoning strutturato + vision

### Per Valutazioni Rapide
1. **Kimi K2.5** - Veloce + economico + vision
2. **GPT-5.2 Instant** - Veloce senza reasoning

### Per Budget Limitato
1. **DeepSeek V3.2** - Ultra economico (no vision)
2. **Kimi K2.5** - Economico (con vision)

### Per Esperimenti Custom
- **Custom Prompts** permettono di testare approcci diversi
- Confronta le 8 risposte per trovare lo stile migliore

---

## 💡 Tips per Custom Prompts

### Per Critiche Costruttive
```
Sei un insegnante d'arte paziente. Valuta l'opera con tono incoraggiante,
evidenziando prima i punti di forza, poi suggerimenti concreti per migliorare.
```

### Per Analisi Tecnica
```
Sei un esperto di tecniche artistiche. Analizza in dettaglio:
composizione, prospettiva, uso del colore, tecnica del tratto.
```

### Per Ispirazione Creativa
```
Sei un critico d'arte visionario. Trova connessioni creative,
ispirazioni artistiche, suggerisci direzioni di sviluppo originali.
```

### Per Feedback Brutale
```
Sei un critico d'arte spietato ma onesto. Non addolcire le critiche,
sii diretto su cosa funziona e cosa no. Priorità alla verità sulla gentilezza.
```

---

## 📚 Risorse

### Documentazione Ufficiale
- **OpenAI GPT-5**: https://platform.openai.com/docs/models/gpt-5
- **Anthropic Claude**: https://docs.anthropic.com/claude/docs
- **Moonshot Kimi**: https://platform.moonshot.ai/docs
- **DeepSeek**: https://platform.deepseek.com/docs

### Community
- **OpenAI Discord**: https://discord.gg/openai
- **Anthropic Forum**: https://community.anthropic.com/
- **DeepSeek GitHub**: https://github.com/deepseek-ai

---

**Ultimo aggiornamento**: Febbraio 2026
