---
title: Device Observability Plugin by Memfault
description: Fault Diagnostics and Log management
---
## Description

Memfault provides observability purpose-built for devices. Compatible with constrained microcontroller-based devices to complex Linux and Android systems, Memfault helps embedded development teams understand exactly how their devices perform in the field, and find and fix faults fast.

**Fault Diagnostics**: Automatically capture diagnostics data every time your devices experience a crash or unexpected error. Diagnose and debug faults happening in the field within hours, not days or weeks.\
**Log Management**:  Automatic log storage, collection, and analysis designed for devices, not servers and apps. Save hours with every investigation and turn your logs into a tool for fleet-wide insights.\
**Fleet Health Monitoring**: Monitor the health of your fleet in real-time with built-in tools for comparison between software versions, hardware versions, and more. We handle the data collection and processing, you get the insights.\
**Product Analytics**: Understand product usage, performance, and reliability using real-world data. Collect product usage data from every device in your fleet even when they aren’t connected so there are no gaps in your data and no more guessing.

## Pricing

1NCE OS Plugins allow you to start at no cost. The Device Observability plugin by Memfault has a free trial plan for up to 10 devices. You can increase the number of devices and unlock more features and benefits by selecting the right [plan for your business](https://memfault.com/pricing/).

## Start Using

To install Plugin in 1NCE OS you can choose one of the two options described below. After configuration is done you can use the [Demo script for zephyr](https://github.com/1NCE-GmbH/blueprint-zephyr/tree/main/plugin_system/nce_debug_memfault_demo) from 1NCE OS to showcase Memfault Plugin features and understand the capabilities of 1NCE OS SDK.

:::warning
Please note that during Memfault plugin installation your Organization's email address will be used for the new Memfault account. You will need access to this email to receive confirmation email from Memfault after Sign up.

:warning: Please note that by installing this plugin, you are aware that **data is shared with Memfault**.
:::


# Memfault  Plugin Installation via Frontend

## Plugin Installation

The Plugin can be installed in [1NCE OS](https://portal.1nce.com/portal/customer/1nceos) portal "Plugins" tab by choosing "Memfault."

<div style={{textAlign: 'center'}}>
<img src="/img/1nce-os/1nce-os-plugins/1nce-os-plugins-device-observability-memfault/f355f38ec486dc27479e007254ce26997927ec77d4b85ec2f03bd80addc76e19-memfault_tile.jpg" alt="Memfault Plugin" width="35%" />
</div>

There is no need to provide any extra information, so you can immediatelly proceed with the installation by pressing the "Install" button on the "Plugin Details page."

:::warning
Please note that after pressing install button system automatically creates Memfault account with your 1NCE Organization's email address, which cannot be changed afterwards.
:::


<div style={{textAlign: 'center'}}>
<img src="/img/1nce-os/1nce-os-plugins/1nce-os-plugins-device-observability-memfault/b2d56b738d8f84c0dd3fe459a56681e0856a8b250da5fb8636159ec5466e6bb3-plugin-details.jpg" alt="Memfault plugin details" width="90%" />
</div>

If plugin installation goes well you should see the "Plugin Installed" page.\
After this, you already can start sending data to the Memfault system.

<div style={{textAlign: 'center'}}>
<img src="/img/1nce-os/1nce-os-plugins/1nce-os-plugins-device-observability-memfault/580b93666e0be7a0bd5b6887038b1f52b71168516e19cb92959df71830baeaf2-plugin_installed.jpg" alt="Memfault plugin installed" width="90%" />
</div>

In the Plugin installed page, you will see the "Open Memfault Portal" button, which in the new browser tab will open your new Memfault account finalization page. The email field will be already prefilled with your 1NCE Organization's email address.

<div style={{textAlign: 'center'}}>
<img src="/img/1nce-os/1nce-os-plugins/1nce-os-plugins-device-observability-memfault/79b4349ca522433022d52aabdea261ded9a65a5806449e54c823ca86c2e6fcb4-create_memfault_account.jpg" alt="Finalize Memfault account" width="40%" />
</div>

In case you navigate away from the "Plugin Installed" page you can still get the Memfault registration URL by navigating to the Memfault plugin details and clicking on the "Register with Memfault" link.

<div style={{textAlign: 'center'}}>
<img src="/img/1nce-os/1nce-os-plugins/1nce-os-plugins-device-observability-memfault/d5df54912814d6dffeb28b12d85a312a8f5cc1e897bc24c41f900758485db290-plugin_details_unfinished.jpg" alt="Memfault plugin details" width="90%" />
</div>

After registration in the Memfault portal is completed you should see the following plugin details page, where we provide details about the Memfault plugin and the "Memfault portal" link to easily navigate to your Memfault account.\
If you need to uninstall the Memfault plugin it also can be done from this page. The uninstall button will only remove the plugin from the 1NCE system, in the Memfault portal account will not be deleted. 

<div style={{textAlign: 'center'}}>
<img src="/img/1nce-os/1nce-os-plugins/1nce-os-plugins-device-observability-memfault/249442fb02c2ed8a4e4ca79e5decb192e45119bcc1fb7e2eba1dde2fbdae68de-plugin_details_finished.jpg" alt="Memfault plugin details" width="90%" />
</div>

# Memfault plugin installation via API

## Plugin Installation

The Memfault plugin can be created via the `partners` API by using the "MEMFAULT" partner in the [API Explorer](ref:api-welcome).\
There is no need to pass any request body during the POST request. 

Example:

```curl
curl --location --request POST 'https://api.1nce.com/management-api/v1/partners/MEMFAULT/plugins' \
--header 'Authorization: Bearer <TOKEN>' \
--header 'Content-Type: application/json' \
--header 'Accept: application/json' \
```

## Plugin Get and Uninstall endpoints

To get details or uninstall your Memfault integration via API, you can use the same endpoints you would use for a generic Plugin described in the [API Explorer](ref:api-welcome).

:::warning
Memfault portal Url to finalize registration can be retrieved only in the response of the Get Plugin Details endpoint.
:::


# Utilizing Memfault plugin

The Memfault server receives and stores debug and log data sent by your devices.

1NCE OS Memfault plugin supports CoAP/CoAPs to HTTPS proxying with seamless support for Authorization. All the data sent by the device to the 1NCE OS Coap Proxy server is proxied to the Memfault [Chunks endpoint](https://api-docs.memfault.com/#a8d3e36f-62f0-4120-9fc6-544ee04f3bb5). We automatically pass device ICCID as a device identifier to the Memfault system, so the following URI should be added in CoAP Requests `Proxy-URI`option:

```
https://chunks.memfault.com/api/v0/chunks/:iccid:
```

Additionally please remember to set the correct `Content-Format` option, for binary payloads it should be 42.

To utilize proxy functionality please use one of the following endpoints for CoAP requests:

* `coap://coap.proxy.os.1nce.com:5683`
* `coaps://coaps.proxy.os.1nce.com:5684`.

  *If CoAPs is required to be used please refer to[DTLS encryption for CoAP](/1nce-os/1nce-os-device-integrator/device-integrator-coap#dtls-encryption-for-coap).*

### Coap to HTTPS Proxy functionality

CoAP to HTTPS proxy's main functionality is to "translate" the CoAP requests to HTTPS requests and HTTPS responses to CoAP responses. As mentioned before 1NCE OS Coap Proxy for Memfault Plugin automatically replaces `:iccid:` part with the actual ICCID value before doing HTTPS request to the Memfault chunks API.\
Additionally, the Memfault plugin also retrieves and stores the Memfault project key value during plugin installation. This value then is automatically injected as a `Memfault-Project-Key` header into the HTTPS request towards Memfault Chunks API endpoint, so there is no need to manage it from the customer device side.

## Adding devices in Memfault

After Memfault plugin installation is done you can utilize [Demo script for zephyr](https://github.com/1NCE-GmbH/blueprint-zephyr/tree/main/plugin_system/nce_debug_memfault_demo) to start sending chunks data to the Memfault system. If chunks are processed successfully, the device will show up in the Memfault portal on the Devices page automatically with the ICCID of the 1NCE sim card used as a device serial number.

<div style={{textAlign: 'center'}}>
<img src="/img/1nce-os/1nce-os-plugins/1nce-os-plugins-device-observability-memfault/f8ae38b6a168b2e610bf50840e66634d5b9a6b7ac98b6b2ade63aaaa2b07aac5-memfault_device_page.png" alt="Memfault Devices" width="90%" />
</div>

# Features and Limitations

General [Plugins features and limitations](/1nce-os/1nce-os-plugins/1nce-os-plugins-features-limitations) applies to Memfault.\
There are still some individual Features and Limitations applied to the Memfault plugin:

## Features

* Seamless Memfault plugin creation without the need to prepare or enter any additional information.
* Automatic Memfault authorization process in the Coap Proxy without the need to store any secrets or extra configuration on the device.

## Limitations

* During Memfault account creation system will use your 1NCE Organization's email address, so there is no way to provide a custom email before plugin installation.
* The device serial number in the Memfault system always is the ICCID of the 1NCE sim card.
* Maximum supported payload size for Coap Proxy requests is 5120 bytes. It is suggested to send payload which is smaller than 1024 bytes in a single request to not trigger block-wise transfer.
* Currently only supported Memfault proxying mode is uploading a single chunk in one request, other modes like base64-encoded chunks and multiple chunks in one request described in the [Memfault Chunks endpoint](https://api-docs.memfault.com/#a8d3e36f-62f0-4120-9fc6-544ee04f3bb5) are not supported.

# Outcome of successful plugin creation

After devices start to send data to the Memfault system, you can start monitoring different aspects of your device fleet.\
The Connectivity page provides useful insights like device uptime, sent data amount, and more.

<div style={{textAlign: 'center'}}>
<img src="/img/1nce-os/1nce-os-plugins/1nce-os-plugins-device-observability-memfault/3458f21614601bc941dc51aec07d00cd6f15245a73db2e346f60e33f01186dfd-memfault_connectivity_page.png" alt="Memfault Connectivity" width="90%" />
</div>

On the Overview page, you can display many different useful widgets.

<div style={{textAlign: 'center'}}>
<img src="/img/1nce-os/1nce-os-plugins/1nce-os-plugins-device-observability-memfault/1863ef96fc2bd8ea61194704948ecafafd1ac21a88ee8239c783af28df8d0fa4-memfault_main_page.png" alt="Memfault Overview" width="90%" />
</div>

More information about how to use Memfault features can be found in the [Memfault Documentation](https://docs.memfault.com/docs/platform/introduction).
