CREATE TABLE users (
  id           SERIAL PRIMARY KEY,
  username     VARCHAR(50) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE notes (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title        VARCHAR(50) NOT NULL,
  text         VARCHAR(300) DEFAULT '',
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  modified_at  TIMESTAMPTZ DEFAULT NOW()
);
