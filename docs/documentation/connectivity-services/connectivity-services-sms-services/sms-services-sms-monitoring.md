---
title: SMS Monitoring
description: 'Monitoring, to keeping your SMS messages on track.'
sidebar_position: 4
---
Besides sending and receiving MT-SMS and MO-SMS messages, 1NCE offers additional ways to monitor the flow of messages and retrieve log data. Three options are available to explore and gather data for monitoring purposes: 1NCE Portal, 1NCE Data Streamer Service and 1NCE API. In the following sections, the capabilities and benefits of each available interface is presented.

***

# 1NCE Portal

The 1NCE Portal offers an easy and ready-to-use user interface for monitoring 1NCE services. Regarding SMS services, the overall volume usage and status of messages for each SIM is presented in the portal. Furthermore, the SMS Console offers the functionality to send and receive messages using the web interface. The Event Records from the Data Streamer are listed as part of the user interface. This provides a quick overview of the current events of the 1NCE SIM. Overall the portal offers a good starting point for manual monitoring of small amounts of SIM or easy debugging. The portal offers no automation integration and logging data is deleted after seven days due to the data retention policy. For more details on how to use the 1NCE Portal, please refer to the [My SIMs & SMS Console](/1nce-portal/portal-sims-sms) guide.

***

# Data Streamer

The Data Streamer offers a stream of Event and/or Usage Records via a wide selection of cloud connectivity applications. This service is ideal for long-term, automated monitoring of a large amount of connected SIM. Regarding the SMS services, the message usage volume and event records for the SMS Forwarding Service are included in the Data Streamer. Upon sending or receiving a message a Usage Record entry is sent via the streaming service, showing the used volume for sending a message. The Event Records also log errors from the SMS Forwarding Service. If the provided REST endpoint is not reachable or does not meet the required configuration, a HTTP 500 Error Event will be logged in the Data Streamer. In this case, please verify the configuration and availability of the provided HTTP endpoint. More details are covered in the [Data Streamer Service](/platform-services/platform-services-data-streamer/index) section.

***

# SMS Forwarder

A further source for monitoring of the SMS Service, including Delivery Reports, MT-SMS, MO-SMS messages and status information is available through the SMS Forwarding Service. Please refer to the [SMS Forwarder Service](/platform-services/platform-services-sms-forwarder/index) section for more details.

***

# SMS API

The 1NCE API does not only allow to send SMS messages via HTTP Requests, but also offers endpoints to query information about the SIM and SMS service on demand and set up certain additional parameters. This includes SMS Volume usage and limits, status messages, old messages with payload, etc. Please note that this data for the API will be held at most seven days, due to the data retention policy. The API is ideal for requesting specific debugging information on demand. It is not recommended to use the API for large automated queries on a regular basis, please use the Data Streaming Service for this automation. Details about the API can be found in the [API](https://help.1nce.com/dev-hub/reference) section of the documentation.
