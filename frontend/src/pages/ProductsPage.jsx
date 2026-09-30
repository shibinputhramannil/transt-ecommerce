import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Search, SlidersHorizontal, X, ArrowUpDown, ChevronDown, Check, Sparkles } from 'lucide-react';
import Container from '../components/common/Container';
import ProductCard from '../components/common/ProductCard';
import ProductGrid from '../components/common/ProductGrid';
import LoadingState from '../components/common/LoadingState';
import ErrorMessage from '../components/common/ErrorMessage';
import EmptyState from '../components/common/EmptyState';
import Badge from '../components/common/Badge';
import { getProducts, selectProducts, selectProductsLoading, selectProductsError } from '../store/slices/productsSlice';

const CATEGORIES = [
  'All',
  'Electronics',
  'Fashion',
  'Shoes',
  'Bags',
  'Watches',
  'Home & Lifestyle',
  'Beauty',
];

const SORT_OPTIONS = [
  { value: 'featured', label: 'Popularity / Featured', description: 'Curated popular items' },
  { value: 'price_low', label: 'Price: Low to High', description: 'Affordable to premium' },
  { value: 'price_high', label: 'Price: High to Low', description: 'Premium to affordable' },
  { value: 'name_asc', label: 'Name: A to Z', description: 'Alphabetical listing' },
];

