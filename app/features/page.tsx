'use client';

import { Navbar, Features, Footer, SectionDivider } from '@/components/marketing';
import { motion } from 'framer-motion';
import { CalendarPlus, ClipboardCheck, Car, Smile } from 'lucide-react';

const steps = [
  {
    step: '01',
    title: 'Book',
    description: 'Fill out our booking request form online or call our hotline to request your taxi.',
    icon: <CalendarPlus className="w-6 h-6 text-[#4CAF50]" />,
  },
  {
    step: '02',
    title: 'Confirm',
    description: 'Our dispatch team coordinates with the driver and calls you to confirm fares and scheduling.',
    icon: <ClipboardCheck className="w-6 h-6 text-[#4CAF50]" />,
  },
  {
    step: '03',
    title: 'Ride',
    description: 'Meet your vetted, professional driver in a regularly maintained, clean vehicle.',
    icon: <Car className="w-6 h-6 text-[#4CAF50]" />,
  },
  {
    step: '04',
    title: 'Enjoy',
    description: 'Relax in air-conditioned comfort while tracking your route to your final destination.',
    icon: <Smile className="w-6 h-6 text-[#4CAF50]" />,
  },
];

export default function FeaturesPage() {
  return (
    <>
      <Navbar />
      
      <main className="flex-1 bg-[#F8FAF8] pt-12">
        {/* Render the 8 features grid */}
        <Features />

        {/* Section Wave Divider */}
        <SectionDivider variant="wave" fillColor="#EAF7EC" className="-mb-1" />

        {/* How It Works Section */}
        <section className="py-24 sm:py-28 bg-[#EAF7EC]/60 relative overflow-hidden border-t border-[#DCE7DD]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            
            {/* Header */}
            <div className="max-w-3xl mx-auto mb-16 space-y-4">
              <span className="text-xs font-bold text-[#4CAF50] tracking-widest uppercase block">
                SIMPLE STEP PROCESS
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F5A35] font-heading tracking-tight">
                How It Works
              </h2>
              <p className="text-[#64748B] text-sm sm:text-base leading-relaxed">
                Modernizing regional travel in Nepal is easy. Follow these four simple steps for your next journey.
              </p>
            </div>

            {/* Steps Container */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-6 relative max-w-6xl mx-auto">
              
              {/* Connecting line for desktop */}
              <div className="hidden md:block absolute top-[44px] left-[12%] right-[12%] h-[2px] bg-[#DCE7DD] z-0" />

              {steps.map((step, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.15 }}
                  className="flex flex-col items-center relative z-10 text-center space-y-4 group"
                >
                  {/* Step Icon circle wrapper */}
                  <div className="w-20 h-20 rounded-full bg-[#FFFFFF] border-4 border-[#DCE7DD] flex items-center justify-center shadow-md relative group-hover:border-[#4CAF50] group-hover:scale-110 transition-all duration-300">
                    {/* Step Number Badge */}
                    <span className="absolute -top-1.5 -right-1.5 bg-[#0F5A35] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                      {step.step}
                    </span>
                    {step.icon}
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-[#0F5A35] font-heading">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-[#64748B] leading-relaxed max-w-[210px]">
                    {step.description}
                  </p>
                </motion.div>
              ))}

            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
