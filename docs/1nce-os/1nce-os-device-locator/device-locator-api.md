---
title: API Examples
description: >-
  The full Device Locator API description is available in the [API
  Explorer](ref:api-welcome).
---
## Location

### Get Device Positions

Get positions of a specific device for the last 7 days.

Get a list of positions for device with id `1234567890123456789`:

```shell
curl -X GET "https://api.1nce.com/management-api/v1/locate/devices/1234567890123456789/positions"
```

The response could be `200 OK` with body:

```json
{
  "coordinates": [
    {
      "sampleTime": "2024-05-03T11:00:24.985Z",
      "coordinate": [
        24.16962242126465,
        56.97812271118164
      ],
      "source": "CellTower",
      "metadata": {
        "horizontalAccuracy": 1220,
        "horizontalConfidenceLevel": 0.68
      }
    },
    {
      "sampleTime": "2024-05-03T02:10:17.798Z",
      "coordinate": [
        24.16717529296875,
        56.97748947143555
      ],
      "source": "CellTower",
      "metadata": {
        "verticalAccuracy": 577,
        "horizontalAccuracy": 300,
        "verticalConfidenceLevel": 0.68,
        "horizontalConfidenceLevel": 0.68
      }
    }
  ],
  "pageAmount": 1,
  "page": 1
}
```

:warning: Note that `metadata` parameter with accuracy data is only available in CellTower locator **"Plus"** mode.

<br />

### Get Latest Devices Positions

Get latest positions of customer devices for the last 7 days.

```shell
curl -X GET "https://api.1nce.com/management-api/v1/locate/positions/latest"
```

The response could be `200 OK` with body:

```json
{
  "coordinates": [
    {
      "deviceId": "1234567890123456788",
      "sampleTime": "2024-05-07T15:40:12.703Z",
      "coordinate": [
        24.164257049560547,
        56.974369049072266
      ],
      "source": "GPS"
    },
    {
      "deviceId": "1234567890123456789",
      "sampleTime": "2024-05-03T11:00:24.985Z",
      "coordinate": [
        24.16962242126465,
        56.97812271118164
      ],
      "source": "CellTower",
      "metadata": {
        "horizontalAccuracy": 1220,
        "horizontalConfidenceLevel": 0.68
      }
    }
  ],
  "pageAmount": 1,
  "page": 1
}
```

:warning: Note that `metadata` parameter with accuracy data is only available in CellTower locator **"Plus"** mode.

:warning: Note that only one latest position is possible for a single device independent of source: either Celltower or GPS. This means that `source` query parameter selection can lead to no latest position returned for some devices.

### Get Device Activity

Get Cell location resolutions for one device (maximum of last 7 days, defaults to 1 day). Both resolved and unresolved location resolution attempts are returned.

Get a list of location resolutions for device with id `1234567890123456789` ordered by sampleTime DESC:

```shell
curl -X GET "https://api.1nce.com/management-api/v1/locate/devices/1234567890123456789/activity"
```

The response could be `200 OK` with body:

```json
{
  "items": [
    {
      "iccid": "1234567890123456789",
      "sampleTime": "2024-05-03T11:00:24.985Z",
      "towerMetadata": {
        "MCC": "247",
        "MNC": "1",
        "LAC": "11",
        "CellID": "9511"
      },
      "towerLocation": {
        "longitude": 24.16962242126465,
        "latitude": 56.97812271118164
      },
      "resolutionMetadata": {
        "horizontalAccuracy": 1220,
        "horizontalConfidenceLevel": 0.68
      },
      "radioAccessType": "2G",
      "resolutionMode": "ADVANCED",
      "locationResolutionStatus": "SUCCEEDED"
    },
    {
      "iccid": "1234567890123456789",
      "sampleTime": "2024-05-03T11:00:24.985Z",
      "towerLocation": {
        "longitude": 24.16962242126465,
        "latitude": 56.97812271118164
      },
      "radioAccessType": "2G",
      "resolutionMode": "BASIC",
      "locationResolutionStatus": "SUCCEEDED"
    },
    {
      "iccid": "1234567890123456789",
      "sampleTime": "2024-05-03T10:00:24.985Z",
      "towerMetadata": {
        "MCC": "247",
        "MNC": "1",
        "LAC": "11",
        "CellID": "9511"
      },
      "radioAccessType": "2G",
      "resolutionMode": "ADVANCED",
      "locationResolutionStatus": "FAILED"
    },
    {
      "iccid": "1234567890123456789",
      "sampleTime": "2024-05-03T09:00:24.985Z",
      "radioAccessType": "2G",
      "resolutionMode": "BASIC",
      "locationResolutionStatus": "FAILED"
    }
  ]
}
```

