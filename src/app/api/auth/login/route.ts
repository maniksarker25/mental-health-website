import { NextRequest, NextResponse } from 'next/server';
import {
  authDataFromResponse,
  errorResponse,
  requestBackend,
  setSessionCookies,
  toWebUser,
  type BackendAuthData,
} from '../../../../lib/server/auth';

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();
    if (
      typeof body !== 'object' ||
      body === null ||
      !('email' in body) ||
      typeof body.email !== 'string' ||
      !('password' in body) ||
      typeof body.password !== 'string'
    ) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }
    const payload = body as Record<string, unknown>;

    const { body: result } = await requestBackend<BackendAuthData>('auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: (payload.email as string).trim(),
        password: payload.password,
        platform: 'web',
        role: 'user',
      }),
    });
    const tokens = authDataFromResponse(result);
    if (tokens.role !== 'user') {
      return NextResponse.json({ error: 'This account cannot sign in as a regular user.' }, { status: 403 });
    }

    const { body: profileResult } = await requestBackend('user/get-my-profile', {
      headers: { Authorization: `Bearer ${tokens.accessToken}` },
    });
    const user = toWebUser(profileResult.data);
    const response = NextResponse.json({ user });
    setSessionCookies(response, tokens, payload.rememberMe === true);
    return response;
  } catch (error) {
    return errorResponse(error);
  }
}
