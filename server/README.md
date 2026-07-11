# Lead form → Telegram setup

The contact form posts to a small serverless proxy so the Telegram **bot token
is never exposed** in the public website.

## Quick start (Cloudflare Workers — free, ~5 min)

1. **Create the bot** — in Telegram, message [@BotFather](https://t.me/BotFather),
   send `/newbot`, follow the prompts, and copy the **token**.
2. **Find your chat ID** — send any message to your new bot, then open
   `https://api.telegram.org/bot<TOKEN>/getUpdates` in a browser and copy
   `"chat":{"id": ...}`. (Group chats have a negative id.)
3. **Deploy** — go to <https://dash.cloudflare.com> → *Workers & Pages* →
   *Create* → *Worker*. Replace the sample code with the contents of
   [`telegram-worker.js`](./telegram-worker.js) and click **Deploy**.
4. **Add secrets** — in the worker's *Settings → Variables and Secrets*, add:
   - `TELEGRAM_BOT_TOKEN` = the token from step 1
   - `TELEGRAM_CHAT_ID` = the id from step 2
5. **Wire the site** — copy the worker URL (e.g.
   `https://bestmetall-lead.<you>.workers.dev`) into `scripts/app.js`:
   ```js
   const LEAD_ENDPOINT = 'https://bestmetall-lead.<you>.workers.dev';
   ```
6. **Lock it down** — before launch, set `ALLOWED_ORIGIN` in `telegram-worker.js`
   to your real domain (e.g. `'https://bestmetall.uz'`) and redeploy.

## Demo mode

While `LEAD_ENDPOINT` is empty (`''`), the form runs in **demo mode**: it
validates input and shows the success message but sends nothing. Safe to ship
the rest of the site before the bot is live.

## Spam protection

The worker ignores submissions where a hidden `company` field is filled
(honeypot) and re-validates name + phone server-side.
