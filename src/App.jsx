import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { ComparisonProvider } from './context/ComparisonContext';
import Navbar from './components/Navbar/Navbar';
import CartDrawer from './components/CartDrawer/CartDrawer';
import ComparisonTray from './components/ComparisonTray/ComparisonTray';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import CompanyProfile from './pages/CompanyProfile';
import Brands from './pages/Brands';
import FlashSalePage from './pages/FlashSalePage';
import WishlistPage from './pages/WishlistPage';
import ComparePage from './pages/ComparePage';

function App() {
  return (
    <CartProvider>
      <WishlistProvider>
        <ComparisonProvider>
          <Router>
            <Navbar />
            <CartDrawer />
            <ComparisonTray />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/brands" element={<Brands />} />
                <Route path="/company/:id" element={<CompanyProfile />} />
                <Route path="/sales" element={<FlashSalePage />} />
                <Route path="/wishlist" element={<WishlistPage />} />
                <Route path="/compare" element={<ComparePage />} />
                <Route path="*" element={<Home />} />
              </Routes>
            </main>
          </Router>
        </ComparisonProvider>
      </WishlistProvider>
    </CartProvider>
  );
}

export default App;
