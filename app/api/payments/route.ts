import { NextRequest, NextResponse } from 'next/server';
import { AuthError, getSessionUser, requireSession } from '@/lib/auth';
import { createPayment, isStoreError, listPayments } from '@/lib/db';
import type { PaymentMethod } from '@/lib/types';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const method = searchParams.get('method') as PaymentMethod | null;
  const date = searchParams.get('date') || undefined;

  try {
    const payments = await listPayments({
      method: method || undefined,
      date,
    });
    return NextResponse.json({ payments });
  } catch (err) {
    console.error('[GET /api/payments]', err);
    return NextResponse.json({ error: 'Failed to fetch payments' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireSession('admin');
    const body = await req.json();
    const payment = await createPayment({
      carId: String(body.carId || '').trim(),
      date: String(body.date || '').trim(),
      amount: Number(body.amount),
      method: body.method as PaymentMethod,
      note: body.note ? String(body.note).trim() : undefined,
    });
    return NextResponse.json({ payment }, { status: 201 });
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    if (isStoreError(err)) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error('[POST /api/payments]', err);
    return NextResponse.json({ error: 'Failed to save payment' }, { status: 500 });
  }
}
