'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import Image from 'next/image';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Please enter a valid email address.'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits.'),
  message: z.string().min(10, 'Message must be at least 10 characters.'),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function Contact() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  // Pre-fill message if query parameter has taxi number interest
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const taxi = params.get('taxi');
      if (taxi) {
        setValue('message', `Hello, I want to book Taxi: ${taxi} for a custom journey. Please get in touch.`);
      }
    }
  }, [setValue]);

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitError('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result?.error || 'Failed to send your request.');
      }

      setIsSuccess(true);
      reset();

      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setIsSuccess(false);
      }, 5000);
    } catch (err: any) {
      setSubmitError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 sm:py-28 bg-[#F8FAF8] relative overflow-hidden bg-leaf-pattern">
      {/* Visual background ambient accents */}
      <div className="absolute bottom-0 right-0 w-[450px] h-[450px] bg-[#EAF7EC] rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-[#4CAF50]/10 rounded-full filter blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-stretch"
        >
          
          {/* Left Column: Contact details card */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
            <div className="bg-[#FFFFFF] rounded-3xl p-8 border border-[#DCE7DD] shadow-sm space-y-8 flex-grow text-left">
              <h3 className="text-xl font-bold text-[#0F5A35] font-heading mb-4">
                Office Information
              </h3>
              
              <ul className="space-y-6">
                <li className="flex items-start group">
                  <div className="w-11 h-11 rounded-2xl bg-[#EAF7EC] text-[#0F5A35] flex items-center justify-center shrink-0 mr-4 group-hover:bg-[#0F5A35] group-hover:text-white transition-all duration-300 shadow-xs">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#1A1A1A]">Headquarters</h4>
                    <p className="text-sm text-[#64748B] mt-0.5">Ghorahi, Dang, Nepal</p>
                  </div>
                </li>

                <li className="flex items-start group">
                  <div className="w-11 h-11 rounded-2xl bg-[#EAF7EC] text-[#0F5A35] flex items-center justify-center shrink-0 mr-4 group-hover:bg-[#0F5A35] group-hover:text-white transition-all duration-300 shadow-xs">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#1A1A1A]">Hotline</h4>
                    <p className="text-sm text-[#64748B] mt-0.5 font-semibold">9857834200</p>
                  </div>
                </li>

                <li className="flex items-start group">
                  <div className="w-11 h-11 rounded-2xl bg-[#EAF7EC] text-[#0F5A35] flex items-center justify-center shrink-0 mr-4 group-hover:bg-[#0F5A35] group-hover:text-white transition-all duration-300 shadow-xs">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#1A1A1A]">Email Support</h4>
                    <p className="text-sm text-[#64748B] mt-0.5">ghorahiedrive@gmail.com</p>
                  </div>
                </li>

                <li className="flex items-start group">
                  <div className="w-11 h-11 rounded-2xl bg-[#EAF7EC] text-[#0F5A35] flex items-center justify-center shrink-0 mr-4 group-hover:bg-[#0F5A35] group-hover:text-white transition-all duration-300 shadow-xs">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#1A1A1A]">Office Hours</h4>
                    <p className="text-sm text-[#64748B] mt-0.5">9 AM - 6 PM</p>
                    <p className="text-xs text-[#4CAF50] font-bold mt-1.5 uppercase tracking-wider">
                      Taxi Booking Dispatch: Open 24/7
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Official Information Image */}
            <div className="rounded-3xl overflow-hidden border border-[#DCE7DD] shadow-sm group">
              <Image
                src="/image/official information.jpg"
                alt="Official Information"
                width={600}
                height={350}
                className="object-cover w-full h-auto transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </div>

          {/* Right Column: Contact form card with Floating Labels & Success Animation */}
          <div className="lg:col-span-7 bg-[#FFFFFF] rounded-3xl p-8 sm:p-10 border border-[#DCE7DD] shadow-md flex flex-col justify-between relative overflow-hidden text-left">
            <h3 className="text-xl font-bold text-[#0F5A35] font-heading mb-4">
              Send a Booking Request
            </h3>

            {/* Booking Request Image */}
            <div className="mb-6 rounded-2xl overflow-hidden border border-[#DCE7DD] shadow-xs">
              <Image
                src="/image/booking request.jpg"
                alt="Booking Request"
                width={700}
                height={300}
                className="object-cover w-full h-44 sm:h-52"
              />
            </div>

            <AnimatePresence mode="wait">
              {isSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex flex-col items-center justify-center text-center py-12 space-y-4 bg-[#EAF7EC]/50 rounded-2xl p-6 border border-[#4CAF50]/30"
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 220, damping: 15 }}
                    className="w-20 h-20 rounded-full bg-gradient-to-br from-[#0F5A35] to-[#4CAF50] text-white flex items-center justify-center shadow-lg"
                  >
                    <CheckCircle2 className="w-12 h-12" />
                  </motion.div>
                  <h4 className="text-2xl font-bold text-[#0F5A35] font-heading">Request Submitted!</h4>
                  <p className="text-sm text-[#64748B] max-w-sm font-medium">
                    Thank you for contacting Dang E Drive. Our operations desk will review your details and call you shortly to confirm your booking.
                  </p>
                  <button
                    onClick={() => setIsSuccess(false)}
                    className="text-xs font-bold text-[#4CAF50] hover:text-[#0F5A35] underline pt-2 transition-colors"
                  >
                    Send another request
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-6"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Name Input with Floating Label */}
                    <div className="space-y-1">
                      <div className="floating-input-group">
                        <input
                          id="name"
                          type="text"
                          placeholder=" "
                          {...register('name')}
                        />
                        <label htmlFor="name">Full Name</label>
                      </div>
                      {errors.name && (
                        <p className="text-xs text-[#DC2626] font-semibold flex items-center mt-1">
                          <AlertCircle className="w-3.5 h-3.5 mr-1 shrink-0" />
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    {/* Email Input with Floating Label */}
                    <div className="space-y-1">
                      <div className="floating-input-group">
                        <input
                          id="email"
                          type="email"
                          placeholder=" "
                          {...register('email')}
                        />
                        <label htmlFor="email">Email Address</label>
                      </div>
                      {errors.email && (
                        <p className="text-xs text-[#DC2626] font-semibold flex items-center mt-1">
                          <AlertCircle className="w-3.5 h-3.5 mr-1 shrink-0" />
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Phone Input with Floating Label */}
                  <div className="space-y-1">
                    <div className="floating-input-group">
                      <input
                        id="phone"
                        type="tel"
                        placeholder=" "
                        {...register('phone')}
                      />
                      <label htmlFor="phone">Phone Number</label>
                    </div>
                    {errors.phone && (
                      <p className="text-xs text-[#DC2626] font-semibold flex items-center mt-1">
                        <AlertCircle className="w-3.5 h-3.5 mr-1 shrink-0" />
                        {errors.phone.message}
                      </p>
                    )}
                  </div>

                  {/* Message Textarea with Floating Label */}
                  <div className="space-y-1">
                    <div className="floating-input-group">
                      <textarea
                        id="message"
                        rows={4}
                        placeholder=" "
                        {...register('message')}
                        className="resize-none"
                      />
                      <label htmlFor="message">Message / Booking Details</label>
                    </div>
                    {errors.message && (
                      <p className="text-xs text-[#DC2626] font-semibold flex items-center mt-1">
                        <AlertCircle className="w-3.5 h-3.5 mr-1 shrink-0" />
                        {errors.message.message}
                      </p>
                    )}
                  </div>

                  {/* Server error banner */}
                  {submitError && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 text-sm text-[#DC2626] font-semibold bg-red-50 border border-red-200 rounded-xl px-4 py-3"
                    >
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      {submitError}
                    </motion.div>
                  )}

                  {/* Submit Button with Gradient, Glow & Scale */}
                  <div className="pt-2">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.96 }}
                      type="submit"
                      disabled={isSubmitting}
                      className="group w-full flex items-center justify-center space-x-2 btn-green-gradient text-white py-4 rounded-xl text-sm font-bold shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          <span>Sending Request...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 text-white" />
                          <span>Submit Booking Request</span>
                          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                        </>
                      )}
                    </motion.button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

        </motion.div>
      </div>
    </section>
  );
}