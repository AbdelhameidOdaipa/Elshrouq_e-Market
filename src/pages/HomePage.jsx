import { useState, useEffect } from 'react'
import { useCart } from '../context/CartContext'
import ProductGrid from '../components/ProductGrid'
import SearchBar from '../components/SearchBar'
import './HomePage.css'


const HomePage = () => {
  const { products, addToCart, getProductsByCategory, loading } = useCart()
  const [filteredProducts, setFilteredProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  
  // تحديث المنتجات عند تحميلها
  
  useEffect(() => {
    if (products && products.length > 0) {
      setFilteredProducts(products)
    }
  }, [products])

  // البحث في المنتجات
 const handleSearch = (term) => {
  setSearchTerm(term)
  
  if (!term.trim()) {
    setFilteredProducts(products)
    return
  }
  
  const searchTermLower = term.toLowerCase().trim()
  
  const filtered = products.filter(product => {
    // تأكد أن كل الحقول موجودة قبل البحث
    const name = (product.name || product.title || '').toLowerCase()
    const description = (product.description || '').toLowerCase()
    const category = (product.category || '').toLowerCase()
    const brand = (product.brand || '').toLowerCase()
    
    // ابحث فقط في name و category
    return (
      name.includes(searchTermLower) || 
      category.includes(searchTermLower)
    )
  })
  
  setFilteredProducts(filtered)
}

  // التصفية حسب الفئة
  const handleFilter = (category) => {
    if (!category || category === 'all') {
      setFilteredProducts(products)
      return
    }
    
    if (getProductsByCategory && typeof getProductsByCategory === 'function') {
      const filtered = getProductsByCategory(category)
      setFilteredProducts(filtered)
    } else {
      // فلترة يدوية إذا لم تكن الدالة متوفرة
      const filtered = products.filter(product => 
        product.category && product.category.toLowerCase() === category.toLowerCase()
      )
      setFilteredProducts(filtered)
    }
  }

  // حالة التحميل
  if (loading) {
    return (
      <div className="container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>جاري تحميل المنتجات...</p>
        </div>
      </div>
    )
  }

  // حالة عدم وجود منتجات
  if (!products || products.length === 0) {
    return (
      <div className="container">
        <h1 className="page-title">🌄الشروق ماركت🌞</h1>
        <div className="no-products">
          <i className="fas fa-shopping-cart fa-3x"></i>
          <h3>لا توجد منتجات متاحة حالياً</h3>
          <p>سيتم إضافة منتجات جديدة قريباً</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <h1 className="page-title">🛍️ الشـروق ماركت🌞</h1>
      <p style={{ textAlign: 'center', marginBottom: '30px', color: '#7f8c8d' }}>
        اكتشف أحدث الأجهزة الإلكترونية بأفضل الأسعار في السوق
      </p>
      
      <SearchBar onSearch={handleSearch} onFilter={handleFilter} />
      
      {/* شريط معلومات البحث */}
      {searchTerm && (
        <div className="search-results-info">
          <div className="search-info-content">
            <p>
              نتائج البحث عن: "<strong>{searchTerm}</strong>" 
              <span className="results-count"> ({filteredProducts.length} منتج)</span>
            </p>
            <button 
              onClick={() => {
                setSearchTerm('')
                setFilteredProducts(products)
              }}
              className="btn btn-secondary clear-search-btn"
            >
              <i className="fas fa-times"></i> مسح البحث
            </button>
          </div>
        </div>
      )}

      {/* معلومات الفلترة */}
      {!searchTerm && filteredProducts.length !== products.length && (
        <div className="filter-info">
          <p>
            عرض <strong>{filteredProducts.length}</strong> من أصل <strong>{products.length}</strong> منتج
          </p>
          <button 
            onClick={() => setFilteredProducts(products)}
            className="btn btn-outline-primary"
          >
            عرض الكل
          </button>
        </div>
      )}

      {/* عرض المنتجات */}
      <div className="products-section">
        {filteredProducts.length > 0 ? (
          <>
            <ProductGrid products={filteredProducts} onAddToCart={addToCart} />
            
            {/* ملاحظة في الأسفل */}
            {filteredProducts.length < 10 && (
              <div className="products-note">
                <i className="fas fa-info-circle"></i>
                عرض {filteredProducts.length} منتج. جرب البحث عن فئات أخرى.
              </div>
            )}
          </>
        ) : (
          <div className="no-results">
            <div className="no-results-icon">
              <i className="fas fa-search fa-3x"></i>
            </div>
            <h3>لا توجد منتجات مطابقة للبحث</h3>
            <p className="no-results-text">
              لم نجد منتجات تطابق "<strong>{searchTerm}</strong>"
            </p>
            <div className="suggestions">
              <p>جرب:</p>
              <ul>
                <li>استخدام كلمات بحث مختلفة</li>
                <li>تغيير الفئة المحددة</li>
                <li>التصفح بين جميع المنتجات</li>
              </ul>
            </div>
            <button 
              onClick={() => {
                setSearchTerm('')
                setFilteredProducts(products)
              }}
              className="btn btn-primary view-all-btn"
            >
              <i className="fas fa-eye"></i> عرض جميع المنتجات
            </button>
          </div>
        )}
      </div>

      {/* تذييل الصفحة */}
      <div className="home-footer">
        <div className="features">
          <div className="feature">
            <i className="fas fa-shipping-fast"></i>
            <h4>شحن مجاني</h4>
            <p>لجميع الطلبات فوق 500 جنيه</p>
          </div>
          <div className="feature">
            <i className="fas fa-shield-alt"></i>
            <h4>شراء آمن</h4>
            <p>بياناتك محمية دائماً</p>
          </div>
          <div className="feature">
            <i className="fas fa-headset"></i>
            <h4>For Support - El.Shrouq_WebDevelping 📞</h4>
            <p>متاح 24/7 لخدمتك</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage