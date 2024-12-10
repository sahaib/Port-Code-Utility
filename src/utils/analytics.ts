type EventType = 'search' | 'calculate_distance' | 'error' | 'guide_complete' | 'bulk_calculate_distance';

interface AnalyticsEvent {
  type: EventType;
  data?: Record<string, any>;
}

export const trackEvent = ({ type, data = {} }: AnalyticsEvent) => {
  if (type === 'bulk_calculate_distance') {
    console.log('Bulk Distance Calculation:', data);
  }
  
  if (type === 'error' && data.context === 'bulk_calculate_distance') {
    console.error('Bulk Calculator Error:', data.error);
  }
  
  if (typeof window !== 'undefined' && window.plausible) {
    window.plausible(type, { props: data });
  }
}; 