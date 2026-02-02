import { useState } from 'react'
import './SearchBar.css'

const SearchBar = ({ onSearch, onFilter }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

 const categories = ['all', 'smartphones', 'laptops', 'fragrances']
  const handleSearch = (e) => {
    e.preventDefault()
    onSearch(searchTerm)
  }

  const handleCategoryChange = (category) => {
    setSelectedCategory(category)
    onFilter(category === 'جميع الفئات' ? '' : category)
  }

  return (
    <div className="search-filter-container">
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-input-group">
          <input
            type="text"
            placeholder="ابحث عن منتج..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-btn">
            <i className="fas fa-search"></i>
          </button>
        </div>
      </form>
      
      <div className="filter-container">
        <div className="filter-title">
          <i className="fas fa-filter"></i> تصفية حسب:
        </div>
        <div className="category-filters">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SearchBar