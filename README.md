# 🎨 AI Art Judge - Piattaforma di Valutazione AI Multi-Modello v2.0

> Valuta opere d'arte con **8 chat AI simultanee** da 4 modelli diversi (GPT-5.2, Claude Opus 4.6, Kimi K2.5, DeepSeek V3.2)

![Status](https://img.shields.io/badge/status-active-success.svg)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

---

## ✨ Caratteristiche Principali

- 🤖 **8 Chat AI Simultanee**: Ogni modello in 2 versioni (Guided + Custom)
- 🎯 **4 Modelli AI Supportati**: GPT-5.2 Thinking, Claude Opus 4.6, Kimi K2.5, DeepSeek V3.2
- 👁️ **Vision Support**: 3/4 modelli analizzano direttamente l'immagine
- ✏️ **Custom Prompts**: Personalizza completamente i system prompts
- 🔐 **Autenticazione Sicura**: Login/Registrazione tramite Supabase
- ⚡ **Esecuzione Parallela**: Tutte le valutazioni in parallelo
- 🎨 **UI Moderna**: Dark mode con animazioni fluide (Framer Motion)
- ⭐ **Rating System**: Vota ogni risposta con 1-5 stelle

---

## 🚀 Quick Start (5 minuti)

### 1. Installa
```bash
npm install
```

### 2. Configura `.env.local`
```bash
cp .env.example .env.local
# Inserisci le tue API keys
```

### 3. Setup Supabase
```sql
-- Esegui supabase_schema.sql nel SQL Editor
```

### 4. Avvia
```bash
npm run dev
```

Apri: http://localhost:3000

📖 **Guida dettagliata**: Leggi [`QUICK_START.md`](./QUICK_START.md)

---

## 📁 Struttura del Progetto

```
papaattanasi/
├── src/
│   ├── app/
│   │   ├── (auth)/                 # Pagine autenticazione
│   │   ├── (dashboard)/            # Dashboard valutazione
│   │   └── api/                    # API routes
│   ├── components/
│   │   └── chat/                   # Componenti chat
│   └── lib/
│       ├── ai/                     # Integrazioni AI
│       └── supabase/               # Supabase client
├── .env.local                      # Environment variables
├── supabase_schema.sql             # Database schema
└── 📚 Documentazione completa
```

---

## 📚 Documentazione

| File | Descrizione |
|------|-------------|
| **[QUICK_START.md](./QUICK_START.md)** | Inizia in 5 minuti! ⚡ |
| **[DATABASE_SETUP.md](./DATABASE_SETUP.md)** | Setup database passo-passo 🗄️⭐ |
| **[API_KEYS_GUIDE.md](./API_KEYS_GUIDE.md)** | Come ottenere tutte le API keys 🔑 |
| **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)** | Configurazione Supabase dettagliata 🗄️ |
| **[AI_MODELS_GUIDE.md](./AI_MODELS_GUIDE.md)** | Dettagli tecnici sui 4 modelli 🤖 |
| **[TESTING_GUIDE.md](./TESTING_GUIDE.md)** | Guida completa al testing 🧪 |
| **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** | Deploy in produzione 🚀 |
| **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** | Riepilogo completo progetto 📦 |
| **[FINAL_CHECKLIST.md](./FINAL_CHECKLIST.md)** | Checklist finale setup ✅ |

---

## 🤖 Modelli AI Supportati (Febbraio 2026)

| Modello | Provider | Vision | Reasoning | Costo/1M | Note |
|---------|----------|--------|-----------|----------|------|
| GPT-5.2 Thinking | OpenAI | ✅ | ✅ High | $5-15 | Reasoning nativo |
| Claude Opus 4.6 | Anthropic | ✅ | ✅ Adaptive | $5-25 | Pensiero adattivo |
| Kimi K2.5 | Moonshot | ✅ | ✅ Thinking | ~$1-3 | Molto economico |
| DeepSeek V3.2 | DeepSeek | ❌ | ✅ Reasoner | $0.14-0.28 | Ultra economico |

**Ogni modello disponibile in 2 versioni**:
- **Guided**: System prompt predefinito per valutazione artistica professionale
- **Custom**: System prompt completamente personalizzabile dall'utente

---

## 🎯 Come Funziona

### 1. Autenticazione
```
Login/Registrazione → Supabase Auth → Dashboard
```

### 2. Upload & Valutazione
```
Upload Immagine → [Opzionale] Edit Custom Prompts → Avvia Valutazione
```

### 3. Risultati
```
8 Chat in Parallelo → Risposte Markdown → Rating & Interazioni
```

### Esempio di Flusso
1. Carica un disegno
2. Personalizza i prompt "Custom" (es. "Valuta come critico manga")
3. Clicca "Avvia Valutazione"
4. Confronta le 8 risposte simultanee
5. Vota e copia quelle più utili

