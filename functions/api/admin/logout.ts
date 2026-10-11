import { expiredSessionCookie, isSameOrigin, jsonResponse, errorResponse, type RequestContext } from '../../_shared/auth';

export const onRequestPost = async ({ request }: RequestContext) => {
  if (!isSameOrigin(request)) return errorResponse('Request rejected.', 403);
  const headers = new Headers({ 'Set-Cookie': expiredSessionCookie() });
  return jsonResponse({ authenticated: false }, 200, headers);
};
