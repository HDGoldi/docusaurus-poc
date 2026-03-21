---
title: Data Volume
description: Insight into the Data Volume calculation.
sidebar_position: 4
---
Based on the specific tariff of the 1NCE SIM, a set amount of data volume is included. The used and available volume for each of the SIM can be viewed in the [My SIMs & SMS Console](/1nce-portal/portal-sims-sms) or queried through [1NCE API](https://help.1nce.com/dev-hub/reference). The following sections will explain what data volume usage is deducted from the volume and how this can be calculated for some protocols.

***

# Data Volume Usage

When using the 1NCE data service, both uplink (UL) and downlink (DL) data transmissions are counted towards the used volume. Taking a look at the different layers in the communication in the figure below, only the traffic inside the GTP is considered for billing. The IP overhead, specific network protocol (e.g., TCP, UDP, MQTT, etc.) overhead, and actual payload size account as data usage. For sending large data packets, IP fragmentation generates further overhead data traffic. It does not matter if the 1NCE VPN service or a direct internet breakout is used as this does not constitute a difference in the usage data. 

<div style={{textAlign: 'center'}}>
<img src="/img/connectivity-services/connectivity-services-data-services/data-services-data-volume/001.png" alt="Schematic description of the data service layers and their volume usage." style={{maxWidth: '100%'}} />
</div>

Important to note is that besides the overhead for sending a payload, additional data transfers for the connection establishment, synchronize, acknowledge, or retransmission exchanges dependent on the used network protocols need to be accounted for in the data usage. This additional overhead is hard to estimate as it is depended on many other factors (e.g., wireless data link quality, latency, etc.). Example calculations for some of the most commonly used protocols are shown in the [example scenarios](#example-scenarios).

***

# Self-Set Data Volume Limits

A customer-specified limit for the data volume can be set in the 1NCE Portal Configuration tab or through the 1NCE API. This limit applies to the usage of data volume for all SIM in the organization. These limits can be used to restrict the data volume usage per month for the SIMs from the network side. The limits can be set in predetermined steps and will be reset on the first day of each new month.

## Reaching and Resetting the Limit

If a SIM runs into this limitation, an Event Record **PDP Context Request rejected, because endpoint is currently blocked due to exceeded traffic limit.** will be generated when attempting to create a new data session. Further a customer notification will be generated. To reenable a SIM, please either wait until the volume is reset at the beginning of the month or manually increase the limit via the 1NCE Portal or 1NCE API.

> ❗️ Error Warning Exceeded Limit
>
> When the limit is reached new PDP data sessions will be rejected:\
> **PDP Context Request rejected, because endpoint is currently blocked due to exceeded traffic limit.** 
>
> Please note that some devices might retry indefinitely to reconnect in such a case. 1NCE strongly advices to use a back-off approach in this rejection case to not flood the network with PDP session requests.

***

# Example Scenarios

To provide a better understanding of the estimation of data volume usage, a few examples with commonly used network protocols are listed below.

## DNS Resolution

When using URLs as a reference, these have to be resolved via a DNS request to obtain the target IP address. This resolution process generates additional traffic which is often overlooked in the usage calculation. The table shown an example data usage for one DNS resolution. Dependent on the IoT device software, multiple DNS queries might be executed as part of a normal operation. 

> 📘 Avoiding DNS Resolution
>
> It is possible to avoid the DNS resolution if the IP address of the destination is known. In this case, the device should be configured to send data to the IP instead of the DNS.
>
> However, this comes with a risk. For example, the application may stop working should the IP change. Usually, the DNS stays the same but point to the correct IP, even when a new IP is being used.\
> As such, there is a risk that at some point of time data is not reaching its intended destination as the IP was reassigned. Therefore, we generally recommend using the address "udp.os.1nce.com" instead of the IP behind the DNS.

| Description | DNS/UDP Packets | IP Packets | Data Volume Sum |
| --- | --- | --- | --- |
| **DNS Resolution** | **94 Bytes** | **40 Bytes** | **134 Bytes** |
| *DNS Query* e.g. [www.google.de](http://www.google.de) | 39 Bytes | 20 Bytes | 59 Bytes |
| *DNS Response* | 55 Bytes | 20 Bytes | 75 Bytes |

## Transmission Control Protocol (TCP)

In this use case, the minimal TCP network protocol is used to send a payload of 100 bytes of data from a device towards a server. Afterward, 50 bytes are returned from the server towards the device. The shown calculation is based on the assumption that no retransmissions will be needed. Depending on the application and the used header options for TCP and IP, the size of these packets will be larger.

| Description | TCP Packets | IP Packets | Data Volume Sum |
| --- | --- | --- | --- |
| **3-Way Handshake** | **64 Bytes** | **60 Bytes** | **124 Bytes** |
| *SYN* | 20 Bytes | 20 Bytes | 40 Bytes |
| *SYN/ACK* | 24 Bytes | 20 Bytes | 44 Bytes |
| *SYN* | 20 Bytes | 20 Bytes | 40 Bytes |
| **Payload Exchange** | **230 Bytes** | **80 Bytes** | **310 Bytes** |
| *PSH/ACK* *100 Bytes Payload* | 120 Bytes | 20 Bytes | 140 Bytes |
| *ACK* | 20 Bytes | 20 Bytes | 40 Bytes |
| *PSH/ACK* *50 Bytes Payload* | 70 Bytes | 20 Bytes | 90 Bytes |
| *ACK* | 20 Bytes | 20 Bytes | 40 Bytes |
| **Connection Shutdown** | **80 Bytes** | **80 Bytes** | **160 Bytes** |
| *FIN/ACK* | 20 Bytes | 20 Bytes | 40 Bytes |
| *ACK* | 20 Bytes | 20 Bytes | 40 Bytes |
| *FIN/ACK* | 20 Bytes | 20 Bytes | 40 Bytes |
| *ACK* | 20 Bytes | 20 Bytes | 40 Bytes |
| **Total Sum** | **374 Bytes** | **220 Byte** | **594 Bytes** |

## User Datagram Protocol (UDP)

In comparison to the TCP header (20 bytes), the UDP header with only 8 bytes is more lightweight. Furthermore, UDP does not rely on the 3-way handshake and acknowledging individual data packets. This makes it a bit more unreliable but can save a lot of transmitted data in suitable applications. The use case shown in the calculation is the same as for the TCP example. A payload of 100 bytes of data from a device towards a UDP server. Afterward, 50 bytes are returned from the server towards the device.

| Description | UDP Packets | IP Packets | Data Volume Sum |
| --- | --- | --- | --- |
| **Payload Exchange** | **166** | **40** | **206** |
| *Device to Server* *100 Bytes Payload* | 108 | 20 | 128 |
| *Server to Device* *50 Bytes Payload* | 58 | 20 | 78 |
| **Total Sum** | **166** | **40** | **206** |
