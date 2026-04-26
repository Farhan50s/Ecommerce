import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { COMPANIES } from '../data/mockData';
import './Brands.css';

const Brands = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="brands-page fade-in">
      <div className="brands-header">
        <h1>Our Partner Brands</h1>
        <p>Discover luxurious products from world-class creators and niche specialists.</p>
      </div>

      <div className="brands-grid">
        {COMPANIES.map(company => (
          <Link to={`/company/${company.id}`} className="brand-card" key={company.id}>
            <div className="brand-banner" style={{ backgroundImage: `url(${company.bannerImage})` }}>
              <div className="banner-overlay"></div>
            </div>
            <div className="brand-info">
              <img src={company.logo} alt={company.name} className="brand-logo-small" />
              <div className="brand-text">
                <h3>{company.name}</h3>
                <span className="brand-niche">{company.niche}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Brands;
