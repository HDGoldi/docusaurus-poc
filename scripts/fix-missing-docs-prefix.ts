/**
 * Fix broken internal links across all markdown files.
 *
 * Categories fixed:
 *   A) Missing /docs/ prefix on section paths (56 links)
 *   B) Unresolved doc: references (7 links)
 *   C) Hardcoded cross-page relative links (7 links)
 *   D) Malformed URLs (3 links)
 *   E) Misc fixes (2 links)
 *
 * Idempotent: safe to re-run.
 */

import * as fs from 'fs';
import * as path from 'path';
import { globSync } from 'glob';

const DOCS_DIR = path.resolve(__dirname, '..', 'docs');
let totalReplacements = 0;
let filesModified = 0;

function replaceInFile(filePath: string, search: string | RegExp, replace: string): number {
  const content = fs.readFileSync(filePath, 'utf-8');
  const newContent = content.replace(search, replace);
  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, 'utf-8');
    // Count replacements
    if (typeof search === 'string') {
      return content.split(search).length - 1;
    }
    const matches = content.match(search);
    return matches ? matches.length : 0;
  }
  return 0;
}

// ===== Category A: Missing /docs/ prefix =====
console.log('\n=== Category A: Missing /docs/ prefix ===');

const mdFiles = globSync('**/*.md', { cwd: DOCS_DIR, absolute: true });

const sections = [
  '1nce-os',
  'network-services',
  'platform-services',
  '1nce-portal',
  'blueprints-examples',
  'sim-cards',
  'connectivity-services',
];

let catACount = 0;
const catAFiles = new Set<string>();

for (const file of mdFiles) {
  let content = fs.readFileSync(file, 'utf-8');
  const original = content;

  for (const section of sections) {
    // Markdown links: ](/section/... -> ](/docs/section/...
    // Must NOT already have /docs/ prefix
    const mdLinkPattern = new RegExp(`\\]\\(/${section}/`, 'g');
    content = content.replace(mdLinkPattern, `](/docs/${section}/`);

    // HTML href: href="/section/... -> href="/docs/section/...
    const hrefPattern = new RegExp(`href="/${section}/`, 'g');
    content = content.replace(hrefPattern, `href="/docs/${section}/`);
  }

  // Root-level paths that need mapping to blueprints-examples
  // examples-data-streamer
  content = content.replace(/\]\(\/(examples-data-streamer)/g, '](/docs/blueprints-examples/$1');
  // examples-sms but NOT examples-sms-forwarder
  content = content.replace(/\]\(\/examples-sms(?!-forwarder)/g, '](/docs/blueprints-examples/examples-sms');
  // examples-sms-forwarder
  content = content.replace(/\]\(\/examples-sms-forwarder/g, '](/docs/blueprints-examples/examples-sms-forwarder');
  // examples-vpn
  content = content.replace(/\]\(\/examples-vpn/g, '](/docs/blueprints-examples/examples-vpn');
  // recipes
  content = content.replace(/\]\(\/recipes/g, '](/docs/blueprints-examples/recipes');

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf-8');
    const rel = path.relative(DOCS_DIR, file);
    catAFiles.add(rel);
    // Rough count of changes
    const diffLines = original.split('\n').filter((line, i) => line !== content.split('\n')[i]).length;
    catACount += diffLines;
  }
}

console.log(`  Fixed ${catACount} lines in ${catAFiles.size} files`);
totalReplacements += catACount;
filesModified += catAFiles.size;

// ===== Category B: Unresolved doc: references =====
console.log('\n=== Category B: Unresolved doc: references ===');

const catBFixes: Array<{ file: string; search: string | RegExp; replace: string; desc: string }> = [
  {
    file: 'documentation/1nce-os/1nce-os-energy-saver/energy-saver-binary-conversion-language.md',
    search: '/unresolved/doc:data-broker-udp',
    replace: '/docs/1nce-os/1nce-os-device-integrator/device-integrator-udp/',
    desc: 'data-broker-udp -> device-integrator-udp',
  },
  {
    file: 'documentation/1nce-os/1nce-os-lwm2m/lwm2m-features-limitations.md',
    search: '/unresolved/doc:device-integrator-activate-endpoints',
    replace: '/docs/1nce-os/1nce-os-device-integrator/',
    desc: 'device-integrator-activate-endpoints -> device-integrator index',
  },
  {
    file: 'documentation/1nce-os/1nce-os-device-locator/index.md',
    search: '/unresolved/doc:evice-locator-geofencing-guide',
    replace: '/docs/1nce-os/1nce-os-device-locator/device-locator-geofencing-guide/',
    desc: 'evice-locator-geofencing-guide -> device-locator-geofencing-guide',
  },
  {
    file: 'documentation/1nce-portal/portal-configuration.md',
    search: '/unresolved/doc:streamer-setup',
    replace: '/docs/platform-services/platform-services-data-streamer/data-streamer-setup-guides/',
    desc: 'streamer-setup -> data-streamer-setup-guides',
  },
  {
    file: 'documentation/1nce-portal/portal-configuration.md',
    search: '/unresolved/doc:sms-services-sms-forwarding-service',
    replace: '/docs/platform-services/platform-services-sms-forwarder/',
    desc: 'sms-services-sms-forwarding-service -> platform-services-sms-forwarder',
  },
  {
    file: 'documentation/connectivity-services/connectivity-services-sms-services/sms-services-features-limitations.md',
    search: 'href="doc:portal-sims-sms"',
    replace: 'href="/docs/1nce-portal/portal-sims-sms/"',
    desc: 'doc:portal-sims-sms -> absolute href',
  },
  {
    file: 'documentation/connectivity-services/connectivity-services-sms-services/sms-services-features-limitations.md',
    search: 'href="doc:platform-services-sms-forwarder"',
    replace: 'href="/docs/platform-services/platform-services-sms-forwarder/"',
    desc: 'doc:platform-services-sms-forwarder -> absolute href',
  },
];

