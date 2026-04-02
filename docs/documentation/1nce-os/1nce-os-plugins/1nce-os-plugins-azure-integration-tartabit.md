---
title: Azure Integration Plugin by Tartabit
description: Integration into Azure and other cloud services
sidebar_position: 4
---
## Description

Tartabit IoT Bridge 1NCE OS Plugin swiftly integrates LPWAN devices provisioned on the 1NCE network and 1NCE OS, with customer applications running on major cloud platforms like Azure, AWS, and GCP. IoT Bridge ensures seamless connectivity via a low/no-code environment, enabling rapid deployment of production-grade IoT solutions. IoT Bridge alleviates the need to host custom servers and self-managed infrastructure.

Service integrations include:  
**Azure** - IoT Hub, IoT Central, Digital Twin, CosmosDB, Data Explorer, Event Hub, Service Bus, Log Analytics, SQL, Maps  
**AWS** - IoT Core, Kinesis, Firehose, SQS, DocumentDB, DynamoDB, RDS  
**GCP** - Pub/Sub, Firebase, Cloud SQL, Maps  
**Open-source** - Kafka, AMQP, RabbitMQ, MQTT, webhooks

Bottom line, if you are trying to build a world class Internet of Things solution based on LWPAN technologies then IoT Bridge, the industry’s easiest to use, easiest to buy, and easiest to deploy cloud gateway, will accelerate your time to market and reduce your development costs.

## Pricing

1NCE Plugins allow you to start at no cost. Azure Integration plugin by Tartabit provides a 1 month free trial plan. To continue with more features and benefits, please visit the Azure Marketplace and select the right [plan](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/tartabitllc1600893492587.tartabit-iot-bridge?tab=PlansAndPrice) for your business.

## Start Using

To start using the 1NCE OS Plugin with Tartabit IoT Bridge you first need to create the service in Tartabit side. For that, please refer to [HTTP Connector](https://docs.tartabit.com/en/Topics/HTTP-Connector). Starting from the main page of Tartabit IoT Bridge, choose _List_ under _Services_ in the left menu, then _New Service_ and finally complete the form for a **HTTP Connector** Service Model. Only Service name, key and model are required. **Keep the Webhook Secret because it is necessary for creating the plugin in 1NCE OS system**.

To finish the configuration in 1NCE OS you can choose one of the two options described below.

:::warning
Please note that by installing this plugin, you are aware that **Data from any device is shared with Tartabit, regardless of whether it is configured on Tartabit or not**.
:::


# Tartabit Plugin Installation via Frontend

## Plugin Installation

Plugin can be installed in [1NCE OS](https://portal.1nce.com/portal/customer/1nceos) portal "Plugins" tab by choosing "Tartabit".

<div style={{textAlign: 'center'}}>
![Tartabit Plugin](/img/1nce-os/1nce-os-plugins/1nce-os-plugins-azure-integration-tartabit/5820f3a-Plugins_new_icon.png)
</div>

To install a Tartabit Plugin you should provide both Webhook Secret and the Server Domain from Tartabit.

<div style={{textAlign: 'center'}}>
<img src="/img/1nce-os/1nce-os-plugins/1nce-os-plugins-azure-integration-tartabit/0ce22dc-Plugins_new_installation.png" alt="Tartabit plugin installation" width="70%" />
</div>

# Tartabit plugin installation via API

## Plugin Installation

The Tartabit plugin can be created via the `partners` API by using "TARTABIT" partner in the [API Explorer](ref:api-welcome). Both the Webhook Secret and the Server Domain from Tartabit should be added to the request body.

Example:

```curl
curl --location --request POST 'https://api.1nce.com/management-api/v1/partners/TARTABIT/plugins' \
--header 'Authorization: Bearer <TOKEN>' \
--header 'Content-Type: application/json' \
--data-raw '{
    "serverDomain":   "bridge-us.tartabit.com",
    "webhookKey":  "secretKey"
}'
```

<br />

## Plugin failure event

There is possibility that data forwarding from the 1NCEOS to the Tartabit system can fail due to misconfiguration or temporary downtime. In that case you will see following `Error` Admin Log:

<div style={{textAlign: 'center'}}>
![Plugin Disabled Admin Log](/img/1nce-os/1nce-os-plugins/1nce-os-plugins-azure-integration-tartabit/ebc861c3f93b3d89e11ff12f2d065b48fb64c09fa2ff469918850b4df6c86dc6-7198c16f848b179a6f822e883917d9ca2e4712a66e52131b329a89a550482c02-plugin_admin_log.png)
</div>

You can use similar approach to the [Cloud Integrations failure monitoring](/1nce-os/1nce-os-cloud-integrator/cloud-integrator-failure-event#cloud-integrations-failure-monitoring) , only for Plugins Cloud Integrator `Error` event will be following:

```json
{
  "received": "1762419188874",
  "id": "1-690c61f4-e57d85442c1fee9340783e17",
  "type": "ERROR",
  "error": {
    "payloadExists": false,
    "description": "One of your plugins has failed. Please check the plugins section of 1NCE OS",
    "id": "3568Vyh2vh2uCIcFrrMyv6xRoIf",
    "type": "INTEGRATION",
    "message": "CloudIntegrator[PluginDisabled]"
  },
  "version": "1.0.0"
}
```

In such cases you should investigate if Tartabit system is working fine and if everything is fine trigger plugin Restart using [Restart a failed plugin by installation ID](/api/1nce-os/restart-a-failed-plugin-by-installation-id/)  API endpoint or in the Frontend Tartabit plugin details page.

## Integration Restart, Get or Uninstall endpoints

To restart, get, or uninstall your Tartabit integration via API, you can use the same endpoints you would use for a generic Plugin described in the [API Explorer](ref:api-welcome).

# Outcome of successful configuration

## Services List

If the configuration is successful, events should appear in the Tartabit services list history.

<div style={{textAlign: 'center'}}>
<img src="/img/1nce-os/1nce-os-plugins/1nce-os-plugins-azure-integration-tartabit/3e79716-tartabit_services.png" alt="Services List" width="85%" />
</div>

## Event viewer

All event details can be found under Triggers/Event Viewer.

<div style={{textAlign: 'center'}}>
<img src="/img/1nce-os/1nce-os-plugins/1nce-os-plugins-azure-integration-tartabit/68da402-tartabit_event_viewert.png" alt="Event viewer" width="90%" />
</div>
