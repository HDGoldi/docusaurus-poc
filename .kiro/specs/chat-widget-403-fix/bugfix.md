# Bugfix Requirements Document

## Introduction

The AI Chat widget on help.1nce.com returns a 403 Forbidden error (`AccessDeniedException`) when users send messages. The POST request to the CloudFront proxy distribution (`dfpjujw4sa0bx.cloudfront.net`) reaches the Lambda Function URL origin but is rejected by the Lambda service's authorization layer. The CORS preflight (OPTIONS) succeeds, confirming the CloudFront→Lambda path works, but the actual POST is denied. The error message explicitly references Lambda Function URL authorization issues.

The architecture has three layers: the frontend ChatWidget makes a POST to a CloudFront distribution (defined in `infra/rag-edge-stack.yaml`), which proxies to a Lambda Function URL (defined in `infra/rag-stack.yaml`). The 403 originates from the Lambda Function URL authorization check, not from WAF or CloudFront itself.

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN a user sends a chat message from help.1nce.com THEN the system returns HTTP 403 Forbidden with `{"Message":"Forbidden. For troubleshooting Function URL authorization issues..."}` and `x-amzn-errortype: AccessDeniedException`

1.2 WHEN the CloudFront proxy distribution forwards a POST request to the Lambda Function URL origin THEN the Lambda service rejects the request with an authorization error, despite the CloudFormation template specifying `AuthType: NONE` and a permissive `lambda:InvokeFunctionUrl` resource policy

1.3 WHEN the frontend receives the 403 response THEN the chat widget displays the rate-limit error message ("Too many requests") because the `useChatStream` hook maps HTTP 403 to `COPY.errorRateLimit`, which is misleading since the actual cause is an authorization failure, not rate limiting

### Expected Behavior (Correct)

2.1 WHEN a user sends a chat message from help.1nce.com THEN the system SHALL successfully proxy the POST request through CloudFront to the Lambda Function URL and return a streaming SSE response with the AI-generated answer

2.2 WHEN the CloudFront proxy distribution forwards a POST request to the Lambda Function URL origin THEN the Lambda service SHALL accept the request and invoke the handler, because the Function URL auth type is `NONE` and the resource-based policy grants `lambda:InvokeFunctionUrl` to all principals

2.3 WHEN the frontend receives an HTTP 403 response THEN the chat widget SHALL display an appropriate error message that distinguishes between authorization failures and rate-limit errors, rather than showing the rate-limit message for all 403 responses

### Unchanged Behavior (Regression Prevention)

3.1 WHEN the CORS preflight (OPTIONS) request is sent to the CloudFront proxy THEN the system SHALL CONTINUE TO return proper CORS headers (`access-control-allow-origin`, `access-control-allow-methods`) as configured in both the CloudFront response headers policy and the Lambda Function URL CORS config

3.2 WHEN a user sends more than 100 requests within 5 minutes from the same IP THEN the WAF WebACL SHALL CONTINUE TO block excess requests with a rate-limit response, preserving the existing rate-limiting protection

3.3 WHEN the chat widget receives a network error or non-403/429/503 HTTP error THEN the system SHALL CONTINUE TO display the appropriate error message (`errorNetwork` for network failures, `errorGeneric` for other HTTP errors)

3.4 WHEN the Lambda handler receives a valid question THEN the system SHALL CONTINUE TO stream SSE events (text chunks, citations, done signal) back through the CloudFront proxy to the frontend

3.5 WHEN the Lambda handler receives an empty or missing question THEN the system SHALL CONTINUE TO return a 400 error with an appropriate SSE error event

3.6 WHEN the `CHAT_ENDPOINT` environment variable is not set during build THEN the system SHALL CONTINUE TO resolve the endpoint via the `customFields.chatEndpoint` fallback chain in `types.ts`, and show an error state if no endpoint is available
