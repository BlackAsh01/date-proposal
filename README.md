# Date Proposal 💕

A playful, multi-step interactive date proposal page. The "No" button runs away from your cursor — on purpose.

## Features

- 5-step wizard: the ask → when → food → dress code → confirmation
- Runaway "No" button on hover and touch
- Floating background emojis and confetti celebration
- Fully static — no build step or dependencies

## Run locally

Open `index.html` in your browser, or serve the folder:

```bash
py -m http.server 8765
```

Then visit [http://localhost:8765](http://localhost:8765).

## Project structure

```
date-proposal/
├── index.html      # Main page
├── css/styles.css  # Styles
├── js/app.js       # App logic
└── README.md
```

## Deploy

### Vercel (automatic on push)

This repo deploys to Vercel on every push to `main` via GitHub Actions.

**One-time setup** — add these secrets in GitHub → repo → **Settings → Secrets and variables → Actions**:

| Secret | Where to find it |
|--------|------------------|
| `VERCEL_TOKEN` | [vercel.com/account/tokens](https://vercel.com/account/tokens) → Create Token |
| `VERCEL_ORG_ID` | Vercel → **Team Settings → General → Team ID** (or your personal account ID in account settings) |

The Vercel project ID (`prj_uwge4jPGSfXK1fFhjyafYSR0aQVH`) is already set in `.github/workflows/vercel-deploy.yml`.

After secrets are saved, push to `main` and the site deploys automatically.

**Alternative (no GitHub Actions):** In the [Vercel project settings](https://vercel.com), go to **Git** and connect `BlackAsh01/date-proposal`. Vercel will deploy on every push directly — remove the workflow file if you use this instead.

### GitHub Pages

Works on GitHub Pages too — enable Pages for this repo and set the source to the `main` branch root.
