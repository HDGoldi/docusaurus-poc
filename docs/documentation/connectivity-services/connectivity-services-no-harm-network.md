---
title: No Harm to Network Guidelines
description: No Harm to Network for IoT Device Applications
sidebar_position: 1
---
To ensure reliable availability of all devices connected in the Internet of Things, network providers put in a lot of technological and human effort around the clock. But IoT developers can also contribute a lot to the efficiency and reliability of their IoT devices and platforms.

We have compiled the top 5 for secure and long-term operation of IoT devices in the Internet of Things:

## 1. Avoid Synchronized Behavior

IoT devices should never contact their platform at the same time to avoid congestion.

## 2. Reduce Connection Setup

Avoid unnecessary connection setup and disconnection of devices. This saves energy and reduces the load on servers and networks.

## 3. Aggregate, Compress, Encode Data

If you transfer your data in an optimized way, you extend the battery life of your devices.

## 4. Suitable Energy-Saving Modes

Depending on the application, energy can be saved in different ways at the network and application level.

## 5. Always Diagnose Before Restarting

Always identify errors before restarting devices.

***

This IoT Solution Guideline summarizes the "No Harm to Network" requirements from 1NCE GmbH originating in <a href="https://www.gsma.com/iot/wp-content/uploads/2016/04/TS.34-v3.0.pdf" target="_blank">GSMA TS.34 v5.0, IoT Device Connection Efficiency Guidelines 1</a>, use-cases or features not covered yet within GSMA TS.34, as well as lessons learned gained from IoT commercial deployments. The requirements including the words **"SHALL"** or **"SHALL NOT"** in their descriptions are mandatory and all guidelines with **"SHOULD"** or **"SHOULD NOT"** are recommended.

These guidelines are divided into three sections, reflecting how IoT Service Providers are required to implement "No Harm to Network" considerations and best-practice design in the different IoT Solution Layers (refer to Figure 1). 

<div style={{textAlign: 'center'}}>
<img src="/img/connectivity-services/connectivity-services-no-harm-network/956b1b9-iot_guidelines.jpg" alt="iot_guidelines.jpg" width="80%" />
</div>

***

# Definitions

## IoT Service Provider

Companies offering IoT Services to end consumers or enterprises via the 1NCE GmbH Connectivity Layer (3GPPTM mobile networks).

## IoT Service Application

Business application logic of the IoT Service which processes the data collected from assets. The IoT Service Provider hosts their IoT Service Application on a server or Cloud Platform provided by 1NCE GmbH or another third party. 

## Cloud Platform

Infrastructure used by the IoT Service Provider to host IoT Services, manage IoT Devices and exchange data with their IoT Devices over the 1NCE GmbH Connectivity Layer. The Cloud Platform may host the IoT Server Application logic and includes Service Enablement functions. Generally, this is referred to as the "IoT Service Platform" in this document. 

## Service Enablement

Core service functions such as device management, discovery, registration, group management, application and service management, communication management, data management, service charging and accounting, as well as subscription and notification, are common needs across the wide spectrum of IoT solutions. These aspects are typically coordinated between IoT Devices and the IoT Service Platform on this logical layer. Server-side, service enablement may be handled by an independent orchestrator or connector acting as an endpoint for all communication to/from the IoT Devices. Such a connector may be placed in front of one or several clouds hosting IoT Server Applications. The provider of the Service Enablement may be a Mobile (Virtual) Network Operator, or the developer of the IoT Device and Server Applications. 

## IoT Device

Sensors, actuators, or other deployed Machine to Machine (M2M) hardware exchanging data bidirectionally and managed by the IoT Service Provider over the Application, Service Enablement and Connectivity Layers. The communication between IoT Device and IoT Service Provider is referred to as the IoT Service. 

## IoT Device Application

The application logic running on the IoT Device microcontroller (MCU) and exchanging data with the IoT Service Platform. It sends AT commands to the IoT Device integrated communication module/chipset in order to access the 1NCE GmbH Connectivity Layer.

