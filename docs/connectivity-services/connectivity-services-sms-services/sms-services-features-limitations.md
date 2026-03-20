---
title: Features & Limitations
description: A look into what the 1NCE SMS Service can and cannot do.
---
# Features

In addition to sending and receiving MT-SMS, the 1NCE Service offers additional features to provide optimal integration into IoT device workflows and management infrastructures. Details about the implementation and usage of the individual features are available in the individual guide sections.

## Mobile Terminated SMS

For sending MT-SMS messages towards an IoT device with a 1NCE SIM, two options are available:

* <b><a href="portal-sims-sms">1NCE Portal</a>:</b>
  * Submit MT-SMS messages for a single SIM card.
  * Testing and debugging purposes.
  * Short-term data retention policy.
* <b><a href="https://help.1nce.com/dev-hub/reference" target="_blank">1NCE API</a>:</b>
  * Submit multiple MT-SMS via automation.
  * Integration into customer applications possible.
  * Volume management.
  * Delivery Reports for MT-SMS.

## Mobile Originated SMS

Any device with a 1NCE SIM can send MO-SMS messages. The provided destination mobile number is irrelevant for the delivery process. All MO-SMS messages can be received via two options:

* <b><a href="doc:portal-sims-sms">1NCE Portal</a>:</b>
  * Low number of messages.
  * Testing and debugging purposes.
  * Short-term data retention policy.
* <b><a href="doc:platform-services-sms-forwarder">1NCE SMS Forwarder Service</a>:</b>
  * High number of messages.
  * Integration into automated customer applications.

## Monitoring SMS Events

When an MT-SMS is sent an Event Record is generated. These records can be viewed in the 1NCE Portal or processed through the [Data Streamer Service](doc:platform-services-data-streamer) interface. Monitoring the Event Records can help to verify correct device behavior and identify possible connectivity issues.

***

# Limitations

The 1NCE SMS Service focuses on optimized IoT communication use cases. As a result, some additional limitations compared to the typically expected MT-SMS communication between mobile phones have to be considered. 

## SMS Volume Usage

Dependent on the tariff of the 1NCE SIM, a certain volume of MT-SMS messages is included. Details about the available volume and usage can be inquired in the 1NCE Portal or through the [1NCE API](https://help.1nce.com/dev-hub/reference). Each MT-SMS message sent (MT or MO) counts towards the used volume. Delivery retry attempts are not counted towards the volume. Once the volume is used up, no more messages can be sent until the volume is topped up.

## SMS Size Limitations

The typical limitations of the MT-SMS size also apply to 1NCE SMS. A message can be at most 160 characters long. Longer messages must be split into multiple messages. It is possible to send concatenated MT-SMS via API requests.

## Device-To-Device SMS (P2P)

With 1NCE connectivity, it is not possible to send Peer-to-Peer (P2P) MT-SMS between devices. Therefore, it is not possible to send a message to a device with a 1NCE SIM using a mobile phone, neither with a third party nor another 1NCE SIM. For instance, it is possible to set the destination number on a mobile phone and send a message to this number but the Short Message Service Centre (SMSC) will not forward this MT-SMS to the destination number. The MT-SMS service is only intended to exchange messages with a server application controlled by the customer, Application-to-Peer (A2P).

<HTMLBlock>{`
<center><img alt="Schematic diagram showing that SMS to external sources are not supported." src="/img/connectivity-services/connectivity-services-sms-services/sms-services-features-limitations/001.png" style="cursor:pointer;max-width:100%;" onclick="(function(img){if(img.wnd!=null&&!img.wnd.closed){img.wnd.focus();}else{var r=function(evt){if(evt.data=='ready'&&evt.source==img.wnd){img.wnd.postMessage(decodeURIComponent(img.getAttribute('src')),'*');window.removeEventListener('message',r);}};window.addEventListener('message',r);img.wnd=window.open('https://viewer.diagrams.net/?client=1&page=0&edit=_blank');}})(this);"/></center>
`}</HTMLBlock>

## SMS over NB-IoT

1NCE core does not support IP messaging and hence, the devices must receive the message while being connected to the GSM network. Furthermore, while being connected to NB-IoT the dispatch or reception of MT-SMS is not possible.

## SMS Expiry Date & Retry

For the case the subscriber is not reachable via MT-SMS, an expiry date can be set which is used to retry the delivery of the MT-SMS. The following sections will cover this behavior in detail.

### MO-SMS

When sending a MO-SMS towards a customer-server application using the SMS Forwarding Service, the default delivery expiry time is 24 hours. The delivery retry scheme works exponentially, i.e. the period between the different delivery attempts increases with each attempt. If delivery fails in the first attempt, due to the server being down or an incorrect Forwarding Service setup, the MO-SMS is buffered. In that case, for instance the 1st retry is done after 5 minutes, the 2nd after 15 minutes, each retry counting from the submit time. In case the message cannot be delivered with the default time of 24h, the MO-SMS will expire and no more retry takes place. 

### MT-SMS

A MT-SMS sent towards a device with a 1NCE SIM, the default expiry time is 24 hours if the message was submitted through the 1NCE Portal. When using the 1NCE API, the expiry time can be changed by customer. If the device with the 1NCE SIM is not reachable at the point of time when the MT-SMS was submitted, the retry mechanism will deliver the message as soon as the SIM attaches to the network the next time and is ready to receive messages, provided the MT-SMS has not expired.

### SMS Validity Time & Data Retention

Due to General Data Protection Regulation (GDPR) and the 1NCE data retention policy, a MT-SMS is stored at most seven days. After this period 1NCE deletes the MT-SMS data from the system and the content is no longer available. Therefore, it is recommended to set up the SMS Forwarding Service and Data Streamer Service for using the 1NCE SMS Service to the full extend.

### Originator Address/Number

Some devices and network operators require that an originate address or number is provided, otherwise some devices or MNOs will not accept the SMS messages. This originator address does not need to be configured to a specific SIM parameter in the 1NCE IoT domain. Any random numbering should work in this case as any returned SMS from the device are always send to the 1NCE Portal to SMS Forwarder. Please fill out this data when sending SMS via API or 1NCE Portal.
