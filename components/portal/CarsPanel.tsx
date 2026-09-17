'use client';

import { useEffect, useMemo, useState } from 'react';
import { Car, Pencil, Plus, Trash2, X } from 'lucide-react';
import type { FleetCar, SessionUser } from '@/lib/types';

interface CarsPanelProps {
  user: SessionUser;
  cars: FleetCar[];
  onChanged: () => Promise<void>;
}

const emptyForm = { carNumber: '' };

export default function CarsPanel({ user, cars, onChanged }: CarsPanelProps) {
  const isAdmin = user.role === 'admin';
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!isAdmin) setShowForm(false);
  }, [isAdmin]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return cars;
    return cars.filter((c) => c.carNumber.toLowerCase().includes(q));
  }, [cars, query]);

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError(null);
    setShowForm(true);
  };

  const openEdit = (car: FleetCar) => {
    setEditingId(car.id);
    setForm({ carNumber: car.carNumber });
    setError(null);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;
    setSaving(true);
    setError(null);

    try {
      const url = editingId ? `/api/cars/${editingId}` : '/api/cars';
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Save failed');
      setShowForm(false);
      setForm(emptyForm);
      setEditingId(null);
      await onChanged();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!isAdmin) return;
    if (!window.confirm('Delete this car and all its revenue records?')) return;
    const res = await fetch(`/api/cars/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) {
      alert(data.error || 'Delete failed');
      return;
    }
    await onChanged();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-primary font-heading">Fleet Cars</h3>
          <p className="text-xs text-text-secondary mt-1">
          {cars.length} cars registered · plate details
            {!isAdmin && ' · view only'}
          </p>
        </div>
        <div className="flex gap-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search car / route..."
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          {isAdmin && (
            <button
              onClick={openAdd}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary-hover"
            >
              <Plus className="w-4 h-4" />
              Add Car
            </button>
          )}
        </div>
      </div>

      {showForm && isAdmin && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-extrabold text-primary uppercase tracking-wider">
              {editingId ? 'Edit Car' : 'Add New Car'}
            </h4>
            <button type="button" onClick={() => setShowForm(false)} className="text-slate-400 hover:text-primary">
              <X className="w-5 h-5" />
            </button>
          </div>
          {error && (
            <p className="text-xs font-bold text-danger bg-danger/5 border border-danger/20 rounded-xl px-3 py-2">
              {error}
            </p>
          )}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="text-xs font-bold text-primary uppercase">Car Number</label>
              <input
                required
                value={form.carNumber}
                onChange={(e) => setForm((f) => ({ ...f, carNumber: e.target.value }))}
                placeholder="Ba 2 Cha 1234"
                className="mt-1.5 w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 rounded-xl bg-accent text-white text-sm font-bold hover:bg-accent-hover disabled:opacity-60"
          >
            {saving ? 'Saving...' : editingId ? 'Update Car' : 'Save Car'}
          </button>
        </form>
      )}

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold text-primary uppercase">
                <th className="px-6 py-4">Car Number</th>
                {isAdmin && <th className="px-6 py-4">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm">
              {filtered.map((car) => (
                <tr key={car.id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-3.5 font-bold text-primary whitespace-nowrap">
                    <span className="inline-flex items-center gap-2">
                      <Car className="w-4 h-4 text-accent" />
                      {car.carNumber}
                    </span>
                  </td>
                  {isAdmin && (
                    <td className="px-6 py-3.5 whitespace-nowrap">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEdit(car)}
                          className="p-2 rounded-lg border border-slate-200 text-primary hover:bg-slate-50"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(car.id)}
                          className="p-2 rounded-lg border border-rose-100 text-rose-600 hover:bg-rose-50"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={isAdmin ? 2 : 1} className="px-6 py-10 text-center text-text-secondary text-sm">
                    No cars found.
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
