import { errorResponse, isSameOrigin, jsonResponse, type RequestContext } from '../../_shared/auth';

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

export const onRequestPost = async ({ request, env }: RequestContext) => {
  if (!isSameOrigin(request)) return errorResponse('Request rejected.', 403);
  if (!env.CONTENT_DB || !env.ADMIN_USERNAME || !env.RESEND_API_KEY || !env.CONTACT_FROM_EMAIL || !env.CONTACT_TO_EMAIL) {
    return errorResponse('Password recovery is not configured yet.', 503);
  }
  if (Number(request.headers.get('Content-Length') ?? 0) > 1024) return errorResponse('Invalid request.', 413);

  let payload: { username?: unknown };
  try {
    payload = await request.json() as { username?: unknown };
  } catch {
    return errorResponse('Invalid request.', 400);
  }

  const username = typeof payload.username === 'string' ? payload.username.trim().slice(0, 128) : '';
  const ipHash = `password-reset:${await hash(request.headers.get('CF-Connecting-IP') ?? 'unknown')}`;
  const now = Date.now();

  try {
    const recentAttempts = await env.CONTENT_DB.prepare(
      'SELECT COUNT(*) AS count FROM admin_login_attempts WHERE ip_hash = ? AND attempted_at > ?'
    ).bind(ipHash, now - 60 * 60 * 1000).first<{ count: number }>();
    if ((recentAttempts?.count ?? 0) >= 3) return errorResponse('Too many recovery requests. Try again in an hour.', 429);
    await env.CONTENT_DB.prepare('INSERT INTO admin_login_attempts (ip_hash, attempted_at) VALUES (?, ?)').bind(ipHash, now).run();
  } catch {
    return errorResponse('Password recovery is temporarily unavailable.', 503);
  }

  // Return the same response for every username so this endpoint cannot be used to discover the admin account.
  if (username !== env.ADMIN_USERNAME) return jsonResponse({ sent: true });

  try {
    const from = senderAddress(env.CONTACT_FROM_EMAIL);
    const delivery = await fetch(RESEND_ENDPOINT, {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: `Portfolio Admin <${from}>`,
        to: [env.CONTACT_TO_EMAIL],
        subject: 'Portfolio admin password reset requested',
        text: `A password reset was requested for the portfolio admin account “${env.ADMIN_USERNAME}” at ${new Date(now).toISOString()}.\n\nTo reset it, update the ADMIN_PASSWORD secret in Cloudflare Pages, then sign in with the new password.`,
      }),
    });
    if (!delivery.ok) {
      console.error('Password recovery email provider returned an error status:', delivery.status);
      return errorResponse('Could not send the recovery email right now. Please try again later.', 502);
    }
  } catch (error) {
    console.error('Password recovery email failed:', error instanceof Error ? error.message : 'Unknown error');
    return errorResponse('Could not send the recovery email right now. Please try again later.', 502);
  }

  return jsonResponse({ sent: true });
};
