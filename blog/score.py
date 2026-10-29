"""Automatic half of the blog quality score (50 of 100 points). The other 50 come from an independent
reviewer using blog/RUBRIC.md. A post publishes only when both halves add up to more than 90.

Usage: python3 blog/score.py blog/posts/2026-10-29-some-post.md   (or several files, or no args = all posts)
Prints each check with its points and the fixes needed; exits 1 if the automatic half is under 45 of 50.
"""
import re, sys, pathlib

OWN = ("adelatya.com", "voicedesk-h31g.onrender.com")
BANNED = ["revolutionize", "game-changer", "game changer", "seamless", "unlock", "leverage", "in today's",
          "fast-paced", "delve", "dive into", "deep dive", "cutting-edge", "cutting edge", "harness the power",
          "elevate", "supercharge", "robust", "landscape", "navigate the", "it's worth noting", "in conclusion",
          "at the end of the day", "look no further", "whether you're", "transformative", "empower", "synergy",
          "best-in-class", "world-class", "next level", "in the realm of", "tapestry", "testament to"]

def parse(path):
    text = pathlib.Path(path).read_text()
    m = re.match(r"^---\n(.*?)\n---\n(.*)$", text, re.S)
    meta = dict(re.findall(r"^(\w+):\s*(.*)$", m.group(1), re.M)) if m else {}
    return meta, (m.group(2) if m else text)

def syllables(word):
    w = re.sub(r"[^a-z]", "", word.lower())
    if not w: return 0
    groups = re.findall(r"[aeiouy]+", w)
    n = len(groups) - (1 if w.endswith("e") and not w.endswith(("le", "ee")) and len(groups) > 1 else 0)
    return max(1, n)

def prose(body):
    """Body text without code blocks, headings, link URLs and markdown symbols."""
    b = re.sub(r"```.*?```", " ", body, flags=re.S)
    b = re.sub(r"^#+ .*$", " ", b, flags=re.M)
    b = re.sub(r"\[([^\]]*)\]\([^)]*\)", r"\1", b)
    return re.sub(r"[*_`>|]", " ", b)

def sentences(text):
    flat = re.sub(r"\s+", " ", text)
    flat = re.sub(r"\b(e\.g|i\.e|etc|vs|Dr|Mr|Ms|St|approx|U\.S)\.", lambda m: m.group(0).replace(".", ""), flat)
    return [s for s in re.split(r"(?<=[.!?])\s+(?=[A-Z0-9\"'(])", flat) if len(s.split()) >= 3]

