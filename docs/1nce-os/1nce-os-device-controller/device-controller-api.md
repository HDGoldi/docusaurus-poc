---
title: API Examples
---
The Device Controller can be accessed via an API to allow customers to send data to the devices in an automated way without going through the portal.\
The Device Controller API description is available in the [API Explorer](ref:api-welcome).

# Examples

## Create Action Request

An action request can include different fields per protocol. Therefore, an example request body is given for every protocol.

### UDP

Creating UDP action request for a device with deviceId `123456789012345678`:

```shell
curl -X POST "https://api.1nce.com/management-api/v1/integrate/devices/123456789012345678/actions/UDP"
```

The request body looks like this:

```json
{
  "payload": "Data to send to the device",
  "payloadType": "STRING",
  "port": 3000,
  "requestMode": "SEND_NOW"
}
```

### CoAP

Creating CoAP action request for a device with deviceId `123456789012345678`:

```shell
curl -X POST "https://api.1nce.com/management-api/v1/integrate/devices/123456789012345678/actions/COAP"
```

The request body looks like this:

```json
{
  "payload": "Data to send to the device",
  "payloadType": "STRING",
  "port": 3000,
  "path": "/example?param1=query_param_example",
  "requestType": "POST",
  "requestMode": "SEND_NOW"
}
```

### LwM2M

Creating LwM2M action request for a device with deviceId `123456789012345678`:

```shell
curl -X POST "https://api.1nce.com/management-api/v1/integrate/devices/123456789012345678/actions/LWM2M"
```

The request body looks like this:

```json
{
  "action": "write",
  "resourceAddress": "/3311/0/5850",
  "data": "Data to send to the device",
  "requestMode": "SEND_WHEN_ACTIVE"
}
```

### Bulk request

Creating LwM2M action request for multiple devices:

```shell
curl -X POST "https://api.1nce.com/management-api/v1/integrate/devices/actions/LWM2M"
```

The request body looks like this:

```json
{
  "action": "write",
  "resourceAddress": "/3311/0/5850",
  "data": "Data to send to the device",
  "requestMode": "SEND_WHEN_ACTIVE",
  "deviceIds": ["123456789012345678", "123456789012345679", "123456789012345680"]
}
```

### Retry Mechanism

When submitting an action request with `SEND_WHEN_ACTIVE` mode, the user can specify the parameter `sendAttempts` in\
the request body to restrict how many times the device controller can attempt to send the data to the device.<br/>\
If all attempts fail, then the action request will be permanently marked with the status `FAILED`.

The `sendAttempts` parameter is optional and, if unspecified, defaults to 1.<br/>\
The maximum number of allowed retries is 5.

:::warning
Please note that this functionality is **NOT supported by the UDP protocol**.
:::


### Request Body Properties

These are the properties of a request body. It specifies when and which message will be sent to the device.

| Property        | Data Type | Description                                                                                  | Available for protocol. \*Optional |
| :-------------- | :-------- | :------------------------------------------------------------------------------------------- | :--------------------------------- |
| payload         | STRING    | Data to send to the device.                                                                  | UDP, \*CoAP                        |
| payloadType     | ENUM      | Type of the payload. Values: `STRING`, `BASE64`.                                             | UDP, \*CoAP                        |
| port            | INTEGER   | Communication port number of a device.                                                       | UDP, CoAP                          |
| requestMode     | ENUM      | Values: `SEND_NOW`, `SEND_WHEN_ACTIVE` (when a device sends a message). Default: `SEND_NOW`. | \*UDP, \*CoAP, \*LwM2M             |
| path            | STRING    | Absolute path to the resource.                                                               | CoAP                               |
| requestType     | ENUM      | Method used to send message. Values: `GET`, `POST`, `PUT`, `DELETE`, `PATCH`.                | CoAP                               |
| action          | ENUM      | LwM2M action name. Values: `read`, `write`, `execute`, `observe-start`, `observe-end`.       | LwM2M                              |
| resourceAddress | STRING    | LwM2M OMA object resource address.                                                           | LwM2M                              |
| data            | STRING    | Data to send to the device.                                                                  | \*LwM2M                            |
| sendAttempts    | INTEGER   | The maximum number of attempts to send data to the device. Default: 1                        | \*CoAP, \*LWM2M                    |

