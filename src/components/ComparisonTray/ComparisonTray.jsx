import React from 'react';
import { X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useComparison } from '../../context/ComparisonContext';
import './ComparisonTray.css';

const ComparisonTray = () => {
  const { comparisonItems, removeFromComparison, clearComparison } = useComparison();
  const navigate = useNavigate();
  const location = useLocation();

  if (location.pathname === '/compare') return null;
  if (comparisonItems.length === 0) return null;

  const canCompare = comparisonItems.length === 2;

  const handleCompareNow = () => {
    const ids = comparisonItems.map(p => p.id);
    navigate(`/compare?a=${ids[0]}&b=${ids[1]}`);
  };

  return (
    <div className="comparison-tray tray-slide-up">
      <div className="tray-container">

        <div className="tray-products">
          {[0, 1].map(index => {
            const product = comparisonItems[index];
            if (product) {
              return (
                <div key={product.id} className="tray-slot filled">
                  <div className="slot-thumb">
                    <img src={product.image} alt={product.name} />
                  </div>
                  <div className="slot-info">
                    <span className="slot-name">{product.name}</span>
                    <span className="slot-price">${product.price.toFixed(2)}</span>
                  </div>
                  <button
                    className="slot-remove-btn"
                    aria-label={`Remove ${product.name}`}
                    onClick={() => removeFromComparison(product.id)}
                  >
                    <X size={14} />
                  </button>
                </div>
              );
            }
            return (
              <div key={`empty-${index}`} className="tray-slot empty">
                <span>Select a product</span>
              </div>
            );
          })}
        </div>

        <div className="tray-actions">
          <button className="tray-clear-btn" onClick={clearComparison}>
            Clear All
          </button>
          <button
            className="tray-compare-btn"
            disabled={!canCompare}
            onClick={handleCompareNow}
            title={!canCompare ? 'Select one more to compare' : 'Compare products'}
          >
            {canCompare ? 'Compare Now' : 'Select one more'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default ComparisonTray;