***

# IoT Service Provider Guidelines

## Avoidance of Synchronized Behavior

Any IoT Service Platform or IoT Service Application which communicates to multiple IoT Devices **SHALL** avoid timely synchronized behavior and employ a randomized pattern for accessing IoT Devices registered to the platforms domain. The triggering of data transmissions, the rebooting of the IoT Device hardware or subcomponents (such as the communication module/chipset), or the issuing device management commands (including, but not limited to (re-) registrations and firmware updates) **SHALL NOT** be timely synchronized. 

## IoT Service Platform or IoT Service Application Temporarily Offline Recovery

If the IoT Service Platform or IoT Service Application are temporarily offline, they **SHALL NOT** request the IoT Devices to synchronize all at once when coming back online. 

## Triggering Devices only when Attached

The IoT Service Platform or IoT Service Application **SHALL** be aware of the IoT Device state and only send "wake up" triggers whenever the IoT Device is known to be attached to the mobile network. 

## Behavior when IoT Device does not Respond to SMS Triggers

If the IoT Service Platform or IoT Service Application uses SMS triggers to "wake up" IoT Devices, it **SHALL** avoid sending multiple SMS triggers when no response is received within a certain time period. Communication over a 3GPPTM NB-IoT access bearer **SHALL NOT** use SMS on 1NCE GmbH mobile network.

## Behavior when SIM Subscription is Inactive

If the SIM subscription associated with an IoT Device is to be placed in a temporarily inactive state (i.e. for a fixed period of time), the IoT Service Provider **SHALL** first ensure that the IoT Device’s communication module/chipset is temporarily disabled to restrict it from trying to register to the mobile network once the SIM is disabled. 

## Behavior when SIM Subscription is Permanently Disabled

Before the SIM subscription associated with an IoT Device is to be placed in a permanently terminated state, the IoT Service Provider **SHALL** first ensure that the IoT Device’s communication module/chipset is permanently disabled to restrict it from trying to register to the mobile network once the SIM is disabled. The IoT Service Provider **SHOULD** consider avoiding mechanisms for the permanent termination of IoT Devices that are not easily serviceable, as it may require manual intervention (i.e. a service call) to reenable the IoT Devices.

## Frequency and Prioritization of Data Transmissions

Whenever there is a need to transmit data over the mobile network, the IoT Service Platform or IoT Service Application **SHOULD classify** the priority of each communication. The IoT Service Platform or IoT Service Application distinguishes between high-priority data requiring instantaneous transmission, versus delay tolerant or lower-priority data which can be aggregated and sent during non-peak hours.\
IoT Server Applications communicating with IoT Devices over 3GPPTM Mobile IoT access bearers, such as NB-IoT and LTE-M, SHALL optimize their application reporting period to never exceed 1NCE GmbH affiliate tariff daily maximum number of messages. 

## Data Aggregation, Compression and Transcoding

The IoT Server Application **SHALL** minimize the number of parallel mobile network connections and overall frequency of connections to IoT Devices over the mobile network. Data is aggregated by the IoT Server Application into an application report before being compressed and sent over the mobile network. Data transcoding and compression techniques are used, as per the IoT Service’s intended Quality of Service, to reduce connection attempts and data volumes.\
IoT Server Application using 3GPPTM Mobile IoT access bearers, such as NB-IoT and LTE-M, SHALL optimize their payload sizes to comply with 1NCE GmbH affiliate monthly volume limits.\
IoT Service Provers SHALL NOT initialize significant numbers of IoT Devices (e.g. >100 units) communicating over 3GPPTM NB-IoT within one hour at the same location.

***

# IoT Device Guidelines

## Avoidance of Synchronized Behavior

