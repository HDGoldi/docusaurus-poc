---
title: Data Streamer Service
description: Live Event and Usage Feed for 1NCE SIMs.
---
<div style={{textAlign: 'center'}}>
<img src="/img/platform-services/platform-services-data-streamer/001.png" alt="Schematic diagram of the Data Streamer Service structure." style={{maxWidth: '100%'}} />
</div>

Access to the SIM status, events, and usage data is a key factor when it comes to monitoring and debugging IoT-focused systems. This type of data could be queried from the 1NCE API, but this generates a lot of undesired overhead traffic and load. 

The ideal solution for getting 1NCE SIM-related event and usage data as a stream is the 1NCE Data Streamer Service. The Data Streamer Service allows subscribing to real-time Event and Usage Records for all SIM cards. Incoming information is pushed directly to a customer-specified server endpoint with the Rest API integration or an already integrated cloud service such as AWS S3, Kinesis, DataDog, Keen.io, etc.

For more details about this service, refer to the subchapters in the menu on the left side.

In this chapter of the Developer Hub Guide, the Features of the Data Streamer, as well as the Setup possibilities and an overview of the Event and Usage Records are shown.
