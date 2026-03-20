---
title: Error States
---
If the configured HTTP endpoint is wrong or the defined server endpoint does not respond with HTTP 200, an error event is generated and pushed via the Data Streamer and the 1NCE Portal. The image below shows two typical error states for the SMS Forwarder.

1. A MO-SMS could not be delivered to the configured HTTP Post endpoint. Please check the customer-side server implementation.
2. A MT-SMS Delivery Report could not be delivered to the configured HTTP Patch endpoint. Verify the customer-side implementation.

Take a look at <a href="examples-sms-forwarder-testing">Testing SMS Forwarder</a> for debugging the custom endpoint. In both cases, the retry mechanism will try to redeliver the forwarded messages for 24 hours. After this timepoint, the messages will be discarded and set to the *Failed* state. If there are any uncertainties or issues during the troubleshooting, feel free to contact the <a href="https://1nce.com/en-eu/support" target="_blank">1NCE Support</a>.

<Image title="SMS_Console_Error.png" alt={1236} align="center" width="80%" border={true} src="/img/platform-services/platform-services-sms-forwarder/sms-forwarder-error-states/138194a-SMS_Console_Error.png">
  SMS Forwarder common Error States.
</Image>
