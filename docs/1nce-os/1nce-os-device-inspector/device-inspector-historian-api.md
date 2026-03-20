---
title: Historian API Examples
---
The Device Inspector Historian has an API to allow users to get their data without going to the portal. The full Historian API description is available in the [API Explorer](ref:api-welcome).

***

# Examples

## Get Messages

### Device messages (7 days)

Getting all messages for a specific device for 7 days for a device with iccid `123456789012345678` would be:

```shell
curl -X GET https://api.1nce.com/management-api/v1/inspect/devices/history?iccid=123456789012345678
```

We would receive a response like:

```json
{
  "items": [
    {
      "time": "2022-02-21T12:47:30.085",
      "payload": "{\"battery\":98,\"saturation\":0.55,\"temperature\":11.6}",
      "iccid": "123456789012345678",
      "deviceId": "123456789012345678",
      "protocol": "UDP"
    },
    {
      "time": "2022-02-21T12:47:24.278",
      "payload": "{\"battery\":99,\"saturation\":0.55,\"temperature\":11.5}",
      "iccid": "123456789012345678",
      "deviceId": "123456789012345678",
      "protocol": "UDP"
    },
    {
      "time": "2022-02-21T12:47:21.495",
      "payload": "dGVzdGRhdGE=",
      "iccid": "123456789012345678",
      "deviceId": "123456789012345678",
      "protocol": "COAP"
    }
  ]
}
```

In the response, we can see that a device (that has ICCID “123456789012345678“ and if it has a 1NCE sim also deviceId “123456789012345678“), sent 2 UDP and 1 CoAP message. The payload in each UDP message is a JSON string because the Translation service was used. CoAP message has base64 encoded payload. These are the only messages the device was sending in 7 days because we didn’t specify time constraints and the query was using the default value.

### Messages Timerange

Getting messages in the specified time range for the same device but in the time range between `2022-02-21T13:20:00.000` and `2022-02-21T13:22:00.000`:

```shell
curl -X GET "https://api.1nce.com/management-api/v1/inspect/devices/123456789012345678/history?startDateTime=2022-02-21T13:20:00.000&endDateTime=2022-02-21T13:22:00.000"
```

The response would be in a similar format as before, but the messages would only be those that were received in the requested time range:

```json
{
  "items": [
    {
      "time": "2022-02-21T13:21:50.268",
      "payload": "{\"battery\":98,\"saturation\":0.57,\"temperature\":11.0}",
      "iccid": "123456789012345678",
      "deviceId": "123456789012345678",
      "protocol": "UDP"
    },
    {
      "time": "2022-02-21T13:21:41.504",
      "payload": "{\"battery\":98,\"saturation\":0.57,\"temperature\":11.1}",
      "iccid": "123456789012345678",
      "deviceId": "123456789012345678",
      "protocol": "UDP"
    }
  ]
}
```

Both of the query parameters are optional. If only `startDateTime` is provided, the query will consider the end date-time to be the current time. If only `endDateTime` is provided, the start date-time will be the time 7 days ago.

### Specifying Message Protocol

The API can return messages that were sent by the device using a specific protocol (either UDP, CoAP, or LwM2M). To get only CoAP messages sent by the same device `123456789012345678` (without specific time range):

```shell
curl -X GET "https://api.1nce.com/management-api/v1/inspect/devices/123456789012345678/history?protocol=CoAP"
```

We would receive only messages that were sent with CoAP protocol in the last 7 days:

```json
{
  "items": [
    {
      "time": "2022-02-21T13:00:08.066",
      "payload": "dGVzdGRhdGE=",
      "iccid": "123456789012345678",
      "deviceId": "123456789012345678",
      "protocol": "COAP"
    },
    {
      "time": "2022-02-21T13:00:08.056",
      "payload": "dGVzdGRhdGE=",
      "iccid": "123456789012345678",
      "deviceId": "123456789012345678",
      "protocol": "COAP"
    }
  ]
}
```

