---
title: Info category
---
Open the Admin Logs in [1NCE OS](https://portal.1nce.com/portal/customer/connectivitysuite) to see the latest logs from the devices. Use the filter to get Info Category logs.

![](https://files.readme.io/02b5c43-image.png)

# Lifecycle

There is currently one Lifecycle event available.

## DEVICE\_FIRST\_TIME\_REGISTERED

* There is only one "DEVICE\_FIRST\_TIME\_REGISTERED" event possible for the device.
* The event is triggered on the first interaction of the device with 1NCE OS by interacting with any of endpoints ([UDP](doc:device-integrator-udp), [COAP](doc:device-integrator-coap), [LwM2M](doc:1nce-os-lwm2m) registration), [Device Observability Memfault Plugin](doc:1nce-os-plugins-device-observability-memfault) or using the [FOTA management Mender Plugin](doc:1nce-os-plugins-fota-management-mender) with a particular device.
* Using "DEVICE\_FIRST\_TIME\_REGISTERED" event, customers can identify which devices have been activated and brought online at least once.
