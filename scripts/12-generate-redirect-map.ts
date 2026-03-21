/**
 * Script 12: Generate Redirect Map
 *
 * Generates a JSON file mapping old ReadMe.com URL paths to new Docusaurus paths.
 * This mapping is for future use with a CloudFront Function for URL redirects (Phase 3 / v2).
 *
 * Old ReadMe patterns:
 *   - /docs/{slug}       (documentation pages)
 *   - /reference/{slug}  (API reference pages)
 *
 * New Docusaurus patterns:
 *   - /docs/{folder}/{slug}        (Documentation tab)
 *   - /platform/{folder}/{slug}    (1NCE Platform tab)
 *   - /blueprints/{folder}/{slug}  (Blueprints & Examples tab)
 *   - /terms/{slug}                (Terms & Abbreviations tab)
 *   - /api/{spec}/{endpoint}       (API Explorer tab)
 */

import { globSync } from 'glob';
import matter from 'gray-matter';
import * as fs from 'node:fs';
import * as path from 'node:path';

const PROJECT_ROOT = path.resolve(__dirname, '..');

interface RedirectEntry {
  old: string;
  new: string;
}

interface RedirectMap {
  redirects: RedirectEntry[];
  generated: string;
  count: number;
}

/**
 * Determine the old ReadMe URL path for a given slug.
 * ReadMe used /docs/{slug} for all documentation pages and /reference/{slug} for API pages.
 */
function getOldPath(slug: string, isApi: boolean): string {
  return isApi ? `/reference/${slug}` : `/docs/${slug}`;
}

/**
 * Compute the new Docusaurus path from a file path relative to docs/.
 * Examples:
 *   docs/documentation/sim-cards/sim-cards-knowledge.md -> /docs/sim-cards/sim-cards-knowledge
 *   docs/platform/1nce-os/device-controller-api.md -> /platform/1nce-os/device-controller-api
 *   docs/api/authorization/get-access-token.mdx -> /api/authorization/get-access-token
 */
function getNewPath(relativeToDocsDir: string, instance: string): string {
  // Remove file extension
  let docPath = relativeToDocsDir.replace(/\.(mdx?|md)$/, '');

  // Handle index files - they resolve to the directory path
  if (docPath.endsWith('/index')) {
    docPath = docPath.replace(/\/index$/, '');
  }

  // Map instance to route base path
  const routeMap: Record<string, string> = {
    documentation: '/docs',
    platform: '/platform',
    blueprints: '/blueprints',
    terms: '/terms',
    api: '/api',
  };

  const routeBase = routeMap[instance] || `/${instance}`;
  return docPath ? `${routeBase}/${docPath}` : routeBase;
}

/**
 * Scan a docs instance directory and build redirect entries.
 */
function scanInstance(instance: string, isApi: boolean): RedirectEntry[] {
  const entries: RedirectEntry[] = [];
  const instanceDir = path.join(PROJECT_ROOT, 'docs', instance);

  if (!fs.existsSync(instanceDir)) {
    console.warn(`  Warning: Instance directory not found: ${instanceDir}`);
    return entries;
  }

  const pattern = isApi ? '**/*.{md,mdx}' : '**/*.md';
  const files = globSync(pattern, { cwd: instanceDir });

  for (const file of files) {
    const fullPath = path.join(instanceDir, file);
    const content = fs.readFileSync(fullPath, 'utf-8');

    // Extract slug from filename (without extension)
    const basename = path.basename(file).replace(/\.(mdx?|md)$/, '');

    // Skip sidebar/category files
    if (basename === '_category_' || basename.startsWith('_')) {
      continue;
    }

    // Try to get frontmatter slug override
    let fmSlug: string | undefined;
    try {
      const { data } = matter(content);
      if (data.slug && typeof data.slug === 'string') {
        fmSlug = data.slug;
      }
    } catch {
      // Ignore frontmatter parse errors
    }

    const slug = fmSlug || basename;

    // Skip special frontmatter slugs like "/" that don't correspond to ReadMe paths
    if (slug === '/' || slug === '') {
      continue;
    }

    const oldPath = getOldPath(slug, isApi);
    const newPath = getNewPath(file, instance);

    // Skip if old and new are the same (unlikely but defensive)
    if (oldPath !== newPath) {
      entries.push({ old: oldPath, new: newPath });
    }

    // For index files, also add a redirect from the directory name
    if (basename === 'index') {
      const dirName = path.basename(path.dirname(file));
      if (dirName && dirName !== '.' && dirName !== instance) {
        const dirOldPath = getOldPath(dirName, isApi);
        if (dirOldPath !== newPath) {
          entries.push({ old: dirOldPath, new: newPath });
        }
      }
    }
  }

  return entries;
}

function main(): void {
  console.log('Generating redirect map...\n');

  const allEntries: RedirectEntry[] = [];

  // Scan each content instance
  const instances = [
    { name: 'documentation', isApi: false },
    { name: 'platform', isApi: false },
    { name: 'blueprints', isApi: false },
    { name: 'terms', isApi: false },
    { name: 'api', isApi: true },
  ];

  for (const { name, isApi } of instances) {
    const entries = scanInstance(name, isApi);
    console.log(`  ${name}: ${entries.length} redirects`);
    allEntries.push(...entries);
  }

  // Deduplicate by old path (keep first occurrence)
  const seen = new Set<string>();
  const deduplicated: RedirectEntry[] = [];
  for (const entry of allEntries) {
    if (!seen.has(entry.old)) {
      seen.add(entry.old);
      deduplicated.push(entry);
    }
  }

  // Sort by old path for predictable output
  deduplicated.sort((a, b) => a.old.localeCompare(b.old));

  const redirectMap: RedirectMap = {
    redirects: deduplicated,
    generated: new Date().toISOString().split('T')[0],
    count: deduplicated.length,
  };

  const outputPath = path.join(PROJECT_ROOT, 'static', 'redirect-map.json');
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(redirectMap, null, 2), 'utf-8');

  console.log(`\nTotal redirects: ${deduplicated.length}`);
  console.log(`Output: ${outputPath}`);
}

main();
