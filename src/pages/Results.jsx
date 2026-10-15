import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { quizApi } from '../api/quizApi';
import {
  HelpCircle,
  Clock,
  Award,
  CheckCircle,
  XCircle,
  ArrowRight,
  TrendingUp,
  Filter,
  RotateCcw,
  BarChart2
} from 'lucide-react';

export default function Results() {
  const [history, setHistory] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL'); // ALL, PASSED, FAILED

  useEffect(() => {
    async function fetchHistory() {
      setLoading(true);
      try {
        const res = await quizApi.getHistory(page, 15);
        setHistory(res.content || []);
        setTotalPages(res.totalPages || 1);
        setTotalElements(res.totalElements || 0);
      } catch (err) {
        setError(err.message || 'Failed to load quiz results');
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, [page]);

  const filteredHistory = history.filter((item) => {
    if (filterStatus === 'PASSED') return item.passed;
    if (filterStatus === 'FAILED') return !item.passed;
    return true;
  });

  const avgScore = history.length > 0
    ? (history.reduce((sum, item) => sum + item.percentage, 0) / history.length).toFixed(1)
    : 0;

  const passedCount = history.filter((item) => item.passed).length;
  const passRate = history.length > 0
    ? Math.round((passedCount / history.length) * 100)
    : 0;

  const totalTimeSeconds = history.reduce((sum, item) => sum + (item.timeSpentSeconds || 0), 0);
  const avgTimeMinutes = history.length > 0
    ? (totalTimeSeconds / history.length / 60).toFixed(1)
    : 0;

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, letterSpacing: '-0.03em' }}>
            Assessment Results & Quiz History
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Historical record of your completed technical assessments, pass status, and diagnostic scores.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/quizzes" className="btn btn-primary">
            <HelpCircle size={17} /> Take New Quiz
          </Link>
          <Link to="/predictions" className="btn btn-secondary">
            <TrendingUp size={17} /> Score Predictions
          </Link>
        </div>
      </div>

      {error && <div style={{ color: 'var(--danger)', marginBottom: '1.5rem' }}>{error}</div>}

      {/* Summary Stat Grid */}
      <div className="stat-grid">
        <div className="card stat-card">
          <div className="stat-icon" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
            <Award size={24} />
          </div>
          <div>
            <div className="stat-value">{totalElements}</div>
            <div className="stat-label">Total Completed Attempts</div>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon" style={{ background: 'var(--info-light)', color: 'var(--info)' }}>
            <BarChart2 size={24} />
          </div>
          <div>
            <div className="stat-value">{avgScore}%</div>
            <div className="stat-label">Average Score</div>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon" style={{ background: 'var(--success-light)', color: 'var(--success)' }}>
            <CheckCircle size={24} />
          </div>
          <div>
            <div className="stat-value">{passRate}%</div>
            <div className="stat-label">Pass Rate (≥70%)</div>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon" style={{ background: 'var(--purple-light)', color: 'var(--purple)' }}>
            <Clock size={24} />
          </div>
          <div>
            <div className="stat-value">{avgTimeMinutes}m</div>
            <div className="stat-label">Avg. Duration / Quiz</div>
          </div>
        </div>
      </div>

      {/* Filter and Table Card */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={19} style={{ color: 'var(--primary)' }} /> Performance Breakdown
          </h2>

          {/* Filter Buttons */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              className={`btn btn-sm ${filterStatus === 'ALL' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilterStatus('ALL')}
            >
              All Attempts ({history.length})
            </button>
            <button
              className={`btn btn-sm ${filterStatus === 'PASSED' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilterStatus('PASSED')}
            >
              Passed ({passedCount})
            </button>
            <button
              className={`btn btn-sm ${filterStatus === 'FAILED' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilterStatus('FAILED')}
            >
              Needs Improvement ({history.length - passedCount})
            </button>
          </div>
        </div>

        {loading ? (
          <div className="spinner" />
        ) : filteredHistory.length === 0 ? (
          <div className="empty-state">
            <HelpCircle size={44} className="empty-state-icon" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>No quiz results match this criteria</h3>
            <p style={{ marginTop: '0.4rem', color: 'var(--text-secondary)' }}>
              Complete assessments in your enrolled courses to record your score history.
            </p>
            <Link to="/quizzes" className="btn btn-primary" style={{ marginTop: '1.25rem' }}>
              Browse Available Quizzes
            </Link>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Topic & Course</th>
                  <th>Points</th>
                  <th>Score %</th>
                  <th>Status</th>
                  <th>Time Spent</th>
                  <th>Completed Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredHistory.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.topicTitle}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.courseTitle}</div>
                    </td>
                    <td>
                      <span style={{ fontWeight: 600 }}>{item.score}</span> / {item.totalPoints} pts
                    </td>
                    <td>
                      <span style={{ fontWeight: 700, fontSize: '0.98rem' }}>{item.percentage}%</span>
                    </td>
                    <td>
                      {item.passed ? (
                        <span className="badge badge-success">
                          <CheckCircle size={13} /> Passed
                        </span>
                      ) : (
                        <span className="badge badge-danger">
                          <XCircle size={13} /> Under 70%
                        </span>
                      )}
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>
                      {item.timeSpentSeconds ? `${Math.floor(item.timeSpentSeconds / 60)}m ${item.timeSpentSeconds % 60}s` : '1m'}
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      {item.completedTime ? new Date(item.completedTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Recent'}
                    </td>
                    <td>
                      <Link
                        to={`/quiz/${item.topicId}`}
                        className="btn btn-secondary btn-sm"
                        title="Retake this topic assessment"
                      >
                        <RotateCcw size={14} /> Retake
                      </Link>
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
              Page {page + 1} of {totalPages} ({totalElements} total attempts)
            </span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                className="btn btn-secondary btn-sm"
                disabled={page === 0}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </button>
              <button
                className="btn btn-secondary btn-sm"
                disabled={page >= totalPages - 1}
                onClick={() => setPage(page + 1)}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
