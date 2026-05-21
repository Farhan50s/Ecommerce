import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MOCK_PRODUCTS, COMPANIES } from '../data/mockData';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard/ProductCard';
import ProductMediaViewer from '../components/ProductMediaViewer/ProductMediaViewer';
import { Minus, Plus, ShoppingBag, Star, ChevronDown, ChevronUp, ArrowLeft, Heart, GitCompare, X, Search } from 'lucide-react';
import ReviewSection from '../components/ReviewSection/ReviewSection';
import ProductAssistant from '../components/ProductAssistant/ProductAssistant';
import useCountdown from '../hooks/useCountdown';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, setIsCartOpen } = useCart();
  const { addToWishlist, removeFromWishlist, isWishlisted } = useWishlist();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeAccordion, setActiveAccordion] = useState('description');

  // Compare panel state
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [compareSearch, setCompareSearch] = useState('');
  const [compareTarget, setCompareTarget] = useState(null);

  const { days, hours, minutes, seconds, expired } = useCountdown(product?.saleEndsAt);
  const isSaleActive = product && product.salePrice && product.saleEndsAt && !expired;
  const discountPercent = isSaleActive ? Math.round((1 - product.salePrice / product.price) * 100) : 0;

  useEffect(() => {
    // Navigate scroll to top on mount
    window.scrollTo(0, 0);
    const foundProduct = MOCK_PRODUCTS.find(p => p.id === id);
    if (foundProduct) {
      setProduct(foundProduct);
      setQuantity(1);
      // Reset compare panel state when product changes
      setIsCompareOpen(false);
      setCompareSearch('');
      setCompareTarget(null);
    }
  }, [id]);

  if (!product) {
    return <div className="product-not-found fade-in">Product not found.</div>;
  }

  const company = COMPANIES.find(c => c.id === product.companyId);

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const wishlisted = product ? isWishlisted(product.id) : false;

  const handleWishlistToggle = () => {
    if (wishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    // Ideally redirect to checkout, but for now we open the cart
    setIsCartOpen(true);
  };

  const toggleAccordion = (section) => {
    setActiveAccordion(activeAccordion === section ? '' : section);
  };

  const relatedProducts = MOCK_PRODUCTS.filter(
    p => p.category === product.category && p.id !== product.id
  ).slice(0, 4);

  return (
    <div className="product-detail-page fade-in">
      <div className="product-detail-container">
        <button onClick={() => navigate(-1)} className="back-button">
          <ArrowLeft size={20} /> Back
        </button>

        <div className="product-main">
          {/* Media Viewer — Gallery + 360° */}
          <div className="product-gallery">
            <ProductMediaViewer media={product.media} />
          </div>

          {/* Info Section */}
          <div className="product-info-section">
            <div className="product-header">
              <div className="product-category-brand">
                <span className="product-category">{product.category}</span>
                {company && (
                  <>
                    <span className="brand-separator">•</span>
                    <Link to={`/company/${company.id}`} className="product-brand-link">
                      {company.name}
                    </Link>
                  </>
                )}
              </div>
              <h1 className="product-title">{product.name}</h1>
              <div className="product-rating">
                <div className="stars">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={16} 
                      fill={i < Math.floor(product.rating || 4) ? "var(--color-text-primary)" : "none"} 
                      color="var(--color-text-primary)" 
                    />
                  ))}
                </div>
                <span className="rating-value">{product.rating}</span>
                <span className="reviews-count">({product.reviewsCount || 12} reviews)</span>
              </div>
              
              {isSaleActive ? (
                <div className="product-price-section">
                  <div className="product-price sale-active">
                    ${product.salePrice.toFixed(2)}
                    <span className="product-price-original strike">${product.price.toFixed(2)}</span>
                    <span className="pd-discount-badge">-{discountPercent}%</span>
                  </div>
                  <div className="pd-sale-timer">
                    <span className="timer-label">Sale ends in:</span>
                    <span className="timer-value">
                      {String(days).padStart(2, '0')}:{String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="product-price">${product.price.toFixed(2)}</div>
              )}
            </div>

            <div className="product-actions-form">
              <div className="quantity-selector">
                <span className="quantity-label">Quantity</span>
                <div className="quantity-controls">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="qty-btn" aria-label="Decrease quantity">
                    <Minus size={16} />
                  </button>
                  <span className="qty-value">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="qty-btn" aria-label="Increase quantity">
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <div className="action-buttons">
                <button className="add-cart-btn btn" onClick={handleAddToCart}>
                  <ShoppingBag size={20} />
                  Add to Cart
                </button>
                <button className="buy-now-btn btn btn-primary" onClick={handleBuyNow}>
                  Buy It Now
                </button>
                <button
                  className="compare-trigger-btn"
                  onClick={() => setIsCompareOpen(true)}
                  aria-label="Compare with another product"
                  title="Compare with another product"
                >
                  <GitCompare size={22} />
                </button>
                <button
                  className={`wishlist-detail-btn ${wishlisted ? 'active' : ''}`}
                  onClick={handleWishlistToggle}
                  aria-label={wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                >
                  <Heart size={24} fill={wishlisted ? 'currentColor' : 'none'} className={wishlisted ? 'heart-filled' : ''} />
                </button>
              </div>
            </div>

            <div className="product-accordions">
              <div className="accordion-item">
                <button className="accordion-header" onClick={() => toggleAccordion('description')}>
                  <span>Description</span>
                  {activeAccordion === 'description' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                {activeAccordion === 'description' && (
                  <div className="accordion-content slide-up">
                    <p>{product.description}</p>
                  </div>
                )}
              </div>
              <div className="accordion-item">
                <button className="accordion-header" onClick={() => toggleAccordion('materials')}>
                  <span>Materials & Care</span>
                  {activeAccordion === 'materials' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                {activeAccordion === 'materials' && (
                  <div className="accordion-content slide-up">
                    <p>Designed for durability and easy care. Spot clean recommended. Do not machine wash unless explicitly stated. Avoid prolonged exposure to harsh elements.</p>
                  </div>
                )}
              </div>
              <div className="accordion-item">
                <button className="accordion-header" onClick={() => toggleAccordion('shipping')}>
                  <span>Shipping & Returns</span>
                  {activeAccordion === 'shipping' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                {activeAccordion === 'shipping' && (
                  <div className="accordion-content slide-up">
                    <p>Free standard shipping on orders over $150. Returns accepted within 30 days of delivery in original unused condition.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Review Section */}
        <ReviewSection reviews={product.reviews} />

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="related-products">
            <h2 className="related-title">You May Also Like</h2>
            <div className="product-grid">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* AI Product Assistant Widget */}
      <ProductAssistant product={product} />

      {/* Compare Panel Overlay */}
      {isCompareOpen && (() => {
        const filteredProducts = MOCK_PRODUCTS.filter(
          p =>
            p.id !== product.id &&
            p.name.toLowerCase().includes(compareSearch.toLowerCase())
        );
        return (
          <>
            {/* Backdrop */}
            <div
              className="compare-overlay"
              onClick={() => setIsCompareOpen(false)}
              aria-hidden="true"
            />

            {/* Slide-up Panel */}
            <div className="compare-panel" role="dialog" aria-label="Compare with another product" aria-modal="true">
              <div className="cp-drag-handle" aria-hidden="true" />

              <div className="cp-panel-header">
                <span className="cp-panel-title">Compare with another product</span>
                <button
                  className="cp-panel-close"
                  onClick={() => setIsCompareOpen(false)}
                  aria-label="Close compare panel"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Selected Target Chip */}
              {compareTarget && (
                <div className="cp-selected-chip">
                  <img src={compareTarget.image} alt={compareTarget.name} className="cp-chip-thumb" />
                  <span className="cp-chip-name">{compareTarget.name}</span>
                  <button
                    className="cp-chip-remove"
                    onClick={() => setCompareTarget(null)}
                    aria-label={`Remove ${compareTarget.name}`}
                  >
                    <X size={14} />
                  </button>
                </div>
              )}

              {/* Search Input */}
              <div className="cp-search-wrap">
                <Search size={16} className="cp-search-icon" />
                <input
                  type="text"
                  className="cp-search-input"
                  placeholder="Search for a product..."
                  value={compareSearch}
                  onChange={e => setCompareSearch(e.target.value)}
                  autoFocus
                />
              </div>

              {/* Results List */}
              <div className="cp-results">
                {filteredProducts.length === 0 ? (
                  <p className="cp-no-results">No products match your search.</p>
                ) : (
                  filteredProducts.map(p => (
                    <button
                      key={p.id}
                      className={`cp-result-item ${compareTarget?.id === p.id ? 'selected' : ''}`}
                      onClick={() => setCompareTarget(p)}
                    >
                      <div className="cp-result-thumb">
                        <img src={p.image} alt={p.name} />
                      </div>
                      <div className="cp-result-info">
                        <span className="cp-result-name">{p.name}</span>
                        <span className="cp-result-meta">
                          {p.category} &nbsp;·&nbsp; ${p.price.toFixed(2)}
                        </span>
                      </div>
                      {compareTarget?.id === p.id && (
                        <span className="cp-result-check" aria-hidden="true">✓</span>
                      )}
                    </button>
                  ))
                )}
              </div>

              {/* Compare Now Button */}
              <div className="cp-panel-footer">
                <button
                  className="cp-compare-now-btn"
                  disabled={!compareTarget}
                  onClick={() => {
                    if (compareTarget) {
                      navigate(`/compare?a=${product.id}&b=${compareTarget.id}`);
                      setIsCompareOpen(false);
                    }
                  }}
                >
                  <GitCompare size={18} />
                  {compareTarget ? `Compare with "${compareTarget.name}"` : 'Select a product above'}
                </button>
              </div>
            </div>
          </>
        );
      })()}
    </div>
  );
};

export default ProductDetail;
