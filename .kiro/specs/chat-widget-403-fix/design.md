# Chat Widget 403 Fix — Bugfix Design

## Overview

The AI chat widget on help.1nce.com fails with a 403 Forbidden (`AccessDeniedException`) when users send messages. The POST request flows from the frontend through a CloudFront proxy distribution (`rag-edge-stack.yaml`) to a Lambda Function URL (`rag-stack.yaml`), where the Lambda service's authorization layer rejects it. Additionally, the frontend incorrectly maps all 403 responses to a rate-limit message, hiding the true cause from users.

The fix targets two layers: (1) the infrastructure templates to ensure the Lambda Function URL correctly accepts proxied requests, and (2) the frontend error handling to distinguish authorization failures from rate-limit blocks.

## Glossary

- **Bug_Condition (C)**: A POST request sent through the CloudFront proxy to the Lambda Function URL that is rejected with 403 `AccessDeniedException` by the Lambda authorization layer
- **Property (P)**: POST requests proxied through CloudFront should be accepted by the Lambda Function URL and return a streaming SSE response; 403 errors should display contextually appropriate messages in the UI
- **Preservation**: CORS preflight behavior, WAF rate limiting, existing error handling for non-403 status codes, Lambda streaming SSE, and endpoint resolution must remain unchanged
- **`useChatStream`**: The React hook in `src/components/ChatWidget/useChatStream.ts` that handles fetch requests and SSE parsing for the chat widget
- **`ChatFunctionUrl`**: The `AWS::Lambda::Url` resource in `infra/rag-stack.yaml` configured with `AuthType: NONE` and `InvokeMode: RESPONSE_STREAM`
- **`ChatApiDistribution`**: The CloudFront distribution in `infra/rag-edge-stack.yaml` that proxies requests to the Lambda Function URL with WAF rate limiting
- **`ChatFunctionUrlPermission`**: The `AWS::Lambda::Permission` resource that grants `lambda:InvokeFunctionUrl` to all principals

## Bug Details

### Bug Condition

The bug manifests when a user sends a chat message from the frontend. The `useChatStream` hook POSTs to the CloudFront proxy distribution, which forwards the request to the Lambda Function URL origin. The Lambda service's authorization layer rejects the request with a 403 `AccessDeniedException`, even though the CloudFormation template specifies `AuthType: NONE`. The CORS preflight (OPTIONS) succeeds, confirming the network path works, but the actual POST is denied.

A secondary bug exists in the frontend: the `useChatStream` hook maps HTTP 403 to `COPY.errorRateLimit` ("Too many requests"), which is misleading when the 403 is caused by an authorization failure rather than WAF rate limiting.

**Formal Specification:**
```
FUNCTION isBugCondition(input)
  INPUT: input of type { method: string, url: string, statusCode: number, errorType: string }
  OUTPUT: boolean

  RETURN input.method == 'POST'
         AND input.url MATCHES CloudFront proxy endpoint pattern
         AND input.statusCode == 403
         AND input.errorType == 'AccessDeniedException'
END FUNCTION
```

### Examples

- User types "How do I activate a SIM?" and clicks send → POST to `dfpjujw4sa0bx.cloudfront.net` → 403 `AccessDeniedException` → UI shows "Too many requests" (wrong message)
- User clicks a suggestion chip "What authentication methods are available?" → same POST → same 403 → same misleading rate-limit message
- OPTIONS preflight to the same endpoint → 200 OK with correct CORS headers (this works fine, confirming the path is valid)
- WAF blocks a user who exceeded 100 requests in 5 minutes → 403 from WAF (not Lambda) → UI shows "Too many requests" (correct message for this case)

## Expected Behavior

### Preservation Requirements

