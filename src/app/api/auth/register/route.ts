import { NextRequest, NextResponse } from 'next/server';
import { errorResponse, requestBackend } from '../../../../lib/server/auth';

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();
    if (
      typeof body !== 'object' ||
      body === null ||
      !('name' in body) ||
      typeof body.name !== 'string' ||
      !('email' in body) ||
      typeof body.email !== 'string' ||
      !('password' in body) ||
      typeof body.password !== 'string' ||
      !('confirmPassword' in body) ||
      typeof body.confirmPassword !== 'string'
    ) {
      return NextResponse.json({ error: 'Name, email, and password are required.' }, { status: 400 });
    }
    const payload = body as Record<string, unknown>;

    const nameParts = (payload.name as string).trim().split(/\s+/).filter(Boolean);
    if (nameParts.length === 0) {
      return NextResponse.json({ error: 'Please enter your name.' }, { status: 400 });
    }

    const [firstName, ...lastNameParts] = nameParts;
    await requestBackend('user/sign-up', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userData: {
          firstName,
          lastName: lastNameParts.join(' ') || firstName,
          email: (payload.email as string).trim(),
          ...(typeof payload.phone === 'string' && payload.phone.trim()
            ? { phone: payload.phone.trim() }
            : {}),
        },
        password: payload.password,
        confirmPassword: payload.confirmPassword,
        platform: 'web',
      }),
    });

    return NextResponse.json({ message: 'A verification code has been sent to your email.' });
  } catch (error) {
    return errorResponse(error);
  }
}
