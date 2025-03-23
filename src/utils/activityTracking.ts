
import { supabase } from '@/integrations/supabase/client';

export interface UserActivity {
  id: string;
  userId: string | null; // null for anonymous users
  eventType: ActivityEventType;
  eventData: any;
  timestamp: number;
  sessionId: string;
  page: string;
}

export enum ActivityEventType {
  PAGE_VIEW = 'page_view',
  PRODUCT_VIEW = 'product_view',
  ADD_TO_CART = 'add_to_cart',
  REMOVE_FROM_CART = 'remove_from_cart',
  CHECKOUT_START = 'checkout_start',
  CHECKOUT_COMPLETE = 'checkout_complete',
  SEARCH = 'search',
  FILTER_APPLY = 'filter_apply',
  CLICK = 'click',
  HOVER = 'hover',
  SCROLL = 'scroll',
  FORM_INTERACTION = 'form_interaction',
  BUTTON_CLICK = 'button_click',
  LINK_CLICK = 'link_click',
  IMAGE_VIEW = 'image_view',
  VIDEO_INTERACTION = 'video_interaction',
  TIME_SPENT = 'time_spent',
  NAVIGATION = 'navigation'
}

// Create or get session ID
const getSessionId = (): string => {
  let sessionId = localStorage.getItem('session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem('session_id', sessionId);
  }
  return sessionId;
};

// Get user's device information
const getUserDeviceInfo = () => {
  return {
    userAgent: navigator.userAgent,
    language: navigator.language,
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
    platform: navigator.platform,
  };
};

// Get user's location information (high-level only)
const getLocationInfo = () => {
  return {
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    locale: navigator.language,
  };
};

