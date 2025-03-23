
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

// Track an activity
export const trackActivity = (
  eventType: ActivityEventType,
  eventData: any = {},
  userId: string | null = null
): UserActivity => {
  const activity: UserActivity = {
    id: `activity_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    userId,
    eventType,
    eventData,
    timestamp: Date.now(),
    sessionId: getSessionId(),
    page: window.location.pathname,
  };

  // Get existing activities from localStorage
  const existingActivities = JSON.parse(localStorage.getItem('user_activities') || '[]');
  const updatedActivities = [...existingActivities, activity];
  
  // Store in localStorage (in a real app, you would send this to a server)
  localStorage.setItem('user_activities', JSON.stringify(updatedActivities));
  
  console.log('Activity tracked:', activity);
  return activity;
};

// Get all activities
export const getAllActivities = (): UserActivity[] => {
  return JSON.parse(localStorage.getItem('user_activities') || '[]');
};

// Clear all activities
export const clearAllActivities = (): void => {
  localStorage.removeItem('user_activities');
};

// Get activities by type
export const getActivitiesByType = (eventType: ActivityEventType): UserActivity[] => {
  const allActivities = getAllActivities();
  return allActivities.filter(activity => activity.eventType === eventType);
};

// Get activities for current session
export const getCurrentSessionActivities = (): UserActivity[] => {
  const allActivities = getAllActivities();
  const currentSessionId = getSessionId();
  return allActivities.filter(activity => activity.sessionId === currentSessionId);
};
