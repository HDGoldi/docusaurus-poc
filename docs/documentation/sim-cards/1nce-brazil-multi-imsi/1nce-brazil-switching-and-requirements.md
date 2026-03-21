---
title: Switching Mechanism and Device Requirements
description: Overview of the mechanism to switch IMSI and Device Requirements
draft: true
sidebar_position: 2
---
# Device Requirements

We expect that the applet does the following actions:

1. IMSI 2 rotation, considering IMSI 2-1, IMSI 2-2, and IMSI2-3 as the IMSIS to be updating IMSI 2 on a bimonthly basis.
2. Mechanism to switch to IMSI 2 considering the following triggers:
   1. Lack of network service (NO SERVICE)
   2. Lack of Data Resources (LIMITED SERVICE)
3. Mechanism to switch back to IMSI 1 considering the following trigger:
   1. Timer exceeds 24 hours connected in IMSI 2
4. Mechanism to perform a country-based IMSI selection considering the following trigger:
   1. MCC equal # 724 IMSI 1 shall be used. Otherwise, IMSI 2 shall be used

<div style={{textAlign: 'center'}}>
![Overall Applet Structure – 4 IMSIs – 2 Mechanisms](/img/sim-cards/1nce-brazil-multi-imsi/1nce-brazil-switching-and-requirements/0c6983721fa7c626c873f33057c1515177771b1a973316b903f39661232026de-Picture1.png)
</div>

The 1NCE Multi-IMSI Applet requires that the modem supports STK (SIM TOOL KIT) features. This is a pre-requisite for the applet to work. In case the applet doesn’t support the STK features, the SIM CARD will access only CLARO network via local Brazilian IMSI.

The STK feature should be enabled in the device’s Modems, in a way that the APPLET can be able to execute the following PROACTIVE COMMANDS:

* ENVELOPE (EVENT DOWNLOAD)
* ENVELOPE (TIMER EXPIRATION)
* FETCH (SET UP EVENT LIST)
* FETCH REFRESH
* FETCH TIMER MANAGEMENT
* FETCH (PROVIDE LOCAL INFORMATION)

The below image shows the overall applet functionalities.

<div style={{textAlign: 'center'}}>
![Overall applet functionalities](/img/sim-cards/1nce-brazil-multi-imsi/1nce-brazil-switching-and-requirements/a085e4b246a92774d6b6d638e41e0ec18d1379b59f2a4322a5821b8418c32e33-Picture1.png)
</div>

<br />

# Additional Device Requirements

The following additional requirements are required:

* 3GPP Standard IMSI Structure 
* Shadowing IMSIs varying according to an Applet with IMSI Switching Mechanism as described on this page
  * Applet that monitors service availability values 
  * First tentative to connect into the home Brazilian IMSI (PLMN 72468)
  * In case of unavailability of the local home Brazilian IMSI, the applet should try the other 1NCE GSIM IMSIS (1\<n\<=4)
  * SIM Card updatable via OTA (SMS and HTTP). ME should support OTA (SMS and/or HTTP)
  * Flexibility to future connectivity into other external platforms (QoS Platform, Delivery Manager, etc)
  * Java Card Interoperability
  * Possible to port to any SIM manufacturer
  * Proactive commands used:
    * FETCH (PROVIDE LOCATION INFORMATION)
    * FETCH (SET UP EVENT LIST) 
    * FETCH (TIMER MANAGEMENT)
    * FETCH (REFRESH)
    * FETCH (SELECT ITEM)
  * Tentative to Fallback to Home IMSI in a pre-defined period (e.g. 24-hour) cycle (updatable via OTA) when the user is operating in Brazil.
    * In case the Fallback to Home IMSI (n=1) is unable to connect to the network, the process should continue trying the IMSI 2 (ENABLED).
  * Intelligence to go straight to 1NCE GSIM IMSIs when the user is abroad. 
  * Support 2G/3G and 4G Authentication.
  * Millenage Authentication.
  * Enable/Disable Applet that has the switching mechanisms.
  * Possibility to develop STK to Enable/Disable Applet and Select the preferred IMSI manually. 

# Tested IoT Devices

Based on the described requirements, 1NCE is managing a list of tested and verified IoT Devices. The following list is updated and maintained actively. The date of the homologation, details on the Firmware version, and any other relevant data points are included in the list. 

Please refer to the list of tested devices and Modems that already meet 1NCE Brazil Multi-IMSI SIM requirements.

[1NCE Brazil - Tested IoT Devices](https://1nce.notion.site/23984cab45dc47939a07e496f130d0ee?v=2ee0c3bd82414b17a22acd7c43babc35)
