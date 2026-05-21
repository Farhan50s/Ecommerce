import React, { createContext, useContext, useState, useEffect } from 'react';

const ComparisonContext = createContext();

export const useComparison = () => {
  const context = useContext(ComparisonContext);
  if (!context) {
    throw new Error('useComparison must be used within a ComparisonProvider');
  }
  return context;
};

export const ComparisonProvider = ({ children }) => {
  const [comparisonItems, setComparisonItems] = useState(() => {
    try {
      const saved = localStorage.getItem('comparisonItems');
      if (saved) {
        // Enforce max 2 on hydration in case old data had 3
        return JSON.parse(saved).slice(0, 2);
      }
    } catch (e) {
      console.warn('Failed to load comparison items from localStorage:', e);
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('comparisonItems', JSON.stringify(comparisonItems));
  }, [comparisonItems]);

  const addToComparison = (product) => {
    setComparisonItems(prev => {
      if (prev.length >= 2 || prev.find(item => item.id === product.id)) {
        return prev;
      }
      return [...prev, product];
    });
  };

  const removeFromComparison = (productId) => {
    setComparisonItems(prev => prev.filter(item => item.id !== productId));
  };

  const clearComparison = () => {
    setComparisonItems([]);
  };

  const isCompared = (productId) => {
    return comparisonItems.some(item => item.id === productId);
  };

  return (
    <ComparisonContext.Provider
      value={{
        comparisonItems,
        addToComparison,
        removeFromComparison,
        clearComparison,
        isCompared,
      }}
    >
      {children}
    </ComparisonContext.Provider>
  );
};
