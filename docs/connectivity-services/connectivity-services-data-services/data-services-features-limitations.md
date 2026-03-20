---
title: Features & Limitations
description: An overview of what the 1NCE SIM Data Service can and cannot do.
---
# Features

## Service Availability

The data service is available with all 1NCE SIMs using the Radio Access Technologies (RAT) 2G, 3G, 4G, LTE Cat-M and NB-IoT. The local availability depends on the coverage of the 1NCE roaming partners. Not all RAT are provided in each country.

## Data Bandwidth Throughput

While most IoT applications might only have low bandwidth and not very strict latency requirements, other use cases might require high bandwidth with low latency. The 1NCE Data Service offers a maximum guaranteed data throughput of one megabit per second (**1 MBit/s**). Please note that the achievable throughput and latency are dependent on the used RAT, device specifications, and environmental factors (e.g., location, signal reception, etc.).

## SIM - IP Address

* Each customer gets personal, private Internet Protocol (IP) ranges assigned for their SIM cards. 
* 1NCE uses addresses from the private IP space (<a href="https://datatracker.ietf.org/doc/html/rfc1597">RFC 1597</a>) which are not allocated in the public internet and thus can be used freely in private networks.
* All SIM cards assigned will have an IP address of one or more dedicated IP address spaces.
* Usually, /24 address spaces will be used where in total 254 SIM cards can be fitted into. It is possible that /16 IP spaces with 65.536 individual SIM addresses might be used in newer organizations.
* Additional IP space(s) will be assigned automatically.
* SIMs will be assigned randomly to the IP space(s) of the given organization.
* SIM IP address will be static as long as the SIM is not transferred between (sub-)organizations. A transfer will cause a change in IP address.
* It is possible that a SIM card can get assigned a x.x.x.0 IP address. 
* The IP address spaces assigned to your account can be verified in the 1NCE Portal.

> 📘 SIM IP Spaces Changes
>
> Please note that the pool of general SIM IP Spaces might be altered and new spaces might be added later on to increase overall capacity.

## SIM - IP Spaces

All 1NCE SIMs are assigned IP Addresses from the following general IP Spaces. The IP Spaces assigned to customers will originate from these larger spaces. It is important to keep track of these spaces especially for VPN, IP Sec and VPN Peering setups.

* 100.64.0.0/10
* 10.21.0.0/16
* 10.22.0.0/15
* 10.24.0.0/14
* 10.32.0.0/12
* 10.52.0.0/14
* 10.56.0.0/14
* 10.129.0.0/16
* 10.130.0.0/15
* 10.132.0.0/14
* 10.137.0.0/16
* 10.138.0.0/15
* 10.140.0.0/14
* 10.144.0.0/13
* 10.152.0.0/14
* 10.156.0.0/15
* 10.160.0.0/11
* 10.192.0.0/10
* 10.240.0.0/13
* 10.248.0.0/13

<br />

## Network Translation and 1NCE VPN

The infrastructure of the 1NCE Data Service network uses Network Address Translation (NAT) to route traffic from each connected SIM device to the public internet. For providing a private, more secure connectivity, as the devices are not directly exposed to the public internet. This also implies that a connection establishment from an application on the internet towards a 1NCE SIM is not directly possible without using the 1NCE VPN Service. On the other hand, target locations in the public internet space can be reached from any device with a 1NCE SIM. The traffic from each device is routed via the 1NCE Internet Breakout. For more details review the 1NCE Network Services, [Internet Breakout](/network-services/network-services-internet-breakout) and [VPN Service](/network-services/network-services-vpn-service/index).

> 📘 Data Connection Establishment
>
> When using the default Internet Breakout, the SIM device has to establish the Data Connection towards the targeted internet service. Due to the NAT Gateway, individual SIMs are not reachable from the open internet.

The sequence diagram below shows the flow of a SIM device using the NAT Internet Breakout to establish a connection to a public internet server/service. The connection establishment always needs to come from the SIM device. After a connection session (e.g., TCP session) was opened by the SIM device, bidirectional communication is possible.

<div style={{textAlign: 'center'}}>
<img src="/img/connectivity-services/connectivity-services-data-services/data-services-features-limitations/001.png" alt="Schematic sequence diagram of a data session establishment." style={{maxWidth: '100%'}} />
</div>

The second sequence diagram below shows the possible data service when using the 1NCE VPN Service. This free to use service allows to directly connect to the 1NCE Network to access/connect SIM devices from the customer server side. Please note that only traffic from the SIM device with the VPN client IP address as destination will be routed towards the connected VPN client. All other traffic from the SIM device will be routed through the Internet Breakout. For more details, please see the VPN Service chapter.

<div style={{textAlign: 'center'}}>
<img src="/img/connectivity-services/connectivity-services-data-services/data-services-features-limitations/002.png" alt="Schematic sequence diagram of a data session establishment using the 1NCE VPN service." style={{maxWidth: '100%'}} />
</div>

## Data Protocols

The concept of the Open Systems Interconnection model applies to the 1NCE Data Service structure. The GPRS Tunneling Protocol (GTP) is used on layer 3 to transfer user application data between the device with a 1NCE SIM and the internet or application server and vice versa. All the data traffic is wrapped in the GTP, on top of this protocol (layer 4+) the customer is free to use any transport protocol (e.g., TCP, UDP, MQTT, CoAP, etc.) and any port assignment. 

