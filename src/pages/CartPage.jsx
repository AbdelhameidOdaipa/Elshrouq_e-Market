import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import './CartPage.css'

const CartPage = () => {
  const navigate = useNavigate()
  const { 
    cart, 
    removeFromCart, 
    updateQuantity, 
    getStockInfo,
    clearCart,
    totalItems,
    totalPrice 
  } = useCart()
  
  const [coupon, setCoupon] = useState('')
  const [couponMessage, setCouponMessage] = useState('')
  const [discount, setDiscount] = useState(0)
  
  const handleApplyCoupon = () => {
    if (!coupon.trim()) {
      setCouponMessage('الرجاء إدخال كود الخصم')
      return
    }
    
    const validCoupons = {
      'WELCOME10': 10,
      'SAVE20': 20,
      'SPECIAL15': 15
    }
    
    if (validCoupons[coupon.toUpperCase()]) {
      const discountPercent = validCoupons[coupon.toUpperCase()]
      const discountAmount = (totalPrice * discountPercent) / 100
      setDiscount(discountAmount)
      setCouponMessage(`تم تطبيق خصم ${discountPercent}%`)
    } else {
      setCouponMessage('كود الخصم غير صالح')
      setDiscount(0)
    }
  }
  
  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('السلة فارغة')
      return
    }
    navigate('/checkout')
  }
  
  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity >= 1) {
      if (getStockInfo) {
        const stockInfo = getStockInfo(productId)
        if (stockInfo && newQuantity > stockInfo.totalStock) {
          alert(`الكمية المطلوبة (${newQuantity}) تتجاوز المخزون المتاح (${stockInfo.totalStock})`)
          return
        }
      }
      updateQuantity(productId, newQuantity)
    }
  }
  
  const finalPrice = totalPrice - discount
  
  if (cart.length === 0) {
    return (
      <div className="container">
        <div className="empty-cart">
          <i className="fas fa-shopping-cart fa-4x"></i>
          <h2>سلة التسوق فارغة</h2>
          <p>لم تقم بإضافة أي منتجات إلى سلة التسوق بعد</p>
          <button 
            onClick={() => navigate('/')}
            className="btn btn-primary"
          >
            <i className="fas fa-shopping-bag"></i> تصفح المنتجات
          </button>
        </div>
      </div>
    )
  }
  
  return (
    <div className="container">
      <h1 className="page-title">🛒 سلة التسوق</h1>
      
      <div className="cart-summary">
        <div className="summary-item">
          <i className="fas fa-box"></i>
          <span>عدد المنتجات:</span>
          <strong>{totalItems}</strong>
        </div>
        <div className="summary-item">
          <i className="fas fa-tags"></i>
          <span>الخصم:</span>
          <strong className="discount">-{discount.toLocaleString()} جنيه</strong>
        </div>
        <div className="summary-item total">
          <i className="fas fa-receipt"></i>
          <span>الإجمالي:</span>
          <strong className="final-price">{finalPrice.toLocaleString()} جنيه</strong>
        </div>
      </div>
      
      <div className="cart-layout">
        {/* قائمة المنتجات */}
        <div className="cart-items-section">
          <div className="cart-header">
            <h3>المنتجات ({cart.length})</h3>
            <button 
              onClick={clearCart}
              className="btn btn-danger btn-sm"
            >
              <i className="fas fa-trash"></i> إفراغ السلة
            </button>
          </div>
          
          {cart.map(item => {
            const stockInfo = getStockInfo ? getStockInfo(item.id) : null
            
            return (
              <div key={item.id} className="cart-item">
                <div className="item-image">
                  <img 
                    src={item.image || item.thumbnail || 'https://via.placeholder.com/100x100?text=Product'} 
                    alt={item.name || item.title}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/100x100?text=Image'
                    }}
                  />
                </div>
                
                <div className="item-details">
                  <h4 className="item-title">{item.name || item.title}</h4>
                  <p className="item-category">{item.category || 'غير مصنف'}</p>
                  
                  {stockInfo && (
                    <div className="stock-info">
                      <span className={`stock-status ${stockInfo.remainingStock > 10 ? 'in-stock' : 'low-stock'}`}>
                        {stockInfo.remainingStock > 10 ? 'متوفر' : 'كمية محدودة'}
                      </span>
                      <span className="stock-count">
                        (المخزون: {stockInfo.totalStock})
                      </span>
                    </div>
                  )}
                  
                  <div className="item-price">
                    <span className="price">{(item.price * item.quantity).toLocaleString()} جنيه</span>
                    <span className="unit-price">
                      {item.quantity} × {item.price.toLocaleString()} جنيه
                    </span>
                  </div>
                </div>
                
                <div className="item-controls">
                  <div className="quantity-control">
                    <button 
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      className="qty-btn"
                      disabled={item.quantity <= 1}
                    >
                      <i className="fas fa-minus"></i>
                    </button>
                    <input 
                      type="number" 
                      min="1"
                      max={stockInfo ? stockInfo.totalStock : 99}
                      value={item.quantity}
                      onChange={(e) => {
                        const newQty = parseInt(e.target.value) || 1
                        handleQuantityChange(item.id, newQty)
                      }}
                      className="qty-input"
                    />
                    <button 
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      className="qty-btn"
                      disabled={stockInfo && item.quantity >= stockInfo.totalStock}
                    >
                      <i className="fas fa-plus"></i>
                    </button>
                  </div>
                  
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="btn btn-danger remove-btn"
                  >
                    <i className="fas fa-trash"></i> حذف
                  </button>
                </div>
              </div>
            )
          })}
        </div>
        
        {/* ملخص الطلب */}
        <div className="order-summary-section">
          <div className="order-summary-card">
            <h3>ملخص الطلب</h3>
            
            <div className="summary-details">
              <div className="summary-row">
                <span>إجمالي المنتجات:</span>
                <span>{totalPrice.toLocaleString()} جنيه</span>
              </div>
              
              <div className="summary-row">
                <span>التوصيل:</span>
                <span className="free-shipping">مجاني</span>
              </div>
              
              {discount > 0 && (
                <div className="summary-row discount-row">
                  <span>الخصم:</span>
                  <span className="discount-amount">-{discount.toLocaleString()} جنيه</span>
                </div>
              )}
              
              <div className="summary-row total-row">
                <span>الإجمالي النهائي:</span>
                <span className="final-total">{finalPrice.toLocaleString()} جنيه</span>
              </div>
            </div>
            
            {/* كوبون الخصم */}
            <div className="coupon-section">
              <h4>كود الخصم</h4>
              <div className="coupon-input-group">
                <input 
                  type="text" 
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  placeholder="أدخل كود الخصم"
                  className="coupon-input"
                />
                <button 
                  onClick={handleApplyCoupon}
                  className="btn btn-outline-primary"
                >
                  تطبيق
                </button>
              </div>
              {couponMessage && (
                <div className={`coupon-message ${couponMessage.includes('غير صالح') ? 'error' : 'success'}`}>
                  {couponMessage}
                </div>
              )}
              <div className="coupon-hint">
                <small>أكواد متاحة: WELCOME10, SAVE20, SPECIAL15</small>
              </div>
            </div>
            
            {/* زر الشراء */}
            <button 
              onClick={handleCheckout}
              className="btn btn-success checkout-btn"
            >
              <i className="fas fa-lock"></i> إتمام عملية الشراء
            </button>
            
            <div className="payment-methods">
              <p>طرق الدفع المتاحة:</p>
              <div className="payment-icons">
                <i className="fab fa-cc-visa"></i>
                <i className="fab fa-cc-mastercard"></i>
                <i className="fas fa-credit-card"></i>
                <i className="fas fa-money-bill-wave"></i>
              </div>
            </div>
            
            <div className="security-note">
              <i className="fas fa-shield-alt"></i>
              <p>مشترياتك آمنة معنا. بياناتك محمية باستخدام تشفير SSL</p>
            </div>
          </div>
          
          {/* مزايا إضافية */}
          <div className="benefits-card">
            <h4>مزايا الشراء من متجرنا</h4>
            <div className="benefit">
              <i className="fas fa-shipping-fast"></i>
              <div>
                <strong>شحن مجاني</strong>
                <p>لجميع الطلبات فوق 500 جنيه</p>
              </div>
            </div>
            <div className="benefit">
              <i className="fas fa-exchange-alt"></i>
              <div>
                <strong>إرجاع سهل</strong>
                <p>خلال 14 يوم من الاستلام</p>
              </div>
            </div>
            <div className="benefit">
              <i className="fas fa-headset"></i>
              <div>
                <strong>دعم فني</strong>
                <p>متاح على مدار الساعة</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* روابط سريعة */}
      <div className="quick-links">
        <button 
          onClick={() => navigate('/')}
          className="btn btn-outline-primary"
        >
          <i className="fas fa-arrow-right"></i> مواصلة التسوق
        </button>
        <button 
          onClick={() => navigate('/checkout')}
          className="btn btn-primary"
        >
          <i className="fas fa-credit-card"></i> الدفع السريع
        </button>
      </div>
    </div>
  )
}

export default CartPage