import { NextResponse } from 'next/server';
import { clearSessionCookieOnResponse } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST() {
  const response = NextResponse.json({ ok: true });
  return clearSessionCookieOnResponse(response);
}
