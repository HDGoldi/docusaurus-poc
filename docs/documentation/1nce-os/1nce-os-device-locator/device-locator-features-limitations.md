---
title: Features & Limitations
sidebar_position: 1
---
## Features

### Cell-tower **Basic and "Plus"**

* The IoT Devices are located by using the cell id of the current tower when creating a new PDP Context or Session used for data transmission. In case the location cannot be determined, the update is skipped and a retry will be done in the next PDP Context/Session.

* Using the API. Device location and cellTower activity can be queried. The `DeviceId` is equal to the `ICCID`.
  * The resolved locations of a certain IoT device can be queried using `https://api.1nce.com/management-api/v1/locate/devices/{deviceId}/positions`
  * The cellTower location resolutions history including unresolved location records of a certain IoT device can be queried using `https://api.1nce.com/management-api/v1/locate/devices/{deviceId}/activity`

* Cell tower "Plus" location mode provides a metadata parameter with accuracy data for resolved locations and tower metadata for unresolved [locations](/docs/1nce-os/1nce-os-device-locator/device-locator-api#get-device-activity).

### Geofencing

* Using Geofencing functionality it is possible to set virtual boundaries to detect geofence crossing event and receive a notification about it via the [Cloud integrator](/docs/1nce-os/1nce-os-cloud-integrator/).
* Users can create up to 10 global geofences across all devices as well as 1 device-specific geofence per-device.
* Geofences supports two area types: polygon and circle.
* It is possible to define Geofence event types, which control if geofence events will be triggered on device entering or exiting specified area or on both, if not specified then default is to use both.
* It is possible to define Geofence event sources, which control if geofence events will be triggered on GPS or Cell Tower location changes or on both, if not specified then default is to use both.
* For the circle Geofence which is attached to the device, system will try to retrieve circle center using latest device location in case if user does not pass center during Geofence creation request.

## Limitations

### Cell-tower **Basic and "Plus"**

* Cell-tower **Basic and "Plus"** location modes use different data sources. Currently, Basic mode resolves approximately **30% of locations**, while Plus mode resolves **around 90%**. However, location data can be inaccurate, especially for 3G, 4G, LTE-M, and NB-IoT devices.
* If "Plus" resolver mode is enabled, then [Device Location credits](/docs/1nce-os/1nce-os-device-locator/#device-location-credits) will be consumed.
* NB-IoT locations are not being resolved with "Plus" resolver.
* After activating the cell tower location setting it can take a few minutes before the first location will be available.
* Cell tower location data is resolved no more frequently than once an hour.
* For customers in Brazil and China, current service limitations may impact our ability to accurately determine device cell-tower location and maintain a complete location history. This may result in less accurate or incomplete location information.
* To view the location history of specific device on the map you have to switch to the Device Inspector in the 1NCE OS Portal.
* The Cell tower events tab displays data for a single device selected in the filter.

### Geofencing

* Interactive drawing and visualization of geofencing is not available in our portal, <a href="https://geojson.io/" target="_blank">Geojson</a> can be used to visualize geofences. Here is the [guide](/docs/1nce-os/1nce-os-device-locator/device-locator-geofencing-guide) .
* User can update only Geofence name, event types and event sources, coordinates and Geofence type cannot be changed to prevent possible confusion with the previous exit or enter events.
* Geofence creation and enter/exit events require active [Geofence credits](/docs/1nce-os/1nce-os-device-locator/#geofence-credits).
