import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const navItems = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/assets', label: 'Assets' },
  { to: '/allocations', label: 'Allocations' },
  { to: '/maintenance', label: 'Maintenance' },
];

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className="min-h-screen flex">
      <aside className="w-56 shrink-0 bg-panel border-r border-border flex flex-col">
        <div className="flex items-center gap-2 px-5 py-5 border-b border-border">
          <div className="w-7 h-7 rounded-md bg-amber flex items-center justify-center">
            <span className="font-mono text-sm text-black font-bold">A</span>
          </div>
          <span className="font-display font-semibold tracking-tight">AssetFlow</span>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-sm font-medium transition ${
                  isActive
                    ? 'bg-panel2 text-ink border border-border'
                    : 'text-muted hover:text-ink hover:bg-panel2/60'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-border">
          <div className="text-sm font-medium truncate">{user?.name}</div>
          <div className="text-xs text-muted font-mono uppercase mb-3">{user?.role}</div>
          <button
            onClick={handleLogout}
            className="w-full text-xs text-muted hover:text-danger border border-border rounded-md py-1.5 transition"
          >
            Sign out
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}
