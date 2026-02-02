import React, { createContext, useState, useContext, useEffect } from 'react'

const CartContext = createContext()

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([])
  const [products, setProducts] = useState([])
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // دالة مساعدة للتحقق من JSON صالح
  const safeJSONParse = (itemName) => {
    try {
      const item = localStorage.getItem(itemName)
      if (!item || item === 'undefined' || item === 'null' || item.trim() === '') {
        return null
      }
      return JSON.parse(item)
    } catch (error) {
      console.error(`Error parsing ${itemName}:`, error)
      localStorage.removeItem(itemName)
      return null
    }
  }

  // بيانات المنتجات مباشرة
 // بيانات المنتجات مباشرة
const defaultProducts = [
  {
    id: 1,
    name: "iPhone 14 Pro",
    description: "هاتف ذكي بشاشة 6.1 بوصة بكاميرا 48 ميجابكسل",
    price: 45999,
    discountPercentage: 10,
    rating: 4.8,
    stock: 50,
    brand: "Apple",
    category: "smartphones",
    image: "https://placehold.co/400x300/007AFF/FFFFFF?text=iPhone+14+Pro",
    images: [
      "https://placehold.co/500x400/007AFF/FFFFFF?text=iPhone+Front",
      "https://placehold.co/500x400/007AFF/FFFFFF?text=iPhone+Back"
    ],
    remainingStock: 50
  },
  {
    id: 2,
    name: "Samsung Galaxy S23",
    description: "هاتف سامسونج الأحدث بشاشة ديناميكية AMOLED",
    price: 38999,
    discountPercentage: 8,
    rating: 4.7,
    stock: 30,
    brand: "Samsung",
    category: "smartphones",
    image: "https://placehold.co/400x300/000000/FFFFFF?text=Galaxy+S23",
    images: [
      "https://placehold.co/500x400/000000/FFFFFF?text=Galaxy+Front",
      "https://placehold.co/500x400/000000/FFFFFF?text=Galaxy+Back"
    ],
    remainingStock: 30
  },
  {
    id: 3,
    name: "MacBook Pro M2",
    description: "لابتوب أبل بشريحة M2 وبطارية تدوم 18 ساعة",
    price: 74999,
    discountPercentage: 5,
    rating: 4.9,
    stock: 25,
    brand: "Apple",
    category: "laptops",
    image: "https://placehold.co/400x300/333333/FFFFFF?text=MacBook+Pro",
    images: [
      "https://placehold.co/500x400/333333/FFFFFF?text=MacBook+Open",
      "https://placehold.co/500x400/333333/FFFFFF?text=MacBook+Closed"
    ],
    remainingStock: 25
  },
  {
    id: 4,
    name: "Dell XPS 13",
    description: "لابتوب ديل بشاشة لمس 13.4 بوصة",
    price: 42999,
    discountPercentage: 7,
    rating: 4.6,
    stock: 40,
    brand: "Dell",
    category: "laptops",
    image: "https://placehold.co/400x300/0056D2/FFFFFF?text=Dell+XPS+13",
    images: [
      "https://placehold.co/500x400/0056D2/FFFFFF?text=Dell+Front",
      "https://placehold.co/500x400/0056D2/FFFFFF?text=Dell+Back"
    ],
    remainingStock: 40
  },
  {
    id: 5,
    name: "عطر Armani Code",
    description: "عطر رجالي من أرماني برائحة خشبية",
    price: 899,
    discountPercentage: 15,
    rating: 4.4,
    stock: 100,
    brand: "Armani",
    category: "fragrances",
    image: "https://placehold.co/400x300/800080/FFFFFF?text=Armani+Code",
    images: [
      "https://placehold.co/500x400/800080/FFFFFF?text=Perfume+Bottle",
      "https://placehold.co/500x400/800080/FFFFFF?text=Perfume+Box"
    ],
    remainingStock: 100
  }
]
  // تحميل البيانات الأولية
  useEffect(() => {
    const loadData = () => {
      try {
        setLoading(true)
        
        // تحميل المستخدم
        const userData = safeJSONParse('user')
        if (userData && typeof userData === 'object') {
          setUser(userData)
          setIsLoggedIn(true)
        }
        
        // تحميل السلة
        const cartData = safeJSONParse('cart')
        if (Array.isArray(cartData)) {
          setCart(cartData)
        }
        
        // تحميل المنتجات
        const productsData = safeJSONParse('products')
        if (Array.isArray(productsData)) {
          const productsWithStock = productsData.map(product => ({
            ...product,
            remainingStock: product.stock || product.remainingStock || 50
          }))
          setProducts(productsWithStock)
        } else {
          setProducts(defaultProducts)
          localStorage.setItem('products', JSON.stringify(defaultProducts))
        }
        
      } catch (error) {
        console.error('Error loading data:', error)
        setProducts(defaultProducts)
        localStorage.setItem('products', JSON.stringify(defaultProducts))
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
  }, [])

  // حفظ السلة في localStorage
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cart))
    }
  }, [cart])

  // تحديث المخزون عند تغيير السلة
  useEffect(() => {
    updateStock()
  }, [cart])

  // تحديث المخزون المتبقي
  const updateStock = () => {
    setProducts(prevProducts => 
      prevProducts.map(product => {
        const cartItem = cart.find(item => item.id === product.id)
        const quantityInCart = cartItem ? cartItem.quantity : 0
        return {
          ...product,
          remainingStock: product.stock - quantityInCart
        }
      })
    )
  }

  // إضافة منتج للسلة
  const addToCart = (product, quantity = 1) => {
    const existingItem = cart.find(item => item.id === product.id)
    const productInStock = products.find(p => p.id === product.id)
    
    if (!productInStock || productInStock.remainingStock <= 0) {
      alert(`عذراً، المنتج ${product.name} غير متوفر في المخزون`)
      return
    }
    
    if (quantity > productInStock.remainingStock) {
      alert(`الكمية المطلوبة (${quantity}) تتجاوز المخزون المتاح (${productInStock.remainingStock})`)
      return
    }
    
    setCart(prevCart => {
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      } else {
        return [...prevCart, { ...product, quantity }]
      }
    })
  }

  // إزالة منتج من السلة
  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId))
  }

  // تحديث كمية منتج
  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) {
      removeFromCart(productId)
      return
    }
    
    const product = products.find(p => p.id === productId)
    if (!product) return
    
    if (quantity > product.stock) {
      alert(`الكمية المطلوبة (${quantity}) تتجاوز المخزون الكلي (${product.stock})`)
      return
    }
    
    const cartItem = cart.find(item => item.id === productId)
    const currentQuantity = cartItem ? cartItem.quantity : 0
    
    if (quantity > product.remainingStock + currentQuantity) {
      alert(`الحد الأقصى المتاح هو ${product.remainingStock + currentQuantity} قطعة`)
      return
    }
    
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    )
  }

  // الحصول على منتج بالـ ID
  const getProductById = (id) => {
    const productId = typeof id === 'string' ? parseInt(id, 10) : id
    return products.find(p => p.id === productId)
  }

  // الحصول على منتجات حسب الفئة
  const getProductsByCategory = (category) => {
    if (!category || category === 'all') {
      return products
    }
    return products.filter(product => 
      product.category && product.category.toLowerCase() === category.toLowerCase()
    )
  }

  // معلومات المخزون
  const getStockInfo = (productId) => {
    const product = products.find(p => p.id === productId)
    if (!product) {
      return {
        totalStock: 0,
        remainingStock: 0,
        inCart: 0,
        availableForMore: 0
      }
    }
    
    const cartItem = cart.find(item => item.id === productId)
    const inCart = cartItem ? cartItem.quantity : 0
    
    return {
      totalStock: product.stock || 0,
      remainingStock: product.remainingStock || 0,
      inCart: inCart,
      availableForMore: (product.remainingStock || 0) - inCart
    }
  }

  // جرد المخزون
  const getInventory = () => {
    return products.map(product => {
      const cartItem = cart.find(item => item.id === product.id)
      const inCart = cartItem ? cartItem.quantity : 0
      
      return {
        id: product.id,
        name: product.name,
        category: product.category,
        totalStock: product.stock,
        inCart: inCart,
        remainingStock: product.remainingStock,
        status: product.remainingStock <= 0 ? 'نفذ' : 
                product.remainingStock <= 5 ? 'محدود' : 'متوفر',
        image: product.image,
        price: product.price
      }
    })
  }

  // تحديث المخزون يدوياً
  const updateStockManually = (productId, newStock) => {
    setProducts(prevProducts =>
      prevProducts.map(product =>
        product.id === productId
          ? { ...product, stock: newStock, remainingStock: newStock }
          : product
      )
    )
    
    setCart(prevCart =>
      prevCart.map(item => {
        if (item.id === productId && item.quantity > newStock) {
          return { ...item, quantity: newStock }
        }
        return item
      })
    )
  }

  // مسح السلة
  const clearCart = () => {
    setCart([])
    localStorage.removeItem('cart')
  }

  // إجمالي القطع
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)

  // إجمالي السعر
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  // تسجيل الدخول
  const login = (userData) => {
    setIsLoggedIn(true)
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  // تسجيل الخروج
  const logout = () => {
    setIsLoggedIn(false)
    setUser(null)
    localStorage.removeItem('user')
    clearCart()
  }

  return (
    <CartContext.Provider value={{
      cart,
      products,
      loading,
      isLoggedIn,
      user,
      addToCart,
      removeFromCart,
      updateQuantity,
      getProductById,
      getProductsByCategory,
      getStockInfo,
      getInventory,
      updateStockManually,
      clearCart,
      totalItems,
      totalPrice,
      login,
      logout
    }}>
      {children}
    </CartContext.Provider>
  )
}