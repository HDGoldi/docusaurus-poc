import * as fs from 'node:fs';
import * as path from 'node:path';
import * as yaml from 'js-yaml';
import { globSync } from 'glob';
import { log, warn, success } from './utils/logger';

const STEP_NAME = '10-generate-sidebars';
const DOCS_DIR = path.resolve(__dirname, '..', 'docs');
const OUTPUT_PATH = path.resolve(__dirname, '..', 'sidebars.ts');

/**
 * Normalize a ReadMe export name to the directory convention used in docs/.
 * "1NCE OS" -> "1nce-os", "Blueprints & Examples" -> "blueprints-examples", etc.
 */
function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Read and parse a _order.yaml file. Returns an array of strings (slugs/names).
 */
function readOrderYaml(yamlPath: string): string[] {
  try {
    const content = fs.readFileSync(yamlPath, 'utf-8');
    const parsed = yaml.load(content);
    if (Array.isArray(parsed)) {
      return parsed.map(String);
    }
    return [];
  } catch {
    return [];
  }
}

/**
 * Convert a directory name to a human-readable label.
 * "1nce-os-device-controller" -> "1NCE OS Device Controller"
 * Handles special prefixes.
 */
function dirToLabel(dirName: string): string {
  // Special label mappings for top-level categories
  const specialLabels: Record<string, string> = {
    'introduction': 'Introduction',
    '1nce-portal': '1NCE Portal',
    'sim-cards': 'SIM Cards',
    'mcp-server': 'MCP Server',
    'connectivity-services': 'Connectivity Services',
    'platform-services': 'Platform Services',
    'network-services': 'Network Services',
    '1nce-os': '1NCE OS',
    'troubleshooting': 'Troubleshooting',
    'blueprints-examples': 'Blueprints & Examples',
    'reference': 'API Reference',
  };

  if (specialLabels[dirName]) {
    return specialLabels[dirName];
  }

  // Generic: capitalize each word, handle 1nce -> 1NCE, os -> OS, etc.
  return dirName
    .split('-')
    .map(word => {
      if (word === '1nce') return '1NCE';
      if (word === 'os') return 'OS';
      if (word === 'sms') return 'SMS';
      if (word === 'vpn') return 'VPN';
      if (word === 'api') return 'API';
      if (word === 'sdk') return 'SDK';
      if (word === 'lwm2m') return 'LWM2M';
      if (word === 'udp') return 'UDP';
      if (word === 'coap') return 'CoAP';
      if (word === 'http') return 'HTTP';
      if (word === 'ftp') return 'FTP';
      if (word === 'tcp') return 'TCP';
      if (word === 'aws') return 'AWS';
      if (word === 'mcp') return 'MCP';
      if (word === 'icmp') return 'ICMP';
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

interface SidebarItem {
  type: 'category' | 'doc';
  id?: string;
  label?: string;
  items?: SidebarItem[];
  link?: { type: string; id?: string };
}

/**
 * Build sidebar items for a given directory based on its _order.yaml.
 */
function buildSidebarItems(dirPath: string, docIdPrefix: string): SidebarItem[] {
  const orderPath = path.join(dirPath, '_order.yaml');
  const order = readOrderYaml(orderPath);
  const items: SidebarItem[] = [];

  if (order.length === 0) {
    // No _order.yaml or empty -- fall back to listing .md files and subdirs
    return buildFallbackItems(dirPath, docIdPrefix);
  }

  // Track which filesystem entries are covered by _order.yaml
  const coveredEntries = new Set<string>();

  for (const entry of order) {
    const normalizedEntry = normalizeName(entry);
    const subDirPath = path.join(dirPath, normalizedEntry);
    const mdFilePath = path.join(dirPath, `${normalizedEntry}.md`);

    if (fs.existsSync(subDirPath) && fs.statSync(subDirPath).isDirectory()) {
      coveredEntries.add(normalizedEntry);
      // It's a subdirectory -- create a category
      const subItems = buildSidebarItems(subDirPath, `${docIdPrefix}${normalizedEntry}/`);
      const indexMdPath = path.join(subDirPath, 'index.md');
      const hasIndex = fs.existsSync(indexMdPath);

      const category: SidebarItem = {
        type: 'category',
        label: dirToLabel(normalizedEntry),
        items: subItems,
      };

      // If the subdirectory has an index.md, use it as the category link
      if (hasIndex) {
        category.link = {
          type: 'doc',
          id: `${docIdPrefix}${normalizedEntry}/index`,
        };
      }

      items.push(category);
    } else if (fs.existsSync(mdFilePath)) {
      // It's a .md file
      coveredEntries.add(`${normalizedEntry}.md`);
      items.push({
        type: 'doc',
        id: `${docIdPrefix}${normalizedEntry}`,
      });
    } else {
      // Try without normalization (entry might already be a slug)
      const directMdPath = path.join(dirPath, `${entry}.md`);
      const directDirPath = path.join(dirPath, entry);
      if (fs.existsSync(directMdPath)) {
        coveredEntries.add(`${entry}.md`);
        items.push({
          type: 'doc',
          id: `${docIdPrefix}${entry}`,
        });
      } else if (fs.existsSync(directDirPath) && fs.statSync(directDirPath).isDirectory()) {
        coveredEntries.add(entry);
        const subItems = buildSidebarItems(directDirPath, `${docIdPrefix}${entry}/`);
        const indexMdPath = path.join(directDirPath, 'index.md');
        const hasIndex = fs.existsSync(indexMdPath);

        const category: SidebarItem = {
          type: 'category',
          label: dirToLabel(entry),
          items: subItems,
        };

        if (hasIndex) {
          category.link = {
            type: 'doc',
            id: `${docIdPrefix}${entry}/index`,
          };
        }

        items.push(category);
      } else {
        warn(STEP_NAME, `Orphaned _order.yaml entry: "${entry}" in ${dirPath} (no matching file or dir)`);
      }
    }
  }

  // Append filesystem entries not covered by _order.yaml
  const fsEntries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const fsEntry of fsEntries) {
    if (fsEntry.name === '_order.yaml' || fsEntry.name === 'index.md') continue;
    if (coveredEntries.has(fsEntry.name)) continue;

    if (fsEntry.isDirectory()) {
      const subItems = buildSidebarItems(path.join(dirPath, fsEntry.name), `${docIdPrefix}${fsEntry.name}/`);
      const indexMdPath = path.join(dirPath, fsEntry.name, 'index.md');
      const hasIndex = fs.existsSync(indexMdPath);

      const category: SidebarItem = {
        type: 'category',
        label: dirToLabel(fsEntry.name),
        items: subItems,
      };

      if (hasIndex) {
        category.link = {
          type: 'doc',
          id: `${docIdPrefix}${fsEntry.name}/index`,
        };
      }

      items.push(category);
    } else if (fsEntry.name.endsWith('.md')) {
      const slug = fsEntry.name.replace(/\.md$/, '');
      if (!coveredEntries.has(fsEntry.name)) {
        items.push({
          type: 'doc',
          id: `${docIdPrefix}${slug}`,
        });
      }
    }
  }

  return items;
}

/**
 * Fallback for directories without _order.yaml -- list .md files and subdirs alphabetically.
 */
function buildFallbackItems(dirPath: string, docIdPrefix: string): SidebarItem[] {
  const items: SidebarItem[] = [];
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.name === '_order.yaml' || entry.name === 'index.md') continue;

    if (entry.isDirectory()) {
      const subItems = buildSidebarItems(path.join(dirPath, entry.name), `${docIdPrefix}${entry.name}/`);
      const indexMdPath = path.join(dirPath, entry.name, 'index.md');
      const hasIndex = fs.existsSync(indexMdPath);

      const category: SidebarItem = {
        type: 'category',
        label: dirToLabel(entry.name),
        items: subItems,
      };

      if (hasIndex) {
        category.link = {
          type: 'doc',
          id: `${docIdPrefix}${entry.name}/index`,
        };
      }

      items.push(category);
    } else if (entry.name.endsWith('.md')) {
      const slug = entry.name.replace(/\.md$/, '');
      items.push({
        type: 'doc',
        id: `${docIdPrefix}${slug}`,
      });
    }
  }

  return items;
}

