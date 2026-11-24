CREATE TABLE IF NOT EXISTS plants (
  id                     SERIAL PRIMARY KEY,
  name                   VARCHAR(100) NOT NULL,
  emoji                  VARCHAR(16)  NOT NULL,
  description            TEXT         NOT NULL DEFAULT '',
  light                  VARCHAR(20)  NOT NULL,
  care                   VARCHAR(20)  NOT NULL,
  watering_interval_days INTEGER      NOT NULL CHECK (watering_interval_days > 0)
);

CREATE TABLE IF NOT EXISTS collection (
  id           SERIAL PRIMARY KEY,
  plant_id     INTEGER      NOT NULL REFERENCES plants(id) ON DELETE RESTRICT,
  nickname     VARCHAR(100) NOT NULL DEFAULT '',
  last_watered DATE         NOT NULL,
  created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_collection_plant_id ON collection(plant_id);

-- ===== Autentikasi =====
CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(100) NOT NULL,
  email         VARCHAR(255) NOT NULL UNIQUE,
  password_hash TEXT         NOT NULL,
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

ALTER TABLE collection
  ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_collection_user_id ON collection(user_id);