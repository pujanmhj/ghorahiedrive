'use client';

import { Menu, Bell } from 'lucide-react';
import type { SessionUser } from '@/lib/types';

interface HeaderProps {
  activeTab: string;
  onMenuClick: () => void;
  user: SessionUser;
}

export default function Header({ activeTab, onMenuClick, user }: HeaderProps) {
  const getTabTitle = (tab: string) => {
    switch (tab) {
      case 'dashboard':
        return 'Overview';
      case 'cars':
        return 'Cars';
      case 'revenue':
        return 'Daily Revenue';
      case 'monthly':
        return 'Monthly Totals';
      case 'users':
        return 'Users & Shareholders';
      default:
        return 'Portal';
    }
  };

  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const initials = user.name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="sticky top-0 right-0 z-30 flex items-center justify-between h-20 px-6 sm:px-8 bg-white border-b border-slate-100 shadow-sm shrink-0">
      <div className="flex items-center space-x-4">
        <button
          onClick={onMenuClick}
          className="p-2 -ml-2 rounded-xl text-primary hover:bg-slate-50 lg:hidden shrink-0"
          aria-label="Open Sidebar"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div>
          <h1 className="text-lg sm:text-xl font-extrabold text-primary font-heading tracking-tight capitalize">
            {getTabTitle(activeTab)}
          </h1>
          <p className="text-[11px] text-text-secondary font-medium hidden sm:block">{formattedDate}</p>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button className="relative p-2 text-text-secondary hover:text-primary hover:bg-slate-50 rounded-xl transition-colors shrink-0">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-accent rounded-full" />
        </button>

        <div className="h-6 w-px bg-slate-100 hidden sm:block" />

        <div className="flex items-center space-x-3 text-left">
          <div className="w-10 h-10 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center text-primary shrink-0 font-bold text-xs">
            {initials}
          </div>
          <div className="hidden md:block">
            <p className="text-xs font-bold text-primary leading-none">{user.name}</p>
            <span className="text-[10px] text-success font-semibold inline-flex items-center mt-0.5 capitalize">
              <span className="w-1.5 h-1.5 rounded-full bg-success mr-1 animate-pulse" />
              {user.role}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
