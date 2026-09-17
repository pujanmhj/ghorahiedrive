'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowRight, ShieldCheck, Star } from 'lucide-react';

export default function Hero() {
  const handleBookClick = () => {
    const el = document.getElementById('contact');
    if (el) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    } else {
      window.location.href = '/contact';
    }
  };

  return (
    <section id="home" className="relative min-h-[92vh] flex items-center pt-32 pb-20 overflow-hidden bg-leaf-pattern">
      {/* Soft Blurred Gradient Ambient Blobs */}
      <div className="absolute top-1/4 left-5 w-80 h-80 bg-[#4CAF50]/15 rounded-full filter blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-12 right-10 w-96 h-96 bg-[#0F5A35]/12 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute top-10 right-1/3 w-64 h-64 bg-[#D4A017]/10 rounded-full filter blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Text Column - Fade Up Reveal */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center space-x-2 bg-[#EAF7EC] border border-[#DCE7DD] px-4 py-1.5 rounded-full text-xs font-bold text-[#0F5A35] shadow-xs"
            >
              <ShieldCheck className="w-4 h-4 text-[#4CAF50]" />
              <span>Premium Electric Taxi Service Across Nepal</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#1A1A1A] leading-tight font-heading"
            >
              Your Trusted Ride <br />
              <span className="bg-gradient-to-r from-[#0F5A35] via-[#2E7D32] to-[#4CAF50] bg-clip-text text-transparent">
                Across Nepal
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg text-[#64748B] max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal"
            >
              Safe, comfortable, and reliable taxi services from Dang to Kathmandu, Pokhara, Butwal, Nepalgunj, and beyond.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleBookClick}
                className="group w-full sm:w-auto btn-green-gradient text-[#FFFFFF] font-bold px-8 py-4 rounded-xl shadow-lg flex items-center justify-center space-x-3 transition-all duration-300"
              >
                <span>Book Your Ride</span>
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1.5" />
              </motion.button>

              <div className="flex items-center space-x-3 px-4 py-2 bg-white/70 backdrop-blur-md rounded-xl border border-[#DCE7DD]">
                <div className="flex text-[#D4A017]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="text-xs font-bold text-[#1A1A1A]">4.9 Star Rated Service</span>
              </div>
            </motion.div>
          </div>

          {/* Right Image / Illustration Column with Continuous Floating Animation */}
          <div className="lg:col-span-6 relative flex justify-center items-center h-[440px] sm:h-[520px]">
            
            {/* Main Central Image Container with Continuous Floating */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{
                y: [0, -14, 0],
                opacity: 1,
              }}
              transition={{
                y: {
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                },
                opacity: { duration: 0.7, delay: 0.2 },
              }}
              className="relative w-[72%] h-[78%] rounded-3xl overflow-hidden shadow-2xl border-4 border-white z-10 group"
            >
              <Image
                src="/image/car.jpeg"
                alt="Dang E Drive Main Banner"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B3D26]/40 via-transparent to-transparent opacity-60" />
            </motion.div>

            {/* Corner Circular frames with Continuous Rotation & Subtle Scaling */}
            {/* Top-Left */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [1, 1.06, 1],
                rotate: [0, 6, 0, -6, 0],
                opacity: 1,
              }}
              transition={{
                scale: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
                rotate: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
                opacity: { duration: 0.5, delay: 0.4 },
              }}
              className="absolute top-2 left-[4%] z-20 w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-white shadow-xl overflow-hidden bg-white hover:scale-110 transition-transform"
            >
              <Image
                src="/image/a53b5bb313b0fcf187320d2d0250527c.jpg"
                alt="Corner image 1"
                fill
                sizes="80px"
                className="object-cover"
              />
            </motion.div>

            {/* Top-Right */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [1, 1.08, 1],
                rotate: [0, -6, 0, 6, 0],
                opacity: 1,
              }}
              transition={{
                scale: { duration: 4.5, repeat: Infinity, ease: 'easeInOut' },
                rotate: { duration: 5.5, repeat: Infinity, ease: 'easeInOut' },
                opacity: { duration: 0.5, delay: 0.5 },
              }}
              className="absolute top-2 right-[4%] z-20 w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-white shadow-xl overflow-hidden bg-white hover:scale-110 transition-transform"
            >
              <Image
                src="/image/86f9c56e7d122e524b5e9ffe7fa07f9c.jpg"
                alt="Corner image 2"
                fill
                sizes="80px"
                className="object-cover"
              />
            </motion.div>

            {/* Bottom-Left */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [1, 1.05, 1],
                rotate: [0, -5, 0, 5, 0],
                opacity: 1,
              }}
              transition={{
                scale: { duration: 5.2, repeat: Infinity, ease: 'easeInOut' },
                rotate: { duration: 6.2, repeat: Infinity, ease: 'easeInOut' },
                opacity: { duration: 0.5, delay: 0.6 },
              }}
              className="absolute bottom-2 left-[4%] z-20 w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-white shadow-xl overflow-hidden bg-white hover:scale-110 transition-transform"
            >
              <Image
                src="/image/f46eef08e76b365a8ce4b5c6bcf06db1.jpg"
                alt="Corner image 3"
                fill
                sizes="80px"
                className="object-cover"
              />
            </motion.div>

            {/* Bottom-Right */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [1, 1.07, 1],
                rotate: [0, 6, 0, -6, 0],
                opacity: 1,
              }}
              transition={{
                scale: { duration: 4.8, repeat: Infinity, ease: 'easeInOut' },
                rotate: { duration: 5.8, repeat: Infinity, ease: 'easeInOut' },
                opacity: { duration: 0.5, delay: 0.7 },
              }}
              className="absolute bottom-2 right-[4%] z-20 w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-white shadow-xl overflow-hidden bg-white hover:scale-110 transition-transform"
            >
              <Image
                src="/image/83c6f3cd0157feda89e199e4ae0ef2ad.webp"
                alt="Corner image 4"
                fill
                sizes="80px"
                className="object-cover"
              />
            </motion.div>

          </div>

        </div>
      </div>
    </section>
  );
}
