---
title: CoAP Endpoint
---
## CoAP Overview

The CoAP Endpoint `coap://coap.os.1nce.com:5683` hosts a POST endpoint on the server root path (`/`). The endpoint supports both normal, non-translatable messages and translatable messages by using the energy saver, with a safe payload size of up to 1024 bytes.

The POST endpoint takes an optional query parameter (or Location-Query) `t` to provide the MQTT topic used for forwarding this message to a MQTT broker (e.g., `coap://coap-service:5683/?t=topicName`). The Location-Query is limited to 255 characters by the CoAP protocol, hence the topic name itself can only contain up to 253 characters (`t` and `=` also count as characters). The topic name itself can only contain alphanumeric characters, underscores, and forward slashes (no two slashes in a row). If these constraints are violated, a bad request (4.00) will be returned.

If a targeted device could not be found or is in a non-active status, the CoAP service will return an unauthorized (4.01) and no further processing of the message will take place.

## CoAP Communication

While using UDP protocol for transport, the CoAP protocol offers reliable communication by using message confirmation mechanism. Each CoAP request has to be acknowledged by the server, so that the client would be sure that the message was processed:

<HTMLBlock>{`
<center><img alt="CoAP reliable messaging" src="data:image/png;base64,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"/></center>
`}</HTMLBlock>

There are few key moments that allow reliable communication:

1. To maximize the chance that the message succeeds even in the lossy network environment, CoAP has a retransmission mechanism. The client would re-send the Confirmable message (`CON`) until the Acknowledgement (`ACK`) is received or the *exchange lifetime* has ended. The total exchange lifetime (`EXCHANGE_LIFETIME`) is the time from starting to send a Confirmable message to the time when an acknowledgment is no longer expected.\
   By default, the `EXCHANGE_LIFETIME` value is `247 seconds`.
2. CoAP Messages contain *Message ID* (also known as `MID`) to detect duplicates due to retransmissions. The Message ID has to be unique during the `EXCHANGE_LIFETIME`, so the client's endpoint should be able to specify a unique `MID` value if messages are being sent often enough. Most high-level CoAP clients are managing `MID` uniqueness internally, but for low-level clients like modem *Quectel BG95*, it can be specified in the AT command as `msgID`[\[2\]](#2):

```text
AT+QCOAPHEADER=<clientID>,<msgID>,<mode>[,<TKL>,<token>]
```

There are two examples of the retransmission situation in a single exchange lifetime:

* client's `CON` message did not reach the server. The client is resending the same `CON` message with the same `MID`.
* server's `ACK` message did not reach the client. The client is resending the same `CON` message with the same `MID` (because there was no acknowledgment). The server is answering with the same `ACK` because it sees the already processed `MID` and does not process the request again.

## DTLS encryption for CoAP

<Image alt="CoAP DTLS Support" align="center" width="80% " src="https://files.readme.io/a180cb3-image_4.png">
  CoAP DTLS Support
</Image>

Ensuring, data is securely sent from a device to 1NCE OS, it is an important part of gaining the trust of customers with their data. To be able to provide this secure connection 1NCE OS has implemented a DTLS layer in the CoAP communication from the device to 1NCE OS. This allows the device to securely send its data to 1NCE OS without the possibility of messages being read or modified along the way. The picture above describes this process. First, when the device is ready to onboard itself, it will call the CoAP bootstrapping endpoint. This will retrieve the necessary DTLS info to onboard itself securely and initialize the CoAP connection using a PSK.

# Features & Limitations

DTLS as a security protocol provides secure and fast data streaming. This comes with some advantages but also has some limitations. Below these key points are explored in the context of a CoAP connection.

## Features

DTLS is able to provide datastreaming functionality to devices with a low delay compared to TLS. It is able to provide this because it preserves the semantics of the underlying transport. DTLS also has advanced security. As a result, communication between client-server applications cannot be eavesdropped on or tampered with. This ensures that the streamed data is the same data as it was received. 

