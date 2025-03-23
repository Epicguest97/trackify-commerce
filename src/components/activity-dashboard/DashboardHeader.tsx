
import React from 'react';
import { Button } from '@/components/ui/button';
import { DownloadCloud, RefreshCcw, Trash2, Loader2 } from 'lucide-react';
import { ActivityEventType } from '@/utils/activityTracking';

interface DashboardHeaderProps {
  isLoading: boolean;
  activitiesCount: number;
  onRefresh: () => Promise<void>;
  onDownload: () => void;
  onClear: () => void;
  trackEvent: (eventType: ActivityEventType, eventData?: any) => void;
}

const DashboardHeader = ({
  isLoading,
  activitiesCount,
  onRefresh,
  onDownload,
  onClear,
  trackEvent
}: DashboardHeaderProps) => {
  // Handle clear activities
  const handleClearActivities = () => {
    if (window.confirm('Are you sure you want to clear all activity data? This cannot be undone.')) {
      onClear();
      trackEvent(ActivityEventType.CLICK, { element: 'clear_activities_button' });
    }
  };
  
  // Handle download activities
  const handleDownloadActivities = () => {
    onDownload();
    trackEvent(ActivityEventType.CLICK, { element: 'download_activities_button' });
  };

  // Handle refresh activities
  const handleRefreshActivities = async () => {
    trackEvent(ActivityEventType.CLICK, { element: 'refresh_activities_button' });
    await onRefresh();
  };

  return (
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
          disabled={isLoading || activitiesCount === 0}
        >
          <DownloadCloud className="h-4 w-4 mr-2" />
          Export Data
        </Button>
        
        <Button 
          variant="destructive" 
          className="flex items-center"
          onClick={handleClearActivities}
          disabled={isLoading || activitiesCount === 0}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Clear Data
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;
