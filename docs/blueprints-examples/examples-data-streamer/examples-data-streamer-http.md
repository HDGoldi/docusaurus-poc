---
title: HTTP/Webhook
description: Webhook/HTTP Integration of the 1NCE Data Streamer Service.
---
<div style={{textAlign: 'center'}}>
<img src="/img/blueprints-examples/examples-data-streamer/examples-data-streamer-http/001.png" alt="" style={{maxWidth: '100%'}} />
</div>

The HTTP/Webhook integration of the Data Streamer is ideal for custom server applications. This method offers the most flexible, custom integration of the Data Streamer Service into existing analytics, reporting, and monitoring pipelines. The Http callbacks supports both Event and Usage Records. 

# General HTTP Interface

The HTTP endpoints needs to handle Posts requests with a Body containing a list of JSON objects. A maximum of 3.000 JSON object records per sent HTTP Post request can be expected. If data is available, the requests are sent in a regular interval. The customer supplied endpoint should consume the HTTP Post with a HTTP 200 status code response. Acknowledged records will not be resend again. The streamer service does not respond to HTTP redirect codes (3xx). A HTTP Basic Authentication Header must be configured in the 1NCE Portal for this Data Streamer type.

## Endpoint URL

The provided endpoint URL in the 1NCE Portal Configuration needs to be valid. URLs with public IP addresses (`https://<server-ip>:<port>/<endpoint>/`) are not supported. Custom ports for the endpoint can be configured via the URL (`https://<server-domain>:<port>/<endpoint>/`). 

## Certificate

