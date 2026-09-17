'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Sidebar,
  Header,
  CarsPanel,
  RevenuePanel,
  MonthlyReport,
  ShareholdersPanel,
  PaymentPanel,
} from '@/components/portal';
import type { DailyRevenue, FleetCar, SessionUser } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { Car, Coins, CalendarRange, Eye, ShieldCheck, CreditCard } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState<SessionUser | null>(null);
  const [cars, setCars] = useState<FleetCar[]>([]);
  const [revenues, setRevenues] = useState<DailyRevenue[]>([]);
  const [loading, setLoading] = useState(true);
  const [monthTotal, setMonthTotal] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);

  const loadData = useCallback(async () => {
    const [carsRes, revRes, monthRes] = await Promise.all([
      fetch('/api/cars', { cache: 'no-store' }),
      fetch('/api/revenue', { cache: 'no-store' }),
      fetch(
        `/api/reports/monthly?year=${new Date().getFullYear()}&month=${new Date().getMonth() + 1}`,
        { cache: 'no-store' }
      ),
    ]);

    if (carsRes.ok) {
      const data = await carsRes.json();
      setCars(data.cars || []);
    }
    if (revRes.ok) {
      const data = await revRes.json();
      setRevenues(data.revenues || []);
    }
    if (monthRes.ok) {
      const data = await monthRes.json();
      setMonthTotal(data.grandTotal || 0);
    }
  }, []);

  const reloadAfterEdit = useCallback(async () => {
    await loadData();
    setRefreshKey((k) => k + 1);
  }, [loadData]);

  useEffect(() => {
    let cancelled = false;
    const boot = async () => {
      const meRes = await fetch('/api/auth/me', { cache: 'no-store' });
      if (!meRes.ok) {
        router.replace('/signin');
        return;
      }
      const meData = await meRes.json();
      if (cancelled) return;
      setUser(meData.user);
      await loadData();
      if (!cancelled) setLoading(false);
    };
    boot();
    return () => {
      cancelled = true;
    };
  }, [loadData, router]);

  // Live refresh so shareholders see admin updates without reloading
  useEffect(() => {
    if (!user) return;
    const timer = setInterval(() => {
      loadData();
    }, 20000);
    return () => clearInterval(timer);
  }, [user, loadData]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.replace('/signin');
  };

  const todayRevenue = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return revenues.filter((r) => r.date === today).reduce((sum, r) => sum + r.amount, 0);
  }, [revenues]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold text-text-secondary">Loading live portal...</p>
        </div>
      </div>
    );
  }

  const isAdmin = user.role === 'admin';

  return (
    <div className="min-h-screen flex bg-slate-50">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        user={user}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        <Header activeTab={activeTab} onMenuClick={() => setIsSidebarOpen(true)} user={user} />

        <main className="flex-1 p-6 sm:p-8 space-y-8 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              <div className="p-6 rounded-3xl bg-gradient-to-r from-primary to-primary-hover text-white shadow-md relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full filter blur-2xl pointer-events-none" />
                <div className="relative z-10 max-w-2xl">
                  <h2 className="text-xl sm:text-2xl font-bold font-heading">
                    Welcome, {user.name}
                  </h2>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {isAdmin
                      ? 'Fully dynamic portal: add cars, daily revenue, and shareholder logins. Website fleet count updates automatically.'
                      : 'Live view-only access. Numbers refresh automatically when the admin updates data.'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center shrink-0">
                    <Car className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-text-secondary">Total Cars</span>
                    <h3 className="text-2xl font-black text-primary font-heading leading-tight mt-0.5">
                      {cars.length}
                    </h3>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center shrink-0">
                    <Coins className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-text-secondary">Today&apos;s Revenue</span>
                    <h3 className="text-xl sm:text-2xl font-black text-primary font-heading leading-tight mt-0.5">
                      {formatCurrency(todayRevenue)}
                    </h3>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center shrink-0">
                    <CalendarRange className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-text-secondary">This Month Total</span>
                    <h3 className="text-xl sm:text-2xl font-black text-primary font-heading leading-tight mt-0.5">
                      {formatCurrency(monthTotal)}
                    </h3>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center shrink-0">
                    {isAdmin ? (
                      <ShieldCheck className="w-5 h-5 text-accent" />
                    ) : (
                      <Eye className="w-5 h-5 text-accent" />
                    )}
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-text-secondary">Your Access</span>
                    <h3 className="text-lg font-black text-primary font-heading leading-tight mt-0.5 capitalize">
                      {isAdmin ? 'Admin (Edit)' : 'Shareholder (View)'}
                    </h3>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                <button
                  onClick={() => setActiveTab('cars')}
                  className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm text-left hover:border-primary/30 transition-colors"
                >
                  <p className="text-sm font-bold text-primary">Cars & Routes</p>
                  <p className="text-xs text-text-secondary mt-1">
                    Plate number and from → to for each gaadi
                  </p>
                </button>
                <button
                  onClick={() => setActiveTab('revenue')}
                  className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm text-left hover:border-primary/30 transition-colors"
                >
                  <p className="text-sm font-bold text-primary">Daily Revenue</p>
                  <p className="text-xs text-text-secondary mt-1">
                    {isAdmin ? 'Add or edit daily collection amounts' : 'View daily collection amounts'}
                  </p>
                </button>
                <button
                  onClick={() => setActiveTab('monthly')}
                  className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm text-left hover:border-primary/30 transition-colors"
                >
                  <p className="text-sm font-bold text-primary">Monthly Totals</p>
                  <p className="text-xs text-text-secondary mt-1">
                    Month-end total for each car
                  </p>
                </button>
                <button
                  onClick={() => setActiveTab('payment')}
                  className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm text-left hover:border-primary/30 transition-colors"
                >
                  <p className="text-sm font-bold text-primary flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-accent" />
                    Payment
                  </p>
                  <p className="text-xs text-text-secondary mt-1">
                    Track Cash, QR & Banking payments
                  </p>
                </button>
              </div>

              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                  <h4 className="text-sm font-extrabold text-primary uppercase tracking-wider">
                    Recent Daily Entries
                  </h4>
                  <button
                    onClick={() => setActiveTab('revenue')}
                    className="text-xs font-bold text-accent hover:underline"
                  >
                    View all
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50 text-xs font-bold text-primary uppercase">
                        <th className="px-6 py-3">Date</th>
                        <th className="px-6 py-3">Car</th>
                        <th className="px-6 py-3">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 text-sm">
                      {revenues.slice(0, 8).map((row) => {
                        const car = cars.find((c) => c.id === row.carId);
                        return (
                          <tr key={row.id}>
                            <td className="px-6 py-3 text-text-dark">{row.date}</td>
                            <td className="px-6 py-3 font-bold text-primary">
                              {car?.carNumber || '—'}
                            </td>
                            <td className="px-6 py-3 font-semibold text-primary">
                              {formatCurrency(row.amount)}
                            </td>
                          </tr>
                        );
                      })}
                      {revenues.length === 0 && (
                        <tr>
                          <td colSpan={3} className="px-6 py-8 text-center text-text-secondary text-sm">
                            No revenue logged yet. Admin can add daily amounts.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'cars' && (
            <CarsPanel user={user} cars={cars} onChanged={reloadAfterEdit} />
          )}

          {activeTab === 'revenue' && (
            <RevenuePanel user={user} cars={cars} revenues={revenues} onChanged={reloadAfterEdit} />
          )}

          {activeTab === 'monthly' && <MonthlyReport refreshKey={refreshKey} />}

          {activeTab === 'users' && <ShareholdersPanel user={user} />}

          {activeTab === 'payment' && (
            <PaymentPanel user={user} cars={cars} />
          )}
        </main>
      </div>
    </div>
  );
}
