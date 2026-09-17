import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';
import type { NextResponse } from 'next/server';
import type { SessionUser, UserRole } from '@/lib/types/fleet';

export const SESSION_COOKIE = 'ded_session';
const SECRET = process.env.AUTH_SECRET || 'dang-edrive-dev-secret-change-me';

export function hashPassword(password: string, salt?: string): string {
  const usedSalt = salt || randomBytes(16).toString('hex');
  const hash = scryptSync(password, usedSalt, 64).toString('hex');
  return `${usedSalt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(':');
  if (!salt || !hash) return false;
  const attempt = scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, 'hex');
  if (attempt.length !== expected.length) return false;
  return timingSafeEqual(attempt, expected);
}

function sign(payload: string): string {
  return createHmac('sha256', SECRET).update(payload).digest('hex');
}

export function createSessionToken(user: SessionUser): string {
  const payload = Buffer.from(
    JSON.stringify({
      ...user,
      exp: Date.now() + 7 * 24 * 60 * 60 * 1000,
    })
  ).toString('base64url');
  const signature = sign(payload);
  return `${payload}.${signature}`;
}

export function parseSessionToken(token: string | undefined): SessionUser | null {
  if (!token) return null;
  const [payload, signature] = token.split('.');
  if (!payload || !signature) return null;
  if (sign(payload) !== signature) return null;

  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as SessionUser & {
      exp: number;
    };
    if (!data.exp || data.exp < Date.now()) return null;
    if (!data.id || !data.email || !data.role) return null;
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role as UserRole,
    };
  } catch {
    return null;
  }
}

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  maxAge: 7 * 24 * 60 * 60,
};

/** Prefer setting cookie on the response in Route Handlers (reliable Set-Cookie). */
export function applySessionCookie(response: NextResponse, user: SessionUser) {
  response.cookies.set(SESSION_COOKIE, createSessionToken(user), sessionCookieOptions);
  return response;
}

export function clearSessionCookieOnResponse(response: NextResponse) {
  response.cookies.set(SESSION_COOKIE, '', {
    ...sessionCookieOptions,
    maxAge: 0,
  });
  return response;
}

export async function setSessionCookie(user: SessionUser) {
  const store = await cookies();
  store.set(SESSION_COOKIE, createSessionToken(user), sessionCookieOptions);
}

export async function clearSessionCookie() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const store = await cookies();
  return parseSessionToken(store.get(SESSION_COOKIE)?.value);
}

export async function requireSession(role?: UserRole): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) throw new AuthError('Please sign in first.', 401);
  if (role && user.role !== role) throw new AuthError('You do not have permission.', 403);
  return user;
}

export class AuthError extends Error {
  status: number;
  constructor(message: string, status = 401) {
    super(message);
    this.status = status;
  }
}
