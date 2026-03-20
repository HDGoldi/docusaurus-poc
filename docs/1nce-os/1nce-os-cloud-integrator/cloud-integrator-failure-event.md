---
title: Cloud Integration failure event
---
## Cloud Integrations failure causes

Cloud Integrator service automatically sets customer's AWS or Webhook integrations into the `Failed` state after 5 failed attempts to forward customer message to the AWS or Webhook integration. If integration is set to `Failed` state - an [Admin Log](/1nce-os/1nce-os-admin-logs/index)  will be generated.
Here are some possible failure reasons:

* Webhook Integration:
      - if customer's Webhook destination endpoint is not reachable.
      - does not return response in 20 seconds.
      - HTTPS endpoint for some reason starts returning non 2xx response.
  * AWS IoT Core Integration:
        - AWS IoT Core outage in the destination AWS Region.
        - misconfiguration in the customer's AWS Account.

## Cloud Integrations failure monitoring


To prevent cases when customer Cloud Integration suddenly gets into the `Failed` state and customer does not notices it for some time, there is possibility to subscribe to `Error` type Admin Logs.
It can be done using separate dedicated Webhook or AWS Cloud Integration, where customer can filter out Error events with the type `CloudIntegrator[IntegrationDisabled]`.

<br />

Following `Error` Cloud Integrator event will be generated with the integration id and name in the `description` field:

```json
{
  "received": "1762351834991",
  "id": "1-690b5ada-31707a98fb4bf676304a55e2",
  "type": "ERROR",
  "error": {
    "payloadExists": false,
    "description": "Integration with ID C-_wsByVWIW8PCq4OI82C and name \"Broken_Webhook\" was disabled due to consecutive failed requests. Please review affected integration details in Cloud Integrator.",
    "id": "353vzrcOpHi4YYbyl0bVYlwURAU",
    "type": "INTEGRATION",
    "message": "CloudIntegrator[IntegrationDisabled]"
  },
  "version": "1.0.0"
}
```

<br />

Also on the 1NCEOS frontend page you will see following Admin Log:

<div style={{textAlign: 'center'}}>
![](/img/1nce-os/1nce-os-cloud-integrator/cloud-integrator-failure-event/98039df5e2dab3d5d0f52b2bd73e62797ce2eaa717d588acc37074dd9c6fdce9-175c310b1a02fb6fda273021e02f7d64152d3ab485c04f7f16cd7a1c71b2af14-integration_admin_log.png)
</div>

*Integration Failed Admin Log*

Following steps should be executed:

* Create a dedicated HTTPS endpoint or a separate AWS Account (or region) with AWS IoT Core enabled for monitoring.
  * Create either Webhook or AWS Integration with only `Error` events type selected.
    * Implement filtering logic by `type` field on that new Cloud Integration to get notifications in case if type is equal to `CloudIntegrator[IntegrationDisabled]`.

## Restart process


In case if it happens customer have to execute following steps:

* Check Webhook's HTTPS endpoint or AWS IoT Core configuration in your's AWS Account for any possible reasons why those can return errors. 
  * Trigger restart using one of the possible approaches:
        - Using following [Restart AWS Integration](https://help.1nce.com/dev-hub/reference/post_v1-integrate-clouds-aws-integrationid-restart)  or [Restart Webhook Integration](https://help.1nce.com/dev-hub/reference/post_v1-integrate-clouds-webhooks-integrationid-restart)  API endpoints. 
        - Restart also can be triggered in the 1NCEOS Cloud Integrator frontend page, see [Restart AWS Integration](/1nce-os/1nce-os-cloud-integrator/cloud-integrator-aws-configuration#restart-aws-integration)
