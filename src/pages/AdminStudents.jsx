import React, { useState, useEffect } from 'react';
import { adminApi } from '../api/adminApi';
import {
  Users,
  Search,
  CheckCircle,
  XCircle,
  Shield,
  GraduationCap,
  AlertCircle,
  Power,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function AdminStudents() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getUsers(search, page, 15);
      setUsers(res.content || []);
      setTotalPages(res.totalPages || 1);
      setTotalElements(res.totalElements || 0);
    } catch (err) {
      setError(err.message || 'Failed to load user directory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(0);
    fetchUsers();
  };

  const handleToggleStatus = async (userId, currentEnabled, studentName) => {
    try {
      await adminApi.toggleUserStatus(userId);
      setActionSuccess(`Account for ${studentName} has been ${currentEnabled ? 'disabled' : 'enabled'}.`);
      setTimeout(() => setActionSuccess(''), 4000);
      // Update local state immediately
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, enabled: !currentEnabled } : u))
      );
    } catch (err) {
      setError(err.message || 'Failed to toggle student account status');
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, letterSpacing: '-0.03em' }}>
          Student Roster & Directory Management
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Supervise registered learners, verify university credentials, and administer access authorizations.
        </p>
      </div>

      {actionSuccess && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--success-light)', color: 'var(--success)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }}>
          <CheckCircle size={18} />
          <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{actionSuccess}</span>
        </div>
      )}

      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--danger-light)', color: 'var(--danger)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }}>
          <AlertCircle size={18} />
          <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{error}</span>
        </div>
      )}

      {/* Search & Actions Bar */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem 1.25rem' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 260, position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '2.5rem' }}
              placeholder="Search by student name, ID (e.g. STU2026), or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Search Directory
          </button>
          {search && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setSearch('');
                setPage(0);
                setTimeout(fetchUsers, 50);
              }}
            >
              Clear
            </button>
          )}
        </form>
      </div>

      {/* Student List Table */}
      <div className="card">
        {loading ? (
          <div className="spinner" />
        ) : users.length === 0 ? (
          <div className="empty-state">
            <Users size={40} className="empty-state-icon" />
            <h3>No student records found</h3>
            <p style={{ marginTop: '0.4rem', color: 'var(--text-secondary)' }}>
              Try adjusting your search criteria or register new test student accounts.
            </p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Name & Email</th>
                  <th>College / Department</th>
                  <th>Study Year</th>
                  <th>Courses</th>
                  <th>Quizzes</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--primary)' }}>
                        {u.studentId}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{u.fullName}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{u.email}</div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.88rem' }}>{u.college || '—'}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{u.department || 'General'}</div>
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>
                      {u.studyYear || '—'}
                    </td>
                    <td>
                      <span className="badge badge-primary">{u.enrolledCoursesCount || 0} enrolled</span>
                    </td>
                    <td>
                      <span className="badge badge-purple">{u.quizAttemptsCount || 0} attempts</span>
                    </td>
                    <td>
                      {u.enabled ? (
                        <span className="badge badge-success">
                          <CheckCircle size={12} /> Enabled
                        </span>
                      ) : (
                        <span className="badge badge-danger">
                          <XCircle size={12} /> Suspended
                        </span>
                      )}
                    </td>
                    <td>
                      <button
                        className={`btn btn-sm ${u.enabled ? 'btn-secondary' : 'btn-primary'}`}
                        style={{ display: 'inline-flex', gap: '0.35rem' }}
                        onClick={() => handleToggleStatus(u.id, u.enabled, u.fullName)}
                        title={u.enabled ? 'Suspend student account' : 'Re-activate student account'}
                      >
                        <Power size={13} />
                        {u.enabled ? 'Suspend' : 'Activate'}
                      </button>
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
              Page {page + 1} of {totalPages} ({totalElements} total students)
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
