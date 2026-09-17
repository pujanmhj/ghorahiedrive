import { NextResponse } from 'next/server';
import { AuthError, requireSession } from '@/lib/auth';
import { deleteCar, isStoreError, updateCar } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Params) {
  try {
    await requireSession('admin');
    const { id } = await params;
    const body = await request.json();
    const carNumber = String(body.carNumber || '').trim();
    const from = body.from ? String(body.from).trim() : '';
    const to = body.to ? String(body.to).trim() : '';

    if (!carNumber) {
      return NextResponse.json(
        { error: 'Car number is required.' },
        { status: 400 }
      );
    }

    const car = await updateCar(id, { carNumber, from, to });
    return NextResponse.json({ car });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    if (isStoreError(error)) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error('[cars PUT]', error);
    return NextResponse.json({ error: 'Could not update car.' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    await requireSession('admin');
    const { id } = await params;
    await deleteCar(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    if (isStoreError(error)) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error('[cars DELETE]', error);
    return NextResponse.json({ error: 'Could not delete car.' }, { status: 500 });
  }
}
