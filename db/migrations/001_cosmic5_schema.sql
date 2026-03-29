-- Cosmic 5 — initial schema (Supabase/Postgres compatible)
-- Source of truth: DB_SCHEMA_PROPOSAL.md + cosmic5-ui-requirements.md
-- Main UI period: reading_requests.period_key = 'daily'

CREATE TABLE IF NOT EXISTS style_presets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  label text NOT NULL,
  description text,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ai_prompt_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  version text NOT NULL,
  system_prompt text NOT NULL,
  user_prompt_template text NOT NULL,
  guardrails text,
  UNIQUE(name, version)
);

CREATE TABLE IF NOT EXISTS sign_interpretation (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sign_key text UNIQUE NOT NULL,
  element text NOT NULL,
  modality text NOT NULL,
  personality text NOT NULL,
  strengths jsonb DEFAULT '[]',
  cautions jsonb DEFAULT '[]',
  domain_guidance jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS period_tone (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  period_key text UNIQUE NOT NULL,
  intro text NOT NULL,
  suffix text NOT NULL
);

CREATE TABLE IF NOT EXISTS saju_element_meaning (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  element_key text UNIQUE NOT NULL,
  label text NOT NULL,
  dominant_meaning text NOT NULL,
  deficient_meaning text NOT NULL,
  balance_note text NOT NULL
);

CREATE TABLE IF NOT EXISTS saju_day_master_tendency (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ilgan text UNIQUE NOT NULL,
  relationships text NOT NULL,
  work text NOT NULL,
  money text NOT NULL,
  health text NOT NULL
);

CREATE TABLE IF NOT EXISTS compatibility_element_pairing (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pair_key text UNIQUE NOT NULL,
  score_delta numeric NOT NULL,
  attraction text NOT NULL,
  communication text NOT NULL,
  caution text NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id text UNIQUE,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS birth_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  name text,
  calendar_type text NOT NULL DEFAULT 'solar',
  birth_date date NOT NULL,
  birth_time time,
  birth_place text,
  rising_sign_ko text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS reading_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES birth_profiles(id),
  period_key text NOT NULL,
  style_key text NOT NULL,
  requested_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS raw_chart_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id uuid REFERENCES reading_requests(id) UNIQUE,
  payload jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS interpreted_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id uuid REFERENCES reading_requests(id) UNIQUE,
  payload jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS compatibility_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id_1 uuid REFERENCES birth_profiles(id),
  profile_id_2 uuid REFERENCES birth_profiles(id),
  payload jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ai_generated_outputs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id uuid REFERENCES reading_requests(id),
  prompt_version text NOT NULL,
  style_key text NOT NULL,
  payload jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_reading_requests_profile ON reading_requests(profile_id);
CREATE INDEX IF NOT EXISTS idx_ai_generated_request_style ON ai_generated_outputs(request_id, style_key);
