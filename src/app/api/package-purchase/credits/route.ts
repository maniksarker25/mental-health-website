import { NextRequest } from 'next/server';
import { requestAuthenticatedBackend } from '../../../../lib/server/authenticatedBackend';

export async function GET(request: NextRequest) {
  return requestAuthenticatedBackend('package-purchase/my-credits', {
    method: 'GET',
    signal: request.signal,
  });
}
