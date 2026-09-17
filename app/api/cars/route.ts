import { NextResponse } from 'next/server';
import { AuthError, getSessionUser, requireSession } from '@/lib/auth';
import { createCar, isStoreError, listCars } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const cars = await listCars();
  return NextResponse.json({ cars });
}

export async function POST(request: Request) {
  try {
    await requireSession('admin');
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

    const car = await createCar({ carNumber, from, to });
    return NextResponse.json({ car }, { status: 201 });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    if (isStoreError(error)) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error('[cars POST]', error);
    return NextResponse.json({ error: 'Could not add car.' }, { status: 500 });
  }
}
