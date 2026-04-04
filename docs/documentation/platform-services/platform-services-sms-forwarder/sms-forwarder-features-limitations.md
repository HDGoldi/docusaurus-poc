---
title: Features & Limitations
description: Features of the SMS Forwarder.
sidebar_position: 1
---
# Features

## SMS Automation

The usage of the SMS Forwarder is optional. By default MT- and MO-SMS messages of the last seven days are shown in the SMS Console in the 1NCE Portal. The Forwarder Services allows for an easy integration into automated processes without the need to constantly query the 1NCE API. The service pushes new incoming SMS messages and delivery reports towards the customer specified endpoint. 1NCE recommends using the Forwarding Service for automation of receiving regular, larger batches of SMS messages in a publish-subscribe manner.

## MO-SMS Reception

With the 1NCE SMS Forwarding Service, Mobile Originated (MO) SMS messages can be forwarded to a customer specified HTTP endpoint. The incoming messages from the SIMs of the organization are delivered as JSON objects with additional SMS parameters. These additional parameters indicate multi-part SMS, the used encoding and references to the originating SIM of the message.

The figure below shows an example sequence (successful and failed) of the MO-SMS delivery using the SMS Forwarding Service.

<div style={{textAlign: 'center'}}>
<img src="/img/platform-services/platform-services-sms-forwarder/sms-forwarder-features-limitations/001.png" alt="Schematic sequence diagram of a MO-SMS reception." style={{maxWidth: '100%'}} />
</div>

## MT-SMS Delivery Report

Outgoing, Mobile Terminated (MT) SMS which are send from the 1NCE Portal or API, generate Delivery Reports (DLR) when processed by the recipient. The SMS Forwarding Services also provide these DLR messages in the form of HTTP Patch requests to the customer endpoint. The DLR messages include in the JSON Body the delivery status of the send MT-SMS, timestamps of the delivery and SMS submission and references to the SIM that the SMS was send toward.

The figure below shows an example sequence (successful and failed) of a Delivery Report for a MT-SMS being delivered through the SMS Forwarding Service. The initial MT-SMS was issued via the 1NCE Portal or the 1NCE API.

<div style={{textAlign: 'center'}}>
<img src="/img/platform-services/platform-services-sms-forwarder/sms-forwarder-features-limitations/002.png" alt="Schematic sequence diagram of a MT-SMS DLR reception." style={{maxWidth: '100%'}} />
</div>

# HTTP Request Interface

With the SMS Forwarding Server, MO-SMS messages and Delivery Reports (DLR) for MT-SMS are forwarded to a customer-specified HTTP REST endpoint as JSON objects.\
The customer needs to provide a REST Interface, which accepts HTTP Post/Patch requests issued from the 1NCE SMS Forwarding Service. The server needs to have a valid domain with HTTPS capabilities. To an incoming HTTP Post/Patch request, the server should reply with an HTTP 200 status code.\
For more details about the setup and testing visit the <a href="/docs/blueprints-examples/examples-sms-forwarder/">SMS Forwarder Example Guide</a>.

***

# Limitations

## MO-SMS and DLR Reception Only

The SMS Forwarding Service is only intended to receive MO-SMS and DLR for MT-SMS. Thus, it is not possible to use this service to push or publish any kind of SMS message towards the SIM devices. It is intended as a publish-subscribe listening service. To issue new MT-SMS towards a SIM device, the 1NCE API or 1NCE Portal SMS Console have to be used instead.

## Organization Restriction

It is only possible to setup one SMS Forwarder per organization. This forwarder will then receive the MO-SMS and DLR for all SIMs of the particular organization instance. This will not include the SIMs and messages of any sub- or parent-organization SIM devices.

## Retry Mechanism & Message Consumption

When a configured SMS Forwarding endpoint is not reachable, redelivery for 24 hours in case of no HTTP 200 status response is attempted. Afterwards the messages will be dropped. If events can not be delivered to a configured forwarder, an error will written in the 1NCE Data Streamer and shown in the 1NCE Portal.\
Messages acknowledged with HTTP 200 are consumed by the customer-side HTTP endpoint and are therefore not redelivered. Still, the event messages will still be visible in the 1NCE Portal and accessible through the 1NCE API for seven days.