:warning: Note that `towerMetadata` and `resolutionMetadata` parameters with accuracy data and tower identifier are only available in CellTower locator **"Plus"** mode.
:warning: Note that, regardless of the different radio access technology types, the `LAC` property in the `towerMetadata` object can represent `TAC`.
![](https://mirrors.creativecommons.org/presskit/buttons/80x15/svg/by-sa.svg) [OpenCelliD Project](https://opencellid.org/) is licensed under a [Creative Commons Attribution-ShareAlike 4.0 International License](https://creativecommons.org/licenses/by-sa/4.0/)

### Get Credit balance

Current credit balance information for **"Plus"** solver mode is available under ADVANCED_CELL_TOWER_LOCATION setting details.

Get a list of customer settings:

```shell
curl -X GET "https://api.1nce.com/management-api/v1/settings/1nceos"
```

The response could be `200 OK` with body:

```json
{
    "items": [
				{
            "state": "ENABLED",
            "details": {
                "credits": 100,
                "expiryDate": "2030-04-23T10:52:18.330Z"
            },
            "name": "ADVANCED_CELL_TOWER_LOCATION",
            "description": "Improves the Cell Tower Location functionality, especially for 3G, 4G and LTE-M."
        }
    ],
    "page": 1,
    "pageAmount": 1
}
```

:warning: Note that `details` object with`credits` and `expiryDate` parameters is only available in CellTower locator **"Plus"** mode.

<br />

## Geofence

### Create geofence

Create new geofence:

```shell
curl -X POST "https://api.1nce.com/management-api/v1/locate/geofences"
```

The request body looks like this:

```json
{
	"name": "Once",
	"eventTypes": [
		"EXIT",
		"ENTER"
	],
	"type": "polygon",
	"coordinates": [
          [
            [
              6.957239730898948,
              50.93892367514573
            ],
            [
              6.958509831039635,
              50.93836584192053
            ],
            [
              6.959702958010666,
              50.93945723847878
            ],
            [
              6.9596259993105605,
              50.934266755623526
            ],
            [
              6.961550428436993,
              50.93431526288117
            ],
            [
              6.961434941100492,
              50.94059711468901
            ],
            [
              6.959087148954154,
              50.94059710732816
            ],
            [
              6.957239730898948,
              50.93892367514573
            ]
          ]
        ],
	"eventSources": [
		"GPS",
		"CellTower"
	]
}
```

### Get Geofence

Get details of a geofence.

Get a details of geofence with id `geofence_id_1`:

```shell
curl -X GET "https://api.1nce.com/management-api/v1/locate/geofences/geofence_id_1"
```

The response should could be `200 OK` with body:

```json
{
	"id": "geofence_id_1",
	"name": "Once",
	"eventTypes": [
		"EXIT",
		"ENTER"
	],
	"coordinates": [
		[
			[
				6.95724,
				50.938924
			],
			[
				6.95851,
				50.938366
			],
			[
				6.959703,
				50.939457
			],
			[
				6.959626,
				50.934267
			],
			[
				6.96155,
				50.934315
			],
			[
				6.961435,
				50.940597
			],
			[
				6.959087,
				50.940597
			],
			[
				6.95724,
				50.938924
			]
		]
	],
	"type": "polygon",
	"eventSources": [
		"GPS",
		"CellTower"
	],
	"deviceId": null,
	"created": "2025-10-02T10:36:11.166Z",
	"updated": "2025-10-02T10:36:11.166Z"
}
```

### Get All Geofences

Get a list of all customer geofences.

```shell
curl -X GET "https://api.1nce.com/management-api/v1/locate/geofences"
```

The response could be `200 OK` with body:

```json
{
	"items": [
		{
			"id": "1jU_nQKeiEb_1tPt6EciD",
			"name": "Once",
			"created": "2025-09-09T07:00:58.126Z",
			"updated": "2025-09-09T07:00:58.126Z",
			"deviceId": "device123",
			"type": "polygon"
		},
		{
			"id": "76luvK3qpxZKM136xnDNM",
			"name": "home",
			"created": "2025-09-10T12:28:20.576Z",
			"updated": "2025-09-10T12:28:20.576Z",
			"deviceId": null,
			"type": "polygon"
		}
	],
	"page": 1,
	"pageAmount": 1
}
```

<br />

### Patch Geofence

Update an existing geofence

You can change `eventTypes`, `eventSources` and `name` of existing geofence with id `geofence_id_1`:

```shell
curl -X PATCH "https://api.1nce.com/management-api/v1/locate/geofences/geofence_id_1"
```

The request body looks like this:

```json
{
  "eventTypes": [
    "ENTER",
    "EXIT"
  ],
  "eventSources": [
    "CellTower",
    "GPS"
  ],
  "name": "Once2"
}
```

:warning: Fields like `type`, `coordinates`, `center` or `center` cannot be changed, instead you should delete old Geofence and create new one.

<br />

### Delete Geofence

Delete an existing geofence

Delete geofence with id `geofence_id_1`:

```shell
curl -X DELETE "https://api.1nce.com/management-api/v1/locate/geofences/geofence_id_1"
```