export const ProductsPage = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';

  const products = useSelector(selectProducts);
  const loading = useSelector(selectProductsLoading);
  const error = useSelector(selectProductsError);

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);
  const [sortBy, setSortBy] = useState('featured');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef(null);

  // Close sort dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Sync state if URL searchParams change externally
  useEffect(() => {
    const cat = searchParams.get('category') || 'All';
    setSelectedCategory(cat);
  }, [searchParams]);

  // Debounce search query input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Dispatch Redux thunk whenever selectedCategory or debouncedSearch changes
  const fetchProductsList = () => {
    const params = {};
    if (selectedCategory && selectedCategory !== 'All') {
      params.category = selectedCategory;
    }
    if (debouncedSearch && debouncedSearch.trim() !== '') {
      params.search = debouncedSearch.trim();
    }
    dispatch(getProducts(params));
  };

  useEffect(() => {
    fetchProductsList();
  }, [selectedCategory, debouncedSearch, dispatch]);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    if (category === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', category);
    }
    setSearchParams(searchParams);
  };

  const handleClearFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setDebouncedSearch('');
    setSortBy('featured');
    setSearchParams({});
  };

  // Instant client-side filtering + sorting for 0ms typing responsiveness
  const displayedProducts = useMemo(() => {
    let list = [...products];

    // Filter instantly on client if query typed
    if (searchQuery && searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q)
      );
    }

    switch (sortBy) {
      case 'price_low':
        return list.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
      case 'price_high':
        return list.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
      case 'name_asc':
        return list.sort((a, b) => a.name.localeCompare(b.name));
      case 'featured':
      default:
        return list;
    }
  }, [products, searchQuery, sortBy]);

  return (
    <Container size="full" className="py-8 lg:py-10 space-y-8 max-w-[1600px]">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-transt-border">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="success">Transt Catalog</Badge>
            <span className="text-xs text-transt-text-muted">
              {loading ? 'Updating...' : `${displayedProducts.length} Products Found`}
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-transt-green-dark tracking-tight">
            Explore All Products
          </h1>
          <p className="text-xs sm:text-sm text-transt-text-muted max-w-xl">
            Browse our full catalog with category filters, instant keyword search, and responsive pricing.
          </p>
        </div>

        {/* Modern E-Commerce Search Bar & Sort Dropdown */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          {/* E-Commerce Search Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setDebouncedSearch(searchQuery.trim());
            }}
            className="w-full sm:w-80 md:w-96 flex items-center h-11 bg-white rounded-xl border border-transt-border hover:border-transt-green/60 focus-within:border-transt-green focus-within:ring-2 focus-within:ring-transt-green/20 shadow-xs transition-all overflow-hidden"
          >
            <div className="pl-3.5 pr-1 flex items-center justify-center text-transt-green flex-shrink-0">
              <Search className="w-4 h-4" />
            </div>

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products, categories..."
              style={{ outline: 'none', boxShadow: 'none', border: 'none' }}
              className="w-full h-full bg-transparent px-2 text-xs sm:text-sm text-transt-text placeholder:text-transt-text-muted/60 focus:outline-none font-medium"
            />

            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setDebouncedSearch('');
                }}
                className="p-1.5 text-transt-text-muted hover:text-transt-text transition-colors flex-shrink-0 cursor-pointer mr-1"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <button
              type="submit"
              className="h-full px-4 bg-transt-green hover:bg-transt-green-dark text-white text-xs font-bold flex items-center justify-center transition-colors flex-shrink-0 cursor-pointer"
              title="Search"
            >
              Search
            </button>
          </form>

          {/* Modern Floating Sort Button & Dropdown */}
          <div className="relative" ref={sortRef}>
            <button
              type="button"
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="w-full sm:w-auto h-11 px-4 rounded-2xl bg-white border border-transt-border hover:border-transt-green flex items-center justify-between gap-3 shadow-xs hover:shadow-sm transition-all text-xs font-bold text-transt-text cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-transt-green/20"
              aria-expanded={isSortOpen}
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-transt-surface-cream text-transt-green flex items-center justify-center">
                  <ArrowUpDown className="w-3.5 h-3.5" />
                </div>
                <span className="text-transt-text-muted font-normal">Sort:</span>
                <span className="text-transt-green-dark font-bold truncate max-w-[120px] sm:max-w-none">
                  {SORT_OPTIONS.find((o) => o.value === sortBy)?.label.split(' / ')[0]}
                </span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-transt-text-muted transition-transform duration-200 ${
                  isSortOpen ? 'rotate-180 text-transt-green' : ''
                }`}
              />
            </button>

            {/* Floating Modern Dropdown Menu */}
            {isSortOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white/98 backdrop-blur-md rounded-2xl border border-transt-border shadow-xl p-1.5 z-40 animate-fade-in divide-y divide-transt-border-subtle/60">
                <div className="px-3 py-1.5 text-[10px] font-extrabold text-transt-text-muted uppercase tracking-wider flex items-center justify-between">
                  <span>Sort Options</span>
                  <Sparkles className="w-3 h-3 text-transt-green" />
                </div>
                <div className="py-1 space-y-0.5">
                  {SORT_OPTIONS.map((opt) => {
                    const isSelected = sortBy === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => {
                          setSortBy(opt.value);
                          setIsSortOpen(false);
                        }}
                        className={`w-full px-3 py-2 rounded-xl text-left flex items-center justify-between transition-colors cursor-pointer text-xs ${
                          isSelected
                            ? 'bg-transt-green-light text-transt-green font-bold'
                            : 'text-transt-text hover:bg-transt-surface-cream hover:text-transt-green'
                        }`}
                      >
                        <div>
                          <span className="block font-semibold">{opt.label}</span>
                          <span className="text-[10px] text-transt-text-muted font-normal block">
                            {opt.description}
                          </span>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-transt-green flex-shrink-0 ml-2" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Category Filter Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <SlidersHorizontal className="w-4 h-4 text-transt-green flex-shrink-0 mr-1 hidden sm:block" />
        {CATEGORIES.map((category) => {
          const isActive = selectedCategory === category;
          return (
            <button
              key={category}
              onClick={() => handleCategorySelect(category)}
              className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wide transition-all whitespace-nowrap cursor-pointer select-none ${
                isActive
                  ? 'bg-transt-green text-white shadow-sm'
                  : 'bg-white text-transt-text-secondary border border-transt-border hover:border-transt-green hover:bg-transt-surface-cream'
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      {/* Active Filter Tags */}
      {(selectedCategory !== 'All' || debouncedSearch) && (
        <div className="flex items-center gap-2 text-xs animate-fade-in">
          <span className="text-transt-text-muted font-medium">Active filters:</span>
          {selectedCategory !== 'All' && (
            <Badge variant="accent" className="flex items-center gap-1">
              Category: {selectedCategory}
              <X
                className="w-3 h-3 cursor-pointer ml-1"
                onClick={() => handleCategorySelect('All')}
              />
            </Badge>
          )}
          {debouncedSearch && (
            <Badge variant="accent" className="flex items-center gap-1">
              Search: "{debouncedSearch}"
              <X
                className="w-3 h-3 cursor-pointer ml-1"
                onClick={() => setSearchQuery('')}
              />
            </Badge>
          )}
          <button
            onClick={handleClearFilters}
            className="text-transt-green font-bold hover:underline ml-2 text-xs cursor-pointer"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Content State Handling */}
      {loading ? (
        <LoadingState message="Loading Transt Catalog..." className="py-20" />
      ) : error ? (
        <ErrorMessage
          title="Could not load products"
          message={error}
          onRetry={fetchProductsList}
          className="my-8"
        />
      ) : displayedProducts.length === 0 ? (
        <EmptyState
          title="No products matched your criteria"
          message={`No items found for category "${selectedCategory}" ${
            searchQuery ? `matching "${searchQuery}"` : ''
          }.`}
          actionText="Reset All Filters"
          onAction={handleClearFilters}
          className="my-8"
        />
      ) : (
        <ProductGrid>
          {displayedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </ProductGrid>
      )}
    </Container>
  );
};

export default ProductsPage;


