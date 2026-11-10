import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import {
  accessTokenFromResponse,
  BackendRequestError,
  clearSessionCookies,
  errorResponse,
  requestBackend,
  setRefreshedAccessCookie,
} from '../../../../lib/server/auth';

type RouteContext = {
  params: Promise<{ segments?: string[] }>;
};

async function forwardCommunityRequest(request: NextRequest, context: RouteContext) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('mha_access_token')?.value;
  const refreshToken = cookieStore.get('mha_refresh_token')?.value;
  const { segments = [] } = await context.params;
  const path = `community${segments.length ? `/${segments.map(encodeURIComponent).join('/')}` : ''}${request.nextUrl.search}`;
  const body = ['GET', 'HEAD'].includes(request.method) ? undefined : await request.text();
  let token = accessToken;
  let refreshed = false;

  const refreshAccessToken = async () => {
    if (!refreshToken) return undefined;
    const { body: refreshBody } = await requestBackend<{ accessToken?: string }>(
      'auth/refresh-token',
      {
        method: 'POST',
        headers: { Cookie: `refreshToken=${encodeURIComponent(refreshToken)}` },
      }
    );
    return accessTokenFromResponse(refreshBody);
  };

  if (!token && refreshToken) {
    token = await refreshAccessToken();
    refreshed = true;
  }

  const sendRequest = (bearerToken?: string) =>
    requestBackend(path, {
      method: request.method,
      ...(body !== undefined ? { body } : {}),
      headers: {
        ...(request.headers.get('content-type')
          ? { 'Content-Type': request.headers.get('content-type') as string }
          : {}),
        ...(bearerToken ? { Authorization: `Bearer ${bearerToken}` } : {}),
      },
    });

  let result;
  try {
    result = await sendRequest(token);
  } catch (error) {
    if (
      !(error instanceof BackendRequestError) ||
      error.status !== 401 ||
      !refreshToken ||
      refreshed
    ) {
      throw error;
    }

    token = await refreshAccessToken();
    refreshed = true;
    result = await sendRequest(token);
  }

  const response = NextResponse.json(result.body, { status: result.response.status });
  if (refreshed && token) {
    setRefreshedAccessCookie(
      response,
      token,
      cookieStore.get('mha_persistent')?.value === '1'
    );
  }
  return response;
}

async function handle(request: NextRequest, context: RouteContext) {
  try {
    return await forwardCommunityRequest(request, context);
  } catch (error) {
    if (error instanceof BackendRequestError && [401, 403].includes(error.status)) {
      const response = errorResponse(error);
      clearSessionCookies(response);
      return response;
    }
    return errorResponse(error);
  }
}

export const GET = handle;
export const POST = handle;
export const PATCH = handle;
export const DELETE = handle;