for (const fix of catBFixes) {
  const fullPath = path.join(DOCS_DIR, fix.file);
  if (!fs.existsSync(fullPath)) {
    console.log(`  SKIP (file not found): ${fix.file}`);
    continue;
  }
  const count = replaceInFile(fullPath, fix.search, fix.replace);
  console.log(`  ${count > 0 ? 'FIXED' : 'SKIP (already fixed)'}: ${fix.desc} in ${fix.file}`);
  totalReplacements += count;
  if (count > 0) filesModified++;
}

// ===== Category C: Hardcoded cross-page relative links =====
console.log('\n=== Category C: Hardcoded cross-page relative links ===');

const catCFixes: Array<{ file: string; search: string; replace: string; desc: string }> = [
  {
    file: 'documentation/blueprints-examples/examples-sms/examples-mo-sms.md',
    search: 'href="examples-hardware-guides"',
    replace: 'href="/docs/blueprints-examples/examples-hardware-guides/"',
    desc: 'examples-hardware-guides relative -> absolute',
  },
  {
    file: 'documentation/blueprints-examples/examples-sms/examples-mt-sms.md',
    search: 'href="examples-hardware-guides"',
    replace: 'href="/docs/blueprints-examples/examples-hardware-guides/"',
    desc: 'examples-hardware-guides relative -> absolute',
  },
  {
    file: 'documentation/blueprints-examples/examples-sms/index.md',
    search: 'href="examples-sms-forwarder"',
    replace: 'href="/docs/blueprints-examples/examples-sms-forwarder/"',
    desc: 'examples-sms-forwarder relative -> absolute',
  },
  {
    file: 'documentation/connectivity-services/connectivity-services-sms-services/sms-services-features-limitations.md',
    search: 'href="portal-sims-sms"',
    replace: 'href="/docs/1nce-portal/portal-sims-sms/"',
    desc: 'portal-sims-sms relative -> absolute',
  },
  {
    file: 'documentation/platform-services/platform-services-sms-forwarder/sms-forwarder-features-limitations.md',
    search: 'href="examples-sms-forwarder"',
    replace: 'href="/docs/blueprints-examples/examples-sms-forwarder/"',
    desc: 'examples-sms-forwarder relative -> absolute',
  },
  {
    file: 'documentation/platform-services/platform-services-sms-forwarder/sms-forwarder-error-states.md',
    search: 'href="examples-sms-forwarder-testing"',
    replace: 'href="/docs/blueprints-examples/examples-sms-forwarder/examples-sms-forwarder-testing/"',
    desc: 'examples-sms-forwarder-testing relative -> absolute',
  },
];

for (const fix of catCFixes) {
  const fullPath = path.join(DOCS_DIR, fix.file);
  if (!fs.existsSync(fullPath)) {
    console.log(`  SKIP (file not found): ${fix.file}`);
    continue;
  }
  const count = replaceInFile(fullPath, fix.search, fix.replace);
  console.log(`  ${count > 0 ? 'FIXED' : 'SKIP (already fixed)'}: ${fix.desc}`);
  totalReplacements += count;
  if (count > 0) filesModified++;
}