def score(path):
    meta, body = parse(path)
    checks = []   # (name, got, max, fix)
    def add(name, ok_pts, mx, fix=""): checks.append((name, round(max(0, min(mx, ok_pts)), 1), mx, fix if ok_pts < mx else ""))

    title = meta.get("seo_title") or meta.get("title", "")
    add("Search title 60 characters or fewer", 3 if 0 < len(title) <= 60 else 0, 3, f"title shown in Google is {len(title)} chars; add/shorten seo_title")
    d = len(meta.get("description", ""))
    add("Description 120-158 characters", 3 if 120 <= d <= 158 else (1.5 if 90 <= d < 120 else 0), 3, f"description is {d} chars")

    paras = [p.strip() for p in re.split(r"\n\s*\n", body) if p.strip() and not p.strip().startswith(("#", "-", "*", "|", "```", ">")) and not re.match(r"^\d+\.", p.strip())]
    first = prose(paras[0]) if paras else ""
    h2s = re.findall(r"^## (.+)$", body, re.M)
    target = (meta.get("target") or "").lower().strip()
    if target:
        words = [w for w in re.findall(r"[a-z0-9]+", target) if w not in {"a", "an", "the", "for", "to", "of", "in", "with"}]
        has = lambda t: all(re.search(rf"\b{re.escape(w)}", t.lower()) for w in words)
        pts = 2 * has(title + " " + meta.get("title", "")) + 2 * has(first) + 2 * any(has(h) for h in h2s)
        add(f"Target phrase '{target}' in title, first paragraph and an H2", pts, 6, "put the exact target phrase in the missing place(s)")
    else:
        add("Target phrase (none set, full points)", 6, 6)

    fw = len(first.split())
    add("Direct answer up front (first paragraph 60 words or fewer)", 3 if 0 < fw <= 60 else (1.5 if fw <= 85 else 0), 3, f"first paragraph is {fw} words; open with the answer in 1-2 sentences")

    text = prose(body); words = text.split(); wc = len(words)
    add("Length 900-1,800 words", 4 if 900 <= wc <= 1800 else (2 if 700 <= wc < 900 or 1800 < wc <= 2200 else 0), 4, f"{wc} words")

    sents = sentences(text) or ["x"]
    syl = sum(syllables(w) for w in words)
    grade = 0.39 * (wc / len(sents)) + 11.8 * (syl / max(1, wc)) - 15.59
    add("Readability: grade 9 or lower (Flesch-Kincaid)", 5 if grade <= 9 else (3 if grade <= 10.5 else (1 if grade <= 12 else 0)), 5, f"grade {grade:.1f}; shorter sentences, plainer words")
    lens = [len(s.split()) for s in sents]; avg = sum(lens) / len(lens); long_share = sum(l > 30 for l in lens) / len(lens)
    add("Sentences: average 20 words or fewer, under 10% over 30", (2 if avg <= 20 else 0) + (2 if long_share < 0.10 else 0), 4, f"average {avg:.1f} words, {long_share:.0%} over 30")

    fat = [p for p in paras if len(prose(p).split()) > 90 or len(sentences(prose(p))) > 4]
    add("Paragraphs: 4 sentences / 90 words or fewer", 3 if not fat else (1.5 if len(fat) <= 2 else 0), 3, f"{len(fat)} long paragraph(s), e.g. '{prose(fat[0])[:60]}...'" if fat else "")

    sections = re.split(r"^## .+$", body, flags=re.M)
    gaps = max((len(prose(s).split()) for s in sections), default=0)
    add("Headings: 4+ H2s, no section over 350 words", (2 if len(h2s) >= 4 else 0) + (2 if gaps <= 350 else 0), 4, f"{len(h2s)} H2s, longest section {gaps} words")
    lists = len(re.findall(r"^(\s*[-*] |\s*\d+\. )", body, re.M))
    add("At least one list", 2 if lists >= 2 else 0, 2, "add a bulleted or numbered list where it helps scanning")

    links = re.findall(r"\]\(([^)]+)\)", body)
    ext = {re.sub(r"^https?://(www\.)?", "", u).split("/")[0] for u in links if u.startswith("http") and not any(o in u for o in OWN)}
    add("Sources: 3+ distinct outside sites linked", 5 if len(ext) >= 3 else len(ext) * 1.5, 5, f"{len(ext)} outside source site(s)")
    internal = [u for u in links if u.startswith("/") or "adelatya.com" in u]
    svc = meta.get("service", "")
    ipts = (2 if 3 <= len(internal) <= 7 else 1 if internal else 0) + (1 if svc and any(svc.strip("/") in u for u in internal) else 0) + (1 if any("/pricing" in u for u in internal) else 0)
    add("Internal links: 3-7 incl. service page and /pricing/", ipts, 4, f"{len(internal)} internal links; service page linked: {bool(svc and any(svc.strip('/') in u for u in internal))}")

    low = body.lower(); hits = [b for b in BANNED if b in low]
    add("No hype words or AI cliches", 4 - len(hits), 4, f"remove: {', '.join(hits)}")
    passive = sum(bool(re.search(r"\b(is|are|was|were|be|been|being)\s+\w+(ed|en)\b", s)) for s in sents) / len(sents)
    add("Active voice (passive in 15% of sentences or fewer)", 1 if passive <= 0.15 else 0, 1, f"passive in {passive:.0%} of sentences")
    add("No em dashes", 1 if "—" not in body else 0, 1, "replace em dashes with commas, colons or full stops")
    last = sections[-1] if sections else ""
    add("Ends with a checklist or next step", 2 if (re.search(r"^(\s*[-*] |\s*\d+\. )", last, re.M) or re.search(r"checklist|next step", (h2s[-1] if h2s else "").lower())) else 0, 2, "finish with a short checklist or concrete next step")

    total = sum(c[1] for c in checks); mx = sum(c[2] for c in checks)
    return round(total / mx * 50, 1), checks

def main():
    files = sys.argv[1:] or sorted(str(p) for p in pathlib.Path(__file__).parent.joinpath("posts").glob("*.md"))
    worst = 50
    for f in files:
        pts, checks = score(f); worst = min(worst, pts)
        print(f"\n{pathlib.Path(f).name}: AUTOMATIC SCORE {pts}/50")
        for name, got, mx, fix in checks:
            print(f"  {'OK ' if got == mx else 'FIX'} {got:>4}/{mx:<2} {name}" + (f"  -> {fix}" if fix else ""))
    sys.exit(0 if worst >= 45 else 1)

if __name__ == "__main__": main()
