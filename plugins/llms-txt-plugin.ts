import type {LoadContext, Plugin} from '@docusaurus/types';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

/**
 * Section mapping per D-03: filesystem directories to product groupings.
 */
const SECTION_MAP: Record<string, {product: 'connect' | 'os'; label: string}> = {
  'introduction':          {product: 'connect', label: 'Introduction'},
  'connectivity-services': {product: 'connect', label: 'Connectivity Services'},
  'network-services':      {product: 'connect', label: 'Network Services'},
  'sim-cards':             {product: 'connect', label: 'SIM Cards'},
  'platform-services':     {product: 'connect', label: 'Platform Services'},
  'blueprints-examples':   {product: 'connect', label: 'Blueprints & Examples'},
  '1nce-portal':           {product: 'connect', label: '1NCE Portal'},
  'mcp-server':            {product: 'connect', label: 'MCP Server'},
  'troubleshooting':       {product: 'connect', label: 'Troubleshooting'},
  '1nce-os':               {product: 'os',      label: '1NCE OS'},
};

/**
 * API spec landing pages per D-05/D-11.
 * Routes are relative to baseUrl (no leading baseUrl).
 */
const API_SPECS = [
  {title: 'Authorization', route: '/api/authorization/authorization/'},
  {title: 'SIM Management', route: '/api/sim-management/sim-management/'},
  {title: 'Order Management', route: '/api/order-management/order-management/'},
  {title: 'Product Information', route: '/api/product-information/product-information/'},
  {title: 'Support Management', route: '/api/support-management/support-management/'},
  {title: '1NCE OS API', route: '/api/1nce-os/1-nce-os/'},
];

interface DocInfo {
  title: string;
  slug?: string;
  relativePath: string;
  sidebarPosition?: number;
}

/**
 * Scan all .md/.mdx files under a directory and extract frontmatter metadata.
 */
function scanDocs(docsDir: string): DocInfo[] {
  const files = fs.readdirSync(docsDir, {recursive: true, encoding: 'utf-8'});
  return files
    .filter((f: string) => (f.endsWith('.md') || f.endsWith('.mdx')) && !f.includes('_category_'))
    .map((f: string) => {
      const content = fs.readFileSync(path.join(docsDir, f), 'utf-8');
      const {data} = matter(content);
      if (!data.title) return null;
      return {
        title: data.title,
        slug: data.slug,
        relativePath: f.replace(/\\/g, '/'),
        sidebarPosition: data.sidebar_position,
      };
    })
    .filter((d): d is DocInfo => d !== null);
}

/**
 * Convert a doc's filesystem path (relative to docs/documentation/) to a full URL.
 * Handles slug overrides and trailing slashes.
 */
function filePathToUrl(
  doc: DocInfo,
  siteUrl: string,
  baseUrl: string,
): string {
  const docsPrefix = `${siteUrl}${baseUrl}docs`.replace(/\/+/g, '/').replace(':/', '://');

  if (doc.slug != null) {
    if (doc.slug === '/') {
      return `${docsPrefix}/`;
    }
    const slug = doc.slug.startsWith('/') ? doc.slug : `/${doc.slug}`;
    const withTrailing = slug.endsWith('/') ? slug : `${slug}/`;
    return `${docsPrefix}${withTrailing}`;
  }

  // Strip the section prefix and file extension to derive route
  let route = doc.relativePath
    .replace(/\.mdx?$/, '')
    .replace(/\/index$/, '');

  // Ensure trailing slash
  if (!route.endsWith('/')) {
    route = `${route}/`;
  }

  return `${docsPrefix}/${route}`;
}

/**
 * Generate markdown link list for docs within a specific section directory.
 */
function generateSectionLinks(
  docs: DocInfo[],
  sectionDir: string,
  siteUrl: string,
  baseUrl: string,
): string {
  const sectionDocs = docs.filter(
    (d) => d.relativePath.startsWith(`${sectionDir}/`),
  );

  // Sort by sidebar_position ascending, undefined last
  sectionDocs.sort((a, b) => {
    const posA = a.sidebarPosition ?? 9999;
    const posB = b.sidebarPosition ?? 9999;
    return posA - posB;
  });

  return sectionDocs
    .map((doc) => `- [${doc.title}](${filePathToUrl(doc, siteUrl, baseUrl)})`)
    .join('\n');
}

/**
 * Generate markdown link list for API spec landing pages.
 */
function generateApiLinks(siteUrl: string, baseUrl: string): string {
  return API_SPECS.map((spec) => {
    const url = `${siteUrl}${baseUrl}${spec.route}`.replace(/([^:])\/+/g, '$1/');
    return `- [${spec.title}](${url})`;
  }).join('\n');
}

export default function llmsTxtPlugin(context: LoadContext): Plugin {
  return {
    name: 'llms-txt-plugin',

    async postBuild({outDir, siteConfig}) {
      const siteUrl = siteConfig.url;
      const baseUrl = siteConfig.baseUrl;

      // Read hand-curated template
      const templatePath = path.join(context.siteDir, 'static', 'llms-template.txt');
      let content = fs.readFileSync(templatePath, 'utf-8');

      // Scan documentation source files
      const docsDir = path.join(context.siteDir, 'docs', 'documentation');
      const docs = scanDocs(docsDir);

      let docLinkCount = 0;

      // Replace each placeholder marker with generated links
      content = content.replace(/<!-- LINKS:(\S+) -->/g, (_match, sectionName: string) => {
        if (sectionName === 'api') {
          return generateApiLinks(siteUrl, baseUrl);
        }

        const links = generateSectionLinks(docs, sectionName, siteUrl, baseUrl);
        const lineCount = links ? links.split('\n').length : 0;
        docLinkCount += lineCount;
        return links;
      });

      const apiLinkCount = API_SPECS.length;

      // Write final llms.txt to build output
      fs.writeFileSync(path.join(outDir, 'llms.txt'), content, 'utf-8');

      console.log(
        `[llms-txt-plugin] Generated llms.txt with ${docLinkCount} doc links and ${apiLinkCount} API links`,
      );
    },
  };
}
