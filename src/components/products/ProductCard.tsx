
import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '@/data/products';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { useActivity } from '@/context/ActivityContext';
import { ActivityEventType } from '@/utils/activityTracking';
import { cn } from '@/lib/utils';
import { ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  featured?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, featured = false }) => {
  const { addToCart } = useCart();
  const { trackEvent } = useActivity();

  const handleProductClick = () => {
    trackEvent(ActivityEventType.PRODUCT_VIEW, { 
      productId: product.id,
      productName: product.name,
      price: product.price,
      category: product.category
    });
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  return (
    <div 
      className={cn(
        "group relative bg-white rounded-lg overflow-hidden transition-all duration-300",
        "hover-lift card-shadow",
        featured && "md:col-span-2 lg:row-span-2"
      )}
    >
      <Link 
        to={`/product/${product.id}`} 
        className="block"
        onClick={handleProductClick}
      >
        <div 
          className={cn(
            "relative overflow-hidden",
            featured ? "aspect-[4/3] sm:aspect-[16/9]" : "aspect-square"
          )}
        >
          <img 
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        
        <div className="p-4 sm:p-6">
          <div className="flex items-start justify-between">
            <div>
              {/* Category */}
              <span className="text-xs text-gray-500 uppercase tracking-wider">{product.category}</span>
              
              {/* Product Name */}
              <h3 className="mt-1 font-medium text-lg">{product.name}</h3>
              
              {/* Description (only shown on featured cards) */}
              {featured && (
                <p className="mt-2 text-gray-600 text-sm line-clamp-2">{product.description}</p>
              )}
            </div>
            
            {/* Price */}
            <span className="font-medium">${product.price.toFixed(2)}</span>
          </div>
        </div>
        
        {/* Add to Cart Button (appears on hover) */}
        <div className="absolute bottom-4 right-4 opacity-0 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <Button 
            onClick={handleAddToCart}
            size="sm"
            className="rounded-full px-3 py-2 bg-black text-white hover:bg-gray-900"
          >
            <ShoppingCart className="h-4 w-4 mr-1" />
            <span>Add</span>
          </Button>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
