import { readFileSync } from 'fs';
import type { EndpointChunk } from './types';

export function extractEndpoints(specPath: string, specName: string): EndpointChunk[] {
  const spec = JSON.parse(readFileSync(specPath, 'utf-8'));
  const chunks: EndpointChunk[] = [];

  for (const [path, methods] of Object.entries(spec.paths || {})) {
    for (const [method, operation] of Object.entries(methods as Record<string, any>)) {
      if (['get', 'post', 'put', 'patch', 'delete'].includes(method)) {
        const opId =
          operation.operationId || `${method}-${path.replace(/\//g, '-').replace(/^-/, '')}`;
        const paramText = (operation.parameters || [])
          .map(
            (p: any) =>
              `- ${p.name} (${p.in}, ${p.required ? 'required' : 'optional'}): ${p.description || ''}`,
          )
          .join('\n');
        const responseText = Object.entries(operation.responses || {})
          .map(([code, resp]: [string, any]) => `- ${code}: ${resp.description || ''}`)
          .join('\n');

        chunks.push({
          id: `api-${specName}-${opId}`,
          method: method.toUpperCase(),
          path,
          summary: operation.summary || '',
          description: operation.description || '',
          parameters: paramText,
          responses: responseText,
          tags: operation.tags || [],
        });
      }
    }
  }

  return chunks;
}
