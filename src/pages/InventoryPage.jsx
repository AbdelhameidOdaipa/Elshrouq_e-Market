import { useState } from 'react'
import { useCart } from '../context/CartContext'
import './InventoryPage.css'

const InventoryPage = () => {
  const { getInventory, updateStockManually } = useCart()
  const inventory = getInventory()
  const [editingProduct, setEditingProduct] = useState(null)
  const [newStock, setNewStock] = useState('')

  // تجميع المنتجات حسب الحالة
  const outOfStock = inventory.filter(item => item.status === 'نفذ')
  const lowStock = inventory.filter(item => item.status === 'محدود')
  const inStock = inventory.filter(item => item.status === 'متوفر')

  const handleEditClick = (product) => {
    setEditingProduct(product.id)
    setNewStock(product.totalStock)
  }

  const handleSaveStock = (productId) => {
    const stockValue = parseInt(newStock)
    if (!isNaN(stockValue) && stockValue >= 0) {
      updateStockManually(productId, stockValue)
      setEditingProduct(null)
      setNewStock('')
    }
  }

  const handleCancelEdit = () => {
    setEditingProduct(null)
    setNewStock('')
  }

  const renderStatusBadge = (status) => {
    switch(status) {
      case 'نفذ':
        return <span className="status-badge out-of-stock">نفذ</span>
      case 'محدود':
        return <span className="status-badge low-stock">محدود</span>
      case 'متوفر':
        return <span className="status-badge in-stock">متوفر</span>
      default:
        return null
    }
  }

  const renderStockRow = (item) => (
    <tr key={item.id}>
      <td>
        <div className="product-cell">
          <img src={item.image} alt={item.name} className="product-thumbnail" />
          <div className="product-info">
            <div className="product-name">{item.name}</div>
            <div className="product-category">{item.category}</div>
          </div>
        </div>
      </td>
      <td>
        {editingProduct === item.id ? (
          <input
            type="number"
            value={newStock}
            onChange={(e) => setNewStock(e.target.value)}
            className="stock-input"
            min="0"
          />
        ) : (
          <div className="stock-display">
            <strong>{item.totalStock}</strong>
          </div>
        )}
      </td>
      <td>
        <div className={`cart-count ${item.inCart > 0 ? 'has-items' : ''}`}>
          {item.inCart}
        </div>
      </td>
      <td>
        {editingProduct === item.id ? (
          <div className="stock-display">
            {parseInt(newStock) - item.inCart}
          </div>
        ) : (
          <div className={`remaining-stock ${item.remainingStock <= 5 ? 'warning' : ''}`}>
            {item.remainingStock}
          </div>
        )}
      </td>
      <td>{renderStatusBadge(item.status)}</td>
      <td>
        {editingProduct === item.id ? (
          <div className="edit-actions">
            <button 
              onClick={() => handleSaveStock(item.id)}
              className="btn btn-success btn-sm"
            >
              حفظ
            </button>
            <button 
              onClick={handleCancelEdit}
              className="btn btn-secondary btn-sm"
            >
              إلغاء
            </button>
          </div>
        ) : (
          <button 
            onClick={() => handleEditClick(item)}
            className="btn btn-primary btn-sm"
          >
            <i className="fas fa-edit"></i> تعديل
          </button>
        )}
      </td>
    </tr>
  )

  return (
    <div className="container">
      <h1 className="page-title">📦 إدارة المخزون</h1>
      
      <div className="inventory-summary">
        <div className="summary-card">
          <div className="summary-icon total">
            <i className="fas fa-boxes"></i>
          </div>
          <div className="summary-info">
            <h3>إجمالي المنتجات</h3>
            <p className="summary-count">{inventory.length}</p>
          </div>
        </div>
        
        <div className="summary-card">
          <div className="summary-icon out">
            <i className="fas fa-exclamation-triangle"></i>
          </div>
          <div className="summary-info">
            <h3>منتجات نفدت</h3>
            <p className="summary-count">{outOfStock.length}</p>
          </div>
        </div>
        
        <div className="summary-card">
          <div className="summary-icon low">
            <i className="fas fa-exclamation-circle"></i>
          </div>
          <div className="summary-info">
            <h3>مخزون محدود</h3>
            <p className="summary-count">{lowStock.length}</p>
          </div>
        </div>
        
        <div className="summary-card">
          <div className="summary-icon in-cart">
            <i className="fas fa-shopping-cart"></i>
          </div>
          <div className="summary-info">
            <h3>في السلة</h3>
            <p className="summary-count">
              {inventory.reduce((sum, item) => sum + item.inCart, 0)}
            </p>
          </div>
        </div>
      </div>

      {/* جدول المخزون */}
      <div className="inventory-table-container">
        <h2 className="section-title">
          <i className="fas fa-list"></i> جدول المخزون
        </h2>
        
        <div className="table-responsive">
          <table className="inventory-table">
            <thead>
              <tr>
                <th>المنتج</th>
                <th>المخزون الكلي</th>
                <th>في السلة</th>
                <th>المتبقي</th>
                <th>الحالة</th>
                <th>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map(renderStockRow)}
            </tbody>
          </table>
        </div>
      </div>

      {/* المنتجات منخفضة المخزون */}
      {lowStock.length > 0 && (
        <div className="alert-section">
          <div className="alert alert-warning">
            <h3>
              <i className="fas fa-exclamation-triangle"></i> 
              تحذير: منتجات ذات مخزون منخفض
            </h3>
            <div className="low-stock-products">
              {lowStock.map(item => (
                <div key={item.id} className="low-stock-item">
                  <img src={item.image} alt={item.name} />
                  <div>
                    <strong>{item.name}</strong>
                    <div>المخزون المتبقي: {item.remainingStock}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* المنتجات التي نفدت */}
      {outOfStock.length > 0 && (
        <div className="alert-section">
          <div className="alert alert-danger">
            <h3>
              <i className="fas fa-times-circle"></i> 
              منتجات نفدت من المخزون
            </h3>
            <div className="out-of-stock-products">
              {outOfStock.map(item => (
                <div key={item.id} className="out-of-stock-item">
                  <img src={item.image} alt={item.name} />
                  <div>
                    <strong>{item.name}</strong>
                    <div>تم بيع {item.totalStock} قطعة</div>
                  </div>
                  <button 
                    onClick={() => handleEditClick(item)}
                    className="btn btn-primary btn-sm"
                  >
                    إضافة مخزون
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default InventoryPage