---
title: Template tester
description: Edit and Test energy saver template.
sidebar_position: 3
---
# Edit and Test

To help with creating optimized translation templates for your needs to meet best energy and data saving expectation 1NCE OS provides:

* an interface to **Edit and Test** the desired template.
* [API](/api/1nce-os/create-optimizer-template/) endpoint to test the template.

Template tester is a tool that processes the given **Binary** payload in Base64 string format using the template in template editor and returns the JSON output, translating the Base64 binary payload into readable format. 

Note that Base64 string binary representation is used only for testing purpose, the actual translation of message is done from **Binary** into **JSON**.\
Also, until changes are saved and template is in active state the template changes does not affect the flow of CoAP or UDP messages.

<div style={{textAlign: 'center'}}>
![Edit and Test template interface](/img/1nce-os/1nce-os-energy-saver/energy-saver-template-tester/2ca03cf60fbf5e458bb0b1cc190e767ac7c9fac6755e7fb83bdb55afdca8d447-image.png)
</div>

<br />

# Example templates

There are 3 example templates provided to start with or just create your own template from scratch. 

To try example templates just expand the list of example templates, select any desired template and press **Use this template** button. It will insert example template into template editor, provide example payload into input field. Now you  are ready to do the template testing.

<div style={{textAlign: 'center'}}>
![Example templates](/img/1nce-os/1nce-os-energy-saver/energy-saver-template-tester/560167ee80865b315cd9073daa5fab6a921d5e9a4ad7edc66d1159f310a7b1b9-image.png)
</div>

### Location template

```
{
  "sense": [
    {
      "asset": "longitude",
      "custom_type": "location_long",
      "value": {
        "byte": 0,
        "bytelength": 8,
        "type": "float",
        "byteorder": "little"
      }
    },
    {
      "asset": "latitude",
      "custom_type": "location_lat",
      "value": {
        "byte": 8,
        "bytelength": 8,
        "type": "float",
        "byteorder": "little"
      }
    }
  ]
}
```

If custom types location\_long and location\_lat are available the position will be forwarded to the [Location Service](/docs/1nce-os/1nce-os-device-locator/). Longitude and latitude both have to be float64.

### Deep JSON

```
{
  "sense": [
    {
      "asset": "car.running",
      "value": {
        "byte": 0,
        "type": "boolean"
      }
    },
    {
      "asset": "car.fuel",
      "value": {
        "byte": 1,
        "bytelength": 4,
        "type": "uint"
      }
    },
    {
      "asset": "car.driver",
      "value": {
        "byte": 5,
        "bytelength": 4,
        "type": "string"
      }
    }
  ]
}
```

By including dots in the asset name, deep JSON objects can be created.

### Switch statement

```
{
  "sense": [
    {
      "switch": {
        "byte": 0,
        "bytelength": 1,
        "type": "int"
      },
      "on": [
        {
          "case": 0,
          "do": [
            {
              "asset": "data_type",
              "value": "environment"
            },
            {
              "asset": "temperature",
              "value": {
                "byte": 1,
                "bytelength": 4,
                "type": "float"
              }
            }
          ]
        },
        {
          "case": 1,
          "do": [
            {
              "asset": "data_type",
              "value": "device"
            },
            {
              "asset": "on",
              "value": {
                "byte": 1,
                "type": "boolean"
              }
            }
          ]
        }
      ]
    }
  ]
}
```

The [statements](/docs/1nce-os/1nce-os-energy-saver/energy-saver-binary-conversion-language#case-statements) inside do will be executed if the value of case (within the same object as do) and the switch match.

# Test results

## Test failed

When template is incorrect and template tester can't process the payload, the error message appears under the edit field describing the error:

<div style={{textAlign: 'center'}}>
![Template expects 17 bytes while only 16 bytes are provided](/img/1nce-os/1nce-os-energy-saver/energy-saver-template-tester/32acd7b213f814d273ea303ef375dbd7a31c9d1d3767002fccc396cc070194bf-image.png)
</div>

<br />

## Test succeeded

Output field below template editor provides the translated template value in readable format. 

As an additional template performance metrics the **Reduced Bytes** is provided that represents payload size difference between OUTPUT and INPUT of template as well as **Energy Saved** value that is calculated according to our research described in [Energy Saving Calculation](/docs/1nce-os/1nce-os-energy-saver/energy-saver-energy-saved-calculation) article.

Reduced bytes and Energy saved metrics represents savings on every message that is sent by device

<div style={{textAlign: 'center'}}>
<img src="/img/1nce-os/1nce-os-energy-saver/energy-saver-template-tester/a43ba3c3c1bccf48b94b82ba1e8e1dd88e7b5ffe0b2b1d2839d77ae8f133b747-image.png" alt="Test succeeded" width="400px" />
</div>
