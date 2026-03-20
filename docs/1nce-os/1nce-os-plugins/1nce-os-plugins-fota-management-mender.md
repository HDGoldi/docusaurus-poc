---
title: FOTA Management Plugin by Mender
description: Firmware Over-the-Air Management
---
## Description

Continuously roll out new firmware to ensure compliance with security regulations like the EU Cyber Resilience Act while improving your customer experience with stability enhancements and new innovative features. Mender is the market-leading FOTA Management solution, providing secure and robust over-the-air (OTA) software updates for your entire device fleet.

**Security by design**: Ensure communication, data integrity, and authenticity are verified. Trust a battle-tested solution with millions of devices under management.\
**Robustness**: Minimize the risk of bricking devices, even in cases of losing power or connectivity in the middle of the update process. Devices will always be in a known and operable state\
**Optimize**: Meet bandwidth and uptime requirements and realize up to a 90% reduction in bandwidth consumption with delta updates. Advanced scheduling and phased rollout to minimize risk of fleet interruption.

## Pricing

1NCE Plugins allow you to start at no cost. Firmware Over-The-Air Management plugin by Mender comes with a free trial plan for up to 10 devices for 12 months. You can increase the number of devices and unlock more features and benefits by selecting the right [plan](https://mender.io/product/pricing) for your business. For further inquiries about usage and pricing, please reach out to [contact@mender.io](mailto:contact@mender.io).

## Start Using

To start using the 1NCE OS Plugin with Mender you first need to create a hosted Mender account and get an Organization token on the Mender side. Starting from the main page of Mender, choose *My organization* under the dropdown on your profile. **Keep the Organization token because it is necessary for creating the plugin in the 1NCE OS system**.

<Image alt="Organization Token in Mender" align="center" width="90% " src="/img/1nce-os/1nce-os-plugins/1nce-os-plugins-fota-management-mender/8da6b4c-Mender_Organization_Token.png">
  Organization Token in Mender
</Image>

To finish the configuration in 1NCE OS you can choose one of the two options described below. After configuration is done you can use the [Demo script for zephyr](https://github.com/1NCE-GmbH/blueprint-zephyr/tree/main/plugin_system/nce_fota_mender_demo) from 1NCE OS to showcase Mender Plugin features and understand the capabilities of 1NCE OS SDK & FOTA client.

> :warning: Please note that by installing this plugin, you are aware that **data is shared with Mender**.

# Mender  Plugin Installation via Frontend

## Plugin Installation

Plugin can be installed in [1NCE OS](https://portal.1nce.com/portal/customer/1nceos) portal "Plugins" tab by choosing "Mender".

<Image alt="Mender Plugin" align="center" width="35% " src="/img/1nce-os/1nce-os-plugins/1nce-os-plugins-fota-management-mender/8a87199-mender_plugin.png">
  Mender Plugin
</Image>

To install a Mender Plugin you should provide the Organization Token from Mender.

<Image alt="Mender plugin installation" align="center" width="90%" src="/img/1nce-os/1nce-os-plugins/1nce-os-plugins-fota-management-mender/f177ed7-mender_plugin_configuration.png">
  Mender plugin installation
</Image>

# Mender plugin installation via API

## Plugin Installation

The Mender plugin can be created via the `partners` API by using the "MENDER" partner in the [API Explorer](ref:api-welcome).\
Only the `Organization token` from the Mender is mandatory to be added to the request body. 

Example:

```curl
curl --location --request POST 'https://api.1nce.com/management-api/v1/partners/MENDER/plugins' \
--header 'Authorization: Bearer <TOKEN>' \
--header 'Content-Type: application/json' \
--data-raw '{
    "tenantToken":   "abcdef123456"
}'
```

If a specific user-generated Private Key and Public Key requires to be added it can be done only via API.

```curl
curl --location --request POST 'https://api.1nce.com/management-api/v1/partners/MENDER/plugins' \
--header 'Authorization: Bearer <TOKEN>' \
--header 'Content-Type: application/json' \
--data-raw '{
    "tenantToken":   "abcdef123456",
    "publicKey": "-----BEGIN PUBLIC KEY-----\n .. \n-----END PUBLIC KEY-----\n",
    "privateKey": "-----BEGIN PRIVATE KEY-----\n .. \n-----END PRIVATE KEY-----\n"
}'
```

## Integration Get or Uninstall endpoints

To get details or uninstall your Mender integration via API, you can use the same endpoints you would use for a generic Plugin described in the [API Explorer](ref:api-welcome).

# Utilizing Mender plugin

The Mender server stores and controls the deployment of software updates over the air to your devices. Mender can be used to manage devices, upload and manage software releases to the server, and create deployments to roll out software to your devices.

1NCE OS mender plugin supports CoAP/CoAPs to HTTPS proxying with seamless support for Authorization. The HTTPs [Mender endpoints](https://docs.mender.io/api/#device-apis) should be added in CoAP Requests Proxy-URI options. To utilize proxy functionality please use one of the following endpoints for CoAP requests:

* `coap://coap.proxy.os.1nce.com:5683/mender`
* `coaps://coaps.proxy.os.1nce.com:5684/mender`.\
  *If CoAPs is required to be used please refer to[DTLS encryption for CoAP](doc:device-integrator-coap#dtls-encryption-for-coap).*

### Coap to HTTPS Proxy functionality

CoAP to HTTPS proxy's main functionality is to "translate" the CoAP requests to HTTPS requests and HTTPS responses to CoAP responses. Mender Plugin provides additional logic for [Mender auth endpoint](https://docs.mender.io/api/#device-api-device-authentication) and ensures Authorization header injection for other Mender endpoints.

* Whenever [Mender auth endpoint](https://docs.mender.io/api/#device-api-device-authentication) is used for POST requests, 1NCE OS will generate the correct request body required for authentication and store the returned JWT token in the system for future use. **Please note that renewing the JWT token requires calling the endpoint once again**. Post request body example:
  ```
  {
      "id_data": "{\"iccid\":\"1234567890123456789\"}",
      "pubKey": "-----BEGIN PUBLIC KEY-----\n .. \n-----END PUBLIC KEY-----\n",
      "tenant_token": "abcdef123456="
  }
  ```
* For any other request where [Mender endpoints](https://docs.mender.io/api/#device-apis) are being used in Proxy-URI options, the JWT token will be added as an additional Authorization header for HTTPS request.
  ```
  {
    "Authorization": "Bearer 'JWT_TOKEN'"
  }
  ```
* If [Mender auth endpoint](https://docs.mender.io/api/#device-api-device-authentication) was never called and JWT token is not present in 1NCE OS, then the request will be proxied without the Authorization header.

## Adding devices in Mender

By proxying the POST request to [Mender auth endpoint](https://docs.mender.io/api/#device-api-device-authentication) device would show up in mender as "Pending". The device needs to be accepted by selecting "Accept device".

<Image alt="Pending Device in Mender" align="center" width="90%" src="/img/1nce-os/1nce-os-plugins/1nce-os-plugins-fota-management-mender/fb46ee6-Mender_Device_Pending.png">
  Pending Device in Mender
</Image>

<Image alt="Accepting Device in Mender" align="center" width="90%" src="/img/1nce-os/1nce-os-plugins/1nce-os-plugins-fota-management-mender/57a326d-Mender_device_acceptance2.png">
  Accepting Device in Mender
</Image>

## Release, Deployment creation

To use the 1NCE OS Plugin for Release and deployment management in Mender, please refer to [Demo script for zephyr](https://github.com/1NCE-GmbH/blueprint-zephyr/tree/main/plugin_system/nce_fota_mender_demo) from 1NCE OS. Examples of Artifact creation, Release, and Deployment management are provided.

# Features and Limitations

General [Plugins features and limitations](doc:1nce-os-plugins-features-limitations) applies to Mender. There are still some individual Limitations applied for Mender:

## Limitations

* Only mender endpoints are allowed to be proxied. The following endpoints in CoAP Request Proxy-URI options are allowed for Mender Plugin:\
  `hosted.mender.io`\
  `eu.hosted.mender.io`
* Public key and Private key can be provided only via API. Keys should be a pair and they should be provided in `PEM` format. The public key max allowed string length is 1000 chars, Private key max allowed string length is 3000 chars.
* Currently only `RSA PKCS1` and `RSA PKCS8` private and public key types are supported. Other types `ECDSA` and `ED25519` are not supported for now.

# Outcome of successful configuration

## Device List

If the configuration is completed devices should be accepted and available on the Mender devices list. 

<Image alt="Device fleet in Datacake" align="center" width="85%" border={true} src="/img/1nce-os/1nce-os-plugins/1nce-os-plugins-fota-management-mender/49eae21-mender_device.png">
  Device fleet in Datacake
</Image>

## Deployment status

In the case of an active deployment, it should be possible to track deployment statuses such as 'downloading,' 'installing,' 'success,' and other relevant [statuses](https://docs.mender.io/api/#management-api-deployments-list-all-devices-in-deployment-responses).

<Image alt="Deployment with status 'installing'" align="center" border={true} src="/img/1nce-os/1nce-os-plugins/1nce-os-plugins-fota-management-mender/5e9f96b-6-Installing.png">
  Deployment with status 'installing'
</Image>

In device deployment history it should be available to see all deployments.

<Image alt="Device deployment history" align="center" border={true} src="/img/1nce-os/1nce-os-plugins/1nce-os-plugins-fota-management-mender/c06adcd-8-Deployment_log.png">
  Device deployment history
</Image>
