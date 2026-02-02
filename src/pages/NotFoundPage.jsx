import { useNavigate } from 'react-router-dom'
import './NotFoundPage.css'

const NotFoundPage = () => {
  const navigate = useNavigate()

  return (
    <div className="container">
      <div className="not-found">
        <div className="error-code">404</div>
        <h1 className="error-title">الصفحة غير موجودة</h1>
        <p className="error-message">
          عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
        </p>
        
        <div className="error-actions">
          <button 
            onClick={() => navigate('/')}
            className="btn btn-primary"
          >
            <i className="fas fa-home"></i> العودة للرئيسية
          </button>
          
          <button 
            onClick={() => navigate(-1)}
            className="btn btn-secondary"
          >
            <i className="fas fa-arrow-right"></i> الرجوع للصفحة السابقة
          </button>
        </div>
        
        <div className="error-suggestions">
          <h3>اقتراحات:</h3>
          <ul>
            <li>تأكد من كتابة الرابط بشكل صحيح</li>
            <li>استخدم شريط البحث للعثور على المنتج</li>
            <li>تصفح المنتجات من الصفحة الرئيسية</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage