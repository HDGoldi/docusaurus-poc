---
title: Web Interface
---
The device controller is available in [1NCE OS](https://portal.1nce.com/portal/customer/1nceos) portal, by opening the device controller tab.

## Sending Data to device

On device controller page, table with the device list is shown. Filtering by Device ID (ICCID) is available in the table.

<div style={{textAlign: 'center'}}>
<img src="/img/1nce-os/1nce-os-device-controller/device-controller-web-interface/d971d2d-Devices_Table__Filtering.png" alt="Device controller devices table with filtering" width="80%" />
</div>

By clicking on a specific device in the table a wizard will be opened that allows:

* Sending UDP message to the device
* Sending `POST`, `PUT`, `DELETE`, `PATCH` or `GET` CoAP request to the device.
* Triggering `Read`, `Write`, `Execute`, `Observe-start` or `Observe-end` LwM2M action to the device

<div style={{textAlign: 'center'}}>
<img src="/img/1nce-os/1nce-os-device-controller/device-controller-web-interface/67230ea-New_Request_UDP.png" alt="Device controler UDP request creation view" width="80%" />
</div>

*Device controller UDP request creation view*

### Request Mode

#### Send Now

Request mode `SEND_NOW` will send the data to the device immediately. It will be validated if device is currently registered to LwM2M server, if LwM2M protocol will be selected. If device is not registered to LwM2M server an error toaster will be shown.

<div style={{textAlign: 'center'}}>
<img src="/img/1nce-os/1nce-os-device-controller/device-controller-web-interface/66672d9-Not_registered_to_lwm2m_server.png" alt="Device not registered to LwM2M server" width="30%" />
</div>

For CoAP and LwM2M messages wizard will wait for the response and display the response details.

<div style={{textAlign: 'center'}}>
<img src="/img/1nce-os/1nce-os-device-controller/device-controller-web-interface/c689032-CoAP_waiting_for_Response.png" alt="Device controler waiting for response" width="80%" />
</div>

*Device controller waiting for response*

<div style={{textAlign: 'center'}}>
<img src="/img/1nce-os/1nce-os-device-controller/device-controller-web-interface/2826e7e9939e484a906017f570efa367bd903ffdd06d589beb9c25b93ea52af8-LwM2M_Success_Response.png" alt="LwM2M Response Details" width="80%" />
</div>

> :warning: Please note that **Response wizard is not present for UDP messages due to UDP specifics**.

#### Send when device is active

Request mode `SEND_WHEN_ACTIVE` will schedule the message and send the data to device when it will become active. Scheduled messages will be sent out on `Cross-protocol trigger` or `LwM2M registration and update events` as decribed in the [device controller features](doc:device-controller-features-limitations).

In this request mode it is possible to configure `Send Attempts` for CoAP and LwM2M protocols. For failed messages [retry mechanism](doc:device-controller-api#retry-mechanism) will be applied if required.

<div style={{textAlign: 'center'}}>
<img src="/img/1nce-os/1nce-os-device-controller/device-controller-web-interface/f950b70-Send_Attempts.png" alt="Send attempts configuration" width="80%" />
</div>

> :warning: Please note that **Send attempts are NOT supported for the UDP protocol**.

## Requests

### Requests history

In the device controller, the tables with active and archived requests history are available. Archived request history is stored for 7 days and active request history is stored for 1 day. It is possible to filter the requests by the following parameters:

* Request Id
* ICCID (Device Id)
* Request Status
  * Active requests table: (`Scheduled`, `In progress`)
  * Archived requests table: (`Failed`, `Succeeded` or `Canceled`)
* Protocol (`UDP, CoAP` or `LwM2M`)

<div style={{textAlign: 'center'}}>
<img src="/img/1nce-os/1nce-os-device-controller/device-controller-web-interface/5a7af1e454c28b4a6ae7d7cc4b2f0a05272e4315daa06359ab5f2ed76ab08b4d-image.png" alt="Device controller requests table with filtering" width="80%" />
</div>

### Request Details

By clicking on a specific request the request details will be displayed. In the request details some fields are mandatory for every request. Depending on protocol and request mode some fields could be optional:

#### Mandatory fields

##### Request:

* Request Id
* Status of the request
* Protocol
* Request Mode
* Request Creation Time
* Request Last Update Time
* Request Data

##### Device:

* Device Id (ICCID)
* IP Address

#### Optional fields

* Configured send attempts
* Left send attempts
* Result Data

<div style={{textAlign: 'center'}}>
<img src="/img/1nce-os/1nce-os-device-controller/device-controller-web-interface/7fad4e075b6faab3c2b33f0d14f6e9cee5c5ee77edfc6976e38f2b2fe2f3a8a3-image.png" alt="Request details" width="80%" />
</div>

### Canceling a request

It is possible to cancel a request form Request Details. This is possible only for "Scheduled" requests.

<div style={{textAlign: 'center'}}>
<img src="/img/1nce-os/1nce-os-device-controller/device-controller-web-interface/6c86d47cf86f03314f42048918c5e115c790e218938a4a2178f9969fa4039552-image.png" alt="Canceling a request" width="80%" />
</div>
