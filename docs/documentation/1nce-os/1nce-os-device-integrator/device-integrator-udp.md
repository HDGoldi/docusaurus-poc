---
title: UDP Endpoint
sidebar_position: 1
---
The UDP Endpoint receives packets sent by the customer's IoT devices with a maximum safe payload size of 508 bytes, enriches them with identifier data from the core network and forwards data to the customer's configured backend application via the Data Broker. The following address has to be used to send UDP Messages `udp://udp.os.1nce.com:4445`. A simple script to send UDP packets to the server will look like this (generic example in NodeJS):

```javascript
const dgram = require('dgram');
const message = Buffer.from('Hello World');
const client = dgram.createSocket('udp4');
client.send(message, 4445, 'udp.os.1nce.com', (err) => {
  if (err) console.err(err);
  client.close();
  return 'done';
});
```

All active SIMs from an organization will be able to successfully publish messages via the UDP Endpoint, if [Terms of Use](https://1nce.com/wp-content/1NCE-OS-terms-of-use-EN.pdf) & [Data Processing Agreement](https://1nce.com/wp-content/1NCE-data-processing-agreement-EN.pdf) are accepted. The incoming messages can be found in [historian web interface](device-inspector-historian-web-interface).

All TELEMETRY\_DATA events which are forwarded to the AWS IoT Core are sent to a device-specific topic with the following format for UDP and LwM2M:\
**\{iccid}/messages** 

For CoAP:\
**\{iccid}/\{coap\_topic}** or **\{iccid}** if no topic provided (see optional query parameter in [CoAP overview](/1nce-os/1nce-os-device-integrator/device-integrator-coap))

This will result in a nicely formatted JSON-message that is also human-readable:

## Example Implementation for UDP Endpoint

The following example uses Python 3.8:

```python
import socket
import logging
import sys

def send_udp_message(host, port, message):
    logging.basicConfig(level=logging.INFO, stream=sys.stdout, format='%(asctime)s %(levelname)s: %(message)s')
    logger = logging.getLogger(__name__)

    logger.info("Opening UDP Socket")
    udp_socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

    try:
        logger.info("Sending UDP message to {}:{} with body {}".format(host,port,message))
        udp_socket.sendto(message.encode(), (host, port))
        
        logger.info("Sent UDP Message to the UDP Broker")
    except Exception as e:
        logger.error("Error sending UDP message:", e)
    finally:
        udp_socket.close()

send_udp_message("udp.os.1nce.com", 4445, "Hello, UDP. Can you hear me?")
```

UDP is the most lightweight transport protocol and can easily be based on a simple socket connection as shown in the previous example.
