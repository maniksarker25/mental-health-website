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
      !('password' in body) ||
      typeof body.password !== 'string' ||
      !('confirmPassword' in body) ||
      typeof body.confirmPassword !== 'string'
    ) {
      return NextResponse.json(
        { error: 'Email, password, and password confirmation are required.' },
        { status: 400 }
      );
    }
    if (body.password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters.' },
        { status: 400 }
      );
    }
    if (body.password !== body.confirmPassword) {
      return NextResponse.json({ error: 'Passwords do not match.' }, { status: 400 });
    }

    await requestBackend('auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: body.email.trim(),
        password: body.password,
        confirmPassword: body.confirmPassword,
      }),
    });
    return NextResponse.json({ message: 'Your password has been reset.' });
  } catch (error) {
    return errorResponse(error);
  }
}
