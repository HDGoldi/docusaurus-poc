/**
 * Script 11: Reorganize content into per-instance directories
 * and convert _order.yaml files to Docusaurus _category_.json files.
 *
 * Moves content from flat docs/ structure into:
 *   docs/documentation/  (Introduction, Connectivity, SIM Cards, etc.)
 *   docs/platform/       (1NCE OS, 1NCE Portal, Platform Services)
 *   docs/blueprints/     (Blueprints & Examples, hardware guides, recipes)
 *   docs/terms/          (Terms & Abbreviations)
 *
 * docs/reference/ stays in place (used by API Explorer in Plan 03).
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import * as yaml from 'js-yaml';
import { log, success, warn, error } from './utils/logger';

const STEP = 'reorganize';
const DOCS_DIR = path.resolve(__dirname, '..', 'docs');

// --- Mapping: source folder/file -> target instance directory ---

const FOLDER_MOVES: Record<string, { target: string; folders: string[]; files: string[] }> = {
  documentation: {
    target: 'docs/documentation',
    folders: [
      'introduction',
      'connectivity-services',
      'sim-cards',
      'network-services',
      'troubleshooting',
      'mcp-server',
    ],
    files: [],
  },
  platform: {
    target: 'docs/platform',
    folders: ['1nce-os', '1nce-portal', 'platform-services'],
    files: [],
  },
  blueprints: {
    target: 'docs/blueprints',
    folders: ['blueprints-examples'],
    files: [
      'recipes.md',
      'quectel-bg95-m3.md',
      'quectel-ec25-ec21.md',
      'sara-r410m.md',
      'sim7000g.md',
      'simcom-7020g-simcom800l.md',
    ],
  },
  terms: {
    target: 'docs/terms',
    folders: [],
    files: ['terms-abbreviations.md'],
  },
};

// --- Special label mappings for directory names ---

const SPECIAL_LABELS: Record<string, string> = {
  '1nce': '1NCE',
  os: 'OS',
  mcp: 'MCP',
  sim: 'SIM',
  sms: 'SMS',
  vpn: 'VPN',
  sdk: 'SDK',
  lwm2m: 'LWM2M',
  tcp: 'TCP',
  udp: 'UDP',
  http: 'HTTP',
  ftp: 'FTP',
  api: 'API',
  coap: 'CoAP',
  apn: 'APN',
  icmp: 'ICMP',
  rat: 'RAT',
  mt: 'MT',
  mo: 'MO',
  psk: 'PSK',
  aws: 'AWS',
  iot: 'IoT',
  euicc: 'eUICC',
  fota: 'FOTA',
};

/**
 * Convert a directory name like "1nce-os-device-controller" to a
 * human-readable label like "1NCE OS Device Controller".
 */
function dirNameToLabel(dirName: string): string {
  const parts = dirName.split('-');
  const labelParts: string[] = [];

  // Handle special compound: "1nce" followed by next words
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i].toLowerCase();
    const special = SPECIAL_LABELS[part];
    if (special) {
      labelParts.push(special);
    } else {
      // Title case
      labelParts.push(part.charAt(0).toUpperCase() + part.slice(1));
    }
  }

  return labelParts.join(' ');
}

/**
 * Move a directory from src to dest using fs.renameSync.
 * Creates parent directory of dest if needed.
 */
function moveDir(src: string, dest: string): void {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.renameSync(src, dest);
  log(STEP, `Moved directory: ${path.relative(DOCS_DIR, src)} -> ${path.relative(DOCS_DIR, dest)}`);
}

/**
 * Move a file from src to dest using fs.renameSync.
 * Creates parent directory of dest if needed.
 */
function moveFile(src: string, dest: string): void {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.renameSync(src, dest);
  log(STEP, `Moved file: ${path.relative(DOCS_DIR, src)} -> ${path.relative(DOCS_DIR, dest)}`);
}

/**
 * Read an _order.yaml file and return the list of entries.
 */
function readOrderYaml(filePath: string): string[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const parsed = yaml.load(content);
  if (!Array.isArray(parsed)) {
    warn(STEP, `Expected array in ${filePath}, got ${typeof parsed}`);
    return [];
  }
  return parsed.map(String);
}

/**
 * Write a _category_.json file with label and position.
 */
