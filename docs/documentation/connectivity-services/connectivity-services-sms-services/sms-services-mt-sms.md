---
title: Mobile Terminated SMS
description: MT-SMS destined for a device with a 1NCE SIM.
sidebar_position: 2
---
<div style={{textAlign: 'center'}}>
<img src="/img/connectivity-services/connectivity-services-sms-services/sms-services-mt-sms/001.png" alt="Schematic diagram of a MT-SMS message." style={{maxWidth: '100%'}} />
</div>

The term Mobile Terminated SMS (MT-SMS) encompasses SMS messages destined for a specific device. As 1NCE connectivity focuses on IoT applications, sending SMS messages from device to device (P2P) is not possible. Therefore, sending messages from a phone or other device towards a terminal with a 1NCE SIM is not possible. The 1NCE SMS Service offers two methods of sending messages towards an device.

Please note that some devices require an originator address/number to be set in order to successfully receive an SMS. In the 1NCE IoT use case, the number does not need to match any specific number of the SIM.

***

# 1NCE Portal

An easy-to-use and very intuitive tool for sending MT-SMS to individual devices with 1NCE SIM is the 1NCE Portal. This method is ideal for debugging and testing purposes as it offers an easy-to-use user interface for sending and monitoring SMS messages. Details on using the portal interface for sending SMS to devices can be found in the [My SIMs & SMS Console](/1nce-portal/portal-sims-sms) guide. For sending and receiving larger amounts of SMS and automating this process over longer periods, the 1NCE API is recommended. See also the [MT-SMS Portal Examples](/blueprints-examples/examples-sms/examples-mt-sms#1nce-portal--sms-console) for an example of MT-SMS in the 1NCE Portal.

***

# 1NCE SMS API

For larger batches or automated messages, the 1NCE API offers a HTTP REST interface for processing requests. Compared to the 1NCE Portal, the API offers more flexibility for automation and optional configuration of advanced SMS parameters (UDH, DCS and Expiry Date). The Data Coding Scheme (DCS) parameter enables GSM 7-bit default alphabet text messages and 8-bit binary data messages. The User Data Header (UDH) is an optional parameter which specifies how a message should be formatted and processed. It is useful for sending concatenated SMS messages consisting of two or more parts. How concatenated messages can be submitted is shown in the [Concatenated SMS Messages](#concatenated-sms-messages) section. See also the [MT-SMS API Examples](/blueprints-examples/examples-sms/examples-mt-sms#1nce-sms-api) for references to sending SMS via API.

## Data Coding Scheme

The Data Coding Scheme (DCS) is a value which transports information about how the recipient device shall handle the the transferred data payload. In principle, the DCS specifies the character set of your payload. Based on the chosen DCS the message length varies. The maximum length of a SMS is 160 character using the default GSM character set. You can use another character set and the maximum number of characters which can be used might shrink. In the following table you can see some DCS values and its short descriptions. For a full reference please see <a target="_blank" href="https://en.wikipedia.org/wiki/Data_Coding_Scheme">Data Coding Scheme Wiki</a>.

| DCS Value | Format | Payload for API |
| --- | --- | --- |
| 0 | 7-Bit Alphabet Text | Message Payload as String *TestSMS* |
| 4 | 8-Bit Binary Data | Binary Payload as Hex Encoded String *54657374534d53* |
| 8 | UCS-2 |  |

## Concatenated SMS Messages

In the User Data Header (UDH), the format and processing of an SMS message is specified. This header information is useful for sending a concatenated message which is longer than the 160 character limit. To split a message into multiple parts, each part needs to be sent via a separate API call with the correct UDH header. An example is shown below:

| Part Number | User Data Header | Payload         |
| :---------- | :--------------- | :-------------- |
| 1 of 3      | 050003CC 03 01   | Message Part 01 |
| 2 of 3      | 050003CC 03 02   | Message Part 02 |
| 3 of 3      | 050003CC 03 03   | Message Part 03 |

The UDH needs to be accounted for in the total size of the SMS message. Therefore, only 153 7-bit character parts can be sent in one message when the UDH is used to concatenate messages. The UDH consists of six-byte fields: 

* The total length of UDH
* The Information Element Identifier (IEI)
* The header length without the first two fields (IEIL)
* CSMS reference ID
* Total number of SMS parts
* Part number  

For more information about the UDH and SMS concatenation see <a href="https://portal.3gpp.org/desktopmodules/Specifications/SpecificationDetails.aspx?specificationId=139" target="_blank">GSM 03.38</a> and <a href="https://portal.3gpp.org/desktopmodules/Specifications/SpecificationDetails.aspx?specificationId=141" target="_blank">GSM 03.40</a>.

***

# SMS Forwarder Service

While it is not possible to directly send MT-SMS with the SMS Forwarding Service, it is possible to receive Delivery Reports (DLR). These reports are sent via the configured forwarding URL, indicating that the MT-SMS was delivered to the target device with a 1NCE SIM. Further details about this service can be found in the [SMS Forwarder Service](/platform-services/platform-services-sms-forwarder/index) section.
