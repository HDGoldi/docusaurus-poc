---
title: Cloud Integrator
---
<div style={{textAlign: 'center'}}>
<img src="/img/1nce-os/1nce-os-cloud-integrator/d496e66-IoT_Integrator.png" alt="Cloud Integrator as part of the IoT Integrator" width="80%" />
</div>

The Cloud Integrator allows to create, manage and use 1NCE webhooks and direct AWS integrations. This provides the possibility for a customer to forward data from 1NCE services to customer-defined HTTPS endpoints or an AWS account with real-time information. Forwarded data depends on the selected event type.

***



### Event Types

### Telemetry Data

Whenever a message (UDP, CoAP or LwM2M) from a device is sent to the 1NCE OS endpoint(s) the message is forwarded to the customer's Cloud Integrations.

* LwM2M messages are forwarded to customer's Cloud Integrations.
* Traversed UDP and CoAP messages will be forwarded to customer's Cloud Integrations. The forwarded message content depends on the energy saver status for the specific protocol. If the [Energy Saver](/docs/1nce-os/1nce-os-energy-saver/) is not enabled, then message will be forwarded directly, but when enabled, then a processed message will be forwarded.

### Lifecycle Events

This option will forward all the [Lifecycle](/docs/1nce-os/1nce-os-admin-logs/admin-logs-info-category#lifecycle) events from the Info category Admin Logs to the customer's Cloud Integrations.

### Error Events

This option will forward all the Error category Admin Logs to the customer's Cloud Integrations. It also will include [Cloud Integration failure event](/docs/1nce-os/1nce-os-cloud-integrator/cloud-integrator-failure-event)

### Geofence Events

Whenever a geofencing event "EXIT" or "ENTER" has been triggered by device location change the message is forwarded to the customer's Cloud Integrations.

### Location Events

Whenever a device GPS location update has been sent using Energy Saver template or CellTower location event has been triggered, the location update event is forwarded to the customer's Cloud Integrations.

### Test Message

Test Message can be triggered by [Test AWS Integration](ref:post_v1-integrate-clouds-aws-integrationid-test) or [Test Webhook Integration](ref:post_v1-integrate-clouds-webhooks-integrationid-test) endpoints. Test Message will be sent also during integration restart process. Integration restart is being initiated from customer after integration has been set to "INTEGRATION_FAILED".

<table>
  <thead>
    <tr>
      <th>
        :information_source:
      </th>

      <th>
        A comprehensive set of examples for each event type can be found

        [here](/docs/1nce-os/1nce-os-cloud-integrator/cloud-integrator-output-format#examples)

        .
      </th>
    </tr>
  </thead>

  <tbody />
</table>
