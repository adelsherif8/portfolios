-- First-party analytics for adelatya.com (Neon Postgres, provisioned through the Vercel marketplace).
-- Apply with: node api/_lib/migrate.js   (reads DATABASE_URL from the environment)
-- No raw IPs are stored. "visitor" is a 16-hex HMAC of (UTC date + IP + user agent) that changes every day.

CREATE TABLE IF NOT EXISTS events (
  id           bigserial PRIMARY KEY,
  ts           timestamptz NOT NULL DEFAULT now(),
  type         text NOT NULL,          -- pageview | cta_click | booking_click | email_click | phone_click | demo_click | outbound_click | contact_submit
  path         text NOT NULL,          -- page the event happened on
  label        text NOT NULL DEFAULT '', -- link target / button text for click events
  ref_host     text NOT NULL DEFAULT '', -- external referrer host, '' for direct / internal
  utm_source   text NOT NULL DEFAULT '',
  utm_medium   text NOT NULL DEFAULT '',
  utm_campaign text NOT NULL DEFAULT '',
  country      text NOT NULL DEFAULT '',
  device       text NOT NULL DEFAULT '',  -- desktop | mobile | tablet
  visitor      text NOT NULL
);
CREATE INDEX IF NOT EXISTS events_ts_idx ON events (ts);
CREATE INDEX IF NOT EXISTS events_type_ts_idx ON events (type, ts);

-- Failed admin logins, for a simple per-IP lockout. Stores an HMAC of the IP, never the IP.
CREATE TABLE IF NOT EXISTS login_failures (
  ts      timestamptz NOT NULL DEFAULT now(),
  ip_hash text NOT NULL
);
CREATE INDEX IF NOT EXISTS login_failures_ts_idx ON login_failures (ts);
