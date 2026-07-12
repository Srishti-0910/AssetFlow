import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', department: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function update(field) {
    return (e) => setForm({ ...form, [field]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-8 h-8 rounded-md bg-amber flex items-center justify-center">
            <span className="font-mono text-base text-black font-bold">A</span>
          </div>
          <span className="font-display text-xl font-semibold tracking-tight">AssetFlow</span>
        </div>

        <div className="asset-tag p-8 pl-9">
          <h1 className="text-lg font-semibold mb-1">Create your account</h1>
          <p className="text-muted text-sm mb-6">First account you create should be an admin in your DB, or ask one to promote you.</p>

          {error && (
            <div className="mb-4 text-sm text-danger bg-danger/10 border border-danger/30 rounded-md px-3 py-2">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-muted mb-1.5 font-mono">FULL NAME</label>
              <input
                required
                value={form.name}
                onChange={update('name')}
                className="w-full bg-panel2 border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber/50"
                placeholder="Jordan Lee"
              />
            </div>
            <div>
              <label className="block text-xs text-muted mb-1.5 font-mono">EMAIL</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={update('email')}
                className="w-full bg-panel2 border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber/50"
                placeholder="you@company.com"
              />
            </div>
            <div>
              <label className="block text-xs text-muted mb-1.5 font-mono">DEPARTMENT</label>
              <input
                value={form.department}
                onChange={update('department')}
                className="w-full bg-panel2 border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber/50"
                placeholder="Operations"
              />
            </div>
            <div>
              <label className="block text-xs text-muted mb-1.5 font-mono">PASSWORD</label>
              <input
                type="password"
                required
                minLength={6}
                value={form.password}
                onChange={update('password')}
                className="w-full bg-panel2 border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber/50"
                placeholder="At least 6 characters"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber text-black font-medium rounded-md py-2 text-sm hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-muted mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-teal hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
