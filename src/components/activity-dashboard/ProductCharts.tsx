
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { UserActivity, ActivityEventType } from '@/utils/activityTracking';

interface ProductChartsProps {
  activities: UserActivity[];
}

const ProductCharts = ({ activities }: ProductChartsProps) => {
  // Get product views
  const productViews = activities.filter(
    activity => activity.eventType === ActivityEventType.PRODUCT_VIEW
  );
  
  // Count views by product
  const productViewCounts = productViews.reduce((acc: Record<string, number>, activity) => {
    const productName = activity.eventData.productName || 'Unknown Product';
    acc[productName] = (acc[productName] || 0) + 1;
    return acc;
  }, {});
  
  // Prepare data for product views chart
  const productViewsChartData = Object.entries(productViewCounts)
    .map(([product, count]) => ({
      name: product,
      views: count
    }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 5); // Top 5 products
  
  // Get cart events (add/remove)
  const cartEvents = activities.filter(
    activity => [
      ActivityEventType.ADD_TO_CART,
      ActivityEventType.REMOVE_FROM_CART
    ].includes(activity.eventType as ActivityEventType)
  );
  
  // Count cart events by product
  const cartEventsByProduct = cartEvents.reduce((acc: Record<string, { adds: number, removes: number }>, activity) => {
    const productName = activity.eventData.productName || 'Unknown Product';
    
    if (!acc[productName]) {
      acc[productName] = { adds: 0, removes: 0 };
    }
    
    if (activity.eventType === ActivityEventType.ADD_TO_CART) {
      acc[productName].adds += 1;
    } else if (activity.eventType === ActivityEventType.REMOVE_FROM_CART) {
      acc[productName].removes += 1;
    }
    
    return acc;
  }, {});
  
  // Prepare data for cart events chart
  const cartEventsChartData = Object.entries(cartEventsByProduct)
    .map(([product, counts]) => ({
      name: product,
      adds: counts.adds,
      removes: counts.removes
    }))
    .sort((a, b) => (b.adds - b.removes) - (a.adds - a.removes))
    .slice(0, 5); // Top 5 products

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Most Viewed Products</CardTitle>
          <CardDescription>Top products by number of views</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={productViewsChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="views" fill="#0088FE" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Cart Activity by Product</CardTitle>
          <CardDescription>Items added to or removed from cart</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={cartEventsChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="adds" fill="#00C49F" name="Added to Cart" />
              <Bar dataKey="removes" fill="#FF8042" name="Removed from Cart" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </>
  );
};

export default ProductCharts;