// Track an activity
export const trackActivity = async (
  eventType: ActivityEventType,
  eventData: any = {},
  userId: string | null = null
): Promise<UserActivity> => {
  const activity: UserActivity = {
    id: `activity_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    userId,
    eventType,
    eventData: {
      ...eventData,
      deviceInfo: getUserDeviceInfo(),
      locationInfo: getLocationInfo(),
      timestamp: new Date().toISOString(),
    },
    timestamp: Date.now(),
    sessionId: getSessionId(),
    page: window.location.pathname,
  };

  // Store in Supabase
  try {
    await supabase.from('user_activities').insert({
      session_id: activity.sessionId,
      event_type: activity.eventType,
      event_data: activity.eventData,
      timestamp: new Date(activity.timestamp).toISOString(),
      page: activity.page,
      user_id: activity.userId
    });
  } catch (error) {
    console.error('Error storing activity in Supabase:', error);
  }
  
  console.log('Activity tracked:', activity);
  return activity;
};

// Track user clicks
export const trackClick = async (
  element: string,
  additionalData: any = {},
  userId: string | null = null
): Promise<UserActivity> => {
  return trackActivity(
    ActivityEventType.CLICK, 
    {
      element,
      ...additionalData,
      clickTime: new Date().toISOString(),
      coordinateX: additionalData.x || null,
      coordinateY: additionalData.y || null,
    },
    userId
  );
};

// Track button clicks specifically
export const trackButtonClick = async (
  buttonName: string,
  additionalData: any = {},
  userId: string | null = null
): Promise<UserActivity> => {
  return trackActivity(
    ActivityEventType.BUTTON_CLICK, 
    {
      buttonName,
      ...additionalData,
    },
    userId
  );
};

// Track link clicks
export const trackLinkClick = async (
  href: string,
  linkText: string = '',
  additionalData: any = {},
  userId: string | null = null
): Promise<UserActivity> => {
  return trackActivity(
    ActivityEventType.LINK_CLICK, 
    {
      href,
      linkText,
      ...additionalData,
    },
    userId
  );
};

// Track form interactions
export const trackFormInteraction = async (
  formName: string,
  action: 'submit' | 'input' | 'focus' | 'blur',
  fieldName?: string,
  additionalData: any = {},
  userId: string | null = null
): Promise<UserActivity> => {
  return trackActivity(
    ActivityEventType.FORM_INTERACTION, 
    {
      formName,
      action,
      fieldName,
      ...additionalData,
    },
    userId
  );
};

// Track hovering over elements
export const trackHover = async (
  element: string,
  durationMs: number = 0,
  additionalData: any = {},
  userId: string | null = null
): Promise<UserActivity> => {
  return trackActivity(
    ActivityEventType.HOVER, 
    {
      element,
      durationMs,
      ...additionalData,
    },
    userId
  );
};

// Track scrolling behavior
export const trackScroll = async (
  depth: number,
  additionalData: any = {},
  userId: string | null = null
): Promise<UserActivity> => {
  return trackActivity(
    ActivityEventType.SCROLL, 
    {
      depth, // percentage of page scrolled
      ...additionalData,
    },
    userId
  );
};

// Track time spent on page
export const trackTimeSpent = async (
  durationSeconds: number,
  additionalData: any = {},
  userId: string | null = null
): Promise<UserActivity> => {
  return trackActivity(
    ActivityEventType.TIME_SPENT, 
    {
      durationSeconds,
      ...additionalData,
    },
    userId
  );
};

// Setup automatic scroll tracking
export const setupScrollTracking = (thresholds: number[] = [25, 50, 75, 100]) => {
  let maxScrollPercentage = 0;
  const scrollHandler = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercentage = Math.round((scrollTop / scrollHeight) * 100);
    
    // Check if we've crossed any thresholds
    thresholds.forEach(threshold => {
      if (scrollPercentage >= threshold && maxScrollPercentage < threshold) {
        trackScroll(threshold, { previousMaxDepth: maxScrollPercentage });
      }
    });
    
    maxScrollPercentage = Math.max(maxScrollPercentage, scrollPercentage);
  };
  
  window.addEventListener('scroll', scrollHandler, { passive: true });
  
  // Return function to remove listener
  return () => window.removeEventListener('scroll', scrollHandler);
};

// Setup automatic time tracking
export const setupTimeTracking = (intervalSeconds: number = 30) => {
  const startTime = Date.now();
  let lastTracked = startTime;
  
  const intervalId = setInterval(() => {
    const now = Date.now();
    const secondsSinceStart = Math.floor((now - startTime) / 1000);
    const secondsSinceLastTracked = Math.floor((now - lastTracked) / 1000);
    
    trackTimeSpent(secondsSinceLastTracked, { 
      totalTimeOnPage: secondsSinceStart,
      trackingInterval: intervalSeconds 
    });
    
    lastTracked = now;
  }, intervalSeconds * 1000);
  
  // Return function to clear interval
  return () => clearInterval(intervalId);
};

// Get all activities
export const getAllActivities = async (): Promise<UserActivity[]> => {
  try {
    const { data, error } = await supabase
      .from('user_activities')
      .select('*')
      .order('timestamp', { ascending: false });
    
    if (error) {
      console.error('Error fetching activities:', error);
      return [];
    }
    
    // Transform the data to match our UserActivity interface
    return data.map(item => ({
      id: item.id,
      userId: item.user_id,
      eventType: item.event_type as ActivityEventType,
      eventData: item.event_data,
      timestamp: new Date(item.timestamp).getTime(),
      sessionId: item.session_id,
      page: item.page || '',
    }));
  } catch (error) {
    console.error('Error fetching activities:', error);
    return [];
  }
};

// Clear all activities
export const clearAllActivities = async (): Promise<void> => {
  try {
    const sessionId = getSessionId();
    const { error } = await supabase
      .from('user_activities')
      .delete()
      .eq('session_id', sessionId);
    
    if (error) {
      console.error('Error clearing activities:', error);
    }
  } catch (error) {
    console.error('Error clearing activities:', error);
  }
};

// Get activities by type
export const getActivitiesByType = async (eventType: ActivityEventType): Promise<UserActivity[]> => {
  try {
    const { data, error } = await supabase
      .from('user_activities')
      .select('*')
      .eq('event_type', eventType)
      .order('timestamp', { ascending: false });
    
    if (error) {
      console.error('Error fetching activities by type:', error);
      return [];
    }
    
    return data.map(item => ({
      id: item.id,
      userId: item.user_id,
      eventType: item.event_type as ActivityEventType,
      eventData: item.event_data,
      timestamp: new Date(item.timestamp).getTime(),
      sessionId: item.session_id,
      page: item.page || '',
    }));
  } catch (error) {
    console.error('Error fetching activities by type:', error);
    return [];
  }
};

// Get activities for current session
export const getCurrentSessionActivities = async (): Promise<UserActivity[]> => {
  try {
    const sessionId = getSessionId();
    const { data, error } = await supabase
      .from('user_activities')
      .select('*')
      .eq('session_id', sessionId)
      .order('timestamp', { ascending: false });
    
    if (error) {
      console.error('Error fetching session activities:', error);
      return [];
    }
    
    return data.map(item => ({
      id: item.id,
      userId: item.user_id,
      eventType: item.event_type as ActivityEventType,
      eventData: item.event_data,
      timestamp: new Date(item.timestamp).getTime(),
      sessionId: item.session_id,
      page: item.page || '',
    }));
  } catch (error) {
    console.error('Error fetching session activities:', error);
    return [];
  }
};
