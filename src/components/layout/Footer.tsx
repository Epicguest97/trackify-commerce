
import React from 'react';
import { Link } from 'react-router-dom';
import { useActivity } from '@/context/ActivityContext';
import { ActivityEventType } from '@/utils/activityTracking';

const Footer: React.FC = () => {
  const { trackEvent } = useActivity();

  return (
    <footer className="bg-white border-t border-gray-100 py-12 mt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link 
              to="/" 
              className="text-xl font-display font-medium tracking-tight"
              onClick={() => trackEvent(ActivityEventType.CLICK, { element: 'footer_logo' })}
            >
              Trackify
            </Link>
            <p className="mt-2 text-sm text-gray-500">
              Premium products with user activity tracking built-in.
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="font-medium text-sm uppercase tracking-wider text-gray-400 mb-4">Shop</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/products" 
                  className="text-sm text-gray-600 hover:text-black transition-colors"
                  onClick={() => trackEvent(ActivityEventType.CLICK, { element: 'footer_products' })}
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link 
                  to="/products?category=Electronics" 
                  className="text-sm text-gray-600 hover:text-black transition-colors"
                  onClick={() => trackEvent(ActivityEventType.CLICK, { element: 'footer_electronics' })}
                >
                  Electronics
                </Link>
              </li>
              <li>
                <Link 
                  to="/products?category=Furniture" 
                  className="text-sm text-gray-600 hover:text-black transition-colors"
                  onClick={() => trackEvent(ActivityEventType.CLICK, { element: 'footer_furniture' })}
                >
                  Furniture
                </Link>
              </li>
              <li>
                <Link 
                  to="/products?category=Accessories" 
                  className="text-sm text-gray-600 hover:text-black transition-colors"
                  onClick={() => trackEvent(ActivityEventType.CLICK, { element: 'footer_accessories' })}
                >
                  Accessories
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Company */}
          <div>
            <h3 className="font-medium text-sm uppercase tracking-wider text-gray-400 mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/about" 
                  className="text-sm text-gray-600 hover:text-black transition-colors"
                  onClick={() => trackEvent(ActivityEventType.CLICK, { element: 'footer_about' })}
                >
                  About
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className="text-sm text-gray-600 hover:text-black transition-colors"
                  onClick={() => trackEvent(ActivityEventType.CLICK, { element: 'footer_contact' })}
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link 
                  to="/activity" 
                  className="text-sm text-gray-600 hover:text-black transition-colors"
                  onClick={() => trackEvent(ActivityEventType.CLICK, { element: 'footer_activity' })}
                >
                  Activity Dashboard
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Legal */}
          <div>
            <h3 className="font-medium text-sm uppercase tracking-wider text-gray-400 mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/privacy" 
                  className="text-sm text-gray-600 hover:text-black transition-colors"
                  onClick={() => trackEvent(ActivityEventType.CLICK, { element: 'footer_privacy' })}
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link 
                  to="/terms" 
                  className="text-sm text-gray-600 hover:text-black transition-colors"
                  onClick={() => trackEvent(ActivityEventType.CLICK, { element: 'footer_terms' })}
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link 
                  to="/cookies" 
                  className="text-sm text-gray-600 hover:text-black transition-colors"
                  onClick={() => trackEvent(ActivityEventType.CLICK, { element: 'footer_cookies' })}
                >
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-100">
          <p className="text-sm text-gray-400 text-center">
            © {new Date().getFullYear()} Trackify Commerce. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
