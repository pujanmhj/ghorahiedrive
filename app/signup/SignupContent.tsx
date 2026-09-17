'use client';

import Link from 'next/link';
import { ArrowLeft, Car, ShieldCheck, Eye } from 'lucide-react';

export default function SignupContent() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-bg-custom to-accent/5 p-4 sm:p-6 relative overflow-hidden">
      <Link
        href="/"
        className="absolute top-6 left-6 inline-flex items-center space-x-2 text-sm font-semibold text-primary hover:text-primary-hover bg-white/80 backdrop-blur-sm px-4 py-2.5 rounded-xl border border-slate-100 shadow-sm transition-all hover:-translate-x-1"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </Link>

      <div className="w-full max-w-md bg-white rounded-[32px] border border-slate-100 shadow-2xl p-8 sm:p-10 relative z-10 text-center space-y-5">
        <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white shadow-md mx-auto">
          <Car className="w-6 h-6 text-accent" />
        </div>
        <h2 className="text-2xl font-extrabold text-primary font-heading">Accounts by Admin</h2>
        <p className="text-sm text-text-secondary leading-relaxed">
          New shareholder accounts are created by the portal admin. Contact admin for a login.
        </p>
        <div className="grid grid-cols-1 gap-3 text-left text-xs">
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 flex gap-3">
            <ShieldCheck className="w-4 h-4 text-accent shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-primary">Admin</p>
              <p className="text-text-secondary">Can add cars, edit routes, and enter daily revenue.</p>
            </div>
          </div>
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 flex gap-3">
            <Eye className="w-4 h-4 text-accent shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-primary">Shareholder</p>
              <p className="text-text-secondary">Can sign in and view cars, daily revenue, and monthly totals only.</p>
            </div>
          </div>
        </div>
        <Link
          href="/signin"
          className="inline-flex w-full items-center justify-center bg-primary hover:bg-primary-hover text-white py-3.5 rounded-xl text-sm font-bold transition-all"
        >
          Go to Sign In
        </Link>
      </div>
    </main>
  );
}
