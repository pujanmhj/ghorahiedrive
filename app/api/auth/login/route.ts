import { NextResponse } from 'next/server';
import { applySessionCookie, verifyPassword } from '@/lib/auth';
import { findUserByEmail } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body.email || '').trim().toLowerCase();
    const password = String(body.password || '');

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    const user = await findUserByEmail(email);
    if (!user || !verifyPassword(password, user.passwordHash)) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    const sessionUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    const response = NextResponse.json({ user: sessionUser });
    return applySessionCookie(response, sessionUser);
  } catch (error) {
    console.error('[auth/login]', error);
    const message =
      error instanceof Error && /mongo|connect/i.test(error.message)
        ? 'Database connection failed. Check MongoDB Atlas IP allowlist.'
        : 'Login failed. Please try again.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
