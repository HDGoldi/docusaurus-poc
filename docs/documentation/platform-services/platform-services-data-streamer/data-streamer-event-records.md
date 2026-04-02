---
title: Event Records
description: Get to know the Events provided by the Data Streamer.
sidebar_position: 2
---
The 1NCE Data Streamer Service offers a stream of Event and Usage Records. This chapter will focus on the Event Record specification. The exact format of the events is dependent on the used integration. In this chapter, the focus lies on the JSON Object format. Please note that empty, nested JSON objects are listed as NULL objects. For other integrations the format might be different, but the data fields are comparable. Please refer to the setup of the offered integrations to get more information about the specific data formats used.

The following sections will cover the individual parts of the Event Record JSON:

* [Generic Properties](#generic-properties)
* [Additional Properties](#additional-properties)
* [Detail Properties](#detail-properties)
* [PDP Context Properties](#pdp-context-properties)

***

# Example Event Records

Let us start with a few Example Event Records in the form of JSON Objects from the Data Streamer. Listed below in the different tabs are some example Event Records for different Event Types. All Examples are in the JSON Format just like it would be delivered by the Data Streamer with the custom HTTP endpoint method. Please note that some fields only include placeholder or example values. Furthermore, some of the fields might be dependent on the used Radio Access Technology and other variables. 

<details>
<summary>01_Update_Location</summary>

```json 01_Update_Location.json
{
	"imsi": {
		"imsi": "<imsi>",
		"id": 123456,
		"import_date": "2019-01-21T09:36:17Z"
	},
	"event_source": {
		"description": "Network",
		"id": 0
	},
	"organisation": {
		"name": "8100xxxx",
		"id": 1234
	},
	"event_severity": {
		"id": 0,
		"description": "INFO"
	},
	"sim": {
		"msisdn": "<msisdn>",
		"iccid": "<iccid>",
		"id": 1234567,
		"production_date": "2019-01-21T09:36:17Z"
	},
	"description": "New location received from VLR for IMSI='<imsi>', now attached to VLR='<VLR>'.",
	"alert": false,
	"id": 1234567890,
  "user": null,
	"detail": {
		"mnc": [
			{
				"mnc": "20",
				"id": 327
			},
			{
				"mnc": "16",
				"id": 328
			}
		],
		"tapcode": [
			{
				"tapcode": "NLDDT",
				"id": 470
			},
			{
				"tapcode": "NLDPN",
				"id": 471
			}
		],
		"name": "T-Mobile",
		"country": {
			"iso_code": "nl",
			"country_code": "31",
			"name": "Netherlands",
			"id": 141,
			"mcc": "204"
		},
		"id": 730
	},
	"endpoint": {
		"tags": null,
		"ip_address": "<ip_address>",
		"name": "<name>",
		"imei": "<imei>",
		"id": 1234567
	},
	"event_type": {
		"id": 1,
		"description": "Update location"
	},
	"timestamp": "2019-01-21T09:36:17Z"
}
```

</details>

<details>
<summary>02_Update_GPRS_Location</summary>

```json 02_Update_GPRS_Location.json
{
	"imsi": {
		"imsi": "<imsi>",
		"id": 12345678,
		"import_date": "2019-01-21T09:36:17Z"
	},
	"event_source": {
		"description": "Network",
		"id": 0
	},
	"organisation": {
		"name": "8100xxxx",
		"id": 1234
	},
	"event_severity": {
		"id": 0,
		"description": "INFO"
	},
	"sim": {
		"msisdn": "<msisdn>",
		"iccid": "<iccid>",
		"id": 12345678,
		"production_date": "2019-01-21T09:36:17Z"
	},
	"description": "New location received from SGSN for IMSI='<imsi>', now attached to SGSN='<SGSN>', IP='<ip_address>', RAT type='E_UTRAN'.",
	"alert": false,
	"id": 1234567,
  "user": null,
	"detail": {
		"mnc": [
			{
				"mnc": "01",
				"id": 2
			}
		],
		"tapcode": [
			{
				"tapcode": "DEUD1",
				"id": 1
			},
			{
				"tapcode": "DEUK9",
				"id": 851
			}
		],
		"name": "T-Mobile",
		"country": {
			"iso_code": "de",
			"country_code": "49",
			"name": "Germany",
			"id": 74,
			"mcc": "262"
		},
		"id": 2
	},
	"endpoint": {
		"tags": null,
		"ip_address": "<ip_address>",
		"name": "<name>",
		"imei": "<imei>",
		"id": 123456789
	},
	"event_type": {
		"id": 2,
		"description": "Update GPRS location"
	},
	"timestamp": "2019-01-21T09:36:17Z"
}
```

</details>

<details>
<summary>03_Create_PDP_Context</summary>

```json 03_Create_PDP_Context
{
	"imsi": {
		"imsi": "<imsi>",
		"id": 1234567,
		"import_date": "2019-01-21T09:36:17Z"
	},
	"event_source": {
		"description": "Network",
		"id": 0
	},
	"organisation": {
		"name": "8100xxxx",
		"id": 12345
	},
	"event_severity": {
		"id": 0,
		"description": "INFO"
	},
	"sim": {
		"msisdn": "<msisdn>",
		"iccid": "<iccid>",
		"id": 1234567,
		"production_date": "2019-01-21T09:36:17Z"
	},
	"description": "New PDP Context successfully activated with SGSN CP=<ip_address>, DP=<ip_address>.",
	"alert": false,
	"id": 1234567890,
  "user": null,
	"detail": {
		"pdp_context": {
			"tx_teid_control_plane": 3162410000,
			"sgsn_control_plane_ip_address": "<ip_address>",
			"sac": null,
			"ratezone_id": "2171",
			"rat_type": 2,
			"tunnel_created": "2021-08-09T12:00:27",
			"breakout_ip": "unavailable",
			"tariff_id": "442",
			"mnc": "01",
			"apn": "iot.1nce.net",
			"ue_ip_address": "<ip_address>",
			"gtp_version": 1,
			"rac": null,
			"region": "eu-central-1",
			"tx_teid_data_plane": 2014413000,
			"ggsn_data_plane_ip_address": "<ip_address>",
			"ci": 5559,
			"tariff_profile_id": "129000",
			"pdp_context_id": 110753000,
			"imsi": "901405100000000",
			"operator_id": "2",
			"mcc": "262",
			"imeisv": "863576047850000",
			"sgsn_data_plane_ip_address": "<ip_address>",
			"ggsn_control_plane_ip_address": "<ip_address>",
			"lac": 38701,
			"nsapi": 5,
			"rx_teid": 110750000
		},
		"name": "T-Mobile",
		"id": 2,
		"country": {
			"mcc": "262",
			"iso_code": "de",
			"name": "Germany",
			"id": 74,
			"country_code": "49"
		}
	},
	"endpoint": {
		"tags": null,
		"ip_address": "<ip_address>",
		"name": "<name>",
		"imei": "<imei>",
		"id": 1234567
	},
	"event_type": {
		"id": 3,
		"description": "Create PDP Context"
	},
	"timestamp": "2019-01-21T09:36:17Z"
}
```

</details>

<details>
<summary>05_Delete_PDP_Context</summary>

```json 05_Delete_PDP_Context.json
{
	"imsi": {
		"imsi": "<imsi>",
		"id": 12345678,
		"import_date": "2019-01-21T09:36:17Z"
	},
	"event_source": {
		"description": "Network",
		"id": 0
	},
	"organisation": {
		"name": "8100xxxx",
		"id": 1234
	},
	"event_severity": {
		"id": 0,
		"description": "INFO"
	},
	"sim": {
		"msisdn": "<msisdn>",
		"iccid": "<iccid>",
		"id": 12345678,
		"production_date": "2019-01-21T09:36:17Z"
	},
	"description": "PDP Context deleted.",
	"alert": false,
	"id": 12345678000,
  "user": null,	
	"detail": {
		"pdp_context": {
			"tx_teid_control_plane": 3162419000,
			"sgsn_control_plane_ip_address": "<ip_address>",
			"sac": null,
			"rat_type": 2,
			"tunnel_created": "2021-08-09T12:00:27",
			"breakout_ip": null,
			"mnc": "01",
			"apn": null,
			"ue_ip_address": "<ip_address>",
			"gtp_version": 1,
			"rac": null,
			"region": "eu-central-1",
			"tx_teid_data_plane": 2014410000,
			"ggsn_data_plane_ip_address": "<ip_address>",
			"ci": 5500,
			"pdp_context_id": 110753000,
			"imsi": "901405100000000",
			"mcc": "262",
			"imeisv": "8635760478506578",
			"sgsn_data_plane_ip_address": "<ip_address>",
			"ggsn_control_plane_ip_address": "<ip_address>",
			"lac": 38700,
			"nsapi": 5,
			"rx_teid": 110753000
		},
		"name": "T-Mobile",
		"id": 2,
		"volume": {
			"rx": 0,
			"tx": 0,
			"total": 0
		},
		"country": {
			"mcc": "262",
			"iso_code": "de",
			"name": "Germany",
			"id": 74,
			"country_code": "49"
		}
	},
	"endpoint": {
		"tags": null,
		"ip_address": "<ip_address>",
		"name": "<name>",
		"imei": "<imei>",
		"id": 12345678
	},
	"event_type": {
		"id": 5,
		"description": "Delete PDP Context"
	},
	"timestamp": "2019-01-21T09:36:17Z"
}
```

</details>

<details>
<summary>09_SIM_Suspension</summary>

```json 09_SIM_Suspension.json
{
	"imsi": {
		"imsi": "<imsi>",
		"id": 1234567,
		"import_date": "2019-01-21T09:36:17Z"
	},
	"event_source": {
		"description": "API",
		"id": 2
	},
	"organisation": {
		"name": "8100xxxx",
		"id": 1234
	},
	"event_severity": {
		"id": 0,
		"description": "INFO"
	},
	"sim": {
		"msisdn": "<msisdn>",
		"iccid": "<iccid>",
		"id": 12345678,
		"production_date": "2019-01-21T09:36:17Z"
	},
	"description": "Status of SIM changed from 'Activated' to 'Suspended'",
	"alert": false,
	"id": 1234567890,
  "user": null,
	"endpoint": {
		"tags": null,
		"ip_address": "<ip_address>",
		"name": "<name>",
		"imei": "<imei>",
		"id": 123456
	},
	"event_type": {
		"id": 9,
		"description": "SIM suspension"
	},
	"timestamp": "2019-01-21T09:36:17Z"
}
```

</details>

<details>
<summary>08_SIM_Activation</summary>

```json 08_SIM_Activation.json
{
	"imsi": {
		"imsi": "<imsi>",
		"id": 1234567,
		"import_date": "2019-01-21T09:36:17Z"
	},
	"event_source": {
		"description": "API",
		"id": 2
	},
	"organisation": {
		"name": "8100xxxx",
		"id": 12345
	},
	"event_severity": {
		"id": 0,
		"description": "INFO"
	},
	"sim": {
		"msisdn": "<msisdn>",
		"iccid": "<iccid>",
		"id": 123456,
		"production_date": "2019-01-21T09:36:17Z"
	},
	"description": "Status of SIM changed from 'Suspended' to 'Activated'",
	"alert": false,
	"id": 1234567890,
  "user": null,
	"endpoint": {
		"tags": null,
		"ip_address": "<ip_address>",
		"name": "<name>",
		"imei": null,
		"id": 123456
	},
	"event_type": {
		"id": 8,
		"description": "SIM activation"
	},
	"timestamp": "2019-01-21T09:36:17Z"
}
```

</details>

<details>
<summary>16_Purge_GPRS_Location</summary>

```json 16_Purge_GPRS_Location.json
{
	"imsi": {
		"imsi": "<imsi>",
		"id": 12345678,
		"import_date": "2019-01-21T09:36:17Z"
	},
	"event_source": {
		"description": "Network",
		"id": 0
	},
	"organisation": {
		"name": "8100xxxx",
		"id": 1234
	},
	"event_severity": {
		"id": 0,
		"description": "INFO"
	},
	"sim": {
		"msisdn": "<msisdn>",
		"iccid": "<iccid>",
		"id": 1234567,
		"production_date": "2019-01-21T09:36:17Z"
	},
	"description": "SGSN location information has been purged for IMSI='<imsi>'.",
	"alert": false,
	"id": 12345678,
  "user": null,
	"endpoint": {
		"tags": null,
		"ip_address": "<ip_address>",
		"name": "<name>",
		"imei": "<imei>",
		"id": 12345678
	},
	"event_type": {
		"id": 16,
		"description": "Purge GPRS location"
	},
	"timestamp": "2019-01-21T09:36:17Z"
}
```

</details>

<details>
<summary>15_Purge_Location</summary>

```json 15_Purge_Location.json
{
	"imsi": {
		"imsi": "<imsi>",
		"id": 12345678,
		"import_date": "2019-01-21T09:36:17Z"
	},
	"event_source": {
		"description": "Network",
		"id": 0
	},
	"organisation": {
		"name": "8100xxxx",
		"id": 1234
	},
	"event_severity": {
		"id": 0,
		"description": "INFO"
	},
	"sim": {
		"msisdn": "<msisdn>",
		"iccid": "<iccid>",
		"id": 1234567,
		"production_date": "2019-01-21T09:36:17Z"
	},
	"description": "VLR location information has been purged for IMSI='<imsi>'.",
	"alert": false,
	"id": 12345678,
  "user": null,
	"endpoint": {
		"tags": null,
		"ip_address": "<ip_address>",
		"name": "<name>",
		"imei": "<imei>",
		"id": 123456
	},
	"event_type": {
		"id": 15,
		"description": "Purge location"
	},
	"timestamp": "2019-01-21T09:36:17Z"
}
```

</details>

<details>
<summary>18_Data_Quota_Threshold_Reached</summary>

```json 18_Threshold_Reached.json
{
	"imsi": {
		"imsi": "<imsi>",
		"id": 12345678,
		"import_date": "2019-01-21T09:36:17Z"
	},
	"event_source": {
		"description": "Policy Control",
		"id": 1
	},
	"organisation": {
		"name": "8100xxxx",
		"id": 12345
	},
	"event_severity": {
		"id": 1,
		"description": "WARN"
	},
	"sim": {
		"msisdn": "<msisdn>",
		"iccid": "<iccid>",
		"id": 12345678,
		"production_date": "2019-01-21T09:36:17Z"
	},
	"description": "Endpoint quota threshold reached, volume is below 20%.",
	"alert": true,
	"id": 1234567890,
  "user": null,
	"detail": {
		"quota": {
			"threshold_volume": 118.983794,
			"volume": 118.968383,
			"threshold_percentage": 20
		}
	},
	"endpoint": {
		"tags": null,
		"ip_address": "<ip_address>",
		"name": "<name>",
		"imei": "<imei>",
		"id": 12345678
	},
	"event_type": {
		"id": 18,
		"description": "Quota threshold reached"
	},
	"timestamp": "2019-01-21T09:36:17Z"
}
```

</details>

<details>
<summary>19_Data_Quota_Used_Up</summary>

```json 19_Quota_Used_Up.json
{
	"imsi": {
		"imsi": "<imsi>",
		"id": 1234567,
		"import_date": "2019-01-21T09:36:17Z"
	},
	"event_source": {
		"description": "Policy Control",
		"id": 1
	},
	"organisation": {
		"name": "8100xxxx",
		"id": 1234
	},
	"event_severity": {
		"id": 1,
		"description": "WARN"
	},
	"sim": {
		"msisdn": "<msisdn>",
		"iccid": "<iccid>",
		"id": 1234567,
		"production_date": "2019-01-21T09:36:17Z"
	},
	"description": "Quota volume is completely used up and data access denied for endpoint.",
	"alert": true,
	"id": 1234567890,
  "user": null,
	"detail": {
		"quota": {
			"threshold_volume": 100,
			"volume": "0.015085",
			"threshold_percentage": 20
		}
	},
	"endpoint": {
		"tags": null,
		"ip_address": "<ip_address>",
		"name": "<name>",
		"imei": "<imei>",
		"id": 1234567
	},
	"event_type": {
		"id": 19,
		"description": "Quota used up"
	},
	"timestamp": "2019-01-21T09:36:17Z"
}
```

</details>

<details>
<summary>20_SMS_Threshold_Reached</summary>

```json 19_Quota_Used_Up.json
{
	"imsi": {
		"imsi": "<imsi>",
		"id": 1234567,
		"import_date": "2019-01-21T09:36:17Z"
	},
	"event_source": {
		"description": "Policy Control",
		"id": 1
	},
	"organisation": {
		"name": "8100xxxx",
		"id": 1234
	},
	"event_severity": {
		"id": 1,
		"description": "WARN"
	},
	"sim": {
		"msisdn": "<msisdn>",
		"iccid": "<iccid>",
		"id": 1234567,
		"production_date": "2019-01-21T09:36:17Z"
	},
	"description": "SMS quota threshold reached, volume is below 20%.",
	"alert": true,
	"id": 1234567890,
	"user": null,
	"detail": {
		"quota": {
			"volume": 0,
			"threshold_percentage": 20,
			"threshold_volume": 1,
			"traffic_type": {
				"id": 6,
				"description": "SMS"
			}
		}
	},
	"endpoint": {
		"tags": null,
		"ip_address": "<ip_address>",
		"name": "<name>",
		"imei": "<imei>",
		"id": 1234567
	},
	"event_type": {
		"id": 20,
		"description": "SMS quota threshold reached"
	},
	"timestamp": "2019-01-21T09:36:17Z"
}
```

</details>

<details>
<summary>21_SMS_Quota_Used_Up</summary>

```json 19_Quota_Used_Up.json
{
	"imsi": {
		"imsi": "<imsi>",
		"id": 1234567,
		"import_date": "2019-01-21T09:36:17Z"
	},
	"event_source": {
		"description": "Policy Control",
		"id": 1
	},
	"organisation": {
		"name": "8100xxxx",
		"id": 1234
	},
	"event_severity": {
		"id": 1,
		"description": "WARN"
	},
	"sim": {
		"msisdn": "<msisdn>",
		"iccid": "<iccid>",
		"id": 1234567,
		"production_date": "2019-01-21T09:36:17Z"
	},
	"description": "SMS quota volume is completely used up and SMS access denied for endpoint.",
	"alert": true,
	"id": 1234567890,
	"user": null,
	"detail": {
		"quota": {
			"volume": 1,
			"threshold_percentage": 20,
			"threshold_volume": 1,
			"traffic_type": {
				"id": 6,
				"description": "SMS"
			}
		}
	},
	"endpoint": {
		"tags": null,
		"ip_address": "<ip_address>",
		"name": "<name>",
		"imei": "<imei>",
		"id": 1234567
	},
	"event_type": {
		"id": 21,
		"description": "SMS quota used up"
	},
	"timestamp": "2019-01-21T09:36:17Z"
}
```

</details>

<details>
<summary>52_Data_Quota_Enabled</summary>

```json 19_Quota_Used_Up.json
{
	"timestamp": "2019-01-21T09:36:17Z",
	"alert": false,
	"description": "Data quota management got enabled for service profile (id = 123123 - Generic with Quota or Limits), endpoints of this service profile without an active data quota will be throttled or blocked from data service.",
	"id": 1234567890,
	"event_type": {
		"id": 52,
		"description": "Data quota enabled"
	},
	"event_source": {
		"id": 2,
		"description": "API"
	},
	"event_severity": {
		"id": 1,
		"description": "Warn"
	},
	"organisation": {
		"id": 1234,
		"name": "87123123"
	}
}
```

</details>

<details>
<summary>53_Data_Quota_Disabled</summary>

```json 19_Quota_Used_Up.json
{
	"timestamp": "2019-01-21T09:36:17Z",
	"alert": false,
	"description": "Data quota management got disabled for the service profile (id = 123123 - Generic with Quota or Limits).",
	"id": 1234567890,
	"event_type": {
		"id": 53,
		"description": "Data quota disabled"
	},
	"event_source": {
		"id": 2,
		"description": "API"
	},
	"event_severity": {
		"id": 1,
		"description": "Warn"
	},
	"organisation": {
		"id": 1234,
		"name": "87123123"
	}
}
```

</details>

<details>
<summary>54_SMS_Quota_Enabled</summary>

```json 19_Quota_Used_Up.json
{
	"timestamp": "2019-01-21T09:36:17Z",
	"alert": false,
	"description": "SMS quota management got enabled for service profile (id = 123123 - Generic with Quota or Limits), endpoints of this service profile without an active SMS quota will be blocked from SMS service.",
	"id": 1234567890,
	"event_type": {
		"id": 54,
		"description": "SMS quota enabled"
	},
	"event_source": {
		"id": 2,
		"description": "API"
	},
	"event_severity": {
		"id": 1,
		"description": "Warn"
	},
	"organisation": {
		"id": 1234,
		"name": "87123123"
	}
}
```

</details>

<details>
<summary>55_SMS_Quota_Disabled</summary>

```json 19_Quota_Used_Up.json
{
	"timestamp": "2019-01-21T09:36:17Z",
	"alert": false,
	"description": "SMS quota management got disabled for the service profile (id = 123123 - Generic with Quota or Limits).",
	"id": 1234567890,
	"event_type": {
		"id": 55,
		"description": "SMS quota disabled"
	},
	"event_source": {
		"id": 2,
		"description": "API"
	},
	"event_severity": {
		"id": 1,
		"description": "Warn"
	},
	"organisation": {
		"id": 1234,
		"name": "87123123"
	}
}
```

</details>

<details>
<summary>56_Data_Quota_Assigned</summary>

```json 19_Quota_Used_Up.json
{
	"imsi": {
		"imsi": "<imsi>",
		"id": 1234567,
		"import_date": "2019-01-21T09:36:17Z"
	},
	"event_source": {
		"description": "API",
		"id": 2
	},
	"organisation": {
		"name": "8100xxxx",
		"id": 1234
	},
	"event_severity": {
		"id": 0,
		"description": "Info"
	},
	"sim": {
		"msisdn": "<msisdn>",
		"iccid": "<iccid>",
		"id": 1234567,
		"production_date": "2019-01-21T09:36:17Z"
	},
	"description": "Data quota got assigned with volume of 500.000000 MB. On exhaustion, the data service will be blocked.",
	"alert": true,
	"id": 1234567890,
	"user": null,
	"endpoint": {
		"tags": null,
		"ip_address": "<ip_address>",
		"name": "<name>",
		"imei": "<imei>",
		"id": 1234567
	},
	"event_type": {
		"id": 56,
		"description": "Data quota assigned"
	},
	"detail": "{\"endpoint_quota_id\":123123, \"quota_status_id\": 1,\"action_on_quota_exhaustion_id\": 1,\"volume\": 500.000000, \"expiry_date\": 2022-03-31T00:00:00Z, \"peak_throughput\": 128000,\"last_volume_added\": 500.000000,\"last_status_change_date\": 2022-03-24T12:46:27Z, \"auto_refill\": true,\"threshold_percentage\": 20,\"threshold_volume\": 100.000000}",
	"timestamp": "2019-01-21T09:36:17Z"
}
```

</details>

<details>
<summary>57_Data_Quota_Deleted</summary>

```json 19_Quota_Used_Up.json
{
	"imsi": {
		"imsi": "<imsi>",
		"id": 1234567,
		"import_date": "2019-01-21T09:36:17Z"
	},
	"event_source": {
		"description": "API",
		"id": 2
	},
	"organisation": {
		"name": "8100xxxx",
		"id": 1234
	},
	"event_severity": {
		"id": 0,
		"description": "Info"
	},
	"sim": {
		"msisdn": "<msisdn>",
		"iccid": "<iccid>",
		"id": 1234567,
		"production_date": "2019-01-21T09:36:17Z"
	},
	"description": "Data quota got deleted and data service will be blocked for this endpoint until new data quota got assigned.",
	"alert": true,
	"id": 1234567890,
	"user": null,
	"endpoint": {
		"tags": null,
		"ip_address": "<ip_address>",
		"name": "<name>",
		"imei": "<imei>",
		"id": 1234567
	},
	"event_type": {
		"id": 57,
		"description": "Data quota deleted"
	},
	"timestamp": "2019-01-21T09:36:17Z"
}
```

</details>

<details>
<summary>58_SMS_Quota_Assigned</summary>

```json 19_Quota_Used_Up.json
{
	"imsi": {
		"imsi": "<imsi>",
		"id": 1234567,
		"import_date": "2019-01-21T09:36:17Z"
	},
	"event_source": {
		"description": "API",
		"id": 2
	},
	"organisation": {
		"name": "8100xxxx",
		"id": 1234
	},
	"event_severity": {
		"id": 0,
		"description": "Info"
	},
	"sim": {
		"msisdn": "<msisdn>",
		"iccid": "<iccid>",
		"id": 1234567,
		"production_date": "2019-01-21T09:36:17Z"
	},
	"description": "SMS quota got assigned with volume of 250 SMS. On exhaustion, the SMS service will be blocked.",
	"alert": true,
	"id": 1234567890,
	"user": null,
	"endpoint": {
		"tags": null,
		"ip_address": "<ip_address>",
		"name": "<name>",
		"imei": "<imei>",
		"id": 1234567
	},
	"event_type": {
		"id": 58,
		"description": "SMS quota assigned"
	},
	"detail": "{\"endpoint_quota_id\":123123, \"quota_status_id\": 1,\"action_on_quota_exhaustion_id\": 1,\"volume\": 500.000000, \"expiry_date\": 2022-03-31T00:00:00Z, \"peak_throughput\": 128000,\"last_volume_added\": 500.000000,\"last_status_change_date\": 2022-03-24T12:46:27Z, \"auto_refill\": true,\"threshold_percentage\": 20,\"threshold_volume\": 100.000000}",
	"timestamp": "2019-01-21T09:36:17Z"
}
```

</details>

<details>
<summary>59_SMS_Quota_Deleted</summary>

```json 19_Quota_Used_Up.json
{
	"imsi": {
		"imsi": "<imsi>",
		"id": 1234567,
		"import_date": "2019-01-21T09:36:17Z"
	},
	"event_source": {
		"description": "API",
		"id": 2
	},
	"organisation": {
		"name": "8100xxxx",
		"id": 1234
	},
	"event_severity": {
		"id": 0,
		"description": "Info"
	},
	"sim": {
		"msisdn": "<msisdn>",
		"iccid": "<iccid>",
		"id": 1234567,
		"production_date": "2019-01-21T09:36:17Z"
	},
	"description": "SMS quota got deleted and SMS service will be blocked for this endpoint until new SMS quota got assigned.",
	"alert": true,
	"id": 1234567890,
	"user": null,
	"endpoint": {
		"tags": null,
		"ip_address": "<ip_address>",
		"name": "<name>",
		"imei": "<imei>",
		"id": 1234567
	},
	"event_type": {
		"id": 59,
		"description": "SMS quota deleted"
	},
	"timestamp": "2019-01-21T09:36:17Z"
}
```

</details>

<details>
<summary>00_SMS_Forwarder</summary>

```json 00_SMS_Forwarder.json
{
    "event_source": {
        "description": "Network",
        "id": 0
    },
    "organisation": {
        "name": "8100xxxx",
        "id": 1234
    },
    "event_severity": {
        "id": 1,
        "description": "WARN"
    },
    "sim": null,
    "imsi": null,
    "detail": null,
    "description": "Unable to dispatch DLR to API Callback URL '<url>' (HTTP code=400), please verify the URL is correct and the application server is accepting requests.",
    "alert": true,
    "id": 1234567890,
    "user": null,
    "endpoint": {
        "tags": null,
        "ip_address": "<ip_address>",
        "name": "<name>",
        "imei": "<imei>",
        "id": 12345678
    },
    "event_type": {
        "id": 0,
        "description": "Generic"
    },
    "timestamp": "2019-01-21T09:36:17Z"
}
```

</details>

<details>
<summary>00_Disabled_Endpoint</summary>

```json 00_Disabled_Endpoint.json
{
	"imsi": {
		"imsi": "<imsi>",
		"id": 12345678,
		"import_date": "2019-01-21T09:36:17Z"
	},
	"event_source": {
		"description": "Policy Control",
		"id": 1
	},
	"organisation": {
		"name": "8100xxxx",
		"id": 1234
	},
	"event_severity": {
		"id": 1,
		"description": "WARN"
	},
	"sim": {
		"msisdn": "<msisdn>",
		"iccid": "<iccid>",
		"id": 123456,
		"production_date": "2019-01-21T09:36:17Z"
	},
	"description": "Disconnecting data access for endpoint, because it has been disabled.",
	"alert": true,
	"id": 1234567890,
  "user": null,
	"endpoint": {
		"tags": null,
		"ip_address": "<ip_address>",
		"name": "<name>",
		"imei": "<imei>",
		"id": 1234567
	},
	"event_type": {
		"id": 0,
		"description": "Generic"
	},
	"timestamp": "2019-01-21T09:36:17Z"
}
```

</details>

<details>
<summary>00_SMS_API</summary>

```json 00_SMS_API.json
{
    "event_source": {
        "description": "Network",
        "id": 0
    },
    "organisation": {
        "name": "8100xxxx",
        "id": 12345
    },
    "event_severity": {
        "id": 1,
        "description": "WARN"
    },
    "sim": {
        "msisdn": "<msisdn>",
        "iccid": "<iccid>",
        "id": 1234567,
        "production_date": "2019-01-21T09:36:17Z"
    },
    "description": "SMS to <id> cannot be forwarded, because no API Callback URL defined in service profile.",
    "alert": true,
    "id": 1234567890,
    "user": null,
    "endpoint": {
        "tags": null,
        "ip_address": "<ip_address>",
        "name": "<name>",
        "imei": "<imei>",
        "id": 12345678
    },
    "event_type": {
        "id": 0,
        "description": "Generic"
    },
    "timestamp": "2019-01-21T09:36:17Z"
}
```

</details>

***

# Generic Properties

Generic Properties are fields that are always included in an Event Record JSON message received via the Data Streamer. The following table will list all these properties, their data type, and a short description.

| Property         | Data Type       | Description                                                                                                                                        |
| :--------------- | :-------------- | :------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`             | LONG (64 bit)   | Unique ID for each Event Record sent. Duplicate received event IDs indicate possible retransmissions.                                              |
| `timestamp`      | TIMESTAMP (UTC) | Timestamp with date and time of the event occurrence in the ISO 8601 format.                                                                       |
| `event_type`     | JSON Object     | Object with an id and a description about the occurred event. See [Event Types](#event-types) for a list of all possible values.                   |
| `event_severity` | JSON Object     | JSON object with an id and a description about the severity of the event. See [Event Severity](#event-severity) for a list of all possible values. |
| `event_source`   | JSON Object     | An id and a description about the source of the event. See [Event Source](#event-source) for a list of all possible values.                        |
| `organisation`   | JSON Object     | Object with the ID and the name of the organization. See [Event Organization](#event-organization) for more information.                           |
| `alert`          | BOOLEAN         | Events with a high impact on connectivity operation are flagged as an Alert.                                                                       |
| `description`    | STRING          | String with a human readable description of the event.                                                                                             |

## Event Types

The different types of events are indicated by the Event Type nested object. This object contains an ID and a short description of the event. The following table lists all possible Event Types that can be received via the Data Streamer.

| Event ID | Description                       |
| :------- | :-------------------------------- |
| 0        | Generic                           |
| 1        | Update location                   |
| 2        | Update GPRS location              |
| 3        | Create PDP Context                |
| 4        | Update PDP Context                |
| 5        | Delete PDP Context                |
| 6        | User authentication failed        |
| 7        | Application authentication failed |
| 8        | SIM activation                    |
| 9        | SIM suspension                    |
| 10       | SIM deletion                      |
| 11       | Endpoint blocked                  |
| 12       | Organization blocked              |
| 13       | Support Access                    |
| 14       | Multi-factor Authentication       |
| 15       | Purge Location                    |
| 16       | Purge GPRS location               |
| 17       | Self-Signup                       |
| 18       | Data Quota Threshold reached      |
| 19       | Data Quota used up                |
| 20       | SMS Quota Threshold reached       |
| 21       | SMS Quota used up                 |
| 30       | OpenVPN authentication            |
| 50       | SIM Released                      |
| 51       | SIM Assigned                      |
| 52       | Data Quota Enabled                |
| 53       | Data Quota Disabled               |
| 54       | SMS Quota Enabled                 |
| 55       | SMS Quota Disabled                |
| 56       | Data Quota Assigned               |
| 57       | Data Quota Deleted                |
| 58       | SMS Quota Assigned                |
| 59       | SMS Quota Deleted                 |
| 60       | Data Quota expired                |

## Event Severity

The severity levels of an event indicate what impact the event has on the correct operation of the system. The possible Event Severity values are listed below:

| Severity ID | Description |
| :---------- | :---------- |
| 0           | INFO        |
| 1           | WARNING     |
| 2           | CRITICAL    |

## Event Source

Based on the Event Type, a different originating Event Source might be responsible for triggering the event. The possible sources consisting of an ID and a Description are listed below.

| ID | Description    |
| :- | :------------- |
| 0  | Network        |
| 1  | Policy Control |
| 2  | API            |

## Event Organization

Each Event Record includes information about the originating organization. This helps to identify the organization in the use case of multiple Data Streamer for sub organizations. The JSON property fields of this object are listed below.

| Property | Data Type | Description                    |
| :------- | :-------- | :----------------------------- |
| `id`     | INTEGER   | Unique ID of the organization. |
| `name`   | STRING    | 1NCE Customer ID.              |

***

# Additional Properties

Event Records that directly relate to SIMs, Endpoints, or Users might include some of the following optional properties.

| Property   | Data Type   | Description                                                                                       |
| :--------- | :---------- | :------------------------------------------------------------------------------------------------ |
| `imsi`     | JSON Object | International Mobile Subscriber Identity, see [IMSI Object](#imsi-object) for more information.   |
| `sim`      | JSON Object | Subscriber Identification Module, see [SIM Object](#sim-object) for more information.             |
| `endpoint` | JSON Object | Endpoint/Device information object, see [Endpoint Object](#endpoint-object) for more information. |

## IMSI Object

The International Mobile Subscriber Identity is used to identify each device with a SIM. The following parameters are included in an Event Record.

| Property      | Data Type       | Description                                                     |
| :------------ | :-------------- | :-------------------------------------------------------------- |
| `id`          | INTEGER         | Unique ID of the IMSI.                                          |
| `imsi`        | STRING          | The International Mobile Subscriber Identity as String.         |
| `import_date` | TIMESTAMP (UTC) | Timestamp when the IMSI was provisioned in the ISO 8601 format. |

## SIM Object

Each SIM card has unique properties and parameters. This data is included in the event stream. A list of the available data fields is shown below.

| Property          | Data Type       | Description                                                 |
| :---------------- | :-------------- | :---------------------------------------------------------- |
| `id`              | INTEGER         | Unique ID of the SIM.                                       |
| `iccid`           | STRING          | Integrated Circuit Card Identifier of the SIM.              |
| `msisdn`          | STRING          | Mobile Subscriber ISDN of the SIM Card.                     |
| `production_date` | TIMESTAMP (UTC) | Timestamp when the SIM was produced in the ISO 8601 format. |

## Endpoint Object

As a SIM is placed inside a device, some information about this endpoint is transferred via the mobile network. This information is useful to identify the specific device type and certain connection parameters. A list of all Endpoint Objects is listed below.

| Property     | Data Type | Description                                                                  |
| :----------- | :-------- | :--------------------------------------------------------------------------- |
| `id`         | INTEGER   | Unique ID of the Endpoint.                                                   |
| `name`       | STRING    | Name of the Endpoint configuration.                                          |
| `ip_address` | STRING    | Specific static IP Address of the SIM card/Endpoint.                         |
| `tags`       | STRING    | Any Tags assigned to the Endpoint.                                           |
| `imei`       | STRING    | International mobile equipment identity of the Endpoint/Device with the SIM. |

***

# Detail Properties

For certain Event Types, additional information parameters are added in the Detail Properties. A list of the object parameters and fields is listed below.

| Property      | Data Type   | Description                                                                                                    |
| :------------ | :---------- | :------------------------------------------------------------------------------------------------------------- |
| `id`          | INTEGER     | Unique ID for the used mobile network operator.                                                                |
| `name`        | STRING      | Name of the mobile network operator.                                                                           |
| `country`     | JSON Object | Country of the mobile network operator. See [Country Object](#country-object) for more information.            |
| `pdp_context` | JSON Object | Object with details about the PDP Context. See [PDP Context Object](#pdp-context-object) for more information. |
| `volume`      | JSON Object | Object with details about the Volume used. See [Volume Object](#volume-object) for more information.           |

## Country Object

A nested JSON object inside the Detail Properties contains more information about the country where the SIM event took place. The fields of the Country JSON are listed below.

| Property                | Data Type | Description               |
| :---------------------- | :-------- | :------------------------ |
| `country.id `           | INTEGER   | Unique ID of a country.   |
| `country.name `         | STRING    | Name of the country.      |
| `country.country_code ` | STRING    | Country Code              |
| `country.mcc`           | STRING    | Mobile Country Code (MCC) |
| `country.iso_code `     | STRING    | ISO Country Code          |

## PDP Context Object

An Event Record for a PDP Context includes a wide range of additional information in the Detail Properties. The individual fields are listed below.

| Property | Data Type | Description |
| --- | --- | --- |
| `pdp_context_id` | INTEGER | ID of the PDP Context. |
| `tunnel_created` | TIMESTAMP (UTC) | Creation time of the PDP Session. |
| `gtp_version` | STRING | GTP Version 1/2 |
| `ggsn_control_plane_ip_address ` | STRING | IP Address of GGSN/PGW Control Plane |
| `ggsn_data_plane_ip_address` | STRING | IP Address of GGSN/PGW Data Plane |
| `sgsn_control_plane_ip_address` | STRING | IP Address of SGSN/SGW Control Plane |
| `sgsn_data_plane_ip_address` | STRING | IP Address of SGSN/SGW Data Plane |
| `region` | STRING | Region of the Data Plane. |
| `breakout_ip` | STRING | IP Address used for the Internet Breakout. |
| `apn` | STRING | Access Point Name (APN) |
| `nsapi` | INTEGER | Network Service Access Point Identifier (NSAPI) |
| `ue_ip_address ` | STRING | IP address of the device. |
| `imeisv` | STRING | International Mobile Equipment Identity - Softwareversion |
| `mcc` | STRING | Mobile Country Code (MCC) |
| `mnc` | STRING | Mobile Network Code (MNC) |
| `lac` | INTEGER | Location Area Code (LAC) |
| `sac` | INTEGER | Service Area code (SAC) |
| `rac` | INTEGER | Routing Area code (RAC) |
| `ci` | INTEGER | Cell Identification (CI) |
| `rat_type` | INTEGER | Radio Access Type (RAT) 1 - 3G 2 - 2G 5 - HSPA+ 6 - LTE\* 8 - NB-IoT 9 - CAT-M\* |

\* Only from some mobile operators *rat\_type* 9 is sent for CAT-M connections (depends on the 3GPP Release in their Core Network). For the majority of the CAT-M connections the rat\_type in the data streamer is 6, since CAT-M is based on the 4G standard.

## Volume Object

With each PDP Context, some information about the Data Usage is included in the Volume JSON. The content description of the fields is listed below.

| Property       | Data Type     | Description                     |
| :------------- | :------------ | :------------------------------ |
| `volume.rx`    | DECIMAL(14,6) | Downstream Volume in MegaBytes. |
| `volume.tx`    | DECIMAL(14,6) | Upstream Volume in MegaBytes.   |
| `volume.total` | DECIMAL(14,6) | Total Volume Usage.             |
