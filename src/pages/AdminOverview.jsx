import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../api/adminApi';
import {
  Shield,
  Users,
  BookOpen,
  HelpCircle,
  TrendingUp,
  FileText,
  Activity,
  Layers,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Database
} from 'lucide-react';

export default function AdminOverview() {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const res = await adminApi.getOverview();
        setOverview(res);
      } catch (err) {
        setError(err.message || 'Failed to load administrator overview');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) return <div className="spinner" />;

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
            <span className="badge badge-purple"><Shield size={13} /> Administrative Operations</span>
            <span className="badge badge-success"><CheckCircle size={13} /> MySQL 8 Connected</span>
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, letterSpacing: '-0.03em' }}>
            Platform Control Center
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Manage curriculum, supervise student accounts, curate assessment banks, and inspect security audit trails.
          </p>
        </div>
      </div>

      {error && <div style={{ color: 'var(--danger)', marginBottom: '1.5rem' }}>{error}</div>}

      {/* KPI Cards */}
      <div className="stat-grid">
        <div className="card stat-card">
          <div className="stat-icon" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
            <Users size={24} />
          </div>
          <div>
            <div className="stat-value">{overview?.totalStudents || 0}</div>
            <div className="stat-label">Registered Students</div>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon" style={{ background: 'var(--purple-light)', color: 'var(--purple)' }}>
            <BookOpen size={24} />
          </div>
          <div>
            <div className="stat-value">{overview?.totalCourses || 0}</div>
            <div className="stat-label">Published Courses</div>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon" style={{ background: 'var(--info-light)', color: 'var(--info)' }}>
            <Layers size={24} />
          </div>
          <div>
            <div className="stat-value">{overview?.totalTopics || 0}</div>
            <div className="stat-label">Curriculum Topics</div>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon" style={{ background: 'var(--warning-light)', color: 'var(--warning)' }}>
            <Database size={24} />
          </div>
          <div>
            <div className="stat-value">{overview?.totalQuestions || 0}</div>
            <div className="stat-label">Active Questions</div>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon" style={{ background: 'var(--success-light)', color: 'var(--success)' }}>
            <TrendingUp size={24} />
          </div>
          <div>
            <div className="stat-value">{overview?.totalEnrollments || 0}</div>
            <div className="stat-label">Course Enrollments</div>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon" style={{ background: 'rgba(236, 72, 153, 0.15)', color: '#ec4899' }}>
            <HelpCircle size={24} />
          </div>
          <div>
            <div className="stat-value">{overview?.totalQuizAttempts || 0}</div>
            <div className="stat-label">Quiz Attempts Evaluated</div>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon" style={{ background: 'var(--info-light)', color: 'var(--info)' }}>
            <Activity size={24} />
          </div>
          <div>
            <div className="stat-value">{overview?.globalAverageScore || 0}%</div>
            <div className="stat-label">Global Avg Score</div>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
            <FileText size={24} />
          </div>
          <div>
            <div className="stat-value">{overview?.totalPdfsUploaded || 0}</div>
            <div className="stat-label">PDF Documents Processed</div>
          </div>
        </div>
      </div>

      {/* Quick Navigation Panels */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
        <Link to="/admin/students" className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <Users size={20} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.4rem' }}>Student Management</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Inspect student rosters, department distributions, and toggle student account status.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--primary)', fontWeight: 600, fontSize: '0.85rem', marginTop: '1.25rem' }}>
            Open Directory <ArrowRight size={15} />
          </div>
        </Link>

        <Link to="/admin/courses" className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: 'var(--purple-light)', color: 'var(--purple)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <BookOpen size={20} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.4rem' }}>Course & Module CRUD</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Create courses, assemble structured modules, append technical topics, and manage syllabus.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--purple)', fontWeight: 600, fontSize: '0.85rem', marginTop: '1.25rem' }}>
            Manage Courses <ArrowRight size={15} />
          </div>
        </Link>

        <Link to="/admin/quizzes" className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: 'var(--warning-light)', color: 'var(--warning)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <Database size={20} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.4rem' }}>Question Bank</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Author topic-based MCQs, configure difficulty weights, and supply detailed explanations.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--warning)', fontWeight: 600, fontSize: '0.85rem', marginTop: '1.25rem' }}>
            Author Questions <ArrowRight size={15} />
          </div>
        </Link>

        <Link to="/admin/analytics" className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: 'var(--info-light)', color: 'var(--info)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <Activity size={20} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.4rem' }}>Security & Audit Trail</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Audit immutable activity logs: authentications, enrollments, quiz evaluations, and PDF events.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--info)', fontWeight: 600, fontSize: '0.85rem', marginTop: '1.25rem' }}>
            Inspect Logs <ArrowRight size={15} />
          </div>
        </Link>
      </div>

      {/* Recent Audit Logs Stream */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Activity size={19} style={{ color: 'var(--info)' }} /> Recent System Audit Events
          </h2>
          <Link to="/admin/analytics" className="btn btn-secondary btn-sm">
            View Full Audit Trail
          </Link>
        </div>

        {(!overview?.recentAuditLogs || overview.recentAuditLogs.length === 0) ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No recent audit activity recorded.</p>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Actor Email</th>
                  <th>Action</th>
                  <th>Resource</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {overview.recentAuditLogs.map((log) => (
                  <tr key={log.id}>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.82rem', whiteSpace: 'nowrap' }}>
                      {log.createdAt ? new Date(log.createdAt).toLocaleString() : 'Recent'}
                    </td>
                    <td>
                      <span style={{ fontWeight: 600 }}>{log.actorEmail || 'System'}</span>
                    </td>
                    <td>
                      <span className="badge badge-purple">{log.action}</span>
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>
                      {log.resourceType} {log.resourceId ? `#${log.resourceId}` : ''}
                    </td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {log.detailsJson || 'Standard event'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
