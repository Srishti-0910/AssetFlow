import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials.');
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
          <h1 className="text-lg font-semibold mb-1">Sign in</h1>
          <p className="text-muted text-sm mb-6">Track every asset. Know where it is, who has it.</p>

          {error && (
            <div className="mb-4 text-sm text-danger bg-danger/10 border border-danger/30 rounded-md px-3 py-2">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-muted mb-1.5 font-mono">EMAIL</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-panel2 border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber/50"
                placeholder="you@company.com"
              />
            </div>
            <div>
              <label className="block text-xs text-muted mb-1.5 font-mono">PASSWORD</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-panel2 border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber/50"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber text-black font-medium rounded-md py-2 text-sm hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-muted mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-teal hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
