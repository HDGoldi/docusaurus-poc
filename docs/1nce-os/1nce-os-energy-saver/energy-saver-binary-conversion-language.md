---
title: Binary Conversion Language
---
The goal of the Binary Conversion Language (BCL) is to provide an easy way of defining a schema for decoding freeform third-party binary payloads. A set of mappings in BCL specific to a device type is called a conversion. Conversions are encoded as JSON objects.

More details on the general conversion language available at [https://docs.allthingstalk.com/dl/AllThingsTalk\_Binary\_Conversion\_Language\_1\_0\_0.pdf](https://docs.allthingstalk.com/dl/AllThingsTalk_Binary_Conversion_Language_1_0_0.pdf) 

## Structure of a conversion

```json Example: Home alarm system
{
    "name": "alarm",
    "comment": "Home alarm system",
    "version": "1.0.0",
    "sense": [
        {
          "asset": "motion",
          "value": {
            "byte": 0,
            "bytelength": 1,
            "type": "boolean"
          }
        }
    ]
}
```

In this example, we declare a data conversion used with a home alarm system device. When the device senses motion it sends one byte to [UDP endpoint](/unresolved/doc:data-broker-udp). This simple template converts that one byte sent by the device into a JSON object with a boolean field called `motion`. 

When the device with enabled binary translation, sends `0x01` the byte gets translated into `true` resulting in the following object:

```json
{
    "motion": true
}
```

## Top-level fields

A conversion MUST have a list field named `sense`, which contains statements that need to be evaluated during `sensing` - when de-serializing binary payloads into JSON objects.

A conversion MAY have a string field named `comment`, provided for a human-readable description of the conversion.

## Statements

Statements are JSON objects that describe a single operation that needs to be performed in a conversion. A statement MUST be either a mapping statement, a control statement, or a comment statement. Statements appear in statement blocks.

## Statement blocks

Statement blocks are JSON lists whose elements are statements or statement blocks that need to be performed in order to complete the conversion. A statement block MAY contain no elements. Making a statement block empty is the same as omitting it all together - no statements get executed. This can be useful in code generation.

There are two types of statement blocks: `sense` and `do`. `sense` statement blocks are executed when sensing (receiving data), and they are present in the home alarm example. `do` is used wherever embedding a statement block - usually within control structures - is needed.

## Sense block

Sense block MAY contain mapping statements and control statements.

Mapping statements in sense block MUST contain a string field `asset`, whose value is a string that uses JSON dot-notation to identify the path to the field in the resulting object.

Mapping statements in sense block MUST contain a field `value`, whose value is a selector that identifies the data that will be stored as the new value of the asset.

Mapping statements in sense block MAY have a string field named `comment`, provided for human-readable description of the given mapping.

## Mapping statements

Mapping statements are used for de-serializing values and metadata from specific parts of binary payloads, special values, variables, and constants into fields in the resulting JSON.

The statement contains two fields:

`asset` - Path to resulting field using JSON dot notation\
`value` - Constant or payload selector

Examples:

**Inject a string field using the constant selector.**

```json Example - sense
{
  "sense": [
    {
      "asset": "sensor",
      "value": "motion"
    }
  ]
}
```

Result:

```json Example - sense result
{
   "sensor": "motion"
 }
```

**Convert 4 bytes into a 32-bit floating-point number using payload selector. Longitude from GPS beacon**

```json sense longitude example
{
  "sense": [
    {
      "asset": "longitude",
      "value": {
        "byte": 0,
        "bytelength": 4,
        "byteorder": "big",
        "type": "float"
      }
    }
  ]
}
```

Data: - `42 4b bc f9`

Result:

```json sense longitude example result
{
  "longitude": 50.934544
}
```

## Control statements

Control statements MUST have a JSON object field named `switch` that specifies the payload selector that's going to be evaluated, and its value tested in cases.

Control statements MUST have a JSON array field named `on` that contains a list of cases that switch value will be tested on, optionally including the default case.

Control statements are used for executing control logic that MAY lead to executing more statements. The switch is the only available control statement in this version of BCL.

Control statement MAY have a string field named `comment`, provided for human-readable description of the conversion.

Control statement on list MAY contain zero or more case statements.

The control statement on the list MAY contain a comment statement.

## Case statements

The case statement MAY have a JSON object field named `case`, whose value is a selector whose value is tested with the switch selectors value in the outer switch control statement. If it is equal, `do` statement block is executed. The switch logic supports optional `default` case. If field `case` is not present in the case statement, a field `default` MUST be present with value `true` marking this object a default case of the switch.

Case statement MUST have a JSON list field named `do`, whose value is a statement block that is executed if case and switch match.

If no `case` statements match the payload, and the `default` case is defined, the default case is executed instead. If `default` case is not present and no `case` statements match, nothing is executed.

Example:

In this example, payload first byte is an 8-bit integer that defines message type. Message type 0 is positional data about the vehicle and message type 1 is maintenance data. Message type 0 has the following structure:

```text Message Structure Full Example
+-------------------+------------------+-------------+
|      4 bytes      |     4 bytes      |   2 bytes   |
+-------------------+------------------+-------------+
| Longitude (float) | Latitude (float) | Speed (int) |
+-------------------+------------------+-------------+
```

Let's initialize the switch statement and create the condition for message type `0`

```json Full Example
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
          "comment": "Positional data",
          "do": [
            {
              "asset": "gps.lat",
              "value": {
                "byte": 1,
                "bytelength": 4,
                "byteorder": "big",
                "type": "float"
              }
            },
            {
              "asset": "gps.lon",
              "value": {
                "byte": 5,
                "bytelength": 4,
                "byteorder": "big",
                "type": "float"
              }
            },
            {
              "asset": "speed",
              "value": {
                "byte": 9,
                "bytelength": 2,
                "byteorder": "big",
                "type": "int"
              }
            }
          ]
        }, {
          "default": true,
          "do": [
            {
              "asset": "error",
              "value": "unknown payload"
            }
          ]
        }
      ]
    }
  ]
}
```

Device sends the following data `00 42 4b bc f9 40 de 98 1c 00 78`

First byte `00` determines that this message contains positional data. The message will result in the following object:

```json Full Example Result
{
  "gps": {
    "lat": 50.934544,
    "lon": 6.956068
  },
  "speed": 120
}
```

If device sends the following data `01 ff ff ff`, the first byte `01` does not match the defined case statement, meaning the default statement is executed:

```json Full Example Result
{
  "error": "unknown payload"
}
```

## Selectors

Selectors are JSON values. They are used to “select” data from a given location type or “select” data used in a control statement.

Selectors MAY have a string field named `comment`, provided for human-readable description of the conversion.

## Constant selector

The constant selector is a string.

Example:

```text
"foo"
```

## Payload selector

A payload selector is a JSON object.

Payload selector MUST have an integer field named `byte` AND/OR an integer field named `endbyte`. The value of `byte` field represents the starting byte from which the chunk is going to be selected (counting from the beginning of the payload). The value of `endbyte` represents a byte counting from the end of the payload and is described as a value that is less or equal to zero. If both `byte` and `endbyte` are present in the payload selector, they are representing a range selector "from `byte` to `endbyte`".

Payload selector MAY have an integer field named `bytelength`, whose value represents the length of the chunk in bytes, starting from and including the byte indexed by `byte` field. It defaults to 1. The field `bytelength` MUST NOT be present if the payload selector contains both `byte` and `endbyte`.

Payload selector MAY have a string field named `byteorder`, whose value represents the byte order of the chunk of bytes. Values for this field can be `big` (Big Endian) or `little` (Little Endian). This value defaults to the `big`.

Payload selector MUST have an integer field named `type`, which defined the data type to which bytes should be converted.

Examples:

Select 16-bit integer with little endian:

```json 16-bit integer select
{
  "byte": 1,
  "bytelength": 2,
  "type": "int",
  "byteorder": "little"
}
```

Select whole payload as a hex string:

```json whole payload section
{
  "byte": 0,
  "endbyte": 0,
  "type": "hex"
}
```

Select the last 4 bytes of the payload as a 32-bit unsigned integer (Big Endian by default):

```json last 4 bytes as 32-bit uint
{
  "endbyte": -4,
  "bytelength": 4,
  "type": "uint"
}
```

Supported data types

**Numeric**

`bytelength` is required. A fix was provided to use the default value of 1 byte if `bytelength` field is not provided inside selectors.

`int` - signed integer. Can have `bytelength` 1, 2, 4, 8 which are 8-bit to 64-bit integers respectively. Defaults to 1\
`uint` - unsigned integer. Same constraints as `int`.

```text int and unit value ranges
int and uint value ranges
uint8  : 0 to 255 
uint16 : 0 to 65535 
uint32 : 0 to 4294967295 
uint64 : 0 to 18446744073709551615 
int8   : -128 to 127 
int16  : -32768 to 32767 
int32  : -2147483648 to 2147483647 
int64  : -9223372036854775808 to 9223372036854775807
```

`float` - floating-point number. Can have `bytelength` 4 and 8 which are 32-bit floating-point number and 64-bit double precision floating-point number.

**Boolean**

`boolean` - boolean. 0x00 will be treated as false.

**String**

`string` - UTF-8 encoded string.

**Hex**

`hex` - output as hex string.

## Nested structure

Dot notation can be used to create JSON with a nested structure.

```json Example - nested
{
  "sense": [
    {
      "asset": "simple_key",
      "value": "value1"
    },
    {
      "asset": "level1.level2.level3.level4",
      "value": "value2"
    }
  ]
}
```

```json Result - nested
{
  "message": {
    "level1": {
      "level2": {
        "level3": {
          "level4": "value2"
        }
      }
    },
    "simple_key": "value1"
  }
}
```

## Full Example

Let's now fully expand all the pieces that we've talked about in this document.

```json Full Example
{
  "sense": [
    {
      "asset": "message_code",
      "value": {
        "byte": 0,
        "bytelength": 1,
        "type": "uint"
      }
    },
    {
      "switch": {
        "byte": 0,
        "bytelength": 1,
        "type": "int"
      },
      "on": [
        {
          "case": 0,
          "comment": "Positional data",
          "do": [
            {
              "asset": "data_type",
              "value": "Position"
            },
            {
              "asset": "gps.lat",
              "value": {
                "byte": 1,
                "bytelength": 4,
                "type": "float"
              }
            },
            {
              "asset": "gps.lon",
              "value": {
                "byte": 4,
                "bytelength": 4,
                "type": "float"
              }
            },
            {
              "asset": "speed",
              "value": {
                "byte": 8,
                "bytelength": 2,
                "type": "int"
              }
            }
          ]
        },
        {
          "case": 1,
          "comment": "Maintenance data",
          "do": [
            {
              "asset": "data_type",
              "value": "Maintenance"
            },
            {
              "asset": "on",
              "value": {
                "byte": 1,
                "type": "boolean"
              }
            },
            {
              "asset": "fuel",
              "value": {
                "byte": 2,
                "bytelength": 4,
                "type": "uint"
              }
            },
            {
              "asset": "driver",
              "value": {
                "byte": 6,
                "bytelength": 4,
                "type": "string"
              }
            },
            {
              "asset": "driver_hex",
              "value": {
                "byte": 6,
                "bytelength": 4,
                "type": "hex"
              }
            }
          ]
        },
        {
          "default": true,
          "do": [
            {
              "asset": "data_type",
              "value": "Unsupported type"
            }
          ]
        }
      ]
    },
    {
      "asset": "full_payload",
      "value": {
        "byte": 0,
        "endbyte": 0,
        "type": "hex"
      }
    }
  ]
}
```

As before, this template parses two types of messages indicated by the first byte. In the beginning, though there is a new mapping statement that adds message type to the resulting JSON. In the switch block, a new statement is added to parse maintenance data.

Data: `01 01 00 00 05 8c 6f 6c 65 67`

The first byte is always mapped to `message_code`.

Field `data_type` is a constant selector that will be evaluated to `Maintenance`.

`0x01` -> 1

The message therefore should be parsed as maintenance data. We have already tried parsing Positional data, the example can be found above.

Let's explore how the `switch` statement will work in this case.

The byte at position 1 is parsed as a boolean and mapped to on, which determines if the vehicle is powered on.

`0x01` -> true

Next, fuel level is parsed from four bytes starting at position 2 and mapped to field `fuel`. Fuel will be parsed as `unit`, which is an unsigned integer because fuel can't drop below 0. Since 4 bytes is selected, the number will be parsed into 32-bit uint.

`0x0000058c` -> 1420

Driver name is then parsed as a string. Name is parsed from 4 bytes starting from position 6.

`0x6f6c6567` -> "oleg"

Driver name is also outputted as hex string and mapped to field `driver_hex`.

`0x6f6c6567` -> `6f6c6567`

We also are adding the whole original payload to the output as hex in the field called `full_payload`. We are selecting the whole payload by defining the start of the selector as `byte: 0` and the end as `endbyte: 0`.

We get the following result for our Translated Binary Payload.

```json Full Example - Result
{
    "message_code": 1,
    "data_type": "Maintenance",
    "on": true,
    "fuel": 1420,
    "driver": "oleg",
    "driver_hex": "6f6c6567",
    "full_payload": "01010000058c6f6c6567"
}
```
