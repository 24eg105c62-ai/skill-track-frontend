import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../api/authApi';
import { courseApi } from '../api/courseApi';
import { quizApi } from '../api/quizApi';
import {
  User,
  Mail,
  Building,
  BookOpen,
  GraduationCap,
  Calendar,
  Shield,
  CheckCircle,
  AlertCircle,
  Save,
  LogOut,
  Award,
  Activity,
  Layers
} from 'lucide-react';

export default function Profile() {
  const { user, updateUser, logout, isAdmin } = useAuth();

  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    college: user?.college || '',
    department: user?.department || '',
    studyYear: user?.studyYear || '',
    bio: user?.bio || '',
  });

  const [enrollments, setEnrollments] = useState([]);
  const [quizHistory, setQuizHistory] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    async function loadStats() {
      try {
        const [enrollRes, quizRes] = await Promise.all([
          courseApi.getMyEnrollments().catch(() => []),
          quizApi.getHistory(0, 5).catch(() => ({ content: [] })),
        ]);
        setEnrollments(Array.isArray(enrollRes) ? enrollRes : []);
        setQuizHistory(quizRes.content || []);
      } catch (err) {
        console.error('Failed to load profile stats:', err);
      } finally {
        setLoadingStats(false);
      }
    }
    loadStats();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const updated = await authApi.updateProfile(formData);
      updateUser(updated);
      setSuccessMsg('Profile updated successfully!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const completedCount = enrollments.filter((e) => e.progressPercent === 100).length;

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      {/* Header Banner */}
      <div
        className="card"
        style={{
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.5rem',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(139, 92, 246, 0.08))',
          borderColor: 'rgba(99, 102, 241, 0.25)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--primary), var(--purple))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '1.85rem',
              fontWeight: 800,
              boxShadow: 'var(--shadow-md)',
            }}
          >
            {user?.fullName?.charAt(0) || 'U'}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: '1.65rem', fontWeight: 800 }}>{user?.fullName}</h1>
              {isAdmin && <span className="badge badge-purple"><Shield size={13} /> Administrator</span>}
              <span className="badge badge-primary"><GraduationCap size={13} /> Verified Student</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginTop: '0.2rem' }}>
              Student ID: <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{user?.studentId}</span> • {user?.email}
            </p>
          </div>
        </div>

        <button className="btn btn-danger btn-sm" onClick={logout} title="Sign out">
          <LogOut size={16} /> Logout Securely
        </button>
      </div>

      {/* Grid: Profile Form & Academic Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.75rem' }}>
        {/* Left: Edit Profile Form */}
        <div className="card">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <User size={19} style={{ color: 'var(--primary)' }} /> Edit Student Profile
          </h2>

          {successMsg && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--success-light)', color: 'var(--success)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }}>
              <CheckCircle size={18} />
              <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--danger-light)', color: 'var(--danger)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }}>
              <AlertCircle size={18} />
              <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="fullName"
                className="form-input"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">College / University</label>
              <input
                type="text"
                name="college"
                className="form-input"
                value={formData.college}
                onChange={handleChange}
                placeholder="e.g. Institute of Engineering & Technology"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Department / Major</label>
              <input
                type="text"
                name="department"
                className="form-input"
                value={formData.department}
                onChange={handleChange}
                placeholder="e.g. Computer Science"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Study Year</label>
              <select
                name="studyYear"
                className="form-select"
                value={formData.studyYear}
                onChange={handleChange}
              >
                <option value="">Select Year of Study</option>
                <option value="Year 1">Year 1</option>
                <option value="Year 2">Year 2</option>
                <option value="Year 3">Year 3</option>
                <option value="Year 4">Year 4</option>
                <option value="Postgraduate">Postgraduate</option>
                <option value="Alumni / Professional">Alumni / Professional</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Bio / Academic Interests</label>
              <textarea
                name="bio"
                className="form-textarea"
                rows={4}
                value={formData.bio}
                onChange={handleChange}
                placeholder="Briefly describe your technical interests, favorite tech stack, or career goals..."
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                <Save size={16} /> {saving ? 'Saving Changes...' : 'Save Profile'}
              </button>
            </div>
          </form>
        </div>

        {/* Right: Academic Metrics & Session Security */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {/* Academic Overview Card */}
          <div className="card">
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Activity size={19} style={{ color: 'var(--success)' }} /> Academic Summary
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ padding: '1rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Enrolled Courses</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary)', marginTop: '0.2rem' }}>
                  {enrollments.length}
                </div>
              </div>

              <div style={{ padding: '1rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Courses Completed</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--success)', marginTop: '0.2rem' }}>
                  {completedCount}
                </div>
              </div>

              <div style={{ padding: '1rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Quiz Attempts</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--info)', marginTop: '0.2rem' }}>
                  {quizHistory.length}
                </div>
              </div>

              <div style={{ padding: '1rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Account Status</div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--success)', marginTop: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <CheckCircle size={15} /> Active
                </div>
              </div>
            </div>

            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              All progress is persisted securely in the normalized MySQL backend and mapped to student ID <span style={{ fontFamily: 'var(--font-mono)' }}>{user?.studentId}</span>.
            </div>
          </div>

          {/* Security & System Info Card */}
          <div className="card">
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Shield size={19} style={{ color: 'var(--purple)' }} /> Security & Authentication
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.88rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Authentication Standard</span>
                <span style={{ fontWeight: 600 }}>JWT (JSON Web Token)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Password Encryption</span>
                <span style={{ fontWeight: 600 }}>BCrypt (12 Salt Rounds)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Authorized Roles</span>
                <span style={{ fontWeight: 600 }}>{user?.roles?.join(', ') || 'ROLE_STUDENT'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Isolation Policy</span>
                <span style={{ fontWeight: 600, color: 'var(--success)' }}>Strict Per-User Partitioning</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
