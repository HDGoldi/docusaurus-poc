---
title: Setup Guides
description: Configuring the different Options for receiving the Data Stream.
---
In this chapter, the setup of the 1NCE Data Streamer Service for different cloud integrations will be shown in detail. The 1NCE Data Streamer Service offers the following integrations:

<HTMLBlock>{`
<div class="button-flex-container">
	<div class="button-flex-item">
    <a href="#rest-api---integration">
      	<img src="https://files.readme.io/d47972b-rest_api.svg"></img> 
    </a>
	</div>
<div class="button-flex-item">
  <a href="#keenio---integration">
		<img src="https://files.readme.io/29d6339-keen_io.svg"> </img>
  </a>
	</div>
<div class="button-flex-item">
  <a href="#datadog---integration">
		<img src="https://files.readme.io/720424d-data_dog.svg"> </img>
  </a>
	</div>
<div class="button-flex-item">
  <a href="#s3---integration">
		<img src="https://files.readme.io/7f8d984-aws_s3.svg"> </img>
  </a>
	</div>
<div class="button-flex-item">
  <a href="#kinesis---integration">
		<img src="https://files.readme.io/c2c9384-aws_kinesis.svg"> </img>
  </a>
	</div>
</div>
`}</HTMLBlock>

Click on one of the icons to get to the setup guide for the selected integration.

***

# General Setup Information

## Stream Types

When configuring the 1NCE Data Streamer Service, different Stream Types are selectable. The options can be configured for each Data Streamer setup. It can be selected between either Usage Data or Event Data. A combined stream of Usage and Event Data is not supported and can therefore not be selected in the management portal.

## Warnings & Errors

In the case that there was an error with Data Streamer connection, a warning record with respective error code is shown in the Data Streamer configuration. In this case, please verify that the service is reachable and is set up correctly. The streamer service uses a back off systems design that retries sending data to the desired destination in case of an failure. Please note that after a certain retry count the streamer goes into FAILED state. If the streamer is in the error state, please try to restart or recreate the stream integration in the 1NCE Portal.

## Stream Management

With the 1NCE Data Streamer, it is possible to set up multiple streams with different destinations at once. Each new connection can be configured independently of the others in the 1NCE Portal. A connection can be paused/started or deleted independently of the other setups. To change the configuration of a stream, the old stream has to be deleted and a new stream needs to be set up. Please note that the pausing/starting and creation of a stream can take a few seconds to become active.

***

# REST API - Integration

