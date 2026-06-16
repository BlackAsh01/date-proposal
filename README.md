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

### Vercel (recommended — automatic on push)

Connect this repo to your existing Vercel project (`prj_uwge4jPGSfXK1fFhjyafYSR0aQVH`) once, then every push to `main` deploys automatically.

1. Open [vercel.com/dashboard](https://vercel.com/dashboard) and select your **date-proposal** project
2. Go to **Settings → Git**
3. Click **Connect Git Repository** and choose **`BlackAsh01/date-proposal`**
4. Set **Production Branch** to `main`
5. Push to `main` — Vercel builds and deploys on each push

> **Note:** GitHub Pages only serves static files. Use Vercel for the `/api/notify` email & SMS endpoint.

### Email & SMS notifications

When someone completes the proposal, you get an email and text with their choices (date, food, outfit).

**Notifications are sent to:**
- Email: `ashwinprabhu908@gmail.com`
- Phone: `+91 8939475035`

Add these **Vercel environment variables** (Project → Settings → Environment Variables):

| Variable | Purpose |
|----------|---------|
| `RESEND_API_KEY` | Optional — API key from [resend.com](https://resend.com). If omitted, email uses FormSubmit instead. |
| `RESEND_FROM` | Optional sender for Resend, e.g. `Date Proposal <onboarding@resend.dev>` |
| `TWILIO_ACCOUNT_SID` | From [twilio.com](https://www.twilio.com) console |
| `TWILIO_AUTH_TOKEN` | Twilio auth token |
| `TWILIO_PHONE_NUMBER` | Your Twilio phone number (sender) |
| `NOTIFICATION_EMAIL` | Optional override (defaults to ashwinprabhu908@gmail.com) |
| `NOTIFICATION_PHONE` | Optional override (defaults to +918939475035) |

Redeploy after adding env vars. Email works via FormSubmit by default (confirm the first email from FormSubmit in your inbox). SMS requires Twilio credentials and credits.

### GitHub Pages

Works on GitHub Pages too — enable Pages for this repo and set the source to the `main` branch root.
