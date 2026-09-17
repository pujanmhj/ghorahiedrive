'use client';

import { Navbar, Footer, SectionDivider } from '@/components/marketing';
import { motion } from 'framer-motion';
import { Target, Eye, ShieldCheck, Heart } from 'lucide-react';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <>
      <Navbar />
      
      <main className="flex-1 bg-[#F8FAF8]">
        {/* Top Section: About Section mirroring Homepage layout & dark green background */}
        <section className="pt-32 pb-24 bg-[#0B3D26] relative overflow-hidden text-white">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(76,175,80,0.18),transparent_65%)]" />
          <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-[#0F5A35]/30 rounded-full filter blur-3xl pointer-events-none" />

          {/* Decorative spheres stack */}
          <div className="absolute right-[6%] md:right-[10%] top-1/2 -translate-y-1/2 z-0 flex flex-col space-y-[-15px] pointer-events-none opacity-80 animate-pulse">
            <div className="w-14 h-14 rounded-full bg-[#4CAF50] shadow-lg shadow-[#4CAF50]/50" />
            <div className="w-11 h-11 rounded-full bg-white translate-x-3 shadow-lg" />
            <div className="w-9 h-9 rounded-full bg-[#0F5A35] translate-x-1 shadow-lg border border-white/20" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Left Column: Content */}
              <div className="lg:col-span-8 space-y-6 text-left">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="space-y-4"
                >
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading tracking-tight leading-tight">
                    About <span className="text-[#4CAF50]">Dang E Drive</span>
                  </h1>
                  
                  <p className="text-slate-200 text-sm sm:text-base leading-relaxed max-w-3xl font-normal pt-2">
                    Dang E-Drive Pvt. Ltd. is a trusted transportation company based in Tulsipur, Dang. We provide safe, comfortable, and reliable travel services across Nepal for individuals, families, businesses, and tourists. Our goal is to make every journey easy, affordable, and enjoyable.
                  </p>
                  
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-3xl font-normal">
                    We bridge the gap between Dang and major cities of Nepal including Kathmandu, Pokhara, Butwal, Nepalgunj, and Chitwan, operating a modern fleet with certified, background-checked professional drivers.
                  </p>
                </motion.div>
              </div>

            </div>
          </div>
        </section>

        {/* Section Wave Divider */}
        <SectionDivider variant="wave" fillColor="#FFFFFF" className="-mt-1 bg-[#0B3D26]" />

        {/* Lower Section: Mission, Vision & Values (White Background) */}
        <section className="py-20 sm:py-24 bg-[#FFFFFF]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              
              {/* Left Side: Nepal Travel & Transportation Imagery */}
              <div className="lg:col-span-5 relative flex justify-center items-center h-[380px] sm:h-[480px]">
                <div className="absolute w-[90%] h-[90%] rounded-[32px] border border-[#DCE7DD] bg-[#F8FAF8] -rotate-2 shadow-xs" />
                
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="relative w-[85%] h-[85%] rounded-2xl overflow-hidden shadow-xl border-4 border-white"
                >
                  <Image
                    src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80"
                    alt="Travel in Nepal"
                    fill
                    sizes="(max-width: 768px) 100vw, 40vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B3D26]/40 to-transparent" />
                </motion.div>
              </div>

              {/* Right Side: Mission & Vision Content */}
              <div className="lg:col-span-7 space-y-8 text-left">
                <div className="space-y-2">
                  <span className="text-xs font-bold text-[#4CAF50] tracking-widest uppercase block">
                    OUR CORE PRINCIPLES
                  </span>
                  <h2 className="text-3xl font-extrabold text-[#0F5A35] font-heading tracking-tight leading-tight">
                    Driving Excellence & Reliability
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {/* Mission Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    whileHover={{ y: -5 }}
                    className="bg-[#FFFFFF] p-6 rounded-3xl border border-[#DCE7DD] shadow-sm hover:shadow-lg hover:border-[#4CAF50] transition-all duration-300"
                  >
                    <div className="w-11 h-11 rounded-2xl bg-[#EAF7EC] text-[#0F5A35] flex items-center justify-center mb-4">
                      <Target className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-[#0F5A35] font-heading mb-2">Our Mission</h3>
                    <p className="text-xs text-[#64748B] leading-relaxed">
                      To provide safe, reliable, and affordable transportation with excellent customer service, making every trip smooth and comfortable.
                    </p>
                  </motion.div>

                  {/* Vision Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    whileHover={{ y: -5 }}
                    className="bg-[#FFFFFF] p-6 rounded-3xl border border-[#DCE7DD] shadow-sm hover:shadow-lg hover:border-[#4CAF50] transition-all duration-300"
                  >
                    <div className="w-11 h-11 rounded-2xl bg-[#EAF7EC] text-[#0F5A35] flex items-center justify-center mb-4">
                      <Eye className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-[#0F5A35] font-heading mb-2">Our Vision</h3>
                    <p className="text-xs text-[#64748B] leading-relaxed">
                      To become one of Nepal's most trusted transportation companies, recognized for standard pricing, safety, and customer satisfaction.
                    </p>
                  </motion.div>

                  {/* Values Checklist block */}
                  <div className="sm:col-span-2 space-y-4 pt-4 border-t border-[#DCE7DD]">
                    <h4 className="text-sm font-bold text-[#0F5A35] uppercase tracking-wider">Our Core Values</h4>
                    <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm text-[#1A1A1A]">
                      <div className="flex items-center space-x-2">
                        <ShieldCheck className="w-4 h-4 text-[#4CAF50]" />
                        <span className="font-medium">Uncompromised Safety</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Heart className="w-4 h-4 text-[#4CAF50]" />
                        <span className="font-medium">Honest Pricing</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <ShieldCheck className="w-4 h-4 text-[#4CAF50]" />
                        <span className="font-medium">Regular Fleet Maintenance</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Heart className="w-4 h-4 text-[#4CAF50]" />
                        <span className="font-medium">Customer-First Service</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
