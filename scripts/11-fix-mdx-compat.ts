/**
 * 11-fix-mdx-compat.ts
 *
 * Fixes MDX compatibility issues in converted docs:
 * 1. Angle bracket text outside code blocks (AT commands like <CTRL+Z>, <message_length>, <URL>, etc.)
 * 2. HTML table <td>/<th> closing tags on separate lines from content
 * 3. Malformed URLs with quotes/angle brackets
 * 4. Unclosed self-closing tags (e.g., <br /> with extra content after /)
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { globSync } from 'glob';
import { log, warn, success } from './utils/logger';

const STEP_NAME = '11-fix-mdx-compat';
const DOCS_DIR = path.resolve(__dirname, '..', 'docs');

let totalFixes = 0;
let filesFixed = 0;

function fixMdxContent(content: string, filePath: string): string {
  let fixed = content;
  let localFixes = 0;

  // ---- Fix 1: Angle bracket text interpreted as JSX tags ----
  // These appear in AT command descriptions outside code blocks.
  // Match <WORD> patterns that are NOT real HTML/JSX tags and NOT inside code blocks.
  // We process line by line, tracking if we're in a code block.

  const lines = fixed.split('\n');
  let inCodeBlock = false;
  let inHtmlBlock = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Track code blocks
    if (line.trimStart().startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (inCodeBlock) continue;

    // Skip lines that are pure HTML table rows (they need different handling)
    if (line.trim().startsWith('<tr') || line.trim().startsWith('<th') ||
        line.trim().startsWith('<td') || line.trim().startsWith('<thead') ||
        line.trim().startsWith('<tbody') || line.trim().startsWith('<table') ||
        line.trim().startsWith('</tr') || line.trim().startsWith('</thead') ||
        line.trim().startsWith('</tbody') || line.trim().startsWith('</table')) {
      continue;
    }

    // Fix angle bracket patterns that aren't real HTML tags
    // Match <WORD> where WORD contains non-tag characters like +, spaces, _
    // Known safe HTML tags to skip
    const safeHtmlTags = new Set([
      'a', 'abbr', 'address', 'area', 'article', 'aside', 'audio',
      'b', 'base', 'bdi', 'bdo', 'blockquote', 'body', 'br', 'button',
      'canvas', 'caption', 'cite', 'code', 'col', 'colgroup',
      'data', 'datalist', 'dd', 'del', 'details', 'dfn', 'dialog', 'div', 'dl', 'dt',
      'em', 'embed', 'fieldset', 'figcaption', 'figure', 'footer', 'form',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hgroup', 'hr', 'html',
      'i', 'iframe', 'img', 'input', 'ins',
      'kbd', 'label', 'legend', 'li', 'link',
      'main', 'map', 'mark', 'math', 'menu', 'menuitem', 'meta', 'meter',
      'nav', 'noscript',
      'object', 'ol', 'optgroup', 'option', 'output',
      'p', 'param', 'picture', 'pre', 'progress',
      'q', 'rb', 'rp', 'rt', 'rtc', 'ruby',
      's', 'samp', 'script', 'section', 'select', 'slot', 'small', 'source', 'span',
      'strong', 'style', 'sub', 'summary', 'sup', 'svg',
      'table', 'tbody', 'td', 'template', 'textarea', 'tfoot', 'th', 'thead',
      'time', 'title', 'tr', 'track',
      'u', 'ul', 'var', 'video', 'wbr',
      // React/MDX components (capitalized) are handled separately
    ]);

    // First, undo any double-wrapping from previous runs (idempotency)
    let currentLine = line.replace(/`{1,3}<([a-zA-Z][a-zA-Z0-9_+\-]*)>`{1,3}/g, '<$1>');
    // Also undo patterns like ```<tag>```
    currentLine = currentLine.replace(/```<([^>]+)>```/g, '<$1>');

    // Replace angle bracket patterns that look like placeholder text (not HTML tags)
    // e.g., <CTRL+Z>, <message_length>, <URL>, <number_unread>, <http_post_target>, <format>, <sms_id>, <value>
    const newLine = currentLine.replace(/<(\/?[a-zA-Z][a-zA-Z0-9_+\-]*)>/g, (match, tagName) => {
      const cleanTag = tagName.replace(/^\//, '').toLowerCase();

      // Skip actual HTML tags
      if (safeHtmlTags.has(cleanTag)) return match;

      // Skip React/MDX components (PascalCase like NavigationGrid, not ALL-CAPS like CTRL)
      const cleanTagName = tagName.replace(/^\//, '');
      if (/^[A-Z][a-z]/.test(cleanTagName)) return match;

      // Skip if it's a closing tag for a known HTML element
      if (tagName.startsWith('/') && safeHtmlTags.has(tagName.slice(1).toLowerCase())) return match;

      // This is a placeholder/AT command parameter -- escape the angle brackets
      localFixes++;
      return `\`${match}\``;
    });

    if (newLine !== line) {
      lines[i] = newLine;
    }
  }

  fixed = lines.join('\n');

  // ---- Fix 4: Clean up any remaining double-wrapped backticks from previous runs ----
  fixed = fixed.replace(/`{2,3}<([a-zA-Z][a-zA-Z0-9_+\-]*)>`{2,3}/g, (match, inner) => {
    localFixes++;
    return `\`<${inner}>\``;
  });

  // ---- Fix 2: HTML table closing tags on separate lines ----
  // MDX doesn't handle well when </td> or </th> is on a different line from content.
  // Pattern: content\n</td> -> content</td>
  fixed = fixed.replace(/(<(?:td|th)[^>]*>(?:<[^>]+>)*[^<\n]*)\n<\/(?:td|th)>/g, (match, before, offset) => {
    localFixes++;
    // Determine if it's td or th
    const closingTag = match.includes('</th>') ? '</th>' : '</td>';
    return before + closingTag;
  });

  // Also handle: <p>content</p>\n</td> -> <p>content</p></td>
  fixed = fixed.replace(/<\/p>\n<\/(td|th)>/g, (match, tag) => {
    localFixes++;
    return `</p></${tag}>`;
  });

  // ---- Fix 3: Malformed URLs with quotes in angle brackets ----
  // Pattern: [<<https://"server-ip":"port"/"endpoint"/>>](https://"server-ip":"port"/"endpoint"/)
  fixed = fixed.replace(/\[<<https?:\/\/"[^>]+>>\]\(https?:\/\/"[^)]+\)/g, (match) => {
    localFixes++;
    // Replace with code-formatted version
    return '`' + match.replace(/\[<<|>>\]/g, '').replace(/\(https?:\/\/[^)]+\)/, '') + '`';
  });

  // Also fix standalone URLs with quotes: https://"server-ip":"port"/"endpoint"/
  fixed = fixed.replace(/(https?:\/\/)"([^"]+)":"([^"]+)"\/?"([^"]*)"?\/?/g, (match) => {
    // Only fix if not already in backticks and contains quotes
    localFixes++;
    return '`' + match + '`';
  });

  if (localFixes > 0) {
    totalFixes += localFixes;
    filesFixed++;
    log(STEP_NAME, `Fixed ${localFixes} issues in ${path.relative(DOCS_DIR, filePath)}`);
  }

  return fixed;
}

// ---- Main ----

log(STEP_NAME, 'Fixing MDX compatibility issues in docs...');

const mdFiles = globSync('**/*.md', { cwd: DOCS_DIR });

for (const relPath of mdFiles) {
  const fullPath = path.join(DOCS_DIR, relPath);
  const content = fs.readFileSync(fullPath, 'utf-8');
  const fixed = fixMdxContent(content, fullPath);

  if (fixed !== content) {
    fs.writeFileSync(fullPath, fixed, 'utf-8');
  }
}

success(STEP_NAME, `Fixed ${totalFixes} MDX compatibility issues across ${filesFixed} files`);
