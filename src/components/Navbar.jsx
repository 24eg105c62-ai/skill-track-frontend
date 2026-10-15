import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, LogOut, Menu, User as UserIcon, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Navbar({ toggleMobileSidebar }) {
  const { user, logout, isAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button
          className="btn-icon mobile-menu-btn"
          onClick={toggleMobileSidebar}
          aria-label="Toggle menu"
          style={{ display: 'none' }}
        >
          <Menu size={20} />
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Workspace</span>
          <span style={{ color: 'var(--border)' }}>/</span>
          <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            {user?.college || 'Technical Learning Track'}
          </span>
        </div>
      </div>

      <div className="topbar-right">
        <button
          className="btn-icon"
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          aria-label="Toggle color theme"
        >
          {theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
        </button>

        <Link
          to="/profile"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.35rem 0.75rem',
            borderRadius: 'var(--radius-full)',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: isAdmin ? 'var(--purple-light)' : 'var(--primary-light)',
              color: isAdmin ? 'var(--purple)' : 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.85rem',
            }}
          >
            {user?.fullName?.charAt(0) || 'U'}
          </div>
          <div style={{ lineHeight: 1.2 }}>
            <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>{user?.fullName}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {user?.studentId} {isAdmin && '• ADMIN'}
            </div>
          </div>
        </Link>

        <button
          className="btn-icon"
          onClick={logout}
          title="Sign out securely"
          aria-label="Logout"
          style={{ color: 'var(--danger)' }}
        >
          <LogOut size={18} />
        </button>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .mobile-menu-btn {
            display: flex !important;
          }
        }
      `}</style>
    </header>
  );
}
