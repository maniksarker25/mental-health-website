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
      !body.email.trim()
    ) {
      return NextResponse.json({ error: 'A valid email is required.' }, { status: 400 });
    }

    await requestBackend('auth/forget-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: body.email.trim() }),
    });
    return NextResponse.json({ message: 'A password reset code was sent to your email.' });
  } catch (error) {
    return errorResponse(error);
  }
}
