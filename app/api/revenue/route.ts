import { NextResponse } from 'next/server';
import { AuthError, getSessionUser, requireSession } from '@/lib/auth';
import { isStoreError, listRevenues, createRevenue } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const carId = searchParams.get('carId') || undefined;
  const month = searchParams.get('month') || undefined;

  const revenues = await listRevenues({ carId, month });
  return NextResponse.json({ revenues });
}

export async function POST(request: Request) {
  try {
    await requireSession('admin');
    const body = await request.json();
    const carId = String(body.carId || '').trim();
    const date = String(body.date || '').trim();
    const amount = Number(body.amount);
    const route = body.route ? String(body.route).trim() : undefined;
    const note = body.note ? String(body.note).trim() : undefined;

    if (!carId || !date || !Number.isFinite(amount) || amount < 0) {
      return NextResponse.json(
        { error: 'Car, date, and a valid amount are required.' },
        { status: 400 }
      );
    }

    const revenue = await createRevenue({ carId, date, amount, route, note });
    return NextResponse.json({ revenue }, { status: 201 });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    if (isStoreError(error)) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error('[revenue POST]', error);
    return NextResponse.json({ error: 'Could not save revenue.' }, { status: 500 });
  }
}
