/**
 * 12-fix-readme-components.ts
 *
 * Converts remaining ReadMe proprietary React components to standard HTML/MDX:
 * - <Table> -> <table> (lowercase HTML)
 * - <Anchor> -> <a> (standard HTML link)
 * - <Callout> -> Docusaurus admonition (:::note, :::tip, etc.)
 * - <Tab>/<Tabs> -> Docusaurus Tabs component (with proper import)
 * - <Recipe> -> Markdown link card (simple list with links)
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { globSync } from 'glob';
import { log, warn, success } from './utils/logger';

const STEP_NAME = '12-fix-readme-components';
const DOCS_DIR = path.resolve(__dirname, '..', 'docs');

let totalFixes = 0;
let filesFixed = 0;

function fixReadmeComponents(content: string, filePath: string): string {
  let fixed = content;
  let localFixes = 0;

  // ---- Fix 1: <Table> -> <table> ----
  // These are ReadMe's Table component wrapping standard HTML table content
  // They look like info/callout tables with emoji headers
  fixed = fixed.replace(/<Table>/g, () => { localFixes++; return '<table>'; });
  fixed = fixed.replace(/<\/Table>/g, () => { localFixes++; return '</table>'; });

  // ---- Fix 2: <Anchor> -> <a> ----
  // Pattern: <Anchor label="text" target="_blank" href="url">text</Anchor>
  fixed = fixed.replace(/<Anchor\s+label="([^"]*)"[^>]*href="([^"]*)"[^>]*>([^<]*)<\/Anchor>/g,
    (match, label, href, text) => {
      localFixes++;
      return `<a href="${href}" target="_blank">${text}</a>`;
    }
  );

  // ---- Fix 3: <Callout> -> Docusaurus admonition ----
  // Pattern: <Callout icon="emoji" theme="default">content</Callout>
  // Map emoji to admonition type
  fixed = fixed.replace(/<Callout\s+icon="([^"]*)"[^>]*>([\s\S]*?)<\/Callout>/g,
    (match, icon, content) => {
      localFixes++;
      let type = 'note';
      if (icon.includes('💡') || icon.includes('📖')) type = 'tip';
      if (icon.includes('⚠') || icon.includes('⏳')) type = 'warning';
      if (icon.includes('🕵')) type = 'info';
      if (icon.includes('ℹ') || icon.includes('📘')) type = 'info';

      // Clean up the content - remove leading/trailing whitespace and heading markup
      const cleanContent = content
        .replace(/^\s*###\s*\*\*Note:\*\*\s*/m, '')  // Remove "### **Note:**"
        .trim();

      return `:::${type}\n${cleanContent}\n:::`;
    }
  );

  // ---- Fix 4: <Tabs>/<Tab> -> Docusaurus Tabs ----
  // Need to add import and convert Tab title attribute to label
  if (fixed.includes('<Tabs>') || fixed.includes('<Tab ')) {
    // Add import at top (after frontmatter)
    if (!fixed.includes("import Tabs from '@theme/Tabs'")) {
      const frontmatterEnd = fixed.indexOf('---', fixed.indexOf('---') + 3);
      if (frontmatterEnd > 0) {
        const insertPos = frontmatterEnd + 3;
        fixed = fixed.slice(0, insertPos) + '\n\nimport Tabs from \'@theme/Tabs\';\nimport TabItem from \'@theme/TabItem\';\n' + fixed.slice(insertPos);
        localFixes++;
      }
    }

    // Convert <Tab title="X"> to <TabItem value="x" label="X">
    fixed = fixed.replace(/<Tab\s+title="([^"]*)">/g, (match, title) => {
      localFixes++;
      const value = title.toLowerCase().replace(/\s+/g, '-');
      return `<TabItem value="${value}" label="${title}">`;
    });
    fixed = fixed.replace(/<\/Tab>/g, () => { localFixes++; return '</TabItem>'; });
  }

  // ---- Fix 5: <Recipe> -> Markdown link list ----
  // Pattern: <Recipe slug="xxx" title="XXX" ... link="url" emoji="E" />
  // Convert to a linked list item
  fixed = fixed.replace(/<Recipe\s+slug="([^"]*)"[^>]*title="([^"]*)"[^>]*link="([^"]*)"[^>]*emoji="([^"]*)"[^>]*\/>/g,
    (match, slug, title, link, emoji) => {
      localFixes++;
      // Try to link to local blueprint if it exists
      const localPath = `/blueprints-examples/${slug}`;
      return `- ${emoji} [${title}](${localPath})`;
    }
  );

  // Also handle Recipe without link attribute
  fixed = fixed.replace(/<Recipe\s+slug="([^"]*)"[^>]*title="([^"]*)"[^>]*emoji="([^"]*)"[^>]*\/>/g,
    (match, slug, title, emoji) => {
      localFixes++;
      return `- ${emoji} [${title}](/blueprints-examples/${slug})`;
    }
  );

  if (localFixes > 0) {
    totalFixes += localFixes;
    filesFixed++;
    log(STEP_NAME, `Fixed ${localFixes} component references in ${path.relative(DOCS_DIR, filePath)}`);
  }

  return fixed;
}

// ---- Main ----

log(STEP_NAME, 'Converting remaining ReadMe components to standard HTML/MDX...');

const mdFiles = globSync('**/*.md', { cwd: DOCS_DIR });

for (const relPath of mdFiles) {
  const fullPath = path.join(DOCS_DIR, relPath);
  const content = fs.readFileSync(fullPath, 'utf-8');
  const fixed = fixReadmeComponents(content, fullPath);

  if (fixed !== content) {
    fs.writeFileSync(fullPath, fixed, 'utf-8');
  }
}

success(STEP_NAME, `Converted ${totalFixes} ReadMe components across ${filesFixed} files`);
