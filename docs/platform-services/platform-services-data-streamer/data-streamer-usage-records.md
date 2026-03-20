---
title: Usage Records
description: Stream Updates about the SMS and Data Volume Usage.
---
The 1NCE Data Streamer Service offers a stream of Event and Usage Records. This chapter will focus on the Usage Record specification. In this chapter, the focus lies on the JSON Object format. For other integrations, the format might be different, but the data fields are comparable. Please refer to the setup of the offered integrations to get more information about the specific data formats used.

Usage Records are triggered on SIM level and are based on the following rules:

- For an ongoing PDP data connection, at most, one record every 15 minutes if more than 100kB of data was used. This record contains the aggregated usage since the start of the PDP or since the last usage record.
- One record on the closure a PDP data connection. This record contains the usage since the last record or the entire aggregated usage if no prior record has been provided for the closed PDP data connection.
- For SMS a usage record is provided per individual MO-/MT-SMS send.

In the following, the two types of Usage Records and the included data fields will be shown. The 1NCE Data Streamer provides two types of records for SMS and Data volume usage.

***

# Example Usage Records

Let us start with a few Example Usage Records in the form of JSON Objects from the Data Streamer. Please note that some fields only include placeholder or example values.

<details>
<summary>05_Data_Usage_Record</summary>

```json 05_Data_Usage_Record.json
{
    "imsi": "<imsi>",
    "organisation": {
        "name": "8100xxxx",
        "id": 1234
    },
    "start_timestamp": "2021-08-09T12:59:05Z",
    "sim": {
        "msisdn": "<msisdn>",
        "iccid": "<icc>",
        "id": 123456,
        "production_date": "2018-04-17T15:01:50Z"
    },
    "currency": {
        "id": 1,
        "symbol": "€",
        "code": "EUR"
    },
    "operator": {
      "id": 2,
      "name": "T-Mobile",
      "mnc": "01",
      "country": {
        "id": 74,
        "mcc": "262",
        "name": "Germany"
      }
    },
    "tariff": {
        "ratezone": {
            "name": "Rate Zone 2 (EU - DE)",
            "id": 2067
        },
        "name": "1NCE Production 01",
        "id": 398
    },
    "imsi_id": 1234567,
    "traffic_type": {
        "description": "Data",
        "id": 5
    },
    "id": 1234567890,
    "end_timestamp": "2021-08-09T12:51:20Z",
    "endpoint": {
        "tags": null,
        "ip_address": "<ip_address>",
        "name": "<name>",
        "imei": "<imei>",
        "id": 12345678,
        "balance": null
    },
    "cost": 0.001176,
    "volume": {
        "total": 0.001176,
        "tx": 0.001176,
        "rx": 0.0
    }
}
```

</details>

<details>
<summary>06_SMS_Usage_Record</summary>

```json 06_SMS_Usage_Record.json
{
    "imsi": "<imsi>",
    "organisation": {
        "name": "8100xxxx",
        "id": 12345
    },
    "start_timestamp": "2021-08-09T12:51:20Z",
    "sim": {
        "msisdn": "<msisdn>",
        "iccid": "<iccid>",
        "id": 123456,
        "production_date": "2018-04-17T15:01:50Z"
    },
    "currency": {
        "id": 1,
        "symbol": "€",
        "code": "EUR"
    },
    "operator": {
        "mnc": "01",
        "name": "T-Mobile",
        "country": {
            "name": "Germany",
            "id": 74,
            "mcc": "262"
        },
        "id": 5
    },
    "tariff": {
        "ratezone": {
            "name": "Zone 1",
            "id": 2067
        },
        "name": "Tariff 1",
        "id": 398
    },
    "imsi_id": 1234567,
    "traffic_type": {
        "description": "SMS",
        "id": 6
    },
    "id": 1234567890,
    "end_timestamp": "2021-08-09T12:51:20Z",
    "endpoint": {
        "tags": null,
        "ip_address": "<ip_address>",
        "name": "<name>",
        "imei": "<imei>",
        "balance": null,
        "id": 1234567
    },
    "cost": 1.0,
    "volume": {
        "total": 1.0,
        "tx": 0.0,
        "rx": 1.0
    }
}
```

</details>

***

# Usage Data Properties

These are the main properties of a Usage Record that help to identify the endpoint and provide an insight into the volume used.

