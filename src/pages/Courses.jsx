import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { courseApi } from '../api/courseApi';
import {
  Search,
  BookOpen,
  Bookmark,
  CheckCircle,
  Clock,
  Layers,
  ArrowRight,
  Filter
} from 'lucide-react';

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedDifficulty, setSelectedDifficulty] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadCategories() {
      try {
        const cats = await courseApi.getCategories();
        setCategories(cats || []);
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    }
    loadCategories();
  }, []);

  useEffect(() => {
    async function loadCourses() {
      setLoading(true);
      setError('');
      try {
        const res = await courseApi.getCourses({
          search,
          category: selectedCategory,
          difficulty: selectedDifficulty,
        });
        setCourses(res.content || []);
      } catch (err) {
        setError(err.message || 'Failed to load courses');
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(() => {
      loadCourses();
    }, 250);

    return () => clearTimeout(timer);
  }, [search, selectedCategory, selectedDifficulty]);

  const handleToggleBookmark = async (courseId, e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const res = await courseApi.toggleBookmark(courseId);
      setCourses((prev) =>
        prev.map((c) => (c.id === courseId ? { ...c, bookmarked: res.bookmarked } : c))
      );
    } catch (err) {
      console.error('Failed to bookmark', err);
    }
  };

  const handleEnroll = async (courseId, e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await courseApi.enroll(courseId);
      setCourses((prev) =>
        prev.map((c) => (c.id === courseId ? { ...c, enrolled: true, progressPercent: 0 } : c))
      );
    } catch (err) {
      console.error('Enrollment error', err);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, letterSpacing: '-0.03em' }}>
          Technical Course Catalog
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Industry-aligned curricula with hands-on lesson modules, topic quizzes, and verifiable progress.
        </p>
      </div>

      {/* Search and Filters Bar */}
      <div className="card" style={{ padding: '1.25rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: '1 1 280px' }}>
            <Search size={18} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '2.5rem' }}
              placeholder="Search courses by title, keywords, or topics..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <select
              className="form-select"
              style={{ width: 'auto' }}
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
            >
              <option value="ALL">All Difficulties</option>
              <option value="BEGINNER">Beginner</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="ADVANCED">Advanced</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
          <button
            className={`btn btn-sm ${selectedCategory === 'ALL' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setSelectedCategory('ALL')}
          >
            All Tracks
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`btn btn-sm ${selectedCategory === cat ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Courses Grid */}
      {loading ? (
        <div className="spinner" />
      ) : error ? (
        <div style={{ textAlign: 'center', color: 'var(--danger)', padding: '2rem' }}>{error}</div>
      ) : courses.length === 0 ? (
        <div className="empty-state">
          <BookOpen size={44} className="empty-state-icon" />
          <h3>No courses matched your search criteria</h3>
          <p style={{ marginTop: '0.5rem' }}>Try refining your keywords or clearing selected filters.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {courses.map((course) => (
            <div
              key={course.id}
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                padding: 0,
              }}
            >
              {/* Thumbnail Header */}
              <div style={{ position: 'relative', height: 160, overflow: 'hidden', background: 'var(--bg-surface)' }}>
                <img
                  src={course.thumbnailUrl || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80'}
                  alt={course.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <button
                  type="button"
                  onClick={(e) => handleToggleBookmark(course.id, e)}
                  style={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    background: 'rgba(0, 0, 0, 0.65)',
                    border: 'none',
                    color: course.bookmarked ? 'var(--warning)' : 'white',
                    borderRadius: '50%',
                    width: 34,
                    height: 34,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    backdropFilter: 'blur(4px)',
                  }}
                  title={course.bookmarked ? 'Remove bookmark' : 'Bookmark course'}
                >
                  <Bookmark size={17} fill={course.bookmarked ? 'currentColor' : 'none'} />
                </button>
                <div style={{ position: 'absolute', bottom: 12, left: 12, display: 'flex', gap: '0.5rem' }}>
                  <span className="badge badge-purple">{course.category}</span>
                  <span className={`badge ${course.difficultyLevel === 'ADVANCED' ? 'badge-danger' : course.difficultyLevel === 'INTERMEDIATE' ? 'badge-warning' : 'badge-success'}`}>
                    {course.difficultyLevel}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', lineHeight: 1.3 }}>
                    {course.title}
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {course.description}
                  </p>
                </div>

                <div>
                  {/* Meta: modules, topics, progress */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Layers size={15} /> {course.moduleCount} Modules
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <BookOpen size={15} /> {course.topicCount} Topics
                    </span>
                  </div>

                  {course.enrolled && (
                    <div style={{ marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Course Progress</span>
                        <span style={{ color: 'var(--primary)' }}>{course.progressPercent}%</span>
                      </div>
                      <div className="prediction-range-track" style={{ height: 6, margin: 0 }}>
                        <div className="prediction-range-bar" style={{ width: `${course.progressPercent}%` }} />
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <Link to={`/courses/${course.id}`} className="btn btn-secondary btn-sm" style={{ flex: 1, justifyContent: 'center' }}>
                      {course.enrolled ? 'Resume Course' : 'View Syllabus'}
                    </Link>

                    {!course.enrolled ? (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={(e) => handleEnroll(course.id, e)}
                        style={{ padding: '0.4rem 1rem' }}
                      >
                        Enroll Free
                      </button>
                    ) : (
                      <span className="badge badge-success" style={{ padding: '0.45rem 0.65rem' }}>
                        <CheckCircle size={14} /> Enrolled
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
