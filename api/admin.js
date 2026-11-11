// /admin/analytics (rewritten here by vercel.json). Password checked server-side against ADMIN_PASSWORD;
// the session is a signed HttpOnly cookie. Nothing secret is sent to the browser.
const { db, ipHash, isAdmin, makeSession, sessionCookie, passwordOk, readRaw, SESSION_DAYS } = require("./_lib/common");
const { stats } = require("./_lib/stats");
const { searchConsole } = require("./_lib/gsc");
const { loginPage, dashboardPage } = require("./_lib/pages");

const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com",
  "font-src https://fonts.gstatic.com https://cdnjs.cloudflare.com",
  "img-src 'self' data:",
  "connect-src 'self'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "base-uri 'none'",
].join("; ");

function common(res) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Robots-Tag", "noindex, nofollow");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("X-Content-Type-Options", "nosniff");
}

function html(res, status, body) {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Content-Security-Policy", CSP);
  res.setHeader("X-Frame-Options", "DENY");
  return res.status(status).send(body);
}

async function login(req, res) {
  let b = await readRaw(req);
  if (typeof b === "string") b = Object.fromEntries(new URLSearchParams(b));
  const ip = ipHash(req);
  const sql = db();
  const [{ n }] = await sql`SELECT count(*)::int AS n FROM login_failures WHERE ip_hash = ${ip} AND ts > now() - interval '15 minutes'`;
  if (n >= 8) return html(res, 429, loginPage("Too many attempts. Try again in 15 minutes."));
  if (!passwordOk(b && b.password)) {
    await sql`INSERT INTO login_failures (ip_hash) VALUES (${ip})`;
    await sql`DELETE FROM login_failures WHERE ts < now() - interval '1 day'`;
    await new Promise((r) => setTimeout(r, 600));
    return html(res, 401, loginPage("Wrong password."));
  }
  res.setHeader("Set-Cookie", sessionCookie(makeSession(), SESSION_DAYS * 86400));
  res.setHeader("Location", "/admin/analytics/");
  return res.status(303).end();
}

module.exports = async (req, res) => {
  common(res);
  const q = req.query || {};
  try {
    if (req.method === "POST" && q.action === "login") return await login(req, res);
    if (req.method === "POST" && q.action === "logout") {
      res.setHeader("Set-Cookie", sessionCookie("", 0));
      res.setHeader("Location", "/admin/analytics/");
      return res.status(303).end();
    }
    if (req.method !== "GET") { res.setHeader("Allow", "GET, POST"); return res.status(405).end(); }

    const admin = isAdmin(req);
    if (q.view === "data" || q.view === "gsc") {
      if (!admin) return res.status(401).json({ ok: false, error: "Not signed in." });
      if (q.view === "gsc") return res.status(200).json({ ok: true, ...(await searchConsole()) });
      const days = [1, 7, 28, 90].includes(Number(q.days)) ? Number(q.days) : 28;
      return res.status(200).json({ ok: true, ...(await stats(days)) });
    }
    return admin ? html(res, 200, dashboardPage()) : html(res, 401, loginPage(""));
  } catch (err) {
    console.error("admin error:", err && err.message);
    if (q.view) return res.status(500).json({ ok: false, error: String((err && err.message) || err).slice(0, 200) });
    return html(res, 500, loginPage("Server error. Check the Vercel function logs."));
  }
};
