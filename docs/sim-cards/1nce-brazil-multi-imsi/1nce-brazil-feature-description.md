---
title: Feature Description
description: High Level Description of the 1NCE Brazil SIM
draft: true
---
The multi-IMSI SIM Card includes an applet that can manage the usage of up to three different IMSIS, where:

* IMSI 1 is always a unique IMSI from 1NCE Brazil (72468) and would be the default IMSI populated in EFIMSI at the time of production 
* Second IMSI belongs to 1NCE Global IMSI (90140) and should be updated on a bimonthly basis considering a pool of 3 different 1NCE Global IMSI
* IMSI 3 can provide an additional IMSI for the switching mechanism. (for future use cases) 

The below picture describes the overall concept of the SIM set and architecture. 

<div style={{textAlign: 'center'}}>
![Overall Multi-IMSI Applet architecture](/img/sim-cards/1nce-brazil-multi-imsi/1nce-brazil-feature-description/a8834f18e5d73b7ad2a89a7f2868c531c987a09db1740b98632c6754734d3a2c-overal_multi-imsi.png)
</div>

<br />

The IMSI 1 is always 1NCE Brazilian IMSI, which is 724-68, while IMSI 2 is the 1NCE Global IMSI. IMSI 3 is reserved for future uses, and **has no mechanism to update its value like IMSI 2**. 

It is expected that the applet switches between IMSI 1, IMSI 2, and IMSI 3 (if it exists) considering the following criteria:

* Lack of network service (NO SERVICE)
* Lack of Data Resources (LIMITED SERVICE)
* Timer exceeds 24 hours connected in IMSI 2 
* MCC # 724

The IMSI 2 can assume three possible IMSIS taken from the pool, considering that each IMSI should be used up to 60 days, as shown below.

<div style={{textAlign: 'center'}}>
![Update IMSI 2 cycling process](/img/sim-cards/1nce-brazil-multi-imsi/1nce-brazil-feature-description/11f72a098dfe0fa10383846819b081ca5e3fc6a06f83d2ca9f6420c9fee1a29a-Picture1.jpg)
</div>

The IMSI 3 will be initially available for additional IMSIS that might be added in the future (e.g.: additional IMSI from a local Brazilian MVNO). There’s no need to have additional mechanism to update IMSI3.

Note that the applet should have to:

1. Switch between different IMSIS (IMSI1, IMSI 2(1,2 or 3), and IMSI 3.
2. IMSI 2 should assume up to 3 different IMSI values according to the timeframe of the applet, considering that each IMSI2 (let's call IMSI 21, IMSI 22, and IMSI 23) should be used up to 60 days.

The reference for counting days will be the timeframe retrieved from the command PROVIDE LOCATION INFORMATION.

3. An additional OTA mechanism will allow 1NCE to send a common OTA campaign with the message CHANGE in case the TIME COUNTING doesn’t work for specific IOT devices.
4. The capability to update IMSI 2 according to the counting days will be the timeframe retrieved from the command PROVIDE LOCATION INFORMATION.

The electric profile to be used as the STANDARD profile will be the 1NCE Brazil Global electric profile, based on the 1NCE Global profile with the changes required to access the CLARO BRAZIL network. IMSI shadows will be stored in the APPLET (3 IMSIS), which will update the STANDARD Electric Profile. 

The Figure below describes the overall mechanisms to be considered for the applet implementation.

<div style={{textAlign: 'center'}}>
![Overall mechanisms for IMSI switching](/img/sim-cards/1nce-brazil-multi-imsi/1nce-brazil-feature-description/2a099bb7ce218b9dd150c1791a4dc65c8e2c023c5d2d594de02cab3bc369f8d5-Picture1.png)
</div>
