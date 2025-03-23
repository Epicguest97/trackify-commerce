
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { products } from '@/data/products';
import ProductCard from '@/components/products/ProductCard';
import { useActivity } from '@/context/ActivityContext';
import { ActivityEventType } from '@/utils/activityTracking';
import { ChevronRight } from 'lucide-react';

const Index = () => {
  const { trackEvent } = useActivity();
  
  // Track page view on mount
  useEffect(() => {
    trackEvent(ActivityEventType.PAGE_VIEW, { page: 'home' });
  }, [trackEvent]);

  // Get featured products
  const featuredProducts = products.filter(product => product.featured);
  
  // Get other products (limited to 4)
  const otherProducts = products
    .filter(product => !product.featured)
    .slice(0, 4);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
            alt="Hero background" 
            className="w-full h-full object-cover object-center" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-black/10" />
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-white">
          <div className="max-w-xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-medium leading-tight mb-6 animate-slide-in">
              Premium Products, <br /> Tracked Experience
            </h1>
            <p className="text-lg opacity-80 mb-8 animate-slide-in" style={{ animationDelay: '0.1s' }}>
              Discover our collection of premium products with detailed activity tracking built-in.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-slide-in" style={{ animationDelay: '0.2s' }}>
              <Button 
                size="lg" 
                className="bg-white text-black hover:bg-gray-100"
                onClick={() => {
                  trackEvent(ActivityEventType.CLICK, { element: 'shop_now_button' });
                }}
              >
                <Link to="/products">Shop Now</Link>
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-white text-white hover:bg-white/10"
                onClick={() => {
                  trackEvent(ActivityEventType.CLICK, { element: 'learn_more_button' });
                }}
              >
                <Link to="/activity">View Activity</Link>
              </Button>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-8 left-0 right-0 flex justify-center animate-bounce">
          <ChevronRight className="h-8 w-8 text-white transform rotate-90" />
        </div>
      </section>
      
      {/* Featured Products Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-medium">Featured Products</h2>
              <p className="text-gray-500 mt-2">Our handpicked selection of premium products</p>
            </div>
            <Link 
              to="/products" 
              className="text-sm font-medium hover:underline flex items-center"
              onClick={() => {
                trackEvent(ActivityEventType.CLICK, { element: 'view_all_featured' });
              }}
            >
              View All <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map(product => (
              <ProductCard 
                key={product.id}
                product={product}
                featured={true}
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* New Arrivals Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-medium">New Arrivals</h2>
              <p className="text-gray-500 mt-2">The latest additions to our collection</p>
            </div>
            <Link 
              to="/products" 
              className="text-sm font-medium hover:underline flex items-center"
              onClick={() => {
                trackEvent(ActivityEventType.CLICK, { element: 'view_all_new' });
              }}
            >
              View All <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {otherProducts.map(product => (
              <ProductCard 
                key={product.id}
                product={product}
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* Activity Tracking Banner */}
      <section className="py-20 bg-black text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-medium mb-6">User Activity Tracking</h2>
            <p className="text-gray-300 mb-8">
              Our platform tracks user behavior to improve your shopping experience. 
              View detailed analytics on how users interact with products.
            </p>
            <Button 
              className="bg-white text-black hover:bg-gray-100"
              onClick={() => {
                trackEvent(ActivityEventType.CLICK, { element: 'view_activity_banner' });
              }}
            >
              <Link to="/activity">View Activity Dashboard</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
