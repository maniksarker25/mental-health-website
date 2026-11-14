import { NextRequest } from 'next/server';
import { requestAuthenticatedBackend } from '../../../../../lib/server/authenticatedBackend';

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId } = await context.params;
  return requestAuthenticatedBackend(
    `package-purchase/session/${encodeURIComponent(sessionId)}`,
    { method: 'GET' }
  );
}
