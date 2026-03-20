---
title: IoT SIM Card Business
description: Basics about the 1NCE IoT SIM Cards Business.
---
Although the first, traditional plastic-backed SIM cards were introduced to the mobile network market over 30 years ago, the adapted form factor and technical specifications still apply today as a major key for mobile network communication. As part of the 1NCE connectivity services, the plastic 3in1 IoT SIM Card Business offers the fundamental entrance to the world of mobile IoT communication.  
This section will cover the basics about the physical IoT SIM Card Business form factor, technical specifications as well as recommendations for IoT hardware application cases.

<Image
  align="center"
  alt="Overview of the 1NCE 3in1 IoT SIM Card Business, which includes the 2FF, 3FF and 4FF form factors."
  caption="Overview of the 1NCE 3in1 IoT SIM Card Business, which includes the 2FF, 3FF and 4FF form factors."
  src="/img/sim-cards/sim-cards-overview/sim-cards-iot-business/613cd18-cliu9g5y5003i0rqmejpnayyt-sim-card.max.png"
  sizing="25%"
/>


***

# SIM Form Factor

Over the years, with the hardware miniaturization and especially IoT use cases for mobile networks, the physical SIM Card format was adapted multiple times to make the overall footprint smaller. As the SIM chip design and layout was retained to provide backwards combability, the surrounding plastic format was changed. As a result, four common SIM Card form factors (1-4 FF) were established. Original full-size SIM Cards (1FF) had the typical credit card form factor. As this standard is used only rarely today, it has been phased out of production. The remainder 2FF, 3FF and 4FF are still commonly used and sold as 3in1 breakout, plastic-backed SIM Cards. The four SIM Card form factors are specified in <a href="https://www.etsi.org/deliver/etsi_ts/102200_102299/102221/15.00.00_60/ts_102221v150000p.pdf" target="blank_">ETSI TS 102 221</a>. The exact dimension specifications of the form factors are listed in the table below. 

|               | 2FF - Mini SIM | 3FF - Micro SIM | 4FF - Nano SIM           |
| :------------ | :------------- | :-------------- | :----------------------- |
| **Height**    | 25mm           | 15mm            | 12.3mm ± 0.1 mm          |
| **Width**     | 15mm           | 12mm            | 8.8mm                    |
| **Thickness** | 0.76mm         | 0.76mm          | 0.67mm +0.03 mm/-0.07 mm |

1NCE IoT SIM Card Business are 3in1 plastic-backed SIMs which incorporate the standardized 2FF Mini, 3FF Micro and 4FF Nano form factors. The 1NCE SIMs are shipped in a half-size carrier to make handling and shipping of the breakout SIMs easier. Depending on the customer needs the IoT SIM Card Business can be carefully broken down into the needed form factor and also reassembled back up to 2FF Mini with the supplied adapters.

<Image
  align="center"
  alt="1NCE_4FF_SIM_Dimensions.png"
  caption="1NCE IoT SIM Card Business 4FF reference dimensions and pin assignment as of ETSI TS 102 221."
  src="/img/sim-cards/sim-cards-overview/sim-cards-iot-business/20aeb83-1NCE_4FF_SIM_Dimensions.png"
/>


As 4FF is the smallest form factor that minimizes the plastic-backed SIM Card to the bare IC, we will use it as reference for the pinout. The pinout is the same for all IoT SIM Card Businesses as the SIM IC is identical. Shown above is the pinout reference and dimensions of the 4FF SIM according to <a href="https://www.etsi.org/deliver/etsi_ts/102200_102299/102221/15.00.00_60/ts_102221v150000p.pdf" target="blank_">ETSI TS 102 221</a>. While the 1NCE IoT SIM Card Business 4FF and IoT SIM Chip Industrial form factor are different, the pinout of the actual ICs are the same. The pinout table references the pinout of the dimensional reference figure for the 4FF SIM Card.

