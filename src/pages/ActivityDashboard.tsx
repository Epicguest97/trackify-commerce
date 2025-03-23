
import React, { useState, useEffect } from 'react';
import { useActivity } from '@/context/ActivityContext';
import { ActivityEventType } from '@/utils/activityTracking';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Import refactored components
import DashboardHeader from '@/components/activity-dashboard/DashboardHeader';
import OverviewCards from '@/components/activity-dashboard/OverviewCards';
import EventTypePieChart from '@/components/activity-dashboard/EventTypePieChart';
import ProductCharts from '@/components/activity-dashboard/ProductCharts';
import EventsTable from '@/components/activity-dashboard/EventsTable';
import LoadingState from '@/components/activity-dashboard/LoadingState';

const ActivityDashboard = () => {
  const { activities, trackEvent, clearActivities, isLoading, refreshActivities } = useActivity();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Track page view on mount
  useEffect(() => {
    trackEvent(ActivityEventType.PAGE_VIEW, { page: 'activity_dashboard' });
  }, [trackEvent]);
  
  // Handle download activities
  const handleDownloadActivities = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(activities, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "user_activities.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <DashboardHeader 
          isLoading={isLoading}
          activitiesCount={activities.length}
          onRefresh={refreshActivities}
          onDownload={handleDownloadActivities}
          onClear={clearActivities}
          trackEvent={trackEvent}
        />
        
        {/* Loading or Empty State */}
        <LoadingState 
          isLoading={isLoading}
          activitiesCount={activities.length}
          onRefresh={refreshActivities}
        />
        
        {!isLoading && activities.length > 0 && (
          <>
            {/* Overview Cards */}
            <OverviewCards activities={activities} />
            
            {/* Tabs with Charts */}
            <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid grid-cols-3 max-w-md mx-auto">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="products">Products</TabsTrigger>
                <TabsTrigger value="events">Raw Events</TabsTrigger>
              </TabsList>
              
              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <EventTypePieChart activities={activities} />
              </TabsContent>
              
              {/* Products Tab */}
              <TabsContent value="products" className="space-y-6">
                <ProductCharts activities={activities} />
              </TabsContent>
              
              {/* Raw Events Tab */}
              <TabsContent value="events">
                <EventsTable activities={activities} />
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
};

export default ActivityDashboard;
