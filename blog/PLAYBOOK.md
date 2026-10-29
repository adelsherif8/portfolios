# Blog playbook (run by the daily cloud routine)

You write ONE blog post per run for adelatya.com, the site of Adel Atya, who builds AI phone agents (AI receptionists,
missed-call recovery, voice agents on Retell/Vapi) and GoHighLevel / n8n automation for local businesses and agencies.
Readers are business owners (plumbing/HVAC, dental, restaurants, real estate, home services) and marketing agencies.
Goal: a genuinely useful answer to a question a buyer types into Google, that links to the matching service page.

## Steps
1. `git pull`. Read `blog/topics.md`. Take the FIRST line still marked `[ ]`. If it ends with `(target: <phrase> -> <page>)`, the title is the text before it; use the exact target phrase in the title or seo_title, the first paragraph and one H2, set `service:` to that page and link to it twice. Read every existing post in `blog/posts/`
   so you never repeat an angle, a title pattern, or an example.
2. Research (WebSearch/WebFetch, 4–8 calls): current, checkable facts for this topic (2026 prices, rules, platform
   features). Prefer official sources (regulators, vendor docs, government statistics). Note each source URL.
3. Facts about Adel and his offer come ONLY from the site itself (read `pricing/index.html` and the relevant service
   page). Never invent clients, case studies, results, reviews, quotes, or statistics. Adel's own real numbers you may use:
   agent answers in about 1 second; missed-call text-back in 8 s and AI callback in 52 s (Blue Ridge demo); voice agent
   $900 build + $450/month with 500 minutes, then 15¢/min (first three clients $600 build); automation $400/workflow,
   $1,200 system, $200/month care; his test suite: 38 simulated callers, 114 calls per run, about $0.25 a run, and its
   first run caught 5 missed emergency handoffs in 41 plumbing calls on a cheaper model. Demos are live at
   voicedesk-h31g.onrender.com/agent/{recovery,dental,restaurant,realty,receptionist,support,voicemail}.
   Blue Ridge recovery demo build facts (verified in Adel's voicedesk repo): a single-prompt Retell agent on GPT-4.1; it
   must call a `log_outcome` function before hanging up; its GHL-style pipeline moves Missed → Texted → Called → Booked.
   The eval suite agents run on GPT-4o-mini with a GPT-4.1-mini judge; prompt rules and data delimiting cut cross-customer
   leaks from 14 calls to 6, and least-privilege context (only the caller's own record) took them to 0; injection
   resistance went from 57% to 94% (source: /case-studies/voice-agent-security-evals/).
4. Write `blog/posts/YYYY-MM-DD-<slug>.md` (today's date) with the front matter used by the existing posts:
   title (the question or a plain promise; if longer than 60 characters, also add seo_title: a version of 60 or fewer that Google shows in full), description (under 158 characters), date, slug
   (lowercase-hyphens), service (the matching page path), service_label, tags (3 comma-separated), and target (the topic's target phrase, if it has one).
5. Body rules:
   - 900–1,500 words. Open with the direct answer in the first two sentences. No throat-clearing intro.
   - Short paragraphs, `##` section headings that are themselves questions or plain statements, lists where they help.
   - Concrete numbers with their source linked inline the first time they appear. Only use a number from a page you
     opened yourself with WebFetch and saw the number on; a search-result summary is NOT a source. State the study's year
     when it is older than 2025. If a number can't be verified this way, leave it out.
   - Plain, direct English, the way an experienced engineer explains it to a business owner. No hype words
     ("revolutionize", "game-changer", "seamless", "unlock", "leverage"), no em-dash asides, no "in today's fast-paced world".
   - Be honest about when an AI phone agent is NOT worth it, or what it can't do. That honesty is the brand.
   - 3–5 internal links: the service page, /pricing/, one or two related posts, and one live demo link.
   - End with a short practical checklist or next step, not a sales pitch.
5b. **Quality gate (required, see `blog/RUBRIC.md`).** Publish only if the score is above 90 of 100.
   - Run `python3 blog/score.py blog/posts/<your file>.md` (automatic half, 50 points). Fix every line marked FIX that you can.
   - Then launch ONE fresh reviewer with the Agent tool. Give it: the full text of `blog/RUBRIC.md`, the full post, and the
     list of Adel's real facts from step 3. Ask it to score the post strictly using the review table and return the
     required output format. You never score your own post; the reviewer's number is the one that counts.
   - Total = automatic + review. If it is 90 or below, or any review category is 0, apply the reviewer's TOP 3 FIXES and
     the automatic FIX lines, then re-run score.py and a NEW reviewer. Up to 3 rounds.
   - After 3 rounds still at 90 or below: do not publish. Delete the draft, mark the topic `[skip] score NN` in topics.md,
     commit only topics.md, and report the scores.
6. Run `python3 blog/build.py`. It must print the new post count with no errors.
7. Mark the topic `[x]` in `blog/topics.md` with today's date. If fewer than 10 `[ ]` topics remain, append 10 new
   buyer-intent questions in the same style (different verticals and stages of buying, no near-duplicates).
8. Commit only `blog/` and `sitemap.xml`: `git add blog sitemap.xml && git commit -m "Blog: <title>" && git push`.
   Pushing deploys the site automatically.
9. Final message: the title, URL (https://adelatya.com/blog/<slug>/), word count, the sources used, and the final score (automatic + review = total, plus how many rounds it took).

## Hard stops
- Never edit any file outside `blog/` and `sitemap.xml`.
- If research finds nothing reliable for the topic, mark it `[skip]` with a one-line reason and take the next one.
- Never publish a post that repeats an existing post's main point. Pick a different topic instead.
