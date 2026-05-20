// Centralized Analytics Service
// Designed to be provider-agnostic. Easily swap with Sentry, DataDog, PostHog, etc.

const IS_PROD = import.meta.env.PROD;

class AnalyticsService {
  constructor() {
    this.provider = null; // e.g., window.Sentry
  }

  // Hook up your third-party provider here
  init(provider) {
    this.provider = provider;
  }

  trackEvent(eventName, data = {}) {
    if (!IS_PROD) {
      // console.info(`[Analytics] Event: ${eventName}`, data);
      return;
    }
    
    // Example: Sentry integration
    // if (this.provider) this.provider.captureMessage(eventName, { extra: data });
  }

  trackError(error, context = {}) {
    if (!IS_PROD) {
      console.error(`[Analytics] Error tracked:`, error, context);
      return;
    }

    // Example: Sentry integration
    // if (this.provider) this.provider.captureException(error, { extra: context });
  }

  trackPageView(pageName) {
    if (!IS_PROD) {
      // console.info(`[Analytics] Page View: ${pageName}`);
      return;
    }
    
    // Example: PostHog integration
    // if (this.provider) this.provider.capture('$pageview', { page: pageName });
  }
}

export const analytics = new AnalyticsService();
