import { jsonResponse } from '../_shared/auth';
import type { RequestContext } from '../_shared/auth';

export const onRequestGet = async ({ env }: RequestContext) => {
  try {
    const record = await env.CONTENT_DB.prepare('SELECT content FROM portfolio_content WHERE id = ?').bind('main').first<{ content: string }>();
    return jsonResponse(record ? JSON.parse(record.content) : null);
  } catch {
    return jsonResponse(null);
  }
};