The REST API connection to the Data Streamer is ideal for custom server application integrations. This method offers the most flexible, custom integration of the Data Streamer Service into existing analytics, reporting, and monitoring pipelines. The REST  API supports both Event and Usage Records.\
The customer server needs to provide an HTTP POST endpoint (see [Endpoint URL](#endpoint-url)). The 1NCE Data Streamer posts a list of events as they occur towards this endpoint.\
As of Version 2.0 of the Data Streamer, events are always provided in BULK mode. Therefore, a list of  JSON Event or Usage Record is delivered to the given Endpoint. Using Bulk mode, each HTTP POST will include an array of objects. The maximum amount of records per sent request is 3000 JSON objects in a list. The POST requests are sent at intervals. The endpoint consumes the HTTP POST by sending the HTTP 200 Code as a response to the incoming request. The Data Streamer does not respond to HTTP redirect codes (3xx).\
The HTTP integration uses a retry mechanism with a backoff policy.  After a given time, the Data Streamer will go into FAILED state and stop delivering events. After the potential error in the HTTP endpoint behavior has been resolved by the customer, the Data Streamer needs to be restarted by the customer.

In the Connectivity Management Platform (CMP), a Basic Authentication Header needs to be set when configuring the REST API integration. This header is of the Base64 format consisting of the `username:password`. The server application endpoint can implement the Basic Authentication Method and only accept incoming requests with the correct header. This offers enhanced security and protection against any requests that do not originate from the 1NCE Data Streamer Service.\
For **testing purposes only**, the Basic Authentication Header value can be set to an arbitrary string and the processing on the server-side can be ignored. We strongly recommend doing this only for **TESTING**. In a production environment, we suggest **ALWAYS** implementing the Basic Authentication Method.

## Endpoint URL

The endpoint URL for the Data Streamer in the CMP needs to be valid. URL with public IP addresses (`https://<server-ip>:<port>/<endpoint>/`) are not supported. Custom ports for the endpoint can be configured via the URL (`https://<server-domain>:<port>/<endpoint>/`). 

## Certificates

The endpoint server needs to have a valid SSL/TLS certificate. A self-signed certificate will not work in this application case. We recommend using [Let's Encrypt](https://letsencrypt.org/de/) certificates. 

## Endpoint Capacity

Be aware that the REST API integration will deliver the incoming events as a list of JSON objects. Dependent on the amount of SIMs and occurred records this request can be quite large. A maximum limit of 3000 records per request is set. 1NCE customers with a large quantity of SIMs and high number of events as such must be aware that their backend system receiving data from the stream needs to have the capacity to handle large incoming requests.

***

# Keen.io - Integration

The <a href="https://keen.io/" target="_blank">Keen.io</a> platform is a managed event streaming platform used for streaming, analyzing, and embedding rich data. The 1NCE Data Streamer Service can easily be integrated with this service. The Keen.io integration supports both Event and Usage Records. The following items are required for the setup process with Keen.io:

* Keen.io Account
* New Keen.io Project
* Project ID Key
* Write Key of the Project
* Collection Name

In the 1NCE Connectivity Management Platform (CMP), select the desired Stream Type and Keen.io as API Type. Enter the Product ID key and the Write Key of the created Keen.io project. Further the Collection Name is needed to indicate where to stream the data to.\
After the Data Stream integration was created, the first data will be arriving at Keen.io. The incoming data can be seen on the streams tab.

***

# DataDog - Integration

<a href="https://www.datadoghq.com/" target="_blank">DataDog</a> is a cloud monitoring service that can be used to monitor the endpoint volume of the 1NCE SIM cards using custom dashboards and trigger events. Please ensure that the region of the used DataDog account matches with the Data Streamer setup fields. To create a DataDog integration, the following is required:

* DataDog Account
* API Integration
* API Key
* DataDog Account Region

For the configuration of the DataDog Data Streamer integration enter the API Key and the account Region in the Connectivity Management Platform configuration. After the stream was created, data will be transferred to DataDog. In the DataDog explorer, the incoming data can be monitored. The following metrics can be viewed in DataDog: endpoint.volume, endpoint.volume\_tx, endpoint.volume\_rx, and endpoint.cost. When selecting the Stream Type, please note that Event Records are currently not available in DataDog.

***

# AWS - Integrations

The 1NCE Data Streamer Service can be integrated with both AWS S3 and AWS Kinesis. AWS Kinesis is ideal for collecting and processing large streamed data records in real-time. AWS S3 is an object-based storage solution. The Data Streamer can push CSV files into a S3 bucket allowing for easy, largescale data collection and further processing later on by related AWS Services.\
Both AWS S3 and Kinesis are integrated using AWS IAM Trust Relationships. The setup of the AWS integration can be done through the Connectivity Management Portal (CMP). 

## S3 - Integration

The S3 integration will provide the Event or Usage Records through an S3 bucket where they are uploaded as CSV files. The CSV filenames for events are `events_YYYYMMDD_HHmmss.csv` and `cdr_YYYYMMDD_HHmmss.csv` for usage records. Each file contains a collection records over a small period. A sample for an event record file type is provided below.

```text cdr_20210512_070123.csv
"id","event_start_timestamp","event_stop_timestamp","organisation_id","organisation_name","endpoint_id","sim_id","iccid","imsi","operator_id","operator_name","country_id","operator_country_name","traffic_type_id","traffic_type_description","volume","volume_tx","volume_rx","cost","currency_id","currency_code","currency_symbol","ratezone_tariff_id","ratezone_tariff_name","ratezone_id","ratezone_name","endpoint_name","endpoint_ip_address","endpoint_tags","endpoint_imei","msisdn_msisdn","sim_production_date","operator_mncs","country_mcc"
"4427264xxx","2021-05-11 11:17:25","2021-05-11 11:19:51","19xxx","8100xxxx","9673xxx","1500xxx","89882806660010xxxxx","9014051010xxxxx","4","EPlus","74","Germany","5","Data","0.000741","0.000395","0.000346","0.0007410000","1","EUR","€","442","1NCE Production 01 - 1Mbps","21xx","Rate Zone 1 (DE)","89882806660010xxxxx","x.x.x.x",,"35933907591xxxxx","8822851010xxxxx","2019-01-21 08:45:01","0x","2xx"
"4427320xxx","2021-05-11 11:17:29","2021-05-11 11:24:56","19xxx","8100xxxx","9673xxx","1500xxx","89882806660010xxxxx","9014051010xxxxx","4","EPlus","74","Germany","5","Data","0.003210","0.001803","0.001407","0.0032100000","1","EUR","€","442","1NCE Production 01 - 1Mbps","21xx","Rate Zone 1 (DE)","89882806660010xxxxx","x.x.x.x",,"35933907591xxxxx","8822851010xxxxx","2019-01-21 08:45:01","0x","2xx"
```

## Cloud Formation Setup

The easiest setup for the stream integration into AWS S3 is by using the Cloud Formation Template via the 1NCE Connectivity Management Portal (CMP). As a reference the used Cloud Formation Template is provided on the <a href="https://github.com/1NCE-GmbH/cfn-templates/tree/main/data-streams-base-stacks" target="_blank">1NCE GitHub</a> page.

**1.** Open the CMP and navigate to *Configuration>Data Streams>Add New Data Stream*.\
**2.** In the popup select AWS S3 as *API Type* and select the desired *Stream Type*.\
**3.** Click on *Create IAM Role* (see Figure below) to open the Cloud Formation Template in a separate window.

<Image title="cmp_popup_ds.png" alt={1920} width="80%" src="https://files.readme.io/2c56973-cmp_popup_ds.png">
  Pop up in the CMP for creating a new Data Streamer integration.
</Image>

**4.** Adapt the CFN Template parameters (Stack Name, S3BucketName). Do NOT change AllowedExternalID and DatastreamerRoleARN.\
**5.** Set the *IAM Creation* checkbox.\
**6.** Execute the CFN Stack by clicking on *Create Stack*.

<Image title="cfn_s3_template.png" alt={1178} width="80%" src="https://files.readme.io/0138a7e-cfn_s3_template.png">
  Cloud Formation Template used to create the AWS IAM permissions and S3 bucket.
</Image>

**7.** Please wait until the Cloud Formation Process has ended and all resources have been created. Once the Cloud Formation Stack has successfully finished, please proceed with the following steps.

<Image title="cfn_complete.png" alt={1236} width="80%" src="https://files.readme.io/a394239-cfn_complete.png">
  Finished Cloud Formation stack execution.
</Image>

**8.** Go to the *Outputs* tab of the created CFN Stack.\
**9.** Copy the shown parameters to the popup in the 1NCE CMP.\
**10.** Click on *Save* in the popup. The Data Streamer integration will be setup. Please not that this might take a few minutes.

<Image title="aws_s3_cfn_cmp.png" alt={1920} width="80%" src="https://files.readme.io/67ecf11-aws_s3_cfn_cmp.png">
  Copy the values from the Options tab of the Cloud Formation Template to the CMP pop up.
</Image>

After completing the steps, the selected record type should show up in the AWS S3 bucket. If there are any issues or problems with the setup, please feel free to contact our support.

## Kinesis - Integration

With the Kinesis integration, Event and Usage Records from the 1NCE Data Streamer are directed to AWS Kinesis for real-time data analytics.

### Cloud Formation Setup - Kinesis

To setup the 1NCE Data Streamer integration with AWS Kinesis, it is recommended to use the Cloud Formation Template provided in the 1NCE Connectivity Management Portal (CMP). As a reference the used Cloud Formation Template is provided on the <a href="https://github.com/1NCE-GmbH/cfn-templates/tree/main/data-streams-base-stacks" target="_blank">1NCE GitHub</a> page.

**1.** Open the CMP and navigate to *Configuration>Data Streams>Add New Data Stream*.\
**2.** In the popup select AWS Kinesis as *API Type* and select the desired *Stream Type*.\
**3.** Click on *Create IAM Role* to open the Cloud Formation Template in a separate window.

<Image title="aws_kinesis_cmp.png" alt={1920} width="80%" src="https://files.readme.io/7ae09fb-aws_kinesis_cmp.png">
  Pop up in the CMP for creating a new Data Streamer integration.
</Image>

**4.** Adapt the CFN Template parameters (Stack Name, KinesisStreamName). Do NOT change AllowedExternalID and DatastreamerRoleARN.\
**5.** Set the *IAM Creation* checkbox.\
**6.** Execute the CFN Stack by clicking on *Create Stack*.

<Image title="aws_kinesis_cfn.png" alt={1178} width="80%" src="https://files.readme.io/d6f5e3a-aws_kinesis_cfn.png">
  Cloud Formation Template used to create the AWS IAM permissions and Kinesis Data Stream.
</Image>

**7.** Please wait until the Cloud Formation Process has ended and all resources have been created. Once the Cloud Formation Stack has successfully finished, please proceed with the following steps.

<Image title="aws_cfn_done.png" alt={1236} width="80%" src="https://files.readme.io/27f986f-aws_cfn_done.png">
  Finished Cloud Formation stack execution.
</Image>

**8.** Go to the *Outputs* tab of the created CFN Stack.\
**9.** Copy the shown parameters to the popup in the 1NCE CMP.\
**10.** Click on *Save* in the popup. The Data Streamer integration will be setup. Please not that this might take a few minutes.

<Image title="aws_kinesis_cfn_cmp.png" alt={1920} width="80%" src="https://files.readme.io/4f535ec-aws_kinesis_cfn_cmp.png">
  Copy the values from the Options tab of the Cloud Formation Template to the CMP pop up.
</Image>

**8.** Go to the *Outputs* tab of the created CFN Stack.\
**9.** Copy the shown parameters to the popup in the 1NCE CMP.\
**10.** Click on *Save* in the popup. The Data Streamer integration will be setup. Please not that this might take a few minutes.

After completing the steps, the selected record type should show up in the AWS Kinesis Stream bucket. Please note that this may take some time and events/usage records need to be generated by the SIMs. If there are any issues or problems with the setup, please feel free to contact our support.
