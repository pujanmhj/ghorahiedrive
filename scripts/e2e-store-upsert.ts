import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

async function main() {
  const { upsertRevenue, listRevenues } = await import('../lib/db/store');

  const date = '2026-08-05';
  await upsertRevenue({ carId: 'car-1', date, amount: 1001, note: 'iso-1' });
  await upsertRevenue({ carId: 'car-2', date, amount: 2002, note: 'iso-2' });
  await upsertRevenue({ carId: 'car-3', date, amount: 3003, note: 'iso-3' });
  // update car-2 again — should not touch car-1 / car-3
  await upsertRevenue({ carId: 'car-2', date, amount: 2222, note: 'iso-2-updated' });

  const all = await listRevenues({ month: '2026-08' });
  const mine = all.filter((r) => r.note?.startsWith('iso-'));
  console.log(
    'saved:',
    mine.map((r) => ({ carId: r.carId, amount: r.amount, note: r.note, id: r.id }))
  );

  const ok =
    mine.some((r) => r.carId === 'car-1' && r.amount === 1001) &&
    mine.some((r) => r.carId === 'car-2' && r.amount === 2222) &&
    mine.some((r) => r.carId === 'car-3' && r.amount === 3003);

  if (!ok || mine.length < 3) {
    throw new Error('FAIL: revenues for other cars were lost');
  }

  console.log('PASS: each car keeps its own revenue');
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
