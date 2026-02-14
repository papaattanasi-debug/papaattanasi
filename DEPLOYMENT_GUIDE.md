# 🚀 Guida al Deployment

Questa guida spiega come deployare "AI Art Judge" in produzione.

---

## 📋 Pre-requisiti

Prima di deployare, assicurati di avere:

- ✅ Tutte le API keys configurate
- ✅ Database Supabase configurato (`supabase_schema.sql`)
- ✅ Build locale funzionante (`npm run build` senza errori)
- ✅ Account su piattaforma di hosting (Vercel raccomandato)

---

## 1. 🌐 Deploy su Vercel (Raccomandato)

Vercel è la piattaforma ufficiale di Next.js e offre:
- Deploy automatico da Git
- Edge Functions
- SSL gratuito
- Domain personalizzato

### A. Preparazione

1. **Crea Account Vercel**
   - Vai su: https://vercel.com/signup
   - Registrati con GitHub/GitLab/Bitbucket

2. **Push su Git** (se non l'hai già fatto)
   ```bash
   git init
   git add .
   git commit -m "Initial commit: AI Art Judge"
   git branch -M main
   git remote add origin https://github.com/tuousername/ai-art-judge.git
   git push -u origin main
   ```

### B. Deploy

1. **Importa Progetto**
   - Vai su: https://vercel.com/new
   - Clicca **"Import Git Repository"**
   - Seleziona il repository `ai-art-judge`
   - Clicca **"Import"**

2. **Configura Environment Variables**
   
   In **"Environment Variables"**, aggiungi TUTTE le variabili:
   
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://sbsvhtaqekeprbemowcp.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=[tua-key]
   SUPABASE_SERVICE_ROLE_KEY=[tua-key]
   OPENAI_API_KEY=[tua-key]
   ANTHROPIC_API_KEY=[tua-key]
   MOONSHOT_API_KEY=[tua-key]
   DEEPSEEK_API_KEY=[tua-key]
   NEXT_PUBLIC_APP_URL=https://tuodominio.vercel.app
   ```
   
   ⚠️ **Importante**: Clicca su tutti gli environment (Production, Preview, Development)

3. **Deploy**
   - Clicca **"Deploy"**
   - Attendi 2-3 minuti
   - ✅ Il tuo sito sarà live su `https://tuoprogetto.vercel.app`

### C. Configurazione Post-Deploy

1. **Aggiorna Supabase Redirect URLs**
   - Vai su: https://supabase.com/dashboard/project/sbsvhtaqekeprbemowcp/auth/url-configuration
   - Aggiungi il tuo dominio Vercel:
     ```
     https://tuoprogetto.vercel.app/**
     ```
   - Aggiorna **Site URL**: `https://tuoprogetto.vercel.app`

2. **Test il Deploy**
   - Visita `https://tuoprogetto.vercel.app`
   - Registra un nuovo utente
   - Testa una valutazione

### D. Custom Domain (Opzionale)

1. **Acquista un dominio** (es. Namecheap, GoDaddy)
2. In Vercel, vai su **Settings → Domains**
3. Clicca **"Add Domain"**
4. Inserisci il tuo dominio (es. `aiartjudge.com`)
5. Segui le istruzioni per configurare i DNS
6. Aggiorna Supabase con il nuovo dominio

---

## 2. 🔵 Deploy su Railway

Railway è un'alternativa moderna con database integrato.

### A. Setup

1. **Crea Account**
   - Vai su: https://railway.app/
   - Registrati con GitHub

2. **Crea Nuovo Progetto**
   - Clicca **"New Project"**
   - Seleziona **"Deploy from GitHub repo"**
   - Autorizza Railway ad accedere al repo

### B. Configurazione

1. **Environment Variables**
   - Vai su **Variables**
   - Aggiungi tutte le variabili (come per Vercel)

2. **Deploy**
   - Railway deploya automaticamente
   - Domain: `https://tuoprogetto.up.railway.app`

---

## 3. 🟢 Deploy su Netlify

Netlify offre hosting gratuito con build automatici.

### A. Setup

1. **Crea Account**
   - Vai su: https://netlify.com/
   - Registrati con GitHub

2. **Importa Progetto**
   - Clicca **"Add new site"** → **"Import an existing project"**
   - Connetti GitHub
   - Seleziona il repository

### B. Configurazione Build

```
Build command: npm run build
Publish directory: .next
```

### C. Environment Variables

Vai su **Site settings → Environment variables** e aggiungi tutte le key.

---

## 4. 🐳 Deploy con Docker (Server Proprio)

Se vuoi hostare su un tuo server (VPS, AWS EC2, DigitalOcean).

### A. Crea Dockerfile

```dockerfile
# Dockerfile
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

### B. Docker Compose

```yaml
# docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    env_file:
      - .env.local
    restart: unless-stopped
```

### C. Deploy

```bash
# Build
docker build -t ai-art-judge .

# Run
docker run -p 3000:3000 --env-file .env.local ai-art-judge

# O con docker-compose
docker-compose up -d
```

---

## 📊 Monitoring & Analytics

### Vercel Analytics

1. Vai su dashboard Vercel
2. **Analytics** → Abilita
3. Monitoraggio gratuito di:
   - Page views
   - Performance
   - Errori

### Sentry (Error Tracking)

```bash
npm install @sentry/nextjs
```

Segui: https://docs.sentry.io/platforms/javascript/guides/nextjs/

### Supabase Analytics

Dashboard Supabase mostra:
- Autenticazioni
- Query database
- API usage

---

## 🔐 Sicurezza in Produzione

### Checklist

- [ ] **Environment Variables**: Mai hardcoded nel codice
- [ ] **HTTPS**: Sempre (Vercel/Railway lo fanno automaticamente)
- [ ] **Rate Limiting**: Considera Vercel Edge Config
- [ ] **CORS**: Configura allowed origins
- [ ] **Supabase RLS**: Abilita Row Level Security
- [ ] **API Keys Rotation**: Rigenera periodicamente

### Headers di Sicurezza

Aggiungi in `next.config.ts`:

```typescript
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  }
];

