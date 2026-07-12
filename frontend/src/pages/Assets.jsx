import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout.jsx';
import StatusPill from '../components/StatusPill.jsx';
import { SkeletonCards } from '../components/Skeleton.jsx';
import api from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';

const categories = ['equipment', 'device', 'vehicle', 'facility', 'other'];
const statuses = ['available', 'allocated', 'maintenance', 'retired'];

export default function Assets() {
  const { user } = useAuth();
  const canManage = user?.role === 'admin' || user?.role === 'manager';

  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      if (categoryFilter) params.category = categoryFilter;
      const { data } = await api.get('/assets', { params });
      setItems(data.items);
    } catch (err) {
      setError('Could not load assets.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const t = setTimeout(load, 250); // debounce search
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, statusFilter, categoryFilter]);

  return (
    <Layout>
      <div className="p-8 max-w-6xl">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-2xl font-semibold">Assets</h1>
          {canManage && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-amber text-black text-sm font-medium rounded-md px-4 py-2 hover:opacity-90 transition"
            >
              + New asset
            </button>
          )}
        </div>
        <p className="text-muted text-sm mb-6">
          {loading ? 'Loading assets…' : `${items.length} asset${items.length !== 1 ? 's' : ''} matching filters.`}
        </p>

        <div className="flex gap-3 mb-6">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or tag…"
            className="flex-1 bg-panel2 border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber/50"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-panel2 border border-border rounded-md px-3 py-2 text-sm"
          >
            <option value="">All statuses</option>
            {statuses.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-panel2 border border-border rounded-md px-3 py-2 text-sm"
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {error && <div className="text-sm text-danger mb-4">{error}</div>}

        {loading ? (
          <SkeletonCards />
        ) : items.length === 0 ? (
          <div className="asset-tag p-8 pl-10 text-center text-muted text-sm">
            No assets match. {canManage && 'Create the first one to get started.'}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {items.map((asset) => (
              <div key={asset._id} className="asset-tag p-5 pl-8">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-mono text-xs text-muted mb-1">{asset.assetTag}</div>
                    <div className="font-semibold">{asset.name}</div>
                  </div>
                  <StatusPill status={asset.status} />
                </div>
                <div className="flex items-center gap-4 mt-3 text-xs text-muted">
                  <span className="capitalize">{asset.category}</span>
                  {asset.location && <span>{asset.location}</span>}
                  <span className="capitalize">{asset.condition}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <NewAssetModal
          onClose={() => setShowForm(false)}
          onCreated={() => {
            setShowForm(false);
            load();
          }}
        />
      )}
    </Layout>
  );
}

function NewAssetModal({ onClose, onCreated }) {
  const [form, setForm] = useState({
    assetTag: '',
    name: '',
    category: 'equipment',
    location: '',
    condition: 'good',
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  function update(field) {
    return (e) => setForm({ ...form, [field]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await api.post('/assets', form);
      onCreated();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create asset.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <div className="asset-tag p-6 pl-9 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">New asset</h2>
        {error && <div className="text-sm text-danger mb-3">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-3">
          <Field label="ASSET TAG" value={form.assetTag} onChange={update('assetTag')} placeholder="AF-0001" required />
          <Field label="NAME" value={form.name} onChange={update('name')} placeholder="Dell Latitude 5420" required />
          <div>
            <label className="block text-xs text-muted mb-1.5 font-mono">CATEGORY</label>
            <select value={form.category} onChange={update('category')} className="w-full bg-panel2 border border-border rounded-md px-3 py-2 text-sm">
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <Field label="LOCATION" value={form.location} onChange={update('location')} placeholder="HQ - Floor 3" />
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 border border-border rounded-md py-2 text-sm text-muted hover:text-ink">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="flex-1 bg-amber text-black font-medium rounded-md py-2 text-sm hover:opacity-90 disabled:opacity-50">
              {saving ? 'Creating…' : 'Create asset'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, ...props }) {
  return (
    <div>
      <label className="block text-xs text-muted mb-1.5 font-mono">{label}</label>
      <input {...props} className="w-full bg-panel2 border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber/50" />
    </div>
  );
}
