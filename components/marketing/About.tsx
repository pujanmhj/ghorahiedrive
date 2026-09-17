'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import SectionDivider from './SectionDivider';

export default function About() {
  return (
    <section id="about" className="py-24 sm:py-28 bg-[#0B3D26] relative overflow-hidden text-white">
      {/* Decorative gradient overlay and light spots */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(76,175,80,0.18),transparent_65%)] pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-[#0F5A35]/30 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-[#D4A017]/10 rounded-full filter blur-3xl pointer-events-none" />

      {/* Decorative 3D Spheres stack on the right side */}
      <div className="absolute right-[6%] md:right-[10%] top-1/2 -translate-y-1/2 z-0 flex flex-col space-y-[-15px] pointer-events-none opacity-80 animate-pulse">
        <div className="w-14 h-14 rounded-full bg-[#4CAF50] shadow-lg shadow-[#4CAF50]/50" />
        <div className="w-11 h-11 rounded-full bg-[#FFFFFF] translate-x-3 shadow-lg shadow-white/30" />
        <div className="w-9 h-9 rounded-full bg-[#0F5A35] translate-x-1 shadow-lg shadow-[#0F5A35]/50 border border-white/20" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Image Slides from Left */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="relative w-full aspect-[16/10] rounded-3xl overflow-hidden shadow-2xl border-2 border-white/15 group"
          >
            <Image
              src="/image/car3.jpeg"
              alt="Dang E Drive Taxi"
              fill
              className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
              style={{ objectPosition: '50% 50%' }}
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B3D26]/70 via-transparent to-transparent" />
          </motion.div>

          {/* Right Column: Text Slides from Right */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.15 }}
            className="space-y-6 text-left"
          >
            <div className="space-y-4">
              <span className="text-xs font-bold text-[#4CAF50] tracking-widest uppercase block">
                WHO WE ARE
              </span>
              
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading tracking-tight leading-tight">
                About <span className="text-[#4CAF50]">Dang E Drive</span>
              </h2>
              
              <p className="text-slate-200 text-sm sm:text-base leading-relaxed font-normal pt-2">
                Dang E-Drive Pvt. Ltd. is a trusted transportation company based in Tulsipur, Dang. We provide safe, comfortable, and reliable travel services across Nepal for individuals, families, businesses, and tourists. Our goal is to make every journey easy, affordable, and enjoyable.
              </p>

              <div className="pt-4 grid grid-cols-2 gap-4 border-t border-white/10">
                <div>
                  <h4 className="text-2xl font-extrabold text-[#4CAF50] font-heading">100%</h4>
                  <p className="text-xs text-slate-300">Clean & Eco Electric SUV Fleet</p>
                </div>
                <div>
                  <h4 className="text-2xl font-extrabold text-[#D4A017] font-heading">24/7</h4>
                  <p className="text-xs text-slate-300">Continuous Journey Support</p>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}