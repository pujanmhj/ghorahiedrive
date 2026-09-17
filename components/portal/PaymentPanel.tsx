'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  CreditCard,
  Banknote,
  QrCode,
  Trash2,
  X,
  Plus,
  Coins,
  List,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  Pencil,
} from 'lucide-react';
import type { FleetCar, Payment, PaymentMethod, SessionUser } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';

interface PaymentPanelProps {
  user: SessionUser;
  cars: FleetCar[];
}

type MethodFilter = 'all' | PaymentMethod;

const METHOD_LABEL: Record<PaymentMethod, string> = {
  cash: 'Cash',
  qr_banking: 'QR / Banking',
};

const METHOD_STYLE: Record<PaymentMethod, string> = {
  cash: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  qr_banking: 'bg-violet-100 text-violet-700 border-violet-200',
};

const METHOD_ICON: Record<PaymentMethod, React.ReactNode> = {
  cash: <Banknote className="w-3.5 h-3.5" />,
  qr_banking: <QrCode className="w-3.5 h-3.5" />,
};

export default function PaymentPanel({ user, cars }: PaymentPanelProps) {
  const isAdmin = user.role === 'admin';
  const today = new Date().toISOString().slice(0, 10);

  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [methodFilter, setMethodFilter] = useState<MethodFilter>('all');
  const [carFilter, setCarFilter] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'byDate'>('list');
  const [expandedDates, setExpandedDates] = useState<Set<string>>(new Set());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    carId: '',
    date: today,
    amount: '',
    method: 'cash' as PaymentMethod,
    note: '',
  });

  const carMap = useMemo(() => Object.fromEntries(cars.map((c) => [c.id, c])), [cars]);

  const loadPayments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/payments', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setPayments(data.payments || []);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPayments();
  }, [loadPayments]);

  // Set default car
  useEffect(() => {
    if (!form.carId && cars[0]?.id) {
      setForm((f) => ({ ...f, carId: cars[0].id }));
    }
  }, [cars, form.carId]);

  const hasActiveFilters = methodFilter !== 'all' || carFilter !== '';

  const filtered = useMemo(() => {
    return payments.filter((p) => {
      if (methodFilter !== 'all' && p.method !== methodFilter) return false;
      if (carFilter && p.carId !== carFilter) return false;
      return true;
    });
  }, [payments, methodFilter, carFilter]);

  // Group by date for By Date view
  const byDate = useMemo(() => {
    const map = new Map<string, Payment[]>();
    payments.forEach((p) => {
      const existing = map.get(p.date) || [];
      map.set(p.date, [...existing, p]);
    });
    return Array.from(map.entries()).sort(([a], [b]) => b.localeCompare(a));
  }, [payments]);

  const toggleDate = (date: string) => {
    setExpandedDates((prev) => {
      const next = new Set(prev);
      if (next.has(date)) next.delete(date);
      else next.add(date);
      return next;
    });
  };

  const clearFilters = () => {
    setMethodFilter('all');
    setCarFilter('');
  };

  const totals = useMemo(() => {
    const cash = payments.filter((p) => p.method === 'cash').reduce((s, p) => s + p.amount, 0);
    const qr = payments.filter((p) => p.method === 'qr_banking').reduce((s, p) => s + p.amount, 0);
    return { cash, qr, grand: cash + qr };
  }, [payments]);

  const openAdd = () => {
    setEditingId(null);
    setForm({
      carId: cars[0]?.id || '',
      date: today,
      amount: '',
      method: 'cash',
      note: '',
    });
    setError(null);
    setShowForm(true);
  };

  const openEdit = (p: Payment) => {
    setEditingId(p.id);
    setForm({
      carId: p.carId,
      date: p.date,
      amount: String(p.amount),
      method: p.method,
      note: p.note || '',
    });
    setError(null);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;
    setSaving(true);
    setError(null);

    try {
      if (editingId) {
        const res = await fetch(`/api/payments/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            carId:  form.carId,
            date:   form.date,
            amount: Number(form.amount),
            method: form.method,
            note:   form.note,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to update payment');
      } else {
        const res = await fetch('/api/payments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            carId:  form.carId,
            date:   form.date,
            amount: Number(form.amount),
            method: form.method,
            note:   form.note,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to save payment');
      }
      setShowForm(false);
      setEditingId(null);
      await loadPayments();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!isAdmin) return;
    if (!window.confirm('Remove this payment record?')) return;
    const res = await fetch(`/api/payments/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const data = await res.json();
      alert(data.error || 'Delete failed');
      return;
    }
    await loadPayments();
  };

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-primary font-heading flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-accent" />
            Payment Records
          </h3>
          <p className="text-xs text-text-secondary mt-1">
            Track cash and QR/banking payments per gaadi
            {!isAdmin && ' · view only'}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {/* List / By Date toggle */}
          <div className="flex rounded-xl border border-slate-200 overflow-hidden bg-white">
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold transition-colors ${
                viewMode === 'list' ? 'bg-primary text-white' : 'text-slate-500 hover:text-primary'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              List
            </button>
            <button
              onClick={() => setViewMode('byDate')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold transition-colors ${
                viewMode === 'byDate' ? 'bg-primary text-white' : 'text-slate-500 hover:text-primary'
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5" />
              By Date
            </button>
          </div>

          {isAdmin && (
            <button
              onClick={openAdd}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary-hover shrink-0"
            >
              <Plus className="w-4 h-4" />
              Add Payment
            </button>
          )}
        </div>
      </div>

      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Grand total */}
        <div className="bg-gradient-to-br from-primary to-primary-hover rounded-2xl p-5 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full filter blur-xl pointer-events-none" />
          <p className="text-xs font-semibold text-white/70 uppercase tracking-wider">Total Collected</p>
          <p className="text-2xl font-black font-heading mt-1">{formatCurrency(totals.grand)}</p>
          <p className="text-xs text-white/60 mt-1">{payments.length} records</p>
        </div>

        {/* Cash */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center">
              <Banknote className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wide">Cash</span>
          </div>
          <p className="text-2xl font-black text-primary font-heading">{formatCurrency(totals.cash)}</p>
          <p className="text-[11px] text-text-secondary mt-1">
            {payments.filter((p) => p.method === 'cash').length} entries
          </p>
        </div>

        {/* QR / Banking */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-xl bg-violet-100 flex items-center justify-center">
              <QrCode className="w-4 h-4 text-violet-600" />
            </div>
            <span className="text-xs font-bold text-violet-700 uppercase tracking-wide">QR / Banking</span>
          </div>
          <p className="text-2xl font-black text-primary font-heading">{formatCurrency(totals.qr)}</p>
          <p className="text-[11px] text-text-secondary mt-1">
            {payments.filter((p) => p.method === 'qr_banking').length} entries
          </p>
        </div>
      </div>

      {/* ── Add Payment Form ── */}
      {showForm && isAdmin && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-extrabold text-primary uppercase tracking-wider">
              {editingId ? 'Edit Payment' : 'Add Payment'}
            </h4>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-slate-400 hover:text-primary"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {error && (
            <p className="text-xs font-bold text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
              {error}
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Car */}
            <div>
              <label className="text-xs font-bold text-primary uppercase">Car</label>
              <select
                required
                value={form.carId}
                onChange={(e) => setForm((f) => ({ ...f, carId: e.target.value }))}
                className="mt-1.5 w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none bg-white"
              >
                <option value="" disabled>Select car...</option>
                {cars.map((c) => (
                  <option key={c.id} value={c.id}>{c.carNumber}</option>
                ))}
              </select>
              {form.carId && (
                <p className="mt-1 text-[11px] text-text-secondary">
                  <span className="font-bold text-primary">{carMap[form.carId]?.carNumber}</span>
                </p>
              )}
            </div>

            {/* Date */}
            <div>
              <label className="text-xs font-bold text-primary uppercase">Date</label>
              <input
                type="date"
                required
                value={form.date}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                className="mt-1.5 w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none"
              />
            </div>

            {/* Amount */}
            <div>
              <label className="text-xs font-bold text-primary uppercase">Amount (NPR)</label>
              <input
                type="number"
                min="0"
                step="1"
                required
                value={form.amount}
                onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                placeholder="8500"
                className="mt-1.5 w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none"
              />
            </div>

            {/* Method */}
            <div>
              <label className="text-xs font-bold text-primary uppercase">Method</label>
              <select
                required
                value={form.method}
                onChange={(e) => setForm((f) => ({ ...f, method: e.target.value as PaymentMethod }))}
                className="mt-1.5 w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none bg-white"
              >
                <option value="cash">💵 Cash</option>
                <option value="qr_banking">📱 QR / Banking</option>
              </select>
            </div>

            {/* Note */}
            <div>
              <label className="text-xs font-bold text-primary uppercase">Note</label>
              <input
                value={form.note}
                onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
                placeholder="Optional"
                className="mt-1.5 w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving || cars.length === 0}
            className="px-5 py-2.5 rounded-xl bg-accent text-white text-sm font-bold hover:bg-accent-hover disabled:opacity-60"
          >
            {saving ? 'Saving...' : editingId ? 'Update Payment' : 'Save Payment'}
          </button>
        </form>
      )}

      {/* ── LIST VIEW ── */}
      {viewMode === 'list' && (
        <>
          {/* Filters — only in list mode */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Method tabs */}
            {(['all', 'cash', 'qr_banking'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMethodFilter(m)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                  methodFilter === m
                    ? 'bg-primary text-white border-primary shadow-sm'
                    : 'bg-white text-text-secondary border-slate-200 hover:border-primary/40 hover:text-primary'
                }`}
              >
                {m === 'all' ? 'All Payments' : METHOD_LABEL[m]}
              </button>
            ))}


            {/* Car */}
            <select
              value={carFilter}
              onChange={(e) => setCarFilter(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none bg-white"
            >
              <option value="">All cars</option>
              {cars.map((c) => (
                <option key={c.id} value={c.id}>{c.carNumber}</option>
              ))}
            </select>

            {/* Clear */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="px-4 py-2.5 rounded-xl border border-rose-200 text-rose-600 bg-white text-sm font-bold hover:bg-rose-50 transition-all"
              >
                Clear
              </button>
            )}
          </div>

          {/* Table */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            {loading ? (
              <div className="px-6 py-10 text-center text-text-secondary text-sm">Loading...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold text-primary uppercase">
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Car</th>
                      <th className="px-6 py-4">Amount</th>
                      <th className="px-6 py-4">Method</th>
                      <th className="px-6 py-4">Note</th>
                      {isAdmin && <th className="px-6 py-4">Actions</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 text-sm">
                    {filtered.map((p) => {
                      const car = carMap[p.carId];
                      return (
                        <tr key={p.id} className="hover:bg-slate-50/50">
                          <td className="px-6 py-3.5 whitespace-nowrap text-text-dark font-medium">
                            {p.date}
                          </td>
                          <td className="px-6 py-3.5 font-bold text-primary whitespace-nowrap">
                            {car?.carNumber || '—'}
                          </td>
                          <td className="px-6 py-3.5 font-bold text-primary whitespace-nowrap">
                            <span className="inline-flex items-center gap-1.5">
                              <Coins className="w-3.5 h-3.5 text-accent" />
                              {formatCurrency(p.amount)}
                            </span>
                          </td>
                          <td className="px-6 py-3.5 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-bold ${METHOD_STYLE[p.method]}`}
                            >
                              {METHOD_ICON[p.method]}
                              {METHOD_LABEL[p.method]}
                            </span>
                          </td>
                          <td className="px-6 py-3.5 text-text-secondary">{p.note || '—'}</td>
                          {isAdmin && (
                            <td className="px-6 py-3.5">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => openEdit(p)}
                                  className="p-2 rounded-lg border border-slate-200 text-primary hover:bg-slate-50"
                                >
                                  <Pencil className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDelete(p.id)}
                                  className="p-2 rounded-lg border border-rose-100 text-rose-600 hover:bg-rose-50"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          )}
                        </tr>
                      );
                    })}
                    {filtered.length === 0 && (
                      <tr>
                        <td
                          colSpan={isAdmin ? 6 : 5}
                          className="px-6 py-10 text-center text-text-secondary text-sm"
                        >
                          No payment records yet.
                          {isAdmin && (
                            <span className="block mt-1 text-xs">
                              Click &ldquo;Add Payment&rdquo; to record one.
                            </span>
                          )}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {/* ── BY DATE VIEW ── */}
      {viewMode === 'byDate' && (
        <div className="space-y-3">
          {loading && (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm px-6 py-10 text-center text-text-secondary text-sm">
              Loading...
            </div>
          )}
          {!loading && byDate.length === 0 && (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm px-6 py-10 text-center text-text-secondary text-sm">
              No payment records yet.
            </div>
          )}
          {byDate.map(([date, rows]) => {
            const dayTotal = rows.reduce((sum, p) => sum + p.amount, 0);
            const dayCash = rows.filter((p) => p.method === 'cash').reduce((s, p) => s + p.amount, 0);
            const dayQr   = rows.filter((p) => p.method === 'qr_banking').reduce((s, p) => s + p.amount, 0);
            const isExpanded = expandedDates.has(date);
            return (
              <div key={date} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                {/* Date header row — clickable */}
                <button
                  onClick={() => toggleDate(date)}
                  className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-50/70 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-accent shrink-0" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                    <div className="w-8 h-8 rounded-xl bg-primary/5 flex items-center justify-center shrink-0">
                      <CalendarDays className="w-4 h-4 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm font-extrabold text-primary">{date}</p>
                      <p className="text-xs text-text-secondary mt-0.5">
                        {rows.length} payment{rows.length !== 1 ? 's' : ''}
                        {dayCash > 0 && (
                          <span className="ml-2 text-emerald-600 font-semibold">
                            Cash {formatCurrency(dayCash)}
                          </span>
                        )}
                        {dayQr > 0 && (
                          <span className="ml-2 text-violet-600 font-semibold">
                            QR {formatCurrency(dayQr)}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-text-secondary font-semibold uppercase tracking-wide">Total</p>
                    <p className="text-base font-extrabold text-primary font-heading">
                      {formatCurrency(dayTotal)}
                    </p>
                  </div>
                </button>

                {/* Expanded detail table */}
                {isExpanded && (
                  <div className="border-t border-slate-100 overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 text-xs font-bold text-primary uppercase">
                          <th className="px-6 py-3">Car</th>
                          <th className="px-6 py-3">Amount</th>
                          <th className="px-6 py-3">Method</th>
                          <th className="px-6 py-3">Note</th>
                          {isAdmin && <th className="px-6 py-3">Actions</th>}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 text-sm">
                        {rows.map((p) => {
                          const car = carMap[p.carId];
                          return (
                            <tr key={p.id} className="hover:bg-slate-50/50">
                              <td className="px-6 py-3 font-bold text-primary whitespace-nowrap">
                                {car?.carNumber || '—'}
                              </td>
                              <td className="px-6 py-3 font-bold text-primary whitespace-nowrap">
                                <span className="inline-flex items-center gap-1.5">
                                  <Coins className="w-3.5 h-3.5 text-accent" />
                                  {formatCurrency(p.amount)}
                                </span>
                              </td>
                              <td className="px-6 py-3 whitespace-nowrap">
                                <span
                                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-bold ${METHOD_STYLE[p.method]}`}
                                >
                                  {METHOD_ICON[p.method]}
                                  {METHOD_LABEL[p.method]}
                                </span>
                              </td>
                              <td className="px-6 py-3 text-text-secondary">{p.note || '—'}</td>
                              {isAdmin && (
                                <td className="px-6 py-3">
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => openEdit(p)}
                                      className="p-2 rounded-lg border border-slate-200 text-primary hover:bg-slate-50"
                                    >
                                      <Pencil className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => handleDelete(p.id)}
                                      className="p-2 rounded-lg border border-rose-100 text-rose-600 hover:bg-rose-50"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </td>
                              )}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
