import {
  BedrockAgentRuntimeClient,
  RetrieveAndGenerateStreamCommand,
} from '@aws-sdk/client-bedrock-agent-runtime';
import { mapCitationsToSources } from './citation-mapper.js';
import type { BedrockCitation, SSEEvent } from './types.js';

const REGION = 'eu-central-1';
const DEFAULT_MODEL_ARN =
  'arn:aws:bedrock:eu-central-1::foundation-model/anthropic.claude-3-haiku-20240307-v1:0';

const FALLBACK_MESSAGE =
  "I don't have information about that in the 1NCE documentation. " +
  'Try asking about connectivity services, SIM management, API authentication, ' +
  'or other topics covered in our developer docs.';

const client = new BedrockAgentRuntimeClient({ region: REGION });

/**
 * Formats an SSE event string from a typed event payload.
 */
function sseEvent(event: SSEEvent): string {
  return `data: ${JSON.stringify(event)}\n\n`;
}

/**
 * Lambda streaming handler for the RAG chat endpoint.
 *
 * Uses `awslambda.streamifyResponse` to stream SSE events back to the client.
 * Calls Bedrock RetrieveAndGenerateStream with the configured Knowledge Base.
 * CORS is NOT set here — it is handled by CloudFront response headers policy.
 */
export const handler = awslambda.streamifyResponse(
  async (event: any, responseStream: any, _context: any) => {
    try {
      const body = JSON.parse(event.body || '{}');
      const question: string | undefined = body.question;

      // Validate input
      if (!question || question.trim().length === 0) {
        const metadata = {
          statusCode: 400,
          headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
          },
        };
        responseStream = awslambda.HttpResponseStream.from(responseStream, metadata);
        responseStream.write(sseEvent({ type: 'error', error: 'question is required' }));
        responseStream.write('data: [DONE]\n\n');
        responseStream.end();
        return;
      }

      // Set SSE response headers
      const metadata = {
        statusCode: 200,
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      };
      responseStream = awslambda.HttpResponseStream.from(responseStream, metadata);

      const kbId = process.env.KB_ID;
      const modelArn = process.env.MODEL_ARN || DEFAULT_MODEL_ARN;

      if (!kbId) {
        responseStream.write(sseEvent({ type: 'error', error: 'KB_ID not configured' }));
        responseStream.write('data: [DONE]\n\n');
        responseStream.end();
        return;
      }

      const command = new RetrieveAndGenerateStreamCommand({
        input: { text: question.trim() },
        retrieveAndGenerateConfiguration: {
          type: 'KNOWLEDGE_BASE',
          knowledgeBaseConfiguration: {
            knowledgeBaseId: kbId,
            modelArn,
            generationConfiguration: {
              inferenceConfig: {
                textInferenceConfig: {
                  maxTokens: 512,
                  temperature: 0.1,
                },
              },
            },
            retrievalConfiguration: {
              vectorSearchConfiguration: {
                numberOfResults: 5,
              },
            },
          },
        },
      });

      let hasOutput = false;
      const citations: BedrockCitation[] = [];

      try {
        const response = await client.send(command);

        if (response.stream) {
          for await (const streamEvent of response.stream) {
            if (streamEvent.output?.text) {
              hasOutput = true;
              responseStream.write(
                sseEvent({ type: 'text', content: streamEvent.output.text }),
              );
            }
            if (streamEvent.citation) {
              citations.push(streamEvent.citation as BedrockCitation);
            }
          }
        }
      } catch (bedrockError: any) {
        // If Bedrock fails (e.g., no results, model error), send fallback
        console.error('Bedrock error:', bedrockError);
        responseStream.write(sseEvent({ type: 'text', content: FALLBACK_MESSAGE }));
        responseStream.write('data: [DONE]\n\n');
        responseStream.end();
        return;
      }

      // If Bedrock returned no output, send honest fallback per D-10
      if (!hasOutput) {
        responseStream.write(sseEvent({ type: 'text', content: FALLBACK_MESSAGE }));
      }

      // Send citation sources at the end
      if (citations.length > 0) {
        const sources = mapCitationsToSources(citations);
        responseStream.write(sseEvent({ type: 'sources', sources }));
      }

      responseStream.write('data: [DONE]\n\n');
      responseStream.end();
    } catch (error: any) {
      console.error('Handler error:', error);
      try {
        const metadata = {
          statusCode: 500,
          headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
          },
        };
        responseStream = awslambda.HttpResponseStream.from(responseStream, metadata);
        responseStream.write(
          sseEvent({ type: 'error', error: 'Internal server error' }),
        );
        responseStream.write('data: [DONE]\n\n');
        responseStream.end();
      } catch {
        // Stream may already be in use; best-effort cleanup
        responseStream.end();
      }
    }
  },
);
