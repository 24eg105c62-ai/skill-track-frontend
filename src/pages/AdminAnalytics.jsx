import React, { useState, useEffect } from 'react';
import { adminApi } from '../api/adminApi';
import {
  Activity,
  Shield,
  Clock,
  Search,
  Filter,
  CheckCircle,
  AlertTriangle,
  Lock,
  ChevronLeft,
  ChevronRight,
  Database
} from 'lucide-react';

export default function AdminAnalytics() {
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');

  useEffect(() => {
    async function fetchLogs() {
      setLoading(true);
      try {
        const res = await adminApi.getAuditLogs(page, 20);
        setLogs(res.content || []);
        setTotalPages(res.totalPages || 1);
        setTotalElements(res.totalElements || 0);
      } catch (err) {
        setError(err.message || 'Failed to load audit logs');
      } finally {
        setLoading(false);
      }
    }
    fetchLogs();
  }, [page]);

  const filteredLogs = logs.filter((log) => {
    if (actionFilter === 'ALL') return true;
    return log.action?.includes(actionFilter);
  });

  const getActionBadgeClass = (action) => {
    if (action?.includes('DELETE') || action?.includes('REMOVE')) return 'badge-danger';
    if (action?.includes('CREATE') || action?.includes('REGISTER')) return 'badge-success';
    if (action?.includes('LOGIN') || action?.includes('SUBMIT')) return 'badge-primary';
    return 'badge-purple';
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
            <span className="badge badge-purple"><Shield size={13} /> Compliance & Integrity</span>
            <span className="badge badge-success"><Lock size={13} /> Immutable Audit Trail</span>
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, letterSpacing: '-0.03em' }}>
            Security, Audit & System Analytics
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Detailed tamper-evident record of all authentication events, administrative actions, and academic operations.
          </p>
        </div>
      </div>

      {error && <div style={{ color: 'var(--danger)', marginBottom: '1.5rem' }}>{error}</div>}

      {/* Security Stat Cards */}
      <div className="stat-grid">
        <div className="card stat-card">
          <div className="stat-icon" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
            <Activity size={24} />
          </div>
          <div>
            <div className="stat-value">{totalElements}</div>
            <div className="stat-label">Total Audited Events</div>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon" style={{ background: 'var(--success-light)', color: 'var(--success)' }}>
            <Shield size={24} />
          </div>
          <div>
            <div className="stat-value">100%</div>
            <div className="stat-label">Role Isolation Compliance</div>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon" style={{ background: 'var(--info-light)', color: 'var(--info)' }}>
            <Lock size={24} />
          </div>
          <div>
            <div className="stat-value">BCrypt-12</div>
            <div className="stat-label">Credential Hashing Standard</div>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon" style={{ background: 'var(--purple-light)', color: 'var(--purple)' }}>
            <Database size={24} />
          </div>
          <div>
            <div className="stat-value">MySQL 8</div>
            <div className="stat-label">Persistent Relational Store</div>
          </div>
        </div>
      </div>

      {/* Filter and Log Table */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={19} style={{ color: 'var(--primary)' }} /> Audit Log Event Stream
          </h2>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              className={`btn btn-sm ${actionFilter === 'ALL' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActionFilter('ALL')}
            >
              All Actions
            </button>
            <button
              className={`btn btn-sm ${actionFilter === 'LOGIN' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActionFilter('LOGIN')}
            >
              Logins
            </button>
            <button
              className={`btn btn-sm ${actionFilter === 'REGISTER' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActionFilter('REGISTER')}
            >
              Registrations
            </button>
            <button
              className={`btn btn-sm ${actionFilter === 'QUIZ' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActionFilter('QUIZ')}
            >
              Quizzes
            </button>
            <button
              className={`btn btn-sm ${actionFilter === 'COURSE' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActionFilter('COURSE')}
            >
              Courses
            </button>
          </div>
        </div>

        {loading ? (
          <div className="spinner" />
        ) : filteredLogs.length === 0 ? (
          <div className="empty-state">
            <Activity size={40} className="empty-state-icon" />
            <h3>No audit logs matching filter</h3>
            <p style={{ marginTop: '0.4rem', color: 'var(--text-secondary)' }}>
              Events will appear as actions are dispatched by users and administrators.
            </p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Actor Email</th>
                  <th>Action</th>
                  <th>Resource Type</th>
                  <th>Resource ID</th>
                  <th>Details & Context</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => (
                  <tr key={log.id}>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.82rem', whiteSpace: 'nowrap' }}>
                      {log.createdAt ? new Date(log.createdAt).toLocaleString() : 'Recent'}
                    </td>
                    <td>
                      <span style={{ fontWeight: 600 }}>{log.actorEmail || 'System'}</span>
                    </td>
                    <td>
                      <span className={`badge ${getActionBadgeClass(log.action)}`}>
                        {log.action}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>
                      {log.resourceType || '—'}
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {log.resourceId ? `#${log.resourceId}` : '—'}
                    </td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {log.detailsJson || 'Standard event execution'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Page {page + 1} of {totalPages} ({totalElements} total audit records)
            </span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                className="btn btn-secondary btn-sm"
                disabled={page === 0}
                onClick={() => setPage(page - 1)}
              >
                <ChevronLeft size={15} /> Previous
              </button>
              <button
                className="btn btn-secondary btn-sm"
                disabled={page >= totalPages - 1}
                onClick={() => setPage(page + 1)}
              >
                Next <ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
