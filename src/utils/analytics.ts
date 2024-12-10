type EventType = 'search' | 'calculate_distance' | 'error' | 'guide_complete';

interface AnalyticsEvent {
  type: EventType;
  data?: Record<string, any>;
}

export const trackEvent = ({ type, data = {} }: AnalyticsEvent) => {
  if (typeof window !== 'undefined' && window.plausible) {
    window.plausible(type, { props: data });
  }
}; 