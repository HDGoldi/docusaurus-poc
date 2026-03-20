/**
 * Script 04: Download remote images from files.readme.io.
 *
 * Scans all .md files for files.readme.io URLs, downloads each image
 * to static/img/, and replaces the URL with a local /img/ path.
 *
 * Image output path mirrors the doc hierarchy per D-06:
 *   docs/1nce-os/device-controller.md -> static/img/1nce-os/device-controller/filename.png
 *
 * Features:
 * - 3 retry attempts with 1s, 2s, 4s exponential backoff (pitfall 4)
 * - Follow up to 3 redirects
 * - 10 second timeout per request
 * - Non-fatal failures: logs warning, does not crash pipeline
 */
import * as fs from 'node:fs';
import * as https from 'node:https';
import * as http from 'node:http';
import * as path from 'node:path';
import { readMarkdownFiles, readFile, writeFile, ensureDir } from './utils/file-utils';
import { log, warn, error, success } from './utils/logger';

const STEP = '04-download-images';
const DOCS_DIR = path.resolve(__dirname, '..', 'docs');
const STATIC_IMG_DIR = path.resolve(__dirname, '..', 'static', 'img');

// Match files.readme.io URLs — greedy up to whitespace, quote, or paren
const README_URL_REGEX = /https:\/\/files\.readme\.io\/[^\s)"'<>]+/g;

const MAX_RETRIES = 3;
const BACKOFF_MS = [1000, 2000, 4000];
const TIMEOUT_MS = 10000;
const MAX_REDIRECTS = 3;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function downloadFile(
  url: string,
  dest: string,
  redirectCount = 0
): Promise<void> {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const req = protocol.get(url, { timeout: TIMEOUT_MS }, (res) => {
      // Handle redirects
      if (
        res.statusCode &&
        res.statusCode >= 300 &&
        res.statusCode < 400 &&
        res.headers.location
      ) {
        if (redirectCount >= MAX_REDIRECTS) {
          reject(new Error(`Too many redirects for ${url}`));
          return;
        }
        downloadFile(res.headers.location, dest, redirectCount + 1)
          .then(resolve)
          .catch(reject);
        return;
      }

      if (!res.statusCode || res.statusCode >= 400) {
        reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        res.resume(); // Drain response
        return;
      }

      const dir = path.dirname(dest);
      ensureDir(dir);

      const fileStream = fs.createWriteStream(dest);
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        resolve();
      });
      fileStream.on('error', (err) => {
        fs.unlink(dest, () => {}); // Clean up partial file
        reject(err);
      });
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error(`Timeout for ${url}`));
    });

    req.on('error', (err) => {
      reject(err);
    });
  });
}

async function downloadWithRetry(
  url: string,
  dest: string
): Promise<boolean> {
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      await downloadFile(url, dest);
      return true;
    } catch (err) {
      if (attempt < MAX_RETRIES - 1) {
        const waitMs = BACKOFF_MS[attempt];
        warn(STEP, `  Retry ${attempt + 1} for ${url} (waiting ${waitMs}ms)`);
        await sleep(waitMs);
      } else {
        error(STEP, `  Failed after ${MAX_RETRIES} attempts: ${url} - ${err}`);
      }
    }
  }
  return false;
}

async function downloadImages(): Promise<void> {
  const files = readMarkdownFiles(DOCS_DIR);
  let totalFound = 0;
  let totalDownloaded = 0;
  let totalFailed = 0;
  const failedUrls: string[] = [];

  // Track already-downloaded URLs to avoid duplicates
  const downloadedMap = new Map<string, string>(); // url -> local relative path

  log(STEP, `Scanning ${files.length} markdown files for files.readme.io URLs...`);

  for (const relFile of files) {
    const fullPath = path.join(DOCS_DIR, relFile);
    let content = readFile(fullPath);

    // Compute the image output directory from the doc's relative path
    const docRelDir = relFile.replace(/\.md$/, '').replace(/\/index$/, '');
    const imgOutDir = path.join(STATIC_IMG_DIR, docRelDir);

    // Find all readme.io URLs in this file
    README_URL_REGEX.lastIndex = 0;
    const urls = new Set<string>();
    let match: RegExpExecArray | null;

    while ((match = README_URL_REGEX.exec(content)) !== null) {
      urls.add(match[0]);
    }

    if (urls.size === 0) continue;

    totalFound += urls.size;
    log(STEP, `  ${relFile}: found ${urls.size} remote image URL(s)`);

    let modified = false;

    for (const url of urls) {
      // Extract filename from URL
      const urlPath = new URL(url).pathname;
      let filename = path.basename(urlPath);

      // Clean filename: remove query params if somehow present
      filename = filename.split('?')[0];

      // If filename has no extension, try to infer from URL or default to .png
      if (!path.extname(filename)) {
        filename += '.png';
      }

      const outPath = path.join(imgOutDir, filename);
      const imgRelPath = `/img/${docRelDir}/${filename}`;

      // Check if already downloaded (same URL in different files)
      if (downloadedMap.has(url)) {
        // URL already downloaded, but to a different location. Copy the file.
        const existingPath = downloadedMap.get(url)!;
        const existingFullPath = path.join(STATIC_IMG_DIR, existingPath.replace(/^\/img\//, ''));
        if (existingFullPath !== outPath) {
          ensureDir(imgOutDir);
          try {
            fs.copyFileSync(existingFullPath, outPath);
          } catch {
            // If copy fails, download fresh
            const ok = await downloadWithRetry(url, outPath);
            if (!ok) {
              totalFailed++;
              failedUrls.push(url);
              continue;
            }
          }
        }
        content = content.split(url).join(imgRelPath);
        modified = true;
        totalDownloaded++;
        continue;
      }

      // Download the image
      const ok = await downloadWithRetry(url, outPath);
      if (ok) {
        // Verify non-zero file
        const stat = fs.statSync(outPath);
        if (stat.size === 0) {
          warn(STEP, `    0-byte download: ${url}`);
          fs.unlinkSync(outPath);
          totalFailed++;
          failedUrls.push(url);
          continue;
        }

        downloadedMap.set(url, imgRelPath);
        content = content.split(url).join(imgRelPath);
        modified = true;
        totalDownloaded++;
      } else {
        totalFailed++;
        failedUrls.push(url);
      }
    }

    if (modified) {
      writeFile(fullPath, content);
    }
  }

  log(STEP, '');
  log(STEP, '=== Summary ===');
  log(STEP, `Total remote image URLs found: ${totalFound}`);
  success(STEP, `Downloaded: ${totalDownloaded}`);
  if (totalFailed > 0) {
    warn(STEP, `Failed: ${totalFailed}`);
    warn(STEP, 'Failed URLs:');
    for (const url of failedUrls) {
      warn(STEP, `  - ${url}`);
    }
  }
}

downloadImages().catch((err) => {
  error(STEP, `Fatal error: ${err}`);
  process.exit(1);
});
