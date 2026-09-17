'use client';

import { Navbar, Contact, Footer, SectionDivider } from '@/components/marketing';
import Image from 'next/image';
import { Share2 } from 'lucide-react';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function ContactPage() {
  return (
    <>
      <Navbar />
      
      <main className="flex-1 bg-[#F8FAF8] pt-12">
        
        {/* Contact Header Block */}
        <section className="bg-[#EAF7EC]/50 pt-28 pb-14 border-b border-[#DCE7DD] text-center relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 relative z-10">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl sm:text-5xl font-extrabold text-[#0F5A35] font-heading tracking-tight leading-tight"
            >
              Connect With Us
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-[#64748B] text-sm sm:text-base leading-relaxed font-normal max-w-xl mx-auto"
            >
              Get in touch with Dang E Drive. Reach out directly or fill out the booking form below, and we will get back to you immediately.
            </motion.p>

            {/* Contact Us Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex justify-center pt-2"
            >
              <div className="rounded-2xl overflow-hidden border border-[#DCE7DD] shadow-lg max-w-3xl w-full">
                <Image
                  src="/image/contact us.jpg"
                  alt="Contact Us"
                  width={900}
                  height={400}
                  className="object-cover w-full h-64 sm:h-80 hover:scale-105 transition-transform duration-500"
                  priority
                />
              </div>
            </motion.div>

            {/* Social Media Links */}
            <div className="flex items-center justify-center space-x-4 pt-4">
              <span className="text-xs font-bold text-[#0F5A35] uppercase tracking-wider flex items-center">
                <Share2 className="w-3.5 h-3.5 text-[#4CAF50] mr-1.5 shrink-0" />
                Follow Us:
              </span>
              <motion.a
                whileHover={{ y: -4, scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                href="https://www.facebook.com/people/Dang-Edrive/61591551840786/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#FFFFFF] border border-[#DCE7DD] text-[#0F5A35] hover:bg-[#0F5A35] hover:text-white flex items-center justify-center transition-all duration-300 shadow-xs"
                aria-label="Facebook"
              >
                <FaFacebook className="w-4 h-4" />
              </motion.a>
              <motion.a
                whileHover={{ y: -4, scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                href="#"
                className="w-10 h-10 rounded-full bg-[#FFFFFF] border border-[#DCE7DD] text-[#0F5A35] hover:bg-[#0F5A35] hover:text-white flex items-center justify-center transition-all duration-300 shadow-xs"
                aria-label="Twitter"
              >
                <FaTwitter className="w-4 h-4" />
              </motion.a>
              <motion.a
                whileHover={{ y: -4, scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                href="https://www.instagram.com/edrivedang"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#FFFFFF] border border-[#DCE7DD] text-[#0F5A35] hover:bg-[#0F5A35] hover:text-white flex items-center justify-center transition-all duration-300 shadow-xs"
                aria-label="Instagram"
              >
                <FaInstagram className="w-4 h-4" />
              </motion.a>
              <motion.a
                whileHover={{ y: -4, scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                href="https://www.tiktok.com/@dang.edrive"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#FFFFFF] border border-[#DCE7DD] text-[#0F5A35] hover:bg-[#0F5A35] hover:text-white flex items-center justify-center transition-all duration-300 shadow-xs"
                aria-label="YouTube"
              >
                <FaYoutube className="w-4 h-4" />
              </motion.a>
            </div>
          </div>
        </section>

        {/* Office Info & Form */}
        <Contact />

      </main>

      <Footer />
    </>
  );
}