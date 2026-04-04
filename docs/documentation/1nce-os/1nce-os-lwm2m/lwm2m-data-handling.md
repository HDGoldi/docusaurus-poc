---
title: Data Handling
description: >-
  The basics of Sending, Reporting and Viewing data using the 1NCE LwM2M
  Service.
sidebar_position: 3
---
<div style={{textAlign: 'center'}}>
<img src="/img/1nce-os/1nce-os-lwm2m/lwm2m-data-handling/001.png" alt="" style={{maxWidth: '100%'}} />
</div>

In general, there are two options how data from a LwM2M client device can be transmitted towards the LwM2M Server. The send operation represents the push-orientated communication, whereas passive reporting reflects the pull-based data exchange. In the following section, both these data exchange methods are outlined. Further an outline to viewing and accessing the LwM2M data and further references are provided. 

***

# Send Operation

An active LwM2M client that is registered on the LwM2M server can send data by executing a simple send operation. This send is used by the LwM2M client to "push" data to the LwM2M server without an explicit request by this server. This operation is used by the client to report values for resources and resource instances of known and existing LwM2M object instance(s) (<a target="_blank" href="https://technical.openmobilealliance.org/OMNA/LwM2M/LwM2MRegistry.html">OMA LwM2M Registry</a>.) to the LwM2M Server.

***

# Passive Reporting

Passive reporting provides a pull-based data collection method, where data is requested from a LwM2M device. By enabling passive reports, the 1NCE LwM2M server tries to read all known readable objects of the LwM2M client. This read is timed based on the registration and registration update events. The read out data is also provided via the IoT Integrator. An object is considered readable if at least one of its resources is readable. LwM2M object IDs 1, 2, and 3 are excluded from this read operation.

## Enable Reporting

To use passive reporting with the 1NCE LwM2M Service, the `LWM2M_PASSIVE_REPORTING` setting needs to be enabled.

Setting can be enabled in 1NCE portal [Device integrator](/docs/1nce-os/1nce-os-device-integrator/index).

<div style={{textAlign: 'center'}}>
<img src="/img/1nce-os/1nce-os-lwm2m/lwm2m-data-handling/1935ef5ef724af18873ce68725dc722e8aba7dde50c41d1695e134c8cd56cc93-lwm2mpr.png" alt="LwM2M Passive Reporting setting" width="80%" />
</div>

The setting can be enabled also with a [management API call](ref:patch_v1-settings-1nceos-name)

```shell
curl --request PATCH \
     --url https://api.1nce.com/management-api/v1/settings/1nceos/LWM2M_PASSIVE_REPORTING \
     --header 'accept: application/json' \
     --header 'authorization: Bearer {token}' \
     --header 'content-type: application/json' \
     --data '{"state": "ENABLED"}'
```

## Reporting Example

Suppose the used device support LwM2M object IDs 6 (Location) and 7 (Connectivity Statistics). Based on the registration and registration update, the LwM2M server would read all resources from objects 6 and 7 of the given client device.

## Reporting Interval

By default, the registration lifetime and thus the update proposed by the LwM2M bootstrap server is **ONE day**. This would result in infrequent data updates when using passive reporting. To change this parameter to a higher registration update frequency, the LwM2M client needs to update the registration update frequency, though it should not exceed 1 day.

***

# Action API

With the Action API you get the possibility to automate actions in your device. Your device has to be registered on the LwM2M-Server. It is supporting following actions:

* Read
* Write
* Execute
* Observe (Defined as start and end)

The actions are processed by an asynchronous API. To receive the results of your actions (read & observe), you can use the [Device Inspector](/docs/1nce-os/1nce-os-device-inspector/index). If your requests fail, you can see the messages in the [Admin Logs](/docs/1nce-os/1nce-os-admin-logs/index). Messages are forwarded to your cloud integrations as well when they are configured. For more information about the Action API visit the [Device Controller](/docs/1nce-os/1nce-os-device-controller/index).

Example Request (Within this example checking the state of a LED):

```shell
curl --request POST \
     --url https://api.1nce.com/management-api/v1/integrate/devices/821756382750126453/actions/LWM2M \
     --header 'accept: application/json' \
     --header 'authorization: Bearer {token}' \
     --header 'content-type: application/json' \
     --data 
     '{
     		"action": "read",
     		"resourceAddress": "/3311/0/5850"
	  }'
```

This will be the result of such message you will find in the Cloud Integrator or Device Inspector.

```json
{
  "/3311/0/5850": false
}
```

This means that the LED is off. More codes for resourceAddress can be found [here](https://technical.openmobilealliance.org/OMNA/LwM2M/LwM2MRegistry.html).