// Category C item 7: sms-services-mo-sms.md has two markdown links with /index suffix
const moSmsFile = path.join(DOCS_DIR, 'documentation/connectivity-services/connectivity-services-sms-services/sms-services-mo-sms.md');
if (fs.existsSync(moSmsFile)) {
  let content = fs.readFileSync(moSmsFile, 'utf-8');
  const original = content;
  // Fix /platform-services/platform-services-sms-forwarder/index -> /docs/platform-services/platform-services-sms-forwarder/
  content = content.replace(
    /\(\/docs\/platform-services\/platform-services-sms-forwarder\/index\)/g,
    '(/docs/platform-services/platform-services-sms-forwarder/)'
  );
  // Also handle if it was without /docs/ prefix (Category A may have already added it)
  content = content.replace(
    /\(\/platform-services\/platform-services-sms-forwarder\/index\)/g,
    '(/docs/platform-services/platform-services-sms-forwarder/)'
  );
  // Fix /blueprints-examples/examples-sms-forwarder/index -> /docs/blueprints-examples/examples-sms-forwarder/
  content = content.replace(
    /\(\/docs\/blueprints-examples\/examples-sms-forwarder\/index\)/g,
    '(/docs/blueprints-examples/examples-sms-forwarder/)'
  );
  content = content.replace(
    /\(\/blueprints-examples\/examples-sms-forwarder\/index\)/g,
    '(/docs/blueprints-examples/examples-sms-forwarder/)'
  );
  if (content !== original) {
    fs.writeFileSync(moSmsFile, content, 'utf-8');
    console.log('  FIXED: sms-services-mo-sms.md /index suffix links');
    totalReplacements += 2;
    filesModified++;
  } else {
    console.log('  SKIP (already fixed): sms-services-mo-sms.md /index suffix links');
  }
}

// ===== Category D: Malformed URLs =====
console.log('\n=== Category D: Malformed URLs ===');

// D1: sim-euicc-knowledge.md — angle brackets in href
const euiccFile = path.join(DOCS_DIR, 'documentation/sim-cards/sim-euicc-knowledge.md');
if (fs.existsSync(euiccFile)) {
  const count = replaceInFile(
    euiccFile,
    'href="<https://www.1nce.com/en-eu/support/contact>"',
    'href="https://www.1nce.com/en-eu/support/contact"'
  );
  console.log(`  ${count > 0 ? 'FIXED' : 'SKIP'}: sim-euicc-knowledge.md angle brackets`);
  totalReplacements += count;
  if (count > 0) filesModified++;
}

// D2: examples-data-streamer-http.md — backtick-wrapped URLs in link syntax
const dataStreamerHttpFile = path.join(DOCS_DIR, 'documentation/blueprints-examples/examples-data-streamer/examples-data-streamer-http.md');
if (fs.existsSync(dataStreamerHttpFile)) {
  let content = fs.readFileSync(dataStreamerHttpFile, 'utf-8');
  const original = content;
  // Fix the malformed backtick-wrapped link syntax for server-ip:port pattern
  // Handles both escaped (\<\<) and unescaped (<<) angle brackets
  content = content.replace(
    /\[\\?<\\?<`+https:\/\/"server-ip":"port"\/"endpoint"\/`+>>]\(`+https:\/\/"server-ip":"port"\/"endpoint"\/`+\)/g,
    '`https://"server-ip":"port"/"endpoint"/`'
  );
  // Fix the server-domain variant
  content = content.replace(
    /\[\\?<\\?<`+https:\/\/"server-domain"(?::"port")?\/"endpoint"\/`+>>]\(`+https:\/\/"server-domain"(?::"port")?\/"endpoint"\/`+\)/g,
    '`https://"server-domain":"port"/"endpoint"/`'
  );
  if (content !== original) {
    fs.writeFileSync(dataStreamerHttpFile, content, 'utf-8');
    console.log('  FIXED: examples-data-streamer-http.md malformed URL links');
    totalReplacements += 2;
    filesModified++;
  } else {
    console.log('  SKIP (already fixed): examples-data-streamer-http.md');
  }
}

// ===== Category E: Misc fixes =====
console.log('\n=== Category E: Misc fixes ===');

// E1: docs/api/index.md — /dev-hub/openapi -> /api/
const apiIndexFile = path.join(DOCS_DIR, 'api/index.md');
if (fs.existsSync(apiIndexFile)) {
  const count = replaceInFile(
    apiIndexFile,
    'https://help.1nce.com/dev-hub/openapi',
    '/api/'
  );
  console.log(`  ${count > 0 ? 'FIXED' : 'SKIP'}: api/index.md dev-hub/openapi`);
  totalReplacements += count;
  if (count > 0) filesModified++;
}

// E2: examples-overview.md — /examples-sms-forwarder -> /docs/blueprints-examples/examples-sms-forwarder/
const overviewFile = path.join(DOCS_DIR, 'documentation/blueprints-examples/examples-overview.md');
if (fs.existsSync(overviewFile)) {
  let content = fs.readFileSync(overviewFile, 'utf-8');
  const original = content;
  // Fix the link in frontmatter or body: link: "/examples-sms-forwarder"
  content = content.replace(
    /link:\s*"\/examples-sms-forwarder"/g,
    'link: "/docs/blueprints-examples/examples-sms-forwarder/"'
  );
  if (content !== original) {
    fs.writeFileSync(overviewFile, content, 'utf-8');
    console.log('  FIXED: examples-overview.md /examples-sms-forwarder link');
    totalReplacements += 1;
    filesModified++;
  } else {
    console.log('  SKIP (already fixed): examples-overview.md');
  }
}

// ===== Summary =====
console.log('\n=== Summary ===');
console.log(`Total replacements: ~${totalReplacements}`);
console.log(`Files modified: ${filesModified}`);
console.log('\nDone.');
