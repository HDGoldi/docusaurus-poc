---
title: Features & Limitations
sidebar_position: 1
---
# Features

* Sending messages to IoT devices using UDP, CoAP and LwM2M.
* Message for single device and [bulk devices](/docs/1nce-os/1nce-os-device-controller/device-controller-api#bulk-request) are supported.
* Schedule message to be send when we receive a message from the device or on LwM2M registration and update events (requestMode `SEND_WHEN_ACTIVE`)
* Cross-protocol trigger: sending a message from the device with any protocol to the 1NCE OS endpoint will trigger sending scheduled messages for all protocols to the device
* Possibility to cancel a scheduled request
* Possibility to cancel all scheduled requests for a device
* See the response from the device for CoAP and LwM2M
* Possibility to configure [retries](/docs/1nce-os/1nce-os-device-controller/device-controller-api#retry-mechanism) for scheduled CoAP or LwM2M messages.
* Track the status of action requests. Available values:
  * `SCHEDULED`: the request was created with requestMode `SEND_WHEN_ACTIVE`. The request hasn't been sent to device and is still pending for a trigger to occur.
  * `IN_PROGRESS`: the request was created with requestMode `SEND_NOW`, or was scheduled and a trigger occurred
  * `SUCCEEDED`: device responded with 2.xx response code via CoAP or LwM2M. Or message was sent via UDP (there's no validation a message via UDP was received).
  * `FAILED`: device responded with 4.xx or 5.xx response code via CoAP or LwM2M. Or an unexpected error occurred. Check the `resultData` of the request for more details. Only for CoAP, if the actual response data fails to be saved (e.g. malformed payload), then the Action request finishes with a `FAILED` state.
  * `CANCELLED`: a scheduled request was cancelled via the DELETE endpoints of our API

<div style={{textAlign: 'center'}}>
<img src="/img/1nce-os/1nce-os-device-controller/device-controller-features-limitations/001.png" alt="Action request lifecycle" style={{maxWidth: '100%'}} />
</div>

***

# Limitations

:::warning
For CoAP Actions the device should send ACK to Device Controller IP from which the message was received **instead of sending ACK to[CoAP Server](/docs/1nce-os/1nce-os-device-integrator/device-integrator-coap)**
:::


* A maximum of 10 Messages can be scheduled per device
* Maximum 100 devices are allowed to be selected for each request
* Scheduled messages (requestMode `SEND_WHEN_ACTIVE`) are expired and sent to `FAILED` status if not triggered during 24 hours
* Requests will be deleted 7 days after the creation date, independent of the status of the request.
* A maximum UDP payload size of 508 bytes
* A maximum CoAP payload size of 1024 bytes
* CoAP DTLS is currently not supported
* The maximum number of send attempts for SEND_WHEN_ACTIVE requests is 5.
* For CoAP Actions only, the response body (if available) will be visible as either a plain string or a Base64 encoded value, depending on the Content-Format of the response. If no Content-Format is provided, then Base64 is the default one.
* According to [RFC7252 section 4.8](https://www.rfc-editor.org/rfc/rfc7252.html#section-4.8), the end timeout for a CoAP message with default retransmission (maximum 4 retransmits) and exponential backoff can range from approximately 62 to 93 seconds.
* To successfully reach device from 1NCE OS, ensure that the account is configured with the appropriate allowed Breakout network settings, which currently include Europe (Frankfurt) and US East (N. Virginia). For more details, see [Internet Breakout](/docs/network-services/network-services-internet-breakout)
