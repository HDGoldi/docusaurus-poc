---
title: Mobile Originated SMS
description: Issuing Mobile Originated SMS.
sidebar_position: 2
---
# 1NCE Portal / SMS Console

This section covers how to use the SMS Console inside the 1NCE Portal to view the MO-SMS messages of a specific 1NCE SIM. Please note that the data retention of seven days applies to the SMS Console, SMS older than seven days will no longer be displayed.

## Viewing MO-SMS

1. Login to the <a target="_blank" href="https://portal.1nce.com/">1NCE Portal</a> and go the the **My SIMs** tab.
2. Select the **SIM** for which the MO-SMS should be viewed from the list of all SIM cards.
3. Navigate to the **SMS Tab** at the bottom of the SIM details page to access the SMS Console.

<div style={{textAlign: 'center'}}>
<img src="/img/blueprints-examples/examples-sms/examples-mo-sms/a9af544-SMS_Console_MO.png" alt="SMS_Console_MO.png" width="80%" />
</div>

4. The list view will show both MT-SMS and MO-SMS messages. For both types, the **Status**, **Submitted**, **Finalized**, **Source Address** and **Payload** are shown.
5. A MO-SMS will remain in the pending status without being finalized until it was received and acknowledged by an SMS Forwarder Endpoint. As this integration is optional, by default the MO-SMS will stay in the pending state.

***

# 1NCE SMS API

The 1NCE API offers another solution to access Mobile Originated SMS messages. For a specific SIM card a list of MT/MO-SMS or single SMS messages based on the SMS ID can be queried. A good starting point is the <a href="/api/">API Explorer</a> to get familiar with the API calls. From the API Explorer, ready to use code snippets and cURL queries can be obtained to integrate into custom applications.

## API Prerequisites

Before using the SMS API requests, an authentication token needs to be requested using the `/oauth/token` API request. For using the MT-SMS functionality, an ICCID of a 1NCE SIM is needed to send, monitor and manage the SMS messages for this SIM.

## Retrieving MO-SMS

With the 1NCE SMS API, the received MO-SMS can be retrieved with some simple HTTP queries. Open the dropdowns below to see example guides for integration.

<details>
<summary class="heading-3">Get MT/MO-SMS List</summary>
With the 1NCE API a list of MT/MO-SMS can be queried to get detailed information about the SMS message delivery status as well as have access to the payloads.

1. Obtain the **API Authentication Token** for the 1NCE API using the */oauth/token* API request. Supply the Token in the *Authorization: Bearer* header value.
2. Enter the **ICCID** of the SIM of which a list of messages should be queried.
3. As a list of MT/MO-SMS messages will be returned, the **Page Size** parameter specifies how many list entries per loaded page will be returned.
4. As it is possible to have multiple pages, the **Page** parameter specifies the to be queried page. If there is more than one page present, the response header will include the total item count and the total page count.
5. The optional **Sort** parameter allows to sort the queried list to be sorted by the Status and IP Address keys.
6. Execute the **HTTP Get** request to query the MT/MO-SMS messages.

In the code example below, a sample HTTP Get cURL request and a corresponding response for a MO-SMS is shown. Please note that this query also shows any MT-SMS messages from the specified SIM.

```curl
Query MO-SMS cURL Example
curl --request GET \
     --url 'https://api.1nce.com/management-api/v1/sims/<sim_iccid>/sms?page=1&pageSize=10&sort=status%2Cip_address' \
     --header 'Accept: application/json' \
     --header 'Authorization: Bearer <customer_token>'
```
```curl
Query MO-SMS Response Example
[
  {
    "id": 7478676,
    "submit_date": "2021-12-01T12:13:52.000+0000",
    "delivery_date": "2021-12-01T12:13:52.000+0000",
    "expiry_date": "2021-12-02T12:13:52.000+0000",
    "retry_date": "2021-12-01T12:44:09.000+0000",
    "last_delivery_attempt": "2021-12-01T12:28:09.000+0000",
    "retry_count": "3",
    "source_address": "",
    "iccid": "<sim_iccid>",
    "msisdn": "<msisdn>",
    "imsi": "",
    "udh": "",
    "payload": "Another MO-SMS!",
    "status": {
      "id": 3,
      "description": "BUFFERED"
    },
    "sms_type": {
      "id": 2,
      "description": "MO"
    },
    "source_address_type": {
      "id": 145,
      "description": "International"
    }
  }
]
```

</details>

<details>
<summary class="heading-3">Get Individual MO-SMS</summary>
Besides a list of MT/MO-SMS the 1NCE API allows to query specific SMS messages based on ICCD and SMS ID.

1. Obtain the **API Authentication Token** for the 1NCE API using the */oauth/token* API request. Supply the Token in the *Authorization: Bearer* header value.
2. Enter the **ICCID** of the SIM of which the specific MO-SMS should be queried.
3. The **SMS ID** uniquely identifies each SMS message. This ID can be obtained from the list of MT/MO-SMS.
4. Execute the **HTTP Get** request to query the specific MO-SMS messages.

In the code example below, a sample HTTP Get cURL request and a corresponding response for a MO-SMS is shown. 

```curl
Query MO-SMS cURL Example
curl --request GET \
     --url https://api.1nce.com/management-api/v1/sims/<sim_iccid>/sms/<sms_id> \
     --header 'Accept: application/json' \
     --header 'Authorization: Bearer <customer_token>'
```
```curl
Query MO-SMS Response Example
{
    "id": 7478676,
    "submit_date": "2021-12-01T12:13:52.000+0000",
    "delivery_date": "2021-12-01T12:13:52.000+0000",
    "expiry_date": "2021-12-02T12:13:52.000+0000",
    "retry_date": "2021-12-01T12:44:09.000+0000",
    "last_delivery_attempt": "2021-12-01T12:28:09.000+0000",
    "retry_count": "3",
    "source_address": "",
    "iccid": "<sim_iccid>",
    "msisdn": "<msisdn>",
    "imsi": "",
    "udh": "",
    "payload": "Another MO-SMS!",
    "status": {
      "id": 3,
      "description": "BUFFERED"
    },
    "sms_type": {
      "id": 2,
      "description": "MO"
    },
    "source_address_type": {
      "id": 145,
      "description": "International"
    }
  }
```

</details>

***

# SIM Device MO-SMS

MO-SMS messages are issued from devices which use a 1NCE SIM for connectivity. The SMS service is available without the need to establish a PDP Data Session. Please note that SMS is not possible with NB-IoT. 

## MO-SMS with Smartphone

For testing and trying out the SMS Service, 1NCE recommends to use a simple smartphone with a 1NCE SIM to send MO-SMS.

1. Insert the **1NCE SIM** into the smartphone used for testing.
2. Enable **Roaming**on the device, as the 1NCE SIM appears always as roaming. Ensure that a network connection is available through the network status indicator of the phone.
3. Open up the **SMS Messaging App** of the used smartphone.
4. The target **Phone Number** can be set to any arbitrary number as the 1NCE network ignores this parameter and forwards all MO-SMS to the Portal/API/SMS Forwarder. External phone numbers are not reachable.
5. Prepare a basic **SMS Message** and send the MO-SMS message.
6. Check in the 1NCE Portal, through the API or if implemented the SMS Forwarder to see the received MO-SMS.

## MO-SMS with IoT Devices

Most IoT modem devices allow to send MO-SMS via AT Commands. Please check with the manufacturer documentation how to send MO-SMS or check the <a target="_blank" href="examples-hardware-guides">1NCE Hardware & Modem Guides</a>.
