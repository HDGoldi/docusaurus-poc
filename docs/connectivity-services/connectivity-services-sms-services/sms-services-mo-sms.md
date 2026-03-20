---
title: Mobile Originated SMS
description: MO-SMS originated from a device with a 1NCE SIM.
---
<div style={{textAlign: 'center'}}>
<img src="/img/connectivity-services/connectivity-services-sms-services/sms-services-mo-sms/001.png" alt="Schematic sequence diagram of a MO-SMS message." style={{maxWidth: '100%'}} />
</div>

SMS messages originating from a device with a 1NCE SIM are referred to as Mobile Originated SMS (MO-SMS). Messages sent from an IoT devices with 1NCE SIM are only forwarded to application targets and not other devices. For accessing and receiving the messages, 1NCE offers multiple solutions for different needs. References to examples for all the listed methods are provided.

***

# 1NCE Portal

The most basic option to receive and visualize MO-SMS is the 1NCE Portal. In the web user interface, the messages and timestamps for individual SIM can be viewed. This is useful for debugging and testing with a limited amount of SIM cards. The data shown in the portal will be retained for seven days. Afterward, the records of the received SMS will no longer be visible. For more details about the usage of the portal, refer to the [My SIMs & SMS Console](/1nce-portal/portal-sims-sms) guide. See the [MO-SMS Portal Examples](/blueprints-examples/examples-sms/examples-mo-sms#1nce-portal--sms-console) for an example of MO-SMS in the 1NCE Portal.

***

# Management API

Besides monitoring SMS relevant parameters via the 1NCE API, it is also possible to query messages for specific SIM from the API. This application is meant for infrequent queries of a small number of messages, e.g. for testing purposes. Although it would be possible to query SMS messages for all SIM regularly, it is not recommended to create unnecessary HTTP Requests and loads on the API. A better solution for receiving large amounts of SMS messages regularly is the [SMS Forwarder Service](/platform-services/platform-services-sms-forwarder/index). The process of querying messages with the API and HTTP Requests is described in the [1NCE API](https://help.1nce.com/dev-hub/reference) documentation. See the [MO-SMS API Examples](/blueprints-examples/examples-sms/examples-mo-sms#1nce-sms-api) for example usage of the 1NCE API for MO-SMS.

***

# SMS Forwarding Service

For receiving SMS messages in an automated way, the SMS Forwarding Service is the ideal solution. It allows getting push messages via a customer-specified HTTP REST interface. Details about the Forwarding Service can be found in the [SMS Forwarder Service](/platform-services/platform-services-sms-forwarder/index) guide. See the [SMS Forwarder Examples](/blueprints-examples/examples-sms-forwarder/index) for examples on how to setup, test and use the SMS Forwarder Service.
