
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { UserActivity, ActivityEventType } from '@/utils/activityTracking';

interface OverviewCardsProps {
  activities: UserActivity[];
}

const OverviewCards = ({ activities }: OverviewCardsProps) => {
  // Get product views
  const productViews = activities.filter(
    activity => activity.eventType === ActivityEventType.PRODUCT_VIEW
  );
  
  // Get cart events (add/remove)
  const cartEvents = activities.filter(
    activity => [
      ActivityEventType.ADD_TO_CART,
      ActivityEventType.REMOVE_FROM_CART
    ].includes(activity.eventType as ActivityEventType)
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Total Events</CardTitle>
          <CardDescription>All tracked activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-medium">{activities.length}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Product Views</CardTitle>
          <CardDescription>Number of product detail views</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-medium">
            {productViews.length}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Cart Actions</CardTitle>
          <CardDescription>Items added or removed from cart</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-medium">
            {cartEvents.length}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OverviewCards;
