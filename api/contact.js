const nodemailer = require("nodemailer");

const MAX = { name: 120, email: 200, company: 200, need: 80, message: 4000 };
const NEEDS = ["AI voice agent", "GoHighLevel automation", "Agency white-label", "Something else"];

function clean(v, max) {
  return String(v == null ? "" : v).replace(/\r/g, "").trim().slice(0, max);
}

async function readBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  const raw = await new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (c) => { data += c; if (data.length > 20000) req.destroy(); });
    req.on("end", () => resolve(data));
    req.on("error", reject);
  });
  try { return JSON.parse(raw || "{}"); } catch { return {}; }
}

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Use POST." });
  }

  const b = await readBody(req);

  // Bots fill the hidden field and submit instantly. Pretend success so they move on.
  if (b.website || (b.startedAt && Date.now() - Number(b.startedAt) < 3000)) {
    return res.status(200).json({ ok: true });
  }

  const name = clean(b.name, MAX.name);
  const email = clean(b.email, MAX.email);
  const company = clean(b.company, MAX.company);
  const need = NEEDS.includes(b.need) ? b.need : "Something else";
  const message = clean(b.message, MAX.message);

  if (!name || !message) {
    return res.status(400).json({ ok: false, error: "Please add your name and a short message." });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return res.status(400).json({ ok: false, error: "That email address doesn't look right." });
  }

  const page = clean(b.page, 300);
  const text =
    `Name: ${name}\nEmail: ${email}\nCompany / site: ${company || "-"}\nLooking for: ${need}\n` +
    `Page: ${page || "-"}\n\n${message}\n`;

  try {
    const transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
    await transport.sendMail({
      from: `"adelatya.com form" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_TO || process.env.SMTP_USER,
      replyTo: `"${name.replace(/"/g, "")}" <${email}>`,
      subject: `New enquiry: ${need} from ${name}`,
      text,
    });
  } catch (err) {
    console.error("contact mail failed:", err && err.message);
    return res.status(502).json({ ok: false, error: "Sending failed. Please email adel@adelatya.com instead." });
  }

  // Phone notification. A failure here must not fail the request: the email already went.
  if (process.env.NTFY_TOPIC) {
    try {
      await fetch(`https://ntfy.sh/${process.env.NTFY_TOPIC}`, {
        method: "POST",
        headers: { Title: `New lead: ${need}`, Priority: "high", Tags: "incoming_envelope" },
        body: `${name} (${company || email})\n${message.slice(0, 300)}`,
      });
    } catch (err) {
      console.error("ntfy failed:", err && err.message);
    }
  }

  return res.status(200).json({ ok: true });
};
