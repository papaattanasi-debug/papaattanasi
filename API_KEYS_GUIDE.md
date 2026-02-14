# 🔑 Guida Completa: Ottenere Tutte le API Keys

Questa guida ti aiuta a ottenere TUTTE le chiavi API necessarie per far funzionare l'applicazione.

---

## 1. 🗄️ Supabase Keys

### Progetto: papaattanasi-debug's Project
**Project ID**: `sbsvhtaqekeprbemowcp`  
**Dashboard**: https://supabase.com/dashboard/project/sbsvhtaqekeprbemowcp

### A. NEXT_PUBLIC_SUPABASE_URL
✅ Già configurato:
```
https://sbsvhtaqekeprbemowcp.supabase.co
```

### B. NEXT_PUBLIC_SUPABASE_ANON_KEY

1. Vai su: https://supabase.com/dashboard/project/sbsvhtaqekeprbemowcp/settings/api
2. Trova la sezione **"Project API keys"**
3. Copia la chiave **"anon"** (o "public")
4. Incollala nel `.env.local`

**Esempio**:
```
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key-here
```

### C. SUPABASE_SERVICE_ROLE_KEY

⚠️ **PRIVATA** - Non condividere mai!

1. Stessa pagina: https://supabase.com/dashboard/project/sbsvhtaqekeprbemowcp/settings/api
2. Trova **"service_role"**
3. Clicca **"Reveal"** per mostrarla
4. Copiala nel `.env.local`

**Esempio**:
```
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key-here
```

---

## 2. 🟢 OpenAI API Key (GPT-5.2)

### Creazione Account
1. Vai su: https://platform.openai.com/signup
2. Registrati con email o Google/Microsoft
3. Verifica l'email

### Ottenere la Key
1. Vai su: https://platform.openai.com/api-keys
2. Clicca **"Create new secret key"**
3. Dai un nome: "AI Art Judge"
4. Clicca **"Create secret key"**
5. **COPIA SUBITO** (non potrai più vederla!)

**Esempio**:
```
OPENAI_API_KEY=sk-proj-abc123def456ghi789jkl012mno345pqr678stu901vwx234yz567
```

### Aggiungere Credito
⚠️ OpenAI richiede credito prepagato:
1. Vai su: https://platform.openai.com/account/billing
2. Clicca **"Add payment method"**
3. Aggiungi carta di credito
4. Carica almeno $5-10 per iniziare

### Rate Limits
- **Tier 1** (nuovo account): 500 req/giorno
- **Tier 2** ($50+ spesi): 5000 req/giorno

---

## 3. 🟠 Anthropic API Key (Claude Opus 4.6)

### Creazione Account
1. Vai su: https://console.anthropic.com/
2. Clicca **"Sign Up"**
3. Registrati con email

### Ottenere la Key
1. Vai su: https://console.anthropic.com/settings/keys
2. Clicca **"Create Key"**
3. Dai un nome: "AI Art Judge"
4. Copia la key

**Esempio**:
```
ANTHROPIC_API_KEY=sk-ant-api03-abc123def456ghi789jkl012mno345pqr678stu901vwx234yz567
```

### Aggiungere Credito
1. Vai su: https://console.anthropic.com/settings/billing
2. Clicca **"Add credits"**
3. Carica almeno $10 per iniziare

### Rate Limits
- **Default**: 50 req/min, 40K tokens/min
- Aumenta automaticamente con l'uso

---

## 4. 🟣 Moonshot AI API Key (Kimi K2.5)

### Creazione Account
1. Vai su: https://platform.moonshot.ai/
2. Clicca **"注册"** (Registrati) o **"Sign Up"**
3. Puoi usare email o numero di telefono

⚠️ **Nota**: Il sito potrebbe essere in cinese. Usa Google Translate nel browser.

### Ottenere la Key
1. Dopo il login, vai su: https://platform.moonshot.ai/console/api-keys
2. Clicca **"创建新密钥"** (Create new key)
3. Dai un nome: "AI Art Judge"
4. Copia la key

**Esempio**:
```
MOONSHOT_API_KEY=sk-abc123def456ghi789jkl012mno345pqr678stu901vwx234yz567
```

### Credito
- Moonshot offre **credito gratuito iniziale**
- Molto economico: ~$1/M tokens

### Alternative
Se hai problemi ad accedere:
- Prova con VPN (server in Asia)
- Contatta support: support@moonshot.ai

