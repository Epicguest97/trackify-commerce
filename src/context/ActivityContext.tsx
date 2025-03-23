
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  UserActivity, 
  ActivityEventType, 
  trackActivity, 
  trackClick, 
  trackButtonClick,
  trackLinkClick,
  trackFormInteraction,
  trackHover,
  trackScroll,
  trackTimeSpent,
  setupScrollTracking,
  setupTimeTracking,
  getAllActivities, 
  clearAllActivities 
} from '../utils/activityTracking';

interface ActivityContextType {
  activities: UserActivity[];
  trackEvent: (eventType: ActivityEventType, eventData?: any) => void;
  trackElementClick: (element: string, additionalData?: any) => void;
  trackButtonPress: (buttonName: string, additionalData?: any) => void;
  trackLinkVisit: (href: string, linkText?: string, additionalData?: any) => void;
  trackForm: (formName: string, action: 'submit' | 'input' | 'focus' | 'blur', fieldName?: string, additionalData?: any) => void;
  trackElementHover: (element: string, durationMs?: number, additionalData?: any) => void;
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

  // Setup automatic tracking on mount
  useEffect(() => {
    // Setup scroll tracking
    const removeScrollTracking = setupScrollTracking();
    
    // Setup time tracking (every 60 seconds)
    const removeTimeTracking = setupTimeTracking(60);
    
    // Cleanup on unmount
    return () => {
      removeScrollTracking();
      removeTimeTracking();
    };
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

  // Track element click
  const trackElementClick = async (element: string, additionalData: any = {}) => {
    try {
      const newActivity = await trackClick(element, additionalData);
      setActivities(prev => [newActivity, ...prev]);
    } catch (error) {
      console.error('Failed to track click:', error);
    }
  };

  // Track button click
  const trackButtonPress = async (buttonName: string, additionalData: any = {}) => {
    try {
      const newActivity = await trackButtonClick(buttonName, additionalData);
      setActivities(prev => [newActivity, ...prev]);
    } catch (error) {
      console.error('Failed to track button click:', error);
    }
  };

  // Track link click
  const trackLinkVisit = async (href: string, linkText: string = '', additionalData: any = {}) => {
    try {
      const newActivity = await trackLinkClick(href, linkText, additionalData);
      setActivities(prev => [newActivity, ...prev]);
    } catch (error) {
      console.error('Failed to track link click:', error);
    }
  };

  // Track form interaction
  const trackForm = async (
    formName: string, 
    action: 'submit' | 'input' | 'focus' | 'blur', 
    fieldName?: string, 
    additionalData: any = {}
  ) => {
    try {
      const newActivity = await trackFormInteraction(formName, action, fieldName, additionalData);
      setActivities(prev => [newActivity, ...prev]);
    } catch (error) {
      console.error('Failed to track form interaction:', error);
    }
  };

  // Track element hover
  const trackElementHover = async (element: string, durationMs: number = 0, additionalData: any = {}) => {
    try {
      const newActivity = await trackHover(element, durationMs, additionalData);
      setActivities(prev => [newActivity, ...prev]);
    } catch (error) {
      console.error('Failed to track hover:', error);
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
      trackElementClick,
      trackButtonPress,
      trackLinkVisit,
      trackForm,
      trackElementHover,
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
