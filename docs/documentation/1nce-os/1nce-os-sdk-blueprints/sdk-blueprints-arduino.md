---
title: Arduino Blueprint
sidebar_position: 1
---
# 1NCE Arduino Blueprint

## Overview

1NCE Arduino blueprint provides an  overview of various features of 1NCE OS including Device Authenticator, IoT Integrator and Energy Saver. In combination with 1NCE SDK.

## Supported Boards

The Blueprint is compatible with [Arduino Portenta H7](https://docs.arduino.cc/hardware/portenta-h7) and [Arduino Portenta H7 lite ](https://docs.arduino.cc/hardware/portenta-h7-lite) (running Mbed OS), attached to [Portenta Cat. M1/NB IoT GNSS Shield](https://docs.arduino.cc/hardware/portenta-cat-m1-nb-iot-gnss-shield).

## 1NCE IoT C SDK Integration

[1NCE IoT C SDK](https://github.com/1NCE-GmbH/1nce-iot-c-sdk) is a collection of C source files that can be used to connect and benefit from different services from 1NCE OS. The SDK is integrated with the blueprint through UDP & Log interfaces.

## 1NCE Arduino blueprint - UDP Demo

### Overview

1NCE Arduino UDP Demo allows customers to communicate with 1NCE endpoints via UDP Protocol, and it can send compressed payload using the Energy Saver feature. 

### Using 1NCE Energy saver

The demo can send optimized payload using 1NCE Energy saver. This feature is enabled by default with the following definition in `nce_demo_config.h`

```
#define ENABLE_NCE_ENERGY_SAVER
```

The energy saver template used in the demo can be found in `extras/template.json`

### Configuration options

The configuration options for UDP sample are:

`NCE_UDP_ENDPOINT` is set to 1NCE endpoint.

`NCE_UDP_PORT` is set by default to the 1NCE UDP endpoint port 4445.

`NCE_UDP_DATA_UPLOAD_FREQUENCY_SECONDS` the interval between UDP packets.

`NCE_PAYLOAD` Message to send to 1NCE IoT Integrator.

`NCE_PAYLOAD_DATA_SIZE` Used when 1NCE Energy Saver is enabled to define the payload data size of the translation template.

## 1NCE Arduino blueprint - CoAP Demo

### Overview

1NCE Arduino CoAP Demo allows customers to establish a secure communication with 1NCE endpoints via CoAPs after receiving DTLS credentials from Device Authenticator using the SDK. It can also send compressed payload using the Energy Saver feature. 

### Secure Communication with DTLS using 1NCE SDK

By default, the demo uses 1NCE SDK to send a CoAP GET request to 1NCE OS Device Authenticator. The response is then processed by the SDK and the credentials are used to connect to 1NCE endpoint via CoAP with DTLS. 

### Using 1NCE Energy saver

The demo can send optimized payload using 1NCE Energy saver. This feature is enabled by default with the following definition in `nce_demo_config.h`

```
#define ENABLE_NCE_ENERGY_SAVER
```

The energy saver template used in the demo can be found in `extras/template.json`

### Unsecure CoAP Communication

To test unsecure communication, disable the device authenticator by removing the following definition from `nce_demo_config.h`

```
#define ENABLE_NCE_DEVICE_AUTHENTICATOR
```

### Configuration options

The configuration options for CoAP sample are:

`NCE_COAP_ENDPOINT` is set to 1NCE endpoint.

`NCE_COAP_PORT` is set automatically based on security options (with/without DTLS).

`NCE_COAP_URI_QUERY` the URI Query option used to set the MQTT topic for 1NCE IoT integrator.

`NCE_COAP_DATA_UPLOAD_FREQUENCY_SECONDS` the interval between CoAP packets.

`NCE_PAYLOAD` Message to send to 1NCE IoT Integrator.

`NCE_PAYLOAD_DATA_SIZE` Used when 1NCE Energy Saver is enabled to define the payload data size of the translation template.

## 1NCE Arduino blueprint - LwM2M Demo

### Overview

1NCE Arduino LwM2M Demo allows customers to communicate with 1NCE endpoints via LwM2M Protocol. 

LwM2M Actions can be tested using the [Action API](/api/1nce-os/create-action-requests-for-lw-m-2-m-devices/). For example:

* To get the firmare update object info, send a `read` action to object `/5`.

### Configuration options

The configuration options for LwM2M sample are:

`NCE_ICCID` the ICCID of 1NCE SIM Card.

`LWM2M_ENDPOINT` is set to 1NCE endpoint.

DTLS is enabled by default. To use DTLS, bootstraping PSK should be defined in `LWM2M_BOOTSTRAP_PSK`. It can be configured while testing the LwM2M integration (From the Device integrator), or from the API [Create Pre-Shared Device Key](/api/1nce-os/create-pre-shared-device-key/). 

### Unsecure LwM2M Communication

To test unsecure communication, disable the device authenticator by removing the following definition from `nce_demo_config.h`

```
#define LwM2M_ENABLE_DTLS
```
