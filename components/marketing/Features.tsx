'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, User, Car, Coins, Clock, Headset, Users, Map } from 'lucide-react';

const featureList = [
  {
    icon: <ShieldCheck className="w-6 h-6" />,
    title: 'Safe & Secure Travel',
    description: 'We prioritize your safety with GPS-tracked vehicles, emergency assistance, and vetted security protocols on every single trip.',
  },
  {
    icon: <User className="w-6 h-6" />,
    title: 'Professional Drivers',
    description: 'Our drivers are background-checked, licensed, and highly experienced professionals navigating Nepal\'s roads safely.',
  },
  {
    icon: <Car className="w-6 h-6" />,
    title: 'Comfortable Vehicles',
    description: 'Travel in modern, clean, fully air-conditioned taxis that are serviced regularly to ensure a smooth and relaxing journey.',
  },
  {
    icon: <Coins className="w-6 h-6" />,
    title: 'Affordable Prices',
    description: 'Enjoy premium transportation at highly competitive, transparent fixed rates with zero dynamic surge pricing.',
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: 'On-Time Service',
    description: 'Punctuality is our promise. We ensure prompt pickups and timely arrivals so that your schedule is never delayed.',
  },
  {
    icon: <Headset className="w-6 h-6" />,
    title: 'Friendly Customer Support',
    description: 'Our dedicated and friendly support team is available 24/7 to assist with custom routes, bookings, and emergency support.',
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: 'Family & Group Travel',
    description: 'Spacious vehicles (including 6-seaters) and tailored coordination for families, friends, and corporate groups.',
  },
  {
    icon: <Map className="w-6 h-6" />,
    title: 'Tour Packages Across Nepal',
    description: 'Customized tour packages connecting Dang with major hubs like Kathmandu, Pokhara, Butwal, Nepalgunj, and Chitwan.',
  },
];

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 35 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
} as const;

export default function Features() {
  return (
    <section id="features" className="py-24 sm:py-28 bg-[#F8FAF8] relative overflow-hidden bg-leaf-pattern">
      {/* Background ambient accents */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-[#EAF7EC]/60 rounded-full filter blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        {/* Title Section */}
        <div className="max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold text-[#4CAF50] tracking-widest uppercase block">
            WHY CHOOSE US
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F5A35] font-heading tracking-tight leading-tight">
            Key Features of Dang E Drive
          </h2>
          <p className="text-[#64748B] text-sm sm:text-base leading-relaxed">
            We aim to modernize transit and trip management in Nepal, focusing on safety, affordability, and streamlined operation.
          </p>
        </div>

        {/* Features Grid - Staggered Card Animation */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {featureList.map((feature, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.25 } }}
              className="bg-[#FFFFFF] rounded-3xl p-6 sm:p-7 border border-[#DCE7DD] shadow-sm hover:shadow-2xl hover:border-[#4CAF50] hover:bg-[#F7FBF6] transition-all duration-300 flex flex-col text-left group relative overflow-hidden"
            >
              {/* Corner Glow Accent */}
              <div className="absolute -top-10 -right-10 w-20 h-20 bg-[#4CAF50]/10 rounded-full group-hover:scale-150 transition-transform duration-500 pointer-events-none" />

              {/* Icon Container - Brightens and Scales on Hover */}
              <div className="w-13 h-13 rounded-2xl bg-[#EAF7EC] text-[#0F5A35] flex items-center justify-center mb-5 group-hover:bg-gradient-to-br group-hover:from-[#0F5A35] group-hover:to-[#4CAF50] group-hover:text-white group-hover:scale-110 transition-all duration-300 shrink-0 shadow-xs">
                {feature.icon}
              </div>

              {/* Title */}
              <h3 className="text-base font-bold text-[#1A1A1A] font-heading mb-2 group-hover:text-[#0F5A35] transition-colors duration-300">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-xs text-[#64748B] leading-relaxed font-normal">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
