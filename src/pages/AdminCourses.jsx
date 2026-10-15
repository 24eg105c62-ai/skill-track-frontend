import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { courseApi } from '../api/courseApi';
import { adminApi } from '../api/adminApi';
import {
  BookOpen,
  Plus,
  Trash2,
  Edit2,
  Layers,
  FileText,
  CheckCircle,
  AlertCircle,
  X,
  ExternalLink
} from 'lucide-react';

export default function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Modals state
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showModuleModal, setShowModuleModal] = useState(false);
  const [showTopicModal, setShowTopicModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedCourseDetail, setSelectedCourseDetail] = useState(null);

  // Form states
  const [courseForm, setCourseForm] = useState({
    title: '',
    slug: '',
    description: '',
    category: 'Backend Engineering',
    difficultyLevel: 'INTERMEDIATE',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
    published: true,
  });

  const [moduleForm, setModuleForm] = useState({
    courseId: '',
    title: '',
    moduleOrder: 1,
  });

  const [topicForm, setTopicForm] = useState({
    moduleId: '',
    title: '',
    content: '',
    readingTimeMinutes: 5,
    topicOrder: 1,
  });

  const loadCourses = async () => {
    setLoading(true);
    try {
      const res = await courseApi.getCourses({ size: 50 });
      setCourses(res.content || []);
    } catch (err) {
      setError(err.message || 'Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      await adminApi.createCourse(courseForm);
      setSuccess('Course created successfully!');
      setShowCourseModal(false);
      setCourseForm({
        title: '',
        slug: '',
        description: '',
        category: 'Backend Engineering',
        difficultyLevel: 'INTERMEDIATE',
        thumbnailUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
        published: true,
      });
      loadCourses();
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(err.message || 'Failed to create course');
    }
  };

  const handleDeleteCourse = async (courseId, title) => {
    if (!window.confirm(`Are you sure you want to delete course "${title}"? This will delete associated modules and questions.`)) {
      return;
    }
    try {
      await adminApi.deleteCourse(courseId);
      setSuccess(`Course "${title}" deleted.`);
      loadCourses();
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(err.message || 'Failed to delete course');
    }
  };

  const handleOpenModuleModal = (course) => {
    setSelectedCourse(course);
    setModuleForm({
      courseId: course.id,
      title: '',
      moduleOrder: 1,
    });
    setShowModuleModal(true);
  };

  const handleCreateModule = async (e) => {
    e.preventDefault();
    try {
      await adminApi.addModule(moduleForm.courseId, {
        title: moduleForm.title,
        moduleOrder: parseInt(moduleForm.moduleOrder, 10),
      });
      setSuccess(`Module added to ${selectedCourse?.title}!`);
      setShowModuleModal(false);
      loadCourses();
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(err.message || 'Failed to add module');
    }
  };

  const handleOpenTopicModal = async (course) => {
    setSelectedCourse(course);
    try {
      const detail = await courseApi.getCourseDetail(course.id);
      setSelectedCourseDetail(detail);
      const defaultModId = detail.modules && detail.modules.length > 0 ? detail.modules[0].id : '';
      setTopicForm({
        moduleId: defaultModId,
        title: '',
        content: '## Overview\n\nExplain key engineering concepts and code examples here...',
        readingTimeMinutes: 5,
        topicOrder: 1,
      });
      setShowTopicModal(true);
    } catch (err) {
      setError(err.message || 'Failed to load course modules');
    }
  };

  const handleCreateTopic = async (e) => {
    e.preventDefault();
    if (!topicForm.moduleId) {
      setError('Please select or create a module first');
      return;
    }
    try {
      await adminApi.addTopic(topicForm.moduleId, {
        title: topicForm.title,
        content: topicForm.content,
        readingTimeMinutes: parseInt(topicForm.readingTimeMinutes, 10),
        topicOrder: parseInt(topicForm.topicOrder, 10),
      });
      setSuccess(`Topic "${topicForm.title}" added successfully!`);
      setShowTopicModal(false);
      loadCourses();
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(err.message || 'Failed to add topic');
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, letterSpacing: '-0.03em' }}>
            Course & Curriculum Management
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Create technical learning paths, assemble module structures, and publish syllabus topics.
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => setShowCourseModal(true)}>
          <Plus size={17} /> Create New Course
        </button>
      </div>

      {success && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--success-light)', color: 'var(--success)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }}>
          <CheckCircle size={18} />
          <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{success}</span>
        </div>
      )}

      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--danger-light)', color: 'var(--danger)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }}>
          <AlertCircle size={18} />
          <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{error}</span>
        </div>
      )}

      {/* Courses List */}
      <div className="card">
        {loading ? (
          <div className="spinner" />
        ) : courses.length === 0 ? (
          <div className="empty-state">
            <BookOpen size={40} className="empty-state-icon" />
            <h3>No courses created yet</h3>
            <p style={{ marginTop: '0.4rem', color: 'var(--text-secondary)' }}>Click "Create New Course" above to get started.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Course Title</th>
                  <th>Category</th>
                  <th>Difficulty</th>
                  <th>Status</th>
                  <th>Quick Actions</th>
                  <th>Manage</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{c.title}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>slug: {c.slug}</div>
                    </td>
                    <td>
                      <span className="badge badge-purple">{c.category}</span>
                    </td>
                    <td>
                      <span className="badge badge-primary">{c.difficultyLevel}</span>
                    </td>
                    <td>
                      {c.published !== false ? (
                        <span className="badge badge-success"><CheckCircle size={12} /> Published</span>
                      ) : (
                        <span className="badge badge-warning">Draft</span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleOpenModuleModal(c)}
                          title="Add module to course"
                        >
                          <Layers size={13} /> +Module
                        </button>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleOpenTopicModal(c)}
                          title="Add topic to module"
                        >
                          <FileText size={13} /> +Topic
                        </button>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <Link to={`/courses/${c.id}`} className="btn-icon" title="View Student Course Page" style={{ width: 32, height: 32 }}>
                          <ExternalLink size={14} />
                        </Link>
                        <button
                          className="btn-icon"
                          style={{ width: 32, height: 32, color: 'var(--danger)' }}
                          onClick={() => handleDeleteCourse(c.id, c.title)}
                          title="Delete Course"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL 1: Create Course */}
      {showCourseModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Create New Technical Course</h3>
              <button className="btn-icon" onClick={() => setShowCourseModal(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleCreateCourse}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Course Title</label>
                  <input
                    type="text"
                    className="form-input"
                    value={courseForm.title}
                    onChange={(e) => {
                      const title = e.target.value;
                      setCourseForm({
                        ...courseForm,
                        title,
                        slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
                      });
                    }}
                    placeholder="e.g. Distributed Systems & Docker Containers"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">URL Slug</label>
                  <input
                    type="text"
                    className="form-input"
                    value={courseForm.slug}
                    onChange={(e) => setCourseForm({ ...courseForm, slug: e.target.value })}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select
                      className="form-select"
                      value={courseForm.category}
                      onChange={(e) => setCourseForm({ ...courseForm, category: e.target.value })}
                    >
                      <option value="Backend Engineering">Backend Engineering</option>
                      <option value="Frontend Development">Frontend Development</option>
                      <option value="Database Engineering">Database Engineering</option>
                      <option value="DevOps & Cloud">DevOps & Cloud</option>
                      <option value="System Design">System Design</option>
                      <option value="Security & Networks">Security & Networks</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Difficulty Level</label>
                    <select
                      className="form-select"
                      value={courseForm.difficultyLevel}
                      onChange={(e) => setCourseForm({ ...courseForm, difficultyLevel: e.target.value })}
                    >
                      <option value="BEGINNER">BEGINNER</option>
                      <option value="INTERMEDIATE">INTERMEDIATE</option>
                      <option value="ADVANCED">ADVANCED</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-textarea"
                    rows={3}
                    value={courseForm.description}
                    onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                    placeholder="Provide curriculum outcomes, prerequisites, and learning highlights..."
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Thumbnail Image URL</label>
                  <input
                    type="text"
                    className="form-input"
                    value={courseForm.thumbnailUrl}
                    onChange={(e) => setCourseForm({ ...courseForm, thumbnailUrl: e.target.value })}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <input
                    type="checkbox"
                    id="publishedCheck"
                    checked={courseForm.published}
                    onChange={(e) => setCourseForm({ ...courseForm, published: e.target.checked })}
                  />
                  <label htmlFor="publishedCheck" style={{ fontSize: '0.9rem', cursor: 'pointer' }}>
                    Publish course immediately (visible to all students)
                  </label>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowCourseModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Add Module */}
      {showModuleModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>
                Add Module to "{selectedCourse?.title}"
              </h3>
              <button className="btn-icon" onClick={() => setShowModuleModal(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleCreateModule}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Module Title</label>
                  <input
                    type="text"
                    className="form-input"
                    value={moduleForm.title}
                    onChange={(e) => setModuleForm({ ...moduleForm, title: e.target.value })}
                    placeholder="e.g. Module 3: Advanced Transaction Management"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Display Order</label>
                  <input
                    type="number"
                    min="1"
                    className="form-input"
                    value={moduleForm.moduleOrder}
                    onChange={(e) => setModuleForm({ ...moduleForm, moduleOrder: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModuleModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Add Module
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Add Topic */}
      {showTopicModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>
                Add Topic to "{selectedCourse?.title}"
              </h3>
              <button className="btn-icon" onClick={() => setShowTopicModal(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleCreateTopic}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Target Module</label>
                  {(!selectedCourseDetail?.modules || selectedCourseDetail.modules.length === 0) ? (
                    <div style={{ color: 'var(--danger)', fontSize: '0.88rem' }}>
                      No modules found in this course. Please add a module first!
                    </div>
                  ) : (
                    <select
                      className="form-select"
                      value={topicForm.moduleId}
                      onChange={(e) => setTopicForm({ ...topicForm, moduleId: e.target.value })}
                      required
                    >
                      {selectedCourseDetail.modules.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.title}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Topic Title</label>
                  <input
                    type="text"
                    className="form-input"
                    value={topicForm.title}
                    onChange={(e) => setTopicForm({ ...topicForm, title: e.target.value })}
                    placeholder="e.g. Distributed Lock Coordination with Redis"
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Estimated Reading Time (mins)</label>
                    <input
                      type="number"
                      min="1"
                      className="form-input"
                      value={topicForm.readingTimeMinutes}
                      onChange={(e) => setTopicForm({ ...topicForm, readingTimeMinutes: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Topic Order in Module</label>
                    <input
                      type="number"
                      min="1"
                      className="form-input"
                      value={topicForm.topicOrder}
                      onChange={(e) => setTopicForm({ ...topicForm, topicOrder: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Topic Content (Markdown supported)</label>
                  <textarea
                    className="form-textarea"
                    rows={6}
                    value={topicForm.content}
                    onChange={(e) => setTopicForm({ ...topicForm, content: e.target.value })}
                    placeholder="Write detailed instructional content, architectural guidelines, code snippets..."
                    required
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowTopicModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={!selectedCourseDetail?.modules?.length}>
                  Add Topic
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
