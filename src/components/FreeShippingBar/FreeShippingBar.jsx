import React, { useMemo } from 'react';
import { Truck, PartyPopper, Package } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import './FreeShippingBar.css';

const FREE_SHIPPING_THRESHOLD = 100;

const FreeShippingBar = () => {
  const { cartTotal } = useCart();

  const { percentage, remaining, isUnlocked } = useMemo(() => {
    const pct = Math.min((cartTotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
    const rem = Math.max(FREE_SHIPPING_THRESHOLD - cartTotal, 0);
    return {
      percentage: pct,
      remaining: rem,
      isUnlocked: cartTotal >= FREE_SHIPPING_THRESHOLD,
    };
  }, [cartTotal]);

  return (
    <div className={`free-shipping-bar ${isUnlocked ? 'unlocked' : ''}`} id="free-shipping-bar">
      <div className="shipping-bar-content">
        <div className="shipping-bar-icon">
          {isUnlocked ? <PartyPopper size={18} /> : <Truck size={18} />}
        </div>
        <div className="shipping-bar-text">
          {isUnlocked ? (
            <span className="shipping-message unlocked" key="unlocked">
              🎉 You've unlocked free shipping!
            </span>
          ) : (
            <span className="shipping-message pending" key="pending">
              Spend <strong>${remaining.toFixed(2)}</strong> more for <strong>free shipping</strong>
            </span>
          )}
        </div>
      </div>

      <div className="shipping-progress-track">
        <div
          className={`shipping-progress-fill ${isUnlocked ? 'complete' : ''}`}
          style={{ width: `${percentage}%` }}
        >
          <div className="shipping-progress-shimmer" />
        </div>
        {/* Milestone markers */}
        <div className="shipping-milestone" style={{ left: '25%' }} />
        <div className="shipping-milestone" style={{ left: '50%' }} />
        <div className="shipping-milestone" style={{ left: '75%' }} />
      </div>

      <div className="shipping-bar-meta">
        <span className="shipping-bar-amount">${cartTotal.toFixed(2)}</span>
        <span className="shipping-bar-goal">${FREE_SHIPPING_THRESHOLD.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default FreeShippingBar;
