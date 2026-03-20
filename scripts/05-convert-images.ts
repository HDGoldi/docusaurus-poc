/**
 * Script 05: Convert <Image> JSX tags to standard Markdown image syntax.
 *
 * Handles both self-closing (<Image ... />) and paired (<Image ...>...</Image>) variants.
 * Converts to:
 * - Simple case (no width): ![alt](/img/path.png)
 * - With width: <img src="/img/path.png" alt="alt text" width="80%" />
 * - With center align: wraps in <div style={{textAlign: 'center'}}>
 * - With caption: adds *caption text* below the image
 */
import * as path from 'node:path';
import { readMarkdownFiles, readFile, writeFile } from './utils/file-utils';
import { log, warn, success } from './utils/logger';

const STEP = '05-convert-images';
const DOCS_DIR = path.resolve(__dirname, '..', 'docs');

/**
 * Extract an attribute value from a JSX tag string.
 * Handles: attr="value", attr={value}, attr='value'
 */
function getAttr(tag: string, name: string): string | undefined {
  // Match attr="value" or attr='value'
  const strMatch = tag.match(new RegExp(`${name}="([^"]*)"`, 's'));
  if (strMatch) return strMatch[1];

  const strMatch2 = tag.match(new RegExp(`${name}='([^']*)'`, 's'));
  if (strMatch2) return strMatch2[1];

  // Match attr={value} (JSX expression — numbers, booleans, etc.)
  const jsxMatch = tag.match(new RegExp(`${name}=\\{([^}]*)\\}`));
  if (jsxMatch) return jsxMatch[1];

  return undefined;
}

/**
 * Convert a single <Image> tag (with its attributes and optional children)
 * to standard Markdown or HTML img syntax.
 */
function convertImageTag(
  openTag: string,
  childContent: string | undefined
): string {
  const src = getAttr(openTag, 'src');
  if (!src) {
    warn(STEP, `  Image tag without src found, leaving unchanged`);
    return childContent !== undefined
      ? `${openTag}\n${childContent}\n</Image>`
      : openTag;
  }

  // Get alt text: prefer alt attr, fallback to title, fallback to child content
  let alt = getAttr(openTag, 'alt') || '';
  const title = getAttr(openTag, 'title') || '';
  const caption = getAttr(openTag, 'caption') || '';
  const width = getAttr(openTag, 'width')?.trim() || '';
  const align = getAttr(openTag, 'align') || '';

  // If alt is a bare number (from alt={1110}), use title or caption instead
  if (/^\d+$/.test(alt)) {
    alt = title || caption || '';
  }

  // If no alt but has child content, use trimmed child content as alt
  if (!alt && childContent) {
    alt = childContent.trim();
  }

  // If still no alt, use title
  if (!alt && title) {
    alt = title;
  }

  // Build the image markup
  let imgMarkup: string;

  if (width) {
    // Use HTML <img> tag when width is specified for size control
    const escapedAlt = alt.replace(/"/g, '&quot;');
    imgMarkup = `<img src="${src}" alt="${escapedAlt}" width="${width}" />`;
  } else {
    // Use standard Markdown image syntax
    imgMarkup = `![${alt}](${src})`;
  }

  // Wrap in center div if aligned center
  if (align === 'center') {
    imgMarkup = `<div style={{textAlign: 'center'}}>\n${imgMarkup}\n</div>`;
  }

  // Add caption as italicized text below
  if (caption && caption !== alt) {
    imgMarkup += `\n\n*${caption}*`;
  }

  return imgMarkup;
}

function convertImages(): void {
  const files = readMarkdownFiles(DOCS_DIR);
  let totalFound = 0;
  let totalConverted = 0;
  let totalUnconverted = 0;

  log(STEP, `Scanning ${files.length} markdown files for <Image> tags...`);

  for (const relFile of files) {
    const fullPath = path.join(DOCS_DIR, relFile);
    let content = readFile(fullPath);

    // Check if file has any Image tags
    if (!content.includes('<Image ') && !content.includes('<Image\n')) {
      continue;
    }

    // Pre-process: decode HTML entities in Image tags (some files have &quot; instead of ")
    content = content.replace(/<Image\s[^]*?(?:\/?>|<\/Image>)/g, (match) => {
      return match
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>');
    });

    let fileFound = 0;
    let fileConverted = 0;

    // Pattern 1: Paired <Image ...>children</Image> (handle first since they're more specific)
    // Use a non-greedy match for the content between open and close tags
    const pairedRegex = /<Image\s+([^>]*?)>([^]*?)<\/Image>/g;
    content = content.replace(pairedRegex, (fullMatch, attrs, children) => {
      fileFound++;
      totalFound++;
      const openTag = `<Image ${attrs}>`;
      const result = convertImageTag(openTag, children);
      fileConverted++;
      totalConverted++;
      return result;
    });

    // Pattern 2: Self-closing <Image ... />
    const selfClosingRegex = /<Image\s+[^>]*?\/>/g;
    content = content.replace(selfClosingRegex, (fullMatch) => {
      fileFound++;
      totalFound++;
      const result = convertImageTag(fullMatch, undefined);
      fileConverted++;
      totalConverted++;
      return result;
    });

    if (fileFound > 0) {
      log(STEP, `  ${relFile}: ${fileFound} Image tag(s) found, ${fileConverted} converted`);
      writeFile(fullPath, content);
    }

    // Pattern 3: Orphaned open <Image ...> tags (no </Image> close) — malformed markup
    // Match the tag and optionally grab the next line as child content
    const orphanRegex = /<Image\s+([^>]*?)>\n?(.*?)(?:\n|$)/g;
    if (content.includes('<Image ') || content.includes('<Image\n')) {
      content = content.replace(orphanRegex, (fullMatch, attrs, nextLine) => {
        fileFound++;
        totalFound++;
        const openTag = `<Image ${attrs}>`;
        // Use the next line as child content (may be caption text)
        const child = nextLine?.trim() || undefined;
        const result = convertImageTag(openTag, child);
        fileConverted++;
        totalConverted++;
        return result + '\n';
      });
      if (fileFound > 0) {
        writeFile(fullPath, content);
      }
    }

    // Check for any remaining unconverted Image tags
    if (content.includes('<Image ') || content.includes('<Image\n')) {
      const remaining = (content.match(/<Image[\s]/g) || []).length;
      warn(STEP, `  ${relFile}: ${remaining} unconverted <Image> tag(s) remain`);
      totalUnconverted += remaining;
    }
  }

  log(STEP, '');
  log(STEP, '=== Summary ===');
  log(STEP, `Total <Image> tags found: ${totalFound}`);
  success(STEP, `Converted: ${totalConverted}`);
  if (totalUnconverted > 0) {
    warn(STEP, `Unconverted: ${totalUnconverted}`);
  }
}

convertImages();
