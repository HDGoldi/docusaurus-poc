---
title: SMS Volume
description: How SMS messages are counted towards the used volume.
---
Dependent on the tariff of the 1NCE SIM, a certain volume of SMS message volume is included. The current state of the volume for each of the SIM can be either viewed in the 1NCE Portal or queried through the [1NCE API](https://help.1nce.com/dev-hub/reference). The following sections will explain what is counted towards the SMS volume usage and list a few example showcases.

***

# SMS Volume Usage

Using a 1NCE SIM and the SMS Service, each MT-SMS and MO-SMS message count towards the used volume. Important to note is that both "sending" and "receiving" SMS messages from the view of a 1NCE SIM card are considered as usage. Delivery retry attempts, Delivery Reports, the SMS Forwarding Service, and SMS API requests are not counted towards the volume. 

MT-SMS that are not successfully delivered to a device will not be billed towards the used SMS volume.

For MO-SMS, the usage is counted even if the SMS Forwarding Service is not configured as the the SMS is still delivered to the 1NCE backend and displayed in the 1NCE Portal for ease of use. Once the SMS volume is used up, no more messages can be sent until the volume is topped up. Trying to send a message if the volume is used up will result in a Warning Event in the Data Streamer.

***

# Self-Set SMS Volume Limits

A customer-specified limit for the MO-/MT-SMS message volume can be set in the 1NCE Portal Configuration tab or through the 1NCE API. This limit applies to the SMS message volume for all SIM in the organization. These limits can be used to restrict the message volume usage per month for the SIMs from the network side. The limits can be set in predetermined steps and will be reset on the first day of each new month.

## Reaching and Resetting the Limit

If a SIM runs into this limitation, an error message will be issued when submitting a new SMS message through the API **Traffic limit of X SMS per month exceeded** or 1NCE Portal **Set monthly limit of SMS exceeded**. To reenable a SIM, please either wait until the volume is reset at the beginning of the month or manually increate the limit via the 1NCE Portal Configuration tab or 1NCE API. Sending a MO-SMS while the MO-SMS message limit is exceeded, will result in the SMS being rejected to the 1NCE Network. This rejection will result in an error return code from the device modem.

> ❗️ Error Warning Exceeded Limit
>
> Using the 1NCE API if the self-set limit is reached **Traffic limit of X SMS per month exceeded** is returned as error. In the 1NCE Portal **Set monthly limit of SMS exceeded** is shown when the SMS limit was reached and a new SMS is issued.\
> For **MO-SMS** no notification will be shown in the 1NCE Portal or Data Stream. The SMS will be rejected by the network resulting in an error return code from the device modem.

***

# Example SMS Usage Scenarios

## One MT/MO-SMS

Sending **one** MT-SMS or MO-SMS will charge **one** SMS towards the included volume.

## MT-SMS with MO-SMS Answer

The customer sends one MT-SMS via the 1NCE API towards the device, and the device responds with a MO-SMS back towards the customer. In this case, **one** MT-SMS and **one** MO-SMS are sent, resulting in a volume deduction of **two** SMS messages.
