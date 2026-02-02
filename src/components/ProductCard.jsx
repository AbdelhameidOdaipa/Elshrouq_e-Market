import { useNavigate } from 'react-router-dom'
import StockAlert from './StockAlert' // ← جديد
import './ProductCard.css'

const ProductCard = ({ product, onAddToCart }) => {
  const navigate = useNavigate()

  const handleViewProduct = () => {
    navigate(`/product/${product.id}`)
  }
  const renderRating = (rating) => {
    return (
      <div className="product-rating">
        <i className="fas fa-star"></i>
        <span>{rating.toFixed(1)}</span>
      </div>
    )
  }
  const renderStock = (stock) => {
    if (stock > 50) {
      return <span className="stock-high">متوفر ({stock})</span>
    } else if (stock > 10) {
      return <span className="stock-medium">كمية محدودة</span>
    } else {
      return <span className="stock-low">آخر القطع</span>
    }
  }

  return (
    <div className="product-card">
      {product.rating >= 4.8 && (
        <div className="product-badge">الأفضل مبيعاً</div>
      )}
      
      <div className="product-image" onClick={handleViewProduct}>
        <img src={product.image} alt={product.name} />
      </div>
      
      <div className="product-info">
        <div className="product-brand">{product.brand}</div>
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.description.substring(0, 60)}...</p>
        
        <div className="product-meta">
          {renderRating(product.rating)}
          {renderStock(product.stock)}
        </div>
        
        <div className="product-footer">
          <div className="price-container">
            <span className="product-price">{product.price.toLocaleString()} جنيه</span>
            {product.price > 10000 && (
              <span className="product-savings">
                وفر {Math.floor(product.price * 0.1).toLocaleString()} جنيه
              </span>
            )}
             {/* عرض تنبيه المخزون ← جديد */}
        <div className="product-stock">
          <StockAlert productId={product.id} showCartInfo={false} />
        </div>
        
        <div className="product-footer">
          <div className="price-container">
            <span className="product-price">{product.price.toLocaleString()} جنيه</span>
          </div>
          <button 
            className="btn btn-primary"
            onClick={() => onAddToCart(product)}
            disabled={product.remainingStock <= 0} // ← تعطيل الزر إذا نفذ المخزون
          >
            <i className="fas fa-cart-plus"></i> 
            {product.remainingStock <= 0 ? 'نفذ' : 'أضف للسلة'}
          </button>
        </div>
          </div>
          <button 
            className="btn btn-primary"
            onClick={() => onAddToCart(product)}
          >
            <i className="fas fa-cart-plus"></i> أضف للسلة
            
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard