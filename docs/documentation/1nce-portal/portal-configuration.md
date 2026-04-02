---
title: Configuration
description: 1NCE Services Configuration and Setup
sidebar_position: 3
---
# Network Settings

The network settings contain the basic information to get the SIM Cards connected to the 1NCE network. 

| Parameter           |                                                                                                                                                                                                                                                                      |
| :------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `1NCE APN`          | Needs to be set in the very first step to set up a connection to the network.                                                                                                                                                                                        |
| `SMSC Number`       | Is generally needed to aim all Mobile Originated SMS in the network, although this setting is rarely needed for manual configuration.                                                                                                                                |
| `Internet Breakout` | Shows the IP addresses used for all 1NCE SIMs to access the public internet through a NAT. Get all available [Internet Breakout IPs](/docs/network-services/network-services-internet-breakout)                                                          |
| `IP Address Space`  | Shows the IP spaces assigned to SIMs in the given organization. Each SIM has a static IP address which can to be used for direct access via the VPN Service. Additional IP spaces will be assigned for new SIM orders if the remaining IP space is not large enough. |
| `IP Addresses`      | Shows the availability of the IP address spaces assigned to the organization.                                                                                                                                                                                        |

<div style={{ textAlign: "center" }}>
  <img
    src="/img/1nce-portal/portal-configuration/5f971fc-network-settings.jpg"
    alt="Network Settings in the Configuration tab."
    style={{ maxWidth: "100%" }}
  />
  <p style={{ fontSize: "0.9em", color: "#555" }}>
    Network Settings in the Configuration tab.
  </p>
</div>


***

# Breakout Settings

The Internet Breakout setting in the configuration tab allows you to configure the ideal network flow for your SIMs cards for public-facing internet access and private connectivity through VPN. The 1NCE Internet Breakout can be configured in two different variances, which offer different functionality.

- Automatic Mode 
- Manual Mode

The breakout setting allows you to select the nearest local Internet Breakout to minimize latency in data transfer. Your SIM card can either **Automatically **select the geographically nearest breakout, or you can **Manually **set the location of the breakout.

For more information on the 1NCE Internet Breakout Service, please visit the [Internet Breakout](/docs/network-services/network-services-internet-breakout) documentation page.

> 📘 Default Setting
> 
> With the release (20.09.2022) of the configurable Internet Breakout setting, existing customers' breakout will remain in Europe (Frankfurt) as before the feature introduction in September 2022. 
> 
> New Organizations and newly created sub-organizations will use Automatic Mode by default. This setting can be changed in the 1NCE Portal configuration tab.

<div style={{ textAlign: "center" }}>
  <img
    src="/img/1nce-portal/portal-configuration/1cca9e3-220920_Breakout_Settings.PNG"
    alt="Configuration of Breakout settings for Automatic or Manual mode."
    style={{ maxWidth: "100%" }}
  />
  <p style={{ fontSize: "0.9em", color: "#555" }}>
    Configuration of Breakout settings for Automatic or Manual mode.
  </p>
</div>


***

# Monthly Limits

By using "Monthly Limits" a customer can set an individual monthly data and SMS limit. The SMS limit can be configured separately for Mobile Originated (MO) and Mobile Terminated (MT) SMS. These limits will be applied to all of the customer's SIMs. By checking or unchecking the boxes these options can be set or cancelled easily at any time. The limits apply to the period of the calendar month. Putting another limit in the same month will not reset the previously consumed quota.  
Example: The first limit is 100 MB. After reaching it you put in 200 MB as a new limit. Now only 100 additional MB can be consumed because the previously consumed 100 MB are considered.

## Exceeding the Limits

When the self-set limits are exceeded, error or warning messages are triggered based on the type of limit.

### Data Session

When the limit is reached, new PDP data sessions will be rejected: **PDP Context Request rejected, because endpoint is currently blocked due to exceeded traffic limit.**  However, some devices might retry indefinitely to reconnect in such a case. 1NCE strongly advices to use a back-off approach in this rejection case to not flood the network with PDP session requests.

### MT-SMS

Using the 1NCE API, if the self-set limit for MT-SMS is reached, **Traffic limit of X SMS per month exceeded** is returned as error.  
In the 1NCE Portal **Set monthly limit of SMS exceeded** is shown, when the MT-SMS limit was reached and a new SMS is issued.

### MO-SMS

For **MO-SMS** no notification will be shown in the 1NCE Portal or Data Stream. The SMS will be rejected by the network resulting in an error return code from the device modem.

<div style={{ textAlign: "center" }}>
  <img
    src="/img/1nce-portal/portal-configuration/8ee837c-1NCE_Limits.png"
    alt="Monthly Limits configuration for Data and MO-/MT-SMS."
    style={{ maxWidth: "100%" }}
  />
  <p style={{ fontSize: "0.9em", color: "#555" }}>
    Monthly Limits configuration for Data and MO-/MT-SMS.
  </p>
</div>


***

# Global IMEI Lock

A global IMEI Lock can be set for all SIM Cards of the organization. The IMEI lock works by saving the IMEI of the device the SIM is installed in. With the feature enabled, the 1NCE network will only accept the saved device IMEI - SIM card combination to access the network resource. Any other IMEI - SIM combination will be refused. If this feature is activated, the IMEI lock will be set during the next network attach. Consequently the SIM card can only be used with the current device. For new SIM Card orders a checkbox can be selected to enable the IMEI lock by default. This way newly ordered SIMs will have the IMEI Lock set automatically. A separate IMEI lock for individual cards of the organization can be set either via the 1NCE API or in the "My SIMs" tab.

