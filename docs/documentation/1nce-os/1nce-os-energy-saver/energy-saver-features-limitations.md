---
title: Features & Limitations
description: A look into what the 1NCE Energy Saver can and cannot do.
sidebar_position: 1
---
## Features

The 1NCE Energy Saver offers binary conversion inspired on the AllThings Talk Binary Conversion Language (ABCL) but we don't support all the all features. More details on the general conversion language available at [Binary Conversion Language](/docs/1nce-os/1nce-os-energy-saver/energy-saver-binary-conversion-language) 

The binary conversion allows customers to simply format binary payloads and build also more complex logic into the conversion templates. Templates are provided via the 1NCE Energy Saver and applied to the desired Devices.\
Let's take the following example for a simple IoT device with 2 sensors one input. A UDP payload would look like this: **00 1A 00 37 00** 

As this is not readable let's apply the following conversion template to the message:

```json
{
    "sense": [
        {
            "asset": "Temperature",
            "value": {
                "byte": 0,
                "bytelength": 2,
                "type": "int",
                "signed": true
            }
        },
        {
            "asset": "Humidity",
            "value": {
                "byte": 2,
                "bytelength": 2,
                "type": "int"
            }
        },
        {
            "asset": "Switch",
            "value": {
                "byte": 4,
                "type": "boolean"
            }
        }
    ]
}
```

This will result in a nicely formatted JSON-message that is also human-readable:

```json
{
    "Temperature": 26,
    "Humidity": 55,
    "Switch": false
}
```

Desired template can be edited and tested using [Template Tester](/1nce-os/1nce-os-energy-saver/energy-saver-template-tester)

## Limitations

* Only values between -9999999999999999 and 9999999999999999 are guaranteed to have the correct precision. Values smaller than -9999999999999999 and larger than 9999999999999999 could be affected by rounding precision.
* API requests have a maximum request body size limit of 64kb, which includes all the information sent in the request body. This limitation can potentially affect requests to [create](/api/1nce-os/create-optimizer-template/) and [patch](/api/1nce-os/update-optimizer-template/) template endpoints, since the size of the template and other information sent in the request body cannot exceed 64kb.
* Only 1 **Energy Saver** template is allowed per protocol (UDP and CoAP).
