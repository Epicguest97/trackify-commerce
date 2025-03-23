
import React, { useEffect } from 'react';
import { X, Trash2, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { useActivity } from '@/context/ActivityContext';
import { ActivityEventType } from '@/utils/activityTracking';
import { cn } from '@/lib/utils';

const CartSidebar: React.FC = () => {
  const { 
    cart, 
    removeFromCart, 
    updateQuantity, 
    cartTotal, 
    isCartOpen, 
    setIsCartOpen,
    clearCart
  } = useCart();
  const { trackEvent } = useActivity();

  // Close cart with escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsCartOpen(false);
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [setIsCartOpen]);

  // Prevent scrolling when cart is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCartOpen]);

  const handleCheckout = () => {
    trackEvent(ActivityEventType.CHECKOUT_START, { 
      cartItems: cart,
      cartTotal
    });
    
    // In a real app, you would redirect to checkout page
    // For this demo, we'll just clear the cart after a short delay
    setTimeout(() => {
      trackEvent(ActivityEventType.CHECKOUT_COMPLETE, { 
        cartItems: cart,
        cartTotal
      });
      clearCart();
      setIsCartOpen(false);
    }, 1000);
  };

  if (!isCartOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
        onClick={() => setIsCartOpen(false)}
      />
      
      {/* Cart Sidebar */}
      <div 
        className={cn(
          "fixed top-0 right-0 w-full sm:w-96 h-full bg-white z-50 shadow-xl",
          "transform transition-transform duration-300 ease-in-out",
          isCartOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 p-4">
          <h2 className="font-medium text-lg">Your Cart</h2>
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full hover:bg-gray-100"
            onClick={() => setIsCartOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Cart Content */}
        <div className="flex flex-col h-[calc(100%-8rem)]">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-4 text-center">
              <ShoppingBag className="h-12 w-12 text-gray-300 mb-4" />
              <h3 className="font-medium text-lg mb-2">Your cart is empty</h3>
              <p className="text-gray-500 text-sm mb-6">Looks like you haven't added anything to your cart yet.</p>
              <Button 
                onClick={() => setIsCartOpen(false)}
                className="bg-black hover:bg-gray-900 text-white"
              >
                Continue Shopping
              </Button>
            </div>
          ) : (
            <div className="overflow-y-auto flex-grow p-4">
              {cart.map(item => (
                <div key={item.id} className="flex py-4 border-b border-gray-100">
                  {/* Product Image */}
                  <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Product Info */}
                  <div className="ml-4 flex-grow">
                    <div className="flex justify-between">
                      <h3 className="font-medium">{item.name}</h3>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 text-gray-400 hover:text-red-500 -mt-1 -mr-1"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-6 w-6 rounded-md"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <span className="sr-only">Decrease quantity</span>
                          <span>-</span>
                        </Button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-6 w-6 rounded-md"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                        >
                          <span className="sr-only">Increase quantity</span>
                          <span>+</span>
                        </Button>
                      </div>
                      <span className="font-medium text-sm">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Footer with total and checkout */}
        {cart.length > 0 && (
          <div className="border-t border-gray-100 p-4 bg-gray-50">
            <div className="flex justify-between mb-4">
              <span className="font-medium">Subtotal</span>
              <span className="font-medium">${cartTotal.toFixed(2)}</span>
            </div>
            <p className="text-gray-500 text-xs mb-4">
              Shipping and taxes calculated at checkout
            </p>
            <Button 
              onClick={handleCheckout}
              className="w-full bg-black hover:bg-gray-900 text-white"
            >
              Checkout
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartSidebar;
