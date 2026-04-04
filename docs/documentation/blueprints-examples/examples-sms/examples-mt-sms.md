---
title: Mobile Terminated SMS
description: Issuing Mobile Terminated SMS Messages.
sidebar_position: 1
---

## 1NCE Portal / SMS Console

This section covers the usage of the 1NCE Portal and the SMS Console to send MT-SMS to one individual 1NCE SIMs. The SMS Console only supports 7-Bit GSM Alphabet Text MT-SMS. For using more advanced features, please refer to the 1NCE API examples.

### Alphabet Text SMS Messages

1. Login to the <a target="_blank" href="https://portal.1nce.com/">1NCE Portal</a> and go the the **My SIMs** tab.
2. Select the **SIM** to which the MT-SMS messages should be issued from the list of all SIM cards.
3. Navigate to the **SMS Tab** at the bottom of the SIM details page to access the SMS Console.

<div style={{textAlign: 'center'}}>
<img src="/img/blueprints-examples/examples-sms/examples-mt-sms/c31f7b3-SMS_Console_01.png" alt="SMS_Console_01.png" width="80%" />
</div>

4. Enter a **Source Address**. This address is not needed for routing the SMS, but some devices might require a certain originating address/phone number to validate the sender.
5. Add a **7-Bit GSM Alphabet Text Payload** which should have a maximum length of **160 Characters**. Using the SMS Console only text messages with Data Coding Scheme (DCS) 0 and no Concatenated SMS are possible. Please refer to the <a href="#sending-mt-sms">1NCE SMS API examples</a> for more advanced features.
6. Click the **Send** button to issue the MT-SMS towards the 1NCE SIM device.

<div style={{textAlign: 'center'}}>
<img src="/img/blueprints-examples/examples-sms/examples-mt-sms/e08b43b-SMS_Console_02.png" alt="SMS_Console_02.png" width="80%" />
</div>

7. After sending the MT-SMS, please wait a bit as the message is being processed. The list view of the SMS messages can be manually updated.
8. While the MT-SMS is in transit and has not been acknowledged by the receiving device, the status is shown as **Pending**.
9. If the receiving device is attached to the network (not NB-IoT), the MT-SMS will be received, the status changes to **Delivered** and the **Finalized** timestamp will be shown.
10. If the receiving device is currently not attached, the MT-SMS will stay in the **Pending** state for up to 24 hours. The 1NCE network tries to redeliver this MT-SMS as soon as the devices becomes attached. After 24 hours, the MT-SMS will go the the **Failed** state and the SMS message will not be redelivered.

***


## 1NCE SMS API

This section covers all topics around sending, monitoring and managing MT-SMS messages with the the 1NCE API. A good starting point is the <a href="/api/">API Explorer</a> to get familiar with the API calls. From the API Explorer, ready to use code snippets and cURL queries can be obtained to integrate into custom applications.

### API Prerequisites

Before using the SMS API requests, an authentication token needs to be requested using the `/oauth/token` API request. For using the MT-SMS functionality, an ICCID of a 1NCE SIM is needed to send, monitor and manage the SMS messages for this SIM.

### Sending MT-SMS

The examples listed below show common use cases for sending MT-SMS with the 1NCE API. Please open the dropdowns to get a full guide on how to send these types of SMS messages.

<details>
<summary class="heading-3">7-Bit Alphabet Text SMS Messages</summary>
This example show a simple MT-SMS message with a maximum 160 character 7-bit GSM Alphabet SMS message payload.

1. Obtain the **API Authentication Token** for the 1NCE API using the */oauth/token* API request. Supply the Token in the *Authorization: Bearer* header value.
2. Enter the **ICCID** of the SIM to which the MT-SMS should be send in the HTTP Post URL.  
3. The **Source Address** can be left empty or any numeric value can be supplied. For some devices this sender address/phone number is used for validation of the SMS source. This parameter is optional.  
4. The **Payload** contains the 7-bit GSM Alphabet Text SMS Message. Please note the maximum length of the SMS is 160 characters.  
5. For sending 7-bit GSM Alphabet SMS Messages, the **Data Coding Scheme (DCS)** needs to be set to 0.  
6. The **User Data Header (UDH)** can be omitted for this simple type of SMS message.  
7. Set the **Source Address Type** according to the used Source Address. The value 145 is fine for numeric values. Please use 208 for alphanumeric Source Addresses. This parameter is optional.  
8. The **Expiry Date** in ISO8601 format sets the timepoint until the retry mechanism will try to deliver a MT-SMS before it will go into the *Failed* state. A MT-SMS is only delivered if the target SIM device is attached to the network and can receive SMS messages. This parameter is optional.  
9. Execute the **HTTP Post** request to issue the MT-SMS towards the SIM device.

