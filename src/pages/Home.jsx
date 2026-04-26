import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard/ProductCard';
import { MOCK_PRODUCTS } from '../data/mockData';
import './Home.css';

const Home = () => {
  const featuredProducts = MOCK_PRODUCTS.filter(p => p.featured).slice(0, 4);

  return (
    <div className="home-page fade-in">
      <section className="hero-section">
        <div className="hero-content">
          <span className="hero-subtitle">New Collection</span>
          <h1 className="hero-title">Elevate Your Everyday Essentials.</h1>
          <p className="hero-description">
            Discover a curated selection of premium products designed for modern living. 
            Quality meets minimalist aesthetics.
          </p>
          <div className="hero-actions">
            <Link to="/shop" className="btn btn-primary d-inline-flex">
              Explore Collection <ArrowRight size={20} style={{ marginLeft: 8 }} />
            </Link>
          </div>
        </div>
        <div className="hero-image-wrapper">
          <img 
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1200" 
            alt="Minimalist store aesthetic" 
            className="hero-image"
          />
        </div>
      </section>

      <section className="featured-section">
        <div className="section-header">
          <h2>Trending Now</h2>
          <Link to="/shop" className="view-all-link">View All</Link>
        </div>
        
        <div className="product-grid">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
      
      <section className="value-props">
        <div className="prop-item">
          <h3>Free Shipping</h3>
          <p>On all orders over $150</p>
        </div>
        <div className="prop-item">
          <h3>Premium Quality</h3>
          <p>Ethically sourced materials</p>
        </div>
        <div className="prop-item">
          <h3>Easy Returns</h3>
          <p>30-day money back guarantee</p>
        </div>
      </section>
    </div>
  );
};

export default Home;
