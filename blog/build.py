"""Build the adelatya.com blog from blog/posts/*.md (stdlib only, so it also runs in CI / cloud routines).

Post file format:
    ---
    title: How much does an AI receptionist cost in 2026?
    description: One sentence for Google and social cards (under 160 characters).
    date: 2026-10-24
    slug: ai-receptionist-cost-2026
    service: /pricing/                 # the page this post supports (linked in the CTA box)
    service_label: See exact pricing
    tags: pricing, ai receptionist
    ---
    Markdown body: ## headings, paragraphs, - lists, 1. lists, **bold**, *italic*, [links](url), > quotes, `code`.

Writes blog/<slug>/index.html, blog/index.html, blog/feed.xml, and refreshes the blog URLs in sitemap.xml.
Usage: python3 blog/build.py
"""
import datetime as dt
import html
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parent.parent
BLOG = ROOT / "blog"
SITE = "https://adelatya.com"
DEMO = "https://voicedesk-h31g.onrender.com/agent/recovery"


def parse(path):
    text = path.read_text()
    m = re.match(r"^---\n(.*?)\n---\n(.*)$", text, re.S)
    meta = {}
    for line in m.group(1).splitlines():
        if ":" in line:
            k, v = line.split(":", 1)
            meta[k.strip()] = v.split("#")[0].strip() if k.strip() in ("service", "slug", "date") else v.strip()
    meta["body"] = m.group(2).strip()
    meta["date_obj"] = dt.date.fromisoformat(meta["date"])
    return meta


def inline(s):
    s = html.escape(s, quote=False)
    s = re.sub(r"`([^`]+)`", r"<code>\1</code>", s)
    s = re.sub(r"\*\*([^*]+)\*\*", r"<strong>\1</strong>", s)
    s = re.sub(r"(?<![*\w])\*([^*]+)\*(?![*\w])", r"<em>\1</em>", s)
    def link(m):
        url = m.group(2)
        ext = url.startswith("http") and "adelatya.com" not in url
        return f'<a href="{url}"' + (' target="_blank" rel="noopener"' if ext else "") + f">{m.group(1)}</a>"
    return re.sub(r"\[([^\]]+)\]\(([^)]+)\)", link, s)


def md(body):
    out, para, lst, kind = [], [], [], None
    def flush():
        nonlocal para, lst, kind
        if para: out.append("<p>" + inline(" ".join(para)) + "</p>"); para = []
        if lst: out.append(f"<{kind}>" + "".join(f"<li>{inline(x)}</li>" for x in lst) + f"</{kind}>"); lst = []; kind = None
    for line in body.splitlines():
        s = line.rstrip()
        if not s.strip(): flush(); continue
        h = re.match(r"^(#{2,3})\s+(.*)", s)
        if h: flush(); lvl = len(h.group(1)); out.append(f"<h{lvl}>{inline(h.group(2))}</h{lvl}>"); continue
        if s.startswith("> "): flush(); out.append(f"<blockquote>{inline(s[2:])}</blockquote>"); continue
        ul = re.match(r"^[-*]\s+(.*)", s); ol = re.match(r"^\d+\.\s+(.*)", s)
        if ul or ol:
            if para: out.append("<p>" + inline(" ".join(para)) + "</p>"); para = []
            k = "ul" if ul else "ol"
            if kind and kind != k: flush()
            kind = k; lst.append((ul or ol).group(1)); continue
        if lst: flush()
        para.append(s.strip())
    flush()
    return "\n".join(out)


