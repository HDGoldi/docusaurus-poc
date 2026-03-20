---
title: API Examples
---
The Admin Logs can be accessed via an API to allow customers to get their data in an automated way without going through the portal. The Admin Logs API description is available in the [API Explorer](ref:api-welcome).

***

# Examples

## Get Messages

### Device messages (7 days)

Getting all messages for a specific device for 7 days for a device with `ICCID` that is `123456789012345678`:

```shell
curl -X GET "https://api.1nce.com/management-api/v1/administrationLogs?iccid=123456789012345678"
```

The response looks like this:

```json
{
    "items": [
        {
            "id": "2LXBToi1yNaEWTiYYhyGS1AAerg",
            "customerId": "2000523120",
            "timestamp": "2023-02-10T09:21:15.634Z",
            "type": "DEVICE",
            "message": "Translator[UserPayloadError]",
            "description": "Asset path:longitude, Error: can't extract [0:8] from 1 bytes",
            "traceId": "1-63e60c8b-2c5f8668ca294dba54a16820",
            "category": "error",
            "imsi": "901408801893721",
            "ip":"10.209.106.1",
            "iccid":"123456789012345678",
            "payloadReference": "2000673166/2LXcToi1yNaEWTiYYhyGS1QBAerg"
        },        
        {
            "id": "2LEc7VjBK3AUtPa00WHQnOfd2cC",
            "customerId": "2000523120",
            "timestamp": "2023-02-03T12:50:56.800Z",
            "type": "LIFECYCLE",
            "message": "Lifecycle[DeviceFirstTimeRegistered]",
            "description": "New Device successfully registered for the first time - 8988228066601892721",
            "traceId": "1-63dd8630-364793628bf27f2b8c3cda07",
            "category": "info",
            "ip":"10.209.106.1",
            "iccid":"123456789012345678",
        },
    ],
    "page":1,
    "pageAmount":2
}
```

In the response, one item from the specific device (ICCID “123456789012345678“) is shown. It is an error message coming from the translator service.

### Messages Time Range

Getting messages in a specified time range for the same device but between `2022-02-21T13:20:00.000` and `2022-02-21T13:22:00.000`:

```shell
curl -X GET "https://api.1nce.com/management-api/v1/administrationLogs?startDateTime=2022-02-21T13:20:00.000&endDateTime=2022-02-21T13:22:00.000"
```

Both of the query parameters are optional, but one should be given. If only `startDateTime` is provided, the query will consider the end date-time to be the current time. If only `endDateTime` is provided, the start date-time will be the time seven days ago.

### Working with Pagination

By default, up to ten messages are returned from the API. The customer is able to specify the page size with the query parameter pageSize. The value of this parameter should be between 1 and 25. Example call to get a message of an example device in the page of three:

```shell
curl -X GET "https://api.1nce.com/management-api/v1/administrationLogs?iccid=123456789012345678&pageSize=3"
```

We can also go directly to a certain page by defining the parameter page. We would directly go to page number two with this request:

```shell
curl -X GET "https://api.1nce.com/management-api/v1/administrationLogs?iccid=123456789012345678&pageSize=3&page=2"
```

### Calling endpoint without query parameters

```shell
curl -X GET "https://api.1nce.com/management-api/v1/administrationLogs"
```

With this request you get the last ten messages from all devices within the last seven days.

## Get Message Stats

### Calling Message Stats endpoint

To get the message statistics, you need to specify a timezone (mandatory) and you can filter on category if necessary.

```shell
curl -X GET "https://api.1nce.com/management-api/v1/administrationLogs/stats?timezone=Europe%2FAmsterdam&category=info"
```

With this request you get the statistics for the timezone CET and we set a filter for the category `info`.

We would get the following response:

```json
{
  "totalUniqueDevices": 2,
  "administrationLogs": [
    {
      "amount": 2,
      "day": "2022-03-07T00:00:00.000+0000"
    },
    {
      "amount": 2,
      "day": "2022-03-08T00:00:00.000+0000"
    }
  ]
}
```
