
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import './ProductPage.css'

const ProductPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart, getProductById, products } = useCart()
  
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [relatedProducts, setRelatedProducts] = useState([])

  // جلب بيانات المنتج
  useEffect(() => {
    const fetchProduct = () => {
      try {
        setLoading(true)
        setError(null)
        
        // استخدم الدالة من الـ Context
        const localProduct = getProductById ? getProductById(id) : null
        
        if (localProduct) {
          const formattedLocalProduct = {
            id: localProduct.id,
            name: localProduct.name || localProduct.title || 'منتج غير معروف',
            description: localProduct.description || 'لا يوجد وصف للمنتج',
            price: localProduct.price || 0,
            discountPercentage: localProduct.discountPercentage || 0,
            discountedPrice: Math.round((localProduct.price || 0) * (1 - (localProduct.discountPercentage || 0) / 100)),
            image: localProduct.image || localProduct.thumbnail || 'https://placehold.co/400x300/cccccc/333333?text=Product',
            images: localProduct.images || [localProduct.image || localProduct.thumbnail || 'https://placehold.co/400x300/cccccc/333333?text=Product'],
            category: localProduct.category || 'غير مصنف',
            brand: localProduct.brand || 'غير معروف',
            rating: localProduct.rating || 4.0,
            stock: localProduct.stock || localProduct.remainingStock || 50,
            remainingStock: localProduct.remainingStock || localProduct.stock || 50,
            specifications: {
              weight: `${Math.floor(Math.random() * 2000) + 500}g`,
              dimensions: '15 x 10 x 5 cm',
              color: 'أسود',
              warranty: 'سنة واحدة'
            }
          }
          
          setProduct(formattedLocalProduct)
          setSelectedImage(0)
          
          // جلب منتجات ذات صلة من البيانات المحلية
          const relatedFromLocal = products.filter(p => 
            p.category === localProduct.category && 
            p.id !== localProduct.id
          ).slice(0, 3)
          
          setRelatedProducts(relatedFromLocal.map(p => ({
            id: p.id,
            name: p.name || p.title || 'منتج',
            price: p.price || 0,
            image: p.image || p.thumbnail || 'https://placehold.co/200x200/cccccc/333333?text=Product',
            rating: p.rating || 4.0
          })))
          
        } else {
          setError('المنتج غير موجود')
        }
        
      } catch (error) {
        console.error('Error fetching product:', error)
        setError('حدث خطأ في تحميل المنتج')
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id, getProductById, products])

  const handleAddToCart = () => {
    if (product) {
      if (typeof addToCart === 'function') {
        addToCart(product, quantity)
        alert(`تم إضافة ${quantity} من ${product.name} إلى السلة`)
      } else {
        console.error('addToCart is not a function')
        alert('حدث خطأ في إضافة المنتج إلى السلة')
      }
    }
  }

  const handleBuyNow = () => {
    if (product) {
      if (typeof addToCart === 'function') {
        addToCart(product, quantity)
        navigate('/cart')
      }
    }
  }

  const increaseQuantity = () => {
    if (product && quantity < (product.stock || 50)) {
      setQuantity(prev => prev + 1)
    }
  }

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1)
    }
  }

  const renderRatingStars = (rating) => {
    const stars = []
    const ratingValue = rating || 4.0
    const fullStars = Math.floor(ratingValue)
    const hasHalfStar = ratingValue % 1 >= 0.5

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<i key={i} className="fas fa-star filled"></i>)
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<i key={i} className="fas fa-star-half-alt"></i>)
      } else {
        stars.push(<i key={i} className="far fa-star"></i>)
      }
    }
    return stars
  }

  if (loading) {
    return (
      <div className="container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>جاري تحميل معلومات المنتج...</p>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="container">
        <div className="error-container">
          <i className="fas fa-exclamation-triangle fa-3x"></i>
          <h2>المنتج غير موجود</h2>
          <p>عذراً، المنتج الذي تبحث عنه غير متوفر أو تم إزالته</p>
          <button 
            onClick={() => navigate('/')}
            className="btn btn-primary"
          >
            <i className="fas fa-arrow-right"></i> العودة للمنتجات
          </button>
        </div>
      </div>
    )
  }

  const productName = product.name || 'منتج غير معروف'
  const productPrice = product.price || 0
  const productDiscount = product.discountPercentage || 0
  const productDiscountedPrice = product.discountedPrice || productPrice
  const productStock = product.stock || product.remainingStock || 50
  const productRating = product.rating || 4.0
  const productDescription = product.description || 'لا يوجد وصف للمنتج'
  const productCategory = product.category || 'غير مصنف'
  const productBrand = product.brand || 'غير معروف'
  const productImages = product.images && product.images.length > 0 ? product.images : ['https://placehold.co/500x400/cccccc/333333?text=No+Image']

  return (
    <div className="container">
      <button 
        onClick={() => navigate(-1)}
        className="btn btn-secondary back-btn"
      >
        <i className="fas fa-arrow-right"></i> الرجوع
      </button>

      <nav className="breadcrumb">
        <span onClick={() => navigate('/')}>الرئيسية</span>
        <i className="fas fa-chevron-left"></i>
        <span onClick={() => navigate(`/category/${productCategory}`)}>{productCategory}</span>
        <i className="fas fa-chevron-left"></i>
        <span className="current">{productName}</span>
      </nav>

      <div className="product-detail-wrapper">
        <div className="product-gallery">
          <div className="main-image-container">
            <img 
              src={productImages[selectedImage]} 
              alt={productName}
              className="main-image"
              onError={(e) => {
                e.target.src = 'https://placehold.co/500x400/cccccc/333333?text=No+Image'
              }}
            />
            {productDiscount > 0 && (
              <div className="discount-badge">
                -{productDiscount}%
              </div>
            )}
          </div>
          
          {productImages.length > 1 && (
            <div className="thumbnail-gallery">
              {productImages.map((img, index) => (
                <button
                  key={index}
                  className={`thumbnail-btn ${selectedImage === index ? 'active' : ''}`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img 
                    src={img} 
                    alt={`${productName} ${index + 1}`}
                    onError={(e) => {
                      e.target.src = 'https://placehold.co/100x100/cccccc/333333?text=Image'
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="product-info-section">
          <div className="product-header">
            <h1 className="product-title">{productName}</h1>
            <div className="product-meta">
              <span className="product-category">{productCategory}</span>
              <span className="product-brand">{productBrand}</span>
            </div>
          </div>

          <div className="rating-section">
            <div className="stars">
              {renderRatingStars(productRating)}
              <span className="rating-value">{productRating.toFixed(1)}</span>
            </div>
            <span className="reviews">({Math.floor(Math.random() * 100) + 50} تقييم)</span>
          </div>

          <div className="stock-section">
            <div className="stock-info">
              <i className="fas fa-box"></i>
              <span>المخزون: </span>
              <strong className={productStock > 10 ? 'in-stock' : 'low-stock'}>
                {productStock > 10 ? 'متوفر' : 'كمية محدودة'} ({productStock} قطعة)
              </strong>
            </div>
            {productStock < 20 && (
              <div className="stock-warning">
                <i className="fas fa-exclamation-circle"></i>
                سارع بالشراء، الكمية محدودة!
              </div>
            )}
          </div>

          <div className="price-section">
            {productDiscount > 0 ? (
              <>
                <div className="original-price">
                  <span>السعر الأصلي: </span>
                  <del>{productPrice.toLocaleString()} جنيه</del>
                </div>
                <div className="discounted-price">
                  <span>السعر بعد الخصم: </span>
                  <span className="current-price">
                    {productDiscountedPrice.toLocaleString()} جنيه
                  </span>
                </div>
                <div className="savings">
                  <i className="fas fa-tag"></i>
                  وفر {(productPrice - productDiscountedPrice).toLocaleString()} جنيه ({productDiscount}%)
                </div>
              </>
            ) : (
              <div className="regular-price">
                <span>السعر: </span>
                <span className="current-price">
                  {productPrice.toLocaleString()} جنيه
                </span>
              </div>
            )}
          </div>

          <div className="description-section">
            <h3>وصف المنتج</h3>
            <p className="product-description">{productDescription}</p>
          </div>

          <div className="specifications-section">
            <h3>المواصفات</h3>
            <div className="specs-grid">
              <div className="spec-item">
                <span className="spec-label">الوزن:</span>
                <span className="spec-value">{product.specifications?.weight || '500g'}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">الأبعاد:</span>
                <span className="spec-value">{product.specifications?.dimensions || '15 x 10 x 5 cm'}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">اللون:</span>
                <span className="spec-value">{product.specifications?.color || 'أسود'}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">الضمان:</span>
                <span className="spec-value">{product.specifications?.warranty || 'سنة واحدة'}</span>
              </div>
            </div>
          </div>

          <div className="purchase-section">
            <div className="quantity-selector">
              <h4>الكمية:</h4>
              <div className="quantity-controls">
                <button 
                  onClick={decreaseQuantity}
                  className="qty-btn"
                  disabled={quantity <= 1}
                >
                  <i className="fas fa-minus"></i>
                </button>
                <span className="qty-display">{quantity}</span>
                <button 
                  onClick={increaseQuantity}
                  className="qty-btn"
                  disabled={quantity >= productStock}
                >
                  <i className="fas fa-plus"></i>
                </button>
              </div>
              <span className="stock-note">
                متوفر {productStock} قطعة
              </span>
            </div>

            <div className="action-buttons">
              <button 
                onClick={handleAddToCart}
                className="btn btn-primary add-to-cart-btn"
                disabled={productStock === 0}
              >
                <i className="fas fa-cart-plus"></i>
                {productStock === 0 ? 'نفذ من المخزون' : `إضافة إلى السلة`}
                {quantity > 1 && ` (${quantity})`}
              </button>
              
              <button 
                onClick={handleBuyNow}
                className="btn btn-success buy-now-btn"
                disabled={productStock === 0}
              >
                <i className="fas fa-bolt"></i>
                شراء الآن
              </button>
            </div>

            <div className="total-price">
              الإجمالي: <strong>{(productDiscount > 0 ? productDiscountedPrice : productPrice) * quantity}</strong> جنيه
            </div>
          </div>

          <div className="services-section">
            <div className="service-item">
              <i className="fas fa-shipping-fast"></i>
              <div>
                <strong>شحن مجاني</strong>
                <p>لجميع الطلبات فوق 500 جنيه</p>
              </div>
            </div>
            <div className="service-item">
              <i className="fas fa-exchange-alt"></i>
              <div>
                <strong>إرجاع مجاني</strong>
                <p>خلال 14 يوم من الاستلام</p>
              </div>
            </div>
            <div className="service-item">
              <i className="fas fa-shield-alt"></i>
              <div>
                <strong>ضمان المنتج</strong>
                <p>لمدة سنة واحدة</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="related-products-section">
          <h2 className="section-title">منتجات ذات صلة</h2>
          <div className="related-products-grid">
            {relatedProducts.map(related => (
              <div 
                key={related.id}
                className="related-product-card"
                onClick={() => navigate(`/product/${related.id}`)}
              >
                <img 
                  src={related.image} 
                  alt={related.name}
                  onError={(e) => {
                    e.target.src = 'https://placehold.co/200x200/cccccc/333333?text=Product'
                  }}
                />
                <h4>{related.name}</h4>
                <div className="related-price">
                  {(related.price || 0).toLocaleString()} جنيه
                </div>
                <div className="related-rating">
                  {renderRatingStars(related.rating || 4.0)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="product-footer-notes">
        <div className="note">
          <i className="fas fa-info-circle"></i>
          جميع الأسعار تشمل الضريبة المضافة
        </div>
        <div className="note">
          <i className="fas fa-lock"></i>
          مشترياتك آمنة معنا
        </div>
      </div>
    </div>
  )
}

export default ProductPage