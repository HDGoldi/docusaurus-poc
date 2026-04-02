export interface ChatRequest {
  question: string;
}

export interface SSEEvent {
  type: 'text' | 'sources' | 'error' | 'done';
  content?: string;
  sources?: Source[];
  error?: string;
}

export interface Source {
  index: number;     // [1], [2], etc.
  url: string;       // Page URL from metadata
  title: string;     // Page title from metadata
  relevance: number; // Score from Bedrock
}

export interface BedrockCitation {
  generatedResponsePart?: {
    textResponsePart?: {
      text?: string;
      span?: { start: number; end: number };
    };
  };
  retrievedReferences?: Array<{
    content?: { text?: string };
    location?: { s3Location?: { uri?: string } };
    metadata?: Record<string, any>;
  }>;
}
