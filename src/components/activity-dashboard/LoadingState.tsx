
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, RefreshCcw, LineChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface LoadingStateProps {
  isLoading: boolean;
  activitiesCount: number;
  onRefresh: () => Promise<void>;
}

const LoadingState = ({ isLoading, activitiesCount, onRefresh }: LoadingStateProps) => {
  if (isLoading) {
    return (
      <Card className="p-8 text-center border border-blue-100 shadow-md bg-gradient-to-b from-white to-blue-50">
        <CardContent className="pt-6 flex flex-col items-center">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-100 rounded-full blur-md opacity-30"></div>
            <Loader2 className="h-12 w-12 animate-spin mb-4 text-blue-500 relative z-10" />
          </div>
          <h3 className="text-xl font-medium mb-3 text-blue-900">Loading activity data...</h3>
          <p className="text-gray-600 max-w-md">Please wait while we fetch your activity data. This may take a moment.</p>
        </CardContent>
      </Card>
    );
  }
  
  if (activitiesCount === 0) {
    return (
      <Card className={cn(
        "p-8 text-center transition-all duration-300 hover:shadow-lg",
        "bg-gradient-to-br from-white to-gray-50 border-gray-200"
      )}>
        <CardContent className="pt-6">
          <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <LineChart className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-medium mb-3 text-gray-800">No activity data yet</h3>
          <p className="text-gray-500 mb-6 max-w-sm mx-auto">
            Start browsing products and interacting with the site to generate activity data.
          </p>
          <Button 
            variant="outline" 
            onClick={onRefresh}
            className="flex items-center mx-auto hover:bg-blue-50 hover:text-blue-600 transition-colors"
          >
            <RefreshCcw className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  return null;
};

export default LoadingState;
