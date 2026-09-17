import { NextResponse } from 'next/server';
import { AuthError, hashPassword, requireSession } from '@/lib/auth';
import { createUser, isStoreError, listUsers } from '@/lib/db';
import type { User } from '@/lib/types';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function publicUser(u: User) {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
  };
}

export async function GET() {
  try {
    await requireSession('admin');
    const users = await listUsers();
    return NextResponse.json({ users: users.map(publicUser) });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: 'Could not load users.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await requireSession('admin');
    const body = await request.json();
    const name = String(body.name || '').trim();
    const email = String(body.email || '').trim().toLowerCase();
    const password = String(body.password || '');
    const role = body.role === 'admin' ? 'admin' : 'shareholder';

    if (!name || !email || password.length < 6) {
      return NextResponse.json(
        { error: 'Name, email, and password (min 6 chars) are required.' },
        { status: 400 }
      );
    }

    const user = await createUser({
      name,
      email,
      passwordHash: hashPassword(password),
      role,
    });

    return NextResponse.json({ user: publicUser(user) }, { status: 201 });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    if (isStoreError(error)) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: 'Could not create user.' }, { status: 500 });
  }
}
