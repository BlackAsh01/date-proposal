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

When someone completes the proposal on [your live site](https://date-proposal-eta.vercel.app/), you get an email and text with their choices.

**Notifications are sent to:**
- Email: `ashwinprabhu908@gmail.com`
- Phone: `+91 8939475035`

#### Email (works after one-time activation)

Email is sent from the visitor's browser via [FormSubmit](https://formsubmit.co). The **first time** someone completes the proposal, FormSubmit sends you an **activation email** — open it and click **Activate Form** (check spam too). After that, every completion sends the details to your inbox.

#### SMS (requires a free API key)

SMS does not work automatically. Add **one** of these in **Vercel → Project → Settings → Environment Variables**, then redeploy:

| Variable | How to get it |
|----------|----------------|
| `FAST2SMS_API_KEY` | Sign up at [fast2sms.com](https://www.fast2sms.com) (₹50 free credit) → Dashboard → API Key |
| `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER` | [twilio.com](https://www.twilio.com) (international) |

Optional overrides: `NOTIFICATION_EMAIL`, `NOTIFICATION_PHONE`, `RESEND_API_KEY` (server-side email backup).

### GitHub Pages

Works on GitHub Pages too — enable Pages for this repo and set the source to the `main` branch root.
