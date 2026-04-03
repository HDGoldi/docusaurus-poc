# Implementation Plan

- [x] 1. Write bug condition exploration test
  - **Property 1: Bug Condition** — 403 AccessDeniedException Shows Misleading Rate-Limit Message
  - **CRITICAL**: This test MUST FAIL on unfixed code — failure confirms the bug exists
  - **DO NOT attempt to fix the test or the code when it fails**
  - **NOTE**: This test encodes the expected behavior — it will validate the fix when it passes after implementation
  - **GOAL**: Surface counterexamples that demonstrate the frontend maps all 403 responses to the rate-limit message regardless of cause
  - **Scoped PBT Approach**: Scope the property to the concrete failing case — a fetch response with status 403 and body containing `AccessDeniedException` error type
  - Create a test file at `src/components/ChatWidget/__tests__/useChatStream.bugCondition.test.ts`
  - Mock `fetch` to return a Response with `status: 403` and JSON body `{"Message":"Forbidden"}` with header `x-amzn-errortype: AccessDeniedException`
  - Call `sendMessage` and assert the `onError` callback is called with a message that is NOT `COPY.errorRateLimit` (i.e., the error message should distinguish auth failures from rate-limit blocks)
  - Also test: mock `fetch` to return a 403 with a WAF-style response (no `AccessDeniedException`) and assert `onError` IS called with `COPY.errorRateLimit` (this case should remain correct)
  - Property: _For any_ 403 response where the body contains `AccessDeniedException`, the displayed error message should NOT be the rate-limit message
  - Run test on UNFIXED code
  - **EXPECTED OUTCOME**: Test FAILS because current code maps ALL 403 → `COPY.errorRateLimit` regardless of response body
  - Document counterexamples: `sendMessage("test")` with 403 + AccessDeniedException body → shows "Too many requests" instead of an auth-specific message
  - Mark task complete when test is written, run, and failure is documented
  - _Requirements: 1.3, 2.3_

- [x] 2. Write preservation property tests (BEFORE implementing fix)
  - **Property 2: Preservation** — Non-403 Error Handling and SSE Streaming Unchanged
  - **IMPORTANT**: Follow observation-first methodology
  - Create a test file at `src/components/ChatWidget/__tests__/useChatStream.preservation.test.ts`
  - Observe on UNFIXED code:
    - `fetch` returns 429 → `onError` called with `COPY.errorRateLimit`, state becomes `'error'`
    - `fetch` returns 503 → `onError` called with `COPY.errorBackend`, state becomes `'error'`
    - `fetch` returns 500 → `onError` called with `COPY.errorGeneric`, state becomes `'error'`
    - `fetch` returns 400 → `onError` called with `COPY.errorGeneric`, state becomes `'error'`
    - `fetch` throws `TypeError` → `onError` called with `COPY.errorNetwork`, state becomes `'error'`
    - `fetch` throws `DOMException('AbortError')` → `onError` NOT called, state stays `'idle'`
    - `fetch` returns 200 with SSE stream `data: {"type":"text","content":"hello"}\n\ndata: [DONE]\n\n` → `onText` called with `"hello"`, `onDone` called, state becomes `'idle'`
    - `fetch` returns 200 with SSE stream containing `{"type":"sources","sources":[...]}` → `onSources` called correctly
    - `fetch` returns 200 with SSE stream containing `{"type":"error","error":"bad input"}` → `onError` called with `"bad input"`, state becomes `'error'`
  - Write property-based tests: _For any_ HTTP status code that is NOT 403, the error message mapping must be identical to the original code (429→errorRateLimit, 503→errorBackend, other→errorGeneric)
  - Write property-based tests: _For any_ network error (TypeError), the error message must be `errorNetwork`
  - Write unit tests for SSE stream parsing to capture observed behavior
  - Run tests on UNFIXED code
  - **EXPECTED OUTCOME**: Tests PASS (confirms baseline behavior to preserve)
  - Mark task complete when tests are written, run, and passing on unfixed code
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

