import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiFilter, FiX, FiChevronDown } from 'react-icons/fi';
import API from '../api/axios';
import ProductCard from '../components/ProductCard';
import './Products.css';

const CATEGORIES = ['Shirts', 'T-Shirts', 'Hoodies', 'Jackets', 'Formal Wear', 'Track Pants', 'Cotton Pants', 'Trousers', 'Innerwear'];
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];
const SORT_OPTIONS = [
  { label: 'Newest', value: '-createdAt' },
  { label: 'Price: Low to High', value: 'price' },
  { label: 'Price: High to Low', value: '-price' },
  { label: 'Top Rated', value: '-ratings' },
];

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showFilter, setShowFilter] = useState(false);

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    minPrice: '', maxPrice: '',
    size: '', color: '',
    rating: '',
    sort: '-createdAt',
    page: 1,
    limit: 12,
  });

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== ''));
      const { data } = await API.get('/products', { params });
      setProducts(data.products);
      setTotal(data.total);
      setPages(data.pages);
    } catch {}
    setLoading(false);
  }, [filters]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  useEffect(() => {
    document.title = 'Products – Mens Zone';
  }, []);

  useEffect(() => {
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    if (search) setFilters((f) => ({ ...f, search }));
    if (category) setFilters((f) => ({ ...f, category }));
  }, [searchParams]);

  const updateFilter = (key, value) => setFilters((f) => ({ ...f, [key]: value, page: 1 }));
  const clearFilters = () => setFilters({ search: '', category: '', minPrice: '', maxPrice: '', size: '', color: '', rating: '', sort: '-createdAt', page: 1, limit: 12 });

  return (
    <div className="products-page">
      {/* Header */}
      <div className="page-header">
        <div className="container">
          <h1>All Products</h1>
          <p>{total} products available</p>
        </div>
      </div>

      <div className="container products-layout">
        {/* Filter Sidebar */}
        <aside className={`filter-sidebar ${showFilter ? 'open' : ''}`}>
          <div className="filter-header">
            <h3>Filters</h3>
            <button className="filter-clear" onClick={clearFilters}>Clear All</button>
          </div>

          <div className="filter-section">
            <h4 className="filter-label">Category</h4>
            {CATEGORIES.map((cat) => (
              <label key={cat} className="filter-option">
                <input type="radio" name="category" value={cat}
                  checked={filters.category === cat}
                  onChange={() => updateFilter('category', filters.category === cat ? '' : cat)} />
                <span>{cat}</span>
              </label>
            ))}
          </div>

          <div className="filter-section">
            <h4 className="filter-label">Price Range</h4>
            <div className="price-inputs">
              <input type="number" className="form-control" placeholder="Min ₹"
                value={filters.minPrice} onChange={(e) => updateFilter('minPrice', e.target.value)} />
              <span>–</span>
              <input type="number" className="form-control" placeholder="Max ₹"
                value={filters.maxPrice} onChange={(e) => updateFilter('maxPrice', e.target.value)} />
            </div>
          </div>

          <div className="filter-section">
            <h4 className="filter-label">Size</h4>
            <div className="size-chips">
              {SIZES.map((s) => (
                <button key={s} className={`size-chip ${filters.size === s ? 'active' : ''}`}
                  onClick={() => updateFilter('size', filters.size === s ? '' : s)}>{s}</button>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <h4 className="filter-label">Minimum Rating</h4>
            {[4, 3, 2].map((r) => (
              <label key={r} className="filter-option">
                <input type="radio" name="rating" value={r}
                  checked={filters.rating === String(r)}
                  onChange={() => updateFilter('rating', filters.rating === String(r) ? '' : String(r))} />
                <span>{'⭐'.repeat(r)} & above</span>
              </label>
            ))}
          </div>
        </aside>

        {/* Products Main */}
        <main className="products-main">
          {/* Search & Sort Bar */}
          <div className="products-toolbar">
            <div className="search-bar-inline">
              <input
                type="text" placeholder="Search products..." className="form-control"
                value={filters.search} onChange={(e) => updateFilter('search', e.target.value)}
              />
            </div>
            <div className="sort-select-wrap">
              <select className="form-control" value={filters.sort} onChange={(e) => updateFilter('sort', e.target.value)}>
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <button className="btn btn-ghost filter-toggle-btn" onClick={() => setShowFilter(!showFilter)}>
              <FiFilter /> Filters
            </button>
          </div>

          {/* Active Filters */}
          <div className="active-filters">
            {filters.category && <span className="filter-tag">{filters.category} <button onClick={() => updateFilter('category', '')}><FiX /></button></span>}
            {filters.size && <span className="filter-tag">Size: {filters.size} <button onClick={() => updateFilter('size', '')}><FiX /></button></span>}
            {filters.rating && <span className="filter-tag">Rating: {filters.rating}+ <button onClick={() => updateFilter('rating', '')}><FiX /></button></span>}
            {filters.search && <span className="filter-tag">"{filters.search}" <button onClick={() => updateFilter('search', '')}><FiX /></button></span>}
          </div>

          {loading ? (
            <div className="spinner-wrap"><div className="spinner" /></div>
          ) : products.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🔍</div>
              <h3>No products found</h3>
              <p>Try adjusting your filters or search terms</p>
              <button className="btn btn-primary" onClick={clearFilters} style={{ marginTop: '16px' }}>Clear Filters</button>
            </div>
          ) : (
            <>
              <div className="grid-4">
                {products.map((p) => <ProductCard key={p._id} product={p} />)}
              </div>
              {pages > 1 && (
                <div className="pagination">
                  {Array.from({ length: pages }, (_, i) => (
                    <button key={i + 1}
                      className={`page-btn ${filters.page === i + 1 ? 'active' : ''}`}
                      onClick={() => setFilters((f) => ({ ...f, page: i + 1 }))}>
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Products;
