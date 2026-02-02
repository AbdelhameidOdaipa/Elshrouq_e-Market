
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import './LoginPage.css'

const LoginPage = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showWelcome, setShowWelcome] = useState(false)
  const navigate = useNavigate()
  
  // استخدم الـ login من الـ context
  const { login, isLoggedIn } = useCart()

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    
    if (!username.trim() || !password.trim()) {
      setError('يرجى إدخال اسم المستخدم وكلمة المرور')
      return
    }
    
    try {
      // استخدم الـ login من الـ context
      login({ username, email: `${username}@example.com` })
      
      // عرض رسالة الترحيب
      setShowWelcome(true)
      
      // بعد 2 ثانية يروح للرئيسية
      setTimeout(() => {
        navigate('/')
      }, 2000)
      
    } catch (error) {
      setError('حدث خطأ في تسجيل الدخول')
    }
  }

  // لو المستخدم مسجل دخول بالفعل، روح للرئيسية
  if (isLoggedIn) {
    navigate('/')
    return null
  }

  return (
    <div className="container">
      {showWelcome ? (
        // شاشة الترحيب
        <div className="welcome-container">
          <div className="welcome-box">
            <div className="welcome-icon">
              <i className="fas fa-party-horn fa-4x"></i>
              <i className="fas fa-heart fa-3x"></i>
              <i className="fas fa-star fa-3x"></i>
            </div>
            <h1 className="welcome-title">🎉 أهلاً وسهلاً بك! 🎉</h1>
            <p className="welcome-message">
              تم تسجيل دخولك بنجاح. نتمنى لك تجربة تسوق ممتعة في متجرنا!
            </p>
            <div className="welcome-details">
              <p><i className="fas fa-user"></i> مرحباً <strong>{username}</strong></p>
              <p><i className="fas fa-gift"></i> احصل على خصم 10% على أول عملية شراء!</p>
            </div>
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>جاري تحويلك للصفحة الرئيسية...</p>
            </div>
          </div>
        </div>
      ) : (
        // شاشة تسجيل الدخول
        <div className="login-container">
          <div className="login-box">
            <h1 className="login-title">تسجيل الدخول</h1>
            
            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="username">اسم المستخدم</label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="أدخل اسم المستخدم"
                  className="form-input"
                  autoFocus
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="password">كلمة المرور</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="أدخل كلمة المرور"
                  className="form-input"
                />
              </div>
              
              {error && <div className="error-message">{error}</div>}
              
              <button type="submit" className="btn btn-primary login-btn">
                <i className="fas fa-sign-in-alt"></i> تسجيل الدخول
              </button>
              
              <div className="login-options">
                <div className="remember-me">
                  <input type="checkbox" id="remember" />
                  <label htmlFor="remember">تذكرني</label>
                </div>
                <a href="#" className="forgot-password">
                  نسيت كلمة المرور؟
                </a>
              </div>
              
              <div className="login-hint">
                <p>
                  <i className="fas fa-info-circle"></i>
                  بيانات الدخول التجريبية:
                </p>
                <p>اسم المستخدم: <strong>user</strong></p>
                <p>كلمة المرور: <strong>123</strong></p>
              </div>
              
              <div className="back-to-home">
                <button 
                  type="button"
                  onClick={() => navigate('/')}
                  className="btn btn-secondary"
                >
                  <i className="fas fa-arrow-right"></i> العودة للرئيسية
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default LoginPage