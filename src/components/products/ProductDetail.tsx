
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '@/data/products';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { useActivity } from '@/context/ActivityContext';
import { ActivityEventType } from '@/utils/activityTracking';
import { ArrowLeft, Minus, Plus, ShoppingCart } from 'lucide-react';

interface ProductDetailProps {
  product: Product;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { trackEvent } = useActivity();
  const navigate = useNavigate();

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleIncreaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(q => q + 1);
      trackEvent(ActivityEventType.CLICK, { 
        element: 'increase_quantity', 
        productId: product.id 
      });
    }
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(q => q - 1);
      trackEvent(ActivityEventType.CLICK, { 
        element: 'decrease_quantity', 
        productId: product.id 
      });
    }
  };

  const handleGoBack = () => {
    navigate(-1);
    trackEvent(ActivityEventType.CLICK, { element: 'back_button' });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Button 
        variant="ghost" 
        className="mb-8 hover:bg-gray-100"
        onClick={handleGoBack}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
        {/* Product Image */}
        <div className="relative overflow-hidden rounded-lg card-shadow">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Product Info */}
        <div className="flex flex-col">
          <div className="mb-auto">
            {/* Category */}
            <span className="text-sm text-gray-500 uppercase tracking-wider">
              {product.category}
            </span>
            
            {/* Product Name */}
            <h1 className="text-3xl font-medium mt-2 mb-4">{product.name}</h1>
            
            {/* Price */}
            <div className="text-2xl font-medium mb-6">${product.price.toFixed(2)}</div>
            
            {/* Description */}
            <p className="text-gray-600 mb-8">{product.description}</p>
            
            {/* Stock */}
            <div className="mb-8">
              <span className={`text-sm ${product.stock > 5 ? 'text-green-600' : 'text-orange-500'}`}>
                {product.stock > 0 
                  ? `${product.stock} items in stock` 
                  : 'Out of stock'}
              </span>
            </div>
          </div>
          
          {/* Add to Cart */}
          <div className="pt-6 border-t border-gray-100">
            <div className="flex items-center mb-6">
              <span className="mr-4">Quantity</span>
              <div className="flex items-center">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={handleDecreaseQuantity}
                  disabled={quantity <= 1}
                  className="h-8 w-8 rounded-full"
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="mx-4 font-medium">{quantity}</span>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={handleIncreaseQuantity}
                  disabled={quantity >= product.stock}
                  className="h-8 w-8 rounded-full"
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div>
            
            <Button 
              onClick={handleAddToCart}
              className="w-full bg-black hover:bg-gray-900 text-white py-6"
              disabled={product.stock === 0}
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
