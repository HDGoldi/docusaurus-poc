---
title: CoAP Endpoint
sidebar_position: 2
---
## CoAP Overview

The CoAP Endpoint `coap://coap.os.1nce.com:5683` hosts a POST endpoint on the server root path (`/`). The endpoint supports both normal, non-translatable messages and translatable messages by using the energy saver, with a safe payload size of up to 1024 bytes.

The POST endpoint takes an optional query parameter (or Location-Query) `t` to provide the MQTT topic used for forwarding this message to a MQTT broker (e.g., `coap://coap-service:5683/?t=topicName`). The Location-Query is limited to 255 characters by the CoAP protocol, hence the topic name itself can only contain up to 253 characters (`t` and `=` also count as characters). The topic name itself can only contain alphanumeric characters, underscores, and forward slashes (no two slashes in a row). If these constraints are violated, a bad request (4.00) will be returned.

If a targeted device could not be found or is in a non-active status, the CoAP service will return an unauthorized (4.01) and no further processing of the message will take place.

## CoAP Communication

While using UDP protocol for transport, the CoAP protocol offers reliable communication by using message confirmation mechanism. Each CoAP request has to be acknowledged by the server, so that the client would be sure that the message was processed:

<div style={{textAlign: 'center'}}>
<img src="/img/1nce-os/1nce-os-device-integrator/device-integrator-coap/001.png" alt="CoAP reliable messaging" style={{maxWidth: '100%'}} />
</div>

There are few key moments that allow reliable communication:

1. To maximize the chance that the message succeeds even in the lossy network environment, CoAP has a retransmission mechanism. The client would re-send the Confirmable message (`CON`) until the Acknowledgement (`ACK`) is received or the *exchange lifetime* has ended. The total exchange lifetime (`EXCHANGE_LIFETIME`) is the time from starting to send a Confirmable message to the time when an acknowledgment is no longer expected.\
   By default, the `EXCHANGE_LIFETIME` value is `247 seconds`.
2. CoAP Messages contain *Message ID* (also known as `MID`) to detect duplicates due to retransmissions. The Message ID has to be unique during the `EXCHANGE_LIFETIME`, so the client's endpoint should be able to specify a unique `MID` value if messages are being sent often enough. Most high-level CoAP clients are managing `MID` uniqueness internally, but for low-level clients like modem *Quectel BG95*, it can be specified in the AT command as `msgID`[2]:

```text
AT+QCOAPHEADER=<clientID>,<msgID>,<mode>[,<TKL>,<token>]
```

There are two examples of the retransmission situation in a single exchange lifetime:

* client's `CON` message did not reach the server. The client is resending the same `CON` message with the same `MID`.
* server's `ACK` message did not reach the client. The client is resending the same `CON` message with the same `MID` (because there was no acknowledgment). The server is answering with the same `ACK` because it sees the already processed `MID` and does not process the request again.

## DTLS encryption for CoAP

<div style={{textAlign: 'center'}}>
<img src="/img/1nce-os/1nce-os-device-integrator/device-integrator-coap/a180cb3-image_4.png" alt="CoAP DTLS Support" width="80%" />
</div>

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

* through the 1NCE OS API endpoint described in [API Explorer](/api/1nce-os/create-pre-shared-device-key/).
* in 1NCE OS portal Device Integrator when [testing CoAP endpoint](/docs/1nce-os/1nce-os-device-integrator/device-integrator-test-endpoints#testing-the-endpoint).

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

| Code | Description | Schema |
| --- | --- | --- |
| 200 | 200 Response | Client identity, Pre-sharded key (text/csv),coapsEndpointUrl |
| 401 | 401 Response | UnauthorizedResponse |
| 500 | 500 Response | ServerSideErrorResponse |

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
