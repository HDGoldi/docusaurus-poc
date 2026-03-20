---
title: SMS Forwarder Service
description: Automating the Reception of the SMS Service.
---
<div style={{textAlign: 'center'}}>
<img src="/img/platform-services/platform-services-sms-forwarder/001.png" alt="Schematic diagram of the structure of the SMS Forwarder Service." style={{maxWidth: '100%'}} />
</div>

As a counter part for Mobile Terminated (MT) SMS messages which are received by a mobile connected device, the 1NCE SMS Forwarding Services provides an interface for receiving Mobile Originated (MO) SMS messages. While MO-SMS can be viewed in the 1NCE Portal, it is cumbersome to use for large batches of SIM devices and can not be used for automation.

For more details about this service, refer to the subchapters in the menu on the left side.

The Forwarding Services provides HTTP Post/Patch messages for all SIM devices of an organization using the SMS Service. With the SMS Forwarding Server, MO-SMS messages and Delivery Reports (DLR) for MT-SMS are forwarded to a customer-specified HTTP endpoint as JSON objects. This chapter covers the basic working principle of the SMS Forwarding Service, the message events and a short setup guide to get the forwarder working in a practical use case.
