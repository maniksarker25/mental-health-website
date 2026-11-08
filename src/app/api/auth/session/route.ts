import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import {
  accessTokenFromResponse,
  BackendRequestError,
  clearSessionCookies,
  errorResponse,
  requestBackend,
  setRefreshedAccessCookie,
  toWebUser,
} from '../../../../lib/server/auth';

export async function GET() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('mha_access_token')?.value;
  const refreshToken = cookieStore.get('mha_refresh_token')?.value;

  if (!accessToken && !refreshToken) {
    return NextResponse.json({ user: null });
  }

  let token = accessToken;
  let refreshed = false;
  try {
    if (!token && refreshToken) {
      const { body } = await requestBackend<{ accessToken?: string }>('auth/refresh-token', {
        method: 'POST',
        headers: { Cookie: `refreshToken=${encodeURIComponent(refreshToken)}` },
      });
      token = accessTokenFromResponse(body);
      refreshed = true;
    }

    if (!token) {
      const response = NextResponse.json({ user: null });
      clearSessionCookies(response);
      return response;
    }

    let profileResponse;
    try {
      profileResponse = await requestBackend('user/get-my-profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      if (!(error instanceof BackendRequestError) || error.status !== 401 || !refreshToken) {
        throw error;
      }

      const { body } = await requestBackend<{ accessToken?: string }>('auth/refresh-token', {
        method: 'POST',
        headers: { Cookie: `refreshToken=${encodeURIComponent(refreshToken)}` },
      });
      const nextToken = accessTokenFromResponse(body);
      profileResponse = await requestBackend('user/get-my-profile', {
        headers: { Authorization: `Bearer ${nextToken}` },
      });
      token = nextToken;
      refreshed = true;
    }

    const user = toWebUser(profileResponse.body.data);
    const response = NextResponse.json({ user });
    if (refreshed) {
      setRefreshedAccessCookie(
        response,
        token,
        cookieStore.get('mha_persistent')?.value === '1'
      );
    }
    return response;
  } catch (error) {
    if (error instanceof BackendRequestError && [401, 403].includes(error.status)) {
      const response = NextResponse.json({ user: null });
      clearSessionCookies(response);
      return response;
    }
    return errorResponse(error);
  }
}
