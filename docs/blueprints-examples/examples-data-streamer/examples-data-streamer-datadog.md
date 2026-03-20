---
title: DataDog Integration
description: Integrating DataDog with the 1NCE Data Streamer.
---
<HTMLBlock>{`
<center><img src="/img/blueprints-examples/examples-data-streamer/examples-data-streamer-datadog/001.png" style="cursor:pointer;max-width:100%;" onclick="(function(img){if(img.wnd!=null&&!img.wnd.closed){img.wnd.focus();}else{var r=function(evt){if(evt.data=='ready'&&evt.source==img.wnd){img.wnd.postMessage(decodeURIComponent(img.getAttribute('src')),'*');window.removeEventListener('message',r);}};window.addEventListener('message',r);img.wnd=window.open('https://viewer.diagrams.net/?client=1&page=0&edit=_blank');}})(this);"/></center>
`}</HTMLBlock>

<a href="https://www.datadoghq.com/" target="_blank">DataDog</a> is a cloud monitoring service that can be used to monitor the endpoint volume (Usage records) of the 1NCE SIM cards using custom dashboards and trigger events. The following metrics can be viewed in DataDog: endpoint.volume, endpoint.volume\_tx, endpoint.volume\_rx, and endpoint.cost.

***

# DataDog Data Streamer Setup

For the DataDog Data Streamer configuration, a account with a new API Key needs to be setup. Afterwards, the Data Streamer integration in the 1NCE Portal can be setup. The incoming usage records can be seen on the DataDog Metrics Explorer. Follow these steps to obtain the needed parameters for the 1NCE Portal configuration.

> 📘 DataDog Regions
>
> Please note that only the DataDog Account Regions US, US3, EU, US1FED are available for the 1NCE Data Streamer integration.

1. Setup a **DataDog Account** in one of the supported regions.
2. Go to the **Organization Settings** on the main screen by clicking on the **User Profile**.
3. Select **API Keys** from the settings menu.
4. Click **New Key** in the top right to create a new API Key.

<Image title="DataDog_Configuration_01.png" alt={1255} align="center" width="80%" border={true} src="/img/blueprints-examples/examples-data-streamer/examples-data-streamer-datadog/b1e2c9f-DataDog_Configuration_01.png">
  Go to the Organization Settings, API Keys and add a new API Key.
</Image>

5. Provide a **Name** for the API Key.
6. Click **Generate Key** to issue a new API Key.

<Image title="DataDog_Configuration_02.png" alt={529} align="center" width="80%" border={true} src="/img/blueprints-examples/examples-data-streamer/examples-data-streamer-datadog/392dfc2-DataDog_Configuration_02.png">
  Name the new API Key.
</Image>

7. The next window will show the **Key ID** and the **API Key**.
8. The Key ID is a unique identifier for the API Key and should not be confused with the actual (API) Key.
9. Click **Copy Key** to copy the API Key.

<Image title="DataDog_Configuration_03.png" alt={526} align="center" width="80%" border={true} src="/img/blueprints-examples/examples-data-streamer/examples-data-streamer-datadog/e5f5329-DataDog_Configuration_03.png">
  Copy the API Key, the Key ID is used to identify the API Key.
</Image>

10. On the overview page, all API Keys are listed. By clicking on a Key, details of the specific API Key are shown.
11. From there the API Key can be copied or revoked.

<Image title="DataDog_Configuration_04.png" alt={528} align="center" width="80%" border={true} src="/img/blueprints-examples/examples-data-streamer/examples-data-streamer-datadog/1f3d255-DataDog_Configuration_04.png">
  Details about the created API key.
</Image>

12. Copy & Paste the **API Key** to the configuration in the 1NCE Portal.
13. Once setup in the 1NCE Portal, the Usage records of all 1NCE SIMs of the used organization will be provided to DataDog.
14. Go to **Metrics > Summary** of the DataDog project to see the available streams. Please note, SIMs need to generate some recent usage events to make the DataDog integration appear for the first time.

<Image title="DataDog_Configuration_05.png" alt={1458} align="center" width="80%" border={true} src="/img/blueprints-examples/examples-data-streamer/examples-data-streamer-datadog/85f1650-DataDog_Configuration_05.png">
  Metric Summary with Usage Records data.
</Image>

***

# 1NCE Portal DataDog Configuration

For setting up a DataDog Data Streamer integration in the 1NCE Portal, the DataDog API Key and the Region of the used DataDog Account is needed. As Stream Type only Usage Data should be used as Event records are not supported by DataDog.

* **API Type:** Select DataDog to customize the settings.
* **Stream Type:** Choose *Usage Data* records as Events are not supported in DataDog.
* **Name:** Identification name used in the Connectivity Management Platform for labeling the specific integration.
* **API Key:** The API Key created in the DataDog settings.
* **Region:** Region of the DataDog Account.
* Click **Save** to create the Data Streamer integration.

<Image title="datadog_integration_cmp.png" alt={1126} align="center" src="/img/blueprints-examples/examples-data-streamer/examples-data-streamer-datadog/a6cdbb1-datadog_integration_cmp.png">
  DataDog Data Streamer setup in the 1NCE Portal.
</Image>

***

# DataDog Streamer Testing

For testing a DataDog integration, an IoT or mobile network device (e.g., smartphone) with an active 1NCE SIM has to be used to generate Usage records. Please note that DataDog only supports Usage Records. Therefore, the Data Service has to be used to generate some usage.

## Usage Records

1. Place and configure (roaming, APN, data roaming) the 1NCE SIM in a capable mobile device.
2. For testing the Usage records the following procedures can be executed:

* **Data usage**: Allow data roaming, configure the APN and create a data session. Smartphones will automatically create a data session. Use some data service (e.g., IMCP Ping, TCP/UDP traffic, open a website). Close the data session by deactivating the PDP session or disconnecting the device from the network.

3. Usage records are only written once the data volume has been actively used. For data usage, the current data session needs to be closed to get an immediate usage record in the Data Streamer.

## DataDog Results

The incoming events in DataDog can be viewed in the Metrics Summary. All Usage Records of the 1NCE SIMs in the organization account will be forwarded to DataDog.

<Image title="DataDog_Configuration_05.png" alt={1458} align="center" width="80%" border={true} src="/img/blueprints-examples/examples-data-streamer/examples-data-streamer-datadog/4537f00-DataDog_Configuration_05.png">
  Metrics Summary showing the usage records of a 1NCE SIM.
</Image>
