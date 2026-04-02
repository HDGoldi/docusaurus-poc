---
title: Output Format
sidebar_position: 5
---
## AWS Integration MQTT Topics

For AWS Integrations the messages will be forwarded to a dedicated AWS IoT Core MQTT topic for each event type.

| Event Type | AWS IoT Core MQTT Topic |
| --- | --- |
| ERROR | `error` |
| GEOFENCE | `geofence` |
| LOCATION | `location` |
| LIFECYCLE | `lifecycle` |
| TELEMETRY_DATA | LWM2M & UDP protocol: `{{iccid}}/messages` CoAP protocol with provided [query parameter _t_](/1nce-os/1nce-os-device-integrator/device-integrator-coap): `{{iccid}}/{\{query\_parameter\_t}}` CoAP protocol without provided [query parameter _t_](/1nce-os/1nce-os-device-integrator/device-integrator-coap): `{{iccid}}` |
| TEST_MESSAGE | `integration-status` |

***

## Examples

### TELEMETRY_DATA

```json
{
  "payload": {
    "type": "JSON",
    "value": {
      "latitude": 7.490929188596135e+247,
      "longitude": 2.586343401687847e+161
    }
  },
  "received": "1670598749915",
  "id": "1-6393505d-67fa8489fb9c791fcddd43f0",
  "source": "UDP",
  "type": "TELEMETRY_DATA",
  "version": "1.0.0",
  "device": {
    "iccid": "8988280666000002864",
    "ip": "100.91.200.24",
    "imsi": "901405100002864"
  }
}
```

### LIFECYCLE

```json
{
  "lifecycle": {
    "type": "DEVICE_FIRST_TIME_REGISTERED",
    "message": "New Device successfully registered for the first time - 8988280666000002864"
  },
  "received": "1670830184814",
  "id": "1-6396d868-d00f68b911b75bc761768e9b",
  "type": "LIFECYCLE",
  "version": "1.0.0",
  "device": {
    "iccid": "8988280666000002864",
    "ip": "100.91.200.24",
    "imsi": "901405100002864"
  }
}
```

### ERROR

```json
{
  "id": "1-87654321-4fff5fb82c196babcd00008",
  "type": "ERROR",
  "received": "1649931594333",
  "device": {
    "iccid": "1234567890123456789",
    "imsi": "987654321098765",
    "ip": "127.0.0.1"
  },
  "error": {
    "id": "3dsd627637267sahdgyasd",
    "type": "DEVICE",
    "message": "Translator[UserPayloadError]",
    "description": "Asset path:Temperature, Error: can't extract [200:201] from 2 bytes",
    "payloadExists": true
  },
  "version": "1.0.0"
}
```

### GEOFENCE

```json
{
  "id": "1-87654321-4fff5fb82c196babcd00007",
  "type": "GEOFENCE",
  "received": "1649931594333",
  "geofence": {
    "id": "Wg9ys5VqmSNN8M8YN2rv8",
    "name": "TEST_GEOFENCE_1",
    "coordinates": ["24.166234790073986","56.977086867785"],
    "source": "CellTower",
    "type": "EXIT"
  },
  "device": {
    "ip": "100.91.200.20",
    "iccid": "1234567890123456789",
    "imsi": "987654321098765"
  },
  "version": "1.0.0"
}
```

### LOCATION

```json
{
  "id": "1-87654321-4fff5fb82c196babcd00007",
  "type": "LOCATION",
  "received": "1649931594333",
  "location": {
    "source": "CellTower",
    "coordinates": ["24.166234790073986","56.977086867785"],
    "metadata": {
      "verticalAccuracy": 45,
      "verticalConfidenceLevel": 0.68,
      "horizontalAccuracy": 303,
      "horizontalConfidenceLevel": 0.68
    }
  },
  "device": {
    "ip": "100.91.200.20",
    "iccid": "1234567890123456789",
    "imsi": "987654321098765"
  },
  "version": "1.0.0"
}
```

:warning: Note that `metadata` parameter with accuracy data is only available in **Plus** CellTower locator mode.\ <br />

### TEST_MESSAGE

This event can be triggered by [Test AWS Integration](ref:post_v1-integrate-clouds-aws-integrationid-test) or [Test Webhook Integration](ref:post_v1-integrate-clouds-webhooks-integrationid-test) endpoints. This event will be triggered also if an integration with status `INTEGRATION_FAILED` will be restarted.

```json
{
  "id": "1-63d889d3-d987cbb90f8f10c76278d8dd",
  "type": "TEST_MESSAGE",
  "received": "1675135445411",
  "integration": {
    "id": "X8qB3FhJQyffUH0GqL3gC",
    "name": "integration-name"
   },
  "version": "1.0.0"
}
```

***

# Message Properties