---

## 💰 Costi Stimati

**Per valutazione completa (8 chat)**:

- GPT-5.2 × 2: ~$0.04-0.10
- Claude Opus 4.6 × 2: ~$0.04-0.10
- Kimi K2.5 × 2: ~$0.01-0.02
- DeepSeek V3.2 × 2: ~$0.002-0.004

**Totale**: ~$0.10-0.25 per valutazione

**Budget raccomandato per iniziare**: $30-35
- OpenAI: $10
- Anthropic: $10
- Moonshot: $5
- DeepSeek: Gratis/$5

---

## 🔑 API Keys Necessarie

### Supabase (Progetto: papaattanasi-debug's Project)
- `NEXT_PUBLIC_SUPABASE_URL` (già configurato)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` → [Ottieni qui](https://supabase.com/dashboard/project/sbsvhtaqekeprbemowcp/settings/api)
- `SUPABASE_SERVICE_ROLE_KEY` → [Ottieni qui](https://supabase.com/dashboard/project/sbsvhtaqekeprbemowcp/settings/api)

### AI Models
- `OPENAI_API_KEY` → [platform.openai.com](https://platform.openai.com/api-keys)
- `ANTHROPIC_API_KEY` → [console.anthropic.com](https://console.anthropic.com/settings/keys)
- `MOONSHOT_API_KEY` → [platform.moonshot.ai](https://platform.moonshot.ai/console/api-keys)
- `DEEPSEEK_API_KEY` → [platform.deepseek.com](https://platform.deepseek.com/api_keys)

📖 **Guida completa**: [`API_KEYS_GUIDE.md`](./API_KEYS_GUIDE.md)

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** (App Router) - Framework React
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animazioni
- **Lucide React** - Icone
- **React Markdown** - Rendering risposte

### Backend
- **Next.js API Routes** - Backend API
- **Supabase Auth** - Autenticazione
- **Supabase PostgreSQL** - Database

### AI Integrations
- **OpenAI SDK** (GPT-5.2)
- **Anthropic SDK** (Claude Opus 4.6)
- **Fetch API** (Moonshot Kimi K2.5)
- **Fetch API** (DeepSeek V3.2)

---

## ⚠️ Note Importanti

### DeepSeek V3.2 - Limitazione Vision
DeepSeek V3.2 **non supporta ancora l'analisi diretta di immagini**. Fornisce valutazioni basate su criteri artistici generali. Il supporto vision è atteso con DeepSeek V4 (Q2 2026).

### Supabase Project
Collegato a **"papaattanasi-debug's Project"**:
- Project ID: `sbsvhtaqekeprbemowcp`
- Region: `eu-west-1`

---

## 🧪 Testing

```bash
# Build production
npm run build

# Avvia in produzione
npm start

# Test completo
# Segui TESTING_GUIDE.md
```

---

## 🚀 Deployment

Deploy su **Vercel** (raccomandato):

1. Push su GitHub
2. Importa su Vercel
3. Configura Environment Variables
4. Deploy!

📖 **Guida completa**: [`DEPLOYMENT_GUIDE.md`](./DEPLOYMENT_GUIDE.md)

---

## 📝 TODO / Roadmap

### Must Have
- [ ] Salvare valutazioni nel database Supabase
- [ ] Pagina history delle valutazioni passate
- [ ] Implementare rigenerazione singola per chat

### Nice to Have
- [ ] Export valutazioni in PDF
- [ ] Salvare custom prompts preferiti
- [ ] Dashboard con statistiche utente
- [ ] Confronto side-by-side risposte
- [ ] Template di prompts condivisibili
- [ ] Dark/Light mode toggle

---

## 🤝 Supporto

### Documentazione
Tutti i file `.md` nella root contengono guide dettagliate.

### Troubleshooting Comuni

**"Network Error" su tutte le chat?**
→ Verifica API keys in `.env.local`

**"401 Unauthorized" Supabase?**
→ Rigenera Anon Key da dashboard

**Un modello non risponde?**
→ Controlla la key specifica e i rate limits

---

## 📄 Licenza

MIT License - Uso libero per progetti personali e commerciali.

---

## 👨‍💻 Autore

**Progetto creato per Lorenzo Balduzzi**  
Febbraio 2026

---

## 🎉 Inizia Ora!

```bash
git clone <repository>
cd papaattanasi
npm install
cp .env.example .env.local
# Configura le API keys
npm run dev
```

**Leggi [`QUICK_START.md`](./QUICK_START.md) per iniziare in 5 minuti! ⚡**

---

**Buona valutazione artistica! 🎨✨**
