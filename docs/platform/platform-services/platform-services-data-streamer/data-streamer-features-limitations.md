---
title: Features & Limitations
description: A look into what the 1NCE Data Streamer can and cannot do.
sidebar_position: 1
---
# Features

## Event and Usage Monitoring

With the 1NCE Data Streamer Service, customers can get live-streamed Event and Usage Records for their 1NCE SIM cards. This allows 1NCE customers to monitor the current connectivity status of each SIM individually in near real-time. The Usage Records provide additional insight into the data and SMS volume usage patterns of the connected IoT devices. The data streamer helps 1NCE customers to keep an eye on the IoT connectivity of their devices with a 1NCE SIM card.

## Multi-Target Streaming

The 1NCE Data Streamer Service allows configuring multiple target applications for the same streamed data. This allows the customer to integrate both the Event and Usage Records into multiple data analytics and monitoring systems at once. Each configured receiver will get the latest updates pushed. The individual streams can be configured in the 1NCE Portal under the Configuration Tab. In the Portal, individual data streams can also be paused/resumed, and deleted.

## Data Analytics Platforms

The usage and event stream can be integrated into the most commonly used platforms for data analytics and monitoring. 1NCE provides ready to use integrations for some selected 3rd party platforms. Currently the 1NCE Data Streamer supports the following integrations options:

* <a href="https://keen.io/" target="_blank">Keen.io</a>
* <a href="https://www.datadoghq.com/" target="_blank">DataDog</a>
* <a href="https://aws.amazon.com/de/s3/" target="_blank">AWS S3</a>
* <a href="https://aws.amazon.com/kinesis/" target="_blank">AWS Kinesis</a>

## Custom API Endpoint

In addition to the ready to use 3rd party integrations, 1NCE offers the possibility to integrate an own HTTP Post Endpoint which can be configured to receive the records from the data streamer. Customers can use this integration to include the 1NCE Data Streamer Service into their application or monitoring system of choice.

***

# Limitations

## DataDog Integration

The DataDog integration only provides Data Volume monitoring capabilities. That means only Data Volume in Bytes is reported, and SMS consumption cannot be monitored.
