-- Add birthplace precision fields so timezone/solar-time corrections are queryable.

ALTER TABLE birth_profiles
  ADD COLUMN IF NOT EXISTS birth_lat numeric,
  ADD COLUMN IF NOT EXISTS birth_lon numeric,
  ADD COLUMN IF NOT EXISTS birth_timezone text,
  ADD COLUMN IF NOT EXISTS utc_offset_minutes int,
  ADD COLUMN IF NOT EXISTS solar_offset_minutes int;

