import { ShoppingBag, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { COMPANIES } from '../../data/mockData';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isWishlisted } = useWishlist();
  const company = COMPANIES.find(c => c.id === product.companyId);
  const wishlisted = isWishlisted(product.id);

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (wishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <div className="product-card fade-in">
      <div className="product-image-container">
        <Link to={`/product/${product.id}`}>
          <img src={product.image} alt={product.name} className="product-image" loading="lazy" />
        </Link>
        <div className="product-actions">
          <button 
            className={`action-btn wishlist-btn ${wishlisted ? 'active' : ''}`} 
            aria-label={wishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
            onClick={handleWishlistToggle}
          >
            <Heart size={20} fill={wishlisted ? "currentColor" : "none"} className={wishlisted ? "heart-filled" : ""} />
          </button>
        </div>
        {product.featured && <span className="badge">Featured</span>}
      </div>
      
      <div className="product-info">
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
        <Link to={`/product/${product.id}`} className="product-name-link">
          <h3 className="product-name">{product.name}</h3>
        </Link>
        <div className="product-bottom">
          <span className="product-price">${product.price.toFixed(2)}</span>
          <button 
            className="add-to-cart-btn" 
            onClick={() => addToCart(product)}
            aria-label="Add to Cart"
          >
            <ShoppingBag size={18} />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
