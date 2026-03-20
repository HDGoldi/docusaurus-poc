---
title: Test Endpoints
---
## Testing the endpoint

It is possible to test the integration directly in the 1NCE portal. To do so, data should be sent to the desired endpoint:

1. _Test Integration_ should be selected for the desired protocol.
2. Device ID (ICCID) should be provided, from which the data is expected.
3. If required for CoAP & LwM2M, DTLS Pre-Shared Key can be configured in HEX or Plain-text format.
4. After clicking _Test Integration_, portal will wait for data to arrive from the device.
5. If data was sent successfully, a message will be displayed in JSON form for LwM2M messages, or if [Energy Saver Template](doc:1nce-os-energy-saver) is being used for CoAP, UDP. The message will be displayed in base64 format if Energy saver is not being used.

<Image align="center" alt="Test Integration Form for CoAP" border={false} caption="Test Integration Form for CoAP" title="IoT Integrator" src="https://files.readme.io/3f7df7289815cd4b8177d263793abc78a21a305bd53e1bf9350d3e03f9a99eb1-Screenshot_2024-08-28_114733.png" width="80%" />

<Image align="center" alt="Message received" border={false} caption="Message received" title="IoT Integrator" src="https://files.readme.io/f9ceb83e314f207a768769ee1effd209b0641779d7ae8cefc44751c47ec085f9-Screenshot_2024-08-30_101438.png" width="80%" />

### Troubleshooting

Troubleshooting might be required if testing the endpoint fails (i.e., the message is not received).

#### Breakout Region

1NCE OS is currently only available through the Europe (Frankfurt) and US East (N. Virginia) breakout regions.
Please validate that the correct region is selected under Configuration. If the wrong breakout region was being used, select the correct region, and the device should create a new PDP context. A simple way to achieve this is by rebooting the device.

#### Energy Saver

If an invalid [Energy Saver Template](doc:1nce-os-energy-saver) is enabled, data will not be processed.  
Please validate that no errors are found in the [Admin Logs](doc:1nce-os-admin-logs) related to the Energy Saver. If errors from the Energy Saver are found in the Admin Logs, please disable the Energy Saver Template for the protocol and try again.
