import React from 'react';
import { Link } from 'react-router-dom';
import { HeartCrack, Trash2 } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard/ProductCard';
import './WishlistPage.css';

const WishlistPage = () => {
  const { wishlist, clearWishlist } = useWishlist();

  const handleClearWishlist = () => {
    if (window.confirm('Are you sure you want to clear your wishlist?')) {
      clearWishlist();
    }
  };

  if (wishlist.length === 0) {
    return (
      <div className="wishlist-empty-state fade-in">
        <HeartCrack size={64} className="empty-icon" />
        <h2>Your wishlist is empty</h2>
        <p>Save items you love to find them easily later.</p>
        <Link to="/shop" className="browse-products-btn">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="wishlist-page fade-in">
      <div className="wishlist-header">
        <div>
          <h1>Your Wishlist</h1>
          <p>{wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved</p>
        </div>
        <button className="clear-all-btn" onClick={handleClearWishlist} aria-label="Clear all wishlisted items">
          <Trash2 size={18} />
          <span>Clear All</span>
        </button>
      </div>
      
      <div className="wishlist-grid">
        {wishlist.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default WishlistPage;
