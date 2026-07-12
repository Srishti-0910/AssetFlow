import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout.jsx';
import StatusPill from '../components/StatusPill.jsx';
import { SkeletonList } from '../components/Skeleton.jsx';
import api from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Maintenance() {
  const { user } = useAuth();
  const canManage = user?.role === 'admin' || user?.role === 'manager';

  const [records, setRecords] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const { data } = await api.get('/maintenance');
      setRecords(data);
      setError('');
    } catch {
      setError('Could not load maintenance records.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleComplete(id) {
    try {
      await api.post(`/maintenance/${id}/complete`);
      load();
    } catch {
      setError('Failed to mark complete.');
    }
  }

  return (
    <Layout>
      <div className="p-8 max-w-6xl">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-2xl font-semibold">Maintenance</h1>
          {canManage && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-amber text-black text-sm font-medium rounded-md px-4 py-2 hover:opacity-90 transition"
            >
              + Schedule maintenance
            </button>
          )}
        </div>
        <p className="text-muted text-sm mb-6">Keep every asset serviced before it breaks.</p>

        {error && <div className="text-sm text-danger mb-4">{error}</div>}

        {loading ? (
          <SkeletonList />
        ) : records.length === 0 ? (
          <div className="asset-tag p-8 pl-10 text-center text-muted text-sm">
            No maintenance scheduled. {canManage && 'All clear — nothing needs attention.'}
          </div>
        ) : (
          <div className="space-y-3">
            {records.map((m) => (
              <div key={m._id} className="asset-tag p-4 pl-8 flex items-center justify-between">
                <div>
                  <div className="font-mono text-xs text-muted mb-1">{m.asset?.assetTag}</div>
                  <div className="font-medium text-sm">
                    {m.asset?.name} <span className="text-muted capitalize">— {m.type}</span>
                  </div>
                  {m.description && <div className="text-xs text-muted mt-1">{m.description}</div>}
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-muted">
                    {new Date(m.scheduledDate).toLocaleDateString()}
                  </span>
                  <StatusPill status={m.status} />
                  {canManage && m.status !== 'completed' && (
                    <button
                      onClick={() => handleComplete(m._id)}
                      className="text-xs border border-border rounded-md px-3 py-1.5 hover:bg-panel2 transition"
                    >
                      Mark complete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <ScheduleModal onClose={() => setShowForm(false)} onDone={() => { setShowForm(false); load(); }} />
      )}
    </Layout>
  );
}

function ScheduleModal({ onClose, onDone }) {
  const [assets, setAssets] = useState([]);
  const [form, setForm] = useState({ assetId: '', type: 'routine', description: '', scheduledDate: '' });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/assets', { params: { limit: 100 } }).then((res) => setAssets(res.data.items));
  }, []);

  function update(field) {
    return (e) => setForm({ ...form, [field]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await api.post('/maintenance', form);
      onDone();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to schedule maintenance.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <div className="asset-tag p-6 pl-9 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">Schedule maintenance</h2>
        {error && <div className="text-sm text-danger mb-3">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs text-muted mb-1.5 font-mono">ASSET</label>
            <select required value={form.assetId} onChange={update('assetId')} className="w-full bg-panel2 border border-border rounded-md px-3 py-2 text-sm">
              <option value="">Select an asset…</option>
              {assets.map((a) => (
                <option key={a._id} value={a._id}>{a.assetTag} — {a.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-muted mb-1.5 font-mono">TYPE</label>
            <select value={form.type} onChange={update('type')} className="w-full bg-panel2 border border-border rounded-md px-3 py-2 text-sm">
              {['routine', 'repair', 'inspection', 'upgrade'].map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-muted mb-1.5 font-mono">SCHEDULED DATE</label>
            <input type="date" required value={form.scheduledDate} onChange={update('scheduledDate')} className="w-full bg-panel2 border border-border rounded-md px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1.5 font-mono">NOTES</label>
            <input value={form.description} onChange={update('description')} className="w-full bg-panel2 border border-border rounded-md px-3 py-2 text-sm" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 border border-border rounded-md py-2 text-sm text-muted hover:text-ink">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 bg-amber text-black font-medium rounded-md py-2 text-sm hover:opacity-90 disabled:opacity-50">
              {saving ? 'Saving…' : 'Schedule'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
