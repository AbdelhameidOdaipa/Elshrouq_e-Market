import ProductCard from './ProductCard'
import './ProductGrid.css'

const ProductGrid = ({ products, onAddToCart }) => {
  return (
    <div className="product-grid">
      {products.map(product => (
        <ProductCard 
          key={product.id} 
          product={product}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  )
}

export default ProductGrid