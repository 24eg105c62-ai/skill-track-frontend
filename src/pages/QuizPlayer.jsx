import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { quizApi } from '../api/quizApi';
import {
  HelpCircle,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Award,
  TrendingUp,
  RotateCcw
} from 'lucide-react';

export default function QuizPlayer() {
  const { topicId } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // questionId -> optionId
  const [timeSpentSeconds, setTimeSpentSeconds] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(900); // 15 minute limit
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadQuiz() {
      try {
        const data = await quizApi.getQuizQuestions(topicId);
        if (!data || data.length === 0) {
          setError('No questions available for this topic yet.');
        } else {
          setQuestions(data);
        }
      } catch (err) {
        setError(err.message || 'Failed to load quiz');
      } finally {
        setLoading(false);
      }
    }
    loadQuiz();
  }, [topicId]);

  // Timer tick
  useEffect(() => {
    if (result || loading || error || questions.length === 0) return;

    const interval = setInterval(() => {
      setTimeSpentSeconds((prev) => prev + 1);
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [result, loading, error, questions.length]);

  const handleSelectOption = (questionId, optionId) => {
    if (result) return; // Locked once submitted
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handleSubmitQuiz = async () => {
    setSubmitting(true);
    try {
      const submission = {
        topicId: parseInt(topicId, 10),
        timeSpentSeconds,
        answers: selectedAnswers,
      };
      const res = await quizApi.submitQuiz(submission);
      setResult(res);
    } catch (err) {
      alert('Quiz submission failed: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="spinner" />;

  if (error) {
    return (
      <div className="card" style={{ maxWidth: 600, margin: '2rem auto', textAlign: 'center', padding: '2.5rem' }}>
        <AlertCircle size={44} style={{ color: 'var(--danger)', margin: '0 auto 1rem' }} />
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.75rem' }}>Quiz Unavailable</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>{error}</p>
        <button className="btn btn-primary" onClick={() => navigate('/quizzes')}>
          Back to Quizzes
        </button>
      </div>
    );
  }

  // --- RESULT VIEW ---
  if (result) {
    return (
      <div style={{ maxWidth: 850, margin: '0 auto' }}>
        {/* Score Summary Card */}
        <div className="card" style={{ textAlign: 'center', padding: '2.5rem 2rem', marginBottom: '2rem' }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              margin: '0 auto 1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: result.passed ? 'var(--success-light)' : 'var(--danger-light)',
              color: result.passed ? 'var(--success)' : 'var(--danger)',
            }}
          >
            {result.passed ? <CheckCircle size={40} /> : <XCircle size={40} />}
          </div>

          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
            {result.passed ? 'Assessment Passed! 🎉' : 'Assessment Completed'}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
            {result.topicTitle} • Completed in {Math.floor(result.timeSpentSeconds / 60)}m {result.timeSpentSeconds % 60}s
          </p>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '2rem', padding: '1rem 2rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', marginBottom: '1.5rem' }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Score</div>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: result.passed ? 'var(--success)' : 'var(--danger)' }}>
                {result.percentage}%
              </div>
            </div>
            <div style={{ width: 1, height: 40, background: 'var(--border)' }} />
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Points Earned</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>
                {result.score} / {result.totalPoints}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/predictions" className="btn btn-secondary">
              <TrendingUp size={16} /> View Score Predictions
            </Link>
            <button className="btn btn-primary" onClick={() => window.location.reload()}>
              <RotateCcw size={16} /> Retake Assessment
            </button>
          </div>
        </div>

        {/* Detailed Question Explanations Breakdown */}
        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1rem' }}>
          Detailed Solution & Answer Explanations
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {result.questionResults?.map((qr, idx) => (
            <div
              key={qr.questionId}
              className="card"
              style={{
                borderLeft: `4px solid ${qr.correct ? 'var(--success)' : 'var(--danger)'}`,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                  Question {idx + 1}
                </span>
                <span className={`badge ${qr.correct ? 'badge-success' : 'badge-danger'}`}>
                  {qr.correct ? `+${qr.pointsAwarded} pts (Correct)` : '0 pts (Incorrect)'}
                </span>
              </div>

              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1rem', lineHeight: 1.4 }}>
                {qr.questionText}
              </h3>

              {/* Options choices */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                {qr.options?.map((opt) => {
                  let bg = 'var(--bg-surface)';
                  let border = 'var(--border)';
                  let icon = null;

                  if (opt.correct) {
                    bg = 'var(--success-light)';
                    border = 'var(--success)';
                    icon = <CheckCircle size={16} style={{ color: 'var(--success)', flexShrink: 0 }} />;
                  } else if (opt.selected && !opt.correct) {
                    bg = 'var(--danger-light)';
                    border = 'var(--danger)';
                    icon = <XCircle size={16} style={{ color: 'var(--danger)', flexShrink: 0 }} />;
                  }

                  return (
                    <div
                      key={opt.id}
                      style={{
                        padding: '0.75rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        background: bg,
                        border: `1px solid ${border}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '0.9rem',
                        fontWeight: opt.selected || opt.correct ? 600 : 400,
                      }}
                    >
                      <span>{opt.optionText}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {opt.selected && (
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>(Your Answer)</span>
                        )}
                        {icon}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Technical Explanation */}
              {qr.explanation && (
                <div style={{ padding: '0.85rem 1rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontSize: '0.88rem' }}>
                  <strong style={{ color: 'var(--primary)', display: 'block', marginBottom: '0.25rem' }}>
                    💡 Explanation:
                  </strong>
                  <span style={{ color: 'var(--text-secondary)' }}>{qr.explanation}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // --- ACTIVE QUIZ PLAYER VIEW ---
  const currentQuestion = questions[currentIndex];
  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);
  const answeredCount = Object.keys(selectedAnswers).length;

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      {/* Top Status Bar: Question Index & Countdown Timer */}
      <div className="card" style={{ padding: '1rem 1.5rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            Question {currentIndex + 1} of {questions.length}
          </span>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            {answeredCount} answered
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.5rem 1rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-full)', border: '1px solid var(--border)' }}>
          <Clock size={18} style={{ color: remainingSeconds < 120 ? 'var(--danger)' : 'var(--primary)' }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '1rem', color: remainingSeconds < 120 ? 'var(--danger)' : 'var(--text-primary)' }}>
            {formatTimer(remainingSeconds)}
          </span>
        </div>
      </div>

      {/* Progress Track */}
      <div className="prediction-range-track" style={{ height: 6, margin: '0 0 1.5rem' }}>
        <div className="prediction-range-bar" style={{ width: `${progressPercent}%` }} />
      </div>

      {/* Question Card */}
      <div className="card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <span className="badge badge-purple">{currentQuestion.difficulty}</span>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            {currentQuestion.points} Points
          </span>
        </div>

        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, lineHeight: 1.4, marginBottom: '1.75rem' }}>
          {currentQuestion.questionText}
        </h2>

        {/* Answer Options (Anti-cheating: No correctness exposed) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {currentQuestion.options?.map((opt) => {
            const isSelected = selectedAnswers[currentQuestion.id] === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleSelectOption(currentQuestion.id, opt.id)}
                style={{
                  padding: '1rem 1.25rem',
                  borderRadius: 'var(--radius-md)',
                  background: isSelected ? 'var(--primary-light)' : 'var(--bg-surface)',
                  border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border)',
                  color: isSelected ? 'var(--primary)' : 'var(--text-primary)',
                  fontWeight: isSelected ? 600 : 400,
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  transition: 'all var(--transition-fast)',
                }}
              >
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    border: isSelected ? '6px solid var(--primary)' : '2px solid var(--text-muted)',
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontSize: '0.95rem' }}>{opt.optionText}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation & Submit Buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          className="btn btn-secondary"
          onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
          disabled={currentIndex === 0}
        >
          <ArrowLeft size={16} /> Previous
        </button>

        {currentIndex < questions.length - 1 ? (
          <button
            className="btn btn-primary"
            onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
          >
            Next Question <ArrowRight size={16} />
          </button>
        ) : (
          <button
            className="btn btn-primary"
            onClick={handleSubmitQuiz}
            disabled={submitting}
            style={{ background: 'var(--success)' }}
          >
            {submitting ? 'Evaluating Submission...' : 'Submit Assessment'}
          </button>
        )}
      </div>
    </div>
  );
}
