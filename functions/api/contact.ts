import { errorResponse, isSameOrigin, jsonResponse, type RequestContext } from '../_shared/auth';

const encoder = new TextEncoder();
const RESEND_ENDPOINT = 'https://api.resend.com/emails';

async function hash(value: string) {
  const digest = await crypto.subtle.digest('SHA-256', encoder.encode(value));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

function senderAddress(value: string) {
  const match = value.match(/<([^<>\s]+@[^<>\s]+)>/);
  return match?.[1] ?? value.trim();
}

interface ContactPayload {
  user_name?: unknown;
  user_email?: unknown;
  subject?: unknown;
  message?: unknown;
  website?: unknown;
}

export const onRequestPost = async ({ request, env }: RequestContext) => {
  if (!isSameOrigin(request)) return errorResponse('Request rejected.', 403);
  if (!env.CONTENT_DB || !env.RESEND_API_KEY || !env.CONTACT_FROM_EMAIL || !env.CONTACT_TO_EMAIL) {
    return errorResponse('Contact delivery is not configured yet.', 503);
  }
  if (Number(request.headers.get('Content-Length') ?? 0) > 12_000) {
    return errorResponse('Your message is too large.', 413);
  }

  let payload: ContactPayload;
  try {
    payload = await request.json() as ContactPayload;
  } catch {
    return errorResponse('Invalid message request.', 400);
  }

  // Honeypot: silently accept automated submissions without sending them.
  if (typeof payload.website === 'string' && payload.website.trim()) return jsonResponse({ sent: true });

  const name = typeof payload.user_name === 'string' ? payload.user_name.trim() : '';
  const email = typeof payload.user_email === 'string' ? payload.user_email.trim() : '';
  const subject = typeof payload.subject === 'string' ? payload.subject.trim() : '';
  const message = typeof payload.message === 'string' ? payload.message.trim() : '';
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!name || name.length > 120 || !emailPattern.test(email) || email.length > 254 || !subject || subject.length > 160 || !message || message.length > 5000) {
    return errorResponse('Please check the form fields and try again.', 400);
  }

  const clientIp = request.headers.get('CF-Connecting-IP') ?? 'unknown';
  const ipHash = `contact:${await hash(clientIp)}`;
  const now = Date.now();
  try {
    const recentAttempts = await env.CONTENT_DB.prepare(
      'SELECT COUNT(*) AS count FROM admin_login_attempts WHERE ip_hash = ? AND attempted_at > ?'
    ).bind(ipHash, now - 60 * 60 * 1000).first<{ count: number }>();
    if ((recentAttempts?.count ?? 0) >= 5) {
      return errorResponse('Too many messages were submitted. Please try again later.', 429);
    }
    await env.CONTENT_DB.prepare(
      'INSERT INTO admin_login_attempts (ip_hash, attempted_at) VALUES (?, ?)'
    ).bind(ipHash, now).run();
  } catch {
    return errorResponse('Message service is temporarily unavailable.', 503);
  }

  try {
    const fromAddress = senderAddress(env.CONTACT_FROM_EMAIL);
    if (!emailPattern.test(fromAddress)) {
      console.error('CONTACT_FROM_EMAIL must be an email address on the verified Resend domain.');
      return errorResponse('Message service is temporarily unavailable.', 503);
    }
    const displayName = name.replace(/[\r\n<>]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 120);
    const delivery = await fetch(RESEND_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `${displayName} via Portfolio <${fromAddress}>`,
        to: [env.CONTACT_TO_EMAIL],
        reply_to: email,
        subject: `Portfolio contact: ${subject}`,
        text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\n${message}`,
      }),
    });

    if (!delivery.ok) {
      console.error('Contact email provider returned an error status:', delivery.status);
      return errorResponse('Could not send your message right now. Please try again later.', 502);
    }
    return jsonResponse({ sent: true });
  } catch (error) {
    console.error('Contact email delivery failed:', error instanceof Error ? error.message : 'Unknown error');
    return errorResponse('Could not send your message right now. Please try again later.', 502);
  }
};
