# My Job Tracker

Tracks SDE1/fresher/intern roles at companies I care about + auto-discovers
any Delhi NCR role I might've missed. Free, runs on GitHub Actions every
20 min, publishes to GitHub Pages.

**Site:** https://<username>.github.io/job-tracker/

## Setup (already done, just for reference)

- Secrets needed: `ADZUNA_APP_ID`, `ADZUNA_APP_KEY` (Settings → Secrets → Actions)
- Workflow permissions: Read and write (Settings → Actions → General)
- Pages source: `/docs` folder on `main`

## Adding a company

Check their careers page URL / Network tab (Fetch/XHR) for:
- `greenhouse.io` → greenhouse
- `api.lever.co` → lever
- `api.ashbyhq.com` → ashby
- `apply.workable.com` → workable
- `api.smartrecruiters.com` → smartrecruiters
- `myworkdayjobs.com` → workday (need site + tenant + board, not just a token)
- plain HTML → custom, needs its own scraper, ask Claude when I hit one

Add to `companies.json`:
```json
{ "name": "X", "ats": "greenhouse", "token": "their-slug" }
```

Or bulk-guess names: add to `candidates` in `src/verify-tokens.js`, run
`node src/verify-tokens.js`, copy the ✅ hits over. Wrong guesses are harmless.

## Tuning filters

- `src/filter.js` → `ROLE_PATTERNS` = title keywords, `NCR_LOCATIONS` /
  `INDIA_LOCATIONS` = location keywords. If a real job's getting missed,
  check its exact location string in `docs/tracked.json` / `docs/ncr.json`
  and add it here.

## Debugging

- Repo → Actions → latest run → `npm run build` step has all logs
  (per-company fetch counts, errors, filtered counts).
- Adzuna `AUTH_FAIL` → re-check the `ADZUNA_APP_KEY` secret, probably a
  copy-paste issue.
- Company returns nothing → test its API URL directly in browser first.
  Remember: some use full legal name as token (Razorpay =
  `razorpaysoftwareprivatelimited`).

## Cost: $0