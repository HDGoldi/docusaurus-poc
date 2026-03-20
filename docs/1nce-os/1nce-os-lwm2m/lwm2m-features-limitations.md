---
title: Features & Limitations
description: >-
  A deep dive into the Features and Limitations of the 1NCE OS LwM2M Service
  integrations.
---
# 1NCE LwM2M Interfaces

At the base for the LwM2M protocol stack lies the client (e.g., IoT device) and the LwM2M server infrastructure.

## Bootstrap Server

The [1NCE Bootstrap Service](/1nce-os/1nce-os-lwm2m/lwm2m-bootstrapping) for LwM2M serves as a fully automated management entity for keys, access control, and configuration required to enroll an IoT device with the 1NCE LwM2M Service. This component is based in the background on the [Device Authenticator](/1nce-os/1nce-os-device-authenticator/index) Service to automate the LwM2M bootstring with a 1NCE SIM card.

## LwM2M Server

Once a connected IoT LwM2M device completed the bootstrapping process, a device can connect and register to the 1NCE LwM2M Server. This registration lets the LWM2M server know of the connected IoT device existence and its registered capability.

## Integration Test

If an IoT device is registered with the 1NCE LwM2M Server, the individual device can be [tested](/1nce-os/1nce-os-device-integrator/device-integrator-test-endpoints#testing-the-endpoint) in the Device Integrator. If the LwM2M Integration is setup, the connection can be tested with any device. Select one of the preferred Blueprints. More information about the Blueprints can be found ind [1NCE SDK & Blueprints](/1nce-os/1nce-os-sdk-blueprints/index). The ICCID of the device used for testing and optional the Pre-shared Key (PSK) is needed for the test setup.

After setting up the testbed, a message has to be sent from the IoT SIM device. Please be aware that it can take up to 30 seconds to be received.

## LwM2M Data Reporting

The 1NCE LwM2M Service enables registered devices to report information to the LwM2M server. All messages are forwarded and stored in the [Device Inspector](/1nce-os/1nce-os-device-inspector/index). This service stores the received information and provides data for the visualization via the management user interface and regular event updates via the management API.

***

# Features

* Using 1NCE SIM connectivity, LwM2M is not bound to any specific Radio Network Type (RAT) and will work with any available communication (2G, 3G, 4G, NB-IoT, CAT-M).

* The 1NCE LwM2M Service uses the Device Inspector to store the current and past device states. Further the 1NCE admin logs stores the LwM2M messages received from any registered and connected device. The state and message information can be retrieved using the management user interface or the management API.

* The communication with the 1NCE LwM2M server is secured via DTLS using Pre-Shared Keys (PSK). The PSK is regenerated for each device registration.

* All Open Mobile Alliance (OMA) publicly defined LwM2M objects are supported. To see the full list, please reference the <a target="_blank" href="https://github.com/OpenMobileAlliance/lwm2m-registry">OMA lwm2m-registry</a>.

* Bootstrapping can be performed either by CoAP or CoAPs (with PSK).

***

# Limitations

* LwM2M Endpoints are required to be [activated](/unresolved/doc:device-integrator-activate-endpoints), otherwise 1NCE LwM2M bootstrap server will not authorize devices.

* LwM2M clients used with the 1NCE Service need to support v1.1 at least partially.

* All LwM2M clients are required to do the bootstrapping process in order to access the 1NCE\
  LwM2M server. A direct connection to the server is not possible.

* If the LwM2M client device loses the connection to the LwM2M server (e.g., network reregistration, time-outs, device sleep, etc.), it needs to initiate the bootstrapping once process again.

* LwM2M action API is asynchronous. Customers will not receive direct feedback from the device.
