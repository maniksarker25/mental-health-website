import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import {
  accessTokenFromResponse,
  BackendRequestError,
  clearSessionCookies,
  errorResponse,
  requestBackend,
  setRefreshedAccessCookie,
} from './auth';

export async function requestAuthenticatedBackend(
  path: string,
  init: RequestInit
): Promise<NextResponse> {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get('mha_refresh_token')?.value;
  let accessToken = cookieStore.get('mha_access_token')?.value;
  let refreshed = false;

  const refreshAccessToken = async () => {
    if (!refreshToken) return undefined;
    const { body } = await requestBackend<{ accessToken?: string }>('auth/refresh-token', {
      method: 'POST',
      headers: { Cookie: `refreshToken=${encodeURIComponent(refreshToken)}` },
    });
    return accessTokenFromResponse(body);
  };

  try {
    if (!accessToken && refreshToken) {
      accessToken = await refreshAccessToken();
      refreshed = true;
    }

    const sendRequest = (token?: string) =>
      requestBackend(path, {
        ...init,
        headers: {
          ...init.headers,
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
