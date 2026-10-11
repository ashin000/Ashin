CREATE TABLE IF NOT EXISTS portfolio_content (
  id TEXT PRIMARY KEY,
  content TEXT NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS admin_login_attempts (
  ip_hash TEXT NOT NULL,
  attempted_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS admin_login_attempts_ip_time
  ON admin_login_attempts (ip_hash, attempted_at);
