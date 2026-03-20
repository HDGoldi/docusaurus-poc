---
title: Data Visualization Plugin by Datacake
description: Visualize device and network data in pre-made or custom dashboards
---
## Description

Elevate your IoT experience with the Datacake Plugin, a one-click solution that effortlessly connects the Datacake IoT platform with 1NCE OS. This intuitive plugin automatically lists devices operating on 1NCE OS within Datacake, streamlining device management.

Adding a device is as simple as a click, unlocking a suite of features including pre-set dashboards for real-time monitoring and analysis. Designed for efficiency and ease of use, the Datacake Plugin is the ideal tool for enhancing your IoT ecosystem.

## Pricing

1NCE Plugins allow you to start at no cost. Data Visualization plugin by Datacake comes with a free trial plan for up to 5 devices. You can increase the number of devices and unlock more features and benefits by selecting the right [plan](https://datacake.co/pricing) for your business.

## Start Using

To start using the 1NCE OS Plugin with Datacake you first need to Add a Device on the Datacake side. For that, please refer to [1NCE OS in Datacake](https://docs.datacake.de/integrations/1nce-os). Starting from the main page of Datacake, choose _+ Add Device_ under _Devices_ in the left menu, then _Connect 1NCE Devices_. **Keep the Workspace ID because it is necessary for creating the plugin in 1NCE OS system**.

<Image align="center" alt="1NCE in Datacake" border={false} caption="1NCE in Datacake" src="/img/1nce-os/1nce-os-plugins/1nce-os-plugins-data-visualization-datacake/273a0a1-datacake.png" width="60% " />

<Image align="center" alt="Workspace ID in Datacake" border={false} caption="Workspace ID in Datacake" src="/img/1nce-os/1nce-os-plugins/1nce-os-plugins-data-visualization-datacake/668208b-Datacake_worskpace_id.png" width="60% " />

To finish the configuration in 1NCE OS you can choose one of the two options described below. After configuration is done for 1NCE OS and data flow is enabled devices should be automatically available on datacake to be configured.

> :warning: Please note that by installing this plugin, you are aware that **Data from any device is shared with Datacake, regardless of whether it is configured on Datacake or not**.

# Datacake Plugin Installation via Frontend

## Plugin Installation

Plugin can be installed in [1NCE OS](https://portal.1nce.com/portal/customer/1nceos) portal "Plugins" tab by choosing "Datacake".

<Image align="center" alt="Datacake Plugin" border={false} caption="Datacake Plugin" src="/img/1nce-os/1nce-os-plugins/1nce-os-plugins-data-visualization-datacake/63a764e-datacake_plugin.png" width="35% " />

To install a Datacake Plugin you should provide the Workspace Id from Datacake.

<Image align="center" alt="Datacake plugin installation" border={false} caption="Datacake plugin installation" src="/img/1nce-os/1nce-os-plugins/1nce-os-plugins-data-visualization-datacake/2376da8-datacake_plugin_configuration.png" width="70%" />

# Datacake plugin installation via API

## Plugin Installation

The Datacake plugin can be created via `partners` API by using "DATACAKE" partner in the [API Explorer](ref:api-welcome). Only workspaceId from Datacake should be added to the request body.

Example:

```curl
curl --location --request POST 'https://api.1nce.com/management-api/v1/partners/DATACAKE/plugins' \
--header 'Authorization: Bearer <TOKEN>' \
--header 'Content-Type: application/json' \
--data-raw '{
    "workspaceId":   "00000000-0000-0000-0000-000000000000"
}'
```

## Plugin failure event

There is possibility that data forwarding from the 1NCEOS to the Datacake system can fail due to misconfiguration or temporary downtime.
In that case you will see following `Error` Admin Log:

<Image align="center" alt="Plugin Disabled Admin Log" border={false} src="/img/1nce-os/1nce-os-plugins/1nce-os-plugins-data-visualization-datacake/7bd12ee9f260d947df314633b82efd787f5b51857fd9343acfbc59d47af48305-7198c16f848b179a6f822e883917d9ca2e4712a66e52131b329a89a550482c02-plugin_admin_log_1.png" />

You can use similar approach to the [Cloud Integrations failure monitoring](doc:cloud-integrator-failure-event#cloud-integrations-failure-monitoring) , only for Plugins Cloud Integrator `Error` event will be following:

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

## Integration Restart, Get or Uninstall endpoints

To restart, get, or uninstall your Datacake integration via API, you can use the same endpoints you would use for a generic Plugin described in the [API Explorer](ref:api-welcome).

# Outcome of successful configuration

If the configuration is completed in Datacake dashboards for the device fleet can be created for data visualization.

<Image align="center" alt="Device fleet in Datacake" border={false} caption="Device fleet in Datacake" src="/img/1nce-os/1nce-os-plugins/1nce-os-plugins-data-visualization-datacake/001d721-datacake_data_fleet.png" width="85%" />

<Image align="center" alt="Datacake dashaboard" border={false} caption="Datacake dashboard" src="/img/1nce-os/1nce-os-plugins/1nce-os-plugins-data-visualization-datacake/b442ade-Datacake_dashboards.png" width="70%" />
