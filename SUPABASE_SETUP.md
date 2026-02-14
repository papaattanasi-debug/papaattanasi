# 🔑 Come Ottenere le Chiavi API di Supabase

Questo progetto è collegato al progetto Supabase **"papaattanasi-debug's Project"** (ID: `sbsvhtaqekeprbemowcp`).

## 📍 Link Diretto al Progetto

**Dashboard Progetto**: https://supabase.com/dashboard/project/sbsvhtaqekeprbemowcp

## 🔐 Ottenere le API Keys

### 1. NEXT_PUBLIC_SUPABASE_URL

Questa è già configurata:
```
NEXT_PUBLIC_SUPABASE_URL=https://sbsvhtaqekeprbemowcp.supabase.co
```

### 2. NEXT_PUBLIC_SUPABASE_ANON_KEY

1. Vai su: https://supabase.com/dashboard/project/sbsvhtaqekeprbemowcp/settings/api
2. Nella sezione **"Project API keys"**
3. Copia la chiave **"anon" / "public"**
4. Incollala nel file `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key-here
   ```

### 3. SUPABASE_SERVICE_ROLE_KEY

⚠️ **ATTENZIONE**: Questa chiave è PRIVATA e non deve essere condivisa o committata su Git!

1. Nella stessa pagina: https://supabase.com/dashboard/project/sbsvhtaqekeprbemowcp/settings/api
2. Trova la sezione **"service_role"** key
3. Clicca su **"Reveal"** per visualizzarla
4. Copiala nel `.env.local`:
   ```
   SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key-here
   ```

## ✅ Configurazione Autenticazione

### Abilitare Email/Password Authentication

1. Vai su: https://supabase.com/dashboard/project/sbsvhtaqekeprbemowcp/auth/providers
2. Trova **Email** nella lista dei providers
3. Assicurati che sia **Abilitato** (toggle verde)
4. Salva se necessario

### Configurare Redirect URLs

1. Vai su: https://supabase.com/dashboard/project/sbsvhtaqekeprbemowcp/auth/url-configuration
2. Aggiungi queste URL alla lista **"Redirect URLs"**:
   - `http://localhost:3000/**`
   - `https://tuodominio.com/**` (quando vai in produzione)
3. Imposta **Site URL** a:
   - Sviluppo: `http://localhost:3000`
   - Produzione: `https://tuodominio.com`

## 🗄️ Database (Opzionale)

Se vuoi salvare le valutazioni nel database, crea questa tabella:

```sql
-- Tabella per salvare le valutazioni
CREATE TABLE evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Risposte dei modelli
  gpt52_guided JSONB,
  gpt52_custom JSONB,
  claude46_guided JSONB,
  claude46_custom JSONB,
  kimi25_guided JSONB,
  kimi25_custom JSONB,
  deepseek32_guided JSONB,
  deepseek32_custom JSONB,
  
  -- Custom prompts usati
  custom_prompts JSONB
);

-- Abilita RLS (Row Level Security)
ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;

-- Policy: Gli utenti possono vedere solo le proprie valutazioni
CREATE POLICY "Users can view own evaluations"
  ON evaluations FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Gli utenti possono inserire le proprie valutazioni
CREATE POLICY "Users can insert own evaluations"
  ON evaluations FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

Esegui questo SQL nella **SQL Editor**: https://supabase.com/dashboard/project/sbsvhtaqekeprbemowcp/sql

## ✅ Verifica Configurazione

Dopo aver configurato tutto, verifica che:

1. ✅ Tutte le chiavi sono in `.env.local`
2. ✅ Email auth è abilitato
3. ✅ Redirect URLs sono configurati
4. ✅ Non hai committato `.env.local` su Git

## 🚀 Sei Pronto!

Ora puoi avviare il progetto:

```bash
npm run dev
```

E registrare il tuo primo utente su http://localhost:3000/register
