import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { COMPANIES, MOCK_PRODUCTS } from '../data/mockData';
import ProductCard from '../components/ProductCard/ProductCard';
import './CompanyProfile.css';

const CompanyProfile = () => {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const foundCompany = COMPANIES.find(c => c.id === id);
    if (foundCompany) {
      setCompany(foundCompany);
      setProducts(MOCK_PRODUCTS.filter(p => p.companyId === id));
    }
  }, [id]);

  if (!company) {
    return <div className="company-profile-not-found" style={{padding: '5rem', textAlign: 'center'}}>Company not found.</div>;
  }

  return (
    <div className="company-profile fade-in">
      {/* Hero Banner Area */}
      <div 
        className="company-hero" 
        style={{ backgroundImage: `url(${company.bannerImage})` }}
      >
        <div className="hero-overlay"></div>
      </div>

      {/* Profile Info Area */}
      <div className="company-info-container">
        <div className="company-header">
          <img src={company.logo} alt={company.name} className="company-logo" />
          <div className="company-title-area">
            <h1 className="company-name">{company.name}</h1>
            <span className="company-niche">{company.niche}</span>
          </div>
          <div className="company-stats">
            <div className="stat-item">
              <span className="stat-value">{company.followers}</span>
              <span className="stat-label">Followers</span>
            </div>
            <div 
              className="stat-item" 
              onClick={() => {
                const productsSection = document.querySelector('.company-products-section');
                if (productsSection) {
                  productsSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              style={{ cursor: 'pointer' }}
            >
              <span className="stat-value">{products.length}</span>
              <span className="stat-label">Products</span>
            </div>
          </div>
        </div>

        <div className="company-bio">
          <p>{company.bio}</p>
        </div>
      </div>

      {/* Products Tab */}
      <div className="company-products-section">
        <h2 className="section-title">Published Products</h2>
        {products.length > 0 ? (
          <div className="products-grid">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="no-products">No products available yet.</p>
        )}
      </div>
    </div>
  );
};

export default CompanyProfile;
