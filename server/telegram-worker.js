/**
 * Best Metall — Lead → Telegram proxy (Cloudflare Worker)
 *
 * Keeps the bot token secret on the server. The website POSTs the form JSON
 * here; this worker forwards a formatted message to your Telegram chat.
 *
 * SETUP (one time, ~5 minutes):
 *  1. Create a bot: open Telegram, message @BotFather, send /newbot, follow prompts.
 *     Copy the token it gives you (looks like 123456:ABC-DEF...).
 *  2. Get your chat ID: message your new bot once, then open
 *     https://api.telegram.org/bot<TOKEN>/getUpdates and copy "chat":{"id": ... }.
 *     (For a group, add the bot to the group; the id will be negative.)
 *  3. Deploy this file at https://dash.cloudflare.com → Workers & Pages → Create → Worker.
 *     Paste this code, Deploy.
 *  4. In the worker's Settings → Variables, add two SECRET variables:
 *        TELEGRAM_BOT_TOKEN = <token from step 1>
 *        TELEGRAM_CHAT_ID   = <id from step 2>
 *  5. Copy the worker URL (e.g. https://bestmetall-lead.<you>.workers.dev)
 *     and paste it into scripts/app.js  →  const LEAD_ENDPOINT = '...';
 *  6. Set ALLOWED_ORIGIN below to your real domain before going live.
 */

const ALLOWED_ORIGIN = '*'; // e.g. 'https://bestmetall.uz' — tighten before launch

function cors(origin) {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

const esc = (s) =>
  String(s ?? '').replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]));

export default {
  async fetch(request, env) {
    const headers = cors(ALLOWED_ORIGIN);

    if (request.method === 'OPTIONS') return new Response(null, { headers });
    if (request.method !== 'POST') return new Response('Method Not Allowed', { status: 405, headers });

    let data;
    try {
      data = await request.json();
    } catch {
      return new Response(JSON.stringify({ ok: false, error: 'bad json' }), { status: 400, headers });
    }

    // Minimal validation + honeypot
    if (data.company) return new Response(JSON.stringify({ ok: true }), { headers }); // bot trap
    const name = (data.name || '').trim();
    const phone = (data.phone || '').trim();
    if (!name || phone.replace(/\D/g, '').length < 9) {
      return new Response(JSON.stringify({ ok: false, error: 'validation' }), { status: 422, headers });
    }

    const text =
      `🔧 <b>Yangi ariza — Best Metall</b>\n\n` +
      `👤 <b>Ism:</b> ${esc(name)}\n` +
      `📞 <b>Telefon:</b> ${esc(phone)}\n` +
      (data.projectType ? `🏗 <b>Loyiha:</b> ${esc(data.projectType)}\n` : '') +
      (data.message ? `💬 <b>Xabar:</b> ${esc(data.message)}\n` : '') +
      (data.page ? `\n🔗 ${esc(data.page)}` : '');

    const tgRes = await fetch(
      `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: env.TELEGRAM_CHAT_ID,
          text,
          parse_mode: 'HTML',
          disable_web_page_preview: true,
        }),
      }
    );

    if (!tgRes.ok) {
      return new Response(JSON.stringify({ ok: false, error: 'telegram' }), { status: 502, headers });
    }
    return new Response(JSON.stringify({ ok: true }), { headers });
  },
};
