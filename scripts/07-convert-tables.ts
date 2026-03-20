/**
 * Script 07: Convert <Table> JSX components to GFM Markdown tables.
 *
 * The ReadMe export uses <Table align={[...]}> with <thead>, <tbody>, <tr>, <th>, <td>
 * inside. This script converts them to standard Markdown tables.
 *
 * Idempotent: safe to re-run.
 */

import * as path from 'node:path';
import { readMarkdownFiles, readFile, writeFile } from './utils/file-utils';
import { log, warn, success } from './utils/logger';

const STEP = 'convert-tables';
const DOCS_DIR = path.resolve(__dirname, '..', 'docs');

// ---------- helpers ----------

/**
 * Extract text content from an HTML cell, preserving inline Markdown.
 * Strips outer <td>/<th> tags, style attributes, and collapses whitespace.
 */
function extractCellText(cellHtml: string): string {
  let text = cellHtml;

  // Remove the outer tag (td or th with any attributes)
  text = text.replace(/^<t[hd][^>]*>/i, '');
  text = text.replace(/<\/t[hd]>$/i, '');

  // Remove <p> tags
  text = text.replace(/<\/?p>/g, '');

  // Remove <span> tags (keeping content)
  text = text.replace(/<span[^>]*>/g, '');
  text = text.replace(/<\/span>/g, '');

  // Convert <br> and <br /> to space
  text = text.replace(/<br\s*\/?>/g, ' ');

  // Convert backslash line breaks to space
  text = text.replace(/\\\s*\n/g, ' ');

  // Collapse multiple whitespace/newlines into single space
  text = text.replace(/\s+/g, ' ');

  // Trim
  text = text.trim();

  // Escape pipe characters inside cell content
  text = text.replace(/\|/g, '\\|');

  return text;
}

/**
 * Parse a <Table>...</Table> block and convert to GFM Markdown table.
 */
function convertTable(tableBlock: string): string {
  // Extract rows: find all <tr>...</tr> blocks
  const rowRegex = /<tr>([\s\S]*?)<\/tr>/g;
  const rows: string[][] = [];
  let isHeader = false;
  let inThead = false;
  const headerRows: number[] = [];

  // Track thead/tbody boundaries
  const parts = tableBlock.split(/(<\/?thead>|<\/?tbody>)/);

  let rowMatch: RegExpExecArray | null;
  for (const part of parts) {
    if (part === '<thead>') { inThead = true; continue; }
    if (part === '</thead>') { inThead = false; continue; }
    if (part === '<tbody>' || part === '</tbody>') continue;

    // Find rows in this part
    rowRegex.lastIndex = 0;
    while ((rowMatch = rowRegex.exec(part)) !== null) {
      const rowHtml = rowMatch[1];
      // Extract cells (th or td)
      const cellRegex = /<(th|td)[^>]*>([\s\S]*?)<\/\1>/g;
      const cells: string[] = [];
      let cellMatch: RegExpExecArray | null;
      while ((cellMatch = cellRegex.exec(rowHtml)) !== null) {
        cells.push(extractCellText(cellMatch[0]));
      }

      if (cells.length > 0) {
        if (inThead) {
          headerRows.push(rows.length);
        }
        rows.push(cells);
      }
    }
  }

  if (rows.length === 0) {
    return tableBlock; // Can't parse, return as-is
  }

  // Determine header row (first row from thead, or first row overall)
  const headerIdx = headerRows.length > 0 ? headerRows[0] : 0;
  const headerRow = rows[headerIdx];
  const dataRows = rows.filter((_, i) => i !== headerIdx);

  // Determine column count
  const colCount = Math.max(headerRow.length, ...dataRows.map(r => r.length));

  // Pad rows to have equal columns
  const padRow = (row: string[]): string[] => {
    while (row.length < colCount) row.push('');
    return row;
  };

  // Build Markdown table
  const lines: string[] = [];

  // Header
  const paddedHeader = padRow([...headerRow]);
  lines.push('| ' + paddedHeader.join(' | ') + ' |');

  // Separator
  lines.push('| ' + paddedHeader.map(() => '---').join(' | ') + ' |');

  // Data rows -- skip rows where ALL cells are empty (spacer rows)
  for (const row of dataRows) {
    const paddedRow = padRow([...row]);
    const allEmpty = paddedRow.every(cell => cell.trim() === '');
    if (allEmpty) continue; // Skip empty spacer rows
    lines.push('| ' + paddedRow.join(' | ') + ' |');
  }

  return lines.join('\n');
}

// ---------- main ----------

function main(): void {
  log(STEP, 'Starting Table JSX conversion...');

  const files = readMarkdownFiles(DOCS_DIR);
  let totalTables = 0;
  let convertedTables = 0;

  for (const relPath of files) {
    const fullPath = path.join(DOCS_DIR, relPath);
    let content = readFile(fullPath);

    // Find all <Table ...>...</Table> blocks
    // The Table tag may have attributes like align={[...]}
    const tableRegex = /<Table\s[^>]*>[\s\S]*?<\/Table>/g;
    const matches = content.match(tableRegex);

    if (!matches || matches.length === 0) continue;

    totalTables += matches.length;

    for (const tableBlock of matches) {
      const mdTable = convertTable(tableBlock);
      if (mdTable !== tableBlock) {
        content = content.replace(tableBlock, mdTable);
        convertedTables++;
        log(STEP, `  Converted table in ${relPath}`);
      } else {
        warn(STEP, `  Could not convert table in ${relPath}`);
      }
    }

    writeFile(fullPath, content);
  }

  log(STEP, '--- Summary ---');
  log(STEP, `Total <Table> blocks found: ${totalTables}`);
  log(STEP, `Converted: ${convertedTables}`);
  success(STEP, 'Table conversion complete.');
}

main();
