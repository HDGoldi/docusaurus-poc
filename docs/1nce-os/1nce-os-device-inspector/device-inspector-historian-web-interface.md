---
title: Historian Web Interface
---
To see the Data Historian in the [1NCE OS](https://portal.1nce.com/portal/customer/1nceos), open the Device Inspector and select a device.

The device History is presented like this chart:

<Image title="aefd53d-QlETndgH.png" alt={1249} width="80%" src="https://files.readme.io/fd17328-device_history_1_day.png">
  Device History screen for the last day.
</Image>

On the horizontal axis, we can see the dates or hours, depending on if we selected the last day or the last 7 days. On the vertical axis, there is the total message amount per day/hour. The bars are split into multiple colored sections. Each section represents message count by a specific source protocol (UDP, CoAP, or LwM2M). The user can toggle protocols shown by clicking on the protocol labels under the chart.

In the picture above we have the last 1 day selected. At 11 AM, there were 3 CoAP messages and 4 LwM2M messages sent by this device. To see the message payload details, click on the colored bar. In the picture above, we clicked on the last green bar representing the UDP source. It’s the only UDP message that was sent at 3:45:57 PM and its payload is visible and can be quickly copied by clicking on the button. In case of multiple messages, we can circle through individual payloads by clicking the “Previous“ and ”Next” buttons.\
By default, the portal tries to convert Base64 messages to JSON format. If the received content is not valid JSON, the portal will display the original message as Base64. If the user has enabled the **energy saver** feature with a valid template for transforming payload into JSON, the portal will display message as a JSON and, if the message is not tranformable with the existing **energy saver** template, there will be an admin log created with the error message.

As mentioned, we can see the messages statistics of the last 7 days as well when we change the period selector above the chart:

<Image title="fa17240-cU0kR63Z.png" alt={1245} width="80%" src="https://files.readme.io/7fd4fb5-device_history_7_days.png">
  Device History screen for last 7 days.
</Image>