**Unchanged Behaviors:**
- CORS preflight (OPTIONS) requests must continue to return proper CORS headers from both the CloudFront response headers policy and the Lambda Function URL CORS config
- WAF rate limiting (100 req/5min per IP) must continue to block excess requests
- Non-403/429/503 HTTP errors must continue to display `errorGeneric` message
- Network errors (TypeError from fetch) must continue to display `errorNetwork` message
- Lambda handler streaming SSE (text chunks, citations, done signal) must continue to work
- Lambda handler input validation (400 for empty/missing question) must continue to work
- `CHAT_ENDPOINT` resolution fallback chain (`window.__CHAT_ENDPOINT__` → `process.env.CHAT_ENDPOINT` → `customFields.chatEndpoint` → `''`) must remain unchanged
- AbortController cleanup on unmount must continue to prevent memory leaks

**Scope:**
All inputs that do NOT involve POST requests to the CloudFront proxy endpoint, and all non-403 error handling paths, should be completely unaffected by this fix. This includes:
- OPTIONS preflight requests
- GET requests (if any)
- 429, 503, and other HTTP error responses
- Network-level failures
- SSE stream parsing logic

## Hypothesized Root Cause

Based on analysis of the infrastructure templates and the observed behavior, the most likely issues are:

1. **Missing or Incorrect Resource Policy on the Lambda Function URL**: The `ChatFunctionUrlPermission` resource in `rag-stack.yaml` grants `lambda:InvokeFunctionUrl` to `Principal: "*"` with `FunctionUrlAuthType: NONE`. This looks correct in the template. However, if the stack was deployed before this permission was added, or if a deployment failed partway through, the permission may not be active on the deployed function. The Lambda Function URL with `AuthType: NONE` still requires an explicit resource-based policy allowing `lambda:InvokeFunctionUrl` — without it, all requests are denied with 403 `AccessDeniedException`.

2. **CloudFront Origin Request Policy Stripping Required Headers**: The `ChatApiDistribution` in `rag-edge-stack.yaml` uses `OriginRequestPolicyId: b689b0a8-53d0-40ab-baf2-68738e2966ac` (the AWS managed "AllViewerExceptHostHeader" policy). This strips the `Host` header and replaces it with the origin domain. While this is generally correct for Lambda Function URLs, if the Lambda Function URL has any host-based validation or if the request is being signed by CloudFront (OAC), this could cause authorization failures. Lambda Function URLs do NOT support OAC — they require either `AuthType: NONE` with a resource policy, or `AuthType: AWS_IAM` with SigV4 signing. The current setup uses `NONE`, which should work without OAC.

3. **Stale Deployment State**: The most probable root cause is that the `ChatFunctionUrlPermission` resource was either not deployed, failed to deploy, or was removed by a subsequent stack update. CloudFormation `AWS::Lambda::Permission` resources can silently fail if the function doesn't exist yet or if there's a circular dependency. The fix should ensure the permission is correctly defined and verify it deploys successfully.

4. **Frontend Error Mapping Conflation**: Independent of the infrastructure issue, the `useChatStream` hook in `src/components/ChatWidget/useChatStream.ts` (lines 79-80) maps HTTP 403 to `COPY.errorRateLimit`. This conflates two distinct 403 sources: WAF rate-limit blocks (which correctly return 403) and Lambda authorization failures (which also return 403 but for a completely different reason). The frontend should show a more appropriate message for non-rate-limit 403 errors.

## Correctness Properties

Property 1: Bug Condition — Lambda Function URL Accepts Proxied POST Requests

_For any_ POST request where the bug condition holds (the request is sent through the CloudFront proxy to the Lambda Function URL and the Lambda authorization layer would reject it), the fixed infrastructure SHALL ensure the Lambda Function URL resource policy correctly grants `lambda:InvokeFunctionUrl` to all principals, so the request is accepted and the Lambda handler is invoked.

**Validates: Requirements 2.1, 2.2**

Property 2: Bug Condition — Frontend Displays Appropriate 403 Error Message

_For any_ HTTP 403 response received by the frontend, the fixed `useChatStream` hook SHALL distinguish between rate-limit 403s and authorization/other 403s, displaying `errorRateLimit` only for rate-limit scenarios and a more appropriate message (e.g., `errorGeneric` or a new `errorAuth`) for authorization failures.

