---
title: Device Locator Integration
sidebar_position: 5
---
It is possible for the device to send binary messages, use the Energy Saver to decode these messages, and send valid GPS data to the [device locator](/1nce-os/1nce-os-device-locator/index) service.\
To accomplish this integration, it is required to create an Energy Saver template and include the `custom_type` in the JSON template with the names `location_lat` and `location_long` to mark the latitude and longitude values respectively.\
GPS data can be:

* Visualized in the 1NCE OS portal [device inspector](/1nce-os/1nce-os-device-inspector/device-inspector-features-limitations) & [device locator](/1nce-os/1nce-os-device-locator/index) tabs.
* Used via [API](/1nce-os/1nce-os-device-locator/device-locator-api).
* Forwarded to [cloud integrator](/1nce-os/1nce-os-cloud-integrator/index).

### Template example

**Energy Saver** template to decode longitude in the first 8 bytes and latitude in the subsequent 8 bytes of the message.

```json
{
  "sense": [
    {
      "asset": "longitude",
      "custom_type": "location_long",
      "value": {
        "byte": 0,
        "bytelength": 8,
        "type": "float",
        "byteorder": "little"
      }
    },
    {
      "asset": "latitude",
      "custom_type": "location_lat",
      "value": {
        "byte": 8,
        "bytelength": 8,
        "type": "float",
        "byteorder": "little"
      }
    }
  ]
}
```

### Code snippet

Example of generating a GPS payload:

* Sends to the 1NCE OS UDP endpoint as a binary payload.
* Prints the payload in Base64 format for testing with the Energy Saver template on the 1NCE OS portal or via the [API](/api/1nce-os/create-optimizer-template/).

```javascript
const dgram = require('dgram');

// Server and message configuration
const serverPort = 4445;
const serverAddress = 'udp.os.1nce.com';
const latitude = 56.946285;
const longitude = 24.105078;

function encodeLocation(latitude, longitude) {
  const latBuff = processFloat(latitude);
  const longBuff = processFloat(longitude);
  return Buffer.concat([longBuff, latBuff]);
}

function processFloat(val) {
  // Assign the same byte length as defined in the template
  let buf = Buffer.alloc(8);
  buf.writeDoubleLE(val);
  return buf;
}

const message = encodeLocation(latitude, longitude);
const client = dgram.createSocket('udp4');
client.send(message, serverPort, serverAddress, (err) => {
  if (err) {
    console.error('Error sending message:', err);
  } else {
    console.log('UDP message sent successfully as binary payload!');
  }

  client.close();
});

console.log("Payload in base64 format for energy saver template testing in 1NCE OS Portal or via API:",
    message.toString('base64'));

```