export default {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};
```

---

## 💰 Costi Stimati

### Vercel (Raccomandato per iniziare)
- **Hobby Plan**: Gratis
  - 100GB bandwidth/mese
  - Illimitate deploy
  - ✅ Sufficiente per iniziare
  
- **Pro Plan**: $20/mese
  - 1TB bandwidth
  - Team features
  
### Railway
- **Starter**: Gratis ($5 credito/mese)
- **Developer**: $5/mese per servizio

### Netlify
- **Starter**: Gratis
  - 100GB bandwidth
  - 300 build minutes

### VPS (DigitalOcean, Linode)
- **Basic Droplet**: $6/mese
  - 1GB RAM
  - 25GB SSD
  - 1TB transfer

---

## 🚀 CI/CD Automation

### GitHub Actions (Esempio)

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build
      - run: npm test # se hai test
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

---

## 📈 Scalabilità

### Se l'app cresce:

1. **Database**: Considera upgrade Supabase plan
2. **CDN**: Usa Vercel Edge o CloudFlare
3. **Caching**: Implementa Redis per risultati comuni
4. **Queue**: Usa BullMQ per valutazioni asincrone
5. **Load Balancer**: Se host proprio

---

## ✅ Post-Deploy Checklist

- [ ] Sito accessibile via HTTPS
- [ ] Registrazione utente funziona
- [ ] Login funziona
- [ ] Upload immagine funziona
- [ ] Tutte le 8 chat rispondono
- [ ] Custom prompts salvati
- [ ] Rating funziona
- [ ] Logout funziona
- [ ] Supabase redirect URLs aggiornati
- [ ] Environment variables corrette
- [ ] Domain personalizzato (opzionale)
- [ ] Analytics configurato (opzionale)

---

## 🆘 Troubleshooting Deployment

### Build Fails
- Controlla TypeScript errors: `npm run build` localmente
- Verifica tutte le dipendenze in `package.json`

### "500 Internal Server Error"
- Controlla i logs Vercel/Railway
- Verifica environment variables
- Controlla che tutte le API keys siano valide

### Supabase Auth Non Funziona
- Verifica redirect URLs in Supabase dashboard
- Controlla NEXT_PUBLIC_APP_URL
- Verifica che CORS sia configurato

### Rate Limits Superati
- Aumenta tier su OpenAI/Anthropic
- Implementa caching
- Aggiungi queue system

---

## 🎉 Deploy Completato!

Congratulazioni! La tua app è live.

Condividi il link:
```
https://tuodominio.vercel.app
```

---

**Buon deploy! 🚀✨**
