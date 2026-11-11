// Google Search Console, read server-side with the seo-monitor service account
// (same account ~/adelatya-outreach/seo/monitor.py uses). Key lives in the GSC_SERVICE_ACCOUNT env var.
const crypto = require("crypto");

const SITE = "sc-domain:adelatya.com";
let tokenCache = { token: null, exp: 0 };
let dataCache = { at: 0, data: null };

async function token() {
  if (tokenCache.token && tokenCache.exp > Date.now() + 60000) return tokenCache.token;
  const sa = JSON.parse(process.env.GSC_SERVICE_ACCOUNT || "null");
  if (!sa || !sa.private_key) throw new Error("GSC_SERVICE_ACCOUNT not configured");
  const now = Math.floor(Date.now() / 1000);
  const enc = (o) => Buffer.from(JSON.stringify(o)).toString("base64url");
  const unsigned = enc({ alg: "RS256", typ: "JWT" }) + "." + enc({
    iss: sa.client_email, scope: "https://www.googleapis.com/auth/webmasters.readonly",
    aud: sa.token_uri || "https://oauth2.googleapis.com/token", iat: now, exp: now + 3600,
  });
  const sig = crypto.createSign("RSA-SHA256").update(unsigned).sign(sa.private_key).toString("base64url");
  const r = await fetch(sa.token_uri || "https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: `${unsigned}.${sig}` }),
  });
  const j = await r.json();
  if (!r.ok) throw new Error("GSC token: " + (j.error_description || j.error || r.status));
  tokenCache = { token: j.access_token, exp: Date.now() + (j.expires_in || 3600) * 1000 };
  return j.access_token;
}

async function query(tok, body) {
  const r = await fetch(`https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE)}/searchAnalytics/query`, {
    method: "POST",
    headers: { Authorization: `Bearer ${tok}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const j = await r.json();
  if (!r.ok) throw new Error("GSC query: " + ((j.error && j.error.message) || r.status));
  return j.rows || [];
}

const iso = (d) => d.toISOString().slice(0, 10);
const row = (r) => ({
  key: r.keys ? r.keys[0] : null, clicks: r.clicks, impressions: r.impressions,
  ctr: r.ctr, position: r.position,
});

// Last 28 days of Search Console data. GSC lags about 2 days, so the window ends 2 days ago.
async function searchConsole() {
  if (dataCache.data && Date.now() - dataCache.at < 30 * 60 * 1000) return dataCache.data;
  const end = new Date(Date.now() - 2 * 86400000);
  const start = new Date(end.getTime() - 27 * 86400000);
  const base = { startDate: iso(start), endDate: iso(end), dataState: "all" };
  const tok = await token();
  const [tot, pages, queries, days] = await Promise.all([
    query(tok, { ...base }),
    query(tok, { ...base, dimensions: ["page"], rowLimit: 50 }),
    query(tok, { ...base, dimensions: ["query"], rowLimit: 50 }),
    query(tok, { ...base, dimensions: ["date"], rowLimit: 40 }),
  ]);
  const data = {
    startDate: base.startDate, endDate: base.endDate,
    totals: tot[0] ? row(tot[0]) : { clicks: 0, impressions: 0, ctr: 0, position: null },
    pages: pages.map(row), queries: queries.map(row), days: days.map(row),
  };
  dataCache = { at: Date.now(), data };
  return data;
}

module.exports = { searchConsole };
