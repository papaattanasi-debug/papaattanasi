# 🗄️ Setup Database Supabase - GUIDA COMPLETA

## ⚡ Setup Rapido (3 Passaggi)

### 1️⃣ Ottieni le API Keys Supabase

**A. NEXT_PUBLIC_SUPABASE_ANON_KEY**

1. Vai su: https://supabase.com/dashboard/project/sbsvhtaqekeprbemowcp/settings/api
2. Nella sezione **"Project API keys"**
3. Copia la chiave **"anon"** (public key)
4. Incollala in `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key-here
   ```

**B. SUPABASE_SERVICE_ROLE_KEY**

⚠️ **CHIAVE PRIVATA** - Non condividere!

1. Stessa pagina: https://supabase.com/dashboard/project/sbsvhtaqekeprbemowcp/settings/api
2. Trova la sezione **"service_role"**
3. Clicca **"Reveal"** per visualizzarla
4. Copiala in `.env.local`:
   ```
   SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key-here
   ```

---

### 2️⃣ Crea le Tabelle del Database

**Metodo 1: SQL Editor (Raccomandato)**

1. Vai su: https://supabase.com/dashboard/project/sbsvhtaqekeprbemowcp/editor
2. Clicca **"SQL Editor"** nel menu laterale sinistro
3. Clicca **"New query"** in alto a sinistra
4. **Copia TUTTO il contenuto del file** `supabase_schema.sql` (nella root del progetto)
5. **Incollalo** nell'editor SQL
6. Clicca **"Run"** (o premi `CMD+Enter` / `CTRL+Enter`)
7. Aspetta che appaia "Success! No rows returned" o simile

✅ **Fatto!** Le tabelle sono create.

**Metodo 2: Table Editor (Manuale)**

Se preferisci l'interfaccia visuale:

1. Vai su: https://supabase.com/dashboard/project/sbsvhtaqekeprbemowcp/editor
2. Clicca **"Table Editor"**
3. Crea manualmente le tabelle seguendo lo schema in `supabase_schema.sql`

---

### 3️⃣ Abilita Autenticazione Email

1. Vai su: https://supabase.com/dashboard/project/sbsvhtaqekeprbemowcp/auth/providers
2. Trova **"Email"** nella lista dei providers
3. Assicurati che il toggle sia **VERDE** (abilitato)
4. Se non lo è, cliccalo per abilitarlo
5. Clicca **"Save"** se necessario

✅ **Fatto!** L'autenticazione è configurata.

---

## ✅ Verifica Setup

Esegui questo comando per verificare che tutto sia configurato:

```bash
npm run setup-db
```

Questo script:
- ✅ Verifica che le API keys siano configurate
- ✅ Testa la connessione a Supabase
- ✅ Controlla se le tabelle esistono
- ✅ Ti dice cosa manca (se qualcosa non va)

---

## 🗂️ Struttura Database

### Tabella: `evaluations`

Salva tutte le valutazioni degli utenti:

```sql
CREATE TABLE evaluations (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  image_url TEXT NOT NULL,
  created_at TIMESTAMP,
  
  -- Risposte dei modelli (JSON)
  gpt52_guided JSONB,
  gpt52_custom JSONB,
  claude46_guided JSONB,
  claude46_custom JSONB,
  kimi25_guided JSONB,
  kimi25_custom JSONB,
  deepseek32_guided JSONB,
  deepseek32_custom JSONB,
  
  -- Custom prompts usati
  custom_prompts JSONB,
  
  -- Rating utente
  ratings JSONB,
  
  -- Note
  notes TEXT
);
```

### Tabella: `saved_prompts`

Salva i custom prompts preferiti dell'utente:

```sql
CREATE TABLE saved_prompts (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  name TEXT NOT NULL,
  prompt_text TEXT NOT NULL,
  created_at TIMESTAMP,
  is_favorite BOOLEAN
);
```

### Row Level Security (RLS)

Entrambe le tabelle hanno RLS abilitato:
- Gli utenti vedono SOLO i propri dati
- Nessuno può vedere i dati di altri utenti
- Ogni operazione è autorizzata automaticamente

---

## 🔧 Troubleshooting

### "relation does not exist"

**Problema**: Le tabelle non sono state create.

**Soluzione**:
1. Vai nel SQL Editor
2. Riesegui `supabase_schema.sql`
3. Verifica che non ci siano errori rossi

---

### "JWT expired" o "Invalid API key"

**Problema**: Le API keys sono sbagliate o scadute.

**Soluzione**:
1. Rigenera le keys dal dashboard
2. Aggiorna `.env.local`
3. Riavvia il server (`npm run dev`)

---

### "permission denied for table evaluations"

**Problema**: RLS è attivo ma le policy non sono configurate.

**Soluzione**:
1. Riesegui lo schema SQL completo
2. Verifica che le CREATE POLICY siano eseguite

---

## 📊 Verifica Visuale

### Controlla le Tabelle Create

1. Vai su: https://supabase.com/dashboard/project/sbsvhtaqekeprbemowcp/editor
2. Clicca **"Table Editor"**
3. Dovresti vedere:
   - ✅ `evaluations`
   - ✅ `saved_prompts`

### Controlla RLS (Row Level Security)

1. Vai su: https://supabase.com/dashboard/project/sbsvhtaqekeprbemowcp/auth/policies
2. Dovresti vedere policy per:
   - `evaluations` (4 policy: SELECT, INSERT, UPDATE, DELETE)
   - `saved_prompts` (1 policy: manage own prompts)

---

## 🚀 Dopo il Setup

Una volta completati tutti i passaggi:

```bash
# 1. Verifica setup
npm run setup-db

# 2. Avvia il server
npm run dev

# 3. Registra un utente
http://localhost:3000/register

# 4. Testa una valutazione!
```

---

## 💡 Tips

### Backup Database

Puoi esportare il database in qualsiasi momento:

1. SQL Editor → Esporta query results
2. Oppure usa `pg_dump` (avanzato)

### Reset Database

Per ricominciare da zero:

```sql
-- Esegui nel SQL Editor
DROP TABLE IF EXISTS evaluations CASCADE;
DROP TABLE IF EXISTS saved_prompts CASCADE;

-- Poi riesegui supabase_schema.sql
```

---

## 📞 Link Utili

- **Dashboard Progetto**: https://supabase.com/dashboard/project/sbsvhtaqekeprbemowcp
- **API Settings**: https://supabase.com/dashboard/project/sbsvhtaqekeprbemowcp/settings/api
- **SQL Editor**: https://supabase.com/dashboard/project/sbsvhtaqekeprbemowcp/editor
- **Auth Settings**: https://supabase.com/dashboard/project/sbsvhtaqekeprbemowcp/auth/providers
- **Documentazione Supabase**: https://supabase.com/docs

---

## ✅ Checklist Finale

Prima di procedere, verifica:

- [ ] Ho copiato `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`
- [ ] Ho copiato `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`
- [ ] Ho eseguito `supabase_schema.sql` nel SQL Editor
- [ ] Ho abilitato Email authentication
- [ ] Ho eseguito `npm run setup-db` senza errori
- [ ] Vedo le tabelle nel Table Editor

Se tutti i checkbox sono spuntati: **SEI PRONTO! 🎉**

```bash
npm run dev
```

---

**Progetto**: AI Art Judge  
**Supabase Project**: papaattanasi-debug's Project  
**Region**: eu-west-1
