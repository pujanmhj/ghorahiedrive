'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LogIn, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Home', href: '/', sectionId: 'home' },
  { label: 'About', href: '/about', sectionId: 'about' },
  { label: 'Features', href: '/features', sectionId: 'features' },
  { label: 'Fleet', href: '/fleet', sectionId: 'fleet' },
  { label: 'Contact', href: '/contact', sectionId: 'contact' },
];

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const pathname = usePathname();
  const router = useRouter();

  // Scroll Shrink Effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection Observer for Scroll Spy (on main landing page)
  useEffect(() => {
    if (pathname !== '/') return;

    const sections = navItems.map((item) => document.getElementById(item.sectionId)).filter(Boolean);

    if (sections.length === 0) return;

    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    sections.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => {
      sections.forEach((section) => {
        if (section) observer.unobserve(section);
      });
    };
  }, [pathname]);

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setActiveSection('home');
    }
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, item: typeof navItems[0]) => {
    if (pathname === '/') {
      e.preventDefault();
      const el = document.getElementById(item.sectionId);
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
        setActiveSection(item.sectionId);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setActiveSection('home');
      }
    }
  };

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled
            ? 'py-2 px-2 sm:px-6'
            : 'py-3 px-2 sm:px-6'
        )}
      >
        <div
          className={cn(
            'max-w-7xl mx-auto rounded-2xl transition-all duration-300 glass-header px-4 sm:px-6 lg:px-8',
            isScrolled ? 'shadow-lg border-b border-[#DCE7DD]/80 py-1' : 'shadow-sm py-2'
          )}
        >
          <div
            className={cn(
              'flex items-center justify-between transition-all duration-300',
              isScrolled ? 'h-14 sm:h-16' : 'h-16 sm:h-18'
            )}
          >
            {/* Logo + Company Name */}
            <Link href="/" onClick={handleLogoClick} className="flex items-center gap-2 sm:gap-3 group">
              <motion.div
                whileHover={{ rotate: 3, scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                className="relative flex items-center"
              >
                <Image
                  src="/image/logo.png"
                  alt="Dang E Drive Logo"
                  width={120}
                  height={120}
                  className={cn(
                    'w-auto object-contain transition-all duration-300',
                    isScrolled ? 'max-h-10 sm:max-h-11' : 'max-h-11 sm:max-h-12'
                  )}
                  priority
                />
              </motion.div>
              
              {/* Company Name */}
              <span
                className={cn(
                  'hidden sm:block font-bold text-[#0B3D26] transition-all duration-300 whitespace-nowrap',
                  isScrolled ? 'text-sm' : 'text-base'
                )}
              >
                Dang E-Drive Pvt. Ltd.
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-2 lg:space-x-3 bg-[#EAF7EC]/50 p-1.5 rounded-full border border-[#DCE7DD]/60">
              {navItems.map((item) => {
                const isCurrentPage = pathname === item.href;
                const isCurrentSection = pathname === '/' && activeSection === item.sectionId;
                const isActive = pathname === '/' ? isCurrentSection : isCurrentPage;

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item)}
                    className={cn(
                      'relative text-sm transition-all duration-300 px-4 py-2 rounded-full flex items-center justify-center',
                      isActive
                        ? 'text-[#0B3D26] font-semibold bg-[#0F5A35]/10 shadow-sm'
                        : 'text-[#64748B] font-medium hover:text-[#0F5A35] hover:bg-white/60'
                    )}
                  >
                    <span className="relative z-10">{item.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeUnderline"
                        className="absolute bottom-1 left-3 right-3 h-0.5 bg-[#4CAF50] rounded-full"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Actions: Premium Green Gradient Login Button */}
            <div className="hidden md:flex items-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/signin"
                  className="group relative flex items-center space-x-2 btn-green-gradient text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <LogIn className="w-4 h-4 text-white/90" />
                  <span>Login</span>
                  <ArrowRight className="w-4 h-4 ml-1 transform transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </motion.div>
            </div>

            {/* Mobile Hamburger Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-[#0F5A35] hover:bg-[#EAF7EC] transition-colors"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed top-[90px] left-4 right-4 z-40 bg-[#FFFFFF]/95 backdrop-blur-xl border border-[#DCE7DD] rounded-2xl shadow-2xl md:hidden overflow-hidden"
          >
            <div className="px-4 pt-4 pb-6 space-y-3">
              {navItems.map((item) => {
                const isCurrentPage = pathname === item.href;
                const isCurrentSection = pathname === '/' && activeSection === item.sectionId;
                const isActive = pathname === '/' ? isCurrentSection : isCurrentPage;

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={(e) => {
                      setIsMobileMenuOpen(false);
                      handleNavClick(e, item);
                    }}
                    className={cn(
                      'block px-4 py-3 rounded-xl text-base font-semibold transition-all duration-300',
                      isActive
                        ? 'bg-[#EAF7EC] text-[#0B3D26] border-l-4 border-[#4CAF50] font-bold'
                        : 'text-[#64748B] hover:bg-[#F8FAF8] hover:text-[#0F5A35]'
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}

              <hr className="border-[#DCE7DD] my-4" />

              <div className="px-2">
                <Link
                  href="/signin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center space-x-2 btn-green-gradient text-white w-full py-3.5 rounded-xl font-bold text-center shadow-lg transition-all duration-300"
                >
                  <LogIn className="w-4 h-4 text-white" />
                  <span>Login</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
