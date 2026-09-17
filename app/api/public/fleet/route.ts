import { NextResponse } from 'next/server';
import { listCars } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/** Public fleet snapshot for marketing pages (no auth). */
export async function GET() {
  const cars = await listCars();
  const publicCars = cars.map((c) => ({
    id: c.id,
    carNumber: c.carNumber,
    from: c.from,
    to: c.to,
  }));

  return NextResponse.json(
    {
      count: publicCars.length,
      cars: publicCars,
      destinations: [...new Set(publicCars.map((c) => c.to))],
    },
    {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    }
  );
}