The monolithic IoT Device Application **SHALL** avoid synchronized behavior with other IoT Devices or events, employing a randomized pattern (e.g. over a time period ranging from a few seconds to several hours, or days) to request a mobile network connection over the Connectivity Layer. The triggering of data transmissions, the rebooting of the IoT Device hardware or subcomponents (such as the communication module/chipset), or execution of device management commands (including, but not limited to (re-) registrations and firmware updates) **SHALL NOT** be synchronized. 

## Use of "Always-On" Connectivity

If the monolithic IoT Device Application sends data very frequently (i.e. inactivity periods shorter than two hours), it **SHALL** use a persistent PDP/PDN connection with the mobile network instead of activating and deactivating said connectivity. In tiered IoT Devices, the embedded Service Enablement Layer **SHALL** comply to this requirement. 

## Handline of "Keep Alive" Messages on Home Network

If the communication between the IoT Devices and mobile network is IP-based, it may require the use of TCP / UDP "keep alive" messages. In such cases, the IoT Device Application **SHALL** automatically detect the server-specific timers and/or mobile network firewall timers, such TCP\_IDLE value or UDP\_IDLE value (NAT timers as defined by 1NCE GmbH for consumer APN, or by business enterprise for own-administered NAT, in the case of private APN), when using push services. This is achieved by increasing the polling interval dynamically until a mobile network timeout occurs, and then operating just below the timeout value.\
IoT Device Applications communicating with the IoT Server Application over 3GPPTM Mobile IoT access bearers, such as NB-IoT and LTE-M, **SHOULD NOT** implement TCP / UDP “keep alive” messages on the home network. In IoT Devices, the embedded Service Enablement Layer **SHOULD** implement this requirement in the same way as for IoT Device Applications. 

## Data Aggregation, Compression and Transcoding

The monolithic IoT Device Application SHALL minimize the number of parallel mobile network connections and overall frequency of connections between the IoT Device and the mobile network. Data is aggregated by the IoT Device Application into an application report before being compressed and sent over the mobile network. Data transcoding and compression techniques are used, as per the IoT Service intended Quality of Service, to reduce connection attempts and data volumes. In tiered IoT Devices, the embedded Service Enablement Layer **SHALL** comply to this requirement.\
The IoT Device Application **SHOULD** monitor the volume of data it sends and receives over a defined time period. If the volume of data will soon exceed a maximum value defined by the IoT Service Provider (see <a href="https://help.1nce.com/dev-hub/docs/connectivity-services-no-harm-network#suggested-limits">Suggested Limits</a>), the IoT Device Application sends a report to the IoT Service Platform and stops the regular sending of data until the necessary time period has expired. 

## Frequency and Prioritization of Data Transmissions

The IoT Device Application **SHOULD** monitor the number of network connections it attempts over a set time period. If the number of connection attempts exceeds a maximum value set by the IoT Service Provider (see <a href="https://help.1nce.com/dev-hub/docs/connectivity-services-no-harm-network#suggested-limits">Suggested Limits</a>), the IoT Device Application sends a report to the IoT Service Platform and stops requesting mobile network connectivity until the necessary time period has expired. In tiered IoT Devices, the embedded Service Enablement Layer **SHOULD** comply to this requirement.\
IoT Devices Applications communicating with IoT Server Applications over 3GPPTM Mobile IoT access bearers, such as NB-IoT and LTE-M, **SHALL** optimize their application reporting period to never exceed the IoT Service Provider daily maximum number of messages (see <a href="https://help.1nce.com/dev-hub/docs/connectivity-services-no-harm-network#suggested-limits">Suggested Limits</a>).

## Localized Communication

The IoT Device Application **SHALL** minimize any geographical network loading problems. There **SHALL** be no coordination of all IoT Devices in a given region of the IoT Service to undergo like-operations producing network loading, e.g. firmware updates. 

## Adaption to Mobile Network Capabilities, Data Speed and Latency

