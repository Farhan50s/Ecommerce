import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import SearchBar from '../SearchBar/SearchBar';
import './Navbar.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const { cartCount, toggleCart } = useCart();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu & search on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsMobileSearchOpen(false);
  }, [location]);

  return (
    <header className={`navbar-container ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-content">

        {/* LEFT — Logo + Hamburger */}
        <div className="navbar-left">
          <button
            className="mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <Link to="/" className="logo">Lumiere</Link>
        </div>

        {/* CENTER — Search Bar (desktop) */}
        <div className="navbar-search-center">
          <SearchBar />
        </div>

        {/* RIGHT — Nav links + Cart */}
        <div className="navbar-right">
          <nav className={`navbar-links ${isMobileMenuOpen ? 'open' : ''}`}>
            <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link>
            <Link to="/shop" className={location.pathname.includes('/shop') ? 'active' : ''}>Shop</Link>
            <Link
              to="/brands"
              className={
                location.pathname.includes('/brands') || location.pathname.includes('/company')
                  ? 'active'
                  : ''
              }
            >
              Brands
            </Link>
            <Link to="/sales" className={location.pathname === '/sales' ? 'active' : ''} style={{ fontWeight: 600, color: 'var(--color-danger)' }}>Sales 🔥</Link>
          </nav>

          {/* Mobile Search Toggle */}
          <button
            className="icon-btn mobile-search-btn"
            aria-label="Toggle search"
            onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
          >
            {isMobileSearchOpen ? <X size={20} /> : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
              </svg>
            )}
          </button>

          <button className="icon-btn cart-btn" onClick={toggleCart} aria-label="Open cart">
            <ShoppingBag size={20} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
        </div>
      </div>

      {/* Mobile Search Bar — slides in below nav */}
      <div className={`mobile-search-bar ${isMobileSearchOpen ? 'open' : ''}`}>
        <SearchBar />
      </div>
    </header>
  );
};

export default Navbar;