---

## 5. 🔵 DeepSeek API Key (V3.2)

### Creazione Account
1. Vai su: https://platform.deepseek.com/
2. Clicca **"Sign Up"**
3. Registrati con email o GitHub

### Ottenere la Key
1. Dopo il login, vai su: https://platform.deepseek.com/api_keys
2. Clicca **"Create API Key"**
3. Dai un nome: "AI Art Judge"
4. Copia la key

**Esempio**:
```
DEEPSEEK_API_KEY=sk-abc123def456ghi789jkl012mno345pqr678stu901vwx234yz567
```

### Credito
- DeepSeek offre **credito gratuito generoso** (~$5)
- Estremamente economico: $0.14/M tokens input

### Documentazione
- https://platform.deepseek.com/docs

---

## ✅ Checklist Completa

Verifica di avere tutte le chiavi:

### Supabase (3 chiavi)
- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`

### AI Models (4 chiavi)
- [ ] `OPENAI_API_KEY`
- [ ] `ANTHROPIC_API_KEY`
- [ ] `MOONSHOT_API_KEY`
- [ ] `DEEPSEEK_API_KEY`

---

## 📝 Template `.env.local`

Copia questo template e sostituisci i placeholder:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key-here

# OpenAI - GPT-5.2
OPENAI_API_KEY=sk-proj-your-key-here

# Anthropic - Claude Opus 4.6
ANTHROPIC_API_KEY=sk-ant-api03-your-key-here

# Moonshot AI - Kimi K2.5
MOONSHOT_API_KEY=sk-your-key-here

# Google Gemini
GEMINI_API_KEY=your-gemini-key-here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 💰 Budget Consigliato

Per iniziare, carica:

| Provider | Budget Iniziale | Durata Stimata |
|----------|-----------------|----------------|
| OpenAI | $10 | ~100-200 valutazioni |
| Anthropic | $10 | ~100-200 valutazioni |
| Moonshot | $5 | ~500+ valutazioni |
| DeepSeek | Gratis/$5 | ~1000+ valutazioni |

**Totale**: ~$30-35 per iniziare

---

## 🔒 Sicurezza

### ✅ Best Practices

1. **Mai committare `.env.local` su Git**
   - È già in `.gitignore`
   
2. **Rigenera le key se esposte**
   - Se accidentalmente condividi una key, rigenerala immediatamente
   
3. **Usa key diverse per dev/prod**
   - Crea key separate per sviluppo e produzione
   
4. **Monitora l'uso**
   - Controlla regolarmente i dashboard per uso anomalo

### ⚠️ Red Flags

Se noti:
- Spike improvviso di richieste
- Costi inaspettati
- Richieste da IP sconosciuti

→ **Rigenera immediatamente tutte le key!**

---

## 🆘 Troubleshooting

### "Invalid API Key" - OpenAI
- Verifica che la key inizi con `sk-proj-`
- Controlla di averla copiata completamente
- Assicurati di aver aggiunto credito all'account

### "401 Unauthorized" - Anthropic
- Verifica che la key inizi con `sk-ant-api`
- Controlla di aver confermato l'email
- Assicurati di aver accettato i Terms of Service

### "403 Forbidden" - Moonshot
- Potrebbe essere necessario un VPN
- Verifica che l'account sia attivato
- Controlla di aver accettato i termini

### "Rate Limit" - Qualsiasi provider
- Attendi qualche minuto
- Controlla i rate limits nel dashboard
- Considera di aggiornare il tier (OpenAI/Anthropic)

---

## 🎯 Test Rapido

Dopo aver configurato tutte le key, testa:

```bash
# Avvia il server
npm run dev

# Vai su http://localhost:3000
# Registra un utente
# Carica un'immagine
# Clicca "Avvia Valutazione"
```

Se tutto funziona, dovresti vedere:
- ✅ 8 pannelli in loading
- ✅ Risposte che arrivano una alla volta
- ✅ Tempo di risposta e token count

Se un pannello mostra errore rosso:
- Controlla la console del browser
- Verifica la key corrispondente
- Controlla i rate limits

---

## 📞 Support Links

- **OpenAI**: https://help.openai.com/
- **Anthropic**: support@anthropic.com
- **Moonshot**: support@moonshot.ai
- **DeepSeek**: support@deepseek.com
- **Supabase**: https://supabase.com/support

---

**Buona configurazione! 🚀**
