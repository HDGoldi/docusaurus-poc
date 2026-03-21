---
title: APN Setup
description: Configuring the APN to access the Data Service.
sidebar_position: 2
---
An Access Point Name (APN) is defined as the name of the gateway between a mobile network and a core network. The APN specifies to which network and what exact type of network a connection should and can be established. In common mobile networks, the APN defines the name of the gateway which enables the connection towards the open internet. This setting needs to be configured for each device that wants to communicate with an internet service.

***

# 1NCE APN Setup

> ❗️ APN Setting Required!
>
> As 1NCE is providing multiple APNs, it is mandatory that a APN is configured. Without a correct APN set, it can not be guaranteed that a device will have a Data Connection. Auto APN configuration is NOT supported.

How the APN needs to be configured is dependent on the specific device used with a 1NCE SIM. While most devices only require the APN in URL format, some specific devices require additional parameters to be set.

The parameters to set are listed in the table below. Please note that the APN is mandatory to be set and some other parameters are optional or cannot be set manually.

| Setting               | Value                                  |
| :-------------------- | :------------------------------------- |
| APN                   | **iot.1nce.net**                       |
| Username              | Not Required, Leave Empty              |
| Password              | Not Required, Leave Empty              |
| Authentication Method | Password Authentication Protocol (PAP) |
| Internet Protocol     | Internet Protocol Version 4 (IPv4)     |

## 1NCE Access Point Name

This parameter needs to be set in the devices with a 1NCE SIM. Please refer to the device manufacturer for a guide on how to set an APN. In most cases, this can be done by a specific AT Command, sending a SMS to the device or via the device user interface.

## Authentication

Some devices might require the authentication method setting, username, and password. This authentication procedure can be requested by each side of the connection as part of the establishment process. The two most common authentication procedures are Password Authentication Protocol (PAP) and Challenge Handshake Authentication Protocol (CHAP). PAP is the older protocol and is based on a simple username and password authentication. CHAP is a more sophisticated and more secure authentication method based on randomly generated challenges.\
For the 1NCE APN no username or password is needed. These parameters can be left empty in the configuration. The authentication method PAP should be selected as default if the device requires this parameter.

## Internet Protocol

Some devices support both Internet Protocol versions IPv4 and IPv6. The 1NCE core network currently only supports IPv4 for the time being. Therefore, IPv4 must be used.
