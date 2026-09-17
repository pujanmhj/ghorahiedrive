'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { MapPin } from 'lucide-react';

export interface PublicCar {
  id: string;
  carNumber: string;
  from: string;
  to: string;
}

interface FleetSectionProps {
  cars?: PublicCar[];
}

export default function FleetSection({ cars = [] }: FleetSectionProps) {
  const count = cars.length;

  return (
    <section id="fleet" className="py-24 sm:py-28 bg-[#FFFFFF] relative overflow-hidden">
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-[#EAF7EC]/80 rounded-full filter blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="flex justify-start w-full"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white shine-container group w-full">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.5 }}
                className="relative w-full aspect-[16/10]"
              >
                <Image
                  src="/image/car2.jpeg"
                  alt="Dang E Drive electric fleet"
                  fill
                  className="object-cover object-center"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  style={{ objectPosition: '50% 50%' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B3D26]/40 via-transparent to-transparent opacity-60" />
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.15 }}
            className="space-y-6 text-left"
          >
            <span className="text-lg sm:text-xl font-extrabold text-[#4CAF50] tracking-[0.2em] uppercase block mb-2">
              OUR FLEET
            </span>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0F5A35] font-heading tracking-tight leading-snug">
              {count} Electric Taxi{count === 1 ? '' : 's'} on the Road
            </h2>

            <p className="text-[#64748B] text-base leading-relaxed">
              Our fleet is managed live by Dang E Drive. Vehicle count and routes update when
              the admin adds or edits cars in the portal.
            </p>

            {count > 0 ? (
              <ul className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {cars.map((car) => (
                  <li
                    key={car.id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-[#DCE7DD] bg-[#F8FAF8] px-3 py-2.5 text-sm"
                  >
                    <span className="font-bold text-[#0F5A35]">{car.carNumber}</span>
                    <span className="inline-flex items-center gap-1 text-[#64748B] text-xs">
                      <MapPin className="w-3.5 h-3.5 text-[#4CAF50]" />
                      {car.from} → {car.to}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-[#64748B]">Fleet details will appear once cars are added.</p>
            )}

            <div className="flex flex-wrap gap-3 pt-2">
              <span className="px-4 py-2 rounded-full bg-[#EAF7EC] text-[#0F5A35] text-sm font-semibold border border-[#DCE7DD]">
                Live fleet data
              </span>
              <span className="px-4 py-2 rounded-full bg-[#EAF7EC] text-[#0F5A35] text-sm font-semibold border border-[#DCE7DD]">
                {count} vehicles
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
