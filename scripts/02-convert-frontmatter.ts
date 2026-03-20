/**
 * Script 02: Convert Frontmatter
 *
 * Converts ReadMe frontmatter to Docusaurus-compatible frontmatter:
 * - title -> title (direct copy)
 * - excerpt -> description (if no metadata.description)
 * - metadata.description -> description (promoted, takes priority)
 * - metadata.title -> drop
 * - metadata.robots -> drop
 * - hidden: true -> draft: true
 * - deprecated -> drop
 * - next -> drop
 */

import * as path from 'node:path';
import matter from 'gray-matter';
import { readMarkdownFiles, readFile, writeFile } from './utils/file-utils.js';
import { log, warn, success } from './utils/logger.js';

const STEP = '02-frontmatter';
const DOCS_DIR = path.resolve(__dirname, '../docs');

let totalProcessed = 0;
let totalDraftConverted = 0;
let totalWithDescription = 0;

/**
 * Convert a single file's frontmatter from ReadMe format to Docusaurus format.
 */
function convertFrontmatter(content: string): string {
  const { data, content: body } = matter(content);

  // If no frontmatter at all, return as-is
  if (Object.keys(data).length === 0) {
    return content;
  }

  const newFrontmatter: Record<string, any> = {};

  // Title: direct copy
  if (data.title) {
    newFrontmatter.title = data.title;
  }

  // Description: prefer metadata.description, fall back to excerpt
  if (data.metadata?.description && data.metadata.description.trim() !== '') {
    newFrontmatter.description = data.metadata.description;
    totalWithDescription++;
  } else if (data.excerpt && data.excerpt.trim() !== '') {
    newFrontmatter.description = data.excerpt;
    totalWithDescription++;
  }

  // Hidden -> draft
  if (data.hidden === true) {
    newFrontmatter.draft = true;
    totalDraftConverted++;
  }

  // Drop: metadata.title, metadata.robots, deprecated, next
  // (Simply not including them in newFrontmatter)

  // Preserve any slug field if present
  if (data.slug) {
    newFrontmatter.slug = data.slug;
  }

  return matter.stringify(body, newFrontmatter);
}

export function convertAllFrontmatter(): void {
  log(STEP, 'Starting frontmatter conversion...');

  const files = readMarkdownFiles(DOCS_DIR);
  log(STEP, `Found ${files.length} markdown files`);

  for (const file of files) {
    const fullPath = path.join(DOCS_DIR, file);
    const content = readFile(fullPath);

    try {
      const converted = convertFrontmatter(content);
      writeFile(fullPath, converted);
      totalProcessed++;
    } catch (err) {
      warn(STEP, `Failed to convert frontmatter in ${file}: ${err}`);
    }
  }

  success(STEP, `Complete! Processed: ${totalProcessed}, Draft conversions: ${totalDraftConverted}, With descriptions: ${totalWithDescription}`);
}

// Run if executed directly
convertAllFrontmatter();