### Working with Pagination

By default, up to 10 messages are returned from the API. The user is able to specify page size with a query parameter pageSize. The value of this parameter should be between 1 and 25. Example call to get UDP messages of the example device in the page of 3:

```shell
curl -X GET "https://api.1nce.com/management-api/v1/inspect/devices/history?iccid=123456789012345678&protocol=UDP&pageSize=3"
```

The response would be:

```json
{
  "items": [
    {
      "time": "2022-02-21T13:21:50.268",
      "payload": "{\"battery\":98,\"saturation\":0.57,\"temperature\":11.1}",
      "iccid": "123456789012345678",
      "deviceId": "123456789012345678",
      "protocol": "UDP"
    },
    {
      "time": "2022-02-21T13:21:45.480",
      "payload": "{\"battery\":98,\"saturation\":0.57,\"temperature\":11.1}",
      "iccid": "123456789012345678",
      "deviceId": "123456789012345678",
      "protocol": "UDP"
    },
    {
      "time": "2022-02-21T13:21:44.360",
      "payload": "{\"battery\":98,\"saturation\":0.57,\"temperature\":11.0}",
      "iccid": "123456789012345678",
      "deviceId": "123456789012345678",
      "protocol": "UDP"
    }
  ],
  "nextToken": "AYAFeEdvNYWYGIwsjZX2PFMhRfoAAAA...",
  "firstToken": "AYAXeFiqDUzhDQ7Tvjydy4JkuuoAAAA..."
}
```

We can see that there are two extra fields in the response: nextToken and firstToken. This means that there are more records to see than this. If we would pass nextToken as a query parameter, we would get the next page of data:

```shell
curl -X GET "https://api.1nce.com/management-api/v1/devices/messages?iccid=123456789012345678&protocol=UDP&pageSize=3&nextToken=AYAFeEdvNYWYGIwsjZX2PFMhRfoAAAA..."
```

We would get the data:

```json
{
	"items": [
		{
			"time": "2022-02-21T12:47:21.495",
			"payload": "{\"battery\":98,\"saturation\":0.57,\"temperature\":11.2}",
			"iccid": "123456789012345678",
			"deviceId": "123456789012345678",
			"protocol": "UDP"
		}
	]
}
```

In this case, there are no extra fields which means no more records to see. If we would provide `firstToken` as a `nextToken` in the query, we would get the same result as we had when we called it the first time (even if there were new messages by this time).

### Specifying Timezone

For ease of dealing with time zones, we can specify them in the query. To query in scope of +2 time zone:

```shell
curl -X GET "https://api.1nce.com/management-api/v1/inspect/devices/123456789012345678/history?startDateTime=2022-02-21T16:20:00.000+02:00&endDateTime=2022-02-21T16:30:00.000+02:00"
```

We would get the same time zone in the response as well:

```json
{
	"items": [
		{
			"time": "2022-02-21T16:25:57.740",
			"payload": "{\"battery\":98,\"saturation\":0.57,\"temperature\":11.2}",
			"iccid": "123456789012345678",
			"deviceId": "123456789012345678",
			"protocol": "UDP"
		},
		{
			"time": "2022-02-21T16:21:49.651",
			"payload": "{\"battery\":98,\"saturation\":0.57,\"temperature\":11.0}",
			"iccid": "123456789012345678",
			"deviceId": "123456789012345678",
			"protocol": "UDP"
		}
	]
}
```

### Calling endpoint without query parameters

```shell
curl -X GET "https://api.1nce.com/management-api/v1/inspect/devices/history"
```

We would get the last 10 messages from all devices within the last 7 days.

