-- ============================================
-- AI RESEARCH JUDGMENT PLATFORM - DATABASE
-- ============================================

-- Tabella per salvare le sessioni di analisi
CREATE TABLE IF NOT EXISTS analysis_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  image_url TEXT NOT NULL,
  image_name TEXT,
  
  -- Metadata
  session_name TEXT,
  notes TEXT
);

-- Tabella per salvare le risposte AI
CREATE TABLE IF NOT EXISTS ai_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES analysis_sessions(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Model info
  model_name TEXT NOT NULL,
  provider TEXT NOT NULL,
  has_system_prompt BOOLEAN NOT NULL,
  custom_prompt TEXT,
  
  -- Response data
  content TEXT NOT NULL,
  tokens_used INTEGER,
  response_time INTEGER,
  error TEXT
);

-- Indici per performance
CREATE INDEX IF NOT EXISTS idx_sessions_created_at ON analysis_sessions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_responses_session_id ON ai_responses(session_id);
CREATE INDEX IF NOT EXISTS idx_responses_model ON ai_responses(model_name);

-- View per report completi
CREATE OR REPLACE VIEW session_reports AS
SELECT 
  s.id as session_id,
  s.created_at as session_date,
  s.image_url,
  s.image_name,
  s.session_name,
  s.notes,
  COUNT(r.id) as total_responses,
  SUM(r.tokens_used) as total_tokens,
  AVG(r.response_time) as avg_response_time,
  json_agg(
    json_build_object(
      'model', r.model_name,
      'provider', r.provider,
      'content', r.content,
      'tokens', r.tokens_used,
      'time', r.response_time,
      'custom_prompt', r.custom_prompt,
      'has_system_prompt', r.has_system_prompt
    ) ORDER BY r.created_at
  ) as responses
FROM analysis_sessions s
LEFT JOIN ai_responses r ON s.id = r.session_id
GROUP BY s.id, s.created_at, s.image_url, s.image_name, s.session_name, s.notes
ORDER BY s.created_at DESC;

-- ============================================
-- FINE SCHEMA
-- ============================================
