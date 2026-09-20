'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import type { FleetCar, SessionUser } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { Plus, Receipt, Calendar, AlertCircle, CalendarDays, CalendarRange, X, Car, Pencil, Trash2 } from 'lucide-react';

interface ExpenseRecord {
  id: string;
  billNumber: string;
  expenseName: string;
  amount: number;
  date: string;
  carId: string;
}

interface ExpensesPanelProps {
  user: SessionUser;
  cars: FleetCar[];
  onChanged?: () => void;
}

export default function ExpensesPanel({ user, cars, onChanged }: ExpensesPanelProps) {
  const isAdmin = user.role === 'admin';

  const [expenses, setExpenses] = useState<ExpenseRecord[]>([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  
  const [selectedCarForSummary, setSelectedCarForSummary] = useState<FleetCar | null>(null);
  const [editingExpense, setEditingExpense] = useState<ExpenseRecord | null>(null);
  const [fetching, setFetching] = useState(true);

  const [formData, setFormData] = useState({
    billNumber: '',
    expenseName: '',
    amount: '',
    date: new Date().toISOString().slice(0, 10),
    carId: cars[0]?.id || '',
  });

  const [editFormData, setEditFormData] = useState({
    id: '',
    billNumber: '',
    expenseName: '',
    amount: '',
    date: '',
    carId: '',
  });

  const [loading, setLoading] = useState(false);

  const fetchExpenses = useCallback(async () => {
    try {
      const res = await fetch('/api/expenses', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setExpenses(data.expenses || []);
      }
    } catch (err) {
      console.error('Failed to fetch expenses', err);
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.expenseName || !formData.amount || !formData.date) return;

    setLoading(true);
    try {
      const res = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setFormData({
          billNumber: '',
          expenseName: '',
          amount: '',
          date: new Date().toISOString().slice(0, 10),
          carId: cars[0]?.id || '',
        });
        await fetchExpenses();
        if (onChanged) onChanged();
      }
    } catch (err) {
      console.error('Failed to save expense', err);
    } finally {
      setLoading(false);
    }
  };

  // 🟢 Edit handler
  const handleEditOpen = (item: ExpenseRecord) => {
    setEditingExpense(item);
    setEditFormData({
      id: item.id,
      billNumber: item.billNumber,
      expenseName: item.expenseName,
      amount: String(item.amount),
      date: item.date,
      carId: item.carId,
    });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/expenses', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editFormData),
      });

      if (res.ok) {
        setEditingExpense(null);
        await fetchExpenses();
        if (onChanged) onChanged();
      }
    } catch (err) {
      console.error('Failed to update expense', err);
    } finally {
      setLoading(false);
    }
  };

  // 🟢 Delete handler
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this expense record?')) return;

    try {
      const res = await fetch(`/api/expenses?id=${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        await fetchExpenses();
        if (onChanged) onChanged();
      }
    } catch (err) {
      console.error('Failed to delete expense', err);
    }
  };

  // Calculations
  const dailyTotal = useMemo(() => {
    return expenses
      .filter((item) => item.date === selectedDate)
      .reduce((sum, item) => sum + item.amount, 0);
  }, [expenses, selectedDate]);

  const weeklyTotal = useMemo(() => {
    const targetDate = new Date(selectedDate);
    const startOfWeek = new Date(targetDate);
    startOfWeek.setDate(targetDate.getDate() - 6);

    return expenses
      .filter((item) => {
        const itemDate = new Date(item.date);
        return itemDate >= startOfWeek && itemDate <= targetDate;
      })
      .reduce((sum, item) => sum + item.amount, 0);
  }, [expenses, selectedDate]);

  const selectedMonth = selectedDate.slice(0, 7);
  const monthlyTotal = useMemo(() => {
    return expenses
      .filter((item) => item.date.startsWith(selectedMonth))
      .reduce((sum, item) => sum + item.amount, 0);
  }, [expenses, selectedMonth]);

  const filteredExpenses = useMemo(() => {
    return expenses.filter((item) => item.date.startsWith(selectedMonth));
  }, [expenses, selectedMonth]);

  const carSummaryData = useMemo(() => {
    if (!selectedCarForSummary) return null;

    const carExpenses = expenses.filter(e => e.carId === selectedCarForSummary.id);

    const daily = carExpenses
      .filter(e => e.date === selectedDate)
      .reduce((s, e) => s + e.amount, 0);

    const targetDate = new Date(selectedDate);
    const startOfWeek = new Date(targetDate);
    startOfWeek.setDate(targetDate.getDate() - 6);
    const weekly = carExpenses
      .filter(e => {
        const d = new Date(e.date);
        return d >= startOfWeek && d <= targetDate;
      })
      .reduce((s, e) => s + e.amount, 0);

    const monthly = carExpenses
      .filter(e => e.date.startsWith(selectedMonth))
      .reduce((s, e) => s + e.amount, 0);

    const selectedYear = selectedDate.slice(0, 4);
    const yearly = carExpenses
      .filter(e => e.date.startsWith(selectedYear))
      .reduce((s, e) => s + e.amount, 0);

    const totalAllTime = carExpenses.reduce((s, e) => s + e.amount, 0);

    return {
      daily,
      weekly,
      monthly,
      yearly,
      totalAllTime,
      records: carExpenses.sort((a, b) => b.date.localeCompare(a.date))
    };
  }, [selectedCarForSummary, expenses, selectedDate, selectedMonth]);

  return (
    <div className="space-y-8">
      {/* Date Picker Bar */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-4">
          <span className="text-sm font-bold text-primary">Date:</span>
          <div className="flex items-center space-x-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
            <Calendar className="w-4 h-4 text-slate-500" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent text-sm font-bold text-primary focus:outline-none cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center shrink-0">
            <CalendarDays className="w-6 h-6 text-amber-500" />
          </div>
          <div>
            <span className="text-xs font-semibold text-text-secondary">Daily Expense</span>
            <h3 className="text-xl font-black text-primary font-heading leading-tight mt-0.5">
              {formatCurrency(dailyTotal)}
            </h3>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0">
            <CalendarRange className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <span className="text-xs font-semibold text-text-secondary">7 Days Total</span>
            <h3 className="text-xl font-black text-primary font-heading leading-tight mt-0.5">
              {formatCurrency(weeklyTotal)}
            </h3>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center shrink-0">
            <Receipt className="w-6 h-6 text-rose-500" />
          </div>
          <div>
            <span className="text-xs font-semibold text-text-secondary">Monthly Total</span>
            <h3 className="text-xl font-black text-primary font-heading leading-tight mt-0.5">
              {formatCurrency(monthlyTotal)}
            </h3>
          </div>
        </div>
      </div>

      {/* Add Form */}
      {isAdmin && (
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-primary flex items-center gap-2">
            <Plus className="w-5 h-5 text-accent" />
            Add Expense Bill
          </h3>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-xs font-bold text-text-secondary mb-1">Expense Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Mobil, Fuel, Servicing"
                value={formData.expenseName}
                onChange={(e) => setFormData({ ...formData, expenseName: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-text-secondary mb-1">Bill Number</label>
              <input
                type="text"
                placeholder="e.g. BIL-102"
                value={formData.billNumber}
                onChange={(e) => setFormData({ ...formData, billNumber: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-text-secondary mb-1">Amount (Rs.) *</label>
              <input
                type="number"
                required
                placeholder="e.g. 2500"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-text-secondary mb-1">Date *</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-text-secondary mb-1">Select Car</label>
              <select
                value={formData.carId}
                onChange={(e) => setFormData({ ...formData, carId: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20"
              >
                {cars.map((car) => (
                  <option key={car.id} value={car.id}>
                    {car.carNumber}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2 lg:col-span-5 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="bg-primary hover:bg-primary-hover text-white font-bold py-2.5 px-6 rounded-xl text-sm transition-colors disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Expense Bill'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table with Action Column */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h4 className="text-sm font-extrabold text-primary uppercase tracking-wider">
            Expenses Records ({selectedMonth})
          </h4>
          <span className="text-xs text-slate-400 font-semibold">{filteredExpenses.length} Records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-xs font-bold text-primary uppercase">
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Bill No.</th>
                <th className="px-6 py-3">Expense Name</th>
                <th className="px-6 py-3">Car (Click to View Expense)</th>
                <th className="px-6 py-3">Amount</th>
                {isAdmin && <th className="px-6 py-3 text-right">Action</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm">
              {filteredExpenses.map((row) => {
                const car = cars.find((c) => c.id === row.carId);
                return (
                  <tr key={row.id}>
                    <td className="px-6 py-3 text-text-dark">{row.date}</td>
                    <td className="px-6 py-3 font-semibold text-slate-500">{row.billNumber}</td>
                    <td className="px-6 py-3 font-bold text-primary">{row.expenseName}</td>
                    <td 
                      className="px-6 py-3 text-emerald-600 font-bold cursor-pointer hover:underline flex items-center gap-1.5"
                      onClick={() => car && setSelectedCarForSummary(car)}
                      title="Click to view car expenses breakdown"
                    >
                      <Car className="w-4 h-4 text-emerald-500" />
                      {car?.carNumber || '—'}
                    </td>
                    <td className="px-6 py-3 font-bold text-rose-600">
                      {formatCurrency(row.amount)}
                    </td>
                    {isAdmin && (
                      <td className="px-6 py-3 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleEditOpen(row)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit Record"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(row.id)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete Record"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}

              {!fetching && filteredExpenses.length === 0 && (
                <tr>
                  <td colSpan={isAdmin ? 6 : 5} className="px-6 py-8 text-center text-text-secondary text-sm">
                    <AlertCircle className="w-5 h-5 mx-auto mb-2 text-slate-400" />
                    No records found for this month.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editingExpense && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-150 p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                <Pencil className="w-5 h-5 text-accent" /> Edit Expense
              </h3>
              <button onClick={() => setEditingExpense(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-text-secondary mb-1">Expense Name *</label>
                <input
                  type="text"
                  required
                  value={editFormData.expenseName}
                  onChange={(e) => setEditFormData({ ...editFormData, expenseName: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-text-secondary mb-1">Bill Number</label>
                <input
                  type="text"
                  value={editFormData.billNumber}
                  onChange={(e) => setEditFormData({ ...editFormData, billNumber: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-text-secondary mb-1">Amount (Rs.) *</label>
                <input
                  type="number"
                  required
                  value={editFormData.amount}
                  onChange={(e) => setEditFormData({ ...editFormData, amount: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-text-secondary mb-1">Date *</label>
                <input
                  type="date"
                  required
                  value={editFormData.date}
                  onChange={(e) => setEditFormData({ ...editFormData, date: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-text-secondary mb-1">Select Car</label>
                <select
                  value={editFormData.carId}
                  onChange={(e) => setEditFormData({ ...editFormData, carId: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20"
                >
                  {cars.map((car) => (
                    <option key={car.id} value={car.id}>
                      {car.carNumber}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingExpense(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-primary text-white rounded-xl font-bold text-xs hover:bg-primary-hover"
                >
                  {loading ? 'Updating...' : 'Update Expense'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Car Summary Modal */}
      {selectedCarForSummary && carSummaryData && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-150">
            <div className="bg-primary text-white p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/10 rounded-2xl">
                  <Car className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="text-lg font-black">{selectedCarForSummary.carNumber}</h3>
                  <p className="text-xs text-white/70">Vehicle Expense Report</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCarForSummary(null)}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center">
                  <span className="text-[11px] font-bold text-slate-400 block uppercase">Daily</span>
                  <span className="text-base font-black text-primary">{formatCurrency(carSummaryData.daily)}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center">
                  <span className="text-[11px] font-bold text-slate-400 block uppercase">7 Days</span>
                  <span className="text-base font-black text-primary">{formatCurrency(carSummaryData.weekly)}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center">
                  <span className="text-[11px] font-bold text-slate-400 block uppercase">Monthly</span>
                  <span className="text-base font-black text-primary">{formatCurrency(carSummaryData.monthly)}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center">
                  <span className="text-[11px] font-bold text-slate-400 block uppercase">Yearly</span>
                  <span className="text-base font-black text-primary">{formatCurrency(carSummaryData.yearly)}</span>
                </div>
              </div>

              <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl flex items-center justify-between">
                <span className="text-sm font-bold text-rose-800">Total Expense (All Time)</span>
                <span className="text-xl font-black text-rose-600">{formatCurrency(carSummaryData.totalAllTime)}</span>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Expense History ({carSummaryData.records.length})
                </h4>
                <div className="max-h-56 overflow-y-auto border border-slate-100 rounded-2xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 sticky top-0 text-slate-500 font-bold">
                      <tr>
                        <th className="px-4 py-2.5">Date</th>
                        <th className="px-4 py-2.5">Bill No.</th>
                        <th className="px-4 py-2.5">Name</th>
                        <th className="px-4 py-2.5 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {carSummaryData.records.map((r) => (
                        <tr key={r.id}>
                          <td className="px-4 py-2">{r.date}</td>
                          <td className="px-4 py-2 text-slate-400">{r.billNumber || '—'}</td>
                          <td className="px-4 py-2 font-semibold text-primary">{r.expenseName}</td>
                          <td className="px-4 py-2 text-right font-bold text-rose-600">
                            {formatCurrency(r.amount)}
                          </td>
                        </tr>
                      ))}
                      {carSummaryData.records.length === 0 && (
                        <tr>
                          <td colSpan={4} className="px-4 py-4 text-center text-slate-400">
                            No expense records for this car.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 px-6 py-3 flex justify-end">
              <button
                onClick={() => setSelectedCarForSummary(null)}
                className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs px-5 py-2 rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}