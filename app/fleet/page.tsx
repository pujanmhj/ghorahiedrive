import { Navbar, Footer, FleetSection } from '@/components/marketing';
import { readDb } from '@/lib/db';
import type { FleetCar } from '@/lib/types';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function FleetPage() {
  let cars: FleetCar[] = [];

  try {
    const db = await readDb();
    cars = db.cars;
  } catch (error) {
    console.error('[fleet] MongoDB unavailable:', error);
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-[#F8FAF8] pt-12">
        <FleetSection cars={cars} />
      </main>
      <Footer />
    </>
  );
}
