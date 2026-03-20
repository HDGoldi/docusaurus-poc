---
title: Webhook Configuration
---
To start using the Cloud Integrator with webhook integration, an HTTPS endpoint should be created. 

The endpoint could be either an IP address or a domain name. Depending on the customer's network security - it is possible\
that the webhook source IPs should be whitelisted. The following IPs will forward data to the webhook endpoint(s):

* 52.29.71.11
* 18.157.211.95

# Configuration via Frontend

## Webhook Creation

To create a webhook you should at least define an own integration name and an endpoint URL.

Further fields that can be specified are:

* [Event Types](doc:1nce-os-cloud-integrator#event-types) to listen to.
* Custom HTTP headers for webhooks.
* Whether non-translated messages should be parsed to JSON, if possible.

<div style={{textAlign: 'center'}}>
![Configuration of a Webhook in the Frontend](/img/1nce-os/1nce-os-cloud-integrator/cloud-integrator-webhook-configuration/013c5f1fdb167bce2cb12845d8b1b15b44f072c7c005e1eb75e7289954fd0df8-webhook-creation.png)
</div>

# Webhook Configuration via API

## Webhook Creation

* Headers object in the request body should contain authorization and configuration headers that are expected by the customer's endpoint.

Example:

```curl
curl --location --request POST 'https://api.1nce.com/management-api/v1/integrate/clouds/webhooks' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "webhook-name-1",
    "url": "https://www.your-endpoint.com/messages1",
    "headers": {"x-api-key": "ABCDEFGHIJKLMNOPQRSTUVWXYZ"},
    "eventTypes": [{ "type": "TELEMETRY_DATA" }]
}'
```

<br />

### Metadata Injection in Webhook Definitions

Webhook definitions support metadata injection in the `url` and `headers` fields using placeholders.\
These placeholders will be automatically replaced with data from the device that triggered the event, such as telemetry\
data or location events.

The following placeholders can be used in the `url` and `headers` fields:

| Placeholder | Description              | Default Value (if unavailable) |
| ----------- | ------------------------ | ------------------------------ |
| `:iccid:`   | ICCID of the device      | `none`                         |
| `:imsi:`    | IMSI1 of the device      | `none`                         |
| `:ip:`      | IP address of the device | `none`                         |

<Table>
  <thead>
    <tr>
      <th>
        :information_source:
      </th>

      <th>
        If an event does not contain the required data, the corresponding placeholder will be replaced with 

        `none`
      </th>
    </tr>
  </thead>

  <tbody />
</Table>

<Table>
  <thead>
    <tr>
      <th>
        :warning:
      </th>

      <th>
        If a webhook definition contains an unsupported placeholder, it will remain unchanged.
      </th>
    </tr>
  </thead>

  <tbody />
</Table>

#### Examples

Consider the following webhook configuration:

```json
{
    "name": "webhook-name-1",
    "url": "https://www.your-endpoint.com/events?iccid=:iccid:&ip=:ip:&imsi=:imsi:",
    "headers": {
        "x-api-key": "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
        "x-device-imsi": ":imsi:",
        "x-device-iccid": ":iccid:",
        "x-device-ip": ":ip:"
    },
    "eventTypes": [{ "type": "TELEMETRY_DATA" }]
}
```

#### Scenario - Full Device Metadata Injection

For an event coming from a device with the following attributes:

* **ICCID**: `1234567890123456789`
* **IMSI**: `987654321098765`
* **IP**: `192.168.1.1`

The webhook request will be transformed as follows:

* **URL:**\
  `https://www.your-endpoint.com/events?iccid=1234567890123456789&ip=192.168.1.1&imsi=987654321098765`
* **Headers:**
  ```json
  {
      "x-api-key": "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      "x-device-imsi": "987654321098765",
      "x-device-iccid": "1234567890123456789",
      "x-device-ip": "192.168.1.1"
  }
  ```

#### Scenario - Missing Metadata

For an admin log event that is unrelated to a specific device, no metadata can be injected an the placeholders will be\
replaced with `none`.

The webhook request will be transformed as follows:

* **URL:**\
  `https://www.your-endpoint.com/events?iccid=none&ip=none&imsi=none`
* **Headers:**
  ```json
  {
      "x-api-key": "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      "x-device-imsi": "none",
      "x-device-iccid": "none",
      "x-device-ip": "none"
  }
  ```

#### Scenario - Unsupported Placeholders

If a webhook definition contains an unsupported placeholder, it will remain unchanged.

```json
{
    "name": "webhook-name-2",
    "url": "https://api.example.com/data?destination=:unknown:",
    "headers": {
        "x-tracking": ":tracking_id:"
    }
}
```

Since `:unknown:` and `:tracking_id:` are not supported, the resulting webhook request will be:

* **Final URL:** `https://api.example.com/data?destination=:unknown:`
* **Headers:**
  ```json
  {
      "x-tracking": ":tracking_id:"
  }
  ```

<br />

## Get all Integrations

```curl
curl --location --request GET 'https://api.1nce.com/management-api/v1/integrate/clouds'
```

Response Example:

```json
{
  "page":1,
  "pageAmount":1,
  "items":
  [
    {
      "id":"AP3dIUs3c7_Oo2yJYaXWg",
      "name":"test_integration",
      "state":"INTEGRATION_FAILED",
      "type":"WEBHOOK",
      "createdTime":"2022-11-22T12:16:30.814Z",
      "updatedTime":"2022-11-23T08:07:19.354Z",
      "eventTypes":
      [
        {
          "type":"LIFECYCLE",
          "version":"1.0.0"
        },
        {
          "type":"TELEMETRY_DATA",
          "version":"1.0.0"
        }
      ]
    },
    {
      "id":"Jv2cS-pPcy0NdtQ64ycZJ",
      "lastSuccessfulMessageDelivery":"2022-12-07T12:29:51.927Z",
      "name":"beeceptor-webhook-int",
      "state":"INTEGRATION_ACTIVE",
      "type":"WEBHOOK",
      "createdTime":"2022-09-16T11:01:11.390Z",
      "updatedTime":"2022-12-09T11:23:48.609Z",
      "eventTypes":
      [
        {
          "type":"LIFECYCLE",
          "version":"1.0.0"
        },
        {
          "type":"TELEMETRY_DATA",
          "version":"1.0.0"
        }
      ]
    },
    {
      "id":"MzSca5vvHAfJ4MUUCfCGb",
      "name":"rollout-started-int",
      "state":"ROLLOUT_STARTED",
      "type":"AWS",
      "createdTime":"2022-10-17T13:30:15.309Z",
      "updatedTime":"2022-10-17T13:30:15.309Z",
      "eventTypes":
      [
        {
          "type":"LIFECYCLE",
          "version":"1.0.0"
        }
      ]
    }
  ]
}
```

## Integration Edit

To edit your webhook integration via API, you can use following curl request:

```curl
curl --request PATCH \
     --url https://api.1nce.com/management-api/v1/integrate/clouds/webhooks/{integrationId} \
     --header 'accept: application/json' \
     --header 'authorization: Bearer {token}' \
     --header 'content-type: application/json' \
     --data '
{
     "eventTypes": [
          {
               "type": "LIFECYCLE"
          }
     ],
     "url": "www.example.com",
     "jsonPayloadEnabled": false
}
'
```

## Test Integration

To send test message to your webhook integration via API, you can use following curl request:

```curl
curl --location --request POST 'https://api.1nce.com/management-api/v1/integrate/clouds/webhooks/{integrationId}/test'
```

<Table>
  <thead>
    <tr>
      <th>
        :information_source:
      </th>

      <th>
        Any metadata injection placeholder will resolve to 

        `none`
      </th>
    </tr>
  </thead>

  <tbody />
</Table>

<Table>
  <thead>
    <tr>
      <th>
        :information_source:
      </th>

      <th>
        This functionality does not update "First Successful Message Delivery" field value.
      </th>
    </tr>
  </thead>

  <tbody />
</Table>

## Integration Restart

After 5 unsuccessful message attempts for a webhook it will be set to state `INTEGRATION_FAILED`.

To restart the webhook:

```curl
curl --location --request POST 'https://api.1nce.com/management-api/v1/integrate/clouds/webhooks/{integrationId}/restart'
```

<Table>
  <thead>
    <tr>
      <th>
        :information_source:
      </th>

      <th>
        Any metadata injection placeholder will resolve to 

        `none`
      </th>
    </tr>
  </thead>

  <tbody />
</Table>

<Table>
  <thead>
    <tr>
      <th>
        :information_source:
      </th>

      <th>
        This functionality does not update "First Successful Message Delivery" field value.
      </th>
    </tr>
  </thead>

  <tbody />
</Table>
