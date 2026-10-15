import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardApi } from '../api/dashboardApi';
import { useAuth } from '../context/AuthContext';
import {
  BookOpen,
  Award,
  HelpCircle,
  TrendingUp,
  CheckCircle2,
  Clock,
  Flame,
  ArrowRight,
  Sparkles,
  AlertCircle,
  FileText
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadDashboard() {
      try {
        const res = await dashboardApi.getOverview();
        setData(res);
      } catch (err) {
        setError(err.message || 'Failed to load dashboard metrics');
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  if (loading) {
    return <div className="spinner" />;
  }

  if (error) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <div style={{ color: 'var(--danger)', marginBottom: '1rem' }}>{error}</div>
        <button className="btn btn-secondary" onClick={() => window.location.reload()}>
          Retry Loading
        </button>
      </div>
    );
  }

  // Format chart data from recent quiz attempts or predictions
  const chartData = (data?.recentQuizAttempts && data.recentQuizAttempts.length > 0)
    ? [...data.recentQuizAttempts].reverse().map((a, idx) => ({
        attempt: `Q${idx + 1}`,
        score: a.percentage,
        title: a.topicTitle,
      }))
    : [
        { attempt: 'Base', score: 60, title: 'Curriculum Baseline' },
        { attempt: 'Target', score: 85, title: 'Projected Target' }
      ];

  const prediction = data?.scorePrediction;

  return (
    <div>
      {/* Welcome Banner */}
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, letterSpacing: '-0.03em' }}>
            Welcome back, {user?.fullName}! 👋
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.2rem' }}>
            {user?.department} • {user?.studyYear} • ID: <span style={{ fontFamily: 'var(--font-mono)' }}>{user?.studentId}</span>
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/courses" className="btn btn-primary">
            <BookOpen size={17} /> Browse Courses
          </Link>
          <Link to="/quizzes" className="btn btn-secondary">
            <HelpCircle size={17} /> Take Quiz
          </Link>
        </div>
      </div>

      {/* Top Stat Cards */}
      <div className="stat-grid">
        <div className="card stat-card">
          <div className="stat-icon" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
            <BookOpen size={24} />
          </div>
          <div>
            <div className="stat-value">{data?.enrolledCoursesCount || 0}</div>
            <div className="stat-label">Enrolled Courses</div>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon" style={{ background: 'var(--success-light)', color: 'var(--success)' }}>
            <CheckCircle2 size={24} />
          </div>
          <div>
            <div className="stat-value">{data?.averageProgressPercent || 0}%</div>
            <div className="stat-label">Avg. Completion</div>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon" style={{ background: 'var(--info-light)', color: 'var(--info)' }}>
            <TrendingUp size={24} />
          </div>
          <div>
            <div className="stat-value">{data?.averageQuizScore || 0}%</div>
            <div className="stat-label">Avg. Quiz Score</div>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon" style={{ background: 'var(--warning-light)', color: 'var(--warning)' }}>
            <Flame size={24} />
          </div>
          <div>
            <div className="stat-value">{data?.currentStreakDays || 1} Days</div>
            <div className="stat-label">Learning Streak</div>
          </div>
        </div>
      </div>

      {/* Grid: Score Prediction Spotlight & Performance Trend Chart */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        
        {/* Module 5: Score Prediction Spotlight */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{ padding: '0.4rem', borderRadius: 'var(--radius-md)', background: 'var(--purple-light)', color: 'var(--purple)' }}>
                <TrendingUp size={20} />
              </div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Score Prediction Engine</h2>
            </div>
            <span className={`badge ${prediction?.confidenceLevel === 'HIGH' ? 'badge-success' : prediction?.confidenceLevel === 'MODERATE' ? 'badge-primary' : 'badge-warning'}`}>
              Confidence: {prediction?.confidenceLevel || 'BASELINE'}
            </span>
          </div>

          <div style={{ textAlign: 'center', padding: '1.25rem 0', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
              Projected Exam Readiness
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '-0.03em' }}>
              {prediction?.predictedScoreMid || 67.5}%
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Estimated Empirical Range:{' '}
              <strong style={{ color: 'var(--text-primary)' }}>
                {prediction?.predictedScoreMin || 60}% – {prediction?.predictedScoreMax || 75}%
              </strong>
            </div>

            {/* Range visualization track */}
            <div style={{ padding: '0 2rem', marginTop: '0.5rem' }}>
              <div className="prediction-range-track">
                <div
                  className="prediction-range-bar"
                  style={{
                    width: `${Math.min(100, Math.max(10, (prediction?.predictedScoreMid || 67.5)))}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Primary Factors List */}
          <div style={{ marginBottom: '1rem', flex: 1 }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
              Transparent Predictive Factors:
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {prediction?.primaryFactors?.map((factor, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--primary)', flexShrink: 0 }} />
                  <span>{factor}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Disclaimer (Module 5 requirement) */}
          <div style={{ padding: '0.75rem', background: 'var(--bg-surface-hover)', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
            💡 <em>{prediction?.limitationsDisclaimer || 'Predictions are diagnostic statistical estimations and do not constitute an exam warranty.'}</em>
          </div>
        </div>

        {/* Visual Analytics Chart with Recharts */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{ padding: '0.4rem', borderRadius: 'var(--radius-md)', background: 'var(--info-light)', color: 'var(--info)' }}>
                <Sparkles size={20} />
              </div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Performance Trajectory</h2>
            </div>
            <Link to="/quizzes" style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600 }}>
              View History →
            </Link>
          </div>

          <div style={{ width: '100%', height: 280, flex: 1 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="attempt" stroke="var(--text-muted)" fontSize={12} />
                <YAxis domain={[0, 100]} stroke="var(--text-muted)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--bg-surface)',
                    borderColor: 'var(--border)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                  }}
                />
                <Area type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#scoreGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recommended Next Actions */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={20} style={{ color: 'var(--warning)' }} /> Recommended Next Actions
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          {data?.recommendedActions?.map((act, idx) => (
            <div key={idx} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <span className={`badge ${act.priority === 'HIGH' ? 'badge-primary' : 'badge-warning'}`}>
                    {act.priority} PRIORITY
                  </span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                    {act.actionType}
                  </span>
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.4rem' }}>{act.title}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: 1.4 }}>
                  {act.description}
                </p>
              </div>
              <Link to={act.targetUrl} className="btn btn-secondary btn-sm" style={{ width: '100%', justifyContent: 'space-between' }}>
                <span>Take Action</span>
                <ArrowRight size={15} />
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Active Enrollments & Recent Quizzes */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
        
        {/* Active Enrollments */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Active Course Enrollments</h2>
            <Link to="/courses" style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600 }}>
              All Courses →
            </Link>
          </div>

          {(!data?.activeEnrollments || data.activeEnrollments.length === 0) ? (
            <div className="empty-state" style={{ padding: '2rem 1rem' }}>
              <BookOpen size={36} className="empty-state-icon" />
              <p>You haven't enrolled in any courses yet.</p>
              <Link to="/courses" className="btn btn-primary btn-sm" style={{ marginTop: '0.75rem' }}>
                Explore Courses
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {data.activeEnrollments.map((enr) => (
                <div key={enr.id} style={{ padding: '1rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <span className="badge badge-purple">{enr.courseCategory}</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)' }}>
                      {enr.progressPercent}%
                    </span>
                  </div>
                  <h4 style={{ fontSize: '0.98rem', fontWeight: 700, marginBottom: '0.6rem' }}>
                    {enr.courseTitle}
                  </h4>
                  <div className="prediction-range-track" style={{ height: 6, margin: '0.5rem 0' }}>
                    <div className="prediction-range-bar" style={{ width: `${enr.progressPercent}%` }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                    <Link to={`/courses/${enr.courseId}`} className="btn btn-outline btn-sm">
                      Resume Lessons →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Quiz Attempts */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Recent Quiz Scores</h2>
            <Link to="/quizzes" style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600 }}>
              Practice More →
            </Link>
          </div>

          {(!data?.recentQuizAttempts || data.recentQuizAttempts.length === 0) ? (
            <div className="empty-state" style={{ padding: '2rem 1rem' }}>
              <HelpCircle size={36} className="empty-state-icon" />
              <p>No quiz attempts recorded yet.</p>
              <Link to="/quizzes" className="btn btn-primary btn-sm" style={{ marginTop: '0.75rem' }}>
                Take First Quiz
              </Link>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Topic</th>
                    <th>Score</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentQuizAttempts.map((q) => (
                    <tr key={q.id}>
                      <td>
                        <div style={{ fontWeight: 600 }}>{q.topicTitle}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{q.courseTitle}</div>
                      </td>
                      <td>
                        <strong style={{ fontSize: '0.95rem' }}>{q.percentage}%</strong>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{q.score}/{q.totalPoints} pts</div>
                      </td>
                      <td>
                        <span className={`badge ${q.passed ? 'badge-success' : 'badge-danger'}`}>
                          {q.passed ? 'PASSED' : 'RETRY'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
