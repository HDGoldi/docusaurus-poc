---
title: SIM Knowledge
description: The foundations about IoT SIM Cards.
---
Many associate a tiny piece of plastic, which has an embedded chip, with the term SIM card. A chip that is inserted into a mobile phone or other modem to allow a specific device to connect to some sort of mobile network for internet and messaging connectivity. As usual, there is more than meets the eye when it comes to the details of a SIM. From a basic point of view, a Subscriber Identity Module (SIM) is an Integrated Circuit (IC) with a Card Operating System (COS) which stores security features used to authenticate the subscriber devices in a mobile network.

<Image align="center" alt="854" border={false} caption="Overview of the different 1NCE IoT SIM form factors." title="Developer_Hub_SIM_Cards.png" src="https://files.readme.io/0b742fa-sim.png" width="50%" />

This data includes a unique serial number (ICCID), International Mobile Subscriber Identity (IMSI), security authentication, and ciphering information to authenticate the SIM as a valid subscriber to a mobile network. Further, temporary local network information, access service list, Personal Identification Number (PIN), and a Personal Unblocking Key (PUK) is stored on a SIM.  
The following sections will cover the basics of some SIM parameters that show up as part of the 1NCE Services. It is important to understand their role in the 1NCE ecosystem, as these parameters are useful for general information, device identification, troubleshooting and security.

***

# Personal Identification Number (PIN)

All 1NCE SIM cards are preassigned a 6-digit Personal Identification Number (PIN), which is disabled by default. The SIM cards are ready to use and no PIN validation needs to take place because of it. For devices controlled by AT-Commands, it is a good idea to use the general AT-Command 'AT+CPIN?' to test if the 1NCE SIM card is ready for operation. This tests if the SIM card is ready for operation when booting up a modem with a 1NCE SIM inserted. The AT-Command should return 'READY', indicating that the SIM is recognized and ready for operation.

***

# Integrated Circuit Card Identifier (ICCID)

SIM cards are mainly identified by their Integrated Circuit Card Identifier (ICCID), an identifier of the actual SIM card chip itself. ICCIDs are also used to identify embedded SIM (eSIM) profiles. This ID can be up to 23 digits long, including a check digit calculated using the Luhn algorithm. The ICCID conforms to the <a target="_blank" href="https://www.itu.int/rec/T-REC-E.118/en">ITU E.118</a> numbering standard.  
Note that an extra digit is sometimes returned using AT-Commands, but this is not an official part of the ICCID. The ICCID is used throughout the 1NCE ecosystem (1NCE Portal, API, Data Streamer, etc.) as a common parameter to identify each SIM provided by 1NCE. The following table shows the structural components of the ICCID for 1NCE SIMs.

<div class="rdmd-table">
  <div class="rdmd-table-inner">
    <table>
      <thead>
        <tr>
          <th colspan="2">Component</th>
          <th>Length & Example</th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <td colspan="2"><b>ICCID</b><br />Integrated Circuit Card Identifier</td>
          <td>16 - 23 Digits:<br /><i>89 88 280 666xxxxxxxx x</i><br /><i>89 88 228 0666xxxxxxx x</i></td>
        </tr>

        <tr>
          <td colspan="2"><b>IIN</b><br />Issuer Identification Number</td>
          <td>4 - 9 Digits:<br /><i>89 88 228</i><br /><i>89 88 280</i></td>
        </tr>

        <tr>
          <td> </td>
          <td><b>MII</b><br />Major Industry Identifier</td>
          <td>2 Digits:<br /><i>89</i> - Telecommunications</td>
        </tr>

        <tr>
          <td> </td>
          <td><b>CC</b><br />Country Code</td>
          <td>1 - 3 Digits:<br /><i>88</i> - No Geolocation (IoT Application)</td>
        </tr>

        <tr>
          <td> </td>
          <td><b>II</b><br />Issuer Identifier</td>
          <td>1 - 4 Digits:<br /><i>228</i> - 1NCE<br /><i>280</i> - 1NCE</td>
        </tr>

        <tr>
          <td colspan="2"><b>SIM - ID</b><br />ID Number</td>
          <td>11 - 13 Digits:<br /><i>666xxxxxxxx</i><br /><i>0666xxxxxxx</i></td>
        </tr>

        <tr>
          <td colspan="2"><b>C</b><br />Checksum</td>
          <td>1 Digit:<br /><i>x</i> - Luhn Algorithm</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

***

# International Mobile Subscriber Identity (IMSI)

The International Mobile Subscriber Identity (IMSI) identifies SIM cards uniquely by their individual operator in a cellular network. The IMSI is stored as a 64-bit field and is communicated to the connected cellular network. In the core of a mobile operator network, the IMSI is used as main identification for obtaining further customer and device specific data. The IMSI is used across all global mobile networks. The IMSI conforms to the <a target="_blank" href="https://www.itu.int/rec/T-REC-E.212/en">ITU E.212</a> numbering standard.  
Not to confuse the IMSI with the ICCID, the ICCID is the id of the physical SIM, while the IMSI is part of a profile placed on the SIM. In the 1NCE ecosystem, the IMSI is often found alongside the ICCID. The following table shows the structural components of the IMSI for 1NCE SIMs.