HEAD = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>{title}</title>
<meta name="description" content="{desc}" />
<meta name="theme-color" content="#0F0D0B" />
<link rel="icon" type="image/svg+xml" href="{up}favicon.svg" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap" />
<link rel="stylesheet" href="{up}assets/site.css" />
<link rel="canonical" href="{canonical}" />
<link rel="alternate" type="application/rss+xml" title="Adel Atya blog" href="{site}/blog/feed.xml" />
<meta property="og:type" content="{ogtype}" />
<meta property="og:site_name" content="Adel Atya" />
<meta property="og:title" content="{title}" />
<meta property="og:description" content="{desc}" />
<meta property="og:url" content="{canonical}" />
<meta property="og:image" content="{site}/og.png" />
<meta name="twitter:card" content="summary_large_image" />
{schema}
<style>
.bhero{{padding:150px 0 40px;border-bottom:var(--edge)}}
.bhero h1{{font-size:clamp(2.1rem,4.6vw,3.3rem);margin-top:16px;max-width:22ch;text-wrap:balance}}
.bhero .meta{{margin-top:16px;color:var(--ink-2);font-size:.92rem}}
.post{{max-width:68ch;margin:0 auto;padding:44px 0 20px;font-size:1.08rem;line-height:1.7}}
.post h2{{font-size:1.75rem;margin:42px 0 12px;line-height:1.15}}
.post h3{{font-size:1.25rem;margin:28px 0 8px}}
.post p,.post ul,.post ol,.post blockquote{{margin:0 0 18px}}
.post ul,.post ol{{padding-left:1.2em}}
.post li{{margin-bottom:6px}}
.post blockquote{{border-left:3px solid var(--red);padding:4px 0 4px 16px;color:var(--ink-2);font-style:italic}}
.post code{{font-size:.9em;background:rgba(0,0,0,.05);padding:1px 5px;border-radius:5px}}
.post a{{color:var(--red);text-decoration:underline;text-underline-offset:3px}}
.cta-box{{max-width:68ch;margin:10px auto 60px;border:var(--edge);border-radius:var(--r);box-shadow:var(--hard);padding:26px;background:var(--paper)}}
.cta-box h3{{font-size:1.3rem;margin-bottom:8px}}
.cta-box .acts{{display:flex;flex-wrap:wrap;gap:12px;margin-top:16px}}
.plist{{display:grid;gap:14px;padding:36px 0 70px;max-width:760px}}
.pitem{{display:block;border:var(--edge);border-radius:var(--r);background:var(--paper);box-shadow:var(--hard);padding:22px 24px;color:inherit;text-decoration:none}}
.pitem h2{{font-size:1.35rem;margin:6px 0 8px}}
.pitem p{{color:var(--ink-2);font-size:.96rem}}
.pitem .d{{font-size:.78rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--red)}}
</style>
</head>
<body>
<div class="top"><div class="wrap top-in">
  <a class="brand" href="{up}"><img src="{up}favicon.svg" alt="" width="23" height="23" />Adel Atya</a>
  <nav class="menu">
    <a href="{up}#agents">Agents</a>
    <a href="{up}pricing/">Pricing</a>
    <a href="{up}white-label-ai-voice-agent/">For agencies</a>
    <a href="{up}blog/">Blog</a>
  </nav>
  <a class="go" href="{demo}" target="_blank" rel="noopener">Talk to the demo</a>
</div></div>
"""

FOOT = """
<footer>
  <div class="wrap">
    <div class="f-more">
      <span class="label">More</span>
      <a href="{up}">Home</a>
      <a href="{up}pricing/">Pricing</a>
      <a href="{up}plumbing/">Plumbing &amp; HVAC</a>
      <a href="{up}dental/">Dental</a>
      <a href="{up}restaurants/">Restaurants</a>
      <a href="{up}real-estate/">Real estate</a>
      <a href="{up}white-label-ai-voice-agent/">For agencies</a>
      <a href="{up}blog/">Blog</a>
    </div>
    <div class="f-end">
      <span>&copy; {year} Adel Atya · Cairo, Egypt</span>
      <span class="r"><a href="https://www.linkedin.com/in/adel-atya-551467309" target="_blank" rel="noopener">LinkedIn</a></span>
    </div>
  </div>
