---
title: SMS Services
description: Examples for the 1NCE SMS Services.
---
# Mobile Originated SMS

<div style={{textAlign: 'center'}}>
<img src="/img/blueprints-examples/examples-sms/001.png" alt="" style={{maxWidth: '100%'}} />
</div>

Mobile Originated (MO) SMS messages can be issued by devices with a 1NCE SIM card installed. As a SMS can not be send in-between different 1NCE SIM devices, all MO-SMS can only be accessed/received through the 1NCE Portal, 1NCE SMS API and the SMS Forwarder.

The following sections will show examples for:

* <a href="examples-mo-sms#1nce-portal--sms-console">1NCE SMS Console for MO-SMS</a>
* <a href="examples-mo-sms#1nce-sms-api">1NCE API MO-SMS Integration</a>
* <a href="examples-mo-sms#sim-device-mo-sms">MO-SMS on SIM Devices</a>

Examples for the 1NCE SMS Forwarding Service can be found in the <a href="examples-sms-forwarder">SMS Forwarder</a> section.

***

# Mobile Terminated SMS

<div style={{textAlign: 'center'}}>
<img src="/img/blueprints-examples/examples-sms/002.png" alt="" style={{maxWidth: '100%'}} />
</div>

Mobile Terminated (MT) SMS messages are destined for a device with an installed 1NCE SIM. Such MT-SMS can be issued via the 1NCE Portal using the SMS Console or using the 1NCE API. While the SMS console is great for debugging and getting started, the usage through the 1NCE API provides a fully-featured access to automate the SMS messing sending process.

The following subsections will show examples for:

* <a href="examples-mo-sms#1nce-portal--sms-console">1NCE SMS Console for MT-SMS</a>
* <a href="examples-mo-sms#1nce-sms-api">1NCE API MT-SMS Integration</a>
* <a href="examples-mo-sms#sim-device-mo-sms">MT-SMS on SIM Devices</a>