These are the properties of a message. It contains parameters that help to identify the message and the device that has sent the message.

| Property    | Data Type   | Description                                                                                          | Present in event types. *Optional                     |
| :---------- | :---------- | :--------------------------------------------------------------------------------------------------- | :---------------------------------------------------- |
| type        | ENUM        | Source event type. <br /> Values: `LIFECYCLE`, `TELEMETRY_DATA`, `ERROR`, `GEOFENCE`, `TEST_MESSAGE` | All                                                   |
| received    | STRING      | UNIX Timestamp. Received message date and time in milliseconds since midnight, January 1, 1970 UTC.  | All                                                   |
| source      | ENUM        | Values: `UDP`, `COAP`,  `LWM2M`                                                                      | TELEMETRY_DATA                                        |
| version     | STRING      | Version number of our Payload-Format. With new version, format can change.                           | All                                                   |
| id          | STRING      | Unique ID for each message sent.                                                                     | All                                                   |
| device      | JSON Object | Object describing device from which the message was received.                                        | TELEMETRY_DATA, GEOFENCE, LIFECYCLE, *ERROR, LOCATION |
| payload     | JSON Object | Object describing message payload.                                                                   | TELEMETRY_DATA                                        |
| lifecycle   | JSON Object | Lifecycle object.                                                                                    | LIFECYCLE                                             |
| error       | JSON Object | Object describing error.                                                                             | ERROR                                                 |
| geofence    | JSON Object | Object describing geofence event.                                                                    | GEOFENCE                                              |
| integration | JSON Object | Object describing integration.                                                                       | TEST_MESSAGE                                          |
| location    | JSON Object | Object describing location.                                                                          | LOCATION                                              |

***

# Payload Properties

These are the properties of a message payload object. It contains message payload properties.

| Property | Data Type | Description                                                                                                                |
| :------- | :-------- | :------------------------------------------------------------------------------------------------------------------------- |
| type     | ENUM      | Values: `JSON`, `STRING`                                                                                                   |
| encoding | ENUM      | Present only for UDP and COAP raw messages that hasn't been traversed through translation service.<br /> Values: `base64`. |
| value    | see type  | Payload value.                                                                                                             |
| topic    | STRING    | Present only for COAP messages.                                                                                            |

***

# Device Properties

These are the properties of a message device object. It contains parameters that help to identify the device that has sent the message.

| Property | Data Type | Description                        |
| :------- | :-------- | :--------------------------------- |
| iccid    | STRING    | Device iccid.                      |
| imsi     | STRING    | Device imsi1.                      |
| ip       | STRING    | Device ip address in 1nce network. |

***

# Lifecycle properties

These are the properties for lifecycle events and it is present only for lifecycle messages.

| Property | Data Type | Description                            |
| :------- | :-------- | :------------------------------------- |
| type     | ENUM      | Values: `DEVICE_FIRST_TIME_REGISTERED` |
| message  | STRING    | Description of lifecycle event         |

# Error properties

These are the properties of a message error object. It is present only for error messages.

| Property      | Data Type | Description                                            |
| :------------ | :-------- | :----------------------------------------------------- |
| id            | STRING    | Error id                                               |
| type          | ENUM      | Values: `DEVICE`, `GENERAL`, `INTEGRATION`, `LOCATION` |
| message       | STRING    | Short error message                                    |
| description   | STRING    | Detailed error description                             |
| payloadExists | BOOLEAN   | Does Error contains payload                            |

# Geofence properties

These are the properties of a message geofence object. It is present only for geofence messages.

| Property    | Data Type    | Description                                                                              |
| :---------- | :----------- | :--------------------------------------------------------------------------------------- |
| id          | STRING       | Geofence id                                                                              |
| type        | ENUM         | Values: `EXIT`, `ENTER`                                                                  |
| name        | STRING       | Name of geofence                                                                         |
| coordinates | STRING ARRAY | Coordinate of location which triggered the geofence event <br /> [ longitude, latitude ] |
| source      | ENUM         | Values: `GPS`, `CellTower`                                                               |

# Integration properties

These are the properties of a message integration object.

| Property | Data Type | Description         |
| :------- | :-------- | :------------------ |
| id       | STRING    | Integration id      |
| name     | STRING    | Name of integration |

# Location properties

These are the properties of a message location object. It is present only for location messages.

| Property    | Data Type    | Description                                                                              |
| :---------- | :----------- | :--------------------------------------------------------------------------------------- |
| source      | ENUM         | Values: `GPS`, `CellTower`                                                               |
| coordinates | STRING ARRAY | Coordinate of location which triggered the location event <br /> [ longitude, latitude ] |
| metadata    | OBJECT       | **Optional** JSON field with position metadata like vertical accuracy, country, etc      |
