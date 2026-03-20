---
title: IoT SIM Card Industrial
description: Basics about the 1NCE IoT SIM Cards Industrial.
---
The form factor of the IoT SIM Card Industrial is identical to the IoT SIM Card Business with the plastic 3in1 format. The main differences are within the SIM chip, software and environmental ruggedness of the SIM card.  
This section will cover the basics about the physical IoT SIM Cards Industrial form factor, technical specifications as well as recommendations for IoT hardware application cases.

<div style={{textAlign: 'center'}}>
![Overview of the 1NCE 3in1 IoT SIM Cards Industrial, which includes the 2FF, 3FF and 4FF form factors. ](/img/sim-cards/sim-cards-overview/sim-cards-iot-industrial/e7a6860-SIM_industrial.png)
</div>


***

# IoT SIM Cards Industrial Form Factor

Over the years, with the hardware miniaturization and especially IoT use cases for mobile networks, the physical SIM Card format was adapted multiple times to make the overall footprint smaller. As the IoT SIM Chip Industrial design and layout was retained to provide backwards combability, the surrounding plastic format was changed. As a result, four common IoT SIM Cards Industrial form factors (1-4 FF) were established. Original full-size IoT SIM Cards Industrial (1FF) had the typical credit card form factor. As this standard is used only rarely today, it has been phased out of production. The remainder 2FF, 3FF and 4FF are still commonly used and sold as 3in1 breakout, plastic-backed SIM Cards. The four IoT SIM Cards Industrial form factors are specified in <a href="https://www.etsi.org/deliver/etsi_ts/102200_102299/102221/15.00.00_60/ts_102221v150000p.pdf" target="blank_">ETSI TS 102 221</a>. The exact dimension specifications of the form factors are listed in the table below. 

|               | 2FF - Mini SIM | 3FF - Micro SIM | 4FF - Nano SIM           |
| :------------ | :------------- | :-------------- | :----------------------- |
| **Height**    | 25mm           | 15mm            | 12.3mm ± 0.1 mm          |
| **Width**     | 15mm           | 12mm            | 8.8mm                    |
| **Thickness** | 0.76mm         | 0.76mm          | 0.67mm +0.03 mm/-0.07 mm |

1NCE IoT SIM Cards Industrial are 3in1 plastic-backed SIMs which incorporate the standardized 2FF Mini, 3FF Micro and 4FF Nano form factors. The 1NCE IoT SIM Cards Industrial are shipped in a half-size carrier to make handling and shipping of the breakout SIMs easier. Depending on the customer needs the IoT SIM Cards Industrial can be carefully broken down into the needed form factor and also reassembled back up to 2FF Mini with the supplied adapters.

<div style={{textAlign: 'center'}}>
![1NCE_4FF_SIM_Dimensions.png](/img/sim-cards/sim-cards-overview/sim-cards-iot-industrial/20aeb83-1NCE_4FF_SIM_Dimensions.png)
</div>

*1NCE IoT SIM Cards Industrial 4FF reference dimensions and pin assignment as of ETSI TS 102 221.*


As 4FF is the smallest form factor that minimizes the plastic-backed SIM Card to the bare IC, we will use it as reference for the pinout. The pinout is the same for all IoT SIM Cards Industrial as the SIM IC is identical. Shown above is the pinout reference and dimensions of the 4FF SIM according to <a href="https://www.etsi.org/deliver/etsi_ts/102200_102299/102221/15.00.00_60/ts_102221v150000p.pdf" target="blank_">ETSI TS 102 221</a>. While the 1NCE IoT SIM Cards 4FF and eSIM MFF2 form factor are different, the pinout of the actual ICs are the same. The pinout table references the pinout of the dimensional reference figure for the 4FF IoT SIM Cards Industrial.

