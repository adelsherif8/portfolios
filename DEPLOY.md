# Adel Atya — Portfolio (3 profiles)

Static site, no build step. One Vercel project serves all three profiles:

- `/`                 → landing hub
- `/ai-engineer`      → AI Engineer profile
- `/software-engineer`→ Software Engineer profile
- `/shopify-expert`   → Shopify Expert profile

The profile switcher uses relative links, so deploy the WHOLE folder as ONE project.

## Deploy (recommended — CLI)
```bash
cd "/Users/adel/Desktop/portfolios"
npx vercel          # first run: log in + accept defaults
npx vercel --prod   # promote to your live URL
```
Framework preset = "Other" (static). No build command, output = the folder itself.

## Deploy (GitHub → Vercel, auto-deploys on push)
```bash
cd "/Users/adel/Desktop/portfolios"
gh repo create adel-portfolio --public --source=. --push
```
Then on vercel.com → Add New → Project → import `adel-portfolio`.

## Want 3 SEPARATE Vercel projects instead?
Deploy each subfolder on its own, then update the switcher links in each
`index.html` (the `../ai-engineer/` etc.) to the real deployed URLs.
