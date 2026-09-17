import { NextResponse } from 'next/server';
import { AuthError, requireSession } from '@/lib/auth';
import { deleteRevenue, isStoreError, updateRevenue } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Params) {
  try {
    await requireSession('admin');
    const { id } = await params;
    const body = await request.json();
    const amount = Number(body.amount);
    const carId = body.carId ? String(body.carId).trim() : undefined;
    const route = body.route !== undefined ? String(body.route).trim() : undefined;
    const note = body.note !== undefined ? String(body.note).trim() : undefined;
    const date = body.date ? String(body.date).trim() : undefined;

    if (!Number.isFinite(amount) || amount < 0) {
      return NextResponse.json({ error: 'Valid amount is required.' }, { status: 400 });
    }

    const revenue = await updateRevenue(id, { amount, carId, route, note, date });
    return NextResponse.json({ revenue });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    if (isStoreError(error)) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error('[revenue PUT]', error);
    return NextResponse.json({ error: 'Could not update revenue.' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    await requireSession('admin');
    const { id } = await params;
    await deleteRevenue(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    if (isStoreError(error)) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error('[revenue DELETE]', error);
    return NextResponse.json({ error: 'Could not delete revenue.' }, { status: 500 });
  }
}
