import { errorResponse, isAdminRequest, isSameOrigin, jsonResponse, type RequestContext } from '../../_shared/auth';

const MAX_CONTENT_BYTES = 300_000;
const sections = ['profile', 'about', 'contact', 'stats', 'experience', 'skills', 'projects', 'certificates', 'services'];

export const onRequestGet = async ({ request, env }: RequestContext) => {
  if (!(await isAdminRequest(request, env))) return errorResponse('Unauthorized.', 401);
  try {
    const record = await env.CONTENT_DB.prepare('SELECT content FROM portfolio_content WHERE id = ?').bind('main').first<{ content: string }>();
    return jsonResponse(record ? JSON.parse(record.content) : null);
  } catch {
    return errorResponse('Admin database is not initialized. Apply the included D1 migration first.', 503);
  }
};

export const onRequestPut = async ({ request, env }: RequestContext) => {
  if (!isSameOrigin(request)) return errorResponse('Request rejected.', 403);
  if (!(await isAdminRequest(request, env))) return errorResponse('Unauthorized.', 401);
  const contentLength = Number(request.headers.get('Content-Length') ?? 0);
  if (contentLength > MAX_CONTENT_BYTES) return errorResponse('Portfolio content is too large.', 413);

  let content: unknown;
  try {
    content = await request.json();
  } catch {
    return errorResponse('Invalid JSON content.', 400);
  }
  if (!content || typeof content !== 'object' || sections.some((section) => !(section in content))) {
    return errorResponse('Portfolio content is missing required sections.', 400);
  }
  const serialized = JSON.stringify(content);
  if (encoder.encode(serialized).length > MAX_CONTENT_BYTES) return errorResponse('Portfolio content is too large.', 413);

  try {
    await env.CONTENT_DB.prepare(
      'INSERT INTO portfolio_content (id, content, updated_at) VALUES (?, ?, ?) ON CONFLICT(id) DO UPDATE SET content = excluded.content, updated_at = excluded.updated_at'
    ).bind('main', serialized, Date.now()).run();
    return jsonResponse({ saved: true });
  } catch {
    return errorResponse('Could not save portfolio content. Check the D1 binding and migration.', 503);
  }
};

const encoder = new TextEncoder();