```json
{
    "items": [
        {
            "time": "2022-02-21T16:25:57.740",
            "payload": "{\"battery\":98,\"saturation\":0.57,\"temperature\":11.2}",
            "iccid": "543216789012345678",
            "deviceId": "543216789012345678",
            "protocol": "COAP"
        },
        {
            "time": "2022-02-21T17:25:57.740",
            "payload": "{\"battery\":97,\"saturation\":0.57,\"temperature\":11.2}",
            "iccid": "543216789012345678",
            "deviceId": "543216789012345678",
            "protocol": "COAP"
        },
        {
            "time": "2022-02-21T18:25:57.740",
            "payload": "{\"battery\":96,\"saturation\":0.57,\"temperature\":11.2}",
            "iccid": "543216789012345678",
            "deviceId": "543216789012345678",
            "protocol": "COAP"
        },
        {
            "time": "2022-02-21T19:25:57.740",
            "payload": "{\"battery\":94,\"saturation\":0.57,\"temperature\":11.2}",
            "iccid": "543216789012345678",
            "deviceId": "543216789012345678",
            "protocol": "COAP"
        },
        {
            "time": "2022-02-22T16:21:49.651",
            "payload": "{\"battery\":98,\"saturation\":0.57,\"temperature\":11.0}",
            "iccid": "123456789012345678",
            "deviceId": "123456789012345678",
            "protocol": "UDP"
        },
        {
            "time": "2022-02-22T16:23:49.651",
            "payload": "{\"battery\":98,\"saturation\":0.58,\"temperature\":11.0}",
            "iccid": "123456789012345678",
            "deviceId": "123456789012345678",
            "protocol": "UDP"
        },
        {
            "time": "2022-02-22T16:25:49.651",
            "payload": "{\"battery\":98,\"saturation\":0.59,\"temperature\":11.0}",
            "iccid": "123456789012345678",
            "deviceId": "123456789012345678",
            "protocol": "UDP"
        },
        {
            "time": "2022-02-22T16:27:49.651",
            "payload": "{\"battery\":98,\"saturation\":0.60,\"temperature\":11.0}",
            "iccid": "123456789012345678",
            "deviceId": "123456789012345678",
            "protocol": "UDP"
        },
        {
            "time": "2022-02-22T16:29:49.651",
            "payload": "{\"battery\":98,\"saturation\":0.61,\"temperature\":11.0}",
            "iccid": "123456789012345678",
            "deviceId": "123456789012345678",
            "protocol": "UDP"
        },
        {
            "time": "2022-02-22T16:31:49.651",
            "payload": "{\"battery\":98,\"saturation\":0.63,\"temperature\":11.0}",
            "iccid": "123456789012345678",
            "deviceId": "123456789012345678",
            "protocol": "UDP"
        }
    ],
    "nextToken": "AYABeJNbCVkFnuUD8Lwc.....",
    "firstToken": "AYABeGNSdMbKy3uSXn2Z...."
}
```

## Get Historian Insights

### Calling Historian Insights endpoint without query parameters

```shell
curl -X GET "https://api.1nce.com/management-api/v1/inspect/devices/history/insights"
```

We would get a number of messages in the 1-day intervals for specific protocols for the last 7 days.

```json
{
    "items": [
        {
            "time": "2022-03-23T00:00:00.000",
            "protocol": "COAP",
            "amount": 1
        },
        {
            "time": "2022-03-22T00:00:00.000",
            "protocol": "COAP",
            "amount": 13
        },
        {
            "time": "2022-03-22T00:00:00.000",
            "protocol": "LWM2M",
            "amount": 27
        },
        {
            "time": "2022-03-21T00:00:00.000",
            "protocol": "LWM2M",
            "amount": 1
        },
        {
            "time": "2022-03-21T00:00:00.000",
            "protocol": "UDP",
            "amount": 1
        },
        {
            "time": "2022-03-18T00:00:00.000",
            "protocol": "LWM2M",
            "amount": 62
        },
        {
            "time": "2022-03-18T00:00:00.000",
            "protocol": "UDP",
            "amount": 1
        },
        {
            "time": "2022-03-17T00:00:00.000",
            "protocol": "LWM2M",
            "amount": 2
        }
    ],
    "interval": "1d"
}
```