**Validates: Requirements 2.3**

Property 3: Preservation — Non-403 Error Handling Unchanged

_For any_ HTTP response where the status code is NOT 403 (including 429, 503, network errors, and other HTTP errors), the fixed `useChatStream` hook SHALL produce exactly the same error message and state transitions as the original code, preserving all existing error handling behavior.

**Validates: Requirements 3.3, 3.5, 3.6**

Property 4: Preservation — CORS and WAF Behavior Unchanged

_For any_ OPTIONS preflight request or WAF-evaluated request, the fixed infrastructure SHALL produce the same CORS headers and rate-limiting behavior as the original configuration, preserving all existing CORS and WAF functionality.

**Validates: Requirements 3.1, 3.2**

## Fix Implementation

### Changes Required

Assuming our root cause analysis is correct:

**File**: `infra/rag-stack.yaml`

**Resources**: `ChatFunctionUrl`, `ChatFunctionUrlPermission`

**Specific Changes**:
1. **Verify and reinforce the resource policy**: Ensure `ChatFunctionUrlPermission` correctly references the function and has `FunctionUrlAuthType: NONE`. The current template looks correct, but the permission may need to be redeployed. Add a `DependsOn: ChatFunctionUrl` to ensure ordering.
2. **Add an explicit resource-based policy statement**: Consider adding a `AWS::Lambda::Permission` with a more specific `SourceArn` condition pointing to the CloudFront distribution, or verify the existing wildcard principal permission is sufficient.
3. **Verify no OAC is attached**: Ensure the CloudFront origin in `rag-edge-stack.yaml` does NOT have `OriginAccessControlId` set, since Lambda Function URLs with `AuthType: NONE` do not support OAC.

**File**: `infra/rag-edge-stack.yaml`

**Resource**: `ChatApiDistribution`

**Specific Changes**:
4. **Verify origin configuration**: Ensure the `CustomOriginConfig` is used (not `S3OriginConfig`) and that no `OriginAccessControlId` is present on the Lambda origin. The current template uses `CustomOriginConfig` which is correct.
5. **Verify origin request policy**: The `AllViewerExceptHostHeader` policy (`b689b0a8-53d0-40ab-baf2-68738e2966ac`) should forward all viewer headers except Host, which is correct for Lambda Function URLs.

**File**: `src/components/ChatWidget/useChatStream.ts`

**Function**: `sendMessage` (error handling block)

**Specific Changes**:
6. **Differentiate 403 error messages**: Change the HTTP 403 handler to show `COPY.errorGeneric` (or a new `COPY.errorAuth` message) instead of `COPY.errorRateLimit`. Since the WAF rate-limit block returns 403 but the frontend cannot reliably distinguish WAF 403 from Lambda auth 403 at the HTTP level, the safest approach is to use a generic error message for 403 that doesn't mislead users about rate limiting. Alternatively, check the response body for the `AccessDeniedException` error type to distinguish the two cases.

**File**: `src/components/ChatWidget/types.ts`

**Constant**: `COPY`

**Specific Changes**:
7. **Add or update error copy**: Either add a new `errorAuth` message (e.g., "Unable to reach the assistant. Please try again later.") or update the 403 handling to use `errorGeneric` for non-rate-limit 403s.

## Testing Strategy

### Validation Approach

The testing strategy follows a two-phase approach: first, surface counterexamples that demonstrate the bug on unfixed code, then verify the fix works correctly and preserves existing behavior.

### Exploratory Bug Condition Checking

**Goal**: Surface counterexamples that demonstrate the bug BEFORE implementing the fix. Confirm or refute the root cause analysis. If we refute, we will need to re-hypothesize.

**Test Plan**: Write tests that simulate HTTP 403 responses with different body payloads (AccessDeniedException vs. WAF block) and verify the frontend error handling behavior. For the infrastructure side, inspect the deployed Lambda Function URL resource policy via AWS CLI to confirm whether the permission is missing.

