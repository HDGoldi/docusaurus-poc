---
name: default
description: "Work with 1NCE IoT connectivity APIs. Covers authentication, SIM management, order management, and device operations. Use when integrating with 1NCE platform APIs."
---

# 1NCE API Integration

Use this skill when working with the 1NCE Management API. All endpoints share the base URL `https://api.1nce.com/management-api`. Do not omit the `/management-api` path prefix.

## Authentication

All 1NCE API calls require a Bearer token obtained via HTTP Basic Authentication.

### Prerequisites

You need 1NCE Management Portal credentials (username and password) with API access enabled.

### Obtain a Bearer Token

Send a POST request to `/oauth/token` with Basic Auth credentials and a JSON body containing `grant_type: "client_credentials"`.

```bash
curl -X POST https://api.1nce.com/management-api/oauth/token \
  -u "your-username:your-password" \
  -H "Content-Type: application/json" \
  -d '{"grant_type": "client_credentials"}'
```

### Response

```json
{
  "status_code": 200,
  "access_token": "eyJpZHRva2V...",
  "token_type": "bearer",
  "expires_in": 3600,
  "userId": "user",
  "scope": "all"
}
```

### Using the Token

Include the token in all subsequent API requests:

```
Authorization: Bearer {access_token}
```

The token expires in 3600 seconds (1 hour). Request a new token before expiry. Do not cache tokens beyond their `expires_in` lifetime.

## Common Workflows

### Workflow 1: SIM Lifecycle Management

Use this workflow to list, inspect, and monitor SIMs.

**Step 1 -- List all SIMs:**

```bash
curl -X GET "https://api.1nce.com/management-api/v1/sims?page=1&pageSize=100" \
  -H "Authorization: Bearer {access_token}"
```

Pagination: use `page` (1-based) and `pageSize` (max 100) query parameters. The total page count is in the response headers. Filter with `q` parameter in `{field}:{value}` format (e.g., `q=ip_address:10.0.0.1,imei:123456`). Sort with `sort` parameter (prepend `-` for descending).

**Step 2 -- Get single SIM details:**

`GET /v1/sims/{iccid}` -- returns SIM configuration, status, and metadata.

**Step 3 -- Check SIM connectivity:**

`GET /v1/sims/{iccid}/connectivity` -- returns current connectivity state including network registration, IP address, and session info.

**Step 4 -- Check data quota:**

`GET /v1/sims/{iccid}/quota/data` -- returns remaining data volume and usage.

**Step 5 -- Top up data if needed:**

`POST /v1/sims/{iccid}/quota/top-up` -- applies a data top-up to the SIM.

### Workflow 2: Device Onboarding with 1NCE OS

Use this workflow to register devices and configure cloud integrations.

**Step 1 -- Get device endpoints:**

`GET /v1/integrate/devices/endpoints` -- returns available device endpoints for all protocols (LWM2M, UDP, CoAP).

**Step 2 -- Get endpoint for a specific protocol:**

`GET /v1/integrate/devices/endpoints/{protocol}` -- returns endpoint details for LWM2M, UDP, or COAP.

**Step 3 -- Create Pre-Shared Key (PSK) credentials:**

`POST /v1/integrate/devices/psk` -- generates PSK credentials for device authentication.

**Step 4 -- Set up cloud integration (AWS IoT):**

`POST /v1/integrate/customers/integrations/aws` -- creates an AWS IoT integration. Requires CloudFormation parameters from `GET /v1/integrate/customers/cloudFormationParameters`.

**Step 5 -- Set up webhook integration (alternative):**

`POST /v1/integrate/customers/integrations/webhook` -- creates a webhook integration for forwarding device data to your endpoint.

### Workflow 3: Connectivity Monitoring and Troubleshooting

Use this workflow to monitor device connectivity and handle issues.

**Step 1 -- Get SIM connectivity status:**

`GET /v1/sims/{iccid}/connectivity` -- check if the SIM is currently connected.

**Step 2 -- Check data usage:**

`GET /v1/sims/{iccid}/usage` -- returns historical usage data.

**Step 3 -- Review SIM events:**

`GET /v1/sims/{iccid}/events` -- returns event history (attach, detach, data sessions). Supports `page`, `pageSize`, and `sort` parameters.

**Step 4 -- Reset connectivity if stuck:**

`POST /v1/sims/{iccid}/connectivity/reset` -- forces a connectivity reset for the SIM.

**Step 5 -- Check SMS quota (if applicable):**

`GET /v1/sims/{iccid}/quota/sms` -- returns remaining SMS volume.

## Gotchas and Best Practices

### Error Codes

The authentication endpoint returns these error codes on failure (HTTP 400):

| Error Code | Meaning |
|---|---|
| `BadCredentials` | Username does not exist or password is wrong. Verify your 1NCE portal credentials. |
| `AuthValidationError` | Missing `username` or `password` in the Basic Auth header. Ensure both are provided. |
| `BodyValidationError` | Missing `grant_type` in the request body. Send `{"grant_type": "client_credentials"}`. |
| `UnsupportedContentTypeError` | Wrong Content-Type header. Use `Content-Type: application/json`. |

### Rate Limiting

The API may throttle requests under heavy load. If you receive HTTP 429 responses, implement exponential backoff. Space bulk operations (e.g., iterating all SIMs) with short delays between pages.

### CORS Limitation

Browser-based API calls to `api.1nce.com` will fail due to CORS restrictions. Do not call the 1NCE API directly from frontend JavaScript. Use a server-side proxy or make calls from your backend instead.

### Token Expiry Handling

Always check token age before making requests. If the token is expired or close to expiry, obtain a new one. Do not retry failed requests with an expired token -- get a fresh token first.

### Base URL Consistency

All Management API calls use `https://api.1nce.com/management-api` as the base URL. Do not omit the `/management-api` prefix. Requests to `https://api.1nce.com/v1/sims` (without the prefix) will fail.

### Content-Type

Always send `Content-Type: application/json` for POST and PUT requests. The API rejects other content types with `UnsupportedContentTypeError`.

### Pagination

List endpoints (`GET /v1/sims`, `GET /v1/sims/{iccid}/events`, etc.) use page-based pagination:

- `page`: 1-based page index (default: 1)
- `pageSize`: items per page (default: 10, max: 100)
- Total page count is returned in response headers
- Always iterate through all pages when retrieving complete datasets

### SMS Operations

SMS endpoints support both MT (Mobile Terminated, sent to device) and MO (Mobile Originated, sent from device) messages. Use `POST /v1/sims/{iccid}/sms` to send an SMS to a SIM. SMS quota is separate from data quota.

### Further Reference

For complete endpoint documentation including request/response schemas, visit the full API reference at `https://help.1nce.com`.
