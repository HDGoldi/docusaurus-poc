---
title: Bootstrapping
description: >-
  The 1NCE LwM2M client bootstrapping process, needed to register a device to
  the LwM2M server.
---
To use the 1NCE LwM2M Service, every time a client IoT device with a 1NCE SIM wants to connect or reattach, the bootstrap server needs to be contacted at first. A direct connection to the LwM2M server without prior communication towards the bootstrap service is not possible. 

The task at hand for the bootstrap server is to accept the initial connection, handle the authorization of the SIM device using the SIM-as-an-Identity service and provide LwM2M server connectivity instructions with one-time specific security credentials. 

There are two possible methods to bootstrap a device. The bootstrapping can be performed either by encrypted DTLS communication (using PSK) or by using Plain COAP. 

DTLS is using pre-shared key (PSK) provided by client device and identity of device (deviceId-iccid). If device is bootstrapping to secure server, the LWM2M server priority is changed to also secure server to be first. 

The PSK can be set:

* using 1NCE OS API endpoint described in [API Explorer](https://help.1nce.com/dev-hub/reference/post_v1-integrate-devices-deviceid-psk)
* in 1NCE OS portal Device Integrator when [testing lwm2m endpoint](/1nce-os/1nce-os-device-integrator/device-integrator-test-endpoints#testing-the-endpoint)

Using [leshan client](https://github.com/eclipse/leshan#test-leshan-demos-locally) there is 2 examples to bootstrap:

1. **DTLS** `java -jar .\leshan-client.jar -b -u lwm2m.os.1nce.com:5684 -p <secret key in HEX> -i <identity>`
2. **PLAIN** `java -jar .\leshan-client.jar -b -u lwm2m.os.1nce.com:5683`

The following figure illustrates this process in detail.

<div style={{textAlign: 'center'}}>
<img src="/img/1nce-os/1nce-os-lwm2m/lwm2m-bootstrapping/001.png" alt="" style={{maxWidth: '100%'}} />
</div>

### The shown steps are the following (plain connection):

1. The LwM2M client calls the bootstrap server at `lwm2m.os.1nce.com:5683` using plain CoAP.

2. The bootstrap server responds with a data message containing all the necessary information for the client to connect to the actual LwM2M server.

   > LwM2M Server

   | Resource | Description | Type | Value |
| --- | --- | --- | --- |
| 0/0/0 | LWM2M Server URI | String | Example: `coap://1.2.3.4:5683` |
| 0/0/1 | Bootstrap-Server | Boolean | false |
| 0/0/2 | Security Mode | Integer | 3 (NoSec) |
| 0/0/10 | Server Id | Integer | 1111 |
| 1/0/0 | Short Server ID | Integer | 1111 |
| 1/0/1 | Lifetime (s) | Integer | 86400 |
| 1/0/2 | Default Minimum Period (s) | Integer | 1 |

   > Bootstrap Server

   | Resource | Description | Type | Value |
| --- | --- | --- | --- |
| 0/1/0 | Bootstrap Server URI | String | Example: `coap://lwm2m.os.1nce.com:5683` |
| 0/1/1 | Bootstrap-Server | Boolean | yes |
| 0/1/2 | Security Mode | Integer | 3 (NoSec) |
| 0/1/10 | Server Id | Integer | 2222 |

3. The LwM2M client device uses this information to trigger the registration on the LwM2M server using CoAP.

### The shown steps are the following (with DTLS):

1. The LwM2M client calls the bootstrap server at lwm2m.os.1nce.com:5684 using CoAPs.

2. The bootstrap server responds with a data message containing all the necessary information for the client to connect to the actual LwM2M server.

   > LwM2M DTLS Server

   | Resource | Description | Type | Value |
| --- | --- | --- | --- |
| 0/0/0 | LWM2M Server URI | String | Example: `coaps://1.2.3.4:5684` |
| 0/0/1 | Bootstrap-Server | Boolean | false |
| 0/0/2 | Security Mode | Integer | 0 (Pre-Shared Key) |
| 0/0/3 | Identity | Opaque | *Identity as binary data* |
| 0/0/5 | Secret Key | Opaque | *Private key for LwM2M Server as binary data* |
| 0/0/10 | Server Id | Integer | 1111 |
| 1/0/0 | Short Server ID | Integer | 1111 |
| 1/0/1 | Lifetime (s) | Integer | 86400 |
| 1/0/2 | Default Minimum Period (s) | Integer | 1 |

   > Bootstrap DTLS Server

   | Resource | Description | Type | Value |
| --- | --- | --- | --- |
| 0/1/0 | Bootstrap Server URI | String | Example: `coaps://lwm2m.os.1nce.com:5684` |
| 0/1/1 | Bootstrap-Server | Boolean | yes |
| 0/1/2 | Security Mode | Integer | 0 (Pre-Shared Key) |
| 0/1/3 | Identity | Opaque | *Identity as binary data* |
| 0/1/5 | Secret Key | Opaque | *Private key for LwM2M Bootstrap Server as binary data* |
| 0/1/10 | Server Id | Integer | 2222 |

3. The LwM2M client device uses this information to trigger the registration on the LwM2M server using CoAPs. The DTLS Pre Shared Key (PSK) that is provided by the bootstrap server and used for the registration is regenerated on every bootstrap request.
