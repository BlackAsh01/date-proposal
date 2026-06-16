const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL || 'ashwinprabhu908@gmail.com';
const NOTIFICATION_PHONE = process.env.NOTIFICATION_PHONE || '+918939475035';

function buildMessage({ date, food, dress }) {
  const lines = [
    'Someone said YES to your date proposal! 💕',
    '',
    `When: ${date || '—'}`,
    `Food: ${food || '—'}`,
    `Outfit: ${dress || '—'}`,
    '',
    `Completed: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`,
  ];
  return lines.join('\n');
}

function buildSmsMessage({ date, food, dress }) {
  return `Date YES! When: ${date || '—'} | Food: ${food || '—'} | Outfit: ${dress || '—'}`;
}

function phoneDigits() {
  return NOTIFICATION_PHONE.replace(/\D/g, '').replace(/^91/, '') || '8939475035';
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
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    return { ok: false, error: `Resend error: ${body}` };
  }

  return { ok: true };
}

async function sendSmsTwilio(details) {
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
      Body: buildSmsMessage(details),
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    return { ok: false, error: `Twilio error: ${body}` };
  }

  return { ok: true };
}

async function sendSmsFast2SMS(details) {
  const apiKey = process.env.FAST2SMS_API_KEY;
  if (!apiKey) {
    return { ok: false, error: 'FAST2SMS_API_KEY not configured' };
  }

  const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
    method: 'POST',
    headers: {
      authorization: apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      route: 'q',
      message: buildSmsMessage(details).slice(0, 160),
      numbers: phoneDigits(),
    }),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok || data.return !== true) {
    return { ok: false, error: data.message || 'Fast2SMS error' };
  }

  return { ok: true };
}

async function sendSms(details) {
  const twilio = await sendSmsTwilio(details);
  if (twilio.ok) return twilio;
  return sendSmsFast2SMS(details);
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
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const { date, food, dress } = body;
    const details = {
      date: String(date || '').slice(0, 200),
      food: String(food || '').slice(0, 200),
      dress: String(dress || '').slice(0, 200),
    };

    const [email, sms] = await Promise.all([
      sendEmailResend(details),
      sendSms(details),
    ]);

    return res.status(200).json({
      success: email.ok || sms.ok,
      email,
      sms,
      note: !email.ok && !sms.ok
        ? 'Email is sent from the browser via FormSubmit. Add RESEND_API_KEY or FAST2SMS_API_KEY in Vercel for server delivery.'
        : undefined,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
