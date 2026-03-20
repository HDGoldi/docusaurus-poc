---
title: Features & Limitations
---
## Features

The device inspector overview provides a list of all customer devices. The list can be filtered by `ICCID` to search for a specific device. To see more information of a certain device, a single device can be select it in the list.

<Image align="center" alt="Device Inspector overview" border={false} caption="Device Inspector overview" src="https://files.readme.io/e7af3eb-device_inspector_filter.PNG" width="80%" />

The details will provide more specific information.

### State

Device state for UDP, CoAP or LwM2M messages.

* <b>UDP or CoAP </b>. Last message received from the device is stored in the state. By default, the portal tries to convert Base64 messages to JSON format. If the received content is not valid JSON, the portal will display the original message as Base64.  
  If the user has enabled the **energy saver** feature with a valid template for transforming payload into JSON, the portal will display message as a JSON and, if the message is not tranformable with the existing **energy saver** template, there will be an admin log created with the error message.  
  For CoAP messages, the topic is also stored in the device state.

* <b>LwM2M</b>. Digital representation from the device is stored in state according to OMA specifications.

<Image align="center" alt="Device Inspector Details" border={false} caption="Device State for CoAP" src="https://files.readme.io/6264d0d-device_details.png" width="80%" />

### History

Whenever messages (UDP, CoAP or LwM2M) from a device are sent to the 1NCE OS endpoint(s) those are stored for 7 days.

* <b>UDP or CoAP </b>. Traversed messages are stored. The message format depends on the energy saver status for the specific protocol. If the [Energy Saver](doc:1nce-os-energy-saver) is not enabled, then message will be converted and stored in Base64 format, but when enabled, then a processed message will be stored in JSON format.

* <b>LwM2M</b>. Messages are stored in JSON format.

More details in [Historian Web Interface](doc:device-inspector-historian-web-interface) or [Historian API Examples](doc:device-inspector-historian-api).

### Map

If the device is utilizing [Device Locator](doc:1nce-os-device-locator), then a location will be pinpointed on a map.

<Image align="center" alt="Device Inspector Details. Map" border={false} caption="Device location on map" src="https://files.readme.io/db2d3b0-device_inspector_map.png" width="80%" />

<br />

### Cell Tower Events

Cell tower events show the history of cell tower-based location resolutions for selected device when Cell Tower Location is enabled.

<Image align="center" alt="Device Cell Tower Events" border={false} caption="Device Cell Tower Events" src="https://files.readme.io/660adcb3228e060bed14c910392d348ca107a8672d8ce7090acd9ce7816f4cef-device-inspector-cell-tower-events.png" />

<br />

## Limitations

* We only show history of the device from the last 7 days, but device state is stored permanently.
* History of device is not supporting messages bigger than 2048 bytes. If messages are stored in Base64 [format](doc:device-inspector-features-limitations#history), then raw binary message size shouldn't exceed 1536 bytes.
* Maximum state size for each protocol (UDP, CoAP and LwM2M) is 8192 bytes.
* A summary of the location of the device is shown, containing the first position, the last position and some positions inbetween (more data available via the API).
* The current digital state representation of a SIM device can be updated **up to 20 times per second**. Therefore, if a given device sends messages at a higher frequency, it would cause a throttling issue resulting in the state not being updated. That is noticeable by the existence of **DeviceShadowUpdatertlingIssue]** log** logs in the 1NCE OS Portal Administrator Logs page.
* A different issue can happen if a device sends multiple messages in a short interval. That would result in a digital state version conflict and only one of the states will be actually persisted. The existence of **DeviceShadowUpdateronConflict]** rep** represents that situation.
