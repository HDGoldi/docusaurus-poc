/**
 * S3 Sync Script for RAG Content
 *
 * Uploads preprocessed chunks from .rag-content/chunks/ to the RAG content
 * S3 bucket for Bedrock Knowledge Base ingestion.
 *
 * Required env vars:
 *   RAG_CONTENT_BUCKET - S3 bucket name (e.g., 1nce-devhub-rag-content)
 *
 * Optional env vars:
 *   AWS_REGION - AWS region (default: eu-central-1)
 *   KB_ID - Bedrock Knowledge Base ID (required with --start-ingestion)
 *   DATA_SOURCE_ID - Bedrock Data Source ID (required with --start-ingestion)
 *
 * Usage:
 *   RAG_CONTENT_BUCKET=1nce-devhub-rag-content npx tsx scripts/sync-rag-to-s3.ts
 *   RAG_CONTENT_BUCKET=... KB_ID=... DATA_SOURCE_ID=... npx tsx scripts/sync-rag-to-s3.ts --start-ingestion
 */

import { readFileSync, existsSync } from 'fs';
import { join, extname } from 'path';
import { glob } from 'glob';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import {
  BedrockAgentClient,
  StartIngestionJobCommand,
} from '@aws-sdk/client-bedrock-agent';

const BUCKET = process.env.RAG_CONTENT_BUCKET;
const REGION = process.env.AWS_REGION || 'eu-central-1';
const KB_ID = process.env.KB_ID;
const DATA_SOURCE_ID = process.env.DATA_SOURCE_ID;
const START_INGESTION = process.argv.includes('--start-ingestion');

const RAG_CONTENT_DIR = '.rag-content';
const CHUNKS_DIR = join(RAG_CONTENT_DIR, 'chunks');
const MANIFEST_PATH = join(RAG_CONTENT_DIR, 'manifest.json');
const BATCH_SIZE = 20;

function getContentType(filename: string): string {
  if (filename.endsWith('.metadata.json')) return 'application/json';
  if (extname(filename) === '.txt') return 'text/plain';
  return 'application/octet-stream';
}

async function uploadBatch(
  s3: S3Client,
  bucket: string,
  files: string[],
): Promise<number> {
  const uploads = files.map((filePath) => {
    const filename = filePath.replace(`${CHUNKS_DIR}/`, '');
    const key = `chunks/${filename}`;
    const body = readFileSync(filePath);
    const contentType = getContentType(filename);

    return s3
      .send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: key,
          Body: body,
          ContentType: contentType,
        }),
      )
      .then(() => 1 as number);
  });

  const results = await Promise.all(uploads);
  return results.reduce((sum, n) => sum + n, 0);
}

async function main() {
  // Validate environment
  if (!BUCKET) {
    console.error('ERROR: RAG_CONTENT_BUCKET environment variable is required.');
    console.error(
      'Usage: RAG_CONTENT_BUCKET=1nce-devhub-rag-content npx tsx scripts/sync-rag-to-s3.ts',
    );
    process.exit(1);
  }

  if (START_INGESTION && (!KB_ID || !DATA_SOURCE_ID)) {
    console.error(
      'ERROR: KB_ID and DATA_SOURCE_ID are required when using --start-ingestion.',
    );
    process.exit(1);
  }

  // Check manifest exists
  if (!existsSync(MANIFEST_PATH)) {
    console.error(
      `ERROR: ${MANIFEST_PATH} not found. Run 'npx tsx scripts/prepare-rag-content.ts' first.`,
    );
    process.exit(1);
  }

  const manifest = JSON.parse(readFileSync(MANIFEST_PATH, 'utf-8'));
  console.log(`=== RAG Content S3 Sync ===`);
  console.log(`Bucket: ${BUCKET}`);
  console.log(`Region: ${REGION}`);
  console.log(`Manifest: ${manifest.total_chunks} chunks (${manifest.doc_chunks} doc, ${manifest.api_chunks} api)\n`);

  // Discover chunk files
  const files = await glob(`${CHUNKS_DIR}/*`);
  if (files.length === 0) {
    console.error(`ERROR: No files found in ${CHUNKS_DIR}. Run prepare-rag-content.ts first.`);
    process.exit(1);
  }

  console.log(`Found ${files.length} files to upload.`);

  // Upload in batches
  const s3 = new S3Client({ region: REGION });
  let uploaded = 0;

  for (let i = 0; i < files.length; i += BATCH_SIZE) {
    const batch = files.slice(i, i + BATCH_SIZE);
    const count = await uploadBatch(s3, BUCKET, batch);
    uploaded += count;

    const pct = Math.round((uploaded / files.length) * 100);
    process.stdout.write(`\r  Uploaded ${uploaded}/${files.length} files (${pct}%)`);
  }

  console.log(`\n\nUploaded ${uploaded} files to s3://${BUCKET}/chunks/`);

  // Optionally trigger Bedrock KB ingestion
  if (START_INGESTION) {
    console.log(`\nStarting Bedrock Knowledge Base ingestion...`);
    console.log(`  KB ID: ${KB_ID}`);
    console.log(`  Data Source ID: ${DATA_SOURCE_ID}`);

    const bedrockAgent = new BedrockAgentClient({ region: REGION });
    const response = await bedrockAgent.send(
      new StartIngestionJobCommand({
        knowledgeBaseId: KB_ID!,
        dataSourceId: DATA_SOURCE_ID!,
      }),
    );

    console.log(
      `  Ingestion job started: ${response.ingestionJob?.ingestionJobId}`,
    );
    console.log(
      `  Status: ${response.ingestionJob?.status}`,
    );
    console.log(
      `\nMonitor progress in AWS Console > Bedrock > Knowledge Bases > ${KB_ID}`,
    );
  }

  console.log('\nDone.');
}

main().catch((err) => {
  console.error('FATAL:', err);
  process.exit(1);
});
