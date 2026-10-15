import React, { useState, useEffect } from 'react';
import { courseApi } from '../api/courseApi';
import { quizApi } from '../api/quizApi';
import { adminApi } from '../api/adminApi';
import {
  HelpCircle,
  Plus,
  Trash2,
  CheckCircle,
  AlertCircle,
  X,
  Database,
  Layers,
  Sparkles
} from 'lucide-react';

export default function AdminQuizzes() {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [courseDetail, setCourseDetail] = useState(null);
  const [selectedTopicId, setSelectedTopicId] = useState('');
  const [questions, setQuestions] = useState([]);

  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [showQuestionModal, setShowQuestionModal] = useState(false);

  const [questionForm, setQuestionForm] = useState({
    topicId: '',
    questionText: '',
    difficulty: 'MEDIUM',
    points: 10,
    explanation: '',
    options: [
      { optionText: '', isCorrect: true, optionOrder: 1 },
      { optionText: '', isCorrect: false, optionOrder: 2 },
      { optionText: '', isCorrect: false, optionOrder: 3 },
      { optionText: '', isCorrect: false, optionOrder: 4 },
    ],
  });

  // Load courses on mount
  useEffect(() => {
    async function init() {
      try {
        const res = await courseApi.getCourses({ size: 50 });
        const list = res.content || [];
        setCourses(list);
        if (list.length > 0) {
          setSelectedCourseId(list[0].id);
        }
      } catch (err) {
        setError(err.message || 'Failed to load courses');
      } finally {
        setLoadingCourses(false);
      }
    }
    init();
  }, []);

  // When course selected, load course detail to get modules and topics
  useEffect(() => {
    if (!selectedCourseId) return;

    async function fetchCourseTopics() {
      try {
        const detail = await courseApi.getCourseDetail(selectedCourseId);
        setCourseDetail(detail);

        // Flatten topics
        const allTopics = [];
        detail.modules?.forEach((m) => {
          m.topics?.forEach((t) => allTopics.push(t));
        });

        if (allTopics.length > 0) {
          setSelectedTopicId(allTopics[0].id);
        } else {
          setSelectedTopicId('');
          setQuestions([]);
        }
      } catch (err) {
        setError(err.message || 'Failed to load topics for course');
      }
    }
    fetchCourseTopics();
  }, [selectedCourseId]);

  // When topic selected, load questions
  const loadQuestions = async () => {
    if (!selectedTopicId) {
      setQuestions([]);
      return;
    }
    setLoadingQuestions(true);
    try {
      const list = await quizApi.getQuizQuestions(selectedTopicId);
      setQuestions(list || []);
    } catch (err) {
      setError(err.message || 'Failed to load questions for topic');
      setQuestions([]);
    } finally {
      setLoadingQuestions(false);
    }
  };

  useEffect(() => {
    loadQuestions();
  }, [selectedTopicId]);

  const handleOpenModal = () => {
    if (!selectedTopicId) {
      setError('Please select a course and topic first');
      return;
    }
    setQuestionForm({
      topicId: selectedTopicId,
      questionText: '',
      difficulty: 'MEDIUM',
      points: 10,
      explanation: '',
      options: [
        { optionText: '', isCorrect: true, optionOrder: 1 },
        { optionText: '', isCorrect: false, optionOrder: 2 },
        { optionText: '', isCorrect: false, optionOrder: 3 },
        { optionText: '', isCorrect: false, optionOrder: 4 },
      ],
    });
    setShowQuestionModal(true);
  };

  const handleOptionTextChange = (idx, text) => {
    const updated = [...questionForm.options];
    updated[idx].optionText = text;
    setQuestionForm({ ...questionForm, options: updated });
  };

  const handleOptionCorrectChange = (idx) => {
    const updated = questionForm.options.map((opt, i) => ({
      ...opt,
      isCorrect: i === idx,
    }));
    setQuestionForm({ ...questionForm, options: updated });
  };

  const handleCreateQuestion = async (e) => {
    e.preventDefault();
    setError('');

    // Validate options
    const emptyOpt = questionForm.options.find((o) => !o.optionText.trim());
    if (emptyOpt) {
      setError('All 4 answer options must have text');
      return;
    }

    try {
      await adminApi.createQuestion({
        ...questionForm,
        topicId: parseInt(selectedTopicId, 10),
        points: parseInt(questionForm.points, 10),
      });

      setSuccess('Question added to question bank successfully!');
      setShowQuestionModal(false);
      loadQuestions();
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(err.message || 'Failed to create question');
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (!window.confirm('Are you sure you want to delete this question?')) return;
    try {
      await adminApi.deleteQuestion(questionId);
      setSuccess('Question deleted.');
      loadQuestions();
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(err.message || 'Failed to delete question');
    }
  };

  // Flatten all topics for current selected course
  const currentTopics = [];
  courseDetail?.modules?.forEach((m) => {
    m.topics?.forEach((t) => {
      currentTopics.push({ ...t, moduleTitle: m.title });
    });
  });

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, letterSpacing: '-0.03em' }}>
            Question Bank & Assessment Manager
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Author topic-based MCQs, configure server-evaluated correct options, and supply post-submission explanations.
          </p>
        </div>

        <button className="btn btn-primary" onClick={handleOpenModal} disabled={!selectedTopicId}>
          <Plus size={17} /> Add New Question
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

      {/* Selectors Bar */}
      <div className="card" style={{ marginBottom: '1.75rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
        <div>
          <label className="form-label">Select Course</label>
          <select
            className="form-select"
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            disabled={loadingCourses}
          >
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title} ({c.category})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="form-label">Select Topic</label>
          {currentTopics.length === 0 ? (
            <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', paddingTop: '0.6rem' }}>
              No topics in this course. Please create a topic in Course Manager first.
            </div>
          ) : (
            <select
              className="form-select"
              value={selectedTopicId}
              onChange={(e) => setSelectedTopicId(e.target.value)}
            >
              {currentTopics.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.moduleTitle} → {t.title}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Questions List */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Database size={19} style={{ color: 'var(--warning)' }} /> Questions in Selected Topic ({questions.length})
          </h2>
        </div>

        {loadingQuestions ? (
          <div className="spinner" />
        ) : questions.length === 0 ? (
          <div className="empty-state">
            <HelpCircle size={40} className="empty-state-icon" />
            <h3>No questions found for this topic</h3>
            <p style={{ marginTop: '0.4rem', color: 'var(--text-secondary)' }}>
              Click "Add New Question" above to populate the question bank for this topic.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {questions.map((q, idx) => (
              <div
                key={q.id}
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.25rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1.1rem' }}>
                      #{idx + 1}
                    </span>
                    <div>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 600, lineHeight: 1.4 }}>
                        {q.questionText}
                      </h3>
                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.4rem' }}>
                        <span className="badge badge-purple">{q.difficulty}</span>
                        <span className="badge badge-primary">{q.points} Points</span>
                      </div>
                    </div>
                  </div>

                  <button
                    className="btn-icon"
                    style={{ color: 'var(--danger)', flexShrink: 0 }}
                    onClick={() => handleDeleteQuestion(q.id)}
                    title="Delete Question"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* Display Options */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.6rem', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border)' }}>
                  {q.options?.map((opt, optIdx) => (
                    <div
                      key={opt.id}
                      style={{
                        padding: '0.65rem 0.85rem',
                        background: 'var(--bg-input)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.88rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                      }}
                    >
                      <span style={{ fontWeight: 700, color: 'var(--text-muted)' }}>
                        {String.fromCharCode(65 + optIdx)}.
                      </span>
                      <span>{opt.optionText}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL: Create Question */}
      {showQuestionModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Add Question to Topic Bank</h3>
              <button className="btn-icon" onClick={() => setShowQuestionModal(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleCreateQuestion}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Question Text</label>
                  <textarea
                    className="form-textarea"
                    rows={3}
                    value={questionForm.questionText}
                    onChange={(e) => setQuestionForm({ ...questionForm, questionText: e.target.value })}
                    placeholder="e.g. Which garbage collection algorithm is optimized for low latency in Java 21?"
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Difficulty</label>
                    <select
                      className="form-select"
                      value={questionForm.difficulty}
                      onChange={(e) => setQuestionForm({ ...questionForm, difficulty: e.target.value })}
                    >
                      <option value="EASY">EASY</option>
                      <option value="MEDIUM">MEDIUM</option>
                      <option value="HARD">HARD</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Points Awarded</label>
                    <input
                      type="number"
                      min="1"
                      className="form-input"
                      value={questionForm.points}
                      onChange={(e) => setQuestionForm({ ...questionForm, points: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Post-Quiz Explanation (Displayed only after submit)</label>
                  <textarea
                    className="form-textarea"
                    rows={2}
                    value={questionForm.explanation}
                    onChange={(e) => setQuestionForm({ ...questionForm, explanation: e.target.value })}
                    placeholder="Explain why the correct answer is right and clarify common misconceptions..."
                    required
                  />
                </div>

                <div style={{ marginTop: '1.25rem' }}>
                  <label className="form-label" style={{ marginBottom: '0.6rem' }}>
                    4 Multiple Choice Options (Select the radio of the CORRECT answer)
                  </label>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {questionForm.options.map((opt, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <input
                          type="radio"
                          name="correctOptionRadio"
                          id={`radioOpt${idx}`}
                          checked={opt.isCorrect}
                          onChange={() => handleOptionCorrectChange(idx)}
                          style={{ width: 18, height: 18, cursor: 'pointer' }}
                        />
                        <span style={{ fontWeight: 700, width: 20 }}>{String.fromCharCode(65 + idx)}.</span>
                        <input
                          type="text"
                          className="form-input"
                          style={{
                            borderColor: opt.isCorrect ? 'var(--success)' : 'var(--border)',
                            background: opt.isCorrect ? 'var(--success-light)' : 'var(--bg-input)',
                          }}
                          value={opt.optionText}
                          onChange={(e) => handleOptionTextChange(idx, e.target.value)}
                          placeholder={`Option ${String.fromCharCode(65 + idx)} text...`}
                          required
                        />
                        {opt.isCorrect && (
                          <span className="badge badge-success" style={{ whiteSpace: 'nowrap' }}>
                            Correct Answer
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowQuestionModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
