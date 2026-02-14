-- ============================================
-- AI ART JUDGE - DATABASE SCHEMA
-- ============================================
-- Progetto Supabase: papaattanasi-debug's Project
-- Project ID: sbsvhtaqekeprbemowcp
-- ============================================

-- Tabella per salvare le valutazioni
CREATE TABLE IF NOT EXISTS evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Metadati immagine
  image_name TEXT,
  image_size INTEGER,
  
  -- Risposte dei modelli (JSONB contiene: content, tokensUsed, responseTime, error)
  gpt52_guided JSONB,
  gpt52_custom JSONB,
  claude46_guided JSONB,
  claude46_custom JSONB,
  kimi25_guided JSONB,
  kimi25_custom JSONB,
  deepseek32_guided JSONB,
  deepseek32_custom JSONB,
  
  -- Custom prompts usati dall'utente
  custom_prompts JSONB,
  
  -- Rating utente per ogni modello (1-5 stelle)
  ratings JSONB,
  
  -- Note dell'utente
  notes TEXT
);

-- Indici per performance
CREATE INDEX IF NOT EXISTS evaluations_user_id_idx ON evaluations(user_id);
CREATE INDEX IF NOT EXISTS evaluations_created_at_idx ON evaluations(created_at DESC);

-- Abilita Row Level Security
ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;

-- Policy: Gli utenti possono vedere solo le proprie valutazioni
CREATE POLICY "Users can view own evaluations"
  ON evaluations FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Gli utenti possono inserire le proprie valutazioni
CREATE POLICY "Users can insert own evaluations"
  ON evaluations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Gli utenti possono aggiornare le proprie valutazioni
CREATE POLICY "Users can update own evaluations"
  ON evaluations FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Gli utenti possono eliminare le proprie valutazioni
CREATE POLICY "Users can delete own evaluations"
  ON evaluations FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger per aggiornare updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_evaluations_updated_at
    BEFORE UPDATE ON evaluations
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

-- ============================================
-- Tabella per salvare i custom prompts preferiti
-- ============================================
CREATE TABLE IF NOT EXISTS saved_prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  prompt_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_favorite BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS saved_prompts_user_id_idx ON saved_prompts(user_id);

ALTER TABLE saved_prompts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own prompts"
  ON saved_prompts
  USING (auth.uid() = user_id);

-- ============================================
-- STATISTICHE (View per dashboard)
-- ============================================
CREATE OR REPLACE VIEW user_stats AS
SELECT 
  user_id,
  COUNT(*) as total_evaluations,
  COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '7 days') as evaluations_last_week,
  COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '30 days') as evaluations_last_month,
  MIN(created_at) as first_evaluation,
  MAX(created_at) as last_evaluation
FROM evaluations
GROUP BY user_id;

-- ============================================
-- ESEMPIO DI QUERY
-- ============================================

-- Ottenere tutte le valutazioni di un utente
-- SELECT * FROM evaluations WHERE user_id = auth.uid() ORDER BY created_at DESC;

-- Ottenere l'ultima valutazione
-- SELECT * FROM evaluations WHERE user_id = auth.uid() ORDER BY created_at DESC LIMIT 1;

-- Salvare una nuova valutazione
-- INSERT INTO evaluations (user_id, image_url, gpt52_guided, ...) VALUES (...);

-- Aggiornare il rating di una valutazione
-- UPDATE evaluations SET ratings = '{"GPT-5.2 Thinking (Guided)": 5}' WHERE id = '...';

-- ============================================
-- FINE SCHEMA
-- ============================================
