let currentSiteConfig: { customFields: Record<string, string> } = {
  customFields: {},
};

export const setMockSiteConfig = (customFields: Record<string, string>) => {
  currentSiteConfig = { customFields };
};

export default function useDocusaurusContext() {
  return { siteConfig: currentSiteConfig };
}