function writeCategoryJson(dir: string, label: string, position: number): void {
  const categoryPath = path.join(dir, '_category_.json');
  const data = { label, position };
  fs.writeFileSync(categoryPath, JSON.stringify(data, null, 2) + '\n', 'utf-8');
  log(STEP, `Created _category_.json: ${path.relative(DOCS_DIR, categoryPath)} (label: "${label}", position: ${position})`);
}

/**
 * Process a single directory: read its _order.yaml, create _category_.json
 * for each child entry, then delete the _order.yaml.
 */
function processOrderYaml(dir: string): void {
  const orderFile = path.join(dir, '_order.yaml');
  if (!fs.existsSync(orderFile)) return;

  const entries = readOrderYaml(orderFile);

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    const position = i + 1;

    // Check if entry is a directory
    const childDir = path.join(dir, entry);
    if (fs.existsSync(childDir) && fs.statSync(childDir).isDirectory()) {
      // Create/update _category_.json in child directory
      const label = dirNameToLabel(entry);
      writeCategoryJson(childDir, label, position);
    }
    // If entry is a markdown file, sidebar_position should already be in frontmatter
    // from Phase 1 conversion. We check and add if missing.
    else {
      const mdFile = path.join(dir, entry + '.md');
      const mdxFile = path.join(dir, entry + '.mdx');
      const targetFile = fs.existsSync(mdFile) ? mdFile : fs.existsSync(mdxFile) ? mdxFile : null;

      if (targetFile) {
        ensureSidebarPosition(targetFile, position);
      }
    }
  }

  // Delete the _order.yaml file
  fs.unlinkSync(orderFile);
  log(STEP, `Deleted: ${path.relative(DOCS_DIR, orderFile)}`);
}

/**
 * Ensure a markdown file has sidebar_position in its frontmatter.
 * If missing, add it.
 */
function ensureSidebarPosition(filePath: string, position: number): void {
  const content = fs.readFileSync(filePath, 'utf-8');
  // Check if frontmatter exists and has sidebar_position
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!fmMatch) return;

  if (fmMatch[1].includes('sidebar_position:')) {
    // Already has sidebar_position, skip
    return;
  }

  // Add sidebar_position to frontmatter
  const newFm = fmMatch[1] + `\nsidebar_position: ${position}`;
  const newContent = content.replace(/^---\n[\s\S]*?\n---/, `---\n${newFm}\n---`);
  fs.writeFileSync(filePath, newContent, 'utf-8');
  log(STEP, `Added sidebar_position: ${position} to ${path.relative(DOCS_DIR, filePath)}`);
}

/**
 * Recursively walk a directory and process all _order.yaml files.
 * Process bottom-up so child ordering is done before parent.
 */
function walkAndProcessOrderYaml(dir: string): void {
  if (!fs.existsSync(dir)) return;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      walkAndProcessOrderYaml(path.join(dir, entry.name));
    }
  }

  // Process this directory's _order.yaml
  processOrderYaml(dir);
}

/**
 * Create a top-level _category_.json for an instance's subdirectories
 * based on the top-level _order.yaml mapping.
 */
function createTopLevelCategories(instanceDir: string, instanceName: string): void {
  // Read the top-level _order.yaml to determine positions
  const topOrderFile = path.join(DOCS_DIR, '_order.yaml');
  let topOrder: string[] = [];
  if (fs.existsSync(topOrderFile)) {
    topOrder = readOrderYaml(topOrderFile);
  }

  // Map the top-level entries to their normalized folder names
  const topLevelNameToFolder: Record<string, string> = {
    'Introduction': 'introduction',
    '1NCE Portal': '1nce-portal',
    'SIM Cards': 'sim-cards',
    'MCP Server': 'mcp-server',
    'Connectivity Services': 'connectivity-services',
    'Platform Services': 'platform-services',
    'Network Services': 'network-services',
    '1NCE OS': '1nce-os',
    'Troubleshooting': 'troubleshooting',
    'Blueprints & Examples': 'blueprints-examples',
  };

  // Build position map: folder name -> position from top-level order
  const positionMap: Record<string, number> = {};
  for (let i = 0; i < topOrder.length; i++) {
    const folderName = topLevelNameToFolder[topOrder[i]];
    if (folderName) {
      positionMap[folderName] = i + 1;
    }
  }

  // For each subdirectory in the instance, create/update _category_.json with top-level position
  if (!fs.existsSync(instanceDir)) return;

  const subdirs = fs.readdirSync(instanceDir, { withFileTypes: true })
    .filter(e => e.isDirectory())
    .map(e => e.name);

  for (const subdir of subdirs) {
    const subdirPath = path.join(instanceDir, subdir);
    const categoryFile = path.join(subdirPath, '_category_.json');

    // If _category_.json already exists (from child _order.yaml processing), update position from top-level
    if (fs.existsSync(categoryFile)) {
      const existing = JSON.parse(fs.readFileSync(categoryFile, 'utf-8'));
      if (positionMap[subdir] !== undefined) {
        existing.position = positionMap[subdir];
        fs.writeFileSync(categoryFile, JSON.stringify(existing, null, 2) + '\n', 'utf-8');
        log(STEP, `Updated top-level position for ${subdir}: ${positionMap[subdir]}`);
      }
    } else if (positionMap[subdir] !== undefined) {
      // Create new _category_.json
      const label = dirNameToLabel(subdir);
      writeCategoryJson(subdirPath, label, positionMap[subdir]);
    }
  }
}

