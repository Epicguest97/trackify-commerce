
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { products } from '@/data/products';
import ProductCard from '@/components/products/ProductCard';
import { useActivity } from '@/context/ActivityContext';
import { ActivityEventType } from '@/utils/activityTracking';
import { Button } from '@/components/ui/button';
import { Search, FilterX } from 'lucide-react';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const { trackEvent } = useActivity();
  
  // Get unique categories
  const categories = ['All', ...new Set(products.map(product => product.category))];
  
  // Track page view on mount
  useEffect(() => {
    trackEvent(ActivityEventType.PAGE_VIEW, { page: 'products' });
    
    // Check if there's a category filter in URL
    const categoryFromUrl = searchParams.get('category');
    if (categoryFromUrl) {
      setActiveCategory(categoryFromUrl);
    }
  }, [trackEvent, searchParams]);
  
  // Handle filtering
  useEffect(() => {
    let filtered = products;
    
    // Apply category filter
    if (activeCategory && activeCategory !== 'All') {
      filtered = filtered.filter(product => product.category === activeCategory);
    }
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(term) || 
        product.description.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term)
      );
    }
    
    setFilteredProducts(filtered);
  }, [activeCategory, searchTerm]);
  
  // Handle category filter click
  const handleCategoryClick = (category: string) => {
    const newCategory = category === 'All' ? null : category;
    setActiveCategory(newCategory);
    
    // Update URL params
    if (newCategory) {
      searchParams.set('category', newCategory);
    } else {
      searchParams.delete('category');
    }
    setSearchParams(searchParams);
    
    // Track filter event
    trackEvent(ActivityEventType.FILTER_APPLY, { 
      filterType: 'category',
      value: category 
    });
  };
  
  // Handle search submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Track search event
    trackEvent(ActivityEventType.SEARCH, { 
      searchTerm,
      resultsCount: filteredProducts.length
    });
  };
  
  // Handle reset filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setActiveCategory(null);
    searchParams.delete('category');
    setSearchParams(searchParams);
    
    // Track reset filters event
    trackEvent(ActivityEventType.CLICK, { element: 'reset_filters' });
  };

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl font-medium mb-2">Products</h1>
          <p className="text-gray-500">Browse our collection of premium products</p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar with filters */}
          <div className="w-full md:w-64 flex-shrink-0">
            {/* Search */}
            <div className="mb-8">
              <form onSubmit={handleSearchSubmit}>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="w-full border border-gray-200 rounded-md px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                </div>
              </form>
            </div>
            
            {/* Categories */}
            <div className="mb-8">
              <h3 className="font-medium text-sm uppercase tracking-wider text-gray-500 mb-4">Categories</h3>
              <ul className="space-y-2">
                {categories.map(category => (
                  <li key={category}>
                    <button
                      className={`text-sm w-full text-left py-1.5 px-3 rounded-md transition-colors ${
                        (category === 'All' && !activeCategory) || activeCategory === category
                          ? 'bg-black text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      onClick={() => handleCategoryClick(category)}
                    >
                      {category}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Reset Filters */}
            {(activeCategory || searchTerm) && (
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full flex items-center justify-center"
                onClick={handleResetFilters}
              >
                <FilterX className="h-4 w-4 mr-2" />
                Reset Filters
              </Button>
            )}
          </div>
          
          {/* Products Grid */}
          <div className="flex-grow">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <h3 className="text-lg font-medium mb-2">No products found</h3>
                <p className="text-gray-500 mb-4">Try adjusting your search or filter criteria</p>
                <Button 
                  variant="outline" 
                  onClick={handleResetFilters}
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <>
                {/* Results count */}
                <p className="text-gray-500 mb-6">{filteredProducts.length} products found</p>
                
                {/* Products grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
