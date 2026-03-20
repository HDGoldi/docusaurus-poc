---
title: Services Overview
description: A general overview of the services from 1NCE OS
---
<Image align="center" width="80% " src="/img/1nce-os/1nce-os-services-overview/8620eea-1NCE-OS-Grafiken-202211221024_2.png" />

# 1NCE OS Overview

1NCE OS offers different services to support connecting IoT-Devices within our network. The new service is offered on both sides, integration of devices and integration of cloud services or custom webhooks.

## Device Authenticator

Authenticate IoT devices against external cloud systems based on the identity of the used IoT SIM. An IoT SIM in any form factor is placed into the IoT device and acts as authenticating element by relying on the same network authentication mechanisms as 1NCE Connect. It replaces provisioning processes which include secret flashing during manufacturing and creation of secure device twins in external cloud services. [Device Authenticator](doc:1nce-os-device-authenticator)

## IoT Integrator

The IoT Integrator includes the Device Integrator and the Cloud Integrator.

### Device Integrator

The device integrator supports to connect devices to 1NCE managed services. For that three different protocols, UDP, CoAP and LwM2M are offered. [Device Integrator](doc:1nce-os-device-integrator)

### Cloud Integrator

The Cloud Integrator allows to create, manage and use 1NCE webhooks and direct AWS Integrations. This provides the possibility for a customer to forward data from their devices to customer-defined HTTPS endpoints or an AWS Account with real-time information. [Cloud Integrator](doc:1nce-os-cloud-integrator)

### Device Controller

The Device Controller supports sending messages to the device via the 1NCE OS managed services. For that we offer three protocols in Device Integrator. [Device Controller](doc:1nce-os-device-controller) 

## Device Inspector

The Device Inspector combines an interface for analytic, monitoring and controlling tasks for IoT devices. [Device Inspector](doc:1nce-os-device-inspector)

## Device Locator

With this service, the location tracking of devices and the possibility of defining geofences for devices can be controlled. [Device Locator](doc:1nce-os-device-locator)

## Plugin System

Plugins extend the capabilities of the 1NCE platform with services provided by 3rd party vendors. You can enable additional functionality by installing a plugin.

## Energy Saver

1NCE offers the energy saver to translate messages coming from IoT devices. Using this feature, the messages send from the devices can be shortened, which in the end is saving energy. In the frontend, an overview on how much energy is saved is provided. [Energy Saver](doc:1nce-os-energy-saver)

## Admin Logs

The 1NCE Admin Logs provides an intermediate storage of messages from devices. From the Admin Logs, the messages can be viewed via the Web Interface or queried using the Management API for further processing. [Admin Logs](doc:1nce-os-admin-logs)
