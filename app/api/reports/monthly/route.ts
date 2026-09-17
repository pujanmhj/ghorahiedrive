import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { getMonthlyReport } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const now = new Date();
  const year = Number(searchParams.get('year') || now.getFullYear());
  const month = Number(searchParams.get('month') || now.getMonth() + 1);

  if (!Number.isInteger(year) || !Number.isInteger(month) || month < 1 || month > 12) {
    return NextResponse.json({ error: 'Invalid year or month.' }, { status: 400 });
  }

  const report = await getMonthlyReport(year, month);
  return NextResponse.json(report);
}