Shown below is a cURL example for a simple 7-bit GSM Alphabet MT-SMS message.

```curl 7-Bit Alphabetic MT-SMS cURL Example
curl --request POST \
     --url https://api.1nce.com/management-api/v1/sims/<sim_iccid>/sms \
     --header 'Accept: application/json' \
     --header 'Authorization: Bearer <customer_token>' \
     --header 'Content-Type: application/json;charset=UTF-8' \
     --data '
{
		 "source_address": "123456",
     "payload": "This is a MT-SMS message.",
     "dcs": 0,
     "source_address_type": {
          "id": 145
     },     
     "expiry_date": "2021-12-12T16:10:29.000+0000"
}
'
```

</details>

<details>
<summary class="heading-3">UCS-2 SMS Messages</summary>
The Universal Coded Character Set (UCS-2) defines two bytes per encoded character. The example shown is similar to a normal 7-Bit GSM Alphabet MT-SMS with the needed DCS adaption and a shorter payload of 70 characters.

1. Obtain the **API Authentication Token** for the 1NCE API using the */oauth/token* API request. Supply the Token in the *Authorization: Bearer* header value.
2. Enter the **ICCID** of the SIM to which the MT-SMS should be send in the HTTP Post URL.
3. The **Source Address** can be left empty or any numeric value can be supplied. For some devices this sender address/phone number is used for validation of the SMS source. This parameter is optional.
4. The **Payload** contains the UCS-2 MT-SMS Message. Please note the maximum length of the UCS-2 SMS is only 70 characters.
5. For sending UCS-2 SMS Messages, the **Data Coding Scheme (DCS)** needs to be set to 8.
6. The **User Data Header (UDH)** can be omitted for this simple type of SMS message.
7. Set the **Source Address Type** according to the used Source Address. The value 145 is fine for numeric values. Please use 208 for alphanumeric Source Addresses. This parameter is optional.
8. The **Expiry Date** in ISO8601 format sets the timepoint until the retry mechanism will try to deliver a MT-SMS before it will go into the *Failed* state. A MT-SMS is only delivered if the target SIM device is attached to the network and can receive SMS messages. This parameter is optional.
9. Execute the **HTTP Post** request to issue the MT-SMS towards the SIM device.

Shown below is a cURL example for a UCS-2 MT-SMS message.

```curl UCS-2 MT-SMS cURL Example
curl --request POST \
     --url https://api.1nce.com/management-api/v1/sims/<sim_iccid>/sms \
     --header 'Accept: application/json' \
     --header 'Authorization: Bearer <customer_token>' \
     --header 'Content-Type: application/json;charset=UTF-8' \
     --data '
{
		 "source_address": "123456",
     "payload": "UCS-2 MT-SMS message.",
     "dcs": 8,
     "source_address_type": {
          "id": 145
     },     
     "expiry_date": "2021-12-12T16:10:29.000+0000"
}
'
```

</details>

<details>
<summary class="heading-3">Binary SMS Messages</summary>
Binary encoded MT-SMS messages are often used to send machine readable commands to a device in a compressed message. The payload of binary SMS messages need to be a HEX String and the Data Coding Scheme needs to be set to 4.

