---
title: Energy Saving Calculation
description: How we calculate the value of energy saved in 1NCE OS
---
By using the 1NCE Energy Saver with a translation template, the devices can save energy. How much energy is saved, depends on the optimized payload compared to the original full JSON. Below is a description of how the saved energy for 1NCE customers can be calculated based on 1NCE research.

The research focusses on the impact of the energy saver on correlation of the translation compared to the usage of the battery. The tests were executed sending CoAP-Messages with translation capabilities in various degrees.

# Test-Setup

Tools used:

* Testing device: NRF Development kit (Nordic nRF9160-DK)
* Device power measurement: Qoitech Otii arc

Testing rules:

* Energy saver using CoAPs (NB-IoT – stable connection)
* Incremental payload (50B – 2KB)
* Duration of Test: 3 hours
* Frequency of messages: 4 messages/minute

# Result

Measurements:

| Payload Size (Bytes) | 1st Hour | 2nd Hour | 3rd Hour | Average consumption (mWh) |
| :------------------- | :------- | :------- | :------- | :------------------------ |
| **50**               | 94.5     | 95       | 92.3     | 93.1                      |
| **250**              | 101      | 98       | 95.1     | 98.0                      |
| **500**              | 101      | 101      | 98.1     | 100.0                     |
| **1000**             | 107      | 106      | 111      | 108.0                     |
| **1500**             | 112      | 113      | 117      | 114.0                     |
| **2000**             | 121      | 118      | 119      | 119.3                     |

<Image alt="Payload vs. Consumption" width="60% " border={true} src="/img/1nce-os/1nce-os-energy-saver/energy-saver-energy-saved-calculation/d62604d-energy-used-graph.png">
  Payload vs. Consumption
</Image>

The energy consumption of the IoT device can be calculated by:

**E = 0.013 x + 94.084**

Where **E** is the energy consumption and **x** ist the Payload in Bytes. For every Byte less in communication you save an average of 0.013 mWh.

<HTMLBlock>{`
<center><b>E<sub>reduced</sub> = E(x<sub>original</sub>) - E(x<sub>optimized</sub>)</b></center>
`}</HTMLBlock>

<HTMLBlock>{`
<ul>
  <li>x<sub>optimized</sub> is the payload from the device that is using a translation template</li>
  <li>x<sub>original</sub> is the value that will result after the optimized payload is translated (full JSON string)</li>
</ul>
`}</HTMLBlock>

The average amount of saved energy is the difference between the energy consumption of the full JSON and the energy consumption of the optimized payload. Please be aware that the average amount of saved energy is an estimated value and not an actual measurement.

In the tests, the payload was varied in all experiments to avoid caching by network (or software).

# Example

Payload

```Text base64
00 1A 00 37 00
```

Output

```Text Optimized JSON
{
  "Temperature": 26,
  "Humidity": 55,
  "Switch": FALSE
}
```

<HTMLBlock>{`
<ul>
  <li>Payload = 10 Bytes (x<sub>optimized</sub>)</li>
  <li>Output = 47 Bytes (x<sub>original</sub>)</li>
  <li>Amount of Saved Bytes = 37 Bytes</li>
  <li>Energy Saved (E<sub>reduced</sub>) = 0.481 mWh</li>
</ul>
`}</HTMLBlock>

Compared to the energy of the original payload we save 0.51% of energy in this example.

General rule of thumb, small payloads only result in a small energy saving. The larger the payload and the greater the optimization, the more energy is saved.
