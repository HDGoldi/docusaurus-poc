import { execSync } from 'child_process';
import { log, error, success } from './utils/logger';

const STEP_NAME = 'pipeline';

const steps = [
  { script: '01-copy-and-normalize', desc: 'Copy and normalize folder names' },
  { script: '02-convert-frontmatter', desc: 'Convert frontmatter' },
  { script: '03-extract-base64', desc: 'Extract base64 images' },
  { script: '04-download-images', desc: 'Download remote images' },
  { script: '05-convert-images', desc: 'Convert Image JSX tags' },
  { script: '06-convert-htmlblocks', desc: 'Convert HTMLBlocks' },
  { script: '07-convert-tables', desc: 'Convert Table JSX' },
  { script: '08-convert-links', desc: 'Convert doc:slug links' },
  { script: '09-convert-admonitions', desc: 'Convert admonitions' },
  { script: '10-generate-sidebars', desc: 'Generate sidebars from _order.yaml' },
  { script: '11-fix-mdx-compat', desc: 'Fix MDX compatibility issues' },
  { script: '12-fix-readme-components', desc: 'Convert Callout and Recipe components' },
];

let failed = 0;
const startTime = Date.now();

for (const step of steps) {
  const stepStart = Date.now();
  log(STEP_NAME, `Running: ${step.desc}...`);
  try {
    execSync(`npx tsx scripts/${step.script}.ts`, {
      stdio: 'inherit',
      cwd: process.cwd(),
    });
    const elapsed = ((Date.now() - stepStart) / 1000).toFixed(1);
    success(STEP_NAME, `${step.desc} completed (${elapsed}s)`);
  } catch (e) {
    error(STEP_NAME, `${step.desc} FAILED`);
    failed++;
    // Continue to next step -- allow partial pipeline runs
  }
}

const totalElapsed = ((Date.now() - startTime) / 1000).toFixed(1);
if (failed > 0) {
  error(STEP_NAME, `Pipeline completed with ${failed} failures in ${totalElapsed}s`);
  process.exit(1);
} else {
  success(STEP_NAME, `Pipeline completed successfully in ${totalElapsed}s`);
}
