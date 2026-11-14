import { NextResponse } from 'next/server';
import type { WebUser } from '../../types/auth';

const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
};

const SESSION_MAX_AGE = 7 * 24 * 60 * 60;

interface BackendResponse<T = unknown> {
  success?: boolean;
  message?: string;
  data?: T;
}

export interface BackendAuthData {
  accessToken?: string;
  refreshToken?: string;
  role?: string;
}

export class BackendRequestError extends Error {
  constructor(
    message: string,
    readonly status: number
  ) {
    super(message);
    this.name = 'BackendRequestError';
  }
}

export function getBackendApiUrl(): string {
  const configuredUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!configuredUrl) {
    throw new BackendRequestError(
      'The mental-health API URL is not configured on the server.',
      500
    );
  }

  const normalizedUrl = configuredUrl.trim().replace(/\/+$/, '');
  if (normalizedUrl.endsWith('/api/v1')) return normalizedUrl;
  if (normalizedUrl.endsWith('/api')) return `${normalizedUrl}/v1`;
  return `${normalizedUrl}/api/v1`;
}

export async function requestBackend<T = unknown>(
  path: string,
  init: RequestInit = {}
): Promise<{ response: Response; body: BackendResponse<T> }> {
  let response: Response;
  try {
    response = await fetch(`${getBackendApiUrl()}/${path.replace(/^\/+/, '')}`, {
      ...init,
      headers: {
        Accept: 'application/json',
        ...init.headers,
      },
      cache: 'no-store',
      signal: init.signal ?? AbortSignal.timeout(15000),
    });
  } catch {
    throw new BackendRequestError('Could not connect to the mental-health API.', 502);
  }

  let body: BackendResponse<T>;
  try {
    body = (await response.json()) as BackendResponse<T>;
  } catch {
    throw new BackendRequestError(
      'The mental-health API returned an invalid response.',
      502
    );
  }

  if (!response.ok || body.success === false) {
    throw new BackendRequestError(
      body.message || 'The request could not be completed.',
      response.status
    );
  }

  return { response, body };
}

export function authDataFromResponse(
  body: BackendResponse<BackendAuthData>
): Required<Pick<BackendAuthData, 'accessToken' | 'refreshToken' | 'role'>> {
  const data = body.data;
  if (
    !data ||
    typeof data.accessToken !== 'string' ||
    typeof data.refreshToken !== 'string' ||
    typeof data.role !== 'string'
  ) {
    throw new BackendRequestError('The API returned an invalid authentication response.', 502);
  }
  return {
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
    role: data.role,
  };
}

export function accessTokenFromResponse(
  body: BackendResponse<{ accessToken?: string }>
): string {
  const accessToken = body.data?.accessToken;
  if (typeof accessToken !== 'string') {
    throw new BackendRequestError('The API did not return an access token.', 502);
  }
  return accessToken;
}

export function setSessionCookies(
  response: NextResponse,
  tokens: { accessToken: string; refreshToken: string },
  rememberMe = false
): void {
  const options = rememberMe
    ? { ...SESSION_COOKIE_OPTIONS, maxAge: SESSION_MAX_AGE }
    : SESSION_COOKIE_OPTIONS;

  response.cookies.set('mha_access_token', tokens.accessToken, options);
  response.cookies.set('mha_refresh_token', tokens.refreshToken, options);
  if (rememberMe) {
    response.cookies.set('mha_persistent', '1', {
      ...SESSION_COOKIE_OPTIONS,
      maxAge: SESSION_MAX_AGE,
    });
  } else {
    response.cookies.set('mha_persistent', '', {
      ...SESSION_COOKIE_OPTIONS,
      maxAge: 0,
    });
  }
}

export function setRefreshedAccessCookie(
  response: NextResponse,
  accessToken: string,
  rememberMe: boolean
): void {
  const options = rememberMe
    ? { ...SESSION_COOKIE_OPTIONS, maxAge: SESSION_MAX_AGE }
    : SESSION_COOKIE_OPTIONS;
  response.cookies.set('mha_access_token', accessToken, options);
}

export function clearSessionCookies(response: NextResponse): void {
  response.cookies.set('mha_access_token', '', { ...SESSION_COOKIE_OPTIONS, maxAge: 0 });
  response.cookies.set('mha_refresh_token', '', { ...SESSION_COOKIE_OPTIONS, maxAge: 0 });
  response.cookies.set('mha_persistent', '', { ...SESSION_COOKIE_OPTIONS, maxAge: 0 });
}

export function toWebUser(value: unknown): WebUser {
  if (typeof value !== 'object' || value === null) {
    throw new BackendRequestError('The API returned an invalid user profile.', 502);
  }

  const profile = value as Record<string, unknown>;
  const email = typeof profile.email === 'string' ? profile.email : '';
  const name = typeof profile.name === 'string' && profile.name.trim()
    ? profile.name.trim()
    : typeof profile.fullName === 'string' && profile.fullName.trim()
      ? profile.fullName.trim()
      : typeof profile.firstName === 'string'
        ? `${profile.firstName} ${typeof profile.lastName === 'string' ? profile.lastName : ''}`.trim()
    : email.split('@')[0] || 'Member';
  const initials =
    name
      .split(/\s+/)
      .filter(Boolean)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .slice(0, 2)
      .join('') || 'U';

  if (typeof profile._id !== 'string' || !email) {
    throw new BackendRequestError('The API returned an incomplete user profile.', 502);
  }

  return {
    id: profile._id,
    name,
    email,
    initials,
    createdAt:
      profile.createdAt instanceof Date
        ? profile.createdAt.toISOString()
        : typeof profile.createdAt === 'string'
          ? profile.createdAt
          : new Date().toISOString(),
    ...(typeof profile.profile_image === 'string' && profile.profile_image
      ? { avatar: profile.profile_image }
      : {}),
  };
}

export function errorResponse(error: unknown): NextResponse {
  const message =
    error instanceof Error ? error.message : 'An unexpected server error occurred.';
  const status = error instanceof BackendRequestError ? error.status : 500;
  return NextResponse.json({ error: message }, { status });
}