| Property          | Data Type             | Description                                                                                                               |
| :---------------- | :-------------------- | :------------------------------------------------------------------------------------------------------------------------ |
| `id`              | LONG (64-bit integer) | Unique ID for each Usage Record sent. Duplicate received event IDs indicate possible retransmissions.                     |
| `cost`            | DECIMAL(14,10)        | Does not reflect the real world cost, 1:1 translation of usage.                                                           |
| `currency`        | JSON Object           | Currency object with information about the cost currency. See [Currency](#currency-object) for more information.          |
| `start_timestamp` | TIMESTAMP (UTC)       | Timestamp with date and time of the usage start in the ISO 8601 format.                                                   |
| `end_timestamp`   | TIMESTAMP (UTC)       | Timestamp with date and time of the usage end in the ISO 8601 format.                                                     |
| `volume`          | JSON Object           | Object with the exact volume used as part of the Usage Record. See [Volume](#volume-object) for more information.         |
| `imsi`            | STRING                | The International Mobile Subscriber Identity as String.                                                                   |
| `organisation`    | JSON Object           | Object with the ID and the name of the organization. See [Event Organization](#organization-object) for more information. |
| `operator`        | JSON Object           | Operator information, see [Operator](#operator-object) for more information.                                              |
| `sim`             | JSON Object           | Subscriber Identification Module, see [SIM](#sim-object) for more information.                                            |
| `tariff`          | JSON Object           | Tariff details, see [Tariff](#tariff-object) for more information.                                                        |
| `traffic_type`    | JSON Object           | Type of traffic of the Usage Record, see [Traffic Type](#traffic-type-object) for more information.                       |
| `endpoint`        | JSON Object           | Endpoint/Device information object, see [Endpoint](#endpoint-object) for more information.                                |

***

# Cost Object

The cost object is set as a 1:1 relation to the used volume. It does not reflect the real world cost.

| Property | Data Type         | Description                                          |
| :------- | :---------------- | :--------------------------------------------------- |
| `id`     | INTEGER           | Unique identifier of the currency of indicated cost. |
| `symbol` | UTF-8 Char STRING | Symbol of the currency as UTF-8 Char.                |
| `code`   | ISO 4217 STRING   | Currency Code in ISO format.                         |

***

# Organisation Object

Information about the organization of the SIM that generated the volume usage record.

| Property | Data Type | Description                            |
| :------- | :-------- | :------------------------------------- |
| `id`     | INTEGER   | Unique identifier of the organisation. |
| `name`   | STRING    | 1NCE Customer ID.                      |

***

# SIM Object

Details about the SIM that is responsible for the volume usage.

| Property          | Data Type       | Description                                                 |
| :---------------- | :-------------- | :---------------------------------------------------------- |
| `id`              | INTEGER         | Unique ID of the SIM.                                       |
| `iccid`           | STRING          | Integrated Circuit Card Identifier of the SIM.              |
| `msisdn`          | STRING          | Mobile Subscriber ISDN of the SIM Card.                     |
| `production_date` | TIMESTAMP (UTC) | Timestamp when the SIM was produced in the ISO 8601 format. |

***

# Operator Object

Operator the SIM was attached to when the usage was generated.

| Property  | Data Type   | Description                                                                      |
| :-------- | :---------- | :------------------------------------------------------------------------------- |
| `id`      | INTEGER     | Unique identifier of visited operator.                                           |
| `mnc`     | STRING      | Mobile Network Code of the roaming operator.                                     |
| `name`    | STRING      | Name of the roaming mobile operator.                                             |
| `country` | JSON Object | Country information object, see [Country](#country-object) for more information. |

***

# Country Object

Country of the device with the 1NCE SIM where the usage was generated.

| Property | Data Type | Description                           |
| :------- | :-------- | :------------------------------------ |
| `id`     | INTEGER   | Unique identifier of visited country. |
| `mcc`    | STRING    | Mobile Country Code of the operator.  |
| `name`   | STRING    | Name of visited country.              |

***

# Tariff Object 

Specific tariff assigned to the 1NCE SIM.

| Property   | Data Type   | Description                                                                          |
| :--------- | :---------- | :----------------------------------------------------------------------------------- |
| `id`       | INTEGER     | Unique identifier of applied tariff.                                                 |
| `name`     | STRING      | Name of the applied tariff.                                                          |
| `ratezone` | JSON Object | Ratezone information object, see [Ratezone ](#ratezone-object) for more information. |

***

# Ratezone Object

The ratezone in which the SIM generated the indicated usage.

| Property | Data Type | Description                            |
| :------- | :-------- | :------------------------------------- |
| `id`     | INTEGER   | Unique identifier of applied Ratezone. |
| `name`   | STRING    | Name of the Ratezone.                  |

***

# Traffic Type Object

Identifies what kind of traffic was used and is shown in the Usage Record. This could either be Data or SMS.

<table style={{width: '100%', borderCollapse: 'collapse'}}>
<thead>
<tr>
  <th style={{border: '1px solid #ddd', padding: '8px'}}>Property</th>
  <th style={{border: '1px solid #ddd', padding: '8px'}}>Data Type</th>
  <th style={{border: '1px solid #ddd', padding: '8px'}}>Description</th>
</tr>
</thead>
<tbody>
<tr>
  <td style={{border: '1px solid #ddd', padding: '8px'}}><p><code>id</code></p>
</td>
  <td style={{border: '1px solid #ddd', padding: '8px'}}><p>INTEGER</p>
</td>
  <td style={{border: '1px solid #ddd', padding: '8px'}}><p>Unique identifier of traffic type.<br />5 = Data<br />6 = SMS</p>
</td>
</tr>
<tr>
  <td style={{border: '1px solid #ddd', padding: '8px'}}><p><code>name</code></p>
</td>
  <td style={{border: '1px solid #ddd', padding: '8px'}}><p>STRING</p>
</td>
  <td style={{border: '1px solid #ddd', padding: '8px'}}><p>Name of traffic type either &quot;Data&quot; or &quot;SMS&quot;.</p>
</td>
</tr>
</tbody>
</table>


***

# Endpoint Object

Details about the endpoint/device with the 1NCE SIM that generated the usage.

| Property     | Data Type | Description                                  |
| :----------- | :-------- | :------------------------------------------- |
| `id`         | INTEGER   | Unique identifier of traffic type.           |
| `tags`       | STRING    | User-defined tags set for this endpoint.     |
| `ip_address` | STRING    | The IP address assigned to this endpoint.    |
| `imei`       | STRING    | The IMEI of the endpoint hardware.           |
| `name`       | STRING    | The user-defined name set for this endpoint. |
| `balance`    | STRING    |                                              |

***

# Volume Object

Exact volume, either data in MegaBytes or number of SMS used by the SIM.

<table style={{width: '100%', borderCollapse: 'collapse'}}>
<thead>
<tr>
  <th style={{border: '1px solid #ddd', padding: '8px'}}>Property</th>
  <th style={{border: '1px solid #ddd', padding: '8px'}}>Data Type</th>
  <th style={{border: '1px solid #ddd', padding: '8px'}}>Description</th>
</tr>
</thead>
<tbody>
<tr>
  <td style={{border: '1px solid #ddd', padding: '8px'}}><p><code>total</code></p>
</td>
  <td style={{border: '1px solid #ddd', padding: '8px'}}><p>DECIMAL(14,6)</p>
</td>
  <td style={{border: '1px solid #ddd', padding: '8px'}}><p>Total traffic consumed, sum of <code>tx</code> and <code>rx</code>.</p>
</td>
</tr>
<tr>
  <td style={{border: '1px solid #ddd', padding: '8px'}}><p><code>tx</code></p>
</td>
  <td style={{border: '1px solid #ddd', padding: '8px'}}><p>DECIMAL(14,6)</p>
</td>
  <td style={{border: '1px solid #ddd', padding: '8px'}}><p><em>Dependent on Traffic Type:</em><br />Upstream traffic (MB) send by the endpoint.<br />or<br />Number of sent MO-SMS</p>
</td>
</tr>
<tr>
  <td style={{border: '1px solid #ddd', padding: '8px'}}><p><code>rx</code></p>
</td>
  <td style={{border: '1px solid #ddd', padding: '8px'}}><p>DECIMAL(14,6)</p>
</td>
  <td style={{border: '1px solid #ddd', padding: '8px'}}><p><em>Dependent on Traffic Type:</em><br />Downstream traffic (MB) received by the endpoint.<br />or<br />Number of sent MT-SMS</p>
</td>
</tr>
</tbody>
</table>