DTLS makes use of the UDP protocol for this functionality. The data is sent in a fire and forget style, so no handshakes occur, and the message is sent without any reception or delivery confirmation. UDP also avoids the TCP meltdown problem, where different transport layers compensate for each other, cause delays in the data transfer.

## Limitations

The main limitation of DTLS is the use of the UDP protocol. The major drawbacks of using UDP are, having to deal with packet reordering, loss of datagram, and data larger than the size of a datagram network packet.

# Encryption Key

To utilize DTLS encryption with 1NCE OS, a pre-shared key (PSK) is essential for securing data. This key encrypts and decrypts transmitted data. Devices can connect securely using CoAP with DTLS by accessing the endpoint `coaps://coap.os.1nce.com:5684`. To retrieve the PSK, send a GET request to `coap://coap.os.1nce.com:5683/bootstrap`. This endpoint will return an existing key, or if none is available, it will generate and provide a new one. Additionally, you can manually set the PSK (in plaintext or HEX format):

* through the 1NCE OS API endpoint described in [API Explorer](https://help.1nce.com/dev-hub/reference/post_v1-integrate-devices-deviceid-psk).
* in 1NCE OS portal Device Integrator when [testing CoAP endpoint](doc:device-integrator-test-endpoints#testing-the-endpoint).

### How to send CoAP messages

In the following snippet, the script will send a CoAP message.

1. Install node.js dependency

```bash
  npm install node-coap-client@1.0.9
```

2. Copy the following script

```javascript
const coap = require("node-coap-client").CoapClient;

/////// Here you can define if you want to enable or disable DTLS requests ///////
const dtlsEnabled = true; // (optional) Enable/Disable DTLS
//////////////////////////////////////////////////////////////////////////////////

async function coapOnboard(url) {
    await tryToConnectToCoapServer(url);
    const options = {
        keepAlive: true, // Whether to keep the socket connection alive. Speeds up subsequent requests
        confirmable: true, // Whether we expect a confirmation of the request
        retransmit: false, // Whether this message will be retransmitted on loss
    };
    console.log(`Calling CoAP bootstrap endpoint ${url}`);
    const result = await coap.request(url, "get", options);
    const payload = result.payload?.toString();

    if(result.code.toString() !== "2.05") {
        throw new Error(`Error calling CoAP bootstrap endpoint. Result code: ${result.code.toString()}, Payload: ${payload}`);
    }

    console.log(`Boostrap payload: ${payload}`);
    const [clientIdentity, preSharedKey, coapsEndpointUrl] = payload.split(",");

    console.log("===================================");
    console.log("DTLS details:");
    console.log(`Client Identity: ${clientIdentity}`);
    console.log(`Pre-shared key: ${preSharedKey}`);
    console.log(`Coap endpoint: ${coapsEndpointUrl}`);
    console.log("===================================");

    return {
        preSharedKey,
        clientIdentity,
        coapsEndpointUrl
    };
}

function logResponseDetails(res) {
    console.log("=========================================================");
    console.log("Server Response");
    console.log("Status: " + res.code);
    console.log("Payload: " + res.payload.toString());
    console.log("=========================================================");
}

function enableDtls(url, clientIdentity, preSharedKey) {
    coap.setSecurityParams(url, {
        psk: {
            [clientIdentity]: preSharedKey,
        },
    });
}

async function tryToConnectToCoapServer(url) {
    console.log("Trying to connect to CoAP server");
    const res = await coap.tryToConnect(url);
    if (!res) {
        console.error("Connection failed to CoAP server");
        throw Error(`Failed to connect to coap server: ${url}`);
    }

    console.log("Successfully connected to CoAP server");
}

async function sendCoapMessage(url, message) {
    const payload = Buffer.from(message);
    const options = {
        keepAlive: true, // Whether to keep the socket connection alive. Speeds up subsequent requests
        confirmable: true, // Whether we expect a confirmation of the request
        retransmit: false, // Whether this message will be retransmitted on loss
    };

    console.log(`Sending CoAP message to ${url}`)
    const result = await coap.request(
        url, // Server url (string)
        "post", // Request methos ("get" | "post" | "put" | "delete")
        payload, // Request payload (buffer)
        options, // Request options
    );
    logResponseDetails(result);
    const resultPayload = result.payload?.toString();

    if (result.code.toString() !== "2.04") {
        throw new Error(`Error message received from CoAP server. Result code: ${result.code.toString()}, Payload: ${resultPayload}`);
    }

    return {
        code: result.code.toString(),
        message: resultPayload,
    };
}

async function callPost(host, topic, message) {
    try {
        const protocol = dtlsEnabled ? "coaps" : "coap";
        const port = dtlsEnabled ? 5684 : 5683;
        const url = `${protocol}://${host}:${port}/?t=${topic}`;

        if (dtlsEnabled) {
            console.log("Enabling DTLS...");
            const boostrapUrl = `coap://${host}:5683/bootstrap`;
            const { clientIdentity, preSharedKey } = await coapOnboard(boostrapUrl);
            enableDtls(url, clientIdentity, preSharedKey);
            console.log("DTLS enabled");
        }

        await tryToConnectToCoapServer(url);
        await sendCoapMessage(url, message);
        console.log("Coap message sent");
    } catch (error) {
        console.error("Coap exception", error);
        throw error;
    } finally {
        coap.reset();
    }
}

