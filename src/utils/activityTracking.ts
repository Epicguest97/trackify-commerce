
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
export const trackActivity = async (
  eventType: ActivityEventType,
  eventData: any = {},
  userId: string | null = null
): Promise<UserActivity> => {
  const activity: UserActivity = {
    id: `activity_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    userId,
    eventType,
    eventData,
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
