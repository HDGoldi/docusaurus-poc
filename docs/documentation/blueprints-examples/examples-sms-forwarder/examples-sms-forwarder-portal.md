---
title: 1NCE Portal Configuration
description: Setting the Forwarder URL in the 1NCE Portal.
sidebar_position: 1
---
The SMS Forwarder settings can be found in the 1NCE Portal within the Configuration Tab. To receive the MO/MT-SMS events from the SMS Forwarder, a custom endpoint URL (`https://<server-domain>:<port>/<endpoint>/`) of the receiving server needs to be configured in the 1NCE Portal. Custom ports for the endpoint can be configured via `https://<server-domain>:<port>/<endpoint>/`.

Once the settings have been saved, the MO-SMS and DLR will be forwarded to the provided server URL. The configured endpoint can be edited at any point. To delete the configuration just leave the URL field empty and save the configuration.

<img src="/img/blueprints-examples/examples-sms-forwarder/examples-sms-forwarder-portal/a4ae561-1NCE_SMS_Forwarder.PNG" alt="1NCE_SMS_Forwarder.PNG" width="80%" />
