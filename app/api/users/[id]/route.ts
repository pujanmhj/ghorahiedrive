import { NextResponse } from 'next/server';
import { AuthError, hashPassword, requireSession } from '@/lib/auth';
import { deleteUser, isStoreError, updateUser } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type Params = { params: Promise<{ id: string }> };

export async function DELETE(_request: Request, { params }: Params) {
  try {
    const admin = await requireSession('admin');
    const { id } = await params;
    await deleteUser(id, admin.id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    if (isStoreError(error)) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: 'Could not delete user.' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: Params) {
  try {
    await requireSession('admin');
    const { id } = await params;
    const body = await request.json();
    const name = body.name !== undefined ? String(body.name).trim() : undefined;
    const password = body.password !== undefined ? String(body.password) : undefined;

    if (password !== undefined && password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters.' }, { status: 400 });
    }

    const user = await updateUser(id, {
      name,
      passwordHash: password ? hashPassword(password) : undefined,
    });

    return NextResponse.json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    if (isStoreError(error)) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: 'Could not update user.' }, { status: 500 });
  }
}
