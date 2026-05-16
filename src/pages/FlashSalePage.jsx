import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_PRODUCTS } from '../data/mockData';
import { useCart } from '../context/CartContext';
import useCountdown from '../hooks/useCountdown';
import './FlashSalePage.css';

// Sub-component for individual card so each manages its own ticking timer
const FlashSaleCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { days, hours, minutes, seconds, expired } = useCountdown(product.saleEndsAt);
  
  const discountPercent = Math.round((1 - product.salePrice / product.price) * 100);

  const handleImageClick = () => {
    navigate(`/product/${product.id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  return (
    <div className={`flash-card ${expired ? 'expired' : ''}`}>
      <div className="flash-image-container" onClick={handleImageClick}>
        {!expired && <span className="discount-badge">-{discountPercent}%</span>}
        <img src={product.image} alt={product.name} className="flash-image" />
      </div>
      
      <div className="flash-info">
        <h3 className="flash-name">{product.name}</h3>
        
        <div className="price-container">
          <span className="sale-price">${product.salePrice.toFixed(2)}</span>
          <span className="original-price">${product.price.toFixed(2)}</span>
        </div>

        {expired ? (
           <div className="ended-badge">Ended</div>
        ) : (
           <div className="countdown-container">
             <div className="countdown-box">
               <span className="countdown-value">{String(days).padStart(2, '0')}</span>
               <span className="countdown-label">Days</span>
             </div>
             <div className="countdown-box">
               <span className="countdown-value">{String(hours).padStart(2, '0')}</span>
               <span className="countdown-label">Hrs</span>
             </div>
             <div className="countdown-box">
               <span className="countdown-value">{String(minutes).padStart(2, '0')}</span>
               <span className="countdown-label">Min</span>
             </div>
             <div className="countdown-box">
               <span className="countdown-value">{String(seconds).padStart(2, '0')}</span>
               <span className="countdown-label">Sec</span>
             </div>
           </div>
        )}

        <div className="flash-actions">
          <button 
            className="btn-add-cart" 
            onClick={handleAddToCart}
            disabled={expired}
          >
            {expired ? 'Sale Ended' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

const FlashSalePage = () => {
  const [activeFilter, setActiveFilter] = useState('All Deals');
  
  // Extract only products that have a sale
  const saleProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter(p => p.salePrice && p.saleEndsAt);
  }, []);

  const displayedProducts = useMemo(() => {
    let filtered = [...saleProducts];

    // Note: We need to calculate properties to filter/sort
    // We compute the "live" remaining time here once for filter purposes, 
    // though perfectly accurate timers tick inside components.
    const now = Date.now();
    const threeHoursInMs = 3 * 60 * 60 * 1000;

    if (activeFilter === 'Ending Soon') {
       filtered = filtered.filter(p => {
         const remaining = p.saleEndsAt - now;
         return remaining > 0 && remaining <= threeHoursInMs;
       });
    } else if (activeFilter === 'Best Discount') {
       // Only active (not expired) deals? Or all? Let's assume all that aren't expired.
       // Wait, maybe we include expired ones too, but let's prioritize non-expired.
       // The prompt says "Best Discount (sorted by highest % off)".
       filtered.sort((a, b) => {
         const discA = (1 - a.salePrice / a.price);
         const discB = (1 - b.salePrice / b.price);
         return discB - discA;
       });
    }

    // For "All Deals" and "Ending Soon", maybe we just show them in original order.
    // Expired ones should probably go to the bottom intuitively.
    if (activeFilter !== 'Best Discount') {
       filtered.sort((a, b) => {
         const aExpired = (a.saleEndsAt - now) <= 0;
         const bExpired = (b.saleEndsAt - now) <= 0;
         if (aExpired === bExpired) return 0;
         return aExpired ? 1 : -1;
       });
    }

    return filtered;
  }, [saleProducts, activeFilter]);

  return (
    <div className="flash-sale-page fade-in">
      <div className="flash-hero">
        <h1 className="flash-title"><span>Flash</span> Deals</h1>
        <p className="flash-subtitle">Limited time offers. Unbeatable prices.</p>
      </div>

      <div className="flash-filters">
        <button 
          className={`filter-btn ${activeFilter === 'All Deals' ? 'active' : ''}`}
          onClick={() => setActiveFilter('All Deals')}
        >
          All Deals
        </button>
        <button 
          className={`filter-btn ${activeFilter === 'Ending Soon' ? 'active' : ''}`}
          onClick={() => setActiveFilter('Ending Soon')}
        >
          Ending Soon
        </button>
        <button 
          className={`filter-btn ${activeFilter === 'Best Discount' ? 'active' : ''}`}
          onClick={() => setActiveFilter('Best Discount')}
        >
          Best Discount
        </button>
      </div>

      <div className="flash-grid">
        {displayedProducts.length > 0 ? (
          displayedProducts.map(product => (
            <FlashSaleCard key={product.id} product={product} />
          ))
        ) : (
          <div style={{ textAlign: 'center', gridColumn: '1 / -1', padding: '40px' }}>
            No deals found for this filter.
          </div>
        )}
      </div>
    </div>
  );
};

export default FlashSalePage;
