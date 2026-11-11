// Shared helpers for the analytics endpoints. Files under api/_lib are not exposed as routes.
const crypto = require("crypto");
const { neon } = require("@neondatabase/serverless");

let _sql;
function db() {
  if (!_sql) {
    if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL missing");
    _sql = neon(process.env.DATABASE_URL);
  }
  return _sql;
}

function hmac(key, data) {
  return crypto.createHmac("sha256", key).update(data).digest();
}

function clientIp(req) {
  const xf = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim();
  return xf || String(req.headers["x-real-ip"] || "") || (req.socket && req.socket.remoteAddress) || "";
}

// Daily-rotating visitor id. The date is part of the hashed input, so ids from different days
// can't be linked and the raw IP never leaves this function.
function visitorId(req) {
  const day = new Date().toISOString().slice(0, 10);
  const ua = String(req.headers["user-agent"] || "");
  return hmac(process.env.ANALYTICS_SALT || "unset", `${day}|${clientIp(req)}|${ua}`).toString("hex").slice(0, 16);
}

function ipHash(req) {
  return hmac(process.env.ANALYTICS_SALT || "unset", `login|${clientIp(req)}`).toString("hex").slice(0, 16);
}

function parseCookies(req) {
  const out = {};
  String(req.headers.cookie || "").split(";").forEach((p) => {
    const i = p.indexOf("=");
    if (i > 0) out[p.slice(0, i).trim()] = decodeURIComponent(p.slice(i + 1).trim());
  });
  return out;
}

// ----- admin session: "<expiry>.<hmac>" in an HttpOnly cookie -----
const COOKIE = "aa_admin";
const SESSION_DAYS = 30;

function sessionKey() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  const pw = process.env.ADMIN_PASSWORD;
  if (!secret || !pw) return null;
  // Including the password hash means changing ADMIN_PASSWORD logs every session out.
  return hmac(secret, "session-key|" + crypto.createHash("sha256").update(pw).digest("hex"));
}

function makeSession() {
  const exp = Math.floor(Date.now() / 1000) + SESSION_DAYS * 86400;
  const sig = hmac(sessionKey(), `admin.${exp}`).toString("base64url");
  return `${exp}.${sig}`;
}

function isAdmin(req) {
  const key = sessionKey();
  if (!key) return false;
  const tok = parseCookies(req)[COOKIE];
  if (!tok) return false;
  const [exp, sig] = tok.split(".");
  if (!exp || !sig || !/^\d+$/.test(exp) || Number(exp) < Date.now() / 1000) return false;
  const want = hmac(key, `admin.${exp}`).toString("base64url");
  const a = Buffer.from(sig), b = Buffer.from(want);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function sessionCookie(value, maxAge) {
  return `${COOKIE}=${value}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAge}`;
}

function passwordOk(given) {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw || typeof given !== "string" || !given) return false;
  const a = crypto.createHash("sha256").update(given).digest();
  const b = crypto.createHash("sha256").update(pw).digest();
  return crypto.timingSafeEqual(a, b);
}

async function readRaw(req, limit = 4000) {
  if (typeof req.body === "string") return req.body.slice(0, limit);
  if (Buffer.isBuffer(req.body)) return req.body.toString("utf8").slice(0, limit);
  if (req.body && typeof req.body === "object") return req.body;
  return await new Promise((resolve) => {
    let data = "";
    req.on("data", (c) => { data += c; if (data.length > limit) req.destroy(); });
    req.on("end", () => resolve(data));
    req.on("error", () => resolve(""));
  });
}

module.exports = {
  db, hmac, clientIp, visitorId, ipHash, parseCookies,
  isAdmin, makeSession, sessionCookie, passwordOk, readRaw, SESSION_DAYS,
};