<HTMLBlock>{`
<table style="width: 100%; border-collapse: collapse;">
<thead>
<tr>
  <th style="border: 1px solid #ddd; padding: 8px;">Contact Pin</th>
  <th style="border: 1px solid #ddd; padding: 8px;">Spec. Description</th>
  <th style="border: 1px solid #ddd; padding: 8px;">1NCE IoT SIM Cards Industrial Pinout</th>
</tr>
</thead>
<tbody>
<tr>
  <td style="border: 1px solid #ddd; padding: 8px;"><p>C1</p>
</td>
  <td style="border: 1px solid #ddd; padding: 8px;"><p><strong>VCC</strong><br>Supply Voltage</p>
</td>
  <td style="border: 1px solid #ddd; padding: 8px;"><p>VCC</p>
</td>
</tr>
<tr>
  <td style="border: 1px solid #ddd; padding: 8px;"><p>C2</p>
</td>
  <td style="border: 1px solid #ddd; padding: 8px;"><p><strong>RST</strong><br>Reset Pin</p>
</td>
  <td style="border: 1px solid #ddd; padding: 8px;"><p>RST</p>
</td>
</tr>
<tr>
  <td style="border: 1px solid #ddd; padding: 8px;"><p>C3</p>
</td>
  <td style="border: 1px solid #ddd; padding: 8px;"><p><strong>CLK</strong><br>Clock Signal</p>
</td>
  <td style="border: 1px solid #ddd; padding: 8px;"><p>CLK</p>
</td>
</tr>
<tr>
  <td style="border: 1px solid #ddd; padding: 8px;"><p>C4 and C8</p>
</td>
  <td style="border: 1px solid #ddd; padding: 8px;"><p><strong>Optional</strong><br>USB interface according to ETSI TS 102 600</p>
</td>
  <td style="border: 1px solid #ddd; padding: 8px;"><p>N/A</p>
</td>
</tr>
<tr>
  <td style="border: 1px solid #ddd; padding: 8px;"><p>C5</p>
</td>
  <td style="border: 1px solid #ddd; padding: 8px;"><p><strong>GND</strong><br>Ground Connection</p>
</td>
  <td style="border: 1px solid #ddd; padding: 8px;"><p>GND</p>
</td>
</tr>
<tr>
  <td style="border: 1px solid #ddd; padding: 8px;"><p>C6</p>
</td>
  <td style="border: 1px solid #ddd; padding: 8px;"><p><strong>VPP</strong><br>Programming Voltage</p>
</td>
  <td style="border: 1px solid #ddd; padding: 8px;"><p>N/A</p>
</td>
</tr>
<tr>
  <td style="border: 1px solid #ddd; padding: 8px;"><p>C7</p>
</td>
  <td style="border: 1px solid #ddd; padding: 8px;"><p><strong>I/O</strong><br>Input Output Data</p>
</td>
  <td style="border: 1px solid #ddd; padding: 8px;"><p>I/O</p>
</td>
</tr>
</tbody>
</table>
`}</HTMLBlock>

***

# Shipping & Assembly Packaging

1NCE 3in1 IoT SIM Cards Industrial are packaged in a half-size breakout card to save on plastic wastage. This makes handling and shipping of the different SIM form factors easier. Each of these breakout cards, shown below, contains one 3in1 SIM. For easier identification, on the back of the cards a barcode and numerical representation of the EAN code and the ICCID is printed. When ordering low quantities of IoT SIM Cards Industrial, the cards will be packaged and shipped in small plastic-wrapped packages. For larger orders will be fulfilled by shipping boxes of 100 or 500 SIMs respectively. These boxes are packaged in sequence, lowest to highest ICCID with a label sticker indicating the first and last ICCID of the box.

<div style={{textAlign: 'center'}}>
![1NCE_FlexSIM.png](/img/sim-cards/sim-cards-overview/sim-cards-iot-industrial/dd1d47b257ed4b77c15c798869af49d8c7b6912c34ff71810aa6754e0bbcaf19-SIMCIndustrial.png)
</div>

*1NCE 3in1 IoT SIM Cards inside the half-size breakout card used for easier shipping and packaging.*

***

# IoT SIM Cards Industrial eID Identification

An eID is a 32-digit global unique identifier number, containing information that uniquely identifies the physical SIM.  Using the eUICC feature, the eID is the most important number to identify the SIM as the ICCID may change with the active profile. The eID is unique to the IoT SIM, and will remain always the same.

The eID can be read by the hardware modem using an AT-Command or manufacturer-specific request. For easier physical identification, each 1NCE IoT SIM Card Industrial has the eID of the particular SIM printed on the 4FF physical chip card.

