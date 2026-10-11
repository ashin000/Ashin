export interface Env {
  CONTENT_DB: D1Database;
  ADMIN_USERNAME: string;
  ADMIN_PASSWORD: string;
  SESSION_SECRET: string;
  RESEND_API_KEY: string;
  CONTACT_FROM_EMAIL: string;
  CONTACT_TO_EMAIL: string;
}

export interface RequestContext {
  request: Request;
  env: Env;
}

const SESSION_COOKIE = 'portfolio_admin_session';
const SESSION_TTL_SECONDS = 60 * 60 * 8;
const encoder = new TextEncoder();

function toBase64Url(value: Uint8Array) {
  let binary = '';
  for (const byte of value) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '');
}

function fromBase64Url(value: string) {
  const base64 = value.replaceAll('-', '+').replaceAll('_', '/');
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
  return Uint8Array.from(atob(padded), (character) => character.charCodeAt(0));
}

async function sign(value: string, secret: string) {
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return toBase64Url(new Uint8Array(await crypto.subtle.sign('HMAC', key, encoder.encode(value))));
}

function safeEqual(left: string, right: string) {
  const a = encoder.encode(left);
  const b = encoder.encode(right);
  let difference = a.length ^ b.length;
  const length = Math.max(a.length, b.length);
  for (let index = 0; index < length; index += 1) difference |= (a[index] ?? 0) ^ (b[index] ?? 0);
  return difference === 0;
}

function cookieValue(request: Request) {
  const cookies = request.headers.get('Cookie')?.split(';') ?? [];
  const entry = cookies.map((cookie) => cookie.trim()).find((cookie) => cookie.startsWith(`${SESSION_COOKIE}=`));
  return entry?.slice(SESSION_COOKIE.length + 1) ?? '';
}

export function isSameOrigin(request: Request) {
  const origin = request.headers.get('Origin');
  return !origin || origin === new URL(request.url).origin;
}

export async function createSession(username: string, secret: string) {
  const payload = toBase64Url(encoder.encode(JSON.stringify({ username, expiresAt: Date.now() + SESSION_TTL_SECONDS * 1000 })));
  const signature = await sign(payload, secret);
  return `${payload}.${signature}`;
}

export async function isAdminRequest(request: Request, env: Env) {
  if (!env.SESSION_SECRET) return false;
  const [payload, signature, extra] = cookieValue(request).split('.');
  if (!payload || !signature || extra) return false;
  const expected = await sign(payload, env.SESSION_SECRET);
  if (!safeEqual(signature, expected)) return false;
  try {
    const session = JSON.parse(new TextDecoder().decode(fromBase64Url(payload))) as { username?: string; expiresAt?: number };
    return session.username === env.ADMIN_USERNAME && typeof session.expiresAt === 'number' && session.expiresAt > Date.now();
  } catch {
    return false;
  }
}

export function sessionCookie(token: string) {
  return `${SESSION_COOKIE}=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${SESSION_TTL_SECONDS}`;
}

export function expiredSessionCookie() {
  return `${SESSION_COOKIE}=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0`;
}

export function jsonResponse(body: unknown, status = 200, headers = new Headers()) {
  headers.set('Content-Type', 'application/json; charset=utf-8');
  headers.set('Cache-Control', 'no-store');
  return new Response(JSON.stringify(body), { status, headers });
}

export function errorResponse(message: string, status: number) {
  return jsonResponse({ error: message }, status);
}
