import React, { useMemo, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, Star, GitCompare, CheckCircle } from 'lucide-react';
import { MOCK_PRODUCTS, COMPANIES } from '../data/mockData';
import { useCart } from '../context/CartContext';
import './ComparePage.css';

const ComparePage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // All state hooks first — no conditional hooks
  const [highlightDiffs, setHighlightDiffs] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);

  // Resolve products from URL params
  const idA = searchParams.get('a');
  const idB = searchParams.get('b');
  const productA = MOCK_PRODUCTS.find(p => p.id === idA) ?? null;
  const productB = MOCK_PRODUCTS.find(p => p.id === idB) ?? null;
  const companyA = productA ? COMPANIES.find(c => c.id === productA.companyId) : null;
  const companyB = productB ? COMPANIES.find(c => c.id === productB.companyId) : null;

  // Best-value helpers — always computed (hooks must not be conditional)
  const priceA = productA?.salePrice ?? productA?.price ?? Infinity;
  const priceB = productB?.salePrice ?? productB?.price ?? Infinity;
  const ratingA = productA?.rating ?? 0;
  const ratingB = productB?.rating ?? 0;

  const specs = useMemo(() => {
    if (!productA || !productB) return [];
    return [
      {
        label: 'Price',
        valA: String(priceA),
        valB: String(priceB),
        renderA: () => (
          <span className="price-cell">
            <strong className={priceA <= priceB ? 'best-num' : ''}>
              ${priceA.toFixed(2)}
            </strong>
            {productA.salePrice && (
              <span className="orig-price">${productA.price.toFixed(2)}</span>
            )}
          </span>
        ),
        renderB: () => (
          <span className="price-cell">
            <strong className={priceB <= priceA ? 'best-num' : ''}>
              ${priceB.toFixed(2)}
            </strong>
            {productB.salePrice && (
              <span className="orig-price">${productB.price.toFixed(2)}</span>
            )}
          </span>
        ),
        bestA: priceA <= priceB,
        bestB: priceB <= priceA,
      },
      {
        label: 'Rating',
        valA: String(ratingA),
        valB: String(ratingB),
        renderA: () => (
          <span className="rating-cell">
            <Star size={14} fill="currentColor" />
            <strong className={ratingA >= ratingB ? 'best-num' : ''}>{ratingA}</strong>
          </span>
        ),
        renderB: () => (
          <span className="rating-cell">
            <Star size={14} fill="currentColor" />
            <strong className={ratingB >= ratingA ? 'best-num' : ''}>{ratingB}</strong>
          </span>
        ),
        bestA: ratingA >= ratingB,
        bestB: ratingB >= ratingA,
      },
      {
        label: 'Reviews',
        valA: String(productA.reviewsCount),
        valB: String(productB.reviewsCount),
        renderA: () => <span>{productA.reviewsCount} reviews</span>,
        renderB: () => <span>{productB.reviewsCount} reviews</span>,
        bestA: false,
        bestB: false,
      },
      {
        label: 'Category',
        valA: productA.category,
        valB: productB.category,
        renderA: () => <span className="tag-pill">{productA.category}</span>,
        renderB: () => <span className="tag-pill">{productB.category}</span>,
        bestA: false,
        bestB: false,
      },
      {
        label: 'Brand',
        valA: companyA?.name ?? '—',
        valB: companyB?.name ?? '—',
        renderA: () =>
          companyA ? (
            <Link to={`/company/${companyA.id}`} className="brand-link">
              {companyA.name}
            </Link>
          ) : <span>—</span>,
        renderB: () =>
          companyB ? (
            <Link to={`/company/${companyB.id}`} className="brand-link">
              {companyB.name}
            </Link>
          ) : <span>—</span>,
        bestA: false,
        bestB: false,
      },
      {
        label: 'Description',
        valA: productA.description,
        valB: productB.description,
        renderA: () => <p className="desc-text">{productA.description}</p>,
        renderB: () => <p className="desc-text">{productB.description}</p>,
        bestA: false,
        bestB: false,
      },
    ];
  }, [productA, productB, companyA, companyB, priceA, priceB, ratingA, ratingB]);

  const handleAddToCart = (product) => {
    addToCart(product);
    setToastMsg(product.name);
    setTimeout(() => setToastMsg(null), 2500);
  };

  // Empty state — after all hooks
  if (!productA || !productB) {
    return (
      <div className="compare-page fade-in">
        <div className="compare-empty">
          <GitCompare size={56} strokeWidth={1.5} className="empty-icon" />
          <h2>Nothing to Compare</h2>
          <p>Select two products to see a side-by-side breakdown.</p>
          <button className="go-shop-btn" onClick={() => navigate('/shop')}>
            <ArrowLeft size={18} /> Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="compare-page fade-in">

      {/* Toast */}
      {toastMsg && (
        <div className="cp-toast">
          <CheckCircle size={16} />
          <span><strong>{toastMsg}</strong> added to cart!</span>
        </div>
      )}

      {/* Page Header */}
      <div className="cp-header">
        <button className="cp-back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} /> Back
        </button>
        <h1 className="cp-title">Compare Products</h1>
        <button
          className={`cp-diff-toggle ${highlightDiffs ? 'active' : ''}`}
          onClick={() => setHighlightDiffs(d => !d)}
          aria-pressed={highlightDiffs}
        >
          {highlightDiffs ? '● ' : '○ '}Highlight Differences
        </button>
      </div>

      {/* Comparison Grid */}
      <div className="cp-grid">

        {/* Column Headers */}
        <div className="cp-row cp-header-row">
          <div className="cp-label-col" aria-hidden="true" />
          {[productA, productB].map((p) => (
            <div key={p.id} className="cp-val-col cp-product-header">
              <div className="cp-product-img">
                <img src={p.image} alt={p.name} />
              </div>
              <h3 className="cp-product-name">{p.name}</h3>
              <Link to={`/product/${p.id}`} className="cp-view-link">View product ↗</Link>
            </div>
          ))}
        </div>

        {/* Spec Rows */}
        {specs.map((spec, i) => {
          const isDiff = spec.valA !== spec.valB;
          return (
            <div
              key={spec.label}
              className={[
                'cp-row',
                'cp-spec-row',
                i % 2 === 0 ? 'cp-row-even' : '',
                highlightDiffs && isDiff ? 'cp-row-diff' : '',
              ].filter(Boolean).join(' ')}
            >
              <div className="cp-label-col">
                <span className="cp-spec-label">{spec.label}</span>
              </div>
              <div className={`cp-val-col${spec.bestA ? ' cp-best' : ''}`}>
                {spec.renderA()}
              </div>
              <div className={`cp-val-col${spec.bestB ? ' cp-best' : ''}`}>
                {spec.renderB()}
              </div>
            </div>
          );
        })}

        {/* Add to Cart Row */}
        <div className="cp-row cp-cart-row">
          <div className="cp-label-col" aria-hidden="true" />
          {[productA, productB].map((p) => (
            <div key={p.id} className="cp-val-col">
              <button className="cp-cart-btn" onClick={() => handleAddToCart(p)}>
                <ShoppingBag size={16} /> Add to Cart
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default ComparePage;
