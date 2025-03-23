
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserActivity, ActivityEventType, trackActivity, getAllActivities, clearAllActivities } from '../utils/activityTracking';

interface ActivityContextType {
  activities: UserActivity[];
  trackEvent: (eventType: ActivityEventType, eventData?: any) => void;
  clearActivities: () => void;
}

const ActivityContext = createContext<ActivityContextType | undefined>(undefined);

export const ActivityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activities, setActivities] = useState<UserActivity[]>([]);

  // Load activities on mount
  useEffect(() => {
    const loadedActivities = getAllActivities();
    setActivities(loadedActivities);
  }, []);

  // Track a new event
  const trackEvent = (eventType: ActivityEventType, eventData: any = {}) => {
    const newActivity = trackActivity(eventType, eventData);
    setActivities(prev => [...prev, newActivity]);
  };

  // Clear all activities
  const clearActivities = () => {
    clearAllActivities();
    setActivities([]);
  };

  return (
    <ActivityContext.Provider value={{ activities, trackEvent, clearActivities }}>
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