1. Obtain the **API Authentication Token** for the 1NCE API using the */oauth/token* API request. Supply the Token in the *Authorization: Bearer* header value.
2. Enter the **ICCID** of the SIM to which the MT-SMS should be send in the HTTP Post URL.
3. The **Source Address** can be left empty or any numeric value can be supplied. For some devices this sender address/phone number is used for validation of the SMS source. This parameter is optional.
4. The **Payload** contains the Binary MT-SMS Message as HEX String. Please note the maximum length of the payload is 140 bytes.
5. For sending Binary SMS Messages, the **Data Coding Scheme (DCS)** needs to be set to 4.
6. The **User Data Header (UDH)** can be omitted for this simple type of SMS message.
7. Set the **Source Address Type** according to the used Source Address. The value 145 is fine for numeric values. Please use 208 for alphanumeric Source Addresses. This parameter is optional.
8. The **Expiry Date** in ISO8601 format sets the timepoint until the retry mechanism will try to deliver a MT-SMS before it will go into the *Failed* state. A MT-SMS is only delivered if the target SIM device is attached to the network and can receive SMS messages. This parameter is optional.
9. Execute the **HTTP Post** request to issue the MT-SMS towards the SIM device.

Shown below is a cURL example for a Binary MT-SMS message.

```curl Binary MT-SMS cURL Example
curl --request POST \
     --url https://api.1nce.com/management-api/v1/sims/<sim_iccid>/sms \
     --header 'Accept: application/json' \
     --header 'Authorization: Bearer <customer_token>' \
     --header 'Content-Type: application/json;charset=UTF-8' \
     --data '
{
		 "source_address": "123456",
     "payload": "54657374534d53",
     "dcs": 4,
     "source_address_type": {
          "id": 145
     },     
     "expiry_date": "2021-12-12T16:10:29.000+0000"
}
'
```

</details>

<details>
<summary class="heading-3">Concatenated SMS Messages</summary>
All types of MT-SMS messages (7-Bit GSM Alphabet, Binary, UCS-2) can be send as a chain of concatenated SMS.  The User Data Header (DH) is needed to inform the receiving device of the concatenated SMS.
Please note that the usage of the UDH decreases the payload size by 6 bytes to 134 bytes (153 7-Bit characters).

1. Obtain the **API Authentication Token** for the 1NCE API using the */oauth/token* API request. Supply the Token in the *Authorization: Bearer* header value.

2. Enter the **ICCID** of the SIM to which the MT-SMS should be send in the HTTP Post URL.

3. The **Source Address** can be left empty or any numeric value can be supplied. For some devices this sender address/phone number is used for validation of the SMS source. This parameter is optional.

4. The **Payload** contains the MT-SMS Message. Please ensure that the maximum length matches the used payload type set in the DCS.

5. Specify the **Data Coding Scheme (DCS)** according to the desired payload time.

6. The **User Data Header (UDH)** is a 6 byte value encoded as HEX String. The first 4 bytes contain the UDH length, Information Element Identifier, header length without the first two fields, CSMS reference ID, total SMS Parts and current Part Number. The last two fields need to be altered based on the total amount of concatenated SMS messages and the current SMS Part Number. The table below shows an example UDH for a 3 part Concatenated SMS.

| UHD Field                      | Example |
| :----------------------------- | :------ |
| UDH Length                     | 0x05    |
| Information Element Identifier | 0x00    |
| UDH Header Length - 2 Byte     | 0x03    |
| CSMS Reference ID              | 0xCC    |
| SMS Part Count                 | 0x03    |
| Current SMS Part (1/3)         | 0x01    |

7. Set the **Source Address Type** according to the used Source Address. The value 145 is fine for numeric values. Please use 208 for alphanumeric Source Addresses. This parameter is optional.
8. The **Expiry Date** in ISO8601 format sets the timepoint until the retry mechanism will try to deliver a MT-SMS before it will go into the *Failed* state. A MT-SMS is only delivered if the target SIM device is attached to the network and can receive SMS messages. This parameter is optional.
9. Execute the **HTTP Post** request to issue the MT-SMS towards the SIM device.

Shown below in the separate tabs are three the cURL example for a a three part concatenated MT-SMS.

```curl Concatenated MT-SMS Part 01 cURL Example
curl --request POST \
     --url https://api.1nce.com/management-api/v1/sims/<sim_iccid>/sms \
     --header 'Accept: application/json' \
     --header 'Authorization: Bearer <customer_token>' \
     --header 'Content-Type: application/json;charset=UTF-8' \
     --data '
{
		 "source_address": "123456",
     "payload": "Message Part 01",
     "dcs": 0,
     "udh": "050003CC0301",
     "source_address_type": {
          "id": 145
     },     
     "expiry_date": "2021-12-12T16:10:29.000+0000"
}
'
```
```curl Concatenated MT-SMS Part 02 cURL Example
curl --request POST \
     --url https://api.1nce.com/management-api/v1/sims/<sim_iccid>/sms \
     --header 'Accept: application/json' \
     --header 'Authorization: Bearer <customer_token>' \
     --header 'Content-Type: application/json;charset=UTF-8' \
     --data '
{
		 "source_address": "123456",
     "payload": "Message Part 02",
     "dcs": 0,
     "udh": "050003CC0302",
     "source_address_type": {
          "id": 145
     },     
     "expiry_date": "2021-12-12T16:10:29.000+0000"
}
'
```
```curl Concatenated MT-SMS Part 03 cURL Example
curl --request POST \
     --url https://api.1nce.com/management-api/v1/sims/<sim_iccid>/sms \
     --header 'Accept: application/json' \
     --header 'Authorization: Bearer <customer_token>' \
     --header 'Content-Type: application/json;charset=UTF-8' \
     --data '
{
		 "source_address": "123456",
     "payload": "Message Part 03",
     "dcs": 0,
     "udh": "050003CC0303",
     "source_address_type": {
          "id": 145
     },     
     "expiry_date": "2021-12-12T16:10:29.000+0000"
}
'
```

</details>

### Monitoring MT-SMS

Besides sending different types MT-SMS, the API can also be used to monitor and obtain a list of issued MT-SMS messages. Expand the dropdowns below to see the possibilities of querying the MT-SMS API.

<details>
<summary class="heading-3">Get MT/MO-SMS List</summary>
With the 1NCE API a list of MT/MO-SMS can be queried to get detailed information about the SMS message delivery status as well as have access to the payloads.

1. Obtain the **API Authentication Token** for the 1NCE API using the */oauth/token* API request. Supply the Token in the *Authorization: Bearer* header value.
2. Enter the **ICCID** of the SIM of which a list of messages should be queried.
3. As a list of MT/MO-SMS messages will be returned, the **Page Size** parameter specifies how many list entries per loaded page will be returned.
4. As it is possible to have multiple pages, the **Page** parameter specifies the to be queried page. If there is more than one page present, the response header will include the total item count and the total page count.
5. The optional **Sort** parameter allows to sort the queried list to be sorted by the Status and IP Address keys.
6. Execute the **HTTP Get** request to query the MT/MO-SMS messages.

In the code example below, a sample HTTP Get cURL request and a corresponding response for a MT-SMS in the second tab is shown. Please note that this query also shows any MO-SMS messages from the specified SIM.

```curl Query MT-SMS cURL Example
curl --request GET \
     --url 'https://api.1nce.com/management-api/v1/sims/<sim_iccid>/sms?page=1&pageSize=10&sort=status%2Cip_address' \
     --header 'Accept: application/json' \
     --header 'Authorization: Bearer <customer_token>'
```
```curl Query MT-SMS Response Example
[
  {
    "id": 7476638,
    "submit_date": "2021-12-01T07:43:34.000+0000",
    "delivery_date": "2021-12-01T07:43:34.000+0000",
    "expiry_date": "2021-12-02T07:43:34.000+0000",
    "final_date": "2021-12-01T07:43:35.000+0000",
    "last_delivery_attempt": "2021-12-01T07:43:35.000+0000",
    "retry_count": "0",
    "source_address": "1234567",
    "iccid": "<sim_iccid>",
    "msisdn": "<msisdn>",
    "imsi": "<imsi>",
    "msc": "<msc_id>",
    "udh": "",
    "payload": "This is a 1NCE MT-SMS Test!",
    "status": {
      "id": 4,
      "description": "DELIVERED"
    },
    "sms_type": {
      "id": 1,
      "description": "MT"
    },
    "source_address_type": {
      "id": 161,
      "description": "National"
    }
  }
]
```

</details>

<details>
<summary class="heading-3">Get Individual MT-SMS</summary>
Besides a list of MT/MO-SMS the 1NCE API allows to query specific SMS messages based on ICCD and SMS ID.

