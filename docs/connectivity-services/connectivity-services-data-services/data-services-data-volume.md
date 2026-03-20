---
title: Data Volume
description: Insight into the Data Volume calculation.
---
Based on the specific tariff of the 1NCE SIM, a set amount of data volume is included. The used and available volume for each of the SIM can be viewed in the [My SIMs & SMS Console](doc:portal-sims-sms) or queried through [1NCE API](https://help.1nce.com/dev-hub/reference). The following sections will explain what data volume usage is deducted from the volume and how this can be calculated for some protocols.

***

# Data Volume Usage

When using the 1NCE data service, both uplink (UL) and downlink (DL) data transmissions are counted towards the used volume. Taking a look at the different layers in the communication in the figure below, only the traffic inside the GTP is considered for billing. The IP overhead, specific network protocol (e.g., TCP, UDP, MQTT, etc.) overhead, and actual payload size account as data usage. For sending large data packets, IP fragmentation generates further overhead data traffic. It does not matter if the 1NCE VPN service or a direct internet breakout is used as this does not constitute a difference in the usage data. 

<HTMLBlock>{`
<center><img alt="Schematic description of the data service layers and their volume usage." src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZEAAADUCAYAAABdwx48AAAF4HRFWHRteGZpbGUAJTNDbXhmaWxlJTIwaG9zdCUzRCUyMmFwcC5kaWFncmFtcy5uZXQlMjIlMjBtb2RpZmllZCUzRCUyMjIwMjEtMDQtMjJUMDclM0E1NSUzQTQxLjczMFolMjIlMjBhZ2VudCUzRCUyMjUuMCUyMChXaW5kb3dzJTIwTlQlMjAxMC4wJTNCJTIwV2luNjQlM0IlMjB4NjQpJTIwQXBwbGVXZWJLaXQlMkY1MzcuMzYlMjAoS0hUTUwlMkMlMjBsaWtlJTIwR2Vja28pJTIwQ2hyb21lJTJGODkuMC40Mzg5LjEyOCUyMFNhZmFyaSUyRjUzNy4zNiUyMiUyMGV0YWclM0QlMjItVU51bktKbmFQR2RNbGN3LW1rXyUyMiUyMHZlcnNpb24lM0QlMjIxNC42LjElMjIlM0UlM0NkaWFncmFtJTIwaWQlM0QlMjJWdTNSR0hJVG5CeEE1RVZrdk9fciUyMiUyMG5hbWUlM0QlMjJQYWdlLTElMjIlM0U1VmhiYjlvd0ZQNDFlU3h5SEFqa3NWeDYwZFNPRmFwSmZmUGlBN0ZtWW1STWdmMzYyY1M1NFhUZEJJeEtSU2c0WCUyQnhqJTJGSDNINXh6SEN3YUw3YTBreSUyQlJCVU9BZVJuVHJCVU1QWTclMkJOc1dlJTJCaU80eXBCdGFZQzRadFoxS1lNSiUyQmdRV1JSZGVNd3FyV1VRbkJGVnZXd1Zpa0tjU3FoaEVweGFiZWJTWjRmZFlsbVlNRFRHTENYZlE3b3lySjBCN3Vsdmdkc0htU3olMkJ5SFVmWmtRZkxPZGlXcmhGQ3hxVURCeUFzR1VnaVZ0UmJiQVhCRFhzNUxOdTdtamFmRkg1T1FxcjhaMEpIM2owOGozbjRKWjcwdlAlMkI1ZUh0TkhjZFhPckx3U3ZyWUx2aDAlMkZUVFF5WFdzJTJCT1V2bnVqMldRb2xZY0xzT3RjdkprV0tkVWpEMmtSZjBOd2xUTUZtUzJEemRhSGZRV0tJV1hOJTJGNXVtbG5BcWxnJTJCJTJCWVMlMkZJSVk3VkVnRnFEa1RuZkpCJTJGaTRGZld5VWJrJTJGV1hZM3BUaCUyQjE3cFlVaEVtc1AySTlZZDVZYnlrVERjc2ElMkYlMkZBWU1kaDhENVZJRk5RSDRxNXRtRU9sUjljWTlISGw2WXhkR2ljRHNiYTB2UFFYQiUyQiUyQlRhZjZwOVZxZlhnbXcwc3oyWFdZSEpNZEY0UnFjRWdVJTJCZWdNWW5ScEJpTjNTMnNuUkhkQUtFZ3Z1Tlp0czE5MEl0SVhvemZxNzVST1VvZkVhb3BVbmIyVmt1SW5EQVFYMnM0d0ZhbnUyWjh4emc4Z3d0azgxYmNjWnNhQ29adnBuSFJ0NFFXajFFelNLRlpkemhQb0ZRUk8xUFZ4eDlXb2cxeU44TGsweXV1RHFwc1h3Ulo5MVF0T3dMajg1NUVrdkxnazJKRmtZdGFEYjU0Z0J2WUtKZ0lWc2VqVENJUFJ4WVVKSEdINm1zZTlIbE5KWmpNV24wR1BHRXdkZEp3aWVrY1R4WVFaZFJXZFNLSXdha1cxeiUyRnZiQ0pXaSUyRmglMkZCM0xMOHVLenRhTktnR3lXclpHJTJGdlZHa2V1VEhLZDFON0VEVnNCZjlzdWQxMzYzV0hXa2pwdFRrNnZzRk5oVmVEajRreTlmNGV3U2dvZGtwJTJCWE1RRm5VQ2RzJTJCYTdaRmFZYW9vWk9TYUI2NDN5V2pmZlJKNmRZU3lZaWN5RlZsR3ZGYllySlZtN3BsdDRvTVpLckdVTTFrYjF5TmxnOWclMkJWWHZ2QXJDSnlEc294dTllNW9PUUk2ZDB6eGlpTnlYSzE1bG1Rd1VqTWlpTDVqSkh4JTJCRXgxNnIyS282NXpzRzZJZzczT1NZS2d2aTFmZTJUcWxpJTJCUGd0RnYlM0MlMkZkaWFncmFtJTNFJTNDJTJGbXhmaWxlJTNFQt5KrQAAIABJREFUeF7tnV2oVWma3/9lVYfSi6mA0nMhGJEG685EvAjoYTIGyqqLJo0NWkTtBAyYqCM4KDTa6lHbIqDM6TjqjDDCBBVUiNAhgVRBJEEFL0TwokGhkELwYhqFjl2jQ32cCf/lenY/5/Vde6/Pvdde67+hqOPea70fv/fdz389H2vtd6CXCIiACIiACJQk8E7J83SaCIiACIiACEAiok0gAiIgAiJQmoBEpDQ6nSgCIiACIiAR0R4QAREQAREoTUAiUhqdThQBERABEZCIaA+IgAiIgAiUJiARKY1OJ4qACIiACEhE2rcH/hWAPwHwfwH8n/YNTyMS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MwQkIs1wVastIyARadmCaDidISAR6cxSaiLyRLQHRGD8BCqJCIBvxj9k9SgC5QgsWrTo+/n5+ffKna2zREAEYgSqiIiIioAIiIAI9JyARKTnG0DTFwEREIEqBCQiVejpXBEQARHoOQGJSM83gKYvAiIgAlUISESq0NO5IiACItBzAhKRnm8ATV8EREAEqhCQiFShp3NFQAREoOcEJCI93wCavgiIgAhUISARqUJP54qACIhAzwnEROQHAP43gJmUzS8AnEr//iWAw3of4vBmE4iDOMg+vNkDXedAXaDtnw01M0tE/h7AP+m5wGr6IiACIiACbwhQRKK6kCUiUcURTREQAREQgV4SKCQivSSkSYuACIiACGQSKBTOEkcREAEREAERyEVA4axcmHSQCIiACIhAjIAS69oXIiACIiACowgUCmdlJlBG9aLPRUAEREAEOkmgUGI9U3E6iUaTEgEREAERGEWgkIiMakyfi4AIiIAI9ItAoXBW29FwMvpt97avksY3IKDfdtdm6DKBaazO+sG77777D999992iLi+M5tYNAt9++y3ef//97+fn59/rxow0CxFYSGAaq7MkItrFU0NAIjI1S6WBDidQKJzV9uosiYi2+9QQkIhMzVJpoKNFpDPPzpKIaLtPDQGJyNQslQZao4i0HaZEpO0rpPENCEhEtBk6QqBQOKvtc5aItH2FND6JiPZAbwioOqs3S62JToKAPJFJUFef4ySg6qxx0lZfvSMgEendknd1woXCWarO6uo20LzGTkAiMnbk6rAZAoUee9L2Z2cpJ9LMJlGrDRCQiDQAVU1OgkAhEZnEAIv0OTUi8uLFC+zduxezs7NYvXp15hzzHlcE0rBjT548iVWrVmHbtm0LDuM4+N7nn3++4P0TJ07gyJEjhbp//PhxMu9z585h6dKlhc4ddvDr16+xf/9+7NixA+vXr6+t3aYaakhECPQcgFkAjwFwcU4Ec+AicoFfBO9zI54FsC891z5mG08AXK2JBfueAbAfwOsa2lwMYA7ArrSti0HbxuAhgK3B3Kx7jmkVgJMFx0Nm1wGsARByZZtX0vY2ALgbadsfYx8fzTGOsuMtOL1chxcKZ+VqcYIHSUQqwh8lIhQMM9BljbZE5M0ijVFE2J03jlkGaFpFxK54KHImKLdT0fOCtTYV1ZiAljHKFGz2SbYUCN8Gr2Io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" style="cursor:pointer;max-width:100%;" onclick="(function(img){if(img.wnd!=null&&!img.wnd.closed){img.wnd.focus();}else{var r=function(evt){if(evt.data=='ready'&&evt.source==img.wnd){img.wnd.postMessage(decodeURIComponent(img.getAttribute('src')),'*');window.removeEventListener('message',r);}};window.addEventListener('message',r);img.wnd=window.open('https://viewer.diagrams.net/?client=1&page=0&edit=_blank');}})(this);"/></center>
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