The IoT Device Application **SHALL** be capable of adapting to changes in mobile network feature capability and service exposure. Furthermore, it is designed to cope with variations in mobile network data speed and latency, considering the differences in available throughput, data speed and latency when switching between different 3GPPTM access bearers (i.e. 2G, 3G, LTE and Mobile IoT).\
If data speed and latency is critical to the IoT Service, the IoT Device Application **SHOULD** constantly monitor mobile network speed and connection quality in order to request the appropriate quality of content from the IoT Service Provider’s infrastructure. In tiered IoT Devices, the embedded IoT Service Enablement Layer **SHOULD** constantly monitor mobile network speed and connection quality in order to request the appropriate quality of content from the Cloud Platform. The IoT Device Application retrieves mobile network speed and connection quality information from the IoT Service Enablement Layer. 

## Low Power Mode

If the IoT Device Application does not need to exchange any data with the IoT Service Platform for a period greater than 24 hours, and the IoT Service can tolerate some latency, the IoT Device **SHOULD** implement a power-saving mode where the device’s communication module/chipset is effectively powered down between data transmissions. This will reduce the IoT Device’s power consumption and reduce mobile network signaling.\
IoT Device Applications communicating over 3GPPTM Mobile IoT access bearers, such as NB-IoT and LTE-M, **SHOULD NOT** power down their communication module/chipset. The 3GPPTM power saving features **SHOULD** be used instead, thus avoiding power-draining, system selection scanning procedures. 

## IoT Service Platform Temporarily Unreachable or Offline

If the IoT Service Platform is temporarily offline, the IoT Device Application **SHALL** first diagnose if the communication issues to the server are caused by higher layer communications (TCP/IP, UDP, ATM…). Higher layers mechanisms **SHALL** then try to re-establish the connection with the server. This is done by assessing (and if necessary, attempting to re-establish) connectivity in a step-wise approach, top-down. In tiered IoT Devices, the embedded Service Enablement Layer **SHALL** comply to this requirement. The IoT Device Application **SHALL NOT** frequently initiate an application-driven reboot of the communication module/chipset. The IoT Devices **SHALL** retry connection requests to the IoT Service Platform with an increasing back-off period.\
If the IoT Device detects that the IoT Service Platform is back online, it **SHALL** employ a randomized timer\
to trigger communication requests to the mobile network. 

## Coverage Lost (GPS, GLONASS, LAN, WAN)

When GPS, GLONASS coverage is lost, the monolithic IoT Device Application **SHALL NOT** reboot the communication module/chipset. The IoT Device Application **SHOULD** perform diagnostics, reboot the affected hardware element and send an alert to the IoT Server Application. When LAN or WAN coverage is lost, the monolithic IoT Device **SHALL NOT** reboot the communication module/chipset. The IoT Device Application **SHALL** retry scanning to acquire mobile network connectivity with an increasing back-off period. In tiered IoT Devices, the embedded Service Enablement Layer **SHALL** comply to this requirement. 

## Sensor / Actuator Malfunction

When in-built sensors or actuators malfunction, the monolithic IoT Device Application **SHALL NOT** reboot the communication module/chipset. The IoT Device Application **SHOULD** perform diagnostics, reboot the affected hardware element and send an alert to the IoT Server Application. 

## Sensor Alarms / Actuators Triggered

When in-built sensors or actuators are triggered, the monolithic IoT Device Application **SHALL NOT** reboot the communication module/chipset. The IoT Device Application **SHOULD** instead send an alert to the IoT Server Application. 

## Battery Power Low or Power Failure

The IoT Device Application **SHOULD** send a notification to the IoT Service Platform with relevant information when there is an unexpected power outage or battery problem.

## Device Memory Full

When the IoT Device memory is full, for example due to the amount of collected data or an unwanted memory leak, the IoT Device Application **SHALL NOT** reboot the communication module/chipset. The IoT Device Application **SHOULD** perform diagnostics, reboot the affected hardware element and send an alert to the IoT Server Application. 

## Communication Request Fail

