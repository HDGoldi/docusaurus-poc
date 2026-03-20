/**
 * Script 01: Copy and Normalize
 *
 * Copies the ReadMe export content to docs/ with normalized folder names.
 * - Lowercase, hyphens instead of spaces, ampersand removed
 * - Recipes merged under blueprints-examples
 * - custom_pages/terms-abbreviations.md copied to docs root
 * - AI support agent HTML files skipped
 * - Reference markdown files (not JSON specs) copied to docs/reference/
 * - _order.yaml files preserved
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { log, warn, success } from './utils/logger.js';

const STEP = '01-copy-normalize';
const EXPORT_DIR = path.resolve(__dirname, '../dev-hub-v2.6-2026-03-20T20-39-14_8a4df1b');
const DOCS_DIR = path.resolve(__dirname, '../docs');

// Files to skip
const SKIP_FILES = new Set([
  'ai-support-agent.html',
  'ai-support-agent-brazil.html',
]);

let totalFilesCopied = 0;
let totalFoldersCreated = 0;
let totalFilesSkipped = 0;

/**
 * Normalize a folder name: lowercase, replace spaces with hyphens, remove ampersand.
 */
function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s*&\s*/g, '-')  // "Blueprints & Examples" -> "blueprints-examples"
    .replace(/\s+/g, '-')       // spaces to hyphens
    .replace(/-{2,}/g, '-')     // collapse multiple hyphens
    .replace(/^-|-$/g, '');      // trim leading/trailing hyphens
}

/**
 * Recursively copy a directory, normalizing folder names.
 * Files are copied as-is; only directory names are normalized.
 */
function copyDirNormalized(srcDir: string, destDir: string): void {
  if (!fs.existsSync(srcDir)) {
    warn(STEP, `Source directory does not exist: ${srcDir}`);
    return;
  }

  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
    totalFoldersCreated++;
  }

  const entries = fs.readdirSync(srcDir, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);

    if (entry.isDirectory()) {
      const normalizedName = normalizeName(entry.name);
      const destPath = path.join(destDir, normalizedName);
      if (!fs.existsSync(destPath)) {
        fs.mkdirSync(destPath, { recursive: true });
        totalFoldersCreated++;
      }
      copyDirNormalized(srcPath, destPath);
    } else {
      // Skip specified files
      if (SKIP_FILES.has(entry.name)) {
        totalFilesSkipped++;
        log(STEP, `Skipped: ${entry.name}`);
        continue;
      }

      const destPath = path.join(destDir, entry.name);
      fs.copyFileSync(srcPath, destPath);
      totalFilesCopied++;
    }
  }
}

/**
 * Copy reference markdown files only (not JSON specs).
 */
function copyReferenceMarkdown(srcDir: string, destDir: string): void {
  if (!fs.existsSync(srcDir)) {
    warn(STEP, `Reference directory does not exist: ${srcDir}`);
    return;
  }

  const entries = fs.readdirSync(srcDir, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);

    if (entry.isDirectory()) {
      const normalizedName = normalizeName(entry.name);
      const destPath = path.join(destDir, normalizedName);
      if (!fs.existsSync(destPath)) {
        fs.mkdirSync(destPath, { recursive: true });
        totalFoldersCreated++;
      }
      copyReferenceMarkdown(srcPath, destPath);
    } else {
      // Only copy .md and .yaml files, skip .json (OpenAPI specs)
      const ext = path.extname(entry.name).toLowerCase();
      if (ext === '.md' || ext === '.yaml') {
        const destPath = path.join(destDir, entry.name);
        fs.copyFileSync(srcPath, destPath);
        totalFilesCopied++;
      } else {
        log(STEP, `Skipped non-markdown reference file: ${entry.name}`);
        totalFilesSkipped++;
      }
    }
  }
}

export function copyAndNormalize(): void {
  log(STEP, 'Starting copy and normalize...');

  // 1. Clear docs/ directory (idempotent)
  if (fs.existsSync(DOCS_DIR)) {
    fs.rmSync(DOCS_DIR, { recursive: true, force: true });
    log(STEP, 'Cleared existing docs/ directory');
  }
  fs.mkdirSync(DOCS_DIR, { recursive: true });

  // 2. Copy docs/ content with normalized folder names
  const exportDocsDir = path.join(EXPORT_DIR, 'docs');
  log(STEP, `Copying docs from: ${exportDocsDir}`);
  copyDirNormalized(exportDocsDir, DOCS_DIR);

  // 3. Copy recipes/ content into docs/blueprints-examples/ (D-10)
  const exportRecipesDir = path.join(EXPORT_DIR, 'recipes');
  const blueprintsExamplesDir = path.join(DOCS_DIR, 'blueprints-examples');
  log(STEP, `Merging recipes into: ${blueprintsExamplesDir}`);
  copyDirNormalized(exportRecipesDir, blueprintsExamplesDir);

  // 4. Copy custom_pages/terms-abbreviations.md to docs/ (D-13)
  const termsSource = path.join(EXPORT_DIR, 'custom_pages', 'terms-abbreviations.md');
  const termsDest = path.join(DOCS_DIR, 'terms-abbreviations.md');
  if (fs.existsSync(termsSource)) {
    fs.copyFileSync(termsSource, termsDest);
    totalFilesCopied++;
    log(STEP, 'Copied terms-abbreviations.md to docs/');
  } else {
    warn(STEP, 'terms-abbreviations.md not found in custom_pages/');
  }

  // 5. Copy custom_pages hardware guide markdown files (not HTML)
  const customPagesDir = path.join(EXPORT_DIR, 'custom_pages');
  if (fs.existsSync(customPagesDir)) {
    const customEntries = fs.readdirSync(customPagesDir, { withFileTypes: true });
    for (const entry of customEntries) {
      if (entry.isFile() && entry.name.endsWith('.md') && entry.name !== 'terms-abbreviations.md') {
        // Copy other .md custom pages (like hardware guide pages) to docs root
        const srcPath = path.join(customPagesDir, entry.name);
        const destPath = path.join(DOCS_DIR, entry.name);
        if (!fs.existsSync(destPath)) {
          fs.copyFileSync(srcPath, destPath);
          totalFilesCopied++;
          log(STEP, `Copied custom page: ${entry.name}`);
        }
      } else if (entry.isFile() && SKIP_FILES.has(entry.name)) {
        totalFilesSkipped++;
        log(STEP, `Skipped: ${entry.name}`);
      }
    }
  }

  // 6. Copy reference/ markdown files (not JSON specs) to docs/reference/ (D-03)
  const exportReferenceDir = path.join(EXPORT_DIR, 'reference');
  const docsReferenceDir = path.join(DOCS_DIR, 'reference');
  log(STEP, `Copying reference markdown to: ${docsReferenceDir}`);
  copyReferenceMarkdown(exportReferenceDir, docsReferenceDir);

  // 7. Copy top-level _order.yaml
  const topOrderYaml = path.join(EXPORT_DIR, '_order.yaml');
  if (fs.existsSync(topOrderYaml)) {
    fs.copyFileSync(topOrderYaml, path.join(DOCS_DIR, '_order.yaml'));
    totalFilesCopied++;
    log(STEP, 'Copied top-level _order.yaml');
  }

  success(STEP, `Complete! Files copied: ${totalFilesCopied}, Folders created: ${totalFoldersCreated}, Files skipped: ${totalFilesSkipped}`);
}

// Run if executed directly
copyAndNormalize();
