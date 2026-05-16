import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import FreeShippingBar from '../FreeShippingBar/FreeShippingBar';
import './CartDrawer.css';

const CartDrawer = () => {
  const { 
    cartItems, 
    isCartOpen, 
    toggleCart, 
    removeFromCart, 
    updateQuantity, 
    cartTotal 
  } = useCart();

  return (
    <div className={`cart-drawer-overlay ${isCartOpen ? 'open' : ''}`} onClick={toggleCart}>
      <div className={`cart-drawer ${isCartOpen ? 'open' : ''}`} onClick={e => e.stopPropagation()}>
        <div className="cart-header">
          <h2>Your Cart ({cartItems.reduce((acc, item) => acc + item.quantity, 0)})</h2>
          <button className="icon-btn" onClick={toggleCart}>
            <X size={24} />
          </button>
        </div>

        <div className="cart-body">
          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <ShoppingBag size={48} />
              <p>Your cart is empty.</p>
              <button className="btn btn-primary" onClick={toggleCart}>Continue Shopping</button>
            </div>
          ) : (
            <div className="cart-items">
              <FreeShippingBar />
              {cartItems.map(item => (
                <div key={item.id} className="cart-item slide-up">
                  <img src={item.image} alt={item.name} className="cart-item-image" />
                  <div className="cart-item-details">
                    <h3>{item.name}</h3>
                    <p className="cart-item-price">${item.price.toFixed(2)}</p>
                    
                    <div className="cart-item-actions">
                      <div className="quantity-controls">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                          <Minus size={14} />
                        </button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                          <Plus size={14} />
                        </button>
                      </div>
                      <button className="remove-btn" onClick={() => removeFromCart(item.id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-footer">
            <div className="cart-summary">
              <span>Subtotal</span>
              <span className="cart-total">${cartTotal.toFixed(2)}</span>
            </div>
            <button className="btn btn-primary full-width">Proceed to Checkout</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
