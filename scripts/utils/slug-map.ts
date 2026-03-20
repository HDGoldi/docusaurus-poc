import { globSync } from 'glob';
import matter from 'gray-matter';
import * as fs from 'node:fs';
import * as path from 'node:path';

/**
 * Build a mapping from ReadMe slugs to Docusaurus document paths.
 *
 * Keys are slugs (filename without extension, or frontmatter `slug` override).
 * Values are Docusaurus doc IDs prefixed with `/` (e.g., `/1nce-os/device-controller/device-controller-api`).
 */
export function buildSlugMap(docsDir: string): Map<string, string> {
  const slugMap = new Map<string, string>();
  const files = globSync('**/*.md', { cwd: docsDir });

  for (const file of files) {
    const fullPath = path.join(docsDir, file);
    const content = fs.readFileSync(fullPath, 'utf-8');
    const { data } = matter(content);

    // The slug key is derived from the filename (without extension)
    const filenameSlug = path.basename(file, '.md');
    // The Docusaurus doc ID is the relative path without extension
    const docId = '/' + file.replace(/\.md$/, '');

    // Register under filename slug
    slugMap.set(filenameSlug, docId);

    // For index.md files, also register the parent directory name as a slug.
    // ReadMe uses (doc:parent-dir-name) to link to index pages.
    if (filenameSlug === 'index') {
      const dirName = path.basename(path.dirname(file));
      if (dirName && dirName !== '.') {
        slugMap.set(dirName, docId);
      }
    }

    // Also register under frontmatter slug if present (as an override)
    if (data.slug && typeof data.slug === 'string') {
      slugMap.set(data.slug, docId);
    }
  }

  return slugMap;
}
