const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL || 'ashwinprabhu908@gmail.com';
const NOTIFICATION_PHONE = process.env.NOTIFICATION_PHONE || '+918939475035';

function buildMessage({ date, food, dress }) {
  const lines = [
    'Someone said YES to your date proposal! 💕',
    '',
    `📅 When: ${date || '—'}`,
    `🍽️ Food: ${food || '—'}`,
    `👗 Outfit: ${dress || '—'}`,
    '',
    `Completed at: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`,
  ];
  return lines.join('\n');
}

function buildHtml({ date, food, dress }) {
  return `
    <div style="font-family:Segoe UI,sans-serif;max-width:480px;margin:0 auto;padding:24px;">
      <h2 style="color:#D4537E;">Someone said YES! 💕</h2>
      <p>Your date proposal was accepted. Here are the details:</p>
      <table style="width:100%;border-collapse:collapse;margin:16px 0;">
        <tr><td style="padding:8px 0;color:#9b6fa0;">📅 When</td><td style="padding:8px 0;font-weight:600;">${date || '—'}</td></tr>
        <tr><td style="padding:8px 0;color:#9b6fa0;">🍽️ Food</td><td style="padding:8px 0;font-weight:600;">${food || '—'}</td></tr>
        <tr><td style="padding:8px 0;color:#9b6fa0;">👗 Outfit</td><td style="padding:8px 0;font-weight:600;">${dress || '—'}</td></tr>
      </table>
      <p style="color:#9b6fa0;font-size:13px;">Sent from your date proposal page</p>
    </div>
  `;
}

async function sendEmailResend(details) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { ok: false, error: 'RESEND_API_KEY not configured' };
  }

  const from = process.env.RESEND_FROM || 'Date Proposal <onboarding@resend.dev>';
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [NOTIFICATION_EMAIL],
      subject: 'Someone said YES to your date! 💕',
      text: buildMessage(details),
      html: buildHtml(details),
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    return { ok: false, error: `Resend error: ${body}` };
  }

  return { ok: true };
}

async function sendEmailFormSubmit(details) {
  const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(NOTIFICATION_EMAIL)}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      _subject: 'Someone said YES to your date! 💕',
      _template: 'table',
      When: details.date,
      Food: details.food,
      Outfit: details.dress,
      Completed: new Date().toLocaleString(),
    }),
  });

  if (!response.ok) {
    return { ok: false, error: 'FormSubmit error' };
  }

  return { ok: true };
}

async function sendEmail(details) {
  const resend = await sendEmailResend(details);
  if (resend.ok) return resend;
  return sendEmailFormSubmit(details);
}

async function sendSms(details) {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_PHONE_NUMBER;

  if (!sid || !token || !from) {
    return { ok: false, error: 'Twilio credentials not configured' };
  }

  const auth = Buffer.from(`${sid}:${token}`).toString('base64');
  const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      To: NOTIFICATION_PHONE,
      From: from,
      Body: buildMessage(details),
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    return { ok: false, error: `Twilio error: ${body}` };
  }

  return { ok: true };
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { date, food, dress } = req.body || {};
    const details = {
      date: String(date || '').slice(0, 200),
      food: String(food || '').slice(0, 200),
      dress: String(dress || '').slice(0, 200),
    };

    const [email, sms] = await Promise.all([
      sendEmail(details),
      sendSms(details),
    ]);

    const success = email.ok || sms.ok;

    return res.status(success ? 200 : 500).json({
      success,
      email,
      sms,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