***

Note that for LwM2M there's no possibility to provide a data type for the `data` property. For LwM2M we support 8 data types: TIME, STRING, BOOLEAN, INTEGER, FLOAT, UNSIGNED\_INTEGER, OBJLINK and OPAQUE. The data type depends on the addressed resource. Users should provide the data in a stringified format (base64 encoded string for OPAQUE). In case an invalid data type for a resource is used, an Admin Log will be created.

### Response

The API will accept the request with a `202 Accepted` response code and a response body containing two properties: id (string) and message (string). The id can be used to track the status of the request or cancel the request (see examples below). The message property contains a confirmation message about the request created. Example:

```json
{
  "id": "trxHeBL0d234fsfds",
  "message": "Action read for resource /3/45/22 successfuly scheduled for device 123456789012345678."
}
```

## Get action request(s)

Get action request(s) endpoints are available to track the status of the request and potentially see the response from a device using CoAP/LwM2M. The `requestData` property return protocol-specific request data provided when the request was created. For LwM2M the `responseData` can contain the following properties if available: `code` (response code), `payload` (data from the device), for Coap there is also additional field - `payloadType` (payload type). The `payloadType` is either `TEXT` when the response content format is printable, or `BASE64` if the content format is not printable or not present at all. In case an error occurs, the field `errorMessage` is present in the `responseData`.

### By specific requestId

Getting request with id `trxHeBL0d234fsfds`:

```shell
curl -X GET "https://api.1nce.com/management-api/v1/integrate/devices/actions/requests/trxHeBL0d234fsfds"
```

The response could be `200 OK` with body:

```json
{
  "id": "trxHeBL0d234fsfds",
  "status": "SUCCEEDED",
  "deviceId": "123456789012345678",
  "ip": "127.0.0.1",
  "protocol": "LWM2M",
  "created": "2024-08-22T11:14:28.157Z",
  "updated": "2024-08-22T11:14:28.157Z",
  "mode": "SEND_WHEN_ACTIVE",
  "resultData": {
    "code": "205",
    "payload": "Data from the device",
    "payloadType": "TEXT"
  },
  "requestData": {
    "action": "write",
    "resourceAddress": "/3311/0/5850",
    "data": "Data to send to the device",
    "iccid": "123456789012345678",
    "imsi1": "456789012345678",
    "traceId": "1-66c71d94-f8f46a5cb7ae4ac4def607f1",
    "deviceId": "123456789012345678",
    "requestId": "trxHeBL0d234fsfds",
    "customerId": "1234567890",
    "requestMode": "SEND_WHEN_ACTIVE",
    "deviceIpAddress": "127.0.0.1"
  },
  "sendAttemptsLeft": 0,
  "sendAttempts": 3
}
```

For LwM2M `resultData` could be

```json
{
  "resultData": {
    "code": "205",
    "payload": "Data from the device"
  }
}
```

For CoAP `resultData` printable text:

```json
{
  "resultData": {
    "code": "205",
    "payload": "Data from the device",
    "payloadType": "TEXT"
  }
}
```

For CoAP `resultData` binary text:

```json
{
  "resultData": {
    "code": "205",
    "payload": "RGF0YSBmcm9tIHRoZSBkZXZpY2U=",
    "payloadType": "BASE64"
  }
}
```

### By using the optional filter query parameters

There are 2 endpoints available that support query parameters and are meant to query action requests by different statuses:

[Active action requests](ref:get_v1-integrate-devices-actions-requests-active) are those which have statuses `IN_PROGRESS `and `SCHEDULED`

[Archived action requests](ref:get_v1-integrate-devices-actions-requests-archived) are those which have statuses `CANCELLED`,`FAILED` and `SUCCEEDED`

