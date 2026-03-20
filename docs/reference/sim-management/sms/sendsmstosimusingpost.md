---
title: Create SMS
description: Create and send a MT-SMS towards a device with a 1NCE SIM.
---
:::info
The _expiry_date_ parameter can be set to a maximum of 7 days in the future. SMS delivery retries follow an exponential backoff pattern up to 24 hours. However, note that if the device performs a location update or sends a “ready for SMS” message, an immediate retry is triggered.

  If an _expiry_date_ is set farther than 7 days (e.g. 10 or 20 years), the system will treat it as 7 days, and the message will expire after that period.
:::