<HTMLBlock>{`
<table style="width: 100%; border-collapse: collapse;">
<thead>
<tr>
  <th style="border: 1px solid #ddd; padding: 8px;">Contact Pin</th>
  <th style="border: 1px solid #ddd; padding: 8px;">Spec. Description</th>
  <th style="border: 1px solid #ddd; padding: 8px;">1NCE IoT SIM Card Business Pinout</th>
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

1NCE 3in1 IoT SIM Card Business Cards are packaged in a half-size breakout card to save on plastic wastage. This makes handling and shipping of the different SIM form factors easier. Each of these breakout cards, shown below, contains one 3in1 SIM. For easier identification, a barcode and numerical representation of the EAN code and the ICCID are printed on the back of the cards. When ordering low quantities of IoT SIM Card Business, the cards will be packaged and shipped in small plastic wrapped packages. For larger orders will be fulfilled by shipping boxes of 100 or 500 SIMs respectively. These boxes are packaged in sequence, lowest to highest ICCID with a label sticker indicating the first and last ICCID of the box.

<Image
  align="center"
  alt="1NCE_FlexSIM.png"
  caption="1NCE 3in1 IoT SIM Card Business inside the half-size breakout card used for easier shipping and packaging."
src="/img/sim-cards/sim-cards-overview/sim-cards-iot-business/a2dce8795d72eda003b894480f74b2ca4184cc2a229c63e32e0fc2a1dbf7baab-SIMCBusiness.png"
  sizing="50"
/>


***

# SIM ICCID Identification

Each SIM Card can be uniquely identified by the ICCID. This SIM identification is used throughout the 1NCE ecosystem to mark each unique SIM. The ICCID can be read by the hardware modem using an AT-Command or manufacturer specific request. For easier physical identification, each 1NCE IoT SIM Card Business has the ICCID of the particular SIM printed on the 4FF physical chip card.

***

# IoT SIM Card Business Specifications

SIM Cards for mobile network applications follow strict standards for the physical form factor as well as the technology and interfaces. 1NCE IoT SIM Card Business comply with these technical standard specifications. Besides the key standard compliances, SIM Cards are validated for specific environmental ranges in which they need to be operated in. The table below shows the most important 1NCE IoT SIM Card Business specifications that are relevant for the deployment of the 1NCE IoT SIM Card Business. Furthermore, references to the key standard compliances for the SIM interfaces are referenced.

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
          <th>1NCE IoT SIM Card Business (3in1)</th>
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
          }}>-25°C to +85°C</td>
        </tr>
        <tr>
          <td>Operating Voltages</td>
          <td style={{
            textAlign: 'center'
          }}>Class A, B and C (1.8V –5.0V ±10%)</td>
        </tr>
        <tr>
          <td>Data Retention Period</td>
          <td style={{
            textAlign: 'center'
          }}>min. 10 years</td>
        </tr>
        <tr>
          <td>Read/Write Cycles</td>
          <td style={{
            textAlign: 'center'
          }}>min. 500 000 cycles</td>
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

# IoT SIM Card Business Application Cases

As the plastic-backed IoT SIM Card Business remains the most commonly used form factor in the mobile communication field, this SIM serves as the ideal general-purpose solution for most off-the-shelf, ready-to-use IoT devices. The 3in1 form factor of the 1NCE IoT SIM Card Business is compatible with a wide range of devices which accept this standardized form factor. This form factor of SIM is easy to install, exchange, swappable between devices and ready for the IoT production environment. These key features make the 1NCE IoT SIM Card Business ideal for every stage of the IoT device life cycle, from early, flexible prototyping to deploying thousands of devices in the field. 

For any open questions about the detailed 1NCE IoT SIM Card Business product or more extensive help in selecting the right IoT SIM for the specific application case, feel free to contact us (<a href="https://1nce.com/en-eu/support" target="_blank">1NCE Contact</a>).