// --- Main execution ---

function main(): void {
  log(STEP, 'Starting content reorganization...');

  const projectRoot = path.resolve(__dirname, '..');

  // 1. Create target directories and move content
  for (const [instanceName, config] of Object.entries(FOLDER_MOVES)) {
    const targetDir = path.resolve(projectRoot, config.target);
    fs.mkdirSync(targetDir, { recursive: true });
    log(STEP, `Created target directory: ${config.target}`);

    // Move folders
    for (const folder of config.folders) {
      const src = path.join(DOCS_DIR, folder);
      const dest = path.join(targetDir, folder);
      if (fs.existsSync(src)) {
        moveDir(src, dest);
      } else {
        warn(STEP, `Source folder not found: ${folder}`);
      }
    }

    // Move files
    for (const file of config.files) {
      const src = path.join(DOCS_DIR, file);
      const dest = path.join(targetDir, file);
      if (fs.existsSync(src)) {
        moveFile(src, dest);
      } else {
        warn(STEP, `Source file not found: ${file}`);
      }
    }
  }

  // 2. Convert _order.yaml files to _category_.json (walk each instance directory)
  log(STEP, 'Converting _order.yaml files to _category_.json...');

  const projectRootPath = path.resolve(__dirname, '..');
  for (const [instanceName, config] of Object.entries(FOLDER_MOVES)) {
    const targetDir = path.resolve(projectRootPath, config.target);
    walkAndProcessOrderYaml(targetDir);
  }

  // 3. Create top-level categories based on top-level _order.yaml
  log(STEP, 'Setting top-level category positions from _order.yaml...');
  for (const [instanceName, config] of Object.entries(FOLDER_MOVES)) {
    const targetDir = path.resolve(projectRootPath, config.target);
    createTopLevelCategories(targetDir, instanceName);
  }

  // 4. Clean up top-level _order.yaml (it is not used by Docusaurus)
  const topOrderFile = path.join(DOCS_DIR, '_order.yaml');
  if (fs.existsSync(topOrderFile)) {
    fs.unlinkSync(topOrderFile);
    log(STEP, 'Deleted top-level docs/_order.yaml');
  }

  // 5. Update the welcome page slug since routeBasePath changes from / to /docs
  const welcomeFile = path.join(DOCS_DIR, 'documentation', 'introduction', 'introduction-welcome.md');
  if (fs.existsSync(welcomeFile)) {
    let content = fs.readFileSync(welcomeFile, 'utf-8');
    // Change slug: / to slug: /docs (since routeBasePath will be /docs)
    // Actually, with routeBasePath: '/docs', slug: '/' means it will serve at /docs/
    // which is correct -- the welcome page should be the root of the Documentation tab.
    // So we keep slug: / which will resolve to /docs/ under the new routeBasePath.
    log(STEP, 'Welcome page slug: / will resolve to /docs/ with new routeBasePath');
  }

  // Summary
  success(STEP, 'Content reorganization complete!');
  log(STEP, 'Instance directories: docs/documentation, docs/platform, docs/blueprints, docs/terms');
  log(STEP, 'docs/reference/ left in place for API Explorer (Plan 03)');
}

main();
