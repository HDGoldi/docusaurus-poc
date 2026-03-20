/**
 * Script 06: Convert HTMLBlock instances to MDX-compatible markup.
 *
 * Handles four categories:
 *   A) Centered image wrappers  -- strip wrapper, keep/convert <img>
 *   B) CSS grid/navigation table layouts -- replace with <NavigationGrid> component
 *   C) Simple HTML wrappers  -- strip wrapper, fix JSX compat (class->className, self-close voids)
 *   D) Styled content with <style> tags -- convert to inline styles, strip wrapper
 *
 * Idempotent: safe to re-run.
 */

import * as path from 'node:path';
import { readMarkdownFiles, readFile, writeFile } from './utils/file-utils';
import { log, warn, success } from './utils/logger';

const STEP = 'convert-htmlblocks';
const DOCS_DIR = path.resolve(__dirname, '..', 'docs');

// ---------- helpers ----------

/**
 * Extract all HTMLBlock regions from file content.
 * Returns array of { full, inner, start, end }.
 */
function extractHtmlBlocks(content: string): { full: string; inner: string; start: number; end: number }[] {
  const blocks: { full: string; inner: string; start: number; end: number }[] = [];
  const openTag = '<HTMLBlock>{`';
  const closeTag = '`}</HTMLBlock>';

  let cursor = 0;
  while (true) {
    const start = content.indexOf(openTag, cursor);
    if (start === -1) break;
    const innerStart = start + openTag.length;
    // Find matching close -- need to handle the case where inner content has backticks
    const end = content.indexOf(closeTag, innerStart);
    if (end === -1) {
      // Malformed block, skip
      cursor = innerStart;
      continue;
    }
    const inner = content.slice(innerStart, end);
    const full = content.slice(start, end + closeTag.length);
    blocks.push({ full, inner, start, end: end + closeTag.length });
    cursor = end + closeTag.length;
  }
  return blocks;
}

/**
 * Classify an HTMLBlock's inner content.
 */
function classify(inner: string): 'image' | 'navigation' | 'styled-table' | 'styled' | 'simple' {
  const trimmed = inner.trim();

  // Navigation grid pattern: has navigationTable class or display:table with multiple links
  if (trimmed.includes('navigationTable') || (trimmed.includes('display: table') && trimmed.includes('<a href'))) {
    return 'navigation';
  }

  // Complex HTML table with <style> and <table class="tg"> (portal user roles etc.)
  if (trimmed.includes('<style') && trimmed.includes('<table')) {
    return 'styled-table';
  }

  // Styled content with <style> tags (but not table)
  if (trimmed.includes('<style')) {
    return 'styled';
  }

  // Image wrapper: contains <img and is wrapped in <center>
  if (trimmed.includes('<img') && (trimmed.includes('<center>') || trimmed.includes('src='))) {
    return 'image';
  }

  return 'simple';
}

/**
 * Convert an image HTMLBlock to clean Markdown/JSX.
 */
function convertImage(inner: string): string {
  const trimmed = inner.trim();
  // Extract src and alt from the img tag
  const srcMatch = trimmed.match(/src="([^"]+)"/);
  const altMatch = trimmed.match(/alt="([^"]*)"/);

  if (!srcMatch) {
    // Fallback: return inner without wrapper but with JSX fixes
    return fixJsx(trimmed);
  }

  const src = srcMatch[1];
  const alt = altMatch ? altMatch[1] : '';

  // Convert to centered image using existing pattern seen in the codebase
  return `<div style={{textAlign: 'center'}}>\n<img src="${src}" alt="${alt}" style={{maxWidth: '100%'}} />\n</div>`;
}

/**
 * Parse navigation grid HTMLBlocks and extract items.
 */