<div style={{ textAlign: "center" }}>
  <img
    src="/img/1nce-portal/portal-configuration/426b669-1NCE_IMEI_Lock.png"
    alt="Global IMEI SIM lock settings."
    style={{ width: "80%", maxWidth: "100%" }}
  />
  <p style={{ fontSize: "0.9em", color: "#555" }}>
    Global IMEI SIM lock settings.
  </p>
</div>


***

# Auto Top-Up

Automatic Top-Ups can be configured globally for all SIMs of an organization. The top-up will be automatically booked once a SIM card has \<20 % data and/or SMS volume. The check for low volume and potential Top-Up process if the SIM volume is less than 20%, are performed every four hours at 0:00,  4:00,  8:00,  12:00,  16:00, and 20:00 CET. To use this feature customers have to add their credit card details in the "Account" tab. By ticking the check-box it is possible to activate the auto-top-up for all future SIM orders by default. This feature can also be individually (de-)activated for a single SIM card via the Management API or the tab "My SIMs" and then the SIM-Detail page.

<div style={{ textAlign: "center" }}>
  <img
    src="/img/1nce-portal/portal-configuration/4bcd521-1NCE_Auto_Top-Up.PNG"
    alt="Auto Top-Up configuration for enabling global SIM top up."
    style={{ width: "80%", maxWidth: "100%" }}
  />
  <p style={{ fontSize: "0.9em", color: "#555" }}>
    Auto Top-Up configuration for enabling global SIM top up.
  </p>
</div>


***

# Data Streams

The 1NCE Data Streaming Service allows customers to subscribe to real-time events and usage data for all SIM Cards by pushing data directly to the customer's server or an already integrated cloud service such as AWS Kinesis, S3, DataDog or Keen.io. 

The Data Streams configuration shows a list of all currently configured streams including the name, API type, stream type, URL, status indicator and controls for each stream. Each stream can be controlled individually. Besides basic stop, start and delete, a stream integration can be restarted. A restart needs to be performed if the stream enters a error state and needs to be recovered. 

To create a new data stream integration click on the New Data Stream button. Further details on how to setup a stream integration can be found in the [Data Streamer Setup Guides](/unresolved/doc:streamer-setup) section of the Developer Hub.

<div style={{ textAlign: "center" }}>
  <img
    src="/img/1nce-portal/portal-configuration/dc28289-1NCE_Data_Streamer.PNG"
    alt="Overview of the current Data Streamer integrations."
    style={{ width: "80%", maxWidth: "100%" }}
  />
  <p style={{ fontSize: "0.9em", color: "#555" }}>
    Overview of the current Data Streamer integrations.
  </p>
</div>


***

# SMS Forwarding Configuration

The SMS Forwarding configuration allows for receiving Mobile Originated (MO) SMS with a custom HTTP endpoint integration. For the configuration, the customer needs to insert the URL of the server, which shall receive the SMS. Further necessary details on configuration of SMS forwarding can be found in the [SMS Forwarding Service](/unresolved/doc:sms-services-sms-forwarding-service) section of the Developer Hub.

<div style={{ textAlign: "center" }}>
  <img
    src="/img/1nce-portal/portal-configuration/3c9f0a2-1NCE_SMS_Forwarder.PNG"
    alt="Configuration of the SMS Forwarding Service."
    style={{ maxWidth: "100%" }}
  />
  <p style={{ fontSize: "0.9em", color: "#555" }}>
    Configuration of the SMS Forwarding Service.
  </p>
</div>


***

# OpenVPN Configuration

OpenVPN is the recommended application setup by 1NCE to establish a secure, bidirectional data connection between the 1NCE network and the customer server.

Dependent on the selected Internet Breakout option, OpenVPN might not be available (Automatic Mode) or needs a region specific configuration (Manual Mode).

## Automatic Mode

<div style={{ textAlign: "center" }}>
  <img
    src="/img/1nce-portal/portal-configuration/c117bf2-vpn-auto.jpg"
    alt="VPN not available in Automatic Mode, the Breakout Setting needs to be changed to a manual region."
    style={{ maxWidth: "100%" }}
  />
  <p style={{ fontSize: "0.9em", color: "#555" }}>
    VPN not available in Automatic Mode, the Breakout Setting needs to be changed to a manual region.
  </p>
</div>


## Manual Mode (Europe)

When the Manual Mode is selected the VPN configuration shown is dependent on the selected region. When changing the breakout region, note that the VPN configuration needs to be manually adapted as well. In such a case please download the new, region-specific configuration and setup a new VPN client.

<div style={{ textAlign: "center" }}>
  <img
    src="/img/1nce-portal/portal-configuration/f7e1dbe-vpn-eu.jpg"
    alt="Specific configuration for Manual Mode (Europe) breakout."
    style={{ maxWidth: "100%" }}
  />
  <p style={{ fontSize: "0.9em", color: "#555" }}>
    Specific configuration for Manual Mode (Europe) breakout.
  </p>
</div>


The OpenVPN client needs to be installed on the customer server to which the SIMs should access via the VPN client IP. For the OpenVPN connection to the 1NCE network a configuration file and credentials file is needed. These files can be downloaded in this section of the 1NCE Customer Portal. There are two different versions for Windows and for Linux/MacOS available. For more details about the VPN Service, its setup and operation users can proceed to the [VPN Service](/network-services/network-services-vpn-service/index) section of the Developer Hub.
