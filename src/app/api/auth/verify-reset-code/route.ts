import { NextRequest, NextResponse } from 'next/server';
import { errorResponse, requestBackend } from '../../../../lib/server/auth';

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();
    if (
      typeof body !== 'object' ||
      body === null ||
      !('email' in body) ||
      typeof body.email !== 'string' ||
      !('resetCode' in body) ||
      typeof body.resetCode !== 'string'
    ) {
      return NextResponse.json(
        { error: 'Email and verification code are required.' },
        { status: 400 }
      );
    }

    const resetCode = Number(body.resetCode);
    if (!Number.isInteger(resetCode) || resetCode < 100000 || resetCode > 999999) {
      return NextResponse.json(
        { error: 'Enter the six-digit verification code.' },
        { status: 400 }
      );
    }

    await requestBackend('auth/verify-reset-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: body.email.trim(), resetCode }),
    });
    return NextResponse.json({ message: 'The reset code has been verified.' });
  } catch (error) {
    return errorResponse(error);
  }
}
