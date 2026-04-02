---
title: Device Locator
description: How is the device locator working
---
<div style={{textAlign: 'center'}}>
<img src="/img/1nce-os/1nce-os-device-locator/c43a6778f88b410a537a526183996d5b0ca249c2d2e0968828b22e1a8137243b-CleanShot_2025-09-12_at_07.53.362x.png" alt="" width="80%" />
</div>

# Whereabouts Location service

1NCE OS provides the ability to manage and view device positions using both the API and the frontend. An interactive map showing all customer devices is available on the Device Locator page, and the location history of individual devices over the last 7 days can be accessed on the Device Inspector page.

1NCE OS utilizes and processes multiple sources of device location data:

* GPS data via the Energy Saver template.
* GPS data via LwM2M using the /6/0/0 object.
* Cell tower location data using SIM network tower connections.

# Cell Tower Location

The Device Locator provides an approximate position of IoT devices by analyzing data from network events when creating a new PDP Context/Session used for data transmission.  
This feature has to be activated in the portal. To view latest particular device cellTower location resolution attempts [Activity endpoint](/1nce-os/1nce-os-device-locator/device-locator-api#get-device-activity) can be used.

<div style={{textAlign: 'center'}}>
<img src="/img/1nce-os/1nce-os-device-locator/4a6bdef3eda26571384ca493002ca95034a3540c4b388e35c19e7d9185c12b70-enabling-cell-tower-location.png" alt="Enabling the Cell Tower location feature" width="70%" />
</div>

## Basic solver mode

By default, the basic solver mode is enabled, which delivers device positioning when connected via 2G technology. Resolved position is based on the location of the cell tower device is connected to. Positioning for 3G, 4G, LTE-M, and NB-IoT connections is not guaranteed and may not be resolved.  
Creative Commons License OpenCelliD Project is licensed under a Creative Commons Attribution-ShareAlike 4.0 International License  
![](https://mirrors.creativecommons.org/presskit/buttons/80x15/svg/by-sa.svg) [OpenCelliD Project](https://opencellid.org/) is licensed under a [Creative Commons Attribution-ShareAlike 4.0 International License](https://creativecommons.org/licenses/by-sa/4.0/)

## Plus solver mode

When Plus solver mode is enabled, it improves the Cell Tower Location accuracy and coverage particularly for 3G, 4G and LTE-M. However, NB-IoT resolutions will not be performed in Plus solver mode.

Up to 95% of all cell tower locations are successfully resolved using the Plus solver mode.  
New metadata field is also added with accuracy data. In the following example, the circle around the point on the map indicates that there is a 68% probability that the device is within a 270-meter radius of the provided location.

### Device Location Credits

Each cell tower resolution consumes 1 credit from the Device Locator credit balance. The credit balance is refreshed periodically throughout the day.
If all credits are depleted or the current date reaches the credit expiry date, the plus solver mode automatically switches to basic mode.

You can request access to this feature via the 1NCE OS portal.
Credits can be purchased via the Orders tab in the 1NCE Portal by choosing the required quantity of “Whereabouts – Device Location” credits.

<div style={{textAlign: 'center'}}>
<img src="/img/1nce-os/1nce-os-device-locator/273a6e8e5121adf68a59183266e4ae70fa81bab4bdd3416eb09b406b6a15e2bf-Screenshot_2025-09-12_093126.png" alt="Enabled Advanced solver mode with credits available" width="70%" />
</div>

*Enabled Plus solver mode with credits available*

<div style={{textAlign: 'center'}}>
<img src="/img/1nce-os/1nce-os-device-locator/9d36b61-image.png" alt="Advanced solver mode" width="70%" />
</div>

*Plus solver mode*

<br />

## Cell Tower Events

The Cell tower events tab displays the history of cell tower-based location resolution attempts for the selected device. Location data is stored for up to 7 days.
The tab displays the following data:

* Event creation time
* Network access type used for each event
* Status indicating whether the cell tower event was successfully resolved by the Basic or Plus Resolver
* Resolver mode indicating how the location was derived

<div style={{textAlign: 'center'}}>
![Cell Tower Events](/img/1nce-os/1nce-os-device-locator/d58d19675362bc860ecd1ea5f296e4e4137fdb597156cc4c742a67d6497154e5-cell-tower-events-tab.png)
</div>

## Disclaimer

I acknowledge that activating the location feature involves processing nearby Cell Tower data by 1NCE. 1NCE processing of data is done anonymously. I understand that if the use of the service by me makes it linkable to individuals, additional data related responsibilities may apply. As per [1NCE General Terms and Conditions (GTC)](https://1nce.com/wp-content/1NCE-business-terms-EN.pdf), I am solely responsible for complying with Data Protection laws and regulations and obtaining necessary consents.

# Via Energy Saver

If the Energy Saver with `custom_type` in the JSON-Template is used, the location from the device can be obtained over the Energy Saver output. Visit [Energy Saver](/1nce-os/1nce-os-energy-saver/energy-saver-device-locator-integration) for more details.

```json
{
  "sense": [
    {
      "asset": "longitude",
      "custom_type": "location_long",
      "value": {
        "byte": 0,
        "bytelength": 8,
        "type": "float",
        "byteorder": "little"
      }
    },
    {
      "asset": "latitude",
      "custom_type": "location_lat",
      "value": {
        "byte": 8,
        "bytelength": 8,
        "type": "float",
        "byteorder": "little"
      }
    }
  ]
}
```

# Via LwM2M

If LwM2M is used, the following Resource Addresses can be used to provide the device location: `/6/0/0` (latitude, Float), `/6/0/1` (longitude, Float) and `/6/0/5` (timestamp, Time). Visit our [LwM2M Service Documentation](/1nce-os/1nce-os-lwm2m/lwm2m-device-locator-integration) for more details on integrating LwM2M with the device locator.

# Geofencing

The Geofencing Service allows setting virtual boundaries for devices. If a device is crossing a geofence (entering or exiting, configurable), a [geofence event](/1nce-os/1nce-os-cloud-integrator/cloud-integrator-output-format#geofence) will be generated and sent to the customer's Cloud Integrator Webhook integration or the AWS Integration.

To start using Geofencing you need to purchase "Whereabouts - Geofencing" [credits](/1nce-os/1nce-os-device-locator/index#geofence-credits) first. You can use following [Get customer settings](https://help.1nce.com/dev-hub/reference/get_v1-settings-1nceos) API endpoint to check if credits are already assigned to you.
Once the credits are available, you can create your first geofence using the [Create Geofence](https://help.1nce.com/dev-hub/reference/post_v1-locate-geofences) API endpoint. For additional info about Geofence creation use following [page](/unresolved/doc:evice-locator-geofencing-guide).

Main use cases for geofencing are:

* Notify user in case if a device or an object this device is attached to exits specific area.
* Notify user in case if a device or an object this device is attached to enters specific area.

## Geofence Credits

Each location event sourced from cell towers or GPS is evaluated against associated geofences in the 1NCE OS.
If at least one geofence is evaluated for a potential breach, then one Geofencing credit is consumed.
The Geofencing credit balance is refreshed periodically throughout the day.

Additional credits can be purchased via the Orders tab in the 1NCE Portal by selecting the required quantity of “Whereabouts – Geofencing” credits.

If all credits are depleted or expired then the Geofencing feature is automatically turned off, which means the following:

* you will no longer receive exit or enter [geofence events](/1nce-os/1nce-os-cloud-integrator/index#geofence-events) via your Cloud Integration if the device breaches any existing geofence.
* you will not be able to create any new Geofences, only update or delete existing ones.
* existing Geofences and associated latest device enter or exit events will continue to exist in passive mode until extra credits are purchased.
