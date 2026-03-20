---
title: Testing SMS Forwarder
description: Simulating SMS Forwarder events with HTTP Post/Patch.
---
Before deploying a custom integration into production, testing is usually carried out. For testing the 1NCE SMS Forwarding Service with MT-SMS Delivery Reports and MO-SMS messages, real SIM device SMS events or simulated HTTP Post/Patch requests can be used.

***

# SIM Event Testing

When testing with real SMS events, an active 1NCE SIM in a device capable of sending and receiving SMS messages is needed. Nearly any smartphone in combination with a 1NCE SIM can be used for this purpose.

## MO-SMS Event

1. Prepare a Mobile Originated (MO) SMS text message on a device with a 1NCE SIM.
2. The recipient number can be set to any arbitrary number (e.g., 123456) as it is ignored for routing the SMS.
3. Send the SMS message from the SIM device.
4. Once the MO-SMS was delivered, the SMS message content will be shown in the SMS Console in the 1NCE Portal My SIMs detail view and a HTTP Post SMS Event should have been delivered via the SMS Forwarder to the configured server endpoint.

## MT-SMS DLR

1. Prepare a Mobile Terminated (MT) SMS using the SMS Console in the 1NCE Portal or the 1NCE SMS API.
2. Send the MT-SMS towards an active, online 1NCE SIM device.
3. Once the SMS message was received and acknowledged by the SIM device, a Delivery Report (DLR) will be issued.
4. The DLR Event should be received by the configured SMS Forwarder Endpoint as a HTTP Patch request.

***

# Simulated Post/Patch Requests

To test the HTTP endpoint forwarder integration, the HTTP Post/Patch requests that would originate from the 1NCE SMS Forwarder Service can be simulated. A simulation of SMS Forwarder requests is especially useful for developing and debugging custom integrations. The simulation of the HTTP Post/Patch requests can be executed with tools like Postman or cURL using a Command Line Interface (CLI).

## MO-SMS cURL

1. Customize the cURL request shown below with the **Server Domain**, the specific **Endpoint** and optionally the **Port Number**.
2. Optionally, customize the JSON Body parameters.
3. Import the cURL command into Postman or copy the command to a CLI with cURL installed.
4. Execute the customized request to simulate a MO-SMS being delivered to the specified Endpoint by the 1NCE SMS Forwarding Service.

```curl MO-SMS HTTP Post cURL
curl --location --request POST 'https://<server-domain>:<port>/<endpoint>/' \
--header 'Content-Type: application/json' \
--data-raw ' {
	"id": 6202,
	"payload": "message text",
	"submit_date": "2018-08-17 16:31:51",
	"dest_address": "12345",
	"source_address": "1234567890123456",
	"dcs": 0,
	"endpoint": {
		"id": 1234567,
		"name": "1234567890123456"
	},
	"organisation": {
		"id": 1234
	},
	"multi_part_info": {
		"partno": 1,
		"total": 1,
		"identifier": 6202
	},
	"pid": 0
}'
```

## MT-SMS DLR cURL

1. Customize the cURL request shown below with the **Server Domain**, the specific **Endpoint** and optionally the **Port Number**.
2. Optionally, customize the JSON Body parameters.
3. Import the cURL command into Postman or copy the command to a CLI with cURL installed.
4. Execute the customized HTTP Patch request to simulate a Delivery Report for a MT-SMS being delivered to the specified Endpoint by the 1NCE SMS Forwarding Service.

```curl MT-SMS DLR HTTP Patch cURL
curl --location --request PATCH 'https://<server-domain>:<port>/<endpoint>/' \
--header 'Content-Type: application/json' \
--data-raw ' {
	"id": 2819195,
	"final_date": "2020-06-09 15:06:38",
	"submit_date": "2020-06-09 15:06:34",
	"organisation": {
		"id": 1234
	},
	"endpoint": {
		"name": "1234567890123456",
		"id": 1234567
	},
	"status": {
		"id": 4,
		"status": "DELIVERED"
	}
}'
```

### Postman Mock Server

A good way to start with the 1NCE SMS Forwarder is a [Postman Mock Server](https://learning.postman.com/docs/designing-and-developing-your-api/mocking-data/setting-up-mock/) A mock server can be setup fast without any need of external infrastructure. Simply create a HTPP Post and Patch endpoint with a given name. The endpoint names for both the Post and Pack need to be identical. Provide the mock server URL and the chosen Endpoint name in the 1NCE Portal SMS Forwarder configuration. Afterwards, the SMS Forwarder events should be sent to the mock server.

The mock server allows to inspect real SMS events triggered by the SIMs and organization of the customer. Further, using Postman, the CURL demo events can be sent either to the mock server or the customer server implementation.
