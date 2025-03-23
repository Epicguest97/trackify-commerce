
import React, { useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { products } from '@/data/products';
import ProductDetail from '@/components/products/ProductDetail';
import { useActivity } from '@/context/ActivityContext';
import { ActivityEventType } from '@/utils/activityTracking';

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const { trackEvent } = useActivity();
  
  const product = products.find(p => p.id === id);
  
  // Track page view and product view on mount
  useEffect(() => {
    if (product) {
      trackEvent(ActivityEventType.PAGE_VIEW, { 
        page: 'product', 
        productId: product.id 
      });
      
      trackEvent(ActivityEventType.PRODUCT_VIEW, { 
        productId: product.id,
        productName: product.name,
        price: product.price,
        category: product.category
      });
    }
  }, [product, trackEvent]);
  
  // If product not found, redirect to products page
  if (!product) {
    return <Navigate to="/products" replace />;
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      <ProductDetail product={product} />
    </div>
  );
};

export default ProductPage;
