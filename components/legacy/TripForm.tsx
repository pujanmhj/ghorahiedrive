'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { INITIAL_TAXIS } from './data';
import { Trip } from './types';
import { AlertCircle, Plus, Edit2, X } from 'lucide-react';

const tripSchema = z.object({
  taxiNumber: z.string().min(1, 'Please select a taxi vehicle.'),
  driverName: z.string().min(1, 'Driver name is required.'),
  from: z.string().min(1, 'Origin is required.'),
  destination: z.string().min(2, 'Destination must be at least 2 characters.'),
  amount: z.number().min(100, 'Fare must be at least 100 NPR.'),
  date: z.string().min(1, 'Please specify a trip date.'),
});

type TripFormData = z.infer<typeof tripSchema>;

interface TripFormProps {
  onSubmitTrip: (data: Omit<Trip, 'id' | 'status'> & { id?: string }) => void;
  editingTrip: Trip | null;
  onCancelEdit: () => void;
}

export default function TripForm({ onSubmitTrip, editingTrip, onCancelEdit }: TripFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<TripFormData>({
    resolver: zodResolver(tripSchema),
    defaultValues: {
      from: 'Dang',
      taxiNumber: '',
      driverName: '',
      destination: '',
      amount: 0,
      date: new Date().toISOString().split('T')[0], // default today
    },
  });

  const selectedTaxiNumber = watch('taxiNumber');

  // Auto-fill driver name when taxi selection changes
  useEffect(() => {
    if (selectedTaxiNumber) {
      const taxi = INITIAL_TAXIS.find((t) => t.number === selectedTaxiNumber);
      if (taxi) {
        setValue('driverName', taxi.driverName);
      }
    } else {
      setValue('driverName', '');
    }
  }, [selectedTaxiNumber, setValue]);

  // Load editing values if provided
  useEffect(() => {
    if (editingTrip) {
      reset({
        taxiNumber: editingTrip.taxiNumber,
        driverName: editingTrip.driverName,
        from: editingTrip.from,
        destination: editingTrip.destination,
        amount: editingTrip.amount,
        date: editingTrip.date,
      });
    } else {
      reset({
        from: 'Dang',
        taxiNumber: '',
        driverName: '',
        destination: '',
        amount: 0,
        date: new Date().toISOString().split('T')[0],
      });
    }
  }, [editingTrip, reset]);

  const handleFormSubmit = (data: TripFormData) => {
    onSubmitTrip({
      ...data,
      id: editingTrip?.id,
    });
    reset({
      from: 'Dang',
      taxiNumber: '',
      driverName: '',
      destination: '',
      amount: 0,
      date: new Date().toISOString().split('T')[0],
    });
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-base sm:text-lg font-bold text-primary font-heading flex items-center">
          {editingTrip ? (
            <>
              <Edit2 className="w-5 h-5 text-accent mr-2 shrink-0" />
              <span>Edit Trip Log</span>
            </>
          ) : (
            <>
              <Plus className="w-5 h-5 text-accent mr-2 shrink-0" />
              <span>Record New Taxi Trip</span>
            </>
          )}
        </h3>
        {editingTrip && (
          <button
            onClick={onCancelEdit}
            className="text-xs font-bold text-rose-500 hover:text-rose-600 flex items-center space-x-1 hover:underline"
          >
            <X className="w-4 h-4 shrink-0" />
            <span>Cancel Edit</span>
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4.5">
        
        {/* Dropdown Taxi Number */}
        <div className="space-y-1.5">
          <label htmlFor="taxiNumber" className="text-xs font-bold text-primary uppercase">
            Taxi Registration Number
          </label>
          <select
            id="taxiNumber"
            {...register('taxiNumber')}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"
          >
            <option value="">-- Choose from 10 Taxis --</option>
            {INITIAL_TAXIS.map((t) => (
              <option key={t.id} value={t.number}>
                {t.number} ({t.status})
              </option>
            ))}
          </select>
          {errors.taxiNumber && (
            <p className="text-xs text-danger font-semibold flex items-center mt-1">
              <AlertCircle className="w-3.5 h-3.5 mr-1 shrink-0" />
              {errors.taxiNumber.message}
            </p>
          )}
        </div>

        {/* Read-Only Driver Name */}
        <div className="space-y-1.5">
          <label htmlFor="driverName" className="text-xs font-bold text-primary uppercase">
            Assigned Driver Name
          </label>
          <input
            id="driverName"
            type="text"
            readOnly
            placeholder="Auto-filled on taxi selection"
            {...register('driverName')}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-100 bg-slate-50 text-slate-500 text-sm font-semibold select-none focus:outline-none"
          />
          {errors.driverName && (
            <p className="text-xs text-danger font-semibold flex items-center mt-1">
              <AlertCircle className="w-3.5 h-3.5 mr-1 shrink-0" />
              {errors.driverName.message}
            </p>
          )}
        </div>

        {/* Read-Only From (Dang) */}
        <div className="space-y-1.5">
          <label htmlFor="from" className="text-xs font-bold text-primary uppercase">
            Starting Point (From)
          </label>
          <input
            id="from"
            type="text"
            value="Dang"
            readOnly
            className="w-full px-4 py-2.5 rounded-xl border border-slate-100 bg-slate-50 text-slate-500 text-sm font-semibold select-none focus:outline-none"
          />
        </div>

        {/* Destination (Kathmandu, Pokhara, etc.) */}
        <div className="space-y-1.5">
          <label htmlFor="destination" className="text-xs font-bold text-primary uppercase">
            Destination Location (To)
          </label>
          <input
            id="destination"
            type="text"
            placeholder="e.g. Kathmandu, Butwal, Pokhara"
            {...register('destination')}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all"
          />
          {errors.destination && (
            <p className="text-xs text-danger font-semibold flex items-center mt-1">
              <AlertCircle className="w-3.5 h-3.5 mr-1 shrink-0" />
              {errors.destination.message}
            </p>
          )}
        </div>

        {/* Amount */}
        <div className="space-y-1.5">
          <label htmlFor="amount" className="text-xs font-bold text-primary uppercase">
            Fare Amount (NPR)
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-text-secondary">
              NPR
            </span>
            <input
              id="amount"
              type="number"
              placeholder="e.g. 15000"
              {...register('amount', { valueAsNumber: true })}
              className="w-full pl-14 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all"
            />
          </div>
          {errors.amount && (
            <p className="text-xs text-danger font-semibold flex items-center mt-1">
              <AlertCircle className="w-3.5 h-3.5 mr-1 shrink-0" />
              {errors.amount.message}
            </p>
          )}
        </div>

        {/* Date Picker */}
        <div className="space-y-1.5">
          <label htmlFor="date" className="text-xs font-bold text-primary uppercase">
            Trip Date
          </label>
          <input
            id="date"
            type="date"
            {...register('date')}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all cursor-pointer"
          />
          {errors.date && (
            <p className="text-xs text-danger font-semibold flex items-center mt-1">
              <AlertCircle className="w-3.5 h-3.5 mr-1 shrink-0" />
              {errors.date.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full flex items-center justify-center space-x-2 bg-primary hover:bg-primary-hover text-white py-3.5 rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>{editingTrip ? 'Update Trip Record' : 'Record Trip Log'}</span>
          </button>
        </div>

      </form>
    </div>
  );
}
