---
title: Keen.io Integration
description: Keen.io Integration of the 1NCE Data Streamer.
sidebar_position: 4
---
<div style={{textAlign: 'center'}}>
<img src="/img/blueprints-examples/examples-data-streamer/examples-data-streamer-keen/001.png" alt="" style={{maxWidth: '100%'}} />
</div>

The <a href="https://keen.io/" target="_blank">Keen.io</a> platform is a managed event streaming platform used for streaming, analyzing, and embedding rich data. The 1NCE Data Streamer Service can easily be integrated with this service. The Keen.io integration supports both Event and Usage Records.\
These chapters guides through the initial setup of the Keen.io project, 1NCE Portal Data Streamer configuration and a guide to testing the Keen.io integration.

***

# Keen.io Data Streamer Configuration

For the Keen.io configuration, a account with a new project needs to be setup. Afterwards, the Data Streamer integration in the 1NCE Portal can be setup. The incoming data can be seen on the Keen.io streams tab.

Follow these steps to obtain the needed parameters.

1. Set up an active Keen.io account or use an existing instance.
2. Create a new project within the Keen.io account.
3. Open the project page and go to the **Access Tab** to obtain the **Project ID** and **Write Key** from the newly created project.

<img src="/img/blueprints-examples/examples-data-streamer/examples-data-streamer-keen/9a5fec6-keen_access.png" alt="keen_access.png" width="80%" />

5. Copy & Paste the **Project ID** and **Write Key** to the configuration in the 1NCE Portal.
6. Once setup in the 1NCE Portal, the Event or Usage records of all 1NCE SIMs of the used organization will be provided as Keen.io Streams.
7. Go to the **Streams Tab** of the Keen.io project to see the available streams as a list in the Event Streams window. Please note, SIMs need to generate some recent events to make the Keen.io streams appear for the first time. This may take a while.\
   8.Once the stream integrations show up, the advanced features of Keen.io can be used to create custom Dashboards and Monitoring.

<img src="/img/blueprints-examples/examples-data-streamer/examples-data-streamer-keen/8b017aa-keen_stream.png" alt="keen_stream.png" width="80%" />

***

# 1NCE Portal Keen.io Configuration

After setting up a Keen.io project for the Data Streamer integration, the related parameters need to be configured in the 1NCE Portal. Please note that if both Usage and Event records should be obtained using Keen.io, 1NCE recommends to use two separate project integrations, one for each streamer type. The following parameters need to be setup in the 1NCE Portal.

1. **API Type:** Select keen.io to customize the settings.
2. **Stream Type:** Choose between *Usage Data* and *Event Data* records. If both record types are desired, two separate Data Streams with the different Keen.io projects can be setup. 
3. **Name:** Identification name used in the 1NCE Portal for labeling the specific integration.
4. **Project Key:** The Keen.io Project Key from the newly created project integration.
5. **Write Key:** Write Key from the newly created Keen.io project.
6. **Collection Name:** Name of the collection created in the Kenn.io project.
7. Click **Save** to create the Data Streamer integration.

<img src="/img/blueprints-examples/examples-data-streamer/examples-data-streamer-keen/08497b5-keen_integration_cmp.png" alt="keen_integration_cmp.png" width="80%" />

***

# Keen.io Data Streamer Testing

For testing a Keen.io integration, an IoT or mobile network device (e.g., smartphone) with an active 1NCE SIM has to be used to generate Event and Usage records.

## Event Records

1. Place a 1NCE SIM into an IoT device or any other mobile device. 
2. Ensure that the mobile device allows roaming network and data connections and that the 1NCE APN is setup correctly.
3. The attachment to a mobile network will cause a few Event records to be transmitted over the Data Streamer integration.

## Usage Records

1. Place and configure (roaming, APN, data roaming) the 1NCE SIM in a capable mobile device.
2. For testing the two Usage record types, data and SMS, the following procedures can be executed:

* **SMS usage**: Send a MO-SMS from the SIM device or send a MT-SMS using the SMS Console or API to an active 1NCE SIM.
* **Data usage**: Allow data roaming, configure the APN and create a data session. Smartphones will automatically create a data session. Use some data service (e.g., IMCP Ping, TCP/UDP traffic, open a website). Close the data session by deactivating the PDP session or disconnecting the device from the network.

3. Usage records are only written once the data and SMS volume has been actively used. Ensure that the SMS is finalized and delivered. For data usage, the current data session needs to be closed to get an immediate usage record in the Data Streamer.

***

# Keen.io Results

The incoming events in Keen.io can be viewed in the Streams Tab. Dependent on the configuration, for each received Data Streamer Event and Usage record the raw JSON data can be viewed.

<img src="/img/blueprints-examples/examples-data-streamer/examples-data-streamer-keen/2553597-keen_stream.png" alt="keen_stream.png" width="80%" />
