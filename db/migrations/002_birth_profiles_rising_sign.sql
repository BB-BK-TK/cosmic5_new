-- Persist Western-style ascendant (상승 / rising sign) when computed for a profile.
-- Populated from client view-model on reading save (see app/api/readings).

ALTER TABLE birth_profiles
  ADD COLUMN IF NOT EXISTS rising_sign_ko text;

COMMENT ON COLUMN birth_profiles.rising_sign_ko IS '별자리 상승(ASC) 한글 라벨, e.g. 천칭자리; 출생시간 없으면 NULL';