</footer>
</body>
</html>
"""


def page(meta, posts):
    url = f"{SITE}/blog/{meta['slug']}/"
    schema = ('<script type="application/ld+json">' + __import__("json").dumps({
        "@context": "https://schema.org", "@type": "BlogPosting", "headline": meta["title"], "description": meta["description"],
        "datePublished": meta["date"], "dateModified": meta.get("updated", meta["date"]), "mainEntityOfPage": url,
        "author": {"@type": "Person", "name": "Adel Atya", "url": SITE},
        "publisher": {"@type": "Organization", "name": "Adel Atya", "url": SITE, "logo": {"@type": "ImageObject", "url": f"{SITE}/favicon.svg"}},
        "image": f"{SITE}/og.png", "keywords": meta.get("tags", "")}) + "</script>")
    up = "../../"
    others = [p for p in posts if p["slug"] != meta["slug"]][:3]
    more = "".join(f'<li><a href="{up}blog/{p["slug"]}/">{html.escape(p["title"])}</a></li>' for p in others)
    body = (f'<header class="bhero"><div class="wrap"><span class="label">Blog · {html.escape(meta.get("tags","").split(",")[0].strip().title())}</span>'
            f'<h1>{html.escape(meta["title"])}</h1><p class="meta">Adel Atya · {meta["date_obj"].strftime("%d %B %Y")}</p></div></header>'
            f'<main class="wrap"><article class="post">{md(meta["body"])}</article>'
            f'<aside class="cta-box"><h3>Hear an AI phone agent handle a real call</h3><p>Every agent we build answers on the first ring, books the job and texts back the calls it misses. Try one now, or see what it costs.</p>'
            f'<div class="acts"><a class="btn btn-solid" href="{DEMO}" target="_blank" rel="noopener">Talk to the demo</a>'
            f'<a class="btn btn-line" href="{up}{meta.get("service","pricing/").lstrip("/")}">{html.escape(meta.get("service_label","See pricing"))}</a></div>'
            + (f'<h3 style="margin-top:22px;font-size:1.05rem">More from the blog</h3><ul style="margin-top:8px;padding-left:1.1em">{more}</ul>' if more else "")
            + '</aside></main>')
    return (HEAD.format(title=html.escape(meta["title"]) + " | Adel Atya", desc=html.escape(meta["description"]), up=up, canonical=url,
                        site=SITE, ogtype="article", schema=schema, demo=DEMO)
            + body + FOOT.format(up=up, year=dt.date.today().year))


def index(posts):
    up = "../"
    items = "".join(f'<a class="pitem" href="{p["slug"]}/"><span class="d">{p["date_obj"].strftime("%d %b %Y")}</span>'
                    f'<h2>{html.escape(p["title"])}</h2><p>{html.escape(p["description"])}</p></a>' for p in posts)
    body = ('<header class="bhero"><div class="wrap"><span class="label">Blog</span><h1>Notes on AI phone agents that answer, book and follow up</h1>'
            '<p class="meta">What these agents cost, how they fail, and how we test them before they take real calls.</p></div></header>'
            f'<main class="wrap"><div class="plist">{items}</div></main>')
    return (HEAD.format(title="Blog: AI phone agents for local businesses | Adel Atya",
                        desc="Practical notes on AI receptionists and voice agents for plumbers, dental practices, restaurants and agencies: costs, setup, testing and results.",
                        up=up, canonical=f"{SITE}/blog/", site=SITE, ogtype="website", schema="", demo=DEMO)
            + body + FOOT.format(up=up, year=dt.date.today().year))


def feed(posts):
    items = "".join(f"<item><title>{html.escape(p['title'])}</title><link>{SITE}/blog/{p['slug']}/</link><guid>{SITE}/blog/{p['slug']}/</guid>"
                    f"<pubDate>{p['date_obj'].strftime('%a, %d %b %Y 08:00:00 +0000')}</pubDate><description>{html.escape(p['description'])}</description></item>"
                    for p in posts[:20])
    return (f'<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Adel Atya blog</title><link>{SITE}/blog/</link>'
            f"<description>AI phone agents for local businesses and agencies</description>{items}</channel></rss>")


def sitemap(posts):
    sm = ROOT / "sitemap.xml"
    s = sm.read_text()
    s = re.sub(r"\s*<url><loc>https://adelatya.com/blog/[^<]*</loc>.*?</url>", "", s)
    add = f'\n  <url><loc>{SITE}/blog/</loc><lastmod>{posts[0]["date"] if posts else dt.date.today()}</lastmod><priority>0.7</priority></url>'
    add += "".join(f'\n  <url><loc>{SITE}/blog/{p["slug"]}/</loc><lastmod>{p.get("updated", p["date"])}</lastmod><priority>0.6</priority></url>' for p in posts)
    sm.write_text(s.replace("\n</urlset>", add + "\n</urlset>"))


def main():
    today = dt.date.today()
    posts = sorted((parse(p) for p in (BLOG / "posts").glob("*.md")), key=lambda p: p["date_obj"], reverse=True)
    posts = [p for p in posts if p["date_obj"] <= today]          # future-dated posts wait for their day
    for p in posts:
        d = BLOG / p["slug"]; d.mkdir(exist_ok=True)
        (d / "index.html").write_text(page(p, posts))
    (BLOG / "index.html").write_text(index(posts))
    (BLOG / "feed.xml").write_text(feed(posts))
    sitemap(posts)
    print(f"blog: {len(posts)} post(s) built")


if __name__ == "__main__":
    main()