**Test Cases**:
1. **Lambda Auth 403 Test**: Simulate a fetch response with status 403 and body `{"Message":"Forbidden"}` with `x-amzn-errortype: AccessDeniedException` — verify the UI shows the rate-limit message (will demonstrate the misleading UX bug on unfixed code)
2. **WAF Rate-Limit 403 Test**: Simulate a fetch response with status 403 from WAF — verify the UI shows the rate-limit message (correct behavior, should pass on both unfixed and fixed code)
3. **Infrastructure Policy Test**: Run `aws lambda get-policy --function-name <function-name>` to inspect the deployed resource policy and confirm whether `lambda:InvokeFunctionUrl` permission exists
4. **End-to-End POST Test**: Send a POST request directly to the Lambda Function URL (bypassing CloudFront) to determine if the 403 originates from the Lambda auth layer or from CloudFront/WAF

**Expected Counterexamples**:
- The frontend displays "Too many requests" for all 403 responses regardless of cause
- Possible causes: hardcoded mapping of 403 → `errorRateLimit` in `useChatStream.ts`, missing Lambda resource policy, stale deployment

### Fix Checking

**Goal**: Verify that for all inputs where the bug condition holds, the fixed function produces the expected behavior.

**Pseudocode:**
```
FOR ALL input WHERE isBugCondition(input) DO
  result := useChatStream_fixed.sendMessage(input)
  ASSERT result.statusCode != 403 OR result.errorMessage != COPY.errorRateLimit
  ASSERT Lambda Function URL accepts the POST request
  ASSERT UI displays contextually appropriate error message
END FOR
```

### Preservation Checking

**Goal**: Verify that for all inputs where the bug condition does NOT hold, the fixed function produces the same result as the original function.

**Pseudocode:**
```
FOR ALL input WHERE NOT isBugCondition(input) DO
  ASSERT useChatStream_original(input) = useChatStream_fixed(input)
END FOR
```

**Testing Approach**: Property-based testing is recommended for preservation checking because:
- It generates many test cases automatically across the input domain (various HTTP status codes, response bodies, network conditions)
- It catches edge cases that manual unit tests might miss (e.g., unusual status codes, malformed responses)
- It provides strong guarantees that behavior is unchanged for all non-buggy inputs

**Test Plan**: Observe behavior on UNFIXED code first for non-403 HTTP responses and network errors, then write property-based tests capturing that behavior.

**Test Cases**:
1. **Non-403 Error Preservation**: Observe that 429 → `errorRateLimit`, 503 → `errorBackend`, other → `errorGeneric` on unfixed code, then verify this continues after fix
2. **Network Error Preservation**: Observe that TypeError → `errorNetwork` on unfixed code, then verify this continues after fix
3. **SSE Stream Preservation**: Observe that successful streaming responses parse correctly on unfixed code, then verify this continues after fix
4. **CORS Preflight Preservation**: Observe that OPTIONS requests return correct CORS headers on unfixed infra, then verify this continues after fix

### Unit Tests

- Test `useChatStream` error handling for each HTTP status code (200, 400, 403, 429, 503, 500)
- Test that 403 responses with `AccessDeniedException` body show appropriate (non-rate-limit) message
- Test that 403 responses without `AccessDeniedException` body show rate-limit message (WAF case)
- Test that AbortController cleanup works correctly
- Test SSE event parsing for text, sources, error, and done events

### Property-Based Tests

- Generate random HTTP status codes and verify the correct error message is displayed for each
- Generate random SSE event sequences and verify parsing produces correct message state
- Generate random combinations of error response bodies and verify appropriate error categorization

### Integration Tests

- Test full chat flow: send message → receive streaming SSE response → display in UI
- Test CloudFormation template validation: verify `rag-stack.yaml` and `rag-edge-stack.yaml` are syntactically valid and resource dependencies are correct
- Test that the Lambda Function URL resource policy grants the correct permissions after stack deployment
