// One-off: create the analytics tables. Not a serverless function (files in api/_lib are not routed).
// Usage: DATABASE_URL=... node api/_lib/migrate.js
const fs = require("fs");
const path = require("path");
const { neon } = require("@neondatabase/serverless");

(async () => {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set");
  const sql = neon(process.env.DATABASE_URL);
  const text = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8").replace(/--.*$/gm, "");
  for (const stmt of text.split(";").map((s) => s.trim()).filter(Boolean)) {
    await sql.query(stmt);
  }
  console.log("schema applied");
})().catch((e) => { console.error(e.message); process.exit(1); });