/**
 * Serialize sidebar items to TypeScript source code.
 */
function serializeItems(items: SidebarItem[], indent: number): string {
  const pad = '  '.repeat(indent);
  const lines: string[] = [];

  for (const item of items) {
    if (item.type === 'doc') {
      lines.push(`${pad}'${item.id}',`);
    } else if (item.type === 'category') {
      lines.push(`${pad}{`);
      lines.push(`${pad}  type: 'category',`);
      lines.push(`${pad}  label: '${(item.label || '').replace(/'/g, "\\'")}',`);
      if (item.link) {
        lines.push(`${pad}  link: { type: 'doc', id: '${item.link.id}' },`);
      }
      lines.push(`${pad}  items: [`);
      lines.push(serializeItems(item.items || [], indent + 2));
      lines.push(`${pad}  ],`);
      lines.push(`${pad}},`);
    }
  }

  return lines.join('\n');
}

// ---- Main ----

log(STEP_NAME, 'Generating sidebars from _order.yaml files...');

// Use the export's top-level _order.yaml for proper ordering
// The docs/_order.yaml was corrupted (only MCP Server entries) so we use the export's version
const exportOrderPath = globSync('dev-hub-*/docs/_order.yaml', { cwd: path.resolve(__dirname, '..') })[0];
let topLevelOrder: string[];

