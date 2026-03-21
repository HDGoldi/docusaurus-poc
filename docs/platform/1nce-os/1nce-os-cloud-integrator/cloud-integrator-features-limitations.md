---
title: Features & Limitations
sidebar_position: 1
---
# Features

* Receiving LwM2M messages to clients endpoint.
* Receiving traversed UDP and CoAP messages to clients endpoint.
* In total, there will be five attempts to send the message via Webhook or to AWS with an exponential retry policy (150s, 180s, 420s, 1020s).
* Own headers can be specified for webhooks.
* Device metadata can be injected in the Webhook's URL and headers. See more details [here](/1nce-os/1nce-os-cloud-integrator/cloud-integrator-webhook-configuration#metadata-injection-in-webhook-definitions).
* Integrations can be tested by sending TEST_MESSAGE [event type](/1nce-os/1nce-os-cloud-integrator/cloud-integrator-output-format). This can be done by using [Test AWS Integration](ref:post_v1-integrate-clouds-aws-integrationid-test) or [Test Webhook Integration](ref:post_v1-integrate-clouds-webhooks-integrationid-test) endpoints.
* The "First Successful Message Delivery" timestamp reflects the time of the first successful message sent to the Integration by device after this Integration was created.
* In case of Cloud Integration Failure, special Error Admin Log entry will be created, which can be used for monitoring [Cloud Integration failure events](/1nce-os/1nce-os-cloud-integrator/cloud-integrator-failure-event).

***

# Limitations

* Only HTTPS POST webhook endpoints are supported. Endpoints should respond with 2xx HTTP status code.
* Customer endpoint should respond within 20s.
* Same customer endpoint URL **CANNOT** be set to multiple webhooks simultaneously.
* Integrations will be set to state `integration failed` after 5 unsuccessful message forwarding attempts. If needed, they can be restarted manually.
* "First Successful Message Delivery" value will be updated only on first successfull message sent by device after Integration is created/rolled out.
* Integration state will not be changed if a test message will be sent to the integration.
* Customer webhook endpoints with self-signed certificate are not supported.
* Customer webhook endpoint domains with special characters are not supported. In case special characters should be used, please refer to `punycode`.
* Data is sent in JSON-Format:
  * For all LwM2M Messages.
  * For all UDP and CoAP messages that are being processed with Energy Saver template.
  * If `Parse JSON payload` is enabled and that message is a valid parsable JSON.
* Data is sent in Base64 format:
  * If `Parse JSON payload` is disabled.
  * If `Parse JSON payload` is enabled but that message is NOT a valid parsable JSON.
* Only device metadata can be injected into a webhook's definition, such as :iccid:, :imsi: and :ip:
