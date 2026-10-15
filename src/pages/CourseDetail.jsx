import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { courseApi } from '../api/courseApi';
import {
  BookOpen,
  CheckCircle,
  Clock,
  HelpCircle,
  Bookmark,
  Layers,
  ChevronDown,
  ChevronUp,
  X,
  ArrowRight,
  ArrowLeft,
  Award
} from 'lucide-react';

export default function CourseDetail() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTopic, setActiveTopic] = useState(null);
  const [readingTopic, setReadingTopic] = useState(null);
  const [completingTopic, setCompletingTopic] = useState(false);

  useEffect(() => {
    async function fetchCourse() {
      try {
        const data = await courseApi.getCourseDetail(id);
        setCourse(data);
      } catch (err) {
        setError(err.message || 'Failed to load course details');
      } finally {
        setLoading(false);
      }
    }
    fetchCourse();
  }, [id]);

  const handleEnroll = async () => {
    try {
      await courseApi.enroll(id);
      const updated = await courseApi.getCourseDetail(id);
      setCourse(updated);
    } catch (err) {
      alert('Enrollment error: ' + err.message);
    }
  };

  const handleToggleBookmark = async () => {
    try {
      const res = await courseApi.toggleBookmark(id);
      setCourse((prev) => ({ ...prev, bookmarked: res.bookmarked }));
    } catch (err) {
      console.error('Bookmark error', err);
    }
  };

  const openLesson = async (topicId) => {
    try {
      const topicData = await courseApi.getTopicDetail(topicId);
      setReadingTopic(topicData);
    } catch (err) {
      alert('Failed to load topic lesson: ' + err.message);
    }
  };

  const handleCompleteTopic = async (topicId) => {
    setCompletingTopic(true);
    try {
      const res = await courseApi.completeTopic(topicId);
      setReadingTopic((prev) => (prev ? { ...prev, completed: true } : prev));
      // Refresh course state
      const updatedCourse = await courseApi.getCourseDetail(id);
      setCourse(updatedCourse);
    } catch (err) {
      alert('Could not complete topic: ' + err.message);
    } finally {
      setCompletingTopic(false);
    }
  };

  if (loading) return <div className="spinner" />;
  if (error) return <div style={{ color: 'var(--danger)', padding: '2rem', textAlign: 'center' }}>{error}</div>;
  if (!course) return null;

  return (
    <div>
      {/* Course Banner */}
      <div className="card" style={{ marginBottom: '2rem', padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <span className="badge badge-purple">{course.category}</span>
              <span className="badge badge-primary">{course.difficultyLevel}</span>
            </div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>
              {course.title}
            </h1>
            <p style={{ color: 'var(--text-secondary)', maxWidth: 750, lineHeight: 1.5 }}>
              {course.description}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <button
              className="btn btn-icon"
              onClick={handleToggleBookmark}
              title={course.bookmarked ? 'Bookmarked' : 'Add bookmark'}
              style={{ color: course.bookmarked ? 'var(--warning)' : 'inherit' }}
            >
              <Bookmark size={20} fill={course.bookmarked ? 'currentColor' : 'none'} />
            </button>

            {!course.enrolled ? (
              <button className="btn btn-primary" onClick={handleEnroll}>
                Enroll in Course Free
              </button>
            ) : (
              <span className="badge badge-success" style={{ padding: '0.6rem 1rem', fontSize: '0.85rem' }}>
                <CheckCircle size={16} /> Enrolled Student
              </span>
            )}
          </div>
        </div>

        {/* Progress bar if enrolled */}
        {course.enrolled && (
          <div style={{ background: 'var(--bg-surface)', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.4rem' }}>
              <span>Curriculum Progress: {course.completedTopics} of {course.totalTopics} Topics Completed</span>
              <span style={{ color: 'var(--primary)' }}>{course.progressPercent}%</span>
            </div>
            <div className="prediction-range-track" style={{ height: 8, margin: 0 }}>
              <div className="prediction-range-bar" style={{ width: `${course.progressPercent}%` }} />
            </div>
          </div>
        )}
      </div>

      {/* Modules & Topics Syllabus */}
      <div>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Layers size={22} style={{ color: 'var(--primary)' }} /> Course Modules & Lesson Syllabus
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {course.modules?.map((module, mIdx) => (
            <div key={module.id} className="card" style={{ padding: '1.25rem 1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-primary)' }}>
                {module.title}
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {module.topics?.map((topic, tIdx) => (
                  <div
                    key={topic.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.9rem 1.15rem',
                      background: 'var(--bg-surface)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border)',
                      cursor: 'pointer',
                      transition: 'all var(--transition-fast)',
                    }}
                    onClick={() => openLesson(topic.id)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      <div
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: '50%',
                          background: topic.completed ? 'var(--success-light)' : 'var(--bg-surface-hover)',
                          color: topic.completed ? 'var(--success)' : 'var(--text-muted)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {topic.completed ? <CheckCircle size={16} /> : <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>{tIdx + 1}</span>}
                      </div>

                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{topic.title}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <Clock size={12} /> {topic.readingTimeMinutes} min read
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }} onClick={(e) => e.stopPropagation()}>
                      {topic.quizAvailable && (
                        <Link
                          to={`/quiz/${topic.id}`}
                          className="btn btn-secondary btn-sm"
                          title="Practice topic quiz"
                        >
                          <HelpCircle size={15} /> Quiz
                        </Link>
                      )}
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => openLesson(topic.id)}
                      >
                        Read Lesson →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lesson Reader Modal */}
      {readingTopic && (
        <div className="modal-overlay" onClick={() => setReadingTopic(null)}>
          <div
            className="modal-card"
            style={{ maxWidth: 800 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <span className="badge badge-purple" style={{ marginBottom: '0.35rem' }}>
                  {readingTopic.moduleTitle}
                </span>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{readingTopic.title}</h2>
              </div>
              <button className="btn-icon" onClick={() => setReadingTopic(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
              <div
                style={{
                  fontSize: '0.95rem',
                  lineHeight: 1.7,
                  color: 'var(--text-primary)',
                  whiteSpace: 'pre-line',
                }}
              >
                {readingTopic.content || 'Content for this technical topic is being curated.'}
              </div>
            </div>

            <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {readingTopic.prevTopicId && (
                  <button className="btn btn-secondary btn-sm" onClick={() => openLesson(readingTopic.prevTopicId)}>
                    <ArrowLeft size={15} /> Previous
                  </button>
                )}
                {readingTopic.nextTopicId && (
                  <button className="btn btn-secondary btn-sm" onClick={() => openLesson(readingTopic.nextTopicId)}>
                    Next <ArrowRight size={15} />
                  </button>
                )}
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                {readingTopic.quizAvailable && (
                  <Link
                    to={`/quiz/${readingTopic.id}`}
                    className="btn btn-secondary btn-sm"
                    onClick={() => setReadingTopic(null)}
                  >
                    <HelpCircle size={16} /> Take Topic Quiz
                  </Link>
                )}

                <button
                  className={`btn ${readingTopic.completed ? 'btn-secondary' : 'btn-primary'} btn-sm`}
                  onClick={() => handleCompleteTopic(readingTopic.id)}
                  disabled={completingTopic}
                >
                  <CheckCircle size={16} />
                  {readingTopic.completed ? 'Completed ✓' : completingTopic ? 'Saving...' : 'Mark as Complete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
