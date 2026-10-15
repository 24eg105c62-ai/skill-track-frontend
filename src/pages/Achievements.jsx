import React, { useState, useEffect } from 'react';
import { achievementApi } from '../api/achievementApi';
import { useAuth } from '../context/AuthContext';
import {
  Award,
  Flame,
  Sparkles,
  GraduationCap,
  Brain,
  ThumbsUp,
  Heart,
  MessageSquare,
  Trash2,
  Send,
  CheckCircle,
  Clock,
  Lock,
  Share2
} from 'lucide-react';

export default function Achievements() {
  const { user, isAdmin } = useAuth();
  const [tab, setTab] = useState('badges'); // 'badges' | 'feed'
  const [badges, setBadges] = useState([]);
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Comment state: openPostId -> commentsList
  const [activeComments, setActiveComments] = useState({});
  const [newCommentText, setNewCommentText] = useState({});

  useEffect(() => {
    loadData();
  }, [tab]);

  async function loadData() {
    setLoading(true);
    setError('');
    try {
      if (tab === 'badges') {
        const data = await achievementApi.getMyAchievements();
        setBadges(data || []);
      } else {
        const feedData = await achievementApi.getFeed(0, 15);
        setFeed(feedData.content || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to load achievements');
    } finally {
      setLoading(false);
    }
  }

  const handleReact = async (post) => {
    try {
      const currentReact = post.userReaction;
      const targetType = currentReact === 'LIKE' ? 'CELEBRATE' : 'LIKE';
      const updated = await achievementApi.react(post.id, targetType);

      setFeed((prev) =>
        prev.map((item) => (item.id === post.id ? updated : item))
      );
    } catch (err) {
      alert('Could not update reaction: ' + err.message);
    }
  };

  const handleSpecificReact = async (postId, reactionType) => {
    try {
      const updated = await achievementApi.react(postId, reactionType);
      setFeed((prev) =>
        prev.map((item) => (item.id === postId ? updated : item))
      );
    } catch (err) {
      alert('Could not update reaction: ' + err.message);
    }
  };

  const toggleComments = async (postId) => {
    if (activeComments[postId]) {
      setActiveComments((prev) => ({ ...prev, [postId]: null }));
    } else {
      try {
        const comments = await achievementApi.getComments(postId);
        setActiveComments((prev) => ({ ...prev, [postId]: comments || [] }));
      } catch (err) {
        console.error('Failed to load comments', err);
      }
    }
  };

  const handleAddComment = async (postId) => {
    const text = newCommentText[postId]?.trim();
    if (!text) return;

    try {
      const added = await achievementApi.addComment(postId, text);
      setActiveComments((prev) => ({
        ...prev,
        [postId]: [added, ...(prev[postId] || [])],
      }));
      setNewCommentText((prev) => ({ ...prev, [postId]: '' }));
      // Increment comment count in post
      setFeed((prev) =>
        prev.map((item) =>
          item.id === postId ? { ...item, commentCount: item.commentCount + 1 } : item
        )
      );
    } catch (err) {
      alert('Could not add comment: ' + err.message);
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      await achievementApi.deleteComment(commentId);
      setActiveComments((prev) => ({
        ...prev,
        [postId]: prev[postId].filter((c) => c.id !== commentId),
      }));
      setFeed((prev) =>
        prev.map((item) =>
          item.id === postId ? { ...item, commentCount: Math.max(0, item.commentCount - 1) } : item
        )
      );
    } catch (err) {
      alert('Could not delete comment: ' + err.message);
    }
  };

  const renderBadgeIcon = (iconName, size = 24) => {
    switch (iconName) {
      case 'Flame': return <Flame size={size} />;
      case 'GraduationCap': return <GraduationCap size={size} />;
      case 'Sparkles': return <Sparkles size={size} />;
      case 'Brain': return <Brain size={size} />;
      default: return <Award size={size} />;
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, letterSpacing: '-0.03em' }}>
          Badges & Social Achievement Feed
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Celebrate your verified milestones, course graduations, and celebrate progress with fellow engineers.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem' }}>
        <button
          className={`btn ${tab === 'badges' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setTab('badges')}
        >
          <Award size={18} /> My Milestone Badges
        </button>
        <button
          className={`btn ${tab === 'feed' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setTab('feed')}
        >
          <Sparkles size={18} /> Community Celebration Feed
        </button>
      </div>

      {error && <div style={{ color: 'var(--danger)', marginBottom: '1.5rem' }}>{error}</div>}
      {loading && <div className="spinner" />}

      {/* TAB 1: BADGES GRID */}
      {!loading && tab === 'badges' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
          {badges.map((badge) => (
            <div
              key={badge.id}
              className="card"
              style={{
                textAlign: 'center',
                padding: '2rem 1.5rem',
                border: badge.unlocked ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid var(--border)',
                background: badge.unlocked ? 'var(--bg-card)' : 'var(--bg-surface)',
                opacity: badge.unlocked ? 1 : 0.65,
                position: 'relative',
              }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  margin: '0 auto 1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: badge.unlocked ? 'var(--primary-light)' : 'var(--bg-surface-hover)',
                  color: badge.unlocked ? 'var(--primary)' : 'var(--text-muted)',
                }}
              >
                {renderBadgeIcon(badge.iconName, 32)}
              </div>

              <span className={`badge ${badge.unlocked ? 'badge-success' : 'badge-purple'}`} style={{ marginBottom: '0.75rem' }}>
                {badge.category}
              </span>

              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.4rem' }}>
                {badge.title}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '1.25rem' }}>
                {badge.description}
              </p>

              <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {badge.unlocked ? (
                  <span style={{ color: 'var(--success)', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}>
                    <CheckCircle size={15} /> Unlocked on {new Date(badge.unlockedAt).toLocaleDateString()}
                  </span>
                ) : (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}>
                    <Lock size={15} /> Criteria: {badge.criteriaType} (Value: {badge.thresholdValue})
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: SOCIAL CELEBRATION FEED */}
      {!loading && tab === 'feed' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {feed.length === 0 ? (
            <div className="card empty-state">
              <Sparkles size={40} className="empty-state-icon" />
              <h3>No achievements in the feed yet</h3>
              <p>Complete course topics and quizzes to earn badges and be featured here!</p>
            </div>
          ) : (
            feed.map((post) => (
              <div key={post.id} className="card" style={{ padding: '1.5rem' }}>
                {/* Post Header: Student identity & time */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <div
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: '50%',
                        background: 'var(--primary-light)',
                        color: 'var(--primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '1rem',
                      }}
                    >
                      {post.studentName?.charAt(0) || 'S'}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.98rem' }}>{post.studentName}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {post.studentId} • {new Date(post.unlockedAt).toLocaleDateString()} at {new Date(post.unlockedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>

                  <span className="badge badge-success">Unlocked Badge</span>
                </div>

                {/* Badge Card Embed */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.25rem',
                    padding: '1.25rem',
                    background: 'var(--bg-surface)',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--border)',
                    marginBottom: '1.25rem',
                  }}
                >
                  <div
                    style={{
                      width: 54,
                      height: 54,
                      borderRadius: '50%',
                      background: 'var(--primary-light)',
                      color: 'var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {renderBadgeIcon(post.iconName, 28)}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.2rem' }}>
                      {post.title}
                    </h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {post.description}
                    </p>
                  </div>
                </div>

                {/* Reaction Counters & Buttons (Enforces 1 reaction per user per achievement) */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '0.85rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button
                      className={`btn btn-sm ${post.userReaction === 'LIKE' ? 'btn-primary' : 'btn-secondary'}`}
                      onClick={() => handleSpecificReact(post.id, 'LIKE')}
                      title="Like"
                    >
                      👍 Like {post.reactionCounts?.LIKE > 0 && `(${post.reactionCounts.LIKE})`}
                    </button>

                    <button
                      className={`btn btn-sm ${post.userReaction === 'CELEBRATE' ? 'btn-primary' : 'btn-secondary'}`}
                      onClick={() => handleSpecificReact(post.id, 'CELEBRATE')}
                      title="Celebrate"
                    >
                      🎉 Celebrate {post.reactionCounts?.CELEBRATE > 0 && `(${post.reactionCounts.CELEBRATE})`}
                    </button>

                    <button
                      className={`btn btn-sm ${post.userReaction === 'INSIGHTFUL' ? 'btn-primary' : 'btn-secondary'}`}
                      onClick={() => handleSpecificReact(post.id, 'INSIGHTFUL')}
                      title="Insightful"
                    >
                      💡 Insightful {post.reactionCounts?.INSIGHTFUL > 0 && `(${post.reactionCounts.INSIGHTFUL})`}
                    </button>
                  </div>

                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => toggleComments(post.id)}
                  >
                    <MessageSquare size={15} /> {post.commentCount} Comments
                  </button>
                </div>

                {/* Expandable Comments Section */}
                {activeComments[post.id] && (
                  <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border)' }}>
                    {/* Add Comment Input */}
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Congratulate or comment on this milestone..."
                        value={newCommentText[post.id] || ''}
                        onChange={(e) => setNewCommentText((prev) => ({ ...prev, [post.id]: e.target.value }))}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleAddComment(post.id);
                        }}
                      />
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleAddComment(post.id)}
                      >
                        <Send size={15} />
                      </button>
                    </div>

                    {/* Comments List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                      {activeComments[post.id].length === 0 ? (
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', padding: '0.75rem 0' }}>
                          Be the first to leave a comment!
                        </div>
                      ) : (
                        activeComments[post.id].map((comment) => (
                          <div
                            key={comment.id}
                            style={{
                              padding: '0.75rem 1rem',
                              background: 'var(--bg-surface)',
                              borderRadius: 'var(--radius-md)',
                              border: '1px solid var(--border)',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'flex-start',
                            }}
                          >
                            <div>
                              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
                                {comment.userName}{' '}
                                <span style={{ fontWeight: 400, color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                                  • {new Date(comment.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                                {comment.commentText}
                              </div>
                            </div>

                            {(comment.ownComment || isAdmin) && (
                              <button
                                className="btn-icon"
                                style={{ width: 26, height: 26, color: 'var(--danger)' }}
                                onClick={() => handleDeleteComment(post.id, comment.id)}
                                title="Delete comment"
                              >
                                <Trash2 size={13} />
                              </button>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
