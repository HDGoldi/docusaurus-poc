---
title: Features & Limitations
description: Benefits of using the 1NCE VPN Service and its Limitations.
---
<div style={{textAlign: 'center'}}>
<img src="/img/network-services/network-services-vpn-service/vpn-service-features-limitations/001.png" alt="" style={{maxWidth: '100%'}} />
</div>

This chapter provides a high-level, abstract overview of the features and limitations of the 1NCE VPN Service. It shows the extended possibilities and benefits of the VPN, compared to the regular Internet Breakout capabilities of the 1NCE SIM. In addition, the limitations of the service are pointed out.

***

# Features

The 1NCE VPN Service is available in Manual Mode for the selected Breakout Setting and the usage of this service is optional and free of charge. In the following section, the main features and function of this service will be shown.

## Bidirectional Communication Establishment

Compared to the default Internet Breakout capabilities of the 1NCE SIM Connectivity, the VPN Service allows bidirectional communication establishment (see Figure above). An IoT device with a 1NCE SIM can communicate directly to an application server by addressing the VPN client endpoint IP of this server. Vise versa, the application server can reach a listening 1NCE SIM device with an active PDP context (data session) via the VPN tunnel interface by setting up the communication to the static IP addresses of the SIM. This setup is required for the server-to-device initiated communication using common Internet Protocols or remote SSH connections to access the mobile device. The customer is free to use any user transport protocol (e.g., TCP, UDP, MQTT, CoAP, etc.) and any port number over the VPN connection.

## Internet Breakout

As the 1NCE VPN Service is available in parallel with the normal Internet Breakout connectivity, a device with a 1NCE SIM can still use the normal internet connectivity while the VPN connection is established. This has the benefit that sensitive data can be sent via the VPN endpoint IP address to a server, but general requests (e.g., NTP or public API queries) can be directly done by the device without the need to set up forwarding internet traffic through the VPN connection.

The 1NCE VPN Service is not available if the Automatic Mode for the Internet Breakout is used. For using the 1NCE VPN Service, please set a manual Internet Breakout Region. The VPN configuration is specific for each individual Breakout Region. Please download the matching VPN config from the 1NCE Portal. After a change in the breakout settings, the VPN client needs to be altered with the region-specific configuration.

One VPN client at a time can be used and each VPN client IP will be different per breakout region. The client IP for each region is static with the given credentials but might change e.g. due to a customer requested token update.

1NCE always suggests to use DNS to dynamically resolve the private VPN client IP on the SIM devices. Hardcoding the IP address of any component such as VPN client or SIM device is not recommended.

## Enhanced Security

The 1NCE VPN Service offers overall improved connection security. All SIM-related traffic exchanged between the 1NCE Core network and the customer application server can be sent over the VPN connection by using the assigned SIM or IP ranges respectively. This private virtual network offers direct access to the SIM with no other public traffic to worry about and filter. All tunnel traffic is handled over one port and connection, which is easier to integrate and maintain.

## No Additional Cost

The 1NCE VPN Service is included for all 1NCE SIM customers and is not extra charged. The usage of the VPN does not produce more overhead with regards to the data volume usage. Transmitting data via the default Internet Breakout or the 1NCE VPN Service will result in the same usage of data volume for the SIM. All the traffic sent and received by a SIM is accounted as volume usage independent of the VPN usage.

## Globally distributed Servers

The 1NCE VPN Service is available in all three Breakout Regions for selection in the Manual Mode. Each Breakout provides a dedicated OpenVPN Server to provide the flexibility to select the closest location to your application server.

***

# Limitations

Due to technical constraints, certain limitations apply to the 1NCE VPN Service, which needs to be taken into consideration.

## OpenVPN Version 3

Currently version 3 of the OpenVPN client is not natively supported by the 1NCE VPN Service. It is recommended to use the latest OpenVPN version 2.x for connecting to the VPN and using the direct SIM data connection.

## OpenVPN Version 2.6.x Updates

