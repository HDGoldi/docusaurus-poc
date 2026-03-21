import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

export function onRouteDidUpdate({location, previousLocation}) {
  if (ExecutionEnvironment.canUseDOM && location.pathname !== previousLocation?.pathname) {
    // GTM virtual pageview
    if (typeof window !== 'undefined' && (window as any).dataLayer) {
      (window as any).dataLayer.push({
        event: 'virtualPageview',
        page: location.pathname,
      });
    }
    // PostHog auto-captures page views when configured -- no manual call needed
    // SimpleAnalytics handles SPA natively -- no manual call needed
  }
}
