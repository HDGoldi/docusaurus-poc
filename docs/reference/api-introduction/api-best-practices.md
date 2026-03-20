---
title: API Best Practices
description: Best Practices for Integrating with the 1NCE Management API
---
The 1NCE Management API provides developers with a robust toolset to manage SIM cards, usage data, and connectivity. By following the practices outlined below, you can ensure a reliable and efficient integration with the API while minimizing errors and maximizing performance. This guide will focus on key areas such as error handling, pagination, rate limits, and best practices for API calls. It references the latest version of the 1NCE OpenAPI specification and additional insights into rate limits and large SIM batch monitoring.

# 1. Authentication and Authorization

To access the 1NCE API, developers must use a Bearer token obtained via the `/oauth/token` endpoint using the client credentials grant type. Ensure that this token is securely stored and refreshed as needed before expiry.

**Example Authentication Request:**

```http http
POST /oauth/token HTTP/1.1
Content-Type: application/json

{
  "grant_type": "client_credentials"
}
```

**Example Authorization Header:**

```http http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

## Best Practices:

* **Rotate Tokens Securely:** Store tokens securely in environment variables or a dedicated secret management system.
* **Handle Expired Tokens:** Use the `expires_in` field from the token response to know when a token will expire. Proactively refresh the token before it expires.

# 2. HTTP Status Codes and Error Handling

When making API requests, it’s important to handle HTTP status codes properly to manage errors and retry appropriately.

**Common Status Codes:**

* **200 OK:** The request was successful.
* **201 Created:** The resource was successfully created.
* **400 Bad Request:** The request is malformed (e.g., missing required fields).
* **401 Unauthorized:** Authentication failed; ensure your token is valid.
* **403 Forbidden:** You lack the necessary permissions.
* **404 Not Found:** The requested resource does not exist.
* **429 Too Many Requests**: Rate limit exceeded (see Rate Limiting below).
* **500 Internal Server Error:** Retry using exponential backoff if this is a transient issue.

**Example Error Handling Logic:**

```python Python
response = requests.get(api_url, headers=headers)
if response.status_code == 200:
    # Success
elif response.status_code == 400:
    print("Bad Request - Check your input parameters.")
elif response.status_code == 401:
    print("Authentication failed.")
elif response.status_code == 429:
    print("Rate limit exceeded. Wait before retrying.")
else:
    print(f"Error: {response.status_code}")
```

# 3. API Rate Limits

### Know the Limits of the API

The 1NCE API has rate limits to prevent misuse and overloading. These limits ensure that the API can efficiently handle queries and configurations of 1NCE SIMs and services without impacting the system's performance for all customers.

Review the current rate limits for all 1NCE Management API endpoints [API Rate Limits](https://help.1nce.com/dev-hub/reference/api-rate-limits) .The rate limits have been designed based on analysis of typical usage patterns and should not interfere with common use cases for monitoring or managing 1NCE services.

## Handling Rate Limit Errors

* **Monitor the** `Retry-After` **header** in 429 responses, which indicates how long to wait before retrying.
* **Use exponential backoff** for retries: Start with a small delay and increase it with each subsequent retry.\
  Example Retry Strategy:

```python
import time

def api_call_with_retry(url, headers):  
    for attempt in range(5):  
        response = requests.get(url, headers=headers)  
        if response.status_code == 429:  
            retry_after = int(response.headers.get("Retry-After", 1))  
            time.sleep(retry_after)  
        else:  
            return response  
    raise Exception("Max retries reached.")
```

# 4. Pagination

When fetching large datasets like lists of SIMs, the API paginates results. You can control pagination using the page and pageSize query parameters.

## Key Pagination Parameters:

* **page:** The page number to retrieve (default: 1).
* **pageSize:** Number of items per page (maximum: 100).

The response includes headers such as `X-Total-Count` (total items) and `X-Total-Pages` (total pages) to help navigate through the pages.

**Example Pagination Request:**

```http
GET /v1/sims?page=1&pageSize=100 HTTP/1.1
```

**Example Pagination Loop:**

```python
def fetch_paginated_sims(api_url, headers):  
    page = 1  
    results = \[]  
    while True:  
        response = requests.get(f"{api_url}?page={page}&pageSize=100", headers=headers)  
        data = response.json()  
        results.extend(data['results'])  
        if page >= int(response.headers['X-Total-Pages']):  
            break  
        page += 1  
    return results
```

# 5. Bulk Operations vs. Single Operations

For efficiency, use bulk API endpoints when making changes to multiple SIMs at once, such as activating or deactivating several SIMs. Bulk requests minimize the number of API calls and reduce server load.

**Example Bulk SIM Update:**

```http
POST /v1/sims HTTP/1.1  
Content-Type: application/json

[  
  {  
    "iccid": "8988280666000000000",  
    "status": "Enabled"  
  },  
  {  
    "iccid": "8988280666000000001",  
    "status": "Disabled"  
  }  
]
```

## Best Practices:

* **Use bulk calls for operations affecting multiple resources:** Instead of updating each SIM individually, use bulk calls to send a list of ICCIDs in one request.
* **Asynchronous processing:** Some operations are queued and processed asynchronously. Monitor the status of bulk operations to ensure all items are processed. Monitoring can be done using the [Data Streamer](https://help.1nce.com/dev-hub/docs/data-streamer-event-records) service with dedicated events acknowledging each operation.

# 6. Efficient Data Usage and Large SIM Batch Monitoring

When working with a large number of SIMs, it is important to manage API usage efficiently to avoid overloading the system and to ensure that your client runs smoothly.

## Large SIM Batch Monitoring

It’s still advisable to avoid frequent, high-volume API calls. 1NCE recommends using the [Data Streamer Service](https://help.1nce.com/dev-hub/docs/platform-services-data-streamer) for monitoring large batches of SIMs. The Data Streamer offers near real-time monitoring of SIM events and usage without requiring constant API queries. Using the Data Streamer service minimizes the need to query the API frequently, helping to offload the system and ensuring better performance, especially when dealing with large-scale monitoring tasks.

**Best Practices:**

* **Limit API Polling:** Avoid polling the API frequently for updates. Use webhooks or streaming services when available.
* **Use the Data Streamer:** For monitoring large SIM batches, leverage the Data Streamer Service to avoid unnecessary API load and receive near real-time updates.

# 7. Timeout and Connection Management

To ensure smooth operation of your API client:

* **Set timeouts:** Avoid hanging requests by setting a reasonable timeout for your API calls.
* **Manage connection pooling:** For high-volume applications, use connection pooling to optimize resource usage.

**Example with Timeout:**

```python
response = requests.get(api_url, headers=headers, timeout=5)
```

# Summary

Integrating with the 1NCE Management API efficiently requires adhering to best practices for error handling, rate limiting, and making optimized API calls. By following these guidelines, you can ensure that your API client is performant, resilient to errors, and scalable for handling large datasets or high-frequency requests.

Ensure your development workflow incorporates proper error handling, token management, bulk operations, and efficient API usage to maximize the value of the 1NCE platform. For large-scale monitoring, the Data Streamer Service provides an ideal solution to manage SIM batches in real time without unnecessary API load.
