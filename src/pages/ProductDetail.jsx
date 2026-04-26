import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MOCK_PRODUCTS, COMPANIES } from '../data/mockData';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard/ProductCard';
import ProductMediaViewer from '../components/ProductMediaViewer/ProductMediaViewer';
import { Minus, Plus, ShoppingBag, Star, ChevronDown, ChevronUp, ArrowLeft } from 'lucide-react';
import ReviewSection from '../components/ReviewSection/ReviewSection';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, setIsCartOpen } = useCart();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeAccordion, setActiveAccordion] = useState('description');

  useEffect(() => {
    // Navigate scroll to top on mount
    window.scrollTo(0, 0);
    const foundProduct = MOCK_PRODUCTS.find(p => p.id === id);
    if (foundProduct) {
      setProduct(foundProduct);
      setQuantity(1);
    }
  }, [id]);

  if (!product) {
    return <div className="product-not-found fade-in">Product not found.</div>;
  }

  const company = COMPANIES.find(c => c.id === product.companyId);

  const handleAddToCart = () => {
    addToCart(product, quantity);
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
              <div className="product-price">${product.price.toFixed(2)}</div>
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
    </div>
  );
};

export default ProductDetail;
