---
title: Geofence creation guide
---
## Polygon Geofence creation

### Getting the coordinates

Proceed to [geojson.io](https://geojson.io), there will be a world map where geofencing boundaries can be drawn and coordinates of points will be provided. Those coordinates can be used in our API explorer to create same geofence in our system.

In this example we have created following polygon geofence:

![](/img/1nce-os/1nce-os-device-locator/device-locator-geofencing-guide/8193513-image.png)

Coordinates of the points are visible in the right window, in our example those are:

```json
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
```

### Creating a geofence

Create following API request, where you should pass the polygon coordinates received in the previous step:

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

Response body:

```json
{
	"id": "CZ41OIxhOGdP4bxuCAsg9",
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

## Circle Geofence creation

### Getting the coordinates

Circle Geofence can be created either by providing center point or by passing deviceId for which there are coordinates in the 1NCEOS system. To retrieve center coordinates you again can use [geojson.io](https://geojson.io), where after putting single point on a map you will get similar array consisting of longitude and latitude, which then can apply to the `center` attribute in the creation request:

```json
"center": [
		15.31322746,
		-4.322458751
],
```

### Creating a circle geofence with center

Device specific circle geofence can be created using following API request:

Create new geofence:

```shell
curl -X POST "https://api.1nce.com/management-api/v1/locate/geofences"
```

The request body looks like this:

```json
{
	"name": "OnceCircle",
	"type": "circle",
  "center": [
		15.31322746,
		-4.322458751
  ],
	"radius":  500
}
```

Response body:

```json
{
	"id": "sd8TGmSzXNaQTDtXOzzxf",
	"name": "OnceCircle",
	"eventTypes": [
		"EXIT",
		"ENTER"
	],
	"center": [
		15.31322746,
		-4.322458751
	],
	"radius": 500,
	"type": "circle",
	"eventSources": [
		"CellTower",
		"GPS"
	],
	"created": "2025-10-02T12:05:56.998Z",
	"updated": "2025-10-02T12:05:56.998Z"
}
```

:warning: Note that in this request we didn't pass the `eventTypes` and `eventSources` attributes, so the system set those to the default values.

### Creating device specific circle a geofence without known center

In case if you want to create device specific Geofence and don't know current coordinates of that device, you can just make creation request without `center` attribute, in this case system will try to retrieve device's latest coordinates and use those as a center:

Create new geofence:

```shell
curl -X POST "https://api.1nce.com/management-api/v1/locate/geofences"
```

The request body looks like this:

```json
{
	"name": "OnceCircle",
	"type": "circle",
  "eventTypes": [
		"EXIT",
		"ENTER"
	],
  "eventSources": [
		"CellTower",
		"GPS"
	],
  "deviceId": "1234561758848740979",
	"radius":  500
}
```

Response body:

```json
{
	"id": "sd8TGmSzXNaQTDtXOzzxf",
	"name": "OnceCircle",
	"eventTypes": [
		"EXIT",
		"ENTER"
	],
		"center": [
		-89.178544,
		42.312127
	],
	"radius": 500,
	"type": "circle",
	"eventSources": [
		"CellTower",
		"GPS"
	],
  "deviceId": "1234561758848740979",
	"created": "2025-10-02T12:05:56.998Z",
	"updated": "2025-10-02T12:05:56.998Z"
}
```

## Retrieving Geofence events

After geofence is created, [Cloud integrator](/1nce-os/1nce-os-cloud-integrator/index) will create **ENTER** and **EXIT** events on every geofence border crossing by device, depending on the configuration of geofence `eventTypes`, `eventSources` and also device location update frequency.

Please see [Cloud integrator output format](/1nce-os/1nce-os-cloud-integrator/cloud-integrator-output-format) for details of geofence events.
