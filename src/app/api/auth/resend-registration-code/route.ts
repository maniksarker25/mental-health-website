import { NextRequest, NextResponse } from 'next/server';
import { errorResponse, requestBackend } from '../../../../lib/server/auth';

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();
    if (
      typeof body !== 'object' ||
      body === null ||
      !('email' in body) ||
      typeof body.email !== 'string'
    ) {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
    }

    await requestBackend('user/resend-verify-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: body.email.trim() }),
    });
    return NextResponse.json({ message: 'A new verification code was sent.' });
  } catch (error) {
    return errorResponse(error);
  }
}
