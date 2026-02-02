import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import './Header.css'


const Header = () => {
  const { totalItems, isLoggedIn, user, logout } = useCart()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo" onClick={() => navigate('/')}>
            <i className="fas fa-store"></i>
            <h1>الشـروق ماركت </h1>
          </div>
          
          <nav className="nav">
            <ul className="nav-list">
              <li>
                <Link to="/" className="nav-link">
                  <i className="fas fa-home"></i> الرئيسية
                </Link>
              </li>
               <li>
      <Link to="/inventory" className="nav-link"> {/* ← جديد */}
        <i className="fas fa-boxes"></i> المخزون
      </Link>
    </li>
              <li className="cart-link">
                <Link to="/cart" className="nav-link">
                  <i className="fas fa-shopping-cart"></i> السلة
                  {totalItems > 0 && (
                    <span className="cart-badge">{totalItems}</span>
                  )}
                </Link>
              </li>
              
              {isLoggedIn ? (
                <>
                  <li className="welcome">
                    <span>مرحباً {user?.name}</span>
                  </li>
                  <li>
                    <button onClick={handleLogout} className="btn btn-secondary">
                      تسجيل الخروج
                    </button>
                  </li>
                </>
              ) : (
                <li>
                  <Link to="/login" className="login-btn">
                    <i className="fas fa-sign-in-alt" id="login-btn"></i> تسجيل الدخول
                  </Link>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header