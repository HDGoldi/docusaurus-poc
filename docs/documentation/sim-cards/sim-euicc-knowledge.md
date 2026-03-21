---
title: eUICC Knowledge
description: Basics about the eUICC feature knowledge
sidebar_position: 2
---
An eUICC (Embedded Universal Integrated Circuit Card) is a re-programmable SIM card that can be remotely provisioned with different operator connection profiles. This allows users to switch between different carriers without physically changing the SIM card.

Unlike a traditional SIM card, which is tied to a specific carrier plan, an eUICC can be reprogrammed over the air (OTA) with new profiles. It simplifies logistics for device manufacturers and network operators, who no longer need to physically swap SIM cards when activating or switching devices between carrier plans. The following sections will cover the basics of 1NCE eUICC.

***

# Remote SIM Provisioning (RSP)

Remote SIM Provisioning (RSP) in IoT is the process of remotely managing SIM profiles saved on eUICC-capable SIM cards. This includes installation, switching, and deactivation of SIM profiles over-the-air. Before RSP, a change of an operator profile could only be done by physically changing the whole SIM card. With Remote SIM Provisioning, it has become possible to overcome the issues by allowing to add, switch or change a SIM profile remotely over-the-air (OTA).

There is no physical difference between eUICC SIM cards and normal non-eUICC SIM cards. The eUICC SIMs are available as solderable MFF2 or put into the SIM slot when used in removable form factors (2FF, 3FF, 4FF). 

***

# SIM ICCID vs. eID

A physical non-eUICC SIM is typically identified using the ICCID, which is printed on the SIM card or chip. When using eUICC, the ICCID can change dependent on the used profiles, thus the ICCID is no longer a static unique identifier. For eUICC SIMs, the eID, a 32-digit global unique identifier number, is used. It is unique and references the physical hardware SIM chip. The eID can be read by the hardware modem using an AT-Command or manufacturer-specific request. For easier physical identification, each 1NCE IoT SIM has the eID of the particular SIM printed on the physical chip card.

For more information about eID, please, refer to the official [GSMA documentation](https://www.gsma.com/esim/resources/sgp-29-v1-0-eid-definition-and-assignment-process/)

***

# 1NCE RSP Models

1NCE offers three kinds of models, Freedom To Switch, Overtake and Active Model. The differences between these models are explained below.

For any open questions about the eUICC models or more extensive help for the specific application case, feel free to contact us (<a href="<https://www.1nce.com/en-eu/support/contact>" target="_blank">1NCE Contact</a>).

## Freedom To Switch (Insurance)

The insurance model is used when the customer requires a new physical eUICC SIM for their device. The 1NCE IoT SIM has the 1NCE profile stored as default. It works out of the box like the IoT SIM Card Business product, but It is possible to change the SIM profile in the future. These are the eUICC capable SIMs : **IoT SIM Card Industrial** and **IoT SIM Chip Industrial**.

## Overtake or Bring your own eUICC (BYOeUICC)

If the customer already has an eUICC-capable SIM card from another provider and is using their own RSP platform, it is possible to migrate this eUICC SIM from the customer RSP to 1NCE RSP systems and add the 1NCE profile to the existing eUICC compatible SIM. 

1NCE takes over not only the customer connectivity needs but also their eUICC SIMs into the 1NCE RSP platform.

<div style={{textAlign: 'center'}}>
<img src="/img/sim-cards/sim-euicc-knowledge/001.png" alt="" style={{maxWidth: '100%'}} />
</div>

## Active model

1NCE is looking forward to enabling a RSP ecosystem capable of integrating with other RSP platforms (where SIM profiles are stored). These integrations will allow the customer to actively host and switch between 1NCE and other connectivity profiles using the remote SIM provisioning capabilities. These integrations are standardized by the GSMA specifications. 

Once the integrations are in place, customers will be able to download profiles and switch between multiple profiles depending on their use case. 

The active model can be used in the followings scenarios:

1. The customer has an eUICC SIM from another provider and wants to use 1NCE profile for their device.

<div style={{textAlign: 'center'}}>
<img src="/img/sim-cards/sim-euicc-knowledge/002.png" alt="" style={{maxWidth: '100%'}} />
</div>

2. The customer has an eUICC SIM from 1NCE and wants to use another profile from another provider for their device.

<div style={{textAlign: 'center'}}>
<img src="/img/sim-cards/sim-euicc-knowledge/003.png" alt="" style={{maxWidth: '100%'}} />
</div>

# Device Requirements for eUICC-capable IoT SIMs

The GSMA standards require that the device supports some features to enable the eUICC functionality. The minimum requirement is a device that fulfills the needs to enable the use of eUICC functions. Please note these features are mandatory for the eUICC to execute RSP operations only, for example, downloading profile, enabling a profile, deleting a profile, etc. In case your device does not support this, it will still work normally, which means fulfilling all your connectivity needs, but no profile swapping can happen. 

You may find more information about eUICC compatibility, providers, and modules [here](https://1nce.com/en-eu/euicc-sim-card-for-iot-esim/euicc-compatible-iot-hardware).
