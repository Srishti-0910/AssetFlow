import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout.jsx';
import StatusPill from '../components/StatusPill.jsx';
import { SkeletonList } from '../components/Skeleton.jsx';
import api from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Allocations() {
  const { user } = useAuth();
  const canManage = user?.role === 'admin' || user?.role === 'manager';

  const [allocations, setAllocations] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const { data } = await api.get('/allocations');
      setAllocations(data);
      setError('');
    } catch {
      setError('Could not load allocations.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCheckIn(id) {
    try {
      await api.post(`/allocations/${id}/check-in`);
      load();
    } catch {
      setError('Failed to check in asset.');
    }
  }

  return (
    <Layout>
      <div className="p-8 max-w-6xl">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-2xl font-semibold">Allocations</h1>
          {canManage && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-amber text-black text-sm font-medium rounded-md px-4 py-2 hover:opacity-90 transition"
            >
              + Check out asset
            </button>
          )}
        </div>
        <p className="text-muted text-sm mb-6">Who has what, and since when.</p>

        {error && <div className="text-sm text-danger mb-4">{error}</div>}

        {loading ? (
          <SkeletonList />
        ) : allocations.length === 0 ? (
          <div className="asset-tag p-8 pl-10 text-center text-muted text-sm">
            No allocations yet. {canManage && 'Check out an asset to get started.'}
          </div>
        ) : (
          <div className="space-y-3">
            {allocations.map((a) => (
              <div key={a._id} className="asset-tag p-4 pl-8 flex items-center justify-between">
                <div>
                  <div className="font-mono text-xs text-muted mb-1">{a.asset?.assetTag}</div>
                  <div className="font-medium text-sm">
                    {a.asset?.name} <span className="text-muted">→</span> {a.allocatedTo?.name}
                  </div>
                  {a.project && <div className="text-xs text-muted mt-1">Project: {a.project}</div>}
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-muted">
                    since {new Date(a.checkedOutAt).toLocaleDateString()}
                  </span>
                  <StatusPill status={a.status} />
                  {canManage && a.status !== 'returned' && (
                    <button
                      onClick={() => handleCheckIn(a._id)}
                      className="text-xs border border-border rounded-md px-3 py-1.5 hover:bg-panel2 transition"
                    >
                      Check in
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <CheckOutModal onClose={() => setShowForm(false)} onDone={() => { setShowForm(false); load(); }} />
      )}
    </Layout>
  );
}

function CheckOutModal({ onClose, onDone }) {
  const [assets, setAssets] = useState([]);
  const [form, setForm] = useState({ assetId: '', allocatedTo: '', project: '', dueBackAt: '' });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/assets', { params: { status: 'available', limit: 100 } }).then((res) => setAssets(res.data.items));
  }, []);

  function update(field) {
    return (e) => setForm({ ...form, [field]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await api.post('/allocations/check-out', form);
      onDone();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to check out asset.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <div className="asset-tag p-6 pl-9 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">Check out asset</h2>
        {error && <div className="text-sm text-danger mb-3">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs text-muted mb-1.5 font-mono">ASSET</label>
            <select required value={form.assetId} onChange={update('assetId')} className="w-full bg-panel2 border border-border rounded-md px-3 py-2 text-sm">
              <option value="">Select an available asset…</option>
              {assets.map((a) => (
                <option key={a._id} value={a._id}>{a.assetTag} — {a.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-muted mb-1.5 font-mono">USER ID (allocated to)</label>
            <input required value={form.allocatedTo} onChange={update('allocatedTo')} placeholder="Mongo user _id" className="w-full bg-panel2 border border-border rounded-md px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1.5 font-mono">PROJECT (optional)</label>
            <input value={form.project} onChange={update('project')} className="w-full bg-panel2 border border-border rounded-md px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1.5 font-mono">DUE BACK (optional)</label>
            <input type="date" value={form.dueBackAt} onChange={update('dueBackAt')} className="w-full bg-panel2 border border-border rounded-md px-3 py-2 text-sm" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 border border-border rounded-md py-2 text-sm text-muted hover:text-ink">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 bg-amber text-black font-medium rounded-md py-2 text-sm hover:opacity-90 disabled:opacity-50">
              {saving ? 'Saving…' : 'Check out'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