Getting multiple **archived** requests with optional filters (query parameters) specified. For example, to get all LwM2M action requests that succeeded for a device with id 123456789012345678::

```shell
curl -X GET "https://api.1nce.com/management-api/v1/integrate/devices/actions/requests/archived?protocol=LWM2M&deviceId=123456789012345678&status=SUCCEEDED"
```

The response could be `200 OK` response code with body:

```json
{
  "items": [
    {
      "id": "2l0mG3WulN1SUvlIcHjvKXBeZk0",
      "status": "SUCCEEDED",
      "deviceId": "123456789012345678",
      "ip": "127.0.0.1",
      "protocol": "LWM2M",
      "created": "2024-08-22T11:14:28.157Z",
      "updated": "2024-08-22T11:14:28.157Z",
      "mode": "SEND_WHEN_ACTIVE",
      "resultData": {
        "code": "205",
        "payload": "Data from the device"
      },
      "requestData": {
        "data": "Data to send to the device",
        "iccid": "123456789012345678",
        "imsi1": "456789012345678",
        "action": "write",
        "traceId": "1-66c71d94-f8f46a5cb7ae4ac4def607f1",
        "deviceId": "123456789012345678",
        "requestId": "2l0mG3WulN1SUvlIcHjvKXBeZk0",
        "customerId": "1234567890",
        "requestMode": "SEND_WHEN_ACTIVE",
        "deviceIpAddress": "127.0.0.1",
        "resourceAddress": "/3311/0/5850"
      },
      "sendAttemptsLeft": 0,
      "sendAttempts": 3
    }
  ],
  "page": 1,
  "pageAmount": 1
}
```

Getting multiple **active** requests with optional filters (query parameters) specified. For example, to get all UDP action requests that are scheduled for a device with id 123456789012345678::

```shell
curl -X GET "https://api.1nce.com/management-api/v1/integrate/devices/actions/requests/active?protocol=UDP&deviceId=123456789012345678&requestMode=SEND_WHEN_ACTIVE"
```

The response could be `200 OK` response code with body:

```json
{
  "items": [
    {
      "id": "2l0kyyq0zGSuc1C78NKe5Pc3Auk",
      "status": "SCHEDULED",
      "deviceId": "123456789012345678",
      "ip": "127.0.0.1",
      "protocol": "UDP",
      "created": "2024-08-22T11:03:59.267Z",
      "updated": "2024-08-22T11:03:59.267Z",
      "mode": "SEND_WHEN_ACTIVE",
      "requestData": {
        "port": 4343,
        "iccid": "123456789012345678",
        "imsi1": "456789012345678",
        "payload": "Hello world",
        "traceId": "1-66c71b1f-64f6213bb0ea04d2f5784494",
        "deviceId": "123456789012345678",
        "requestId": "2l0kyyq0zGSuc1C78NKe5Pc3Auk",
        "customerId": "1234567890",
        "payloadType": "STRING",
        "requestMode": "SEND_WHEN_ACTIVE",
        "deviceIpAddress": "127.0.0.1"
      },
      "sendAttemptsLeft": 1,
      "sendAttempts": 1
    }
  ],
  "page": 1,
  "pageAmount": 1
}
```

## Delete action request(s)

The delete endpoint is used the cancel requests. This means `SCHEDULED` requests will be updated to the status `CANCELLED`. The messages will not be sent to the device.

### By specific requestId

Delete request with id `trxHeBL0d234fsfds`:

```shell
curl -X DELETE "https://api.1nce.com/management-api/v1/integrate/devices/actions/requests/trxHeBL0d234fsfds"
```

The response could be `200 OK` response code with body:

```json
{
  "id": "trxHeBL0d234fsfds",
  "status": "CANCELLED"
}
```

### By deviceId

Delete all requests for device with id `123456789012345678`:

```shell
curl -X DELETE "https://api.1nce.com/management-api/v1/integrate/devices/123456789012345678/actions/requests"
```

The response could be `200 OK` response code with body:

```json
[{
  "id": "trxHeBL0d234fsfds",
  "status": "CANCELLED"
}]
```
