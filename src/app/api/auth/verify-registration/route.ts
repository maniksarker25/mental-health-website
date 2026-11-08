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
      !('verifyCode' in body) ||
      typeof body.verifyCode !== 'string'
    ) {
      return NextResponse.json({ error: 'Email and verification code are required.' }, { status: 400 });
    }

    const verifyCode = Number(body.verifyCode);
    if (!Number.isInteger(verifyCode) || verifyCode < 100000 || verifyCode > 999999) {
      return NextResponse.json({ error: 'Enter the six-digit verification code.' }, { status: 400 });
    }

    const { body: result } = await requestBackend<BackendAuthData>('user/verify-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: body.email.trim(), verifyCode }),
    });
    const tokens = authDataFromResponse(result);
    if (tokens.role !== 'user') {
      return NextResponse.json({ error: 'This registration is not a regular-user account.' }, { status: 403 });
    }

    const { body: profileResult } = await requestBackend('user/get-my-profile', {
      headers: { Authorization: `Bearer ${tokens.accessToken}` },
    });
    const user = toWebUser(profileResult.data);
    const response = NextResponse.json({ user });
    setSessionCookies(response, tokens, true);
    return response;
  } catch (error) {
    return errorResponse(error);
  }
}
