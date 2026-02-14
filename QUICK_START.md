# ⚡ Quick Start - AI Art Judge

Inizia in 5 minuti! 🚀

---

## 📋 Checklist Rapida

### 1. Installa Dipendenze
```bash
npm install
```

### 2. Configura API Keys

Copia `.env.example` in `.env.local`:
```bash
cp .env.example .env.local
```

Apri `.env.local` e inserisci le tue chiavi:

```env
# ✅ Supabase (progetto già configurato)
NEXT_PUBLIC_SUPABASE_URL=https://sbsvhtaqekeprbemowcp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[OTTIENI QUI: https://supabase.com/dashboard/project/sbsvhtaqekeprbemowcp/settings/api]
SUPABASE_SERVICE_ROLE_KEY=[STESSA PAGINA, clicca "Reveal"]

# 🤖 API Keys AI
OPENAI_API_KEY=[OTTIENI QUI: https://platform.openai.com/api-keys]
ANTHROPIC_API_KEY=[OTTIENI QUI: https://console.anthropic.com/settings/keys]
MOONSHOT_API_KEY=[OTTIENI QUI: https://platform.moonshot.ai/console/api-keys]
DEEPSEEK_API_KEY=[OTTIENI QUI: https://platform.deepseek.com/api_keys]
```

📖 **Guida completa keys**: Leggi `API_KEYS_GUIDE.md`

### 3. Setup Database Supabase

1. Vai su: https://supabase.com/dashboard/project/sbsvhtaqekeprbemowcp/editor
2. Clicca **"SQL Editor"** (menu laterale)
3. Clicca **"New query"**
4. Copia e incolla il contenuto di `supabase_schema.sql`
5. Clicca **"Run"**

### 4. Abilita Autenticazione Email

1. Vai su: https://supabase.com/dashboard/project/sbsvhtaqekeprbemowcp/auth/providers
2. Trova **Email** nella lista
3. Assicurati che il toggle sia **verde** (abilitato)
4. Salva se necessario

### 5. Avvia il Server

```bash
npm run dev
```

Apri: http://localhost:3000

---

## 🎯 Primo Test

1. **Registrati**
   - Vai su http://localhost:3000/register
   - Nome: Il tuo nome
   - Email: test@example.com
   - Password: password123
   
2. **Carica Immagine**
   - Clicca sul box di upload
   - Seleziona un'immagine (disegno, dipinto, foto)
   
3. **(Opzionale) Personalizza Prompts**
   - Nelle chat "Custom", clicca icona ⚙️
   - Scrivi il tuo prompt personalizzato
   
4. **Valuta!**
   - Clicca "Avvia Valutazione"
   - Guarda le 8 chat riempirsi con le risposte AI!

---

## 📚 Documentazione Completa

Se hai bisogno di più dettagli:

| File | Cosa Contiene |
|------|---------------|
| `README.md` | Overview completo del progetto |
| `API_KEYS_GUIDE.md` | Come ottenere TUTTE le API keys |
| `SUPABASE_SETUP.md` | Setup dettagliato Supabase |
| `AI_MODELS_GUIDE.md` | Dettagli tecnici sui 4 modelli AI |
| `TESTING_GUIDE.md` | Guida completa al testing |
| `DEPLOYMENT_GUIDE.md` | Come deployare in produzione |
| `PROJECT_SUMMARY.md` | Riepilogo completo progetto |

---

## ❓ FAQ Rapide

### Non funziona! Cosa faccio?

1. **Verifica .env.local**
   - Tutte le chiavi sono inserite?
   - Non ci sono spazi extra?
   
2. **Controlla la Console**
   - Apri DevTools (F12)
   - Vai su Console
   - Ci sono errori rossi?
   
3. **Verifica Supabase**
   - Email auth è abilitato?
   - Database schema è stato eseguito?

### "Network Error" su tutte le chat?

Le API keys non sono configurate o non sono valide.
→ Controlla `.env.local`

### "401 Unauthorized" su Supabase?

La Anon Key è sbagliata o mancante.
→ Rigenerala da Supabase Dashboard

### Un modello non risponde?

- Controlla la key specifica
- Verifica di avere credito sull'account
- Guarda i rate limits

---

## 💡 Tips

### Custom Prompts Interessanti

**Critico Severo**:
```
Sei un critico d'arte spietato. Valuta senza mezzi termini, 
onestà brutale su cosa funziona e cosa no.
```

**Insegnante Paziente**:
```
Sei un insegnante d'arte incoraggiante. Evidenzia sempre 
prima i punti di forza, poi suggerimenti costruttivi.
```

**Esperto Tecnico**:
```
Analizza solo gli aspetti tecnici: composizione, prospettiva, 
uso del colore, tecnica del tratto. Sii dettagliato e preciso.
```

---

## 🎨 Esempio di Flusso

1. **Login** → Dashboard
2. **Upload** → Immagine di un disegno
3. **Custom Prompt** (GPT Custom):
   ```
   Sei un insegnante di fumetti manga. Valuta questo disegno 
   dal punto di vista dell'anatomia, dinamicità e stile manga.
   ```
4. **Avvia Valutazione** → 8 risposte simultanee!
5. **Confronta** le risposte tra:
   - GPT vs Claude vs Kimi vs DeepSeek
   - Guided vs Custom per ogni modello
6. **Scegli** la valutazione più utile
7. **Rating** → Vota con le stelle

---

## 🚀 Prossimi Step

Dopo il primo test:

1. **Salva Valutazioni**
   - TODO: Implementare salvataggio nel DB
   
2. **History**
   - TODO: Pagina con tutte le valutazioni passate
   
3. **Export**
   - TODO: Esporta valutazioni in PDF
   
4. **Deploy**
   - Quando sei pronto, segui `DEPLOYMENT_GUIDE.md`

---

## 📞 Hai Bisogno di Aiuto?

1. Leggi i file di documentazione nella root
2. Controlla la console del browser (F12)
3. Verifica i log di Supabase
4. Controlla i dashboard delle API (OpenAI, Anthropic, etc.)

---

## ✅ Tutto Funziona?

Congratulazioni! 🎉

Hai appena:
- ✅ Configurato 4 modelli AI diversi
- ✅ Creato 8 chat simultanee
- ✅ Integrato autenticazione Supabase
- ✅ Costruito una piattaforma di valutazione artistica completa

**Ora divertiti a valutare le tue opere! 🎨✨**

---

**Progetto creato per Lorenzo Balduzzi - Febbraio 2026**