For more information about eID, please, refer to the official [GSMA documentation](https://www.gsma.com/esim/resources/sgp-29-v1-0-eid-definition-and-assignment-process/)

***

# IoT SIM Cards Industrial Specifications

SIM Cards for mobile network applications follow strict standards for the physical form factor as well as the technology and interfaces. 1NCE IoT SIM Cards Industrial complies with these technical standard specifications. Besides the key standard compliances, SIM Cards are validated for specific environmental ranges in which they need to be operated in. The table below shows the most important 1NCE IoT SIM Cards Industrial specifications that are relevant for the deployment of the 1NCE IoT SIM Cards Industrial. Furthermore, references to the key standard compliances for the SIM interfaces are listed.

<HTMLBlock>{`
<div style={{
  className: "rdmd-table"
}}>
  <div style={{
    className: "rdmd-table-inner"
  }}>
    <table style={{
      width: '100%'
    }}>
      <thead>
        <tr>
          <th>Parameter</th>
          <th>1NCE IoT SIM Card Industrial (3in1)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Form Factors (FF)</td>
          <td style={{
            textAlign: 'center'
          }}>2FF - Mini, 3FF - Micro, 4FF - Nano</td>
        </tr>
        <tr>
          <td>Supported Radio Access Technologies (RAT)</td>
          <td style={{
            textAlign: 'center'
          }}>2G, 3G, 4G, CAT-M1, NB-IoT</td>
        </tr>
        <tr>
          <td>Environmental Temperature</td>
          <td style={{
            textAlign: 'center'
          }}>-40°C to +105°C</td>
        </tr>
        <tr>
          <td>Operating Voltages</td>
          <td style={{
            textAlign: 'center'
          }}>Class A, B and C (1.62V – 5.5V)</td>
        </tr>
        <tr>
          <td>Data Retention Period</td>
          <td style={{
            textAlign: 'center'
          }}>min. 10 years</td>
        </tr>
        <tr>
          <td>Number of profiles</td>
          <td style={{
            textAlign: 'center'
          }}>max. 10</td>
        </tr>
        <tr>
          <td>Read/Write Cycles</td>
          <td style={{
            textAlign: 'center'
          }}>min. 2.000.000 cycles</td>
        </tr>
        <tr>
          <td>Key Standard Compliances</td>
          <td style={{
            textAlign: 'center'
          }}><a href="https://portal.3gpp.org/desktopmodules/Specifications/SpecificationDetails.aspx?specificationId=1833" target="_blank">3GPP TR 31.919</a></td>
        </tr>
        <tr>
          <td></td>
          <td style={{
            textAlign: 'center'
          }}><a href="https://www.etsi.org/deliver/etsi_ts/101200_101299/101220/13.01.00_60/ts_101220v130100p.pdf" target="_blank">ETSI TS 101 220</a></td>
        </tr>
        <tr>
          <td></td>
          <td style={{
            textAlign: 'center'
          }}><a href="https://www.etsi.org/deliver/etsi_ts/102200_102299/102221/15.00.00_60/ts_102221v150000p.pdf" target="_blank">ETSI TS 102 221</a></td>
        </tr>
        <tr>
          <td></td>
          <td style={{
            textAlign: 'center'
          }}><a href="https://portal.3gpp.org/desktopmodules/Specifications/SpecificationDetails.aspx?specificationId=1802" target="_blank">3GPP TS 31.101</a></td>
        </tr>
        <tr>
          <td></td>
          <td style={{
            textAlign: 'center'
          }}><a href="https://portal.3gpp.org/desktopmodules/Specifications/SpecificationDetails.aspx?specificationId=1807" target="_blank">3GPP TS 31.111</a></td>
        </tr>
        <tr>
          <td></td>
          <td style={{
            textAlign: 'center'
          }}><a href="https://portal.3gpp.org/desktopmodules/Specifications/SpecificationDetails.aspx?specificationId=1831" target="_blank">3GPP TR 31.900</a></td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
`}</HTMLBlock>


***

# IoT SIM Cards Industrial Application Cases

As the plastic-backed IoT SIM Cards Industrial is currently still the most commonly used form factor in the mobile communication field, it is best suited as a general-purpose SIM for most off-the-shelve, ready-to-use IoT devices. The 3in1 form factor of the 1NCE IoT SIM Cards Industrial is compatible with a wide range of devices that accept this standardized form factor. This form factor of SIM is easy to install, exchange, swappable between devices and ready for the IoT production environment. These key features make the 1NCE IoT SIM Cards Industrial ideal for every stage of the IoT device life cycle, from early, flexible prototyping to deploying thousands of devices in the field. Also, 1NCE IoT SIM Cards Industrial are ideal for more demanding environments due to their enhanched physical attributes, for example, operating temperature.

For any open questions about the detailed 1NCE IoT SIM Cards Industrial product or more extensive help in selecting the right IoT SIM for the specific application case, feel free to contact us (<a href="https://1nce.com/en-eu/support" target="_blank">1NCE Contact</a>).