<div class="rdmd-table">
  <div class="rdmd-table-inner">
    <table>
      <thead>
        <tr>
          <th colspan="2">Component</th>
          <th>Length & Example</th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <td colspan="2"><b>IMSI</b><br />International Mobile Subscriber Identity</td>
          <td>13 - 15 Digits:<br /><i>901 40 51000xxxxx</i></td>
        </tr>

        <tr>
          <td> </td>
          <td><b>MCC</b><br />Mobile Country Code</td>
          <td>3 Digits:<br /><i>901</i> - Worldwide Shared Mobile Country Code<br /><i>454</i> - Hong Kong</td>
        </tr>


        <tr>
          <td> </td>
          <td><b>MSISN</b><br />Mobile Subscriber ISDN Number</td>
          <td>8 - 9 Digits:<br /><i>51000xxxxx</i> - Mobile Subscriber ISDN Number</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

## MCC and MNC

The Mobile Country Code (MCC) and Mobile Network Code (MNC) identify a country of domicile and a operator of that network in this country. Both together result in the Public Land Mobile Network (PLMN) code of the mobile subscriber. Since the 1NCE SIM cards are not bound to a real country or network these values are defined as:  MCC-901 and MNC-40.  
The MCC-901 has a special meaning, i.e. this is a shared Mobile Country Code which is used worldwide instead of identifying a certain country. Hence, 1NCE as IoT-MNO has reserved the PLMN 901-40 for their purposes and uses it for the standard 1NCE product.

***

# Mobile Station International Subscriber Directory Number (MSISDN)

The Mobile Station International Subscriber Directory Number (MSISDN) is used together with the IMSI to uniquely identify a SIM subscription in the global mobile network. A normal non-IoT carrier uses the MSISDN for routing voice calls to a subscribed SIM. While the IMSI for a specific profile on a SIM does not change over time, the MSISDN can change. The MSISDN format is defined in the <a target="_blank" href="https://www.itu.int/rec/T-REC-E.164/en">ITU-T E.164</a>. In the 1NCE ecosystem, the MSISDN can be found in the detail properties of a SIM using the API or Data Streamer Service. Compared to the ICCID, IMSI or IMEI, the MSISDN plays less of an important role for the 1NCE IoT use cases.

***

# International Mobile Equipment Identity (IMEI)

Certain parameters reported in the 1NCE ecosystem are not sourced from the 1NCE SIM but rather relate to the specific device used in conjunction with the SIM card. Such a parameter is the International Mobile Equipment Identity (IMEI). It is a unique number for the identification of a mobile SIM device modem. Each standardized modem that uses any type of SIM to connect to a mobile network operator has a unique IMEI.  
The IMEI, 15 digits: 14 + check digit, or IMEISV, 16 digits: 14 + two (software version), consists of information on the origin, model, and serial number of the device. The structure of the IMEI/SV is specified in <a target="_blank" href="https://www.etsi.org/deliver/etsi_ts/123000_123099/123003/16.06.00_60/ts_123003v160600p.pdf">3GPP TS 23.003</a>. In the 1NCE ecosystem, the IMEI/SV is used to identify individual devices and manufacturers. In the 1NCE Data Streamer and API, the IMEI/SV for some roaming operators might have an additional 'f' at the end of the IMEI.

<div class="rdmd-table">
  <div class="rdmd-table-inner">
    <table>
      <thead>
        <tr>
          <th colspan="2">Component</th>
          <th>Length & Example</th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <td colspan="2"><b>IMEI</b><br />International Mobile Equipment Identity</td>
          <td>15 - 16 Digits:<br /><i>86 995103 xxxxxx x</i> - IMEI<br /><i>86 995103 xxxxxx xx</i> - IMEISV</td>
        </tr>

        <tr>
          <td> </td>
          <td><b>TAC</b><br />Type Allocation Code</td>
          <td>8 Digits:<br /><i>86 995103</i> - Example of SIM 7000G</td>
        </tr>

        <tr>
          <td> </td>
          <td><b>SNR</b><br />Serial Number</td>
          <td>6 Digits:<br /><i>xxxxxx</i> - Unique per Device</td>
        </tr>

        <tr>
          <td> </td>
          <td><b>CD/SVN</b><br />Check Digit or Software Version</td>
          <td>1 - 2 Digits:<br /><i>x</i> - Check Digit<br /><i>xx</i> - Software Version Number</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

## IMEI Lock

Each device in a mobile network has an IMEI number which identifies the hardware uniquely when connecting to a network. 1NCE offers the functionality to lock a given device to the SIM card using the IMEI.

If the IMEI lock is enabled during an active PDP data session, the current session will be dropped and the device forced to reconnect instantly. This ensures that the currently in use device is locked to the SIM and there is no possibility to change the SIM to another device after enabling the IMEI lock feature.

Once the IMEI Lock option is enabled, the network will link the IMEI to the specific SIM card. Subsequent connection attempts with this SIM card using another device with different IMEI are blocked. This feature can be disabled and enabled by the customer for each SIM card individually either via the 1NCE Portal or 1NCE API. For the IMEI Lock functionality the IMEISV is used. The IMEISV is derived by the IMEI and includes the additional software version parameter.
