---
title: Device Locator Integration
description: LwM2M integration with 1NCE OS Location Service.
---
# LwM2M Integration with Location Service

LwM2M Server will automaticaly forward GPS data to [Device locator](doc:1nce-os-device-locator), if GPS data will be provided in following [OMA](https://raw.githubusercontent.com/OpenMobileAlliance/lwm2m-registry/prod/6.xml) resource addresses:

* `/6/0/0` (latitude, Float)
* `/6/0/1` (longitude, Float)
* `/6/0/5` (timestamp, Time). Not mandatory.

GPS data can be:

* Visualized in the 1NCE OS portal [Device inspector](doc:device-inspector-features-limitations) & [Device locator](doc:1nce-os-device-locator) tabs.
* Forwarded to [Cloud integrator](doc:1nce-os-cloud-integrator).
* Used via [API](doc:device-locator-api).

<Image alt="Location data from LwM2M Device in Historian" align="center" width="70%" src="/img/1nce-os/1nce-os-lwm2m/lwm2m-device-locator-integration/c8307f0fcd4da88dcccd304278e2c819a1e88e1267c05c917c64004e98b52fdf-Screenshot_2024-09-12_173915.png">
  Location data from LwM2M Device in Historian
</Image>

<Image alt="GPS Location in Device Locator from LwM2M data" align="center" width="70%" src="/img/1nce-os/1nce-os-lwm2m/lwm2m-device-locator-integration/50d95f4d622cef3a90aa3e2b9b827ddaf68ba05f67d468a12e444064b814a3a1-Screenshot_2024-09-12_173822.png">
  GPS Location in Device Locator from LwM2M data
</Image>