For customers upgrading their existing OpenVPN version to 2.6 and above might need to download a new 1NCE configuration file from the 1NCE Portal. Some parameters were optimized for the newer versions of OpenVPN, the basic configuration and IP addresses will remain the same as before.

## VPN Connection Limit

The 1NCE VPN Service supports one active VPN client connection per (sub-) organization (see Figure below) at a time. If multiple clients try to connect at the same time, inconsistent data connections with random disconnects between the clients will occur. For establishing multiple connections to the 1NCE network, please refer to the IPSec Service or create additional suborganizations. Every (sub-) organization receives its own access data.

<div style={{textAlign: 'center'}}>
<img src="/img/network-services/network-services-vpn-service/vpn-service-features-limitations/002.png" alt="Overview showing that multiple VPN connections are not possible." style={{maxWidth: '100%'}} />
</div>

## VPN Client IP Routes

When the OpenVPN client establishes as connection to the VPN server all required network routes will be pushed to the client, ensuring that all SIM cards of an organization can be reached from the client. There will be one network route entry per assigned IP address space. Though the OpenVPN server does not push changes in routes while a VPN connection is established. Consequently, the OpenVPN must be restarted to receive routes for additional IP address spaces. If you have received additional SIM cards you may want to check the 1NCE Portal if any new IP address spaces were added to your organization. 

> ❗️ New IP Spaces
>
> Please restart your VPN connection if you ordered a large new batch of SIMs which received a different IP Space range.

## Conflicting IP Ranges

As 1NCE uses private IP spaces (RFC 1597) for the connectivity SIM and OpenVPN client, there is a chance for an IP address conflict if the same IP address range is used in your local network or data center. To resolve this issue, the local network IP addresses can be changed or the 1NCE VPN Service access needs to be segregated from the rest of the affected network.

## VPN Client Password Length

Some OpenVPN client implementations are limited to a password length of smaller than 128 characters. As the credentials provided by the 1NCE VPN Service are longer than this limitation, in rare cases this will cause an AUTH\_FAILED response when connecting to the VPN server. This issue can be mitigated by upgrading to a more recent OpenVPN implementation or changing the password length parameter during compiling. In the case an update is possible, we recommend to implement the VPN Client Service on a different server system. If an update or other deployment is not possible and the issue is consistent, please contact the 1NCE support for further advice.

## Default Traffic Routing

When using the 1NCE VPN Service, only data routed by the single connected device towards the OpenVPN Client IP is actually sent to the customer-side VPN endpoint. All other traffic is transmitted using the default Internet Breakout. For an application case where all traffic (DNS , NTP, etc.) should be accessible through the VPN , the routes on the connected device with the 1NCE SIM needs to be adapted by the customer.

## Maximum Transmission Unit Size

Using the 1NCE VPN, some device connections might have issues with the Maximum Transmission Unit (MTU) size. A symptom is often that larger payloads do not get delivered. To avoid this issue, please lower the MTU to 1300 using the `tun-mtu 1300` configuration parameter in the VPN client configuration.

## Internet Breakout Region

VPN is not available if the Automatic Mode for the Internet Breakout is used.

To use the VPN Service, please set a manual Internet Breakout Region. The VPN configuration is specific for each individual Breakout Region. Therefore, after a change in the breakout setting the VPN client needs to be altered with the region-specific configuration. 

The VPN client IP will be different for each of the possible Internet Breakout Regions. This needs to be taken into consideration when designing the SIM device firmware.

## Inactive VPN Connection Deactivation

VPN connections not actively in use should be disconnected by the customer. After three months of VPN inactivity, 1NCE reserves the right to deactivate the VPN connection from the core network side. This measure helps to maintain network efficiency and security. 

If a VPN connection has been deactivated due to inactivity, the existing VPN configuration will no longer be operational. To resume VPN service usage, a new credential file must be downloaded from the 1NCE Customer Portal and the connection must be reconfigured.
