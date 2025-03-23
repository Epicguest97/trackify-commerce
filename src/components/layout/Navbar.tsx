
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, User, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { useActivity } from '@/context/ActivityContext';
import { ActivityEventType } from '@/utils/activityTracking';
import { cn } from '@/lib/utils';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cartCount, setIsCartOpen } = useCart();
  const { trackEvent } = useActivity();
  const location = useLocation();

  // Listen for scroll events
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Handle cart button click
  const handleCartClick = () => {
    trackEvent(ActivityEventType.CLICK, { element: 'cart_button' });
    setIsCartOpen(true);
  };

  return (
    <header 
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out',
        isScrolled 
          ? 'bg-white/80 backdrop-blur-md shadow-sm py-3' 
          : 'bg-transparent py-5'
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link 
            to="/" 
            className="text-xl font-display font-medium tracking-tight"
            onClick={() => trackEvent(ActivityEventType.CLICK, { element: 'logo' })}
          >
            Trackify
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={cn(
                "text-sm font-medium transition-colors hover:text-black",
                location.pathname === "/" ? "text-black" : "text-gray-500"
              )}
              onClick={() => trackEvent(ActivityEventType.CLICK, { element: 'nav_home' })}
            >
              Home
            </Link>
            <Link 
              to="/products" 
              className={cn(
                "text-sm font-medium transition-colors hover:text-black",
                location.pathname === "/products" ? "text-black" : "text-gray-500"
              )}
              onClick={() => trackEvent(ActivityEventType.CLICK, { element: 'nav_products' })}
            >
              Products
            </Link>
            <Link 
              to="/activity" 
              className={cn(
                "text-sm font-medium transition-colors hover:text-black",
                location.pathname === "/activity" ? "text-black" : "text-gray-500"
              )}
              onClick={() => trackEvent(ActivityEventType.CLICK, { element: 'nav_activity' })}
            >
              Activity Dashboard
            </Link>
          </nav>
          
          {/* Actions */}
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="hover:bg-gray-100 rounded-full"
              onClick={() => trackEvent(ActivityEventType.CLICK, { element: 'search_button' })}
            >
              <Search className="h-5 w-5" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="hover:bg-gray-100 rounded-full"
              onClick={() => trackEvent(ActivityEventType.CLICK, { element: 'user_button' })}
            >
              <User className="h-5 w-5" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="hover:bg-gray-100 rounded-full relative"
              onClick={handleCartClick}
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Button>
            
            {/* Mobile Menu Button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden hover:bg-gray-100 rounded-full"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 py-4 animate-fade-in">
            <nav className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className={cn(
                  "text-sm font-medium py-2 transition-colors hover:text-black",
                  location.pathname === "/" ? "text-black" : "text-gray-500"
                )}
                onClick={() => trackEvent(ActivityEventType.CLICK, { element: 'mobile_nav_home' })}
              >
                Home
              </Link>
              <Link 
                to="/products" 
                className={cn(
                  "text-sm font-medium py-2 transition-colors hover:text-black",
                  location.pathname === "/products" ? "text-black" : "text-gray-500"
                )}
                onClick={() => trackEvent(ActivityEventType.CLICK, { element: 'mobile_nav_products' })}
              >
                Products
              </Link>
              <Link 
                to="/activity" 
                className={cn(
                  "text-sm font-medium py-2 transition-colors hover:text-black",
                  location.pathname === "/activity" ? "text-black" : "text-gray-500"
                )}
                onClick={() => trackEvent(ActivityEventType.CLICK, { element: 'mobile_nav_activity' })}
              >
                Activity Dashboard
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
