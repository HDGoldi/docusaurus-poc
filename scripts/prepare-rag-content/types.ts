export interface Chunk {
  id: string;           // e.g. "docs-introduction-welcome-001"
  heading: string;      // Section heading text
  headingLevel: number; // 2 or 3 (h2/h3)
  content: string;      // Plain markdown text
  startLine: number;
}

export interface ChunkMetadata {
  url: string;          // e.g. "/docs/introduction-welcome/"
  title: string;        // Page title from frontmatter
  breadcrumb: string;   // e.g. "Documentation > Introduction > Welcome"
  content_type: string; // "guide" | "tutorial" | "api-reference" | "glossary"
  category: string;     // Top-level directory name
  section_heading: string; // The h2/h3 heading for this chunk
}

export interface EndpointChunk {
  id: string;           // e.g. "api-authorization-obtain-access-token"
  method: string;       // "GET", "POST", etc.
  path: string;         // "/api/v1/authenticate"
  summary: string;
  description: string;
  parameters: string;   // Formatted parameter list
  responses: string;    // Formatted response list
  tags: string[];
}
