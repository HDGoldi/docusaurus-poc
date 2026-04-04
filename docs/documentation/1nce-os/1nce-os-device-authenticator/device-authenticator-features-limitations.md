---
title: Features & Limitations
description: A look into what the 1NCE OS Device Authenticator can and cannot do.
sidebar_position: 1
---
## Features

The Device Authenticator solution is part of 1NCE OS and allows customers a seamless and fully automated device onboarding.

<br />

## Limitations

The Device Authenticator works only with enabled Breakout regions, which currently include Europe (Frankfurt) and US East (N. Virginia). For more details, see [Internet Breakout](/docs/network-services/network-services-internet-breakout).

## Security

Security is the highest focus for the Device Authenticator.

Each SIM Card is authenticated by the 1NCE core network using unique identifiers like IMSI, MSISDN and IMEI (if the IMEI Lock is activated by the customer). Additionally, the static, private IP addresses is used in the 1NCE core network to identify and check each data package processed by 1NCE OS to validate the authentication of the device.

To keep the devices functional and authenticated it should remain with the same SIM.

Further security is guaranteed through an encrypted communication between the device and 1NCE OS using DTLS for CoAP or LwM2M.
