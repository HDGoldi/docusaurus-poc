---
title: FreeRTOS Blueprint
---
1NCE FreeRTOS BluePrint demonstrates the usage of various IoT protocols inculuding CoAP, LwM2M, and UDP with cellular connectivity. In combination with 1NCE SDK for the integration of 1NCE OS tools.

# Overview

1NCE FreeRTOS BluePrint release integrates 1NCE SDK to benefit from different 1NCE OS tools including device Authentication and Energy Saver, with the addition of a static library for CoAP Protocol ([Lobaro CoAP](https://www.lobaro.com/portfolio/lobaro-coap/)) and LwM2M ([Wakaama](https://www.eclipse.org/wakaama/)).

This Repository present examples of simple code:

* CoAP protocol
* CoAPs protocol (with DTLS security using Pre-shared key)
* UDP Demo 
* LwM2M with Bootstrap
* LwM2M without Bootstrap

Additionally, All the Demos have the Energy Saver feature as a Flag that can be enabled to test this feature.

# Getting started

## Prerequisites

* B-L475E-IOT01A2 STM32 Discovery kit IoT node connected to BG96 (LTE Cat M1/Cat NB1/EGPRS modem) through X-NUCLEO-STMODA1 expansion board.
* [1NCE SIM Card.](https://shop.1nce.com/portal/shop/) 
* STM32CubeIDE from [https://www.st.com/content/st\_com/en/products/development-tools/software-development-tools/stm32-software-development-tools/stm32-ides/stm32cubeide.html](https://www.st.com/content/st_com/en/products/development-tools/software-development-tools/stm32-software-development-tools/stm32-ides/stm32cubeide.html)
* STM32 ST-LINK utility from [https://www.st.com/en/development-tools/stsw-link004.html](https://www.st.com/en/development-tools/stsw-link004.html)
* Upgrade the modem BG96 to the latest firmware. ([https://github.com/1NCE-GmbH/blueprint-freertos/tree/master/Utilities/Modem\_FW](https://github.com/1NCE-GmbH/blueprint-freertos/tree/master/Utilities/Modem_FW))\
  **Note:** Download the modem FW flasher tool (QFlash) from this url:  [https://github.com/1NCE-GmbH/blueprint-freertos/tree/master/Utilities/Modem\_FW](https://github.com/1NCE-GmbH/blueprint-freertos/tree/master/Utilities/Modem_FW) this tools taked from quectel from the web site listed in the official documentation.

## Cloning the Repository

After navigating to your workspace Clone the repository using HTTPS\:

```
$ git clone https://github.com/1NCE-GmbH/blueprint-freertos.git --recurse-submodules

```

Using SSH:

```
$ git clone git@github.com:1NCE-GmbH/blueprint-freertos.git --recurse-submodules
```

If you have downloaded the repo without using the --recurse-submodules argument, you need to run:

```
git submodule update --init --recursive
```

* Import the project in STM32Cube.

## Building Sample

Setup your demo want to use by going to config\_files/aws\_demo\_config.h define one of three demos exist (by default `CONFIG_COAP_DEMO_ENABLED`)

```
CONFIG_COAP_DEMO_ENABLED
CONFIG_UDP_DEMO_ENABLED
CONFIG_LwM2M_DEMO_ENABLED
```

## Sample Demos

### COAP Demo without DTLS

1NCE FreeRTOS BluePrint allows customers to communicate with 1NCE endpoints via CoAP and use of all features as part of the 1NCE OS.

COAP POST request:\
In this Section, the following steps are executed:

* Register to the Network.

* Perform a DNS Resolution.

* Create a socket and connect to Server

* Create Confirmable CoAP POST with Query option

* Create Client Interaction and analyze the response (ACK)

* Validate the response.

* Setup the Demo runner in file (config\_files/aws\_demo\_config.h)

```
#define CONFIG_COAP_DEMO_ENABLED
```

* The onboarding script configuration can be found in blueprint-freertos\\vendors\\st\\boards\\stm32l475\_discovery\\aws\_demos\\config\_files\\nce\_demo\_config.h in the root folder of the blueprint or /aws\_demos/config\_files/nce\_demo\_config.h in IDE.

```
#define PUBLISH_PAYLOAD_FORMAT                   "Welcome to 1NCE's Solution"
#define democonfigCLIENT_ICCID "<ICCID>"
#define COAP_ENDPOINT           "coap.os.1nce.com"
#define configCOAP_PORT         5683
#define democonfigCLIENT_IDENTIFIER    "t=test"
#if ( configCOAP_PORT == 5684 )
  #define ENABLE_DTLS
#endif
/* Enable send the Information to 1NCE's client support */
#if  defined( TROUBLESHOOTING ) && ( configCOAP_PORT == 5684 )
    #ifndef ENABLE_DTLS
        #define ENABLE_DTLS
    #endif
#endif
```

### CoAPs with DTLS

For the DTLS Support the default Port is 5684 and automatically defines the `ENABLE_DTLS` as an additional define

The CoAP DTLS performs 3 main tasks from the [1NCE IoT C SDK](https://github.com/1NCE-GmbH/1nce-iot-c-sdk) :

* Send the Device Authenticator Request
* Get the Response
* Process the Response and give the DTLS identity and PSK to the application code.

### UDP Demo

1NCE FreeRTOS Blueprint allows customers to communicate with 1NCE endpoints via UDP and use all features as part of the 1NCE OS.

* Setup the Demo runner in file (config\_files/aws\_demo\_config.h)

```
#define CONFIG_UDP_DEMO_ENABLED
```

* The onboarding script configuration can be found in blueprint-freertos\\vendors\\st\\boards\\stm32l475\_discovery\\aws\_demos\\config\_files\\nce\_demo\_config.h in the root folder of the blueprint or /aws\_demos/config\_files/nce\_demo\_config.h in IDE.

```
#define UDP_ENDPOINT "udp.os.1nce.com"
#define UDP_PORT 4445
#define CONFIG_NCE_ENERGY_SAVER
//the message you want to publish in IoT Core
#define PUBLISH_PAYLOAD_FORMAT                   "Welcome to 1NCE's Solution"
#define democonfigCLIENT_ICCID "<ICCID>"
```

### LwM2M Demo

The LWM2M support is provided using Eclipse Wakaama library communicating with a Leshan LWM2M server

* Setup the Demo runner in file (config\_files/aws\_demo\_config.h)

```
#define CONFIG_LwM2M_DEMO_ENABLED
```

* The client that has registered on the LwM2M server, can send data by doing the Send operation. More specifically, it is used by the Client to report values for Resources and Resource Instances of known LwM2M Object Instance(s) to the LwM2M Server.\
  To use this feature in our Blueprint: remove/ comment #define LWM2M\_PASSIVE\_REPORTING and define sending object (e.g. /4/0 here). The LWM2M endpoint and the client name can be configured in config\_files/nce\_demo\_config.h as follows:

```
#define LWM2M_ENDPOINT    "lwm2m.os.1nce.com"
#define ENABLE_DTLS
#define LWM2M_CLIENT_MODE
#define LWM2M_BOOTSTRAP
#ifdef ENABLE_DTLS
char lwm2m_psk[30];
char lwm2m_psk_id[30];
#endif
#define LWM2M_SUPPORT_SENML_JSON
#define LWM2M_LITTLE_ENDIAN
#define LWM2M_SUPPORT_TLV
#define LWM2M_COAP_DEFAULT_BLOCK_SIZE 1024
#define LWM2M_VERSION_1_1
#define LWM2M_SINGLE_SERVER_REGISTERATION
//#define LWM2M_PASSIVE_REPORTING
#if defined(LWM2M_PASSIVE_REPORTING)
#define LWM2M_1NCE_LIFETIME   30000
#else
  #define LWM2M_OBJECT_SEND "/4/0"
#endif
```

## Troubleshooting Demo:

> This feature is limited to Users and Accounts who have already accepted our 1NCEOS Addendum to the 1NCE T\&Cs. It is a one-time action per 1NCE Customer Account. Please log into the 1NCE Customer Portal as Owner or Admin, navigate to the 1NCEOS, and accept the Terms. If you don't see anything to accept and get directly to the Dashboard of the 1NCEOS, you are ready to go!
>
> N.B: The SMS and Data Consumed for the Troubleshooting are counted against the Customers own Volume of the SIM Card.

This initial version's main target is to allow customers to connect their Things and automate the network debugging faster and more reliably. This will also reduce the workload on our Customer facing support teams and will also allow us to focus on further common issues.

* Go to config\_files/nce\_demo\_config.h --> enable the flag TROUBLESHOOTING (Troubleshooting Example with/without DTLS in primary Flow and SMS as an alternative)

```
#define COAP_ENDPOINT           "coap.os.1nce.com"
#define configCOAP_PORT         5684
#define democonfigCLIENT_IDENTIFIER    "t=test"
#if ( configCOAP_PORT == 5684 )
  #define ENABLE_DTLS
#endif
/* Enable send the Information to 1NCE's client support */
#define TROUBLESHOOTING
#if  defined( TROUBLESHOOTING ) && ( configCOAP_PORT == 5684 )
    #ifndef ENABLE_DTLS
        #define ENABLE_DTLS
    #endif
#endif
```

* run the demo : the demo will send the information to the coap endpoint as a first step if No ACK comes then an SMS to 1NCE portal with the required pieces of information.

## Primary Case

<img src="/img/1nce-os/1nce-os-sdk-blueprints/sdk-blueprints-freertos/fd91e61-troubleshootingcoap.png" alt="Troubleshooting from the coap endpoint" width="80%" />

## Fallback

<img src="/img/1nce-os/1nce-os-sdk-blueprints/sdk-blueprints-freertos/ddf7711-troubleshootingcoap2.png" alt="Troubleshooting from Portal" width="80%" />

for more information on the troubleshooting

<Table align={["left","left"]}>
  <thead>
    <tr>
      <th>
        Parameter
      </th>

      <th>
        Description
      </th>
    </tr>
  </thead>

  <tbody>
    <tr>
      <td>
        Radio Access Technology
      </td>

      <td>
        * GSM  
        * LTE  
        * CATM1  
        * NBIOT  
        * Otherwise: NULL
      </td>
    </tr>

    <tr>
      <td>
        Public Land Mobile Network (PLMN) information
      </td>

      <td>
        * Mobile Country Code  
        * Mobile Network Code
      </td>
    </tr>

    <tr>
      <td>
        Registered Network (RN)
      </td>

      <td>
        * Registered network operator cell Id.  
        * Registered network operator Location Area Code.  
        * Registered network operator Routing Area Code.  
        * Registered network operator Tracking Area Code.
      </td>
    </tr>

    <tr>
      <td>
        Reject CS ((Circuit Switched) registration status)
      </td>

      <td>
        * : Table 2.  
        * : 0: 3GPP specific Reject Cause. Manufacture specific.   : Circuit Switch Reject cause.
      </td>
    </tr>

    <tr>
      <td>
        Reject PS ((Packet Switched) registration status)
      </td>

      <td>
        * : Table 2.  
        * : 0: 3GPP specific Reject Cause. Manufacture specific.  : Circuit Switch Reject cause.
      </td>
    </tr>

    <tr>
      <td>
        Signal Information
      </td>

      <td>
        * Received Signal Strength Indicator (RSSI) in dBm.  
        * LTE Reference Signal Received Power (RSRP) in dBm  
        * LTE Reference Signal Received Quality (RSRQ) in dB.  
        * LTE Signal to Interference-Noise Ratio in dB.  
        * Bit Error Rate (BER) in 0.01%.  
        * A number between 0 to 5 (both inclusive) indicating signal strength.
      </td>
    </tr>
  </tbody>
</Table>

<p>Table 1. Key Feature of Troubleshooting Message </p>

| Number | description                                                       |
| :----: | :---------------------------------------------------------------- |
|    0   | CELLULAR NETWORK REGISTRATION STATUS NOT REGISTERED NOT SEARCHING |
|    1   | CELLULAR NETWORK REGISTRATION STATUS REGISTERED HOME              |
|    2   | CELLULAR NETWORK REGISTRATION STATUS NOT REGISTERED SEARCHING     |
|    3   | CELLULAR NETWORK REGISTRATION STATUS REGISTRATION DENIED          |
|    4   | CELLULAR NETWORK REGISTRATION STATUS UNKNOWN                      |
|    5   | CELLULAR NETWORK REGISTRATION STATUS REGISTERED ROAMING           |
|    6   | CELLULAR NETWORK REGISTRATION STATUS REGISTERED HOME SMS ONLY     |
|    7   | CELLULAR NETWORK REGISTRATION STATUS REGISTERED ROAMING SMS ONLY  |
|    8   | CELLULAR NETWORK REGISTRATION STATUS ATTACHED EMERG SERVICES ONLY |
|    9   | CELLULAR NETWORK REGISTRATION STATUS MAX                          |

<p>Table 2. Network Registration Status </p>

# Asking for Help

The most effective communication with our team is through GitHub. Simply create a [new issue](https://github.com/1NCE-GmbH/blueprint-freertos/issues/new/choose) and select from a range of templates covering bug reports, feature requests, documentation issue, or Gerneral Question.
