/**
 * Script 03: Extract base64-encoded images from docs/ files.
 *
 * Scans all .md files for data:image URIs, decodes them to binary files
 * in static/img/, and replaces the data URI with a local /img/ path.
 *
 * Image output path mirrors the doc hierarchy per D-06:
 *   docs/1nce-os/device-controller.md -> static/img/1nce-os/device-controller/001.png
 */
import * as fs from 'node:fs';
import * as path from 'node:path';
import { readMarkdownFiles, readFile, writeFile, ensureDir } from './utils/file-utils';
import { log, warn, error, success } from './utils/logger';

const STEP = '03-extract-base64';
const DOCS_DIR = path.resolve(__dirname, '..', 'docs');
const STATIC_IMG_DIR = path.resolve(__dirname, '..', 'static', 'img');

// Match data:image URIs — supports png, jpeg, jpg, gif, svg+xml
// The base64 content can span across the rest of the attribute value
const DATA_URI_REGEX = /data:image\/(png|jpe?g|gif|svg\+xml);base64,([A-Za-z0-9+/=\s]+)/g;

function mimeToExt(mime: string): string {
  switch (mime) {
    case 'jpeg':
    case 'jpg':
      return 'jpg';
    case 'svg+xml':
      return 'svg';
    default:
      return mime; // png, gif
  }
}

function extractBase64Images(): void {
  const files = readMarkdownFiles(DOCS_DIR);
  let totalFound = 0;
  let totalExtracted = 0;
  let totalFailed = 0;

  log(STEP, `Scanning ${files.length} markdown files for base64 images...`);

  for (const relFile of files) {
    const fullPath = path.join(DOCS_DIR, relFile);
    let content = readFile(fullPath);

    // Compute the image output directory from the doc's relative path
    // e.g. "1nce-os/device-controller.md" -> "1nce-os/device-controller"
    const docRelDir = relFile.replace(/\.md$/, '').replace(/\/index$/, '');
    const imgOutDir = path.join(STATIC_IMG_DIR, docRelDir);

    let fileImageIndex = 0;
    let modified = false;

    // Reset regex lastIndex
    DATA_URI_REGEX.lastIndex = 0;
    let match: RegExpExecArray | null;

    // Collect all matches first (to avoid modifying string while iterating)
    const matches: Array<{
      fullMatch: string;
      mime: string;
      base64: string;
    }> = [];

    while ((match = DATA_URI_REGEX.exec(content)) !== null) {
      matches.push({
        fullMatch: match[0],
        mime: match[1],
        base64: match[2],
      });
    }

    if (matches.length === 0) continue;

    totalFound += matches.length;
    log(STEP, `  ${relFile}: found ${matches.length} base64 image(s)`);

    for (const m of matches) {
      fileImageIndex++;
      const ext = mimeToExt(m.mime);
      const filename = `${String(fileImageIndex).padStart(3, '0')}.${ext}`;
      const outPath = path.join(imgOutDir, filename);
      const imgRelPath = `/img/${docRelDir}/${filename}`;

      try {
        // Strip all whitespace from the base64 string (pitfall 3)
        const cleanBase64 = m.base64.replace(/\s/g, '');
        const buffer = Buffer.from(cleanBase64, 'base64');

        // Verify non-zero length
        if (buffer.length === 0) {
          warn(STEP, `    0-byte image skipped: ${imgRelPath}`);
          totalFailed++;
          continue;
        }

        ensureDir(imgOutDir);
        fs.writeFileSync(outPath, buffer);

        // Replace the data URI in the content with the local path
        content = content.replace(m.fullMatch, imgRelPath);
        modified = true;
        totalExtracted++;
      } catch (err) {
        error(STEP, `    Failed to extract ${imgRelPath}: ${err}`);
        totalFailed++;
      }
    }

    if (modified) {
      writeFile(fullPath, content);
    }
  }

  log(STEP, '');
  log(STEP, '=== Summary ===');
  log(STEP, `Total base64 images found: ${totalFound}`);
  success(STEP, `Extracted: ${totalExtracted}`);
  if (totalFailed > 0) {
    warn(STEP, `Failed: ${totalFailed}`);
  }
}

extractBase64Images();
