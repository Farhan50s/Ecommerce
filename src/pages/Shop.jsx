import React, { useState } from 'react';
import ProductCard from '../components/ProductCard/ProductCard';
import { MOCK_PRODUCTS, CATEGORIES } from '../data/mockData';
import './Shop.css';

const Shop = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');

  let filteredProducts = MOCK_PRODUCTS.filter(p => 
    activeCategory === 'All' ? true : p.category === activeCategory
  );

  if (sortBy === 'price-low') {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-high') {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else {
    // Keep original mocked order or sort by ID
    filteredProducts.sort((a, b) => Number(a.id) - Number(b.id));
  }

  return (
    <div className="shop-page fade-in">
      <div className="shop-header">
        <h1>Our Collection</h1>
        <p>Discover everyday staples, crafted to endure.</p>
      </div>

      <div className="shop-container">
        <aside className="shop-sidebar">
          <div className="filter-group">
            <h3>Categories</h3>
            <ul className="category-list">
              {CATEGORIES.map(category => (
                <li key={category}>
                  <button 
                    className={`category-btn ${activeCategory === category ? 'active' : ''}`}
                    onClick={() => setActiveCategory(category)}
                  >
                    {category}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <main className="shop-content">
          <div className="shop-controls">
            <span className="results-count">{filteredProducts.length} Results</span>
            
            <div className="sort-group">
              <label htmlFor="sort">Sort By:</label>
              <select 
                id="sort" 
                value={sortBy} 
                onChange={e => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="product-grid">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="no-results">
              <h3>No products found.</h3>
              <p>Try selecting a different category.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Shop;
