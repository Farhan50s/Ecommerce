import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { MOCK_PRODUCTS } from '../../data/mockData';
import './SearchBar.css';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Debounce: update debouncedQuery 200ms after the user stops typing
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 200);
    return () => clearTimeout(timer);
  }, [query]);

  // Filter products whenever debouncedQuery changes
  useEffect(() => {
    if (debouncedQuery.trim() === '') {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }
    const q = debouncedQuery.toLowerCase();
    const results = MOCK_PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
    setSuggestions(results);
    setIsOpen(true);
    setHighlightedIndex(-1);
  }, [debouncedQuery]);

  // Close dropdown when clicking outside the component
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (product) => {
    setQuery('');
    setSuggestions([]);
    setIsOpen(false);
    navigate(`/product/${product.id}`);
  };

  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (!isOpen) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
        handleSelect(suggestions[highlightedIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setHighlightedIndex(-1);
      inputRef.current?.blur();
    }
  };

  return (
    <div className="searchbar-container" ref={containerRef}>
      <div className={`searchbar-input-wrapper ${isOpen ? 'focused' : ''}`}>
        <Search size={16} className="searchbar-icon" />
        <input
          ref={inputRef}
          type="text"
          className="searchbar-input"
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (suggestions.length > 0) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          aria-label="Search products"
          aria-autocomplete="list"
          aria-expanded={isOpen}
        />
        {query && (
          <button className="searchbar-clear-btn" onClick={handleClear} aria-label="Clear search">
            <X size={14} />
          </button>
        )}
      </div>

      {isOpen && (
        <div className="searchbar-dropdown" role="listbox">
          {suggestions.length > 0 ? (
            <ul className="searchbar-suggestion-list">
              {suggestions.map((product, index) => (
                <li
                  key={product.id}
                  role="option"
                  aria-selected={index === highlightedIndex}
                  className={`searchbar-suggestion-item ${index === highlightedIndex ? 'highlighted' : ''}`}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  onMouseLeave={() => setHighlightedIndex(-1)}
                  onClick={() => handleSelect(product)}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="suggestion-thumbnail"
                  />
                  <div className="suggestion-info">
                    <span className="suggestion-name">{product.name}</span>
                    <span className="suggestion-category">{product.category}</span>
                  </div>
                  <span className="suggestion-price">${product.price.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="searchbar-empty-state">
              No products found for &ldquo;<strong>{debouncedQuery}</strong>&rdquo;
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
