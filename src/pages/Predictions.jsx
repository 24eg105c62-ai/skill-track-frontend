import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { predictionApi } from '../api/predictionApi';
import {
  TrendingUp,
  AlertTriangle,
  Sparkles,
  HelpCircle,
  ShieldCheck,
  Info,
  CheckCircle,
  Activity
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine
} from 'recharts';

export default function Predictions() {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadPrediction() {
      try {
        const res = await predictionApi.getMyPrediction();
        setPrediction(res);
      } catch (err) {
        setError(err.message || 'Failed to calculate predictions');
      } finally {
        setLoading(false);
      }
    }
    loadPrediction();
  }, []);

  if (loading) return <div className="spinner" />;

  const chartData = (prediction?.recentQuizScores && prediction.recentQuizScores.length > 0)
    ? prediction.recentQuizScores.map((score, idx) => ({
        quiz: `#${idx + 1}`,
        score: score,
      }))
    : [];

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, letterSpacing: '-0.03em' }}>
          Statistical Score Prediction Model
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Probabilistic readiness forecasting based on empirical quiz attempts, recency weights, and volatility metrics.
        </p>
      </div>

      {error && <div style={{ color: 'var(--danger)', marginBottom: '1.5rem' }}>{error}</div>}

      {/* Main Prediction Display Card */}
      <div className="card" style={{ padding: '2.5rem 2rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
              Target Domain
            </span>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>
              {prediction?.categoryOrTopic || 'Overall Technical Mastery'}
            </h2>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <span className="badge badge-purple" style={{ padding: '0.4rem 0.75rem' }}>
              Sample: {prediction?.sampleSize || 0} Quizzes
            </span>
            <span
              className={`badge ${
                prediction?.confidenceLevel === 'HIGH'
                  ? 'badge-success'
                  : prediction?.confidenceLevel === 'MODERATE'
                  ? 'badge-primary'
                  : 'badge-warning'
              }`}
              style={{ padding: '0.4rem 0.75rem' }}
            >
              Confidence: {prediction?.confidenceLevel || 'BASELINE'}
            </span>
          </div>
        </div>

        {/* Prediction Gauges */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ padding: '1.5rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
              Projected Midpoint Score
            </div>
            <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '-0.03em', margin: '0.25rem 0' }}>
              {prediction?.predictedScoreMid}%
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Expected baseline readiness
            </div>
          </div>

          <div style={{ padding: '1.5rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
              Empirical Prediction Interval
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: '0.5rem 0' }}>
              {prediction?.predictedScoreMin}% – {prediction?.predictedScoreMax}%
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Statistical 90% confidence spread
            </div>
          </div>
        </div>

        {/* Visual Spread Bar */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.4rem' }}>
            <span>0% (Untrained)</span>
            <span>Midpoint: {prediction?.predictedScoreMid}%</span>
            <span>100% (Full Mastery)</span>
          </div>
          <div className="prediction-range-track" style={{ height: 14 }}>
            <div
              className="prediction-range-bar"
              style={{
                marginLeft: `${Math.max(0, prediction?.predictedScoreMin || 60)}%`,
                width: `${Math.max(5, (prediction?.predictedScoreMax || 75) - (prediction?.predictedScoreMin || 60))}%`,
              }}
            />
          </div>
        </div>

        {/* Transparent Primary Factors */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Activity size={18} style={{ color: 'var(--primary)' }} /> Contributing Statistical Factors
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.75rem' }}>
            {prediction?.primaryFactors?.map((factor, idx) => (
              <div
                key={idx}
                style={{
                  padding: '0.85rem 1rem',
                  background: 'var(--bg-surface)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                  fontSize: '0.88rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                }}
              >
                <CheckCircle size={16} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                <span>{factor}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Mandatory Limitations & Legal Disclaimer (Module 5 requirement) */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            background: 'var(--bg-surface-hover)',
            borderRadius: 'var(--radius-md)',
            borderLeft: '4px solid var(--warning)',
            display: 'flex',
            gap: '1rem',
            alignItems: 'flex-start',
          }}
        >
          <Info size={22} style={{ color: 'var(--warning)', flexShrink: 0, marginTop: 2 }} />
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
              Limitations & Probabilistic Model Notice
            </div>
            <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {prediction?.limitationsDisclaimer}
            </div>
          </div>
        </div>
      </div>

      {/* Historical Quiz Progression Line Chart with Recharts */}
      {chartData.length > 0 && (
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem' }}>
            Historical Assessment Scores vs Predicted Midpoint
          </h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="quiz" stroke="var(--text-muted)" />
                <YAxis domain={[0, 100]} stroke="var(--text-muted)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--bg-surface)',
                    borderColor: 'var(--border)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                  }}
                />
                <ReferenceLine
                  y={prediction?.predictedScoreMid}
                  stroke="var(--primary)"
                  strokeDasharray="4 4"
                  label={{ value: `Predicted (${prediction?.predictedScoreMid}%)`, fill: 'var(--primary)', position: 'insideTopRight' }}
                />
                <Line type="monotone" dataKey="score" stroke="#10b981" strokeWidth={3} dot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Next Step Call to Action */}
      <div style={{ textAlign: 'center', padding: '1rem' }}>
        <Link to="/quizzes" className="btn btn-primary">
          <HelpCircle size={18} /> Take Another Quiz to Refine Prediction
        </Link>
      </div>
    </div>
  );
}
