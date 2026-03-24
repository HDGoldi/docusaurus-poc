import type { Chunk } from './types';

export function chunkByHeadings(markdown: string, docId: string): Chunk[] {
  const lines = markdown.split('\n');
  const chunks: Chunk[] = [];
  let currentChunk: Partial<Chunk> | null = null;
  let contentLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const match = lines[i].match(/^(#{2,3})\s+(.+)/); // h2 or h3
    if (match) {
      // Save previous chunk
      if (currentChunk) {
        currentChunk.content = contentLines.join('\n').trim();
        if (currentChunk.content) chunks.push(currentChunk as Chunk);
      }
      // Start new chunk
      const level = match[1].length;
      const heading = match[2].trim();
      const chunkIndex = String(chunks.length + 1).padStart(3, '0');
      currentChunk = {
        id: `${docId}-${chunkIndex}`,
        heading,
        headingLevel: level,
        startLine: i,
      };
      contentLines = [lines[i]]; // include heading in content
    } else {
      contentLines.push(lines[i]);
    }
  }

  // Save last chunk
  if (currentChunk) {
    currentChunk.content = contentLines.join('\n').trim();
    if (currentChunk.content) chunks.push(currentChunk as Chunk);
  }

  // If no h2/h3 headings found, treat entire doc as one chunk
  if (chunks.length === 0 && markdown.trim()) {
    chunks.push({
      id: `${docId}-001`,
      heading: '',
      headingLevel: 0,
      content: markdown.trim(),
      startLine: 0,
    });
  }

  return chunks;
}
