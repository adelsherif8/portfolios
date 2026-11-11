// First-party, cookie-free page-view / event beacon for adelatya.com.
// Receives a small JSON body from /assets/p.js. Stores no IP, no cookies, no full user agent.
const { db, visitorId, isAdmin, readRaw } = require("./_lib/common");

const TYPES = new Set([
  "pageview", "cta_click", "booking_click", "email_click", "phone_click",
  "demo_click", "outbound_click", "contact_submit",
]);

const BOT = /bot\b|bot\/|crawl|spider|slurp|facebookexternalhit|facebot|embedly|quora link|whatsapp|telegram|discord|skype|slack|preview|headless|phantom|puppeteer|playwright|selenium|lighthouse|pagespeed|gtmetrix|pingdom|uptime|statuscake|curl|wget|python|httpclient|http-client|axios|node-fetch|undici|go-http|java\/|okhttp|libwww|scrapy|ahrefs|semrush|mj12|dotbot|petalbot|bytespider|yandex|baidu|gptbot|claude|perplexity|ccbot|applebot|duckduck|vercel|screenshot|validator|monitor/i;

function clean(v, max) {
  return String(v == null ? "" : v).replace(/[\u0000-\u001f\u007f]/g, "").trim().slice(0, max);
}

function device(ua) {
  if (/iPad|Tablet|PlayBook|Silk|Kindle|Android(?!.*Mobile)/i.test(ua)) return "tablet";
  if (/Mobi|iPhone|iPod|Android|Windows Phone/i.test(ua)) return "mobile";
  return "desktop";
}

function refHost(r) {
  if (!r) return "";
  try {
    const h = new URL(r).hostname.replace(/^www\./, "").toLowerCase();
    return h === "adelatya.com" ? "" : h.slice(0, 120);
  } catch { return ""; }
}

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") { res.setHeader("Allow", "POST"); return res.status(405).end(); }

  const ua = String(req.headers["user-agent"] || "");
  if (!ua || BOT.test(ua)) { res.setHeader("X-AA", "skip-bot"); return res.status(204).end(); }
  if (isAdmin(req)) { res.setHeader("X-AA", "skip-admin"); return res.status(204).end(); }

  let b = await readRaw(req);
  if (typeof b === "string") { try { b = JSON.parse(b || "{}"); } catch { b = {}; } }
  if (!b || typeof b !== "object") b = {};

  const type = clean(b.t, 40);
  let path = clean(b.p, 200).split("?")[0].split("#")[0];
  if (!TYPES.has(type) || !path.startsWith("/")) { res.setHeader("X-AA", "skip-invalid"); return res.status(204).end(); }

  const country = clean(req.headers["x-vercel-ip-country"], 2).toUpperCase();

  try {
    await db()`
      INSERT INTO events (type, path, label, ref_host, utm_source, utm_medium, utm_campaign, country, device, visitor)
      VALUES (${type}, ${path}, ${clean(b.l, 120)}, ${refHost(clean(b.r, 500))},
              ${clean(b.us, 80).toLowerCase()}, ${clean(b.um, 80).toLowerCase()}, ${clean(b.uc, 120)},
              ${country}, ${device(ua)}, ${visitorId(req)})`;
    res.setHeader("X-AA", "ok");
  } catch (err) {
    console.error("analytics insert failed:", err && err.message);
    res.setHeader("X-AA", "error");
  }
  return res.status(204).end();
};
