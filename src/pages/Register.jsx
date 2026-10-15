import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    studentId: '',
    email: '',
    password: '',
    college: '',
    department: '',
    studyYear: 'Year 1',
    bio: '',
  });

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.studentId || !formData.email || !formData.password) {
      setError('Please fill in all mandatory profile fields');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must contain at least 6 characters');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed. Please check your details.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1.5rem', background: 'radial-gradient(ellipse at top, #1e1b4b 0%, var(--bg-app) 70%)' }}>
      <div className="card" style={{ maxWidth: 620, width: '100%', padding: '2.5rem 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div className="brand-icon" style={{ margin: '0 auto 1rem', width: 48, height: 48 }}>
            <GraduationCap size={28} />
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.4rem' }}>
            Student Registration
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Create your verified student account on Pocket Skill Track
          </p>
        </div>

        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.85rem 1rem', background: 'var(--danger-light)', color: 'var(--danger)', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: '0.88rem' }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                name="fullName"
                className="form-input"
                placeholder="e.g. Samantha Wright"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Student ID *</label>
              <input
                type="text"
                name="studentId"
                className="form-input"
                placeholder="e.g. STU2026100"
                value={formData.studentId}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">University Email *</label>
              <input
                type="email"
                name="email"
                className="form-input"
                placeholder="student@univ.edu"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password * (min 6 chars)</label>
              <input
                type="password"
                name="password"
                className="form-input"
                placeholder="••••••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">College / Institute</label>
              <input
                type="text"
                name="college"
                className="form-input"
                placeholder="e.g. Faculty of Technology"
                value={formData.college}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Department / Major</label>
              <input
                type="text"
                name="department"
                className="form-input"
                placeholder="e.g. Computer Science & AI"
                value={formData.department}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Study Year</label>
            <select
              name="studyYear"
              className="form-select"
              value={formData.studyYear}
              onChange={handleChange}
            >
              <option value="Year 1">Year 1 (Freshman)</option>
              <option value="Year 2">Year 2 (Sophomore)</option>
              <option value="Year 3">Year 3 (Junior)</option>
              <option value="Year 4">Year 4 (Senior)</option>
              <option value="Graduate / Masters">Graduate / Masters</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Bio / Technical Interests (Optional)</label>
            <textarea
              name="bio"
              className="form-textarea"
              rows={2}
              placeholder="e.g. Interested in cloud microservices, reactive frontends, and distributed systems..."
              value={formData.bio}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting}
            style={{ width: '100%', marginTop: '0.75rem', padding: '0.85rem' }}
          >
            {submitting ? 'Creating Student Profile...' : 'Complete Registration'}
            {!submitting && <ArrowRight size={18} />}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