(async () => {
    const message = {
        timestamp: new Date().getTime(),
        description: "Example message",
    };

    const host = "coap.os.1nce.com";
    const topic = "sometesttopic"

    await callPost(host, topic, JSON.stringify(message));
})();
```

3. (Optional) Enable or disable the CoAP DTLS connection (4th line). By default, the script is using DTLS.

4. Run the node.js script

# CoAP Endpoint Information

Base URL: `coap.os.1nce.com`\
Protocol: CoAP(s)

## Responses

<Table align={["left","left","left"]}>
  <thead>
    <tr>
      <th>
        Code
      </th>

      <th>
        Description
      </th>

      <th>
        Schema
      </th>
    </tr>
  </thead>

  <tbody>
    <tr>
      <td>
        200
      </td>

      <td>
        200 Response
      </td>

      <td>
        Client identity, Pre-sharded key\
        (text/csv),coapsEndpointUrl
      </td>
    </tr>

    <tr>
      <td>
        401
      </td>

      <td>
        401 Response
      </td>

      <td>
        UnauthorizedResponse
      </td>
    </tr>

    <tr>
      <td>
        500
      </td>

      <td>
        500 Response
      </td>

      <td>
        ServerSideErrorResponse
      </td>
    </tr>
  </tbody>
</Table>

## DTLS Bootstrapping Information

Information model:

The pre-shared key is valid indefinitely. If the bootstrapping is called 5 or more minutes after the last time bootstrapping was called and the pre-shared key was not set previously by the user, the pre-shared key will be regenerated with a new value.

| Name           | Type   | Description                                                         |
| :------------- | :----- | :------------------------------------------------------------------ |
| clientIdentity | string | The iccid of the device sim.                                        |
| preSharedKey   | string | A pre shared key the device can use to authenticate itself on DTLS. |

## UnauthorizedResponse

API responses when the Terms of Use and Data Processing Agreement are not accepted for the owner of the device:

| Name       | Type        | Description                |
| :--------- | :---------- | :------------------------- |
| statusText | string      | Http Status Text           |
| errors     | \[ object ] | Detailed Error Information |

## ServerSideErrorResponse

API response in case of server-side errors:

| Name       | Type        | Description                |
| :--------- | :---------- | :------------------------- |
| statusText | string      | Http Status Text           |
| errors     | \[ object ] | Detailed Error Information |
