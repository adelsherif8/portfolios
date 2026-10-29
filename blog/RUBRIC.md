# Blog quality rubric (100 points, publish only above 90)

Two halves:
- **Automatic, 50 points:** `python3 blog/score.py <post>`. Measurable rules: search title and description length,
  target phrase placement, answer up front, length, readability grade, sentence and paragraph length, headings, lists,
  outside sources, internal links, hype words, passive voice, em dashes, closing checklist.
- **Independent review, 50 points:** a reviewer that did NOT write the post scores it with the table below.
  In the routine this is a fresh subagent (Agent tool) given only this file, the post, and `blog/PLAYBOOK.md`'s
  list of Adel's real facts. The writer never scores its own post.

**Gate:** automatic + review **> 90**, and no review category at 0. Otherwise revise and score again (up to 3 rounds).
After 3 rounds still at 90 or below: do not publish; mark the topic `[skip] score NN` in topics.md.

## Where the rules come from
- Google, *Creating helpful, reliable, people-first content* (developers.google.com/search/docs/fundamentals/creating-helpful-content):
  original information or analysis, substantial and complete answers, clear sourcing and evidence of expertise,
  first-hand experience (E-E-A-T, trust weighted highest), a reader who leaves having learned enough to reach their goal.
- Google *Search Quality Rater Guidelines*: main-content quality and effort, first-hand experience; low-quality signs are
  generic text that could fit any business, templated or mass-produced pages, paraphrase of a single source.
- Google spam policies, *scaled content abuse* (March 2024): many pages made mainly to rank, with little original value,
  however they are produced. Every post must add something a reader can't get from the current top results.
- Nielsen Norman Group, *How Users Read on the Web* (Nielsen, 1997) and later eye-tracking (F-pattern): 79% of test users
  scanned; concise, scannable, objective writing measured 124% more usable. Inverted pyramid, meaningful headings,
  one idea per paragraph, lists.
- William Zinsser, *On Writing Well*: clarity, brevity, strip clutter, plain words, the writer's own voice.
- Ann Handley, *Everybody Writes*: write for the reader with empathy, useful over clever, strong headline, edit hard.
- Chip and Dan Heath, *Made to Stick*: simple, unexpected, concrete, credible, emotional, stories. Concrete beats abstract.
- George Orwell, *Politics and the English Language*: never use a long word where a short one will do; cut words; active voice.

## Review table (score each category; total 50)

| # | Category | Max | Full marks when | Typical deductions |
|---|---|---|---|---|
| 1 | **Answers the search** | 10 | A buyer who typed the target question gets a direct, complete answer in the first two sentences, then the detail they'd need to act. | Answer buried; drifts off the question; skips the obvious follow-up question (cost, time, risk). |
| 2 | **Original value and first-hand experience** | 10 | Contains something the current top results don't: Adel's own tested numbers, demo behaviour, build details, a clear opinion from doing the work. | Could have been written by anyone from the top 5 results; generic advice; no first-hand detail. |
| 3 | **Accuracy and trust** | 10 | Every outside number links to the page it came from; facts about Adel match the playbook list exactly; says plainly when an AI agent is NOT the right choice. | Unsourced number (−3 each); a claim about Adel not in the facts list (category = 0, post can't publish); one-sided selling. |
| 4 | **Clarity and concision** (Zinsser, Orwell) | 8 | Every sentence earns its place; plain words; a business owner reads it once and understands. | Filler, repetition, jargon left unexplained, sentences that say nothing. |
| 5 | **Concrete and specific** (Made to Stick) | 6 | Real examples, numbers, a short scene or call; abstract claims are shown, not asserted. | "Improves efficiency", "saves time" with nothing behind it. |
| 6 | **Structure and scannability** (NN/g) | 3 | Inverted pyramid; headings that tell the reader what's in each section; a skimmer gets the point from headings and lists alone. | Clever or vague headings; wall-of-text sections. |
| 7 | **Reader first, not salesy** (Handley) | 3 | Helps even a reader who never buys; one soft next step at the end. | Pitches mid-article; more than one call to action; talks about "we" more than the reader. |

## Reviewer output format (required)

```
REVIEW SCORE: NN/50
1 Answers the search: n/10 - one-line reason
2 Original value: n/10 - ...
3 Accuracy and trust: n/10 - ... (list every unsourced or unverifiable claim)
4 Clarity: n/8 - ...
5 Concrete: n/6 - ...
6 Structure: n/3 - ...
7 Reader first: n/3 - ...
TOP 3 FIXES: specific edits that would raise the score most
```

Be strict. A typical competent blog post scores 30-38 here. 45+ means it would stand out on page one.
