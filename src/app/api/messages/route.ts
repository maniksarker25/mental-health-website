import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import {
  accessTokenFromResponse,
  BackendRequestError,
  clearSessionCookies,
  errorResponse,
  requestBackend,
  setRefreshedAccessCookie,
} from '../../../lib/server/auth';

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const origin = request.headers.get('origin');
    if (origin && origin !== request.nextUrl.origin) {
      return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 });
    }

    const body = await request.text();
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('mha_refresh_token')?.value;
    let accessToken = cookieStore.get('mha_access_token')?.value;
    let refreshed = false;
    const idempotencyKey = request.headers.get('idempotency-key');

    if (!idempotencyKey) {
      return NextResponse.json({ error: 'An idempotency key is required.' }, { status: 400 });
    }

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

    if (!accessToken && refreshToken) {
      accessToken = await refreshAccessToken();
      refreshed = true;
    }

    const sendRequest = (token?: string) =>
      requestBackend('message', {
        method: 'POST',
        body,
        signal: AbortSignal.timeout(55_000),
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': idempotencyKey,
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

    let result;
    try {
      result = await sendRequest(accessToken);
    } catch (error) {
      if (
        !(error instanceof BackendRequestError) ||
        error.status !== 401 ||
        !refreshToken ||
        refreshed
      ) {
        throw error;
      }

      accessToken = await refreshAccessToken();
      refreshed = true;
      result = await sendRequest(accessToken);
    }

    const response = NextResponse.json(result.body, { status: result.response.status });
    if (refreshed && accessToken) {
      setRefreshedAccessCookie(
        response,
        accessToken,
        cookieStore.get('mha_persistent')?.value === '1'
      );
    }
    return response;
  } catch (error) {
    if (error instanceof BackendRequestError && [401, 403].includes(error.status)) {
      const response = errorResponse(error);
      clearSessionCookies(response);
      return response;
    }
    return errorResponse(error);
  }
}
