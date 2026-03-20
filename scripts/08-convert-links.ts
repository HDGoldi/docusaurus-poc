/**
 * Script 08: Convert (doc:slug) links to Docusaurus internal links.
 *
 * ReadMe uses `[link text](doc:slug-name)` and `[link text](doc:slug-name#anchor)`.
 * This script resolves them to Docusaurus paths using the slug map.
 *
 * Idempotent: safe to re-run (already-converted links won't match the pattern).
 */

import * as path from 'node:path';
import { readMarkdownFiles, readFile, writeFile } from './utils/file-utils';
import { buildSlugMap } from './utils/slug-map';
import { log, warn, success } from './utils/logger';

const STEP = 'convert-links';
const DOCS_DIR = path.resolve(__dirname, '..', 'docs');

// ---------- main ----------

function main(): void {
  log(STEP, 'Starting doc:slug link conversion...');

  // Build slug map
  const slugMap = buildSlugMap(DOCS_DIR);
  log(STEP, `Slug map built with ${slugMap.size} entries`);

  const files = readMarkdownFiles(DOCS_DIR);
  let totalLinks = 0;
  let resolved = 0;
  let unresolved = 0;
  const unresolvedSlugs = new Map<string, string[]>(); // slug -> [source files]

  // Pattern 1: Markdown link syntax [text](doc:slug) or [text](doc:slug#anchor)
  const mdLinkRegex = /\[([^\]]*)\]\(doc:([a-z0-9_-]+)(#[a-z0-9_-]*)?\)/gi;

  // Pattern 2: Bare (doc:slug) without markdown link (plain text reference)
  const bareLinkRegex = /(?<!\[)\(doc:([a-z0-9_-]+)(#[a-z0-9_-]*)?\)/gi;

  // Pattern 3: Previously unresolved links from earlier runs
  const unresolvedLinkRegex = /\[([^\]]*)\]\(\/unresolved\/doc:([a-z0-9_-]+)(#[a-z0-9_-]*)?\)/gi;

  for (const relPath of files) {
    const fullPath = path.join(DOCS_DIR, relPath);
    let content = readFile(fullPath);
    let modified = false;

    // Process previously-unresolved links first (retry with updated slug map)
    content = content.replace(unresolvedLinkRegex, (match, text: string, slug: string, anchor?: string) => {
      totalLinks++;
      const docPath = slugMap.get(slug);
      if (docPath) {
        resolved++;
        const fullLink = anchor ? `${docPath}${anchor}` : docPath;
        return `[${text}](${fullLink})`;
      } else {
        unresolved++;
        if (!unresolvedSlugs.has(slug)) {
          unresolvedSlugs.set(slug, []);
        }
        unresolvedSlugs.get(slug)!.push(relPath);
        warn(STEP, `  Still unresolved: doc:${slug} in ${relPath}`);
        return match; // Keep as /unresolved/
      }
    });

    // Process markdown links
    content = content.replace(mdLinkRegex, (match, text: string, slug: string, anchor?: string) => {
      totalLinks++;
      const docPath = slugMap.get(slug);
      if (docPath) {
        resolved++;
        const fullLink = anchor ? `${docPath}${anchor}` : docPath;
        return `[${text}](${fullLink})`;
      } else {
        unresolved++;
        // Track unresolved slug
        if (!unresolvedSlugs.has(slug)) {
          unresolvedSlugs.set(slug, []);
        }
        unresolvedSlugs.get(slug)!.push(relPath);
        warn(STEP, `  Unresolved: doc:${slug} in ${relPath}`);
        const fullLink = anchor ? `/unresolved/doc:${slug}${anchor}` : `/unresolved/doc:${slug}`;
        return `[${text}](${fullLink})`;
      }
    });

    // Process bare (doc:slug) references
    content = content.replace(bareLinkRegex, (match, slug: string, anchor?: string) => {
      totalLinks++;
      const docPath = slugMap.get(slug);
      if (docPath) {
        resolved++;
        const fullLink = anchor ? `${docPath}${anchor}` : docPath;
        return `(${fullLink})`;
      } else {
        unresolved++;
        if (!unresolvedSlugs.has(slug)) {
          unresolvedSlugs.set(slug, []);
        }
        unresolvedSlugs.get(slug)!.push(relPath);
        warn(STEP, `  Unresolved bare: doc:${slug} in ${relPath}`);
        const fullLink = anchor ? `/unresolved/doc:${slug}${anchor}` : `/unresolved/doc:${slug}`;
        return `(${fullLink})`;
      }
    });

    if (content !== readFile(fullPath)) {
      writeFile(fullPath, content);
    }
  }

  log(STEP, '--- Summary ---');
  log(STEP, `Total doc:slug links found: ${totalLinks}`);
  log(STEP, `Resolved: ${resolved}`);
  log(STEP, `Unresolved: ${unresolved}`);

  if (unresolvedSlugs.size > 0) {
    log(STEP, 'Unresolved slugs:');
    for (const [slug, sources] of unresolvedSlugs) {
      warn(STEP, `  doc:${slug} (referenced from ${sources.length} file(s))`);
    }
  }

  success(STEP, 'Doc link conversion complete.');
}

main();
