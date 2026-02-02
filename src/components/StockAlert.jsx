import { useCart } from '../context/CartContext'
import './StockAlert.css'

const StockAlert = ({ productId, showCartInfo = true }) => {
  const { getStockInfo } = useCart()
  const stockInfo = getStockInfo(productId)

  if (!stockInfo) return null

  const { totalStock, remainingStock, inCart } = stockInfo

  const getStockLevel = () => {
    if (remainingStock <= 0) return 'out'
    if (remainingStock <= 3) return 'low'
    if (remainingStock <= 10) return 'medium'
    return 'high'
  }

  const stockLevel = getStockLevel()

  const messages = {
    out: {
      text: 'نفذ من المخزون',
      icon: 'fas fa-times-circle',
      class: 'out-of-stock'
    },
    low: {
      text: `مخزون منخفض (${remainingStock} متبقي)`,
      icon: 'fas fa-exclamation-triangle',
      class: 'low-stock'
    },
    medium: {
      text: `مخزون محدود (${remainingStock} متبقي)`,
      icon: 'fas fa-info-circle',
      class: 'medium-stock'
    },
    high: {
      text: `متوفر (${remainingStock} متبقي)`,
      icon: 'fas fa-check-circle',
      class: 'high-stock'
    }
  }

  const message = messages[stockLevel]

  return (
    <div className={`stock-alert ${message.class}`}>
      <div className="stock-info">
        <i className={message.icon}></i>
        <span className="stock-text">{message.text}</span>
        
        {showCartInfo && inCart > 0 && (
          <span className="cart-info">
            ({inCart} في السلة)
          </span>
        )}
      </div>
      
      {stockLevel !== 'out' && (
        <div className="stock-progress">
          <div 
            className="stock-progress-bar"
            style={{ 
              width: `${(remainingStock / totalStock) * 100}%`,
              backgroundColor: stockLevel === 'low' ? '#e74c3c' : 
                              stockLevel === 'medium' ? '#f39c12' : '#2ecc71'
            }}
          ></div>
          <div className="stock-numbers">
            <span>0</span>
            <span>{totalStock}</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default StockAlert