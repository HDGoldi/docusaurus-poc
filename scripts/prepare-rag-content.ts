/**
 * RAG Content Preprocessing Script
 *
 * Converts MDX docs and OpenAPI specs into pre-chunked plain text
 * with Bedrock-compatible metadata sidecar files.
 *
 * Output: .rag-content/chunks/ directory
 * Usage: npx tsx scripts/prepare-rag-content.ts
 */

import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from 'fs';
import { join, basename, relative } from 'path';
import { glob } from 'glob';
import { stripMdx } from './prepare-rag-content/strip-mdx';
import { chunkByHeadings } from './prepare-rag-content/chunk-by-headings';
import { extractEndpoints } from './prepare-rag-content/extract-openapi';
import {
  generateMetadata,
  deriveBreadcrumb,
  deriveContentType,
  deriveUrl,
} from './prepare-rag-content/generate-metadata';

const OUTPUT_DIR = '.rag-content';
const CHUNKS_DIR = join(OUTPUT_DIR, 'chunks');

async function main() {
  console.log('=== RAG Content Preprocessing ===\n');

  // Clean output directory
  if (existsSync(OUTPUT_DIR)) {
    rmSync(OUTPUT_DIR, { recursive: true });
  }
  mkdirSync(CHUNKS_DIR, { recursive: true });

  let docChunks = 0;
  let apiChunks = 0;
  let docsProcessed = 0;
  let specsProcessed = 0;
  let skippedApiMdx = 0;

  // 1. Discover and process doc files
  const docFiles = await glob('docs/**/*.{md,mdx}');
  console.log(`Found ${docFiles.length} doc files`);

  for (const filePath of docFiles) {
    // Skip generated API MDX files (mostly JSX/base64, not useful text)
    if (filePath.startsWith('docs/api/')) {
      skippedApiMdx++;
      continue;
    }

    try {
      const content = readFileSync(filePath, 'utf-8');
      const { frontmatter, plainMarkdown } = await stripMdx(content);

      // Derive doc ID from file path
      const docId = filePath
        .replace(/\.(mdx?|md)$/, '')
        .replace(/\//g, '-')
        .replace(/[^a-z0-9-]/gi, '-')
        .toLowerCase();

      const chunks = chunkByHeadings(plainMarkdown, docId);
      const title = frontmatter.title || basename(filePath, '.md').replace(/-/g, ' ');
      const category = filePath.split('/')[1] || 'unknown'; // first dir under docs/

      for (const chunk of chunks) {
        const metadata = generateMetadata({
          url: deriveUrl(filePath),
          title,
          breadcrumb: deriveBreadcrumb(filePath, title),
          contentType: deriveContentType(filePath),
          category,
          sectionHeading: chunk.heading,
        });

        const chunkPath = join(CHUNKS_DIR, `${chunk.id}.txt`);
        const metaPath = join(CHUNKS_DIR, `${chunk.id}.txt.metadata.json`);

        writeFileSync(chunkPath, chunk.content, 'utf-8');
        writeFileSync(metaPath, JSON.stringify(metadata, null, 2), 'utf-8');
        docChunks++;
      }

      docsProcessed++;
    } catch (err) {
      console.error(`  WARNING: Failed to process ${filePath}: ${(err as Error).message}`);
    }
  }

  console.log(`Processed ${docsProcessed} docs -> ${docChunks} chunks (skipped ${skippedApiMdx} API MDX files)`);

  // 2. Process OpenAPI specs
  const specFiles = await glob('specs/*.json');
  console.log(`\nFound ${specFiles.length} OpenAPI specs`);

  for (const specPath of specFiles) {
    try {
      const specName = basename(specPath, '.json');
      const endpoints = extractEndpoints(specPath, specName);

      for (const ep of endpoints) {
        const content = [
          `# ${ep.method} ${ep.path}`,
          '',
          ep.summary,
          '',
          ep.description,
          '',
          '## Parameters',
          ep.parameters || 'None',
          '',
          '## Responses',
          ep.responses || 'None',
        ].join('\n');

        const metadata = generateMetadata({
          url: `/docs/api/${specName}/${ep.id}/`,
          title: `${ep.method} ${ep.path}`,
          breadcrumb: `API Explorer > ${specName.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} > ${ep.summary || ep.path}`,
          contentType: 'api-reference',
          category: specName,
          sectionHeading: `${ep.method} ${ep.path}`,
        });

        const chunkPath = join(CHUNKS_DIR, `${ep.id}.txt`);
        const metaPath = join(CHUNKS_DIR, `${ep.id}.txt.metadata.json`);

        writeFileSync(chunkPath, content, 'utf-8');
        writeFileSync(metaPath, JSON.stringify(metadata, null, 2), 'utf-8');
        apiChunks++;
      }

      specsProcessed++;
    } catch (err) {
      console.error(`  WARNING: Failed to process ${specPath}: ${(err as Error).message}`);
    }
  }

  console.log(`Processed ${specsProcessed} specs -> ${apiChunks} endpoint chunks`);

  // 3. Write manifest
  const manifest = {
    generated: new Date().toISOString(),
    total_chunks: docChunks + apiChunks,
    doc_chunks: docChunks,
    api_chunks: apiChunks,
    docs_processed: docsProcessed,
    specs_processed: specsProcessed,
    skipped_api_mdx: skippedApiMdx,
  };

  writeFileSync(join(OUTPUT_DIR, 'manifest.json'), JSON.stringify(manifest, null, 2), 'utf-8');

  // 4. Summary
  console.log('\n=== Summary ===');
  console.log(`Total chunks: ${manifest.total_chunks}`);
  console.log(`  Doc chunks: ${docChunks}`);
  console.log(`  API chunks: ${apiChunks}`);
  console.log(`Docs processed: ${docsProcessed}`);
  console.log(`Specs processed: ${specsProcessed}`);
  console.log(`Skipped API MDX: ${skippedApiMdx}`);
  console.log(`Output: ${OUTPUT_DIR}/chunks/`);
}

main().catch((err) => {
  console.error('FATAL:', err);
  process.exit(1);
});