The IoT Device Application **SHALL** always handle situations when communication requests fail in a way that does not harm the mobile network. The mobile network may reject communication requests from the IoT Device with a 3GPPTM error cause code (refer to GSMA TS.34). When the IoT Device Application detects that its requests are rejected, it **SHALL** retry connection requests to the mobile network with an increasing back-off period. The IoT Device Application **SHALL NOT** start an application-driven reboot of the communication module/chipset, attempting to ignore or override the mobile network’s decision.\
Additionally, the IoT Device Application **SHALL** always be prepared to handle situations when communication requests fail, when such failure is reported by the embedded Service Enablement Layer. Communication requests from the IoT Device Application **SHALL NOT** be retried indefinitely – all requests must eventually time-out and be abandoned by the IoT Device Application.

## Device-Originated SMS are Barred

When the IoT Device Application detects that its subscription for MO-SMS is barred by the mobile network, the IoT Device Application **SHALL** retry connection requests to the mobile network with an increasing back-off period. The IoT Device Application **SHALL NOT** start an application-driven reboot of the communication module/chipset.

## Radio Access Technology Bearers Reselection

If the IoT Device supports more than one family of access technology (for example 3GPPTM, WLAN) the IoT Device Application **SHALL** employ a randomized delay before switching to a different family of access technology.\
The IoT Device Application **SHALL** implement a protection mechanism to prevent frequent "ping-pong" between these different technologies. This is done by limiting the frequency of reselection actions, with appropriate hysteresis mechanisms. 

## Mass Deployments of Devices

For mass deployments of IoT Devices (e.g. >10,000 units within the same mobile network), if the monolithic IoT Device supports more than one family of communications access technology (for example 3GPPTM, WLAN) the IoT Device Application **SHALL** employ a randomized delay before switching to a different family of access technology. 

## Loss of Roaming Service

The IoT Device Application **SHALL** always be prepared to recover lost end-to-end connectivity while camping on a roaming network. This is implemented with a top-down, staged recovery algorithm diagnosing each protocol layer. In case of failing to re-establish one layer, the algorithm initiates the recovery procedure on the following protocol level below. This may be done, for example, as follows: 

* Step 1. Re-establishment of higher layer connectivity, e.g. VPN tunnels, SSH sessions, etc., 
* Step 2. Re-establishment of the PDN connectivity or PDP context, 
* Step 3. Re-attach (data) to the network, 
* Step 4. Re-triggering of a plain network selection,
* Step 5. Complete reboot of the device. 

All recovery procedures **SHALL**, to avoid excessive sending of signals to the network, be properly implemented. This may include usage of randomized triggers and incremental, back-off retry mechanisms. Threshold and timer values may depend on the IoT Service’s requirements.

## IPv4/v6 Dual Stack Support

The IoT Device Application **SHALL** support IPv4/v6 dual stack (PDN Type = IPv4v6) so that it can properly roam onto mobile networks having support for either IPv4 only or IPv6 only or dual stack only.

***

# Suggested Limits

Please note that these numbers are suggestions which should be noted in the design of an IoT device. Please also note that the metrics are depended on the use case and might be much lower for certain application. These are **NOT** hard limits enforced by 1NCE.

## Suggested Maximum Connection Requests

* 2G/3G/4G: 720 connection requests (Network Attach) / day / device (i.e., on average once every two minutes). 
* NB-IoT/LTE-M: 24 connection requests (Network Attach) / day / device (i.e., on average once per hour). 

## Suggested Maximum of Daily Messages

* 2G/3G/4G: no limitations 
* NB-IoT/LTE-M: 120 application messages / day / device (i.e., on average 5 messages per hour); minimal volume per message. 

## Suggested Maximum Volume of Data per Single Device

* 2G/3G/4G/NB-IoT/LTE-M: 10 Mbytes / month / device; tariff-specific restrictions may occur (e.g., maximum lifetime volume \< 10 Mbytes, or pooling restrictions may be in place limiting the average monthly data volume to 500KB or 1 MB).
