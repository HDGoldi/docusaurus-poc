---
title: Dashboard
description: SIM Status Overview of the 1NCE Organization.
---
After logging into to the 1NCE Customer Portal, an overview Dashboard is presented. The page shows the current SIM status, volume usage and a current order overview from the organization.

<Image title="1NCE_Portal_Dashboard.png" alt={2532} width="80%" src="/img/1nce-portal/portal-dashboard/38ec2f5-1NCE_Portal_Dashboard.png">
  Overview of the 1NCE Customer Portal Dashboard.
</Image>

***

# SIM Status

The "SIM Status" tile shows the current percentage of 1NCE SIMs that are activated and deactivated. SIMs can be (de-)activated by the customer to disable/enable the SIM specific connectivity. This process can be done via the 1NCE Portal or the 1NCE API.

***

# Data Volume & Usage

Regarding the data volume and usage, two tiles are presented in the dashboard. Details about the SIM specific quota and usage can be viewed in the "My SIMs" tab.

The "Data Volume" tile shows the amount of SIMs with sufficient volume (greater 20%), low volume (less than 20%), and no volume. SIM Cards with sufficient or low volume still operate as expected, but an eye should be kept on SIMs with low volume. SIMs with the status "No Volume" have exceeded the purchased volume and have been blocked from accessing the data connection. These SIMs need to be topped up to receive new data volume credits. They can still connect to the network and send/receive SMS if sufficient SMS volume is present.

The overall data usage of the organization is shown in the "Data Usage" plot. This plot shows the accumulated weekly volume in megabytes used over the last eight weeks. For more detailed usage records, the 1NCE API or 1NCE Data Streamer integration can be used.

***

# SMS Volume & Usage

Similar to the data volume and usage, two tiles for the SMS volume and usage are presented in the dashboard. Details for specific SIMs can be accessed via the "My SIMs" page.

The SMS volume tile shows the amount of SIMs with sufficient volume (more than 20%), low volume (less than 20%), and no volume. Once a SIM has no SMS volume left, the data services can still be used but no further SMS can be sent or received. The SIM needs to be topped up to receive new SMS credits.

The SMS usage is shown in a plot accumulated weekly for the last eight weeks. For more detailed usage records, the 1NCE API or 1NCE Data Streamer integration can be used.

***

# Latest Orders

In the "Latest Orders" tile, the past five orders with date and order ID references are shown in a quick access table. More information about the last orders can be accessed via the "Details" button. A new order can be directly triggered with the "Reorder" button.
