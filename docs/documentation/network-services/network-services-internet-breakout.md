---
title: Internet Breakout
description: Default Internet accessibility with a 1NCE SIM.
sidebar_position: 1
---
<div style={{textAlign: 'center'}}>
<img src="/img/network-services/network-services-internet-breakout/001.png" alt="" style={{maxWidth: '100%'}} />
</div>

The default connectivity for a 1NCE SIM is achieved through the Internet Breakout Service. All devices with a 1NCE SIM can connect freely to services hosted in the public internet space. The Figure above illustrates the basic operation principle of the 1NCE Internet Breakout. Please note that the IPs listed in the Figure are just example placeholders. For the Internet Breakout IPs please refer to the list below for the full available IP pool. Depended on the configured breakout setting in the 1NCE Portal, the behavior of the Internet Breakout will different.

***

# Internet Breakout Modes

The Internet Breakout setting in the configuration tab allows you to configure the ideal network flow for your SIMs cards for public-facing internet access and private connectivity through VPN. The 1NCE Internet Breakout can be configured in two different variances, which offer different functionality.

* Automatic Mode
* Manual Mode

The breakout setting allows you to select the nearest local Internet Breakout to minimize latency in data transfer. Your SIM card can either **Automatically** select the geographically nearest breakout, or you can **Manually** set the location of the breakout.

> 📘 Default Setting
>
> With the release (20.09.2022) of the configurable Internet Breakout setting, existing customers breakout will remain as Europe (Frankfurt) as before the feature introduction.
>
> New Organizations and newly created Suborganizations will use the Automatic Mode by default. This setting can be changed in the 1NCE Portal configuration tab.

## Automatic Mode

When using the Automatic Mode, **each individual SIM** data traffic towards the public internet is routed through the geographically optimized data center based on the SIM location to allow for low latency internet access. The automatic system selected the ideal breakout region for each individual SIM independently. This results in SIMs exiting through different breakouts dependent on their location.

1NCE is using AWS to facilitate dynamic Internet Breakout in the Automatic Mode. The closest breakout region is dynamically chosen based on the device location. Different availability zones inside the breakout region serve as backup to prevent downtime.

> 📘 VPN and 1NCE OS
>
> OpenVPN and 1NCE OS Services are currently not available in the **Automatic Mode** due to the automatically changing breakout IPs. While Automatic Mode is active, the OpenVPN Configuration tab is disabled.

### Example Configurations