- [x] 3. Fix for 403 AccessDeniedException handling

  - [x] 3.1 Add `errorAuth` copy to `types.ts`
    - Add `errorAuth: 'Unable to reach the assistant. Please try again later.'` to the `COPY` constant in `src/components/ChatWidget/types.ts`
    - This provides a distinct, user-friendly message for authorization failures that does not mislead users about rate limiting
    - _Requirements: 2.3_

  - [x] 3.2 Differentiate 403 error handling in `useChatStream.ts`
    - In the `sendMessage` function's error handling block (around lines 79-82), replace the current `response.status === 403` branch
    - Read the response body text and check if it contains `AccessDeniedException`
    - If `AccessDeniedException` is found → call `onErrorRef.current(COPY.errorAuth)` (authorization failure)
    - If `AccessDeniedException` is NOT found → call `onErrorRef.current(COPY.errorRateLimit)` (WAF rate-limit block, existing behavior)
    - _Bug_Condition: isBugCondition(input) where input.statusCode == 403 AND input.errorType == 'AccessDeniedException'_
    - _Expected_Behavior: Display COPY.errorAuth for auth 403s, COPY.errorRateLimit for WAF 403s_
    - _Preservation: Non-403 error paths (429, 503, TypeError, other) must remain unchanged_
    - _Requirements: 1.3, 2.3, 3.3_

  - [x] 3.3 Verify and reinforce Lambda Function URL resource policy in `rag-stack.yaml`
    - Add `DependsOn: ChatFunctionUrl` to the `ChatFunctionUrlPermission` resource to ensure correct deployment ordering
    - Verify `AuthType: NONE` on `ChatFunctionUrl` and `FunctionUrlAuthType: NONE` on `ChatFunctionUrlPermission` are both present and correct
    - Verify `Principal: "*"` and `Action: lambda:InvokeFunctionUrl` are correct
    - _Bug_Condition: Lambda authorization layer rejects POST requests with AccessDeniedException due to missing/stale resource policy_
    - _Expected_Behavior: Lambda Function URL accepts proxied POST requests after redeployment_
    - _Preservation: CORS config, InvokeMode: RESPONSE_STREAM, and AllowedOrigins must remain unchanged_
    - _Requirements: 1.1, 1.2, 2.1, 2.2, 3.1, 3.4_

  - [x] 3.4 Verify CloudFront origin configuration in `rag-edge-stack.yaml`
    - Confirm `CustomOriginConfig` is used (not `S3OriginConfig`) for the Lambda origin
    - Confirm no `OriginAccessControlId` is set on the Lambda origin (Lambda Function URLs with AuthType NONE do not support OAC)
    - Confirm `OriginRequestPolicyId: b689b0a8-53d0-40ab-baf2-68738e2966ac` (AllViewerExceptHostHeader) is correct
    - No code changes expected unless misconfiguration is found
    - _Preservation: WAF WebACL, response headers policy, and cache policy must remain unchanged_
    - _Requirements: 2.1, 2.2, 3.1, 3.2_

  - [x] 3.5 Verify bug condition exploration test now passes
    - **Property 1: Expected Behavior** — 403 AccessDeniedException Shows Auth-Specific Message
    - **IMPORTANT**: Re-run the SAME test from task 1 — do NOT write a new test
    - The test from task 1 encodes the expected behavior: 403 + AccessDeniedException → `COPY.errorAuth` (not `COPY.errorRateLimit`)
    - When this test passes, it confirms the frontend correctly distinguishes auth 403s from rate-limit 403s
    - Run bug condition exploration test from step 1
    - **EXPECTED OUTCOME**: Test PASSES (confirms bug is fixed)
    - _Requirements: 2.3_

  - [x] 3.6 Verify preservation tests still pass
    - **Property 2: Preservation** — Non-403 Error Handling and SSE Streaming Unchanged
    - **IMPORTANT**: Re-run the SAME tests from task 2 — do NOT write new tests
    - Run preservation property tests from step 2
    - **EXPECTED OUTCOME**: Tests PASS (confirms no regressions)
    - Confirm all non-403 error handling, SSE parsing, AbortController cleanup, and endpoint resolution remain unchanged
    - _Requirements: 3.3, 3.4, 3.5, 3.6_

- [x] 4. Checkpoint — Ensure all tests pass
  - Run the full test suite to confirm both bug condition and preservation tests pass
  - Verify no regressions in existing functionality
  - Ensure all tests pass, ask the user if questions arise
