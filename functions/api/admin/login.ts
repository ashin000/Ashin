import { createSession, errorResponse, isSameOrigin, jsonResponse, sessionCookie, type RequestContext } from '../../_shared/auth';

const encoder = new TextEncoder();

async function hash(value: string) {
  const digest = await crypto.subtle.digest('SHA-256', encoder.encode(value));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

function constantTimeEqual(left: string, right: string) {
  let difference = left.length ^ right.length;
  for (let index = 0; index < Math.max(left.length, right.length); index += 1) {
    difference |= (left.charCodeAt(index) || 0) ^ (right.charCodeAt(index) || 0);
  }
  return difference === 0;
}

export const onRequestPost = async ({ request, env }: RequestContext) => {
  if (!isSameOrigin(request)) return errorResponse('Request rejected.', 403);
  if (!env.ADMIN_USERNAME || !env.ADMIN_PASSWORD || !env.SESSION_SECRET || !env.CONTENT_DB) {
    return errorResponse('Admin authentication and database bindings are not configured.', 503);
  }

  let credentials: { username?: unknown; password?: unknown };
  try {
    if (Number(request.headers.get('Content-Length') ?? 0) > 2048) return errorResponse('Invalid request.', 413);
    credentials = await request.json() as { username?: unknown; password?: unknown };
  } catch {
    return errorResponse('Invalid request.', 400);
  }
  const username = typeof credentials.username === 'string' ? credentials.username.slice(0, 128) : '';
  const password = typeof credentials.password === 'string' ? credentials.password.slice(0, 512) : '';
  const ipHash = await hash(request.headers.get('CF-Connecting-IP') ?? 'unknown');

  try {
    const recentAttempts = await env.CONTENT_DB.prepare(
      'SELECT COUNT(*) AS count FROM admin_login_attempts WHERE ip_hash = ? AND attempted_at > ?'
    ).bind(ipHash, Date.now() - 15 * 60 * 1000).first<{ count: number }>();
    if ((recentAttempts?.count ?? 0) >= 10) return errorResponse('Too many attempts. Try again in 15 minutes.', 429);
    await env.CONTENT_DB.prepare('INSERT INTO admin_login_attempts (ip_hash, attempted_at) VALUES (?, ?)').bind(ipHash, Date.now()).run();
  } catch {
    return errorResponse('Admin database is not initialized. Apply the included D1 migration first.', 503);
  }

  const usernameMatches = constantTimeEqual(await hash(username), await hash(env.ADMIN_USERNAME));
  const passwordMatches = constantTimeEqual(await hash(password), await hash(env.ADMIN_PASSWORD));
  if (!usernameMatches || !passwordMatches) return errorResponse('Invalid username or password.', 401);

  await env.CONTENT_DB.prepare('DELETE FROM admin_login_attempts WHERE ip_hash = ?').bind(ipHash).run();
  const token = await createSession(env.ADMIN_USERNAME, env.SESSION_SECRET);
  const headers = new Headers({ 'Set-Cookie': sessionCookie(token) });
  return jsonResponse({ authenticated: true }, 200, headers);
};