One customer SIM device is located and connected in Germany. Based on the given location, the automatic Internet Breakout determines that the Europe (Frankfurt) is the ideal location to breakout the public internet traffic. The customer can expect their public internet traffic to exit from one of the breakout IPs from [Europe (Frankfurt)](https://help.1nce.com/dev-hub/docs/network-services-internet-breakout).

A second SIM device is located and connected in New York USA. As the SIM devices is closest to the US East breakout, the automatic system determines that US East (N. Virginia) should be used to exit the public internet traffic of the SIM. The traffic from this specific SIM will exit through the [US East (N. Virginia)](https://help.1nce.com/dev-hub/docs/network-services-internet-breakout) Internet Breakout IPs.

## Manual Mode

When selecting a specific breakout region using the Manual Mode, **all SIMs** public internet access will be routed through the selected breakout region. All SIMs of the customer (sub) organization are locked to the selected manual breakout region, independent on the actual device location.

> 📘 VPN and 1NCE OS
>
> The 1NCE VPN Service is available in the **Manual Mode**. The specific regional adaptions of the [OpenVPN Configuration](https://help.1nce.com/dev-hub/docs/portal-configuration#openvpn-configuration) need to be applied.
>
> 1NCE OS is currently only available through the Europe (Frankfurt) and US East (N Virginia) breakout regions.

Currently, five regions are available:

* Europe (Frankfurt)
* US West (N. California)
* US East (N. Virginia)
* Asia-Pacific (Tokyo)
* South America (São Paulo)

### Example Configurations

The Manual Mode is set to Europe (Frankfurt) for the example organization.

One customer SIM device is located and connected in Germany. Independent of the given location, the manual Internet Breakout Europe (Frankfurt) is used to breakout the public internet traffic. The customer can expect their public internet traffic to exit from one of the breakout IPs from [Europe (Frankfurt)](https://help.1nce.com/dev-hub/docs/network-services-internet-breakout).

A second SIM device is located and connected in New York USA. The SIM devices is closest to the US East breakout, but due to the Manual Mode, the traffic will be routed through the Europe (Frankfurt) exit to the public internet. The traffic from this specific SIM will exit through the [Europe (Frankfurt)](https://help.1nce.com/dev-hub/docs/network-services-internet-breakout) Internet Breakout IPs.

## Optimized Breakout Countries

Using the automatic breakout mode, the traffic of SIM devices will switch breakout based on the operator to which the device is connected. With the automatic mode, this switching is automatically optimized to deliver the lowest latency possible through an internet breakout.

When using a manual breakout the list of optimized countries should also be considered. Selecting a manual breakout for a non-optimized country or operator could lead to worse latency overall. Therefore it only makes sense to change the manual breakout if the SIM devices are located within the optimized countries.

### United States

Please note that our US breakouts are currently optimized for local SIM cards within the USA. For this reason it is impossible to take advantage of their benefits if a SIM is located outside the country. We are already working on a timely global extension.

### Asia-Pacific Breakout

For the following countries, the Asia-Pacific breakout will be used in automatic mode. When using the manual breakout configuration, switching to Asia-Pacific is beneficial if most SIM devices are located within these regions:

Australia, Cambodia*, China, Hong Kong, Indonesia, Japan, South Korea, Malaysia*, Mongolia, New Caledonia, New Zealand, Philippines, Sri Lanka, Taiwan*, Thailand*.

*not for all operators in the country

{/*

 

### South America (São Paulo)

*/}

***

# Internet Breakout IPs

Each available Breakout Region has its unique set of IP Addresses. The specific IP address selected for the Internet Breakout of a SIM card is randomly chosen and can not be managed by the customer. Depending on your configuration, all IPs or Region-specific ones should be used for whitelisting the 1NCE Internet Breakout service. Note that the used IPs are depended on the selected Breakout Mode:

* **Automatic mode**: all IP addresses
* **Manual Mode**: IPs matching the configured Region

## List of IP Addresses

The currently used IPs to breakout any internet-targeted traffic are listed in the table below. Please note that these IP addresses might change overtime as new resources and features upgrades are introduced.

| Breakout Region | Public Internet Breakout IPs |
| --- | --- |
| Europe (Frankfurt) | 18.197.48.88 18.196.213.123 18.158.164.113 18.159.233.211 18.159.81.202 18.184.88.141 18.193.1.150 18.193.152.39 18.195.228.33 18.195.39.164 18.196.220.3 18.198.73.229 3.122.48.136 3.124.161.167 3.125.204.250 3.127.225.197 3.69.185.69 3.70.63.102 3.72.206.109 3.72.220.2 3.74.239.61 3.76.234.36 3.76.246.25 3.76.71.73 3.77.128.21 3.78.103.144 3.78.105.161 3.78.11.129 3.78.118.82 3.78.22.61 3.78.30.118 3.78.54.227 3.78.80.178 52.58.166.184 |
| US West (N. California) | 13.52.88.115 13.56.127.98 184.72.14.243 50.18.219.28 54.151.43.39 54.176.42.26 54.177.224.205 54.177.237.57 54.183.119.255 54.215.48.106 54.215.50.114 54.219.94.206 54.241.17.235 54.241.255.162 54.241.50.173 54.67.92.20 |
| US East (N. Virginia) | 23.23.138.167 3.222.175.158 3.222.216.109 3.225.189.15 3.227.104.16 34.192.19.93 34.194.27.192 34.224.157.70 34.225.144.128 34.225.189.236 34.236.129.19 35.171.69.69 35.172.74.1 52.200.197.12 52.204.165.12 54.156.152.87 23.22.227.77 3.219.123.171 3.93.91.86 34.234.186.137 44.210.17.192 44.213.243.128 52.45.143.123 52.55.140.49 |
| Asia-Pacific (Tokyo) | 3.112.185.7 3.114.177.168 18.178.179.20 18.180.11.40 18.181.5.226 18.181.6.50 35.74.89.95 43.206.70.243 52.196.96.15 52.198.214.172 52.199.139.92 54.64.108.231 54.64.136.175 54.95.160.207 54.168.158.172 54.250.103.58 |
| South America (São Paulo) | 15.229.196.161 18.228.115.195 18.228.53.212 18.229.25.47 52.67.10.199 54.232.172.76 54.232.208.147 54.233.120.112 177.71.193.95 18.228.164.80 18.228.87.71 18.230.109.14 52.67.255.187 54.232.201.155 54.232.210.47 54.94.135.62 |

## Data Streamer and SMS Forwarder IPs

The public IPs for Europe (Frankfurt) Region are additionally used for the 1NCE Data Streamer and SMS Forwarder Service. Whitelisting the Europe (Frankfurt) IPs is required for using these services as these are operated independently of the configured Breakout Region.

***

# Network Address Translation

By design, the internet access for 1NCE SIMs is implemented with Network Address Translation (NAT). The NAT maps the private SIM-IP to commonly used public 1NCE breakout IP. This network design simplifies IP space management and enhances the access security of connected IoT devices. As a result, devices with a 1NCE SIM cannot be directly accessed from the public internet side, thus improving the resilience against external attacks and threads targeting the IoT devices.

Using the 1NCE Internet Breakout, the **connection establishment** is **unidirectional** (e.g., SIM towards server/service), while **data transfer** over an already **established connection** is **bidirectional** (e.g., SIM towards server/service and server/service towards SIM). The flow of the 1NCE Internet Breakout is shown in the sequence diagram below. Bidirectional connection establishment can only be achieved using the 1NCE VPN Service.

<div style={{textAlign: 'center'}}>
<img src="/img/network-services/network-services-internet-breakout/002.png" alt="Sequence diagram of the 1NCE Internet Breakout." style={{maxWidth: '100%'}} />
</div>

***

# Data Protocols

The concept of the Open Systems Interconnection model applies to the 1NCE Data Service structure. The GPRS Tunneling Protocol (GTP) is used on layer 3 to transfer user application data between the device with a 1NCE SIM and the internet or application server and vice versa. All the data traffic is wrapped in the GTP, on top of this protocol (layer 4+) the customer is free to use any transport protocol (e.g., TCP, UDP, MQTT, CoAP, etc.) and any port assignment.

***

# Domain Name System (DNS)

The Domain Name System (DNS) is used to resolve Uniform Resource Locators (URL) to an addressable IP. When using the 1NCE Internet Breakout, the public IP `8.8.8.8` is served as primary and `8.8.4.4` as secondary default Domain Name Server. A manual configuration of a DNS on the device is typically not needed but can be configured, if desired.

***

# Maximum Transmission Unit (MTU) Size

The Maximum Transmission Unit (MTU) is the size of the largest IP packet (layer 4) possible which can be transferred in a respective frame on layer 3 without the need for fragmentation in the packet based core network. If a send packet is larger than the specified MTU, the packet needs to be fragmented, thus creating more overhead and delays.

Theoretically, a size of 1500 bytes is possible with the 1NCE Data Service. Based on prior experience with IoT devices and mobile networks, it is recommended to keep the **MTU size lower than about 1200 bytes**.

***

# Internet Breakout Timeout

The Internet Breakout does not have a static NAT timeout for pending connections. Please consider that timeouts for inactive TCP and UDP connections. For established TCP connections the timeout is 600 seconds and for UDP the timeout is 120 seconds. After the respective timeout and no further data transmission, the TCP /UDP connections will be closed. New TCP and UDP connections can be opened at any point of time, there is no need to reattach the SIM device with a new PDP.

***

# Breakout IP Blacklisting

The traffic from all 1NCE SIMs towards the public internet is routed through a NAT with a the listed public-facing IP addresses. These public breakout IPs are listed above under Internet Breakout IPs. The specific IP address selected for the Internet Breakout is randomly chosen and can not be managed by the customer.

> ❗️ Whitelist 1NCE Breakout IPs
>
> Ensure that the 1NCE Internet Breakout IPs are whitelisted for custom service infrastructure accessed by 1NCE SIMs through the Internet Breakout. Large quantities of SIMs accessing the same service can lead automated firewall and protection mechanisms to block the 1NCE Breakout IPs.

All requests towards public internet services appear to come from these IPs. Most public services and APIs (e.g. time services, open source APIs, etc.) apply a request limit and smart filtering to detect and filter out denial of service (DDoS) and similar attacks. Very frequent queries (e.g., every second) from multiple SIMs towards one endpoint could trigger these filtering mechanisms. This will result in the public service blocking requests from 1NCE SIM devices, rendering the service unusable. Most public services cannot differentiate between individual SIMs due to the 1NCE NAT network structure.  It is strongly recommended to program devices with 1NCE SIMs in a way that they do not aggressively query such shared resources. Using customer-controlled resources (e.g. custom server, AWS or similar cloud service), the protection control mechanisms can be configured to whitelist the traffic originating from the 1NCE NAT Breakout.
