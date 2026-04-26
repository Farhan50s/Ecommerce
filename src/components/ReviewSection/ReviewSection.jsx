import React, { useState, useEffect } from 'react';
import './ReviewSection.css';

/* ── Pure-CSS star renderer (filled / half / empty using Unicode ★ ☆) ── */
const StarDisplay = ({ rating, size = 16 }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      stars.push(<span key={i} className="star filled" style={{ fontSize: size }}>★</span>);
    } else if (rating >= i - 0.5) {
      stars.push(
        <span key={i} className="star half" style={{ fontSize: size }}>
          <span className="star-half-filled">★</span>
          <span className="star-half-empty">★</span>
        </span>
      );
    } else {
      stars.push(<span key={i} className="star empty" style={{ fontSize: size }}>★</span>);
    }
  }
  return <span className="star-display">{stars}</span>;
};

/* ── Interactive star picker with hover fill effect ── */
const StarPicker = ({ value, onChange }) => {
  const [hover, setHover] = useState(0);

  return (
    <div className="star-picker" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          className={`pick-star ${star <= (hover || value) ? 'active' : ''}`}
          onMouseEnter={() => setHover(star)}
          onClick={() => onChange(star)}
          aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
        >
          ★
        </button>
      ))}
    </div>
  );
};

/* ── Toast notification ── */
const Toast = ({ message, visible, onClose }) => {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  return (
    <div className={`review-toast ${visible ? 'show' : ''}`}>
      <span className="toast-icon">✓</span> {message}
    </div>
  );
};

/* ── Main ReviewSection ── */
const ReviewSection = ({ reviews: initialReviews }) => {
  const [reviews, setReviews] = useState(initialReviews || []);
  const [filterStar, setFilterStar] = useState(0); // 0 = All
  const [showForm, setShowForm] = useState(false);
  const [formName, setFormName] = useState('');
  const [formComment, setFormComment] = useState('');
  const [formRating, setFormRating] = useState(0);
  const [toastVisible, setToastVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Trigger progress bar animations after mount
    const timer = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  // Sync if parent changes the product (e.g. navigating to another PDP)
  useEffect(() => {
    setReviews(initialReviews || []);
    setFilterStar(0);
    setShowForm(false);
    setMounted(false);
    setTimeout(() => setMounted(true), 50);
  }, [initialReviews]);

  /* ── Computed values ── */
  const totalReviews = reviews.length;
  const avgRating = totalReviews > 0
    ? (reviews.reduce((s, r) => s + r.rating, 0) / totalReviews).toFixed(1)
    : '0.0';

  const starCounts = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length,
  }));

  const filteredReviews = filterStar === 0
    ? reviews
    : reviews.filter(r => r.rating === filterStar);

  /* ── Handlers ── */
  const handleHelpful = (reviewId) => {
    setReviews(prev =>
      prev.map(r => r.id === reviewId ? { ...r, helpful: r.helpful + 1 } : r)
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formRating === 0 || !formName.trim() || !formComment.trim()) return;

    const newReview = {
      id: `r-new-${Date.now()}`,
      author: formName.trim(),
      rating: formRating,
      comment: formComment.trim(),
      date: new Date().toISOString().split('T')[0],
      verified: false,
      helpful: 0,
    };

    setReviews(prev => [newReview, ...prev]);
    setFormName('');
    setFormComment('');
    setFormRating(0);
    setShowForm(false);
    setToastVisible(true);
  };

  const getInitials = (name) => {
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <section className="review-section" id="reviews">
      <h2 className="review-section-title">Customer Reviews</h2>

      <div className="review-overview">
        {/* Left: Average rating */}
        <div className="review-average">
          <span className="avg-number">{avgRating}</span>
          <StarDisplay rating={Number(avgRating)} size={22} />
          <span className="avg-total">Based on {totalReviews} review{totalReviews !== 1 ? 's' : ''}</span>
        </div>

        {/* Right: Rating breakdown bars */}
        <div className="rating-breakdown">
          {starCounts.map(({ star, count }) => {
            const pct = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
            const isActive = filterStar === star;
            return (
              <button 
                key={star} 
                className={`breakdown-row ${isActive ? 'active' : ''}`}
                onClick={() => setFilterStar(isActive ? 0 : star)}
                aria-label={`Filter by ${star} star reviews`}
              >
                <span className="breakdown-label">{star}★</span>
                <div className="breakdown-track">
                  <div 
                    className="breakdown-fill" 
                    style={{ width: mounted ? `${pct}%` : '0%' }}
                  />
                </div>
                <span className="breakdown-count">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter bar */}
      <div className="review-filter-bar">
        <div className="filter-buttons">
          <button 
            className={`filter-btn ${filterStar === 0 ? 'active' : ''}`}
            onClick={() => setFilterStar(0)}
          >
            All ({totalReviews})
          </button>
          {[5, 4, 3, 2, 1].map(star => {
            const count = starCounts.find(s => s.star === star)?.count || 0;
            return (
              <button 
                key={star}
                className={`filter-btn ${filterStar === star ? 'active' : ''}`}
                onClick={() => setFilterStar(filterStar === star ? 0 : star)}
              >
                {star}★ ({count})
              </button>
            );
          })}
        </div>

        <button 
          className="write-review-toggle"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'Write a Review'}
        </button>
      </div>

      {/* Write a Review Form */}
      {showForm && (
        <form className="review-form slide-up" onSubmit={handleSubmit}>
          <h3>Share Your Experience</h3>
          <div className="form-group">
            <label>Your Rating</label>
            <StarPicker value={formRating} onChange={setFormRating} />
          </div>
          <div className="form-group">
            <label htmlFor="review-name">Your Name</label>
            <input 
              id="review-name"
              type="text"
              placeholder="e.g. Alex M."
              value={formName}
              onChange={e => setFormName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="review-comment">Your Review</label>
            <textarea 
              id="review-comment"
              placeholder="Tell us what you think about this product..."
              rows={4}
              value={formComment}
              onChange={e => setFormComment(e.target.value)}
              required
            />
          </div>
          <button 
            type="submit" 
            className="submit-review-btn"
            disabled={!formRating || !formName.trim() || !formComment.trim()}
          >
            Submit Review
          </button>
        </form>
      )}

      {/* Review Cards */}
      <div className="review-list">
        {filteredReviews.length === 0 ? (
          <p className="no-reviews-msg">
            {filterStar > 0
              ? `No ${filterStar}-star reviews yet.`
              : 'No reviews yet. Be the first to share your thoughts!'}
          </p>
        ) : (
          filteredReviews.map(review => (
            <div key={review.id} className="review-card">
              <div className="review-card-header">
                <div className="review-avatar">{getInitials(review.author)}</div>
                <div className="review-meta">
                  <div className="review-author-row">
                    <span className="review-author">{review.author}</span>
                    {review.verified && <span className="verified-badge">✓ Verified</span>}
                  </div>
                  <div className="review-star-date">
                    <StarDisplay rating={review.rating} size={14} />
                    <span className="review-date">{formatDate(review.date)}</span>
                  </div>
                </div>
              </div>
              <p className="review-comment">{review.comment}</p>
              <button 
                className="helpful-btn"
                onClick={() => handleHelpful(review.id)}
              >
                👍 Helpful ({review.helpful})
              </button>
            </div>
          ))
        )}
      </div>

      <Toast 
        message="Your review has been submitted successfully!" 
        visible={toastVisible}
        onClose={() => setToastVisible(false)}
      />
    </section>
  );
};

export default ReviewSection;
