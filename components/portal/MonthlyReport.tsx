'use client';

import { useEffect, useState } from 'react';
import { CalendarDays, Coins } from 'lucide-react';
import type { MonthlyCarTotal } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';

export default function MonthlyReport({ refreshKey = 0 }: { refreshKey?: number }) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [totals, setTotals] = useState<MonthlyCarTotal[]>([]);
  const [grandTotal, setGrandTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/reports/monthly?year=${year}&month=${month}`, {
          cache: 'no-store',
        });
        const data = await res.json();
        if (!cancelled && res.ok) {
          setTotals(data.totals || []);
          setGrandTotal(data.grandTotal || 0);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [year, month, refreshKey]);

  const monthLabel = new Date(year, month - 1, 1).toLocaleString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-primary font-heading">Monthly Totals</h3>
          <p className="text-xs text-text-secondary mt-1">
            Each gaadi ka total amount for {monthLabel}
          </p>
        </div>
        <div className="flex gap-3">
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none"
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <option key={m} value={m}>
                {new Date(2000, m - 1, 1).toLocaleString('en-US', { month: 'long' })}
              </option>
            ))}
          </select>
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none"
          >
            {[now.getFullYear() - 1, now.getFullYear(), now.getFullYear() + 1].map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/5 text-primary flex items-center justify-center">
            <CalendarDays className="w-5 h-5 text-accent" />
          </div>
          <div>
            <span className="text-xs font-semibold text-text-secondary">Selected Month</span>
            <h4 className="text-xl font-black text-primary font-heading">{monthLabel}</h4>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/5 text-primary flex items-center justify-center">
            <Coins className="w-5 h-5 text-accent" />
          </div>
          <div>
            <span className="text-xs font-semibold text-text-secondary">Fleet Grand Total</span>
            <h4 className="text-xl font-black text-primary font-heading">{formatCurrency(grandTotal)}</h4>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold text-primary uppercase">
                <th className="px-6 py-4">Car Number</th>
                <th className="px-6 py-4">Days Logged</th>
                <th className="px-6 py-4">Month Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-text-secondary">
                    Loading monthly totals...
                  </td>
                </tr>
              ) : (
                totals.map((row) => (
                  <tr key={row.carId} className="hover:bg-slate-50/50">
                    <td className="px-6 py-3.5 font-bold text-primary whitespace-nowrap">{row.carNumber}</td>
                    <td className="px-6 py-3.5 text-text-dark">{row.daysLogged}</td>
                    <td className="px-6 py-3.5 font-black text-primary whitespace-nowrap">
                      {formatCurrency(row.totalAmount)}
                    </td>
                  </tr>
                ))
              )}
              {!loading && totals.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-10 text-center text-text-secondary text-sm">
                    No cars available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
