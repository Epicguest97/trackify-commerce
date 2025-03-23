import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell 
} from 'recharts';
import { useActivity } from '@/context/ActivityContext';
import { ActivityEventType, UserActivity } from '@/utils/activityTracking';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DownloadCloud, RefreshCcw, Trash2, Loader2 } from 'lucide-react';

const ActivityDashboard = () => {
  const { activities, trackEvent, clearActivities, isLoading, refreshActivities } = useActivity();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Track page view on mount
  useEffect(() => {
    trackEvent(ActivityEventType.PAGE_VIEW, { page: 'activity_dashboard' });
  }, [trackEvent]);
  
  // Count events by type
  const eventCounts = activities.reduce((acc: Record<string, number>, activity) => {
    acc[activity.eventType] = (acc[activity.eventType] || 0) + 1;
    return acc;
  }, {});
  
  // Prepare data for event type chart
  const eventTypeChartData = Object.entries(eventCounts).map(([type, count]) => ({
    name: type.replace(/_/g, ' ').toLowerCase(),
    value: count
  }));
  
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
  
  // Generate colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];
  
  // Handle clear activities
  const handleClearActivities = () => {
    if (window.confirm('Are you sure you want to clear all activity data? This cannot be undone.')) {
      clearActivities();
      trackEvent(ActivityEventType.CLICK, { element: 'clear_activities_button' });
    }
  };
  
  // Handle download activities
  const handleDownloadActivities = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(activities, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "user_activities.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    
    trackEvent(ActivityEventType.CLICK, { element: 'download_activities_button' });
  };

  // Handle refresh activities
  const handleRefreshActivities = async () => {
    trackEvent(ActivityEventType.CLICK, { element: 'refresh_activities_button' });
    await refreshActivities();
  };

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-medium mb-2">Activity Dashboard</h1>
            <p className="text-gray-500">Track and analyze user behavior on your store</p>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="flex items-center"
              onClick={handleRefreshActivities}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCcw className="h-4 w-4 mr-2" />
              )}
              Refresh
            </Button>
            
            <Button 
              variant="outline" 
              className="flex items-center"
              onClick={handleDownloadActivities}
              disabled={isLoading || activities.length === 0}
            >
              <DownloadCloud className="h-4 w-4 mr-2" />
              Export Data
            </Button>
            
            <Button 
              variant="destructive" 
              className="flex items-center"
              onClick={handleClearActivities}
              disabled={isLoading || activities.length === 0}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Data
            </Button>
          </div>
        </div>
        
        {isLoading ? (
          <Card className="p-8 text-center">
            <CardContent className="pt-6 flex flex-col items-center">
              <Loader2 className="h-8 w-8 animate-spin mb-4 text-black/70" />
              <h3 className="text-lg font-medium mb-2">Loading activity data...</h3>
              <p className="text-gray-500">Please wait while we fetch your activity data.</p>
            </CardContent>
          </Card>
        ) : activities.length === 0 ? (
          <Card className="p-8 text-center">
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-2">No activity data yet</h3>
              <p className="text-gray-500 mb-6">Start browsing products and interacting with the site to generate activity data.</p>
              <Button 
                variant="outline" 
                onClick={handleRefreshActivities}
                className="flex items-center mx-auto"
              >
                <RefreshCcw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Overview Cards */}
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
            
            {/* Tabs with Charts */}
            <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid grid-cols-3 max-w-md mx-auto">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="products">Products</TabsTrigger>
                <TabsTrigger value="events">Raw Events</TabsTrigger>
              </TabsList>
              
              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Event Types Distribution</CardTitle>
                    <CardDescription>Breakdown of different types of tracked events</CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={eventTypeChartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        >
                          {eventTypeChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Products Tab */}
              <TabsContent value="products" className="space-y-6">
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
              </TabsContent>
              
              {/* Raw Events Tab */}
              <TabsContent value="events">
                <Card>
                  <CardHeader>
                    <CardTitle>Raw Activity Events</CardTitle>
                    <CardDescription>All tracked events in reverse chronological order</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="py-3 px-4 text-left font-medium text-gray-500">Event Type</th>
                            <th className="py-3 px-4 text-left font-medium text-gray-500">Page</th>
                            <th className="py-3 px-4 text-left font-medium text-gray-500">Time</th>
                            <th className="py-3 px-4 text-left font-medium text-gray-500">Details</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[...activities].reverse().map((activity) => (
                            <tr key={activity.id} className="border-b border-gray-100 hover:bg-gray-50">
                              <td className="py-3 px-4 text-sm">
                                {activity.eventType.replace(/_/g, ' ').toLowerCase()}
                              </td>
                              <td className="py-3 px-4 text-sm">{activity.page || '/'}</td>
                              <td className="py-3 px-4 text-sm">
                                {new Date(activity.timestamp).toLocaleString()}
                              </td>
                              <td className="py-3 px-4 text-sm">
                                {activity.eventData.productName || ''}
                                {activity.eventData.searchTerm ? `"${activity.eventData.searchTerm}"` : ''}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
};

export default ActivityDashboard;

