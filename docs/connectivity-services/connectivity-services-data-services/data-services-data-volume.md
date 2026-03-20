---
title: Data Volume
description: Insight into the Data Volume calculation.
---
Based on the specific tariff of the 1NCE SIM, a set amount of data volume is included. The used and available volume for each of the SIM can be viewed in the [My SIMs & SMS Console](doc:portal-sims-sms) or queried through [1NCE API](https://help.1nce.com/dev-hub/reference). The following sections will explain what data volume usage is deducted from the volume and how this can be calculated for some protocols.

***

# Data Volume Usage

When using the 1NCE data service, both uplink (UL) and downlink (DL) data transmissions are counted towards the used volume. Taking a look at the different layers in the communication in the figure below, only the traffic inside the GTP is considered for billing. The IP overhead, specific network protocol (e.g., TCP, UDP, MQTT, etc.) overhead, and actual payload size account as data usage. For sending large data packets, IP fragmentation generates further overhead data traffic. It does not matter if the 1NCE VPN service or a direct internet breakout is used as this does not constitute a difference in the usage data. 

<HTMLBlock>{`
<center><img alt="Schematic description of the data service layers and their volume usage." src="/img/connectivity-services/connectivity-services-data-services/data-services-data-volume/001.png" style="cursor:pointer;max-width:100%;" onclick="(function(img){if(img.wnd!=null&&!img.wnd.closed){img.wnd.focus();}else{var r=function(evt){if(evt.data=='ready'&&evt.source==img.wnd){img.wnd.postMessage(decodeURIComponent(img.getAttribute('src')),'*');window.removeEventListener('message',r);}};window.addEventListener('message',r);img.wnd=window.open('https://viewer.diagrams.net/?client=1&page=0&edit=_blank');}})(this);"/></center>
`}</HTMLBlock>

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

<Table align={["left","left","left","left"]}>
  <thead>
    <tr>
      <th>
        Description
      </th>

      <th>
        DNS/UDP Packets
      </th>

      <th>
        IP Packets
      </th>

      <th>
        Data Volume Sum
      </th>
    </tr>
  </thead>

  <tbody>
    <tr>
      <td>
        **DNS Resolution**
      </td>

      <td>
        **94 Bytes**
      </td>

      <td>
        **40 Bytes**
      </td>

      <td>
        **134 Bytes**
      </td>
    </tr>

    <tr>
      <td>
        *DNS Query*\
        e.g. [www.google.de](http://www.google.de)
      </td>

      <td>
        39 Bytes
      </td>

      <td>
        20 Bytes
      </td>

      <td>
        59 Bytes
      </td>
    </tr>

    <tr>
      <td>
        *DNS Response*
      </td>

      <td>
        55 Bytes
      </td>

      <td>
        20 Bytes
      </td>

      <td>
        75 Bytes
      </td>
    </tr>
  </tbody>
</Table>

## Transmission Control Protocol (TCP)

In this use case, the minimal TCP network protocol is used to send a payload of 100 bytes of data from a device towards a server. Afterward, 50 bytes are returned from the server towards the device. The shown calculation is based on the assumption that no retransmissions will be needed. Depending on the application and the used header options for TCP and IP, the size of these packets will be larger.

<Table align={["left","left","left","left"]}>
  <thead>
    <tr>
      <th>
        Description
      </th>

      <th>
        TCP Packets
      </th>

      <th>
        IP Packets
      </th>

      <th>
        Data Volume Sum
      </th>
    </tr>
  </thead>

  <tbody>
    <tr>
      <td>
        **3-Way Handshake**
      </td>

      <td>
        **64 Bytes**
      </td>

      <td>
        **60 Bytes**
      </td>

      <td>
        **124 Bytes**
      </td>
    </tr>

    <tr>
      <td>
        *SYN*
      </td>

      <td>
        20 Bytes
      </td>

      <td>
        20 Bytes
      </td>

      <td>
        40 Bytes
      </td>
    </tr>

    <tr>
      <td>
        *SYN/ACK*
      </td>

      <td>
        24 Bytes
      </td>

      <td>
        20 Bytes
      </td>

      <td>
        44 Bytes
      </td>
    </tr>

    <tr>
      <td>
        *SYN*
      </td>

      <td>
        20 Bytes
      </td>

      <td>
        20 Bytes
      </td>

      <td>
        40 Bytes
      </td>
    </tr>

    <tr>
      <td>

      </td>

      <td>

      </td>

      <td>

      </td>

      <td>

      </td>
    </tr>

    <tr>
      <td>
        **Payload Exchange**
      </td>

      <td>
        **230 Bytes**
      </td>

      <td>
        **80 Bytes**
      </td>

      <td>
        **310 Bytes**
      </td>
    </tr>

    <tr>
      <td>
        *PSH/ACK*\
        *100 Bytes Payload*
      </td>

      <td>
        120 Bytes
      </td>

      <td>
        20 Bytes
      </td>

      <td>
        140 Bytes
      </td>
    </tr>

    <tr>
      <td>
        *ACK*
      </td>

      <td>
        20 Bytes
      </td>

      <td>
        20 Bytes
      </td>

      <td>
        40 Bytes
      </td>
    </tr>

    <tr>
      <td>
        *PSH/ACK*\
        *50 Bytes Payload*
      </td>

      <td>
        70 Bytes
      </td>

      <td>
        20 Bytes
      </td>

      <td>
        90 Bytes
      </td>
    </tr>

    <tr>
      <td>
        *ACK*
      </td>

      <td>
        20 Bytes
      </td>

      <td>
        20 Bytes
      </td>

      <td>
        40 Bytes
      </td>
    </tr>

    <tr>
      <td>

      </td>

      <td>

      </td>

      <td>

      </td>

      <td>

      </td>
    </tr>

    <tr>
      <td>
        **Connection Shutdown**
      </td>

      <td>
        **80 Bytes**
      </td>

      <td>
        **80 Bytes**
      </td>

      <td>
        **160 Bytes**
      </td>
    </tr>

    <tr>
      <td>
        *FIN/ACK*
      </td>

      <td>
        20 Bytes
      </td>

      <td>
        20 Bytes
      </td>

      <td>
        40 Bytes
      </td>
    </tr>

    <tr>
      <td>
        *ACK*
      </td>

      <td>
        20 Bytes
      </td>

      <td>
        20 Bytes
      </td>

      <td>
        40 Bytes
      </td>
    </tr>

    <tr>
      <td>
        *FIN/ACK*
      </td>

      <td>
        20 Bytes
      </td>

      <td>
        20 Bytes
      </td>

      <td>
        40 Bytes
      </td>
    </tr>

    <tr>
      <td>
        *ACK*
      </td>

      <td>
        20 Bytes
      </td>

      <td>
        20 Bytes
      </td>

      <td>
        40 Bytes
      </td>
    </tr>

    <tr>
      <td>

      </td>

      <td>

      </td>

      <td>

      </td>

      <td>

      </td>
    </tr>

    <tr>
      <td>
        **Total Sum**
      </td>

      <td>
        **374 Bytes**
      </td>

      <td>
        **220 Byte**
      </td>

      <td>
        **594 Bytes**
      </td>
    </tr>
  </tbody>
</Table>

## User Datagram Protocol (UDP)

In comparison to the TCP header (20 bytes), the UDP header with only 8 bytes is more lightweight. Furthermore, UDP does not rely on the 3-way handshake and acknowledging individual data packets. This makes it a bit more unreliable but can save a lot of transmitted data in suitable applications. The use case shown in the calculation is the same as for the TCP example. A payload of 100 bytes of data from a device towards a UDP server. Afterward, 50 bytes are returned from the server towards the device.

<Table align={["left","left","left","left"]}>
  <thead>
    <tr>
      <th>
        Description
      </th>

      <th>
        UDP Packets
      </th>

      <th>
        IP Packets
      </th>

      <th>
        Data Volume Sum
      </th>
    </tr>
  </thead>

  <tbody>
    <tr>
      <td>
        **Payload Exchange**
      </td>

      <td>
        **166**
      </td>

      <td>
        **40**
      </td>

      <td>
        **206**
      </td>
    </tr>

    <tr>
      <td>
        *Device to Server*\
        *100 Bytes Payload*
      </td>

      <td>
        108
      </td>

      <td>
        20
      </td>

      <td>
        128
      </td>
    </tr>

    <tr>
      <td>
        *Server to Device*\
        *50 Bytes Payload*
      </td>

      <td>
        58
      </td>

      <td>
        20
      </td>

      <td>
        78
      </td>
    </tr>

    <tr>
      <td>

      </td>

      <td>

      </td>

      <td>

      </td>

      <td>

      </td>
    </tr>

    <tr>
      <td>
        **Total Sum**
      </td>

      <td>
        **166**
      </td>

      <td>
        **40**
      </td>

      <td>
        **206**
      </td>
    </tr>
  </tbody>
</Table>
