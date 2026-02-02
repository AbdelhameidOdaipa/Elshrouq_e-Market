import { Routes, Route, Link } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import Header from './components/Header'
import HomePage from './pages/HomePage'
import CartPage from './pages/CartPage'
import LoginPage from './pages/LoginPage'
import ProductPage from './pages/ProductPage'
import InventoryPage from './pages/InventoryPage' // ← جديد
import NotFoundPage from './pages/NotFoundPage'
import './App.css'

function App() {
  return (
    <CartProvider>
      <div className="app">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/inventory" element={<InventoryPage />} /> {/* ← جديد */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <footer className="footer">
          <div className="container">
            <div className="footer-links">
              <Link to="/">الرئيسية</Link>
              <Link to="/cart">السلة</Link>
              <Link to="/inventory">المخزون</Link> {/* ← جديد */}
              <Link to="/login">تسجيل الدخول</Link>
            </div>
            <h3>© 2026  - "Al.Shrouq_Web-Develping Office"جميع الحقوق محفوظة</h3>
            <h4 className="footer-developed-by">تم التطوير باستخدام React + Vite + React Router</h4>
          </div>
        </footer>
      </div>
    </CartProvider>
  )
}

export default App