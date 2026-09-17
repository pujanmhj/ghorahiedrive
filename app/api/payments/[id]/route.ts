import { NextRequest, NextResponse } from 'next/server';
import { AuthError, requireSession } from '@/lib/auth';
import { deletePayment, updatePayment, isStoreError } from '@/lib/db';
import type { PaymentMethod } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireSession('admin');
    const { id } = await params;
    const body = await req.json();
    const payment = await updatePayment(id, {
      carId:  body.carId,
      date:   body.date,
      amount: body.amount !== undefined ? Number(body.amount) : undefined,
      method: body.method as PaymentMethod | undefined,
      note:   body.note,
    });
    return NextResponse.json({ payment });
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    if (isStoreError(err)) {
      return NextResponse.json({ error: err.message }, { status: (err as { status: number }).status });
    }
    console.error('[PUT /api/payments/[id]]', err);
    return NextResponse.json({ error: 'Failed to update payment' }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireSession('admin');
    const { id } = await params;
    await deletePayment(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    if (isStoreError(err)) {
      return NextResponse.json({ error: err.message }, { status: (err as { status: number }).status });
    }
    console.error('[DELETE /api/payments/[id]]', err);
    return NextResponse.json({ error: 'Failed to delete payment' }, { status: 500 });
  }
}