1. Obtain the **API Authentication Token** for the 1NCE API using the */oauth/token* API request. Supply the Token in the *Authorization: Bearer* header value.
2. Enter the **ICCID** of the SIM of which the specific MT-SMS should be queried.
3. The **SMS ID** uniquely identifies each SMS message. This ID can be obtained from the list of MT/MO-SMS or from the Location Response Header of the Send MT-SMS HTTP Post request.
4. Execute the **HTTP Get** request to query the specific MT-SMS messages.

In the code example below, a sample HTTP Get cURL request and a corresponding response for a MT-SMS in the second tab is shown. 

```curl Query MT-SMS cURL Example
curl --request GET \
     --url https://api.1nce.com/management-api/v1/sims/<sim_iccid>/sms/<sms_id> \
     --header 'Accept: application/json' \
     --header 'Authorization: Bearer <customer_token>'
```
```curl Query MT-SMS Response Example
{
    "id": 7476638,
    "submit_date": "2021-12-01T07:43:34.000+0000",
    "delivery_date": "2021-12-01T07:43:34.000+0000",
    "expiry_date": "2021-12-02T07:43:34.000+0000",
    "final_date": "2021-12-01T07:43:35.000+0000",
    "last_delivery_attempt": "2021-12-01T07:43:35.000+0000",
    "retry_count": "0",
    "source_address": "1234567",
    "iccid": "<sim_iccid>",
    "msisdn": "<msisdn>",
    "imsi": "<imsi>",
    "msc": "<msc_id>",
    "udh": "",
    "payload": "This is a 1NCE MT-SMS Test!",
    "status": {
      "id": 4,
      "description": "DELIVERED"
    },
    "sms_type": {
      "id": 1,
      "description": "MT"
    },
    "source_address_type": {
      "id": 161,
      "description": "National"
    }
}
```

</details>

### Manage MT-SMS

Through the API, issued MT-SMS that have not been delivered yet can be deleted from the SMS queue. The dropdown below show how to use the SMS API to manage MT-SMS.

<details>
<summary class="heading-3">Delete MT-SMS</summary>
A MT-SMS that has not been delivered and is currently in the retry loop, can be delete using the 1NCE SMS API.

1. Obtain the **API Authentication Token** for the 1NCE API using the */oauth/token* API request. Supply the Token in the *Authorization: Bearer* header value.
2. Enter the **ICCID** of the SIM for which a MT-SMS should be deleted.
3. The **SMS ID** uniquely identifies each SMS message. This ID can be obtained from the list of MT/MO-SMS or from the Location Response Header of the Send MT-SMS HTTP Post request.
4. Execute the **HTTP Delete** to delete the buffered MT-SMS.

In the code example below, a sample HTTP Delete cURL request to delete a buffered MT-SMS is shown.

```curl Delete MT-SMS cURL Example
curl --request DELETE \
     --url https://api.1nce.com/management-api/v1/sims/<sim_iccid>/sms/<sms_id> \
     --header 'Accept: application/json' \
     --header 'Authorization: Bearer <customer_token>'
```

</details>

***

## SIM Device MT-SMS

MT-SMS messages are issued towards devices which use a 1NCE SIM for connectivity. The SMS service is available without the need to establish a PDP Data Session. Please note that SMS is not possible with NB-IoT. 

### MT-SMS with Smartphone

For testing and trying out the SMS Service, 1NCE recommends to use a simple smartphone with a 1NCE SIM to receive MT-SMS.

1. Insert the **1NCE SIM** into the smartphone used for testing.
2. Enable **Roaming** on the device, as the 1NCE SIM appears always as roaming. Ensure that a network connection is available through the network status indicator of the phone.
3. Open up the **SMS Messaging App** of the used smartphone.
4. Prepare a **SMS Message** using one of the above mentioned methods (1NCE Portal or 1NCE API) to issue a MT-SMS.
5. Send the message towards the specific **ICCID SIM** which is inserted in the smartphone.
6. Check the smartphone for an incoming SMS message.

### MT-SMS with IoT Devices

Most IoT modem devices can receive and save MT-SMS. The control of the SMS management on the modem side is handled via AT Commands. Please check with the manufacturer documentation how to receive and query MT-SMS or check the <a target="_blank" href="/docs/blueprints-examples/examples-hardware-guides/">1NCE Hardware & Modem Guides</a>.
