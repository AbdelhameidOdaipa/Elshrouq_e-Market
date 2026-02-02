import { useParams, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import ProductDetail from '../components/ProductDetail'
import '../styles/ProductDetail.css'

const ProductDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getProductById, addToCart } = useCart()
  
  const product = getProductById(id)

  if (!product) {
    return (
      <div className="product-detail-container">
        <button className="btn btn-secondary back-btn" onClick={() => navigate('/')}>
          <i className="fas fa-arrow-right"></i> العودة للرئيسية
        </button>
        <div className="product-not-found">
          <h2>المنتج غير موجود</h2>
        </div>
      </div>
    )
  }

  const handleBack = () => {
    navigate('/')
  }

  return (
    <ProductDetail 
      product={product}
      onAddToCart={addToCart}
      onBack={handleBack}
    />
  )
}

export default ProductDetailPage