/**
 * Script 09: Convert blockquote admonitions to Docusaurus ::: syntax.
 *
 * ReadMe uses `> :warning: text` style blockquote admonitions.
 * Docusaurus uses `:::warning\ntext\n:::` syntax.
 *
 * Idempotent: safe to re-run (already-converted admonitions won't match the pattern).
 */

import * as path from 'node:path';
import { readMarkdownFiles, readFile, writeFile } from './utils/file-utils';
import { log, warn, success } from './utils/logger';

const STEP = 'convert-admonitions';
const DOCS_DIR = path.resolve(__dirname, '..', 'docs');

// Map ReadMe emoji types to Docusaurus admonition types
const TYPE_MAP: Record<string, string> = {
  ':warning:': 'warning',
  ':info:': 'info',
  ':memo:': 'note',
  ':bulb:': 'tip',
  ':check:': 'note',
  ':x:': 'danger',
};

// ---------- main ----------

function main(): void {
  log(STEP, 'Starting blockquote admonition conversion...');

  const files = readMarkdownFiles(DOCS_DIR);
  let totalAdmonitions = 0;
  let converted = 0;
  const typeCounts: Record<string, number> = {};

  for (const relPath of files) {
    const fullPath = path.join(DOCS_DIR, relPath);
    let content = readFile(fullPath);
    let modified = false;

    // Match blockquote admonitions: lines starting with `> :type:` followed by content
    // The admonition may span multiple lines, each prefixed with `>`
    const lines = content.split('\n');
    const newLines: string[] = [];
    let i = 0;

    while (i < lines.length) {
      // Check if this line starts a blockquote admonition
      const admonitionMatch = lines[i].match(/^>\s*(:[\w]+:)\s*(.*)/);

      if (admonitionMatch && TYPE_MAP[admonitionMatch[1]]) {
        const emojiType = admonitionMatch[1];
        const docType = TYPE_MAP[emojiType];
        const firstLineContent = admonitionMatch[2].trim();

        totalAdmonitions++;
        typeCounts[docType] = (typeCounts[docType] || 0) + 1;

        // Collect all continuation lines (lines starting with >)
        const contentLines: string[] = [];
        if (firstLineContent) {
          contentLines.push(firstLineContent);
        }

        i++;
        while (i < lines.length && /^>/.test(lines[i])) {
          // Strip the leading `> ` or `>`
          const lineContent = lines[i].replace(/^>\s?/, '');
          contentLines.push(lineContent);
          i++;
        }

        // Build the Docusaurus admonition
        newLines.push(`:::${docType}`);
        // Add content, trimming trailing empty lines
        let contentBlock = contentLines.join('\n');
        contentBlock = contentBlock.replace(/\n+$/, '');
        newLines.push(contentBlock);
        newLines.push(':::');
        newLines.push('');

        converted++;
        modified = true;
        log(STEP, `  [${docType}] ${relPath}`);
      } else {
        newLines.push(lines[i]);
        i++;
      }
    }

    if (modified) {
      writeFile(fullPath, newLines.join('\n'));
    }
  }

  log(STEP, '--- Summary ---');
  log(STEP, `Total blockquote admonitions found: ${totalAdmonitions}`);
  log(STEP, `Converted: ${converted}`);
  for (const [type, count] of Object.entries(typeCounts)) {
    log(STEP, `  ${type}: ${count}`);
  }
  success(STEP, 'Admonition conversion complete.');
}

main();
