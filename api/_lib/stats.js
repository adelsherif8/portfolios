// Aggregations for /admin/analytics. Days are bucketed in Cairo time (Adel's timezone).
const { db } = require("./common");

const TZ = "Africa/Cairo";
// Events that count as a conversion: a sent contact form, a booking-link click, an email click.
const CONVERSIONS = ["contact_submit", "booking_click", "email_click", "phone_click"];

async function stats(days) {
  const sql = db();
  const [{ since }] = await sql`
    SELECT ((date_trunc('day', now() AT TIME ZONE ${TZ}) - make_interval(days => ${days - 1})) AT TIME ZONE ${TZ}) AS since`;
  const [{ today }] = await sql`SELECT (date_trunc('day', now() AT TIME ZONE ${TZ}) AT TIME ZONE ${TZ}) AS today`;
  const bucket = days === 1 ? "hour" : "day";

  const [
    windows, series, pages, posts, refs, utms, countries, devices, entries,
    events, eventLabels, conv, rtTotals, rtRecent, rtPages,
  ] = await Promise.all([
    sql`
      SELECT w.name,
             count(*) FILTER (WHERE e.type = 'pageview') AS pageviews,
             count(DISTINCT e.visitor) FILTER (WHERE e.type = 'pageview') AS visitors,
             count(*) FILTER (WHERE e.type = ANY(${CONVERSIONS})) AS conversions,
             count(DISTINCT e.visitor) FILTER (WHERE e.type = ANY(${CONVERSIONS})) AS converters
      FROM (VALUES ('today', ${today}::timestamptz),
                   ('7d',  ${today}::timestamptz - interval '6 days'),
                   ('28d', ${today}::timestamptz - interval '27 days')) AS w(name, start)
      LEFT JOIN events e ON e.ts >= w.start
      GROUP BY w.name`,
    sql`
      SELECT to_char(date_trunc(${bucket}, ts AT TIME ZONE ${TZ}), 'YYYY-MM-DD"T"HH24:MI') AS t,
             count(*) AS pageviews, count(DISTINCT visitor) AS visitors
      FROM events WHERE type = 'pageview' AND ts >= ${since}
      GROUP BY 1 ORDER BY 1`,
    sql`
      SELECT path AS key, count(*) AS pageviews, count(DISTINCT visitor) AS visitors
      FROM events WHERE type = 'pageview' AND ts >= ${since}
      GROUP BY path ORDER BY pageviews DESC LIMIT 25`,
    sql`
      SELECT path AS key, count(*) AS pageviews, count(DISTINCT visitor) AS visitors
      FROM events WHERE type = 'pageview' AND ts >= ${since} AND path LIKE '/blog/_%'
      GROUP BY path ORDER BY pageviews DESC LIMIT 25`,
    sql`
      SELECT CASE WHEN ref_host = '' THEN '(direct / none)' ELSE ref_host END AS key,
             count(DISTINCT visitor) AS visitors, count(*) AS pageviews
      FROM events WHERE type = 'pageview' AND ts >= ${since}
      GROUP BY 1 ORDER BY visitors DESC LIMIT 20`,
    sql`
      SELECT utm_source AS source, utm_medium AS medium, utm_campaign AS campaign,
             count(DISTINCT visitor) AS visitors, count(*) AS pageviews
      FROM events WHERE type = 'pageview' AND ts >= ${since} AND utm_source <> ''
      GROUP BY 1, 2, 3 ORDER BY visitors DESC LIMIT 20`,
    sql`
      SELECT CASE WHEN country = '' THEN '??' ELSE country END AS key, count(DISTINCT visitor) AS visitors
      FROM events WHERE type = 'pageview' AND ts >= ${since}
      GROUP BY 1 ORDER BY visitors DESC LIMIT 20`,
    sql`
      SELECT device AS key, count(DISTINCT visitor) AS visitors
      FROM events WHERE type = 'pageview' AND ts >= ${since}
      GROUP BY 1 ORDER BY visitors DESC`,
    sql`
      SELECT path AS key, count(*) AS visitors FROM (
        SELECT DISTINCT ON (visitor) visitor, path FROM events
        WHERE type = 'pageview' AND ts >= ${since} ORDER BY visitor, ts
      ) f GROUP BY path ORDER BY visitors DESC LIMIT 15`,
    sql`
      SELECT type AS key, count(*) AS events, count(DISTINCT visitor) AS visitors
      FROM events WHERE type <> 'pageview' AND ts >= ${since}
      GROUP BY type ORDER BY events DESC`,
    sql`
      SELECT type, label, path, count(*) AS events FROM events
      WHERE type <> 'pageview' AND ts >= ${since}
      GROUP BY type, label, path ORDER BY events DESC LIMIT 30`,
    sql`
      SELECT count(DISTINCT visitor) FILTER (WHERE type = 'pageview') AS visitors,
             count(DISTINCT visitor) FILTER (WHERE type = ANY(${CONVERSIONS})) AS converters,
             count(*) FILTER (WHERE type = 'contact_submit') AS contacts
      FROM events WHERE ts >= ${since}`,
    sql`
      SELECT count(DISTINCT visitor) AS visitors, count(*) FILTER (WHERE type = 'pageview') AS pageviews
      FROM events WHERE ts >= now() - interval '30 minutes'`,
    sql`
      SELECT ts, type, path, label, ref_host, country, device FROM events
      WHERE ts >= now() - interval '30 minutes' ORDER BY ts DESC LIMIT 30`,
    sql`
      SELECT path AS key, count(DISTINCT visitor) AS visitors FROM events
      WHERE type = 'pageview' AND ts >= now() - interval '30 minutes'
      GROUP BY path ORDER BY visitors DESC LIMIT 10`,
  ]);

  const n = (v) => Number(v || 0);
  const win = {};
  windows.forEach((w) => { win[w.name] = { pageviews: n(w.pageviews), visitors: n(w.visitors), conversions: n(w.conversions), converters: n(w.converters) }; });

  return {
    days, bucket, since, generatedAt: new Date().toISOString(),
    windows: win,
    series: series.map((r) => ({ t: r.t, pageviews: n(r.pageviews), visitors: n(r.visitors) })),
    pages, posts, refs, utms, countries, devices, entries, events, eventLabels,
    conversion: { visitors: n(conv[0].visitors), converters: n(conv[0].converters), contacts: n(conv[0].contacts) },
    realtime: { visitors: n(rtTotals[0].visitors), pageviews: n(rtTotals[0].pageviews), recent: rtRecent, pages: rtPages },
  };
}

module.exports = { stats, CONVERSIONS };