function convertNavigationGrid(inner: string): string {
  const items: { title: string; description: string; link: string }[] = [];

  // Extract navigationTableCell blocks
  // Each cell has <h3><a href="...">Title</a></h3> and <p>Description</p>
  const cellRegex = /<div\s+class="navigationTableCell">\s*<h3>\s*<a\s+href="([^"]*)">([\s\S]*?)<\/a>\s*<\/h3>\s*<p>\s*([\s\S]*?)\s*<\/p>\s*<\/div>/g;

  let match: RegExpExecArray | null;
  while ((match = cellRegex.exec(inner)) !== null) {
    let link = match[1].trim();
    const title = match[2].trim();
    const description = match[3].trim();

    // Convert /dev-hub/docs/ and /dev-hub/page/ links to local paths
    link = link.replace(/^\/dev-hub\/docs\//, '/');
    link = link.replace(/^\/dev-hub\/page\//, '/');

    items.push({ title, description, link });
  }

  if (items.length === 0) {
    // Fallback: couldn't parse, return as simple HTML
    return fixJsx(inner.trim());
  }

  // Build the NavigationGrid component usage
  const itemsStr = items.map(item =>
    `  { title: "${item.title.replace(/"/g, '\\"')}", description: "${item.description.replace(/"/g, '\\"')}", link: "${item.link}" }`
  ).join(',\n');

  return `import NavigationGrid from '@site/src/components/NavigationGrid';\n\n<NavigationGrid items={[\n${itemsStr}\n]} />`;
}

/**
 * Convert a styled HTML table (like portal user roles) to clean MDX.
 * Since these are complex tables with rowspan/colspan, keep as HTML but fix for JSX.
 */
function convertStyledTable(inner: string): string {
  let result = inner.trim();

  // Remove the <style>...</style> block entirely
  result = result.replace(/<style[^>]*>[\s\S]*?<\/style>/g, '');

  // Fix JSX compatibility
  result = fixJsx(result);

  return result.trim();
}

/**
 * Convert styled content (non-table) to clean MDX.
 */
function convertStyled(inner: string): string {
  let result = inner.trim();

  // Remove <style> blocks
  result = result.replace(/<style[^>]*>[\s\S]*?<\/style>/g, '');

  // Fix JSX
  result = fixJsx(result);

  return result.trim();
}

/**
 * Fix HTML to be JSX-compatible:
 * - class= -> className=
 * - Self-close void elements
 * - Convert style strings to JSX objects (basic cases)
 */
function fixJsx(html: string): string {
  let result = html;

  // class= -> className= (but not className= already)
  result = result.replace(/\bclass=/g, 'className=');

  // Self-close void elements that aren't already self-closed
  result = result.replace(/<(img|br|hr|input|meta|link)\b([^>]*?)(?<!\/)>/gi, '<$1$2 />');

  // Convert inline style="..." to style={{...}} for JSX
  // This is complex; handle the most common patterns
  result = result.replace(/style="([^"]+)"/g, (match, styleStr: string) => {
    try {
      const props = styleStr
        .split(';')
        .filter((s: string) => s.trim())
        .map((s: string) => {
          const [key, ...valParts] = s.split(':');
          const value = valParts.join(':').trim();
          if (!key || !value) return null;
          // Convert CSS property to camelCase
          const camelKey = key.trim().replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
          // Wrap value in quotes (unless it's a number)
          const numVal = parseFloat(value);
          if (!isNaN(numVal) && value === String(numVal)) {
            return `${camelKey}: ${numVal}`;
          }
          return `${camelKey}: '${value.replace(/'/g, "\\'")}'`;
        })
        .filter(Boolean);
      return `style={{${props.join(', ')}}}`;
    } catch {
      // If conversion fails, return original
      return match;
    }
  });

  return result;
}

/**
 * Convert simple HTML wrappers.
 */
function convertSimple(inner: string): string {
  return fixJsx(inner.trim());
}

// ---------- main ----------

function main(): void {
  log(STEP, 'Starting HTMLBlock conversion...');

  const files = readMarkdownFiles(DOCS_DIR);
  let totalBlocks = 0;
  let converted = 0;
  const categories: Record<string, number> = {
    image: 0,
    navigation: 0,
    'styled-table': 0,
    styled: 0,
    simple: 0,
  };

  for (const relPath of files) {
    const fullPath = path.join(DOCS_DIR, relPath);
    let content = readFile(fullPath);
    const blocks = extractHtmlBlocks(content);

    if (blocks.length === 0) continue;

    totalBlocks += blocks.length;

    // Track if this file needs a NavigationGrid import
    let needsNavImport = false;

    // Process blocks in reverse order to maintain correct offsets
    for (let i = blocks.length - 1; i >= 0; i--) {
      const block = blocks[i];
      const category = classify(block.inner);
      categories[category]++;

      let replacement: string;
      switch (category) {
        case 'image':
          replacement = convertImage(block.inner);
          break;
        case 'navigation':
          replacement = convertNavigationGrid(block.inner);
          needsNavImport = true;
          break;
        case 'styled-table':
          replacement = convertStyledTable(block.inner);
          break;
        case 'styled':
          replacement = convertStyled(block.inner);
          break;
        case 'simple':
          replacement = convertSimple(block.inner);
          break;
      }

      content = content.slice(0, block.start) + replacement + content.slice(block.end);
      converted++;
      log(STEP, `  [${category}] ${relPath}`);
    }

    // For navigation grids, ensure the import is at the top (after frontmatter)
    if (needsNavImport) {
      // The import statement is already embedded in the replacement for navigation blocks.
      // But we need to deduplicate and move it to right after frontmatter.
      const importLine = "import NavigationGrid from '@site/src/components/NavigationGrid';";
      // Count how many times the import appears
      const importCount = (content.match(new RegExp(importLine.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;

      if (importCount > 0) {
        // Remove all embedded imports
        content = content.replace(new RegExp(importLine.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\n\n?', 'g'), '');

        // Add single import after frontmatter
        const fmEnd = content.indexOf('---', content.indexOf('---') + 3);
        if (fmEnd !== -1) {
          const insertPos = fmEnd + 3;
          content = content.slice(0, insertPos) + '\n\n' + importLine + '\n' + content.slice(insertPos);
        } else {
          // No frontmatter, add at top
          content = importLine + '\n\n' + content;
        }
      }
    }

    writeFile(fullPath, content);
  }

  log(STEP, '--- Summary ---');
  log(STEP, `Total HTMLBlocks found: ${totalBlocks}`);
  log(STEP, `Converted: ${converted}`);
  for (const [cat, count] of Object.entries(categories)) {
    if (count > 0) {
      log(STEP, `  ${cat}: ${count}`);
    }
  }
  success(STEP, 'HTMLBlock conversion complete.');
}

main();
