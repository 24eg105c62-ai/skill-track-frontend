import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { quizApi } from '../api/quizApi';
import { courseApi } from '../api/courseApi';
import {
  HelpCircle,
  Clock,
  Award,
  CheckCircle,
  XCircle,
  ArrowRight,
  TrendingUp,
  Sparkles
} from 'lucide-react';

export default function Quizzes() {
  const [courses, setCourses] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const [courseRes, historyRes] = await Promise.all([
          courseApi.getCourses({ size: 10 }),
          quizApi.getHistory(0, 10),
        ]);
        setCourses(courseRes.content || []);
        setHistory(historyRes.content || []);
      } catch (err) {
        setError(err.message || 'Failed to load quizzes');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) return <div className="spinner" />;

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, letterSpacing: '-0.03em' }}>
          Technical Quizzes & Assessments
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Evaluate your understanding with server-evaluated multiple choice assessments and instant explanations.
        </p>
      </div>

      {error && <div style={{ color: 'var(--danger)', marginBottom: '1.5rem' }}>{error}</div>}

      {/* Available Topic Quizzes */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={20} style={{ color: 'var(--primary)' }} /> Available Topic Quizzes
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {courses.map((course) => (
            <div key={course.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                  <span className="badge badge-purple">{course.category}</span>
                  <span className="badge badge-primary">{course.difficultyLevel}</span>
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                  {course.title}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: 1.4 }}>
                  Comprehensive module assessments testing framework fundamentals, design patterns, and edge cases.
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Passing Score: 70%
                </span>
                <Link to={`/courses/${course.id}`} className="btn btn-primary btn-sm">
                  Select Topic Quiz <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Historical Quiz Attempts Table */}
      <div>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Clock size={20} style={{ color: 'var(--info)' }} /> Past Quiz Attempts & Score History
        </h2>

        {history.length === 0 ? (
          <div className="card empty-state">
            <HelpCircle size={40} className="empty-state-icon" />
            <h3>No quiz attempts recorded yet</h3>
            <p style={{ marginTop: '0.4rem' }}>Complete a quiz in any course to see your score analysis here.</p>
          </div>
        ) : (
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Topic Assessment</th>
                    <th>Score</th>
                    <th>Time Spent</th>
                    <th>Status</th>
                    <th>Date Taken</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((att) => (
                    <tr key={att.id}>
                      <td>
                        <div style={{ fontWeight: 600 }}>{att.topicTitle}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{att.courseTitle}</div>
                      </td>
                      <td>
                        <strong style={{ fontSize: '1rem', color: att.passed ? 'var(--success)' : 'var(--danger)' }}>
                          {att.percentage}%
                        </strong>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          {att.score} / {att.totalPoints} points
                        </div>
                      </td>
                      <td style={{ fontSize: '0.88rem' }}>
                        {Math.floor(att.timeSpentSeconds / 60)}m {att.timeSpentSeconds % 60}s
                      </td>
                      <td>
                        <span className={`badge ${att.passed ? 'badge-success' : 'badge-danger'}`}>
                          {att.passed ? 'PASSED' : 'NOT PASSED'}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        {new Date(att.completedTime).toLocaleDateString()} {new Date(att.completedTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
