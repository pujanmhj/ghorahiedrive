'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2, Users, X } from 'lucide-react';
import type { SessionUser, UserRole } from '@/lib/types';

interface PortalUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface ShareholdersPanelProps {
  user: SessionUser;
}

export default function ShareholdersPanel({ user }: ShareholdersPanelProps) {
  const [users, setUsers] = useState<PortalUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'shareholder' as UserRole,
  });

  const load = async () => {
    setLoading(true);
    const res = await fetch('/api/users', { cache: 'no-store' });
    const data = await res.json();
    if (res.ok) setUsers(data.users || []);
    setLoading(false);
  };

  useEffect(() => {
    if (user.role === 'admin') load();
  }, [user.role]);

  if (user.role !== 'admin') {
    return (
      <div className="bg-white rounded-3xl border border-slate-100 p-8 text-sm text-text-secondary">
        Only admins can manage shareholder accounts.
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create user');
      setShowForm(false);
      setForm({ name: '', email: '', password: '', role: 'shareholder' });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create user');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Remove this account? They will no longer be able to sign in.')) return;
    const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) {
      alert(data.error || 'Delete failed');
      return;
    }
    await load();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-primary font-heading">Users & Shareholders</h3>
          <p className="text-xs text-text-secondary mt-1">
            Create login accounts dynamically. Shareholders can view only.
          </p>
        </div>
        <button
          onClick={() => {
            setShowForm(true);
            setError(null);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary-hover"
        >
          <Plus className="w-4 h-4" />
          Add Account
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-extrabold text-primary uppercase tracking-wider">New Login</h4>
            <button type="button" onClick={() => setShowForm(false)} className="text-slate-400 hover:text-primary">
              <X className="w-5 h-5" />
            </button>
          </div>
          {error && (
            <p className="text-xs font-bold text-danger bg-danger/5 border border-danger/20 rounded-xl px-3 py-2">
              {error}
            </p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-primary uppercase">Full Name</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="mt-1.5 w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-primary uppercase">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className="mt-1.5 w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-primary uppercase">Password</label>
              <input
                type="text"
                required
                minLength={6}
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                className="mt-1.5 w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-primary uppercase">Role</label>
              <select
                value={form.role}
                onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as UserRole }))}
                className="mt-1.5 w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none"
              >
                <option value="shareholder">Shareholder (view only)</option>
                <option value="admin">Admin (can edit)</option>
              </select>
            </div>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 rounded-xl bg-accent text-white text-sm font-bold hover:bg-accent-hover disabled:opacity-60"
          >
            {saving ? 'Creating...' : 'Create Account'}
          </button>
        </form>
      )}

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
          <Users className="w-4 h-4 text-accent" />
          <h4 className="text-sm font-bold text-primary">All Accounts</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-xs font-bold text-primary uppercase">
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-text-secondary">
                    Loading users...
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id}>
                    <td className="px-6 py-3.5 font-bold text-primary">{u.name}</td>
                    <td className="px-6 py-3.5 text-text-secondary">{u.email}</td>
                    <td className="px-6 py-3.5">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${
                          u.role === 'admin'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-sky-50 text-sky-700'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-3.5">
                      <button
                        onClick={() => handleDelete(u.id)}
                        disabled={u.id === user.id}
                        className="p-2 rounded-lg border border-rose-100 text-rose-600 hover:bg-rose-50 disabled:opacity-40"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
