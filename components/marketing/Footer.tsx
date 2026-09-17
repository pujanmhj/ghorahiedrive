'use client';

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Car,
  Route,
  Mountain,
  Users,
  Briefcase,
} from "lucide-react";

import {
  FaFacebookF,
  FaInstagram,
  FaTiktok,
} from "react-icons/fa";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.8 }}
      className="bg-[#0B3D26] text-slate-200 border-t border-emerald-900/60 relative overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-10 w-96 h-96 bg-[#4CAF50]/10 rounded-full filter blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Column 1: Company Profile (Logo Only & Socials) */}
          <div className="space-y-4 flex flex-col items-start justify-center">
            <Link href="/" className="group relative w-36 h-36 block">
              <motion.div
                whileHover={{ rotate: 3, scale: 1.06 }}
                transition={{ type: 'spring', stiffness: 350, damping: 15 }}
                className="w-full h-full relative"
              >
                <Image
                  src="/image/logo.png"
                  alt="Dang E Drive Logo"
                  width={144}
                  height={144}
                  className="w-full h-full object-contain drop-shadow-md"
                />
              </motion.div>
            </Link>

            <div className="flex items-center space-x-3 pt-2">
              <motion.a
                whileHover={{ y: -4, scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                href="https://www.facebook.com/people/Dang-Edrive/61591551840786/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-[#4CAF50] hover:text-white flex items-center justify-center transition-all duration-300 text-slate-300 shadow-xs"
                aria-label="Facebook"
              >
                <FaFacebookF size={17} />
              </motion.a>

              <motion.a
                whileHover={{ y: -4, scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                href="https://www.instagram.com/edrivedang"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-[#4CAF50] hover:text-white flex items-center justify-center transition-all duration-300 text-slate-300 shadow-xs"
                aria-label="Instagram"
              >
                <FaInstagram size={17} />
              </motion.a>

              <motion.a
                whileHover={{ y: -4, scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                href="https://www.tiktok.com/@dang.edrive"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-[#4CAF50] hover:text-white flex items-center justify-center transition-all duration-300 text-slate-300 shadow-xs"
                aria-label="TikTok"
              >
                <FaTiktok size={17} />
              </motion.a>

              <motion.a
                whileHover={{ y: -4, scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                href="mailto:ghorahiedrive@gmail.com"
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-[#4CAF50] hover:text-white flex items-center justify-center transition-all duration-300 text-slate-300 shadow-xs"
                aria-label="Email"
              >
                <Mail size={17} />
              </motion.a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-white font-heading font-semibold text-base mb-6 relative after:content-[''] after:absolute after:bottom-[-8px] after:left-0 after:w-8 after:h-0.5 after:bg-[#4CAF50]">
              Quick Links
            </h4>
            <ul className="space-y-3.5 text-sm">
              <li>
                <Link href="/" className="hover:text-[#4CAF50] transition-colors flex items-center group">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4CAF50]/40 group-hover:bg-[#4CAF50] group-hover:w-3 mr-2 transition-all duration-300"></span>
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#4CAF50] transition-colors flex items-center group">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4CAF50]/40 group-hover:bg-[#4CAF50] group-hover:w-3 mr-2 transition-all duration-300"></span>
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/features" className="hover:text-[#4CAF50] transition-colors flex items-center group">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4CAF50]/40 group-hover:bg-[#4CAF50] group-hover:w-3 mr-2 transition-all duration-300"></span>
                  Key Features
                </Link>
              </li>
              <li>
                <Link href="/fleet" className="hover:text-[#4CAF50] transition-colors flex items-center group">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4CAF50]/40 group-hover:bg-[#4CAF50] group-hover:w-3 mr-2 transition-all duration-300"></span>
                  Our Fleet
                </Link>
              </li>
              <li>
                <Link href="/signin" className="hover:text-[#4CAF50] transition-colors flex items-center group">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4CAF50]/40 group-hover:bg-[#4CAF50] group-hover:w-3 mr-2 transition-all duration-300"></span>
                  Accountant Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Services */}
          <div>
            <h4 className="text-white font-heading font-semibold text-base mb-6 relative after:content-[''] after:absolute after:bottom-[-8px] after:left-0 after:w-8 after:h-0.5 after:bg-[#4CAF50]">
              Our Services
            </h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-center gap-3 text-slate-300 hover:text-white transition-colors">
                <Car className="w-4 h-4 text-[#4CAF50]" />
                <span>Local Transportation</span>
              </li>

              <li className="flex items-center gap-3 text-slate-300 hover:text-white transition-colors">
                <Route className="w-4 h-4 text-[#4CAF50]" />
                <span>Outstation Travel</span>
              </li>

              <li className="flex items-center gap-3 text-slate-300 hover:text-white transition-colors">
                <Mountain className="w-4 h-4 text-[#4CAF50]" />
                <span>Tour Packages</span>
              </li>

              <li className="flex items-center gap-3 text-slate-300 hover:text-white transition-colors">
                <Users className="w-4 h-4 text-[#4CAF50]" />
                <span>Family & Group Travel</span>
              </li>

              <li className="flex items-center gap-3 text-slate-300 hover:text-white transition-colors">
                <Briefcase className="w-4 h-4 text-[#4CAF50]" />
                <span>Business Travel</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div>
            <h4 className="text-white font-heading font-semibold text-base mb-6 relative after:content-[''] after:absolute after:bottom-[-8px] after:left-0 after:w-8 after:h-0.5 after:bg-[#4CAF50]">
              Get in Touch
            </h4>
            <ul className="space-y-4 text-sm text-slate-300">
              <li className="flex items-start">
                <MapPin className="w-4 h-4 text-[#4CAF50] mr-3 mt-0.5 shrink-0" />
                <span>Ghorahi, Dang, Nepal</span>
              </li>
              <li className="flex items-center">
                <Phone className="w-4 h-4 text-[#4CAF50] mr-3 shrink-0" />
                <a href="tel:9857834200" className="hover:text-white transition-colors">9857834200</a>
              </li>
              <li className="flex items-center">
                <Mail className="w-4 h-4 text-[#4CAF50] mr-3 shrink-0" />
                <a href="mailto:ghorahiedrive@gmail.com" className="hover:text-white transition-colors">ghorahiedrive@gmail.com</a>
              </li>
              <li className="flex items-start">
                <Clock className="w-4 h-4 text-[#4CAF50] mr-3 mt-0.5 shrink-0" />
                <div>
                  <p>Open 24/7 for rides</p>
                  <p className="text-xs text-slate-400">Office hours: 9 AM - 6 PM</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <hr className="border-emerald-900/60 my-10" />

        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 text-xs text-slate-400">
          <span>&copy; {currentYear} Dang E Drive P.V.T. Limited. All Rights Reserved.</span>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Sitemap</a>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
