import {
  Navbar,
  Hero,
  About,
  Features,
  FleetSection,
  Contact,
  Footer,
  StatCard,
  SectionDivider,
} from '@/components/marketing';
import { Car, Users, ShieldCheck, PhoneCall } from 'lucide-react';
import { readDb } from '@/lib/db';
import type { FleetCar } from '@/lib/types';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home() {
  let cars: FleetCar[] = [];
  let carCount = 10;
  let destinations = 1;
  let shareholderCount = 1;

  try {
    const db = await readDb();
    cars = db.cars;
    carCount = db.cars.length;
    destinations = [...new Set(db.cars.map((c) => c.to))].length || 1;
    shareholderCount = db.users.filter((u) => u.role === 'shareholder').length || 1;
  } catch (error) {
    console.error('[home] MongoDB unavailable, using fallback stats:', error);
  }

  return (
    <>
      <Navbar />

      <main className="flex-1">
        <Hero />

        <section className="relative z-20 -mt-10 sm:-mt-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              value={`${carCount} Active`}
              label="Fleet Vehicles"
              description="Live count from the admin portal — updates when cars are added or removed."
              icon={<Car className="w-6 h-6 text-[#4CAF50]" />}
            />
            <StatCard
              value={`${Math.max(shareholderCount, 1)}+`}
              label="Shareholders"
              description="Registered partners who can sign in and view fleet revenue."
              icon={<Users className="w-6 h-6 text-[#4CAF50]" />}
            />
            <StatCard
              value={`${destinations || 1} Routes`}
              label="Destinations"
              description="Routes currently assigned across the live fleet."
              icon={<ShieldCheck className="w-6 h-6 text-[#4CAF50]" />}
            />
            <StatCard
              value="24/7 Hotline"
              label="Instant Support"
              description="Direct communication lines for emergency adjustments and custom routing."
              icon={<PhoneCall className="w-6 h-6 text-[#4CAF50]" />}
            />
          </div>
        </section>

        <SectionDivider variant="wave" fillColor="#0B3D26" className="-mb-1 mt-12" />
        <About />
        <SectionDivider variant="curve" fillColor="#F8FAF8" className="-mt-1 bg-[#0B3D26]" />
        <Features />
        <SectionDivider variant="angle" fillColor="#FFFFFF" className="-mb-1" />
        <FleetSection cars={cars} />
        <SectionDivider variant="wave" fillColor="#F8FAF8" className="-mb-1" />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
