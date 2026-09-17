'use client';

import { LayoutDashboard, Car, Coins, CalendarRange, LogOut, X, Users, CreditCard } from 'lucide-react';
import Link from 'next/link';
import type { SessionUser } from '@/lib/types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  user: SessionUser;
  onLogout: () => void;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  isOpen,
  setIsOpen,
  user,
  onLogout,
}: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'cars', label: 'Cars', icon: <Car className="w-5 h-5" /> },
    { id: 'revenue', label: 'Daily Revenue', icon: <Coins className="w-5 h-5" /> },
    { id: 'monthly', label: 'Monthly Totals', icon: <CalendarRange className="w-5 h-5" /> },
    { id: 'payment', label: 'Payment', icon: <CreditCard className="w-5 h-5" /> },
    ...(user.role === 'admin'
      ? [{ id: 'users', label: 'Users', icon: <Users className="w-5 h-5" /> }]
      : []),
  ];

  const roleLabel = user.role === 'admin' ? 'Admin' : 'Shareholder';

  return (
    <>
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col w-64 bg-primary text-slate-200 border-r border-slate-800 transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800 shrink-0">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white">
              <Car className="w-5 h-5 text-accent animate-pulse" />
            </div>
            <span className="text-lg font-extrabold text-white font-heading tracking-tight">
              Dang E Drive{' '}
              <span className="text-accent font-normal text-xs block -mt-1 font-sans">{roleLabel} Portal</span>
            </span>
          </Link>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all ${
                  isActive
                    ? 'bg-accent text-white shadow-md shadow-accent/20'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800 shrink-0">
          <button
            onClick={onLogout}
            className="w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl text-sm font-bold text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
