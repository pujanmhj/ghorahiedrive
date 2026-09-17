'use client';

import { motion, useInView } from 'framer-motion';
import { ReactNode, useRef, useState, useEffect } from 'react';

interface StatCardProps {
  value: string;
  label: string;
  description: string;
  icon: ReactNode;
}

export default function StatCard({ value, label, description, icon }: StatCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    if (!isInView) return;

    // Check if value contains numbers to animate (e.g. "10 Active" -> count 0 to 10)
    const numberMatch = value.match(/\d+/);
    if (numberMatch) {
      const targetNumber = parseInt(numberMatch[0], 10);
      const prefix = value.substring(0, value.indexOf(numberMatch[0]));
      const suffix = value.substring(value.indexOf(numberMatch[0]) + numberMatch[0].length);

      let current = 0;
      const duration = 1200; // ms
      const steps = 24;
      const increment = targetNumber / steps;
      const stepTime = duration / steps;

      const timer = setInterval(() => {
        current += increment;
        if (current >= targetNumber) {
          setDisplayValue(`${prefix}${targetNumber}${suffix}`);
          clearInterval(timer);
        } else {
          setDisplayValue(`${prefix}${Math.floor(current)}${suffix}`);
        }
      }, stepTime);

      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.25 } }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-3xl p-6 sm:p-8 shadow-md hover:shadow-2xl border border-[#DCE7DD] hover:border-[#4CAF50] flex flex-col items-center text-center relative overflow-hidden group transition-all duration-300"
    >
      {/* Background radial accent glow */}
      <div className="absolute -top-12 -right-12 w-28 h-28 bg-[#4CAF50]/10 rounded-full group-hover:scale-175 group-hover:bg-[#4CAF50]/20 transition-all duration-500 pointer-events-none" />

      {/* Icon Circle with Scale on Hover */}
      <div className="w-14 h-14 rounded-2xl bg-[#EAF7EC] flex items-center justify-center text-[#0F5A35] mb-4 group-hover:bg-gradient-to-br group-hover:from-[#0F5A35] group-hover:to-[#4CAF50] group-hover:text-white group-hover:scale-110 transition-all duration-300 shadow-xs">
        {icon}
      </div>

      {/* Numerical value with count-up */}
      <h3 className="text-3xl sm:text-4xl font-extrabold text-[#0F5A35] font-heading tracking-tight mb-1 group-hover:text-[#2E7D32] transition-colors duration-300">
        {displayValue}
      </h3>

      {/* Label */}
      <p className="text-sm font-bold text-[#1A1A1A] mb-1">
        {label}
      </p>

      {/* Description */}
      <p className="text-xs text-[#64748B] leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
}
