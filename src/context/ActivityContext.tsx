
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserActivity, ActivityEventType, trackActivity, getAllActivities, clearAllActivities } from '../utils/activityTracking';

interface ActivityContextType {
  activities: UserActivity[];
  trackEvent: (eventType: ActivityEventType, eventData?: any) => void;
  clearActivities: () => void;
  isLoading: boolean;
  refreshActivities: () => Promise<void>;
}

const ActivityContext = createContext<ActivityContextType | undefined>(undefined);

export const ActivityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load activities on mount
  useEffect(() => {
    const loadActivities = async () => {
      setIsLoading(true);
      try {
        const loadedActivities = await getAllActivities();
        setActivities(loadedActivities);
      } catch (error) {
        console.error('Failed to load activities:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadActivities();
  }, []);

  // Track a new event
  const trackEvent = async (eventType: ActivityEventType, eventData: any = {}) => {
    try {
      const newActivity = await trackActivity(eventType, eventData);
      setActivities(prev => [newActivity, ...prev]);
    } catch (error) {
      console.error('Failed to track event:', error);
    }
  };

  // Clear all activities
  const clearActivities = async () => {
    setIsLoading(true);
    try {
      await clearAllActivities();
      setActivities([]);
    } catch (error) {
      console.error('Failed to clear activities:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh activities
  const refreshActivities = async () => {
    setIsLoading(true);
    try {
      const loadedActivities = await getAllActivities();
      setActivities(loadedActivities);
    } catch (error) {
      console.error('Failed to refresh activities:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ActivityContext.Provider value={{ 
      activities, 
      trackEvent, 
      clearActivities, 
      isLoading,
      refreshActivities
    }}>
      {children}
    </ActivityContext.Provider>
  );
};

export const useActivity = (): ActivityContextType => {
  const context = useContext(ActivityContext);
  if (context === undefined) {
    throw new Error('useActivity must be used within an ActivityProvider');
  }
  return context;
};
