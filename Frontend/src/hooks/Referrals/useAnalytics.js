import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { analytics } from '../utils/analytics.js';

export const useAnalytics = (pageName) => {
  const location = useLocation();
  const lastLocation = useRef(location.pathname);
  const startTime = useRef(performance.now());

  useEffect(() => {
    if (pageName) {
      analytics.trackPageView(pageName);
    }
  }, [pageName]);

  useEffect(() => {
    if (lastLocation.current !== location.pathname) {
      const transitionTime = performance.now() - startTime.current;
      analytics.trackEvent("Route_Transition", {
        from: lastLocation.current,
        to: location.pathname,
        timeMs: transitionTime.toFixed(2),
      });
      lastLocation.current = location.pathname;
      startTime.current = performance.now();
    }
  }, [location]);

  return {
    trackEvent: analytics.trackEvent.bind(analytics),
    trackError: analytics.trackError.bind(analytics),
  };
};

export default useAnalytics;
