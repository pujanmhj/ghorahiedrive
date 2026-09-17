'use client';

import { Taxi } from './types';
import { motion } from 'framer-motion';
import { Star, Users, Wind, CheckCircle2, AlertCircle, AlertTriangle, Phone } from 'lucide-react';
import Image from 'next/image';

interface TaxiCardProps {
  taxi: Taxi;
  onBookClick?: (taxiNumber: string) => void;
}

export default function TaxiCard({ taxi, onBookClick }: TaxiCardProps) {
  const getStatusDetails = (status: Taxi['status']) => {
    switch (status) {
      case 'Available':
        return {
          bg: 'bg-[#F4F9F3] text-[#53813A] border-[#53813A]/20',
          icon: <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-[#53813A]" />,
          label: 'Available',
        };
      case 'On Trip':
        return {
          bg: 'bg-[#FFF9EB] text-[#F59E0B] border-[#F59E0B]/20',
          icon: <AlertCircle className="w-3.5 h-3.5 mr-1 text-[#F59E0B] animate-pulse" />,
          label: 'On Trip',
        };
      case 'Maintenance':
        return {
          bg: 'bg-rose-50 text-rose-700 border-rose-200',
          icon: <AlertTriangle className="w-3.5 h-3.5 mr-1 text-rose-600" />,
          label: 'Maintenance',
        };
      default:
        return {
          bg: 'bg-slate-50 text-slate-700 border-slate-200',
          icon: null,
          label: status,
        };
    }
  };

  const status = getStatusDetails(taxi.status);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      whileHover={{ y: -6, transition: { duration: 0.3 } }}
      transition={{ duration: 0.5 }}
      className="bg-[#FFFFFF] rounded-3xl overflow-hidden border border-[#E5E7EB] shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full group"
    >
      {/* Vehicle Image Container */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100 shrink-0">
        <Image
          src={taxi.image}
          alt={`Taxi ${taxi.number}`}
          fill
          sizes="(max-w-768px) 100vw, 30vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Absolute Status Badge overlay */}
        <div className="absolute top-4 left-4 z-10">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-sm ${status.bg}`}>
            {status.icon}
            {status.label}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6 flex flex-col justify-between flex-grow">
        <div className="space-y-3">
          {/* Header row: Model Name & Rating */}
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-bold text-[#093F1F] font-heading tracking-tight leading-tight">
                {taxi.model || 'Premium Taxi'}
              </h3>
              <p className="text-[11px] font-semibold text-[#53813A] uppercase tracking-wider mt-0.5">{taxi.number}</p>
            </div>
            <div className="flex items-center space-x-1 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-100 shrink-0">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500 shrink-0" />
              <span className="text-xs font-bold text-amber-700">{taxi.rating.toFixed(1)}</span>
            </div>
          </div>

          {/* Driver name */}
          <div className="flex items-center justify-between text-xs text-[#333333]">
            <span>Driver Name</span>
            <span className="font-bold text-[#093F1F]">{taxi.driverName}</span>
          </div>

          {/* Quick Specifications */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-50">
            <div className="flex items-center space-x-2 bg-slate-50 p-2 rounded-xl border border-slate-100">
              <Users className="w-4 h-4 text-[#53813A] shrink-0" />
              <span className="text-xs text-[#333333] font-medium">{taxi.seats} Seats</span>
            </div>
            <div className="flex items-center space-x-2 bg-slate-50 p-2 rounded-xl border border-slate-100">
              <Wind className="w-4 h-4 text-[#53813A] shrink-0" />
              <span className="text-xs text-[#333333] font-medium">{taxi.hasAC ? 'AC Active' : 'No AC'}</span>
            </div>
          </div>
        </div>

        {/* Action button */}
        <div className="pt-5 mt-auto">
          <button
            onClick={() => onBookClick && onBookClick(taxi.number)}
            disabled={taxi.status === 'Maintenance'}
            className={`w-full flex items-center justify-center space-x-2 py-3 rounded-xl text-sm font-bold shadow-sm transition-all duration-200 ${
              taxi.status === 'Maintenance'
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                : 'bg-[#53813A] hover:bg-[#093F1F] text-white hover:-translate-y-0.5 hover:shadow-md'
            }`}
          >
            {taxi.status === 'Maintenance' ? (
              <span>Under Maintenance</span>
            ) : (
              <>
                <Phone className="w-4 h-4 text-white shrink-0" />
                <span>Book Now</span>
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
