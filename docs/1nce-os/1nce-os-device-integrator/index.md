---
title: Device Integrator
---
<div style={{textAlign: 'center'}}>
<img src="/img/1nce-os/1nce-os-device-integrator/d496e66-IoT_Integrator.png" alt="Device Integrator as part of the IoT Integrator" width="80%" />
</div>

The Device Integrator supports connecting devices to 1NCE OS managed services. For that we offer multiple protocols that can be used and tested in the 1NCE OS: UDP, CoAP and LwM2M. The available devices can be found in the [Device Inspector](doc:1nce-os-device-inspector).

To establish connection we provide special domain names for each protocol. Each domain name resolves to two IP addresses. Those IPs can also be cached on the embedded device if necessary, but we do not guarantee that those IPs will always stay the same. So it is suggested to always have fallback DNS resolvement implemented at some point or at least when connection error occurs.

The supported protocols are UDP, CoAP and LwM2M and the connection info is visible in the 1NCE OS frontend. Further information about these protocols can be found in the subpages and the LwM2M chapter:

* [UDP](doc:device-integrator-udp)
* [CoAP](doc:device-integrator-coap)
* [LwM2M](doc:1nce-os-lwm2m)

<br />

**Note:** To successfully reach 1NCE OS endpoints, ensure that the account is configured with the appropriate allowed Breakout network settings, which currently include Europe (Frankfurt) and US East (N. Virginia). For more details, see [Internet Breakout](doc:network-services-internet-breakout)
