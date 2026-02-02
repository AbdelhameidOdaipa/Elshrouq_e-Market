import { useCart } from '../context/CartContext'
import './CartItem.css'

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart()

  return (
    <div className="cart-item-component">
      <div className="cart-item-image">
        <img src={item.image} alt={item.name} />
      </div>
      
      <div className="cart-item-info">
        <h4 className="cart-item-name">{item.name}</h4>
        <p className="cart-item-desc">{item.description}</p>
        
        <div className="cart-item-price">
          <span>السعر: {item.price.toLocaleString()} جنيه</span>
          <span>الإجمالي: {(item.price * item.quantity).toLocaleString()} جنيه</span>
        </div>
        
        <div className="cart-item-actions">
          <div className="quantity-selector">
            <button 
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              className="qty-btn"
            >
              <i className="fas fa-minus"></i>
            </button>
            <span className="qty-value">{item.quantity}</span>
            <button 
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="qty-btn"
            >
              <i className="fas fa-plus"></i>
            </button>
          </div>
          
          <button 
            onClick={() => removeFromCart(item.id)}
            className="remove-item-btn"
          >
            <i className="fas fa-trash"></i> حذف
          </button>
        </div>
      </div>
    </div>
  )
}

export default CartItem