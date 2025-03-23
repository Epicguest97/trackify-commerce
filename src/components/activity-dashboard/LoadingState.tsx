
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';

interface LoadingStateProps {
  isLoading: boolean;
  activitiesCount: number;
  onRefresh: () => Promise<void>;
}

const LoadingState = ({ isLoading, activitiesCount, onRefresh }: LoadingStateProps) => {
  if (isLoading) {
    return (
      <Card className="p-8 text-center">
        <CardContent className="pt-6 flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin mb-4 text-black/70" />
          <h3 className="text-lg font-medium mb-2">Loading activity data...</h3>
          <p className="text-gray-500">Please wait while we fetch your activity data.</p>
        </CardContent>
      </Card>
    );
  }
  
  if (activitiesCount === 0) {
    return (
      <Card className="p-8 text-center">
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-2">No activity data yet</h3>
          <p className="text-gray-500 mb-6">Start browsing products and interacting with the site to generate activity data.</p>
          <Button 
            variant="outline" 
            onClick={onRefresh}
            className="flex items-center mx-auto"
          >
            <RefreshCcw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  return null;
};

export default LoadingState;
