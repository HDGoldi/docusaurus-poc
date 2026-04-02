import { BedrockCitation, Source } from './types.js';

/**
 * Maps Bedrock citation objects to a deduplicated array of sources
 * with [1], [2], etc. index markers per D-09 (inline numbered references).
 */
export function mapCitationsToSources(citations: BedrockCitation[]): Source[] {
  const seen = new Map<string, Source>();
  let index = 1;

  for (const citation of citations) {
    for (const ref of citation.retrievedReferences || []) {
      const url = ref.metadata?.url || ref.metadata?.['x-amz-bedrock-kb-source-uri'] || '';
      const title = ref.metadata?.title || 'Untitled';

      if (url && !seen.has(String(url))) {
        seen.set(String(url), {
          index: index++,
          url: typeof url === 'string' ? url : String(url),
          title: typeof title === 'string' ? title : String(title),
          relevance: ref.metadata?.score ? Number(ref.metadata.score) : 0,
        });
      }
    }
  }

  return Array.from(seen.values());
}