if (exportOrderPath) {
  const fullExportOrderPath = path.resolve(__dirname, '..', exportOrderPath);
  topLevelOrder = readOrderYaml(fullExportOrderPath);
  log(STEP_NAME, `Using export top-level order: ${topLevelOrder.join(', ')}`);
} else {
  // Fallback: read directories from docs/
  topLevelOrder = fs.readdirSync(DOCS_DIR, { withFileTypes: true })
    .filter(e => e.isDirectory())
    .map(e => e.name);
  log(STEP_NAME, `No export _order.yaml found, using directory listing`);
}

// Build the main sidebar
const sidebarItems: SidebarItem[] = [];
let totalCategories = 0;
let totalDocs = 0;

for (const entry of topLevelOrder) {
  const normalized = normalizeName(entry);
  const dirPath = path.join(DOCS_DIR, normalized);

  if (!fs.existsSync(dirPath)) {
    warn(STEP_NAME, `Top-level entry "${entry}" (normalized: "${normalized}") has no matching directory`);
    continue;
  }

  const subItems = buildSidebarItems(dirPath, `${normalized}/`);
  const indexMdPath = path.join(dirPath, 'index.md');
  const hasIndex = fs.existsSync(indexMdPath);

  const category: SidebarItem = {
    type: 'category',
    label: dirToLabel(normalized),
    items: subItems,
  };

  if (hasIndex) {
    category.link = {
      type: 'doc',
      id: `${normalized}/index`,
    };
  }

  sidebarItems.push(category);
}

// Add top-level standalone .md files (hardware guides, terms, recipes) at the end
const topLevelMdFiles = fs.readdirSync(DOCS_DIR)
  .filter(f => f.endsWith('.md') && f !== 'index.md')
  .sort();

if (topLevelMdFiles.length > 0) {
  const standaloneItems: SidebarItem[] = topLevelMdFiles.map(f => ({
    type: 'doc' as const,
    id: f.replace(/\.md$/, ''),
  }));

  sidebarItems.push({
    type: 'category',
    label: 'Additional Resources',
    items: standaloneItems,
  });
}

// Count categories and docs
function countItems(items: SidebarItem[]) {
  for (const item of items) {
    if (item.type === 'category') {
      totalCategories++;
      if (item.items) countItems(item.items);
    } else {
      totalDocs++;
    }
  }
}
countItems(sidebarItems);

// Also add reference section if it exists and is not in the top-level order
const hasReference = sidebarItems.some(item =>
  item.type === 'category' && item.label === 'API Reference'
);
if (!hasReference && fs.existsSync(path.join(DOCS_DIR, 'reference'))) {
  const refItems = buildSidebarItems(path.join(DOCS_DIR, 'reference'), 'reference/');
  sidebarItems.push({
    type: 'category',
    label: 'API Reference',
    items: refItems,
  });
}

// Recount after adding reference
totalCategories = 0;
totalDocs = 0;
countItems(sidebarItems);

// Generate sidebars.ts
const serialized = serializeItems(sidebarItems, 2);
const output = `import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docsSidebar: [
${serialized}
  ],
};

export default sidebars;
`;

fs.writeFileSync(OUTPUT_PATH, output, 'utf-8');

// Report orphaned files (not in any _order.yaml)
const allMdFiles = globSync('**/*.md', { cwd: DOCS_DIR });
const allOrderedIds = new Set<string>();

function collectIds(items: SidebarItem[]) {
  for (const item of items) {
    if (item.type === 'doc' && item.id) {
      allOrderedIds.add(item.id);
    }
    if (item.link?.id) {
      allOrderedIds.add(item.link.id);
    }
    if (item.items) collectIds(item.items);
  }
}
collectIds(sidebarItems);

const orphaned = allMdFiles.filter(f => {
  if (f === '_order.yaml') return false;
  const id = f.replace(/\.md$/, '');
  return !allOrderedIds.has(id);
});

if (orphaned.length > 0) {
  warn(STEP_NAME, `${orphaned.length} files not in any _order.yaml:`);
  for (const o of orphaned.slice(0, 10)) {
    warn(STEP_NAME, `  - ${o}`);
  }
  if (orphaned.length > 10) {
    warn(STEP_NAME, `  ... and ${orphaned.length - 10} more`);
  }
}

success(STEP_NAME, `Generated sidebars.ts: ${totalCategories} categories, ${totalDocs} doc items`);
if (orphaned.length > 0) {
  log(STEP_NAME, `${orphaned.length} orphaned files (not in sidebar)`);
}