The endpoint server needs to have a valid SSL/TLS certificate. A self-signed certificate will not work in this application case. We recommend using [Let's Encrypt](https://letsencrypt.org/de/) certificates. 

## Endpoint Capacity

Be aware that the HTTP/Webhook integration will deliver the incoming events as a list of JSON objects. Dependent on the amount of SIMs and occurred records this request can be quite large. A maximum limit of 3.000 records per request is set. 1NCE customers with a large quantity of SIMs and high number of events as such must be aware that their backend system receiving data from the stream needs to have the capacity to handle large incoming requests.

***

# 1NCE Portal Configuration

After implementing a HTTP Post endpoint on a custom backend, the Data Streamer needs to be configured in the 1NCE Portal in the Configuration tab. For a complete Data Stream setup using HTTP/Webhook, two configurations (Events and Usage) need to be created in the 1NCE Portal. Still, the same endpoint could be used as target for both stream setups. After the configuration the SIM Event and Usage Records will be forwarded to the specified customer endpoint.

1. **API Type:** Select RestAPI to customize the settings.
2. **Stream Type:** Choose between <i>Usage Data</i> and <i>Event Data</i> records. If both record types are desired, two separate Data Streams with the same destination endpoint can be setup. 
3. **Name:** Identification name used in the Connectivity Management Platform for labeling the specific integration.
4. **API Callback:** URL to the customer provided HTTPs endpoint accepting the HTTP POST requests.

* The endpoint URL for the Data Streamer in the needs to be valid.
* Public IP addresses ([\<\<https://"server-ip":"port"/"endpoint"/>>](https://"server-ip":"port"/"endpoint"/)) are not supported.
* Custom ports for the endpoint can be configured via the URL ([\<\<https://"server-domain":"port"/"endpoint"/>>](https://"server-domain":"port"/"endpoint"/)). 
* The endpoint server needs to have a valid SSL/TLS certificate. A self-signed certificate will not work in this application case. We recommend using Let's Encrypt certificates. 

5. **Basic Auth Header:** Base64 encoded value supplied by each HTTP POST request in the Basic Authentication Header field. The supplied HTTP endpoint needs to support Basic Authentication.
6. Click **Save** to create the Data Streamer integration.

<img src="/img/blueprints-examples/examples-data-streamer/examples-data-streamer-http/8a6a25f-data-streamer-webhook.jpg" alt="data-streamer-webhook.jpg" width="80%" />

***

# HTTP/Webhook Integration Testing

Testing a Data Streamer integration can be done in two ways: using a 1NCE SIM in a device or sample HTTP cURL requests. This sections explains the two ways of testing the Data Streamer integration.

## 1NCE SIM Device

For simple testing with a 1NCE SIM, we recommend to use a smartphone or manually controllable IoT device.

1. Place a 1NCE SIM into an IoT device or any other mobile device. 
2. Ensure that the mobile device allows roaming network and data connections and that the 1NCE APN is setup correctly.
3. After the device has attached to the network, see mobile network status indicator on the smartphone, a couple of first events should show up in the Data Streamer.
4. To generate Usage Records, create a data session and use some data traffic or Alternatively send some MT/MO-SMS. Note that data session usage is only recorded after a session has been closed. For smartphone testing simply disable data roaming or airplane mode to simulate the closing of the data session.
5. Check the Usage Record integration. After some time, the used data volume and/or SMS volume record will be provided.

## Simulated Events and Usage Records

To simulate HTTP/Webhook events, simple HTTP Post cURL requests with JSON List Body messages can be posted to the custom endpoints. Below two examples for an Event and Usage Record cURL can be found. Please adapt the endpoint URL to the server URL used for integration. Use Postman or Command Line Interface (CLI) to issue these example requests. The data should be received by the customer-side implemented Data Streamer receiver.

<details>
<summary class="heading-3">Update Location Event cURL</summary>

```curl Update Location HTTP Post cURL
curl --location --request POST 'https://<server-domain>:<port>/<endpoint>/' \
--header 'Content-Type: application/json' \
--data-raw '[{
    "imsi": {
        "imsi": "<imsi>",
        "id": 123456,
        "import_date": "2019-01-21T09:36:17Z"
    },
    "event_source": {
        "description": "Network",
        "id": 0
    },
    "organisation": {
        "name": "8100xxxx",
        "id": 1234
    },
    "event_severity": {
        "id": 0,
        "description": "INFO"
    },
    "sim": {
        "msisdn": "<msisdn>",
        "iccid": "<iccid>",
        "id": 1234567,
        "production_date": "2019-01-21T09:36:17Z"
    },
    "description": "New location received from VLR for IMSI='<imsi>', now attached to VLR='<VLR>'.",
    "alert": false,
    "id": 1234567890,
  "user": null,
    "detail": {
        "mnc": [
            {
                "mnc": "20",
                "id": 327
            },
            {
                "mnc": "16",
                "id": 328
            }
        ],
        "tapcode": [
            {
                "tapcode": "NLDDT",
                "id": 470
            },
            {
                "tapcode": "NLDPN",
                "id": 471
            }
        ],
        "name": "T-Mobile",
        "country": {
            "iso_code": "nl",
            "country_code": "31",
            "name": "Netherlands",
            "id": 141,
            "mcc": "204"
        },
        "id": 730
    },
    "endpoint": {
        "tags": null,
        "ip_address": "<ip_address>",
        "name": "<name>",
        "imei": "<imei>",
        "id": 1234567
    },
    "event_type": {
        "id": 1,
        "description": "Update location"
    },
    "timestamp": "2019-01-21T09:36:17Z"
}]'
```

</details>
<details>
<summary class="heading-3">Usage Record cURL</summary>

```curl Usage Record HTTP Post cURL
curl --location --request POST 'https://<server-domain>:<port>/<endpoint>/' \
--header 'Content-Type: application/json' \
--data-raw '[{
    "imsi": "<imsi>",
    "organisation": {
        "name": "8100xxxx",
        "id": 1234
    },
    "start_timestamp": "2021-08-09T12:59:05Z",
    "sim": {
        "msisdn": "<msisdn>",
        "iccid": "<icc>",
        "id": 123456,
        "production_date": "2018-04-17T15:01:50Z"
    },
    "currency": {
        "id": 1,
        "symbol": "€",
        "code": "EUR"
    },
    "operator": {
      "id": 2,
      "name": "T-Mobile",
      "mnc": "01",
      "country": {
        "id": 74,
        "mcc": "262",
        "name": "Germany"
      }
    },
    "tariff": {
        "ratezone": {
            "name": "Rate Zone 2 (EU - DE)",
            "id": 2067
        },
        "name": "1NCE Production 01",
        "id": 398
    },
    "imsi_id": 1234567,
    "traffic_type": {
        "description": "Data",
        "id": 5
    },
    "id": 1234567890,
    "end_timestamp": "2021-08-09T12:51:20Z",
    "endpoint": {
        "tags": null,
        "ip_address": "<ip_address>",
        "name": "<name>",
        "imei": "<imei>",
        "id": 12345678,
                "balance": null
    },
    "cost": 0.001176,
    "volume": {
        "total": 0.001176,
        "tx": 0.001176,
        "rx": 0.0
    }
}]'
```

</details>

### Postman Mock Server

A good way to start with the 1NCE Data Streamer is a [Postman Mock Server](https://learning.postman.com/docs/designing-and-developing-your-api/mocking-data/setting-up-mock/). A mock server can be setup fast without any need of external infrastructure. Simply create a HTPP Post endpoint with a given name and provide the mock server URL and the chosen Endpoint name in the 1NCE Portal Data Streamer configuration. Afterwards, the Data Streamer events should be sent to the mock server.

The mock server allows to inspect real network events triggered by the SIMs and organization of the customer. Further, using Postman, the CURL demo events can be sent either to the mock server or the customer server implementation.
