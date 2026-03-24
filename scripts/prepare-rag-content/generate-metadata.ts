import type { ChunkMetadata } from './types';

export function generateMetadata(opts: {
  url: string;
  title: string;
  breadcrumb: string;
  contentType: string;
  category: string;
  sectionHeading: string;
}): { metadataAttributes: ChunkMetadata } {
  return {
    metadataAttributes: {
      url: opts.url,
      title: opts.title,
      breadcrumb: opts.breadcrumb,
      content_type: opts.contentType,
      category: opts.category,
      section_heading: opts.sectionHeading,
    },
  };
}

/**
 * Convert file path to breadcrumb string.
 * e.g. "docs/documentation/connectivity-services/data-services.md"
 *   -> "Documentation > Connectivity Services > Data Services"
 */
export function deriveBreadcrumb(filePath: string, title: string): string {
  // Remove docs/ prefix and file extension
  const withoutPrefix = filePath.replace(/^docs\//, '');
  const parts = withoutPrefix.replace(/\.(mdx?|md)$/, '').split('/');

  // Drop the filename (last part) — we use title instead
  const dirParts = parts.slice(0, -1);

  const segments = dirParts.map((part) =>
    part
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' '),
  );

  segments.push(title);
  return segments.join(' > ');
}

/**
 * Derive content type from file path.
 */
export function deriveContentType(filePath: string): string {
  if (filePath.includes('/api/')) return 'api-reference';
  if (filePath.includes('/glossary/') || filePath.includes('/terms/')) return 'glossary';
  return 'guide';
}

/**
 * Convert file path to URL path.
 * e.g. "docs/documentation/connectivity-services/data-services.md"
 *   -> "/docs/connectivity-services/data-services/"
 */
export function deriveUrl(filePath: string): string {
  // Remove extension
  let url = filePath.replace(/\.(mdx?|md)$/, '');
  // Ensure leading slash
  if (!url.startsWith('/')) url = '/' + url;
  // Ensure trailing slash
  if (!url.endsWith('/')) url += '/';
  return url;
}
