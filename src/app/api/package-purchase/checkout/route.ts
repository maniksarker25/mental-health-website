import { NextRequest, NextResponse } from 'next/server';
import { requestAuthenticatedBackend } from '../../../../lib/server/authenticatedBackend';

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');
  if (origin && origin !== request.nextUrl.origin) {
    return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'A valid package selection is required.' }, { status: 400 });
  }

  return requestAuthenticatedBackend('package-purchase/checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}
