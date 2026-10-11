import { isAdminRequest, jsonResponse, type RequestContext } from '../../_shared/auth';

export const onRequestGet = async ({ request, env }: RequestContext) =>
  jsonResponse({ authenticated: await isAdminRequest(request, env) });