## Domain Name System (DNS)

The Domain Name System (DNS) is used to resolve Uniform Resource Locators (URL) to an addressable IP. When using the 1NCE Internet Breakout, the public IP `8.8.8.8` is served as primary and `8.8.4.4` as secondary default Domain Name Server. Some devices have issues with obtaining the DNS served by the network. A manual configuration of a DNS is sometimes advisable.

On some NB-IoT U-Blox devices used in Europe, MNO profile 101 has to be used rather than MNO profile 100 to obtain the DNS served by the network. 

***

# Limitations

## Maximum Transmission Unit (MTU) Size

The Maximum Transmission Unit (MTU) is the size of the largest IP packet (layer 4) possible which can be transferred in a respective frame on layer 3 without the need for fragmentation in the packed based core network. If a send packet is larger than the specified MTU, the packet needs to be fragmented, thus creating more overhead and delays. Theoretically, a size of 1500 bytes is possible with the 1NCE Data Service. Based on prior experience with IoT devices and mobile networks, it is recommended to keep the **MTU size lower than about 1200 bytes**.

## Data Volume Usage

Based on the customer specific tariff of a 1NCE SIM, a certain data volume is included. The available volume and current usage can be inquired in the 1NCE Portal or through the [1NCE API](https://help.1nce.com/dev-hub/reference). The data volume can be used freely. If the volume runs out or customer-set threshold is reached, the Data Service for a SIM card is blocked. No new data sessions (PDP Context) can be initialized. The device can still attach to the mobile network and use the other services but is not able to re-create a new PDP Context. Moreover, any existing data session is terminated if the volume limit is reached. If the restricted SIM is topped up with new data volume, the blocking will be reset and new data sessions can be established. If a SIM runs out of data volume, the device **should restrict the attempts to create new (failed) PDP sessions** as the reject response can lead to the device spamming the network with session requests. Please note that the customer is responsible for implementing a back off timer for this edge case behavior.

{/*

 

## Internet Breakout Timeout

> ❗️ 
> 
> **This does only apply to connections made through the 1NCE Internet Breakout and NOT the 1NCE VPN Service!**

Devices using the 1NCE Internet Breakout are placed behind a NAT gateway. After 350 seconds of no packets being transmitted, a established connection via the 1NCE Internet Breakout will be closed automatically. To keep the connection alive within 350 seconds a IoT device must send a keep-alive packet at least once in the 350-second timeframe. Otherwise, the 1NCE SIM device must re-establish the connection after this timeout.

*/}

## 1NCE Breakout IP Blacklisting

The traffic from all 1NCE SIMs towards the public internet is routed through a NAT with a couple of public-facing IP addresses. These public breakout IPs are listed in the 1NCE Portal. All requests towards public internet services appear to come from only these few IPS. Most public services and APIs apply a request limit and smart filtering to detect and filter out denial of service (DDoS) and similar attacks. Very frequent queries (e.g., every second) from multiple SIMs towards one endpoint could trigger these filtering mechanisms. This will result in the public service blocking requests from 1NCE SIM devices, rendering the service unusable. Most public services cannot differentiate between individual SIMs due to the 1NCE NAT network structure. It is strongly recommended to program devices with 1NCE SIMs in a way that they do not aggressively query such shared resources.

## Multiple PDP Data Sessions

With the 1NCE SIM connectivity, currently only one PDP data session at a time is supported. If the IoT device allows to establish multiple PDP sessions, only the last opened data session can be used to transfer data. Sessions opened prior will remain open but will be dropped on the Packet Gateway. This results in no data being transferred other the older PDP sessions.\
For ease of use ensure to use only one PDP data session at a time and to always properly close each session.

## Device to Device Communication

The peer to peer communication between two or multiple SIMs is not possible. This rules is the same for SIMs of one customer or between different customers. There is no direct routing of IP traffic between SIMs possible. To exchange specific data packages between SIM devices, an application server is needed. This application server is ideally connected via the 1NCE VPN Service. Thus, it can receive data messages from one SIM device via the VPN client IP and redirect them to another SIM device in the same customer account by its static IP address.

## TCP/TLS with NB-IoT

NB-IoT is great for getting coverage in hard-to-reach areas like basements or countryside. It comes with the disadvantage of higher transmission latency as the radio device repeats transmissions multiple times to allow the receiving cell tower to capture the data accurately. 

In total, it can add up to an expected latency between 1 and 10 seconds. Compared to the latency of normal LTE or CAT-M of 10 to 100 milliseconds, NB-IoT latency is very high. Due to the high latency, it is not advised to use TCP based protocols for data transmission. These protocols expect lower latency. TCP based protocols can work over NB-IoT in ideal conditions but if the latency increases due to environment changes or radio changes, TCP will start sending retransmissions and the connectivity will start to break.

1NCE recommends using only UDP based protocols like CoAP or LwM2M for NB-IoT radio access type. The feature set of these specialized protocols closely match TCP behavior with the added benefit of being more robust in high latency transmissions.

Please avoid using TCP based protocols on NB-IoT radio interfaces.

{/*

 

## PDP Data Session Retention7 days1kb of dataotherwise dropped

*/}
