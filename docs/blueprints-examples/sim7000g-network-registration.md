---
title: SIM7000G Network Registration
---
```curl AT Commands
> AT
OK


> AT+CFUN?
+CFUN: 1


> AT+CFUN=1
+CPIN: READY
OK
SMS Ready
Call Ready


> AT+CPIN?
+CPIN: READY
OK


> AT+COPS=?
+COPS: (1,"Telekom.de","TDG","26201",0),(1,"Vodafone.de","Vodafone","26202",0),(1,"o2 - de","o2 - de","26203",0),(2,"o2 - de","o2 - de","26203",7),(1,"o2 - de","o2 - de","26203",9),(1,"Vodafone.de","Vodafone","26202",9),(1,"Telekom.de","TDG","26201",9),,(0,1,2,3,4),(0,)
OK


> AT+COPS=0,0
OK


> AT+COPS=4,2,"26202"
OK


> AT+COPS=1,2,"26201"
OK


> AT+COPS?
+COPS: 1,2,"26201",9
OK


> AT+CPSI?
+CPSI: LTE NB-IOT,Online,262-01,0xE2A4,37356039,446,EUTRAN-BAND8,3740,0,0,-3,-100,-96,15


> AT+COPS=3,0
OK


> AT+COPS?
+COPS: 1,0,"D1"
OK
```

# Preperation



For testing purposes, connect the SIM7000G (1529B05SIM7000G) to a computer. The commands used in this guide will be issued via the serial interface towards the modem. Please setup the specific hardware device that these AT Commands can be sent to the device serial interface.
Further ensure that the 1NCE SIM is inserted correctly into the device.

# Check Module Communication

<!-- curl@1-2 -->

Check that the module response to a basic 'AT' command. The device should return 'OK' as answer.

# Check Functionality

<!-- curl@5-6 -->

Use 'AT+CFUN?' to check the functionality setting of the modem. '+CFUN: 1' should be returned, indicating that the modem is in the full operating mode.

# Activate Functionality

<!-- curl@9-13 -->

If the prior command returns '+CFUN: 0', use 'AT+CFUN=1' to activate the full modem functionality.

# Check SIM PIN

<!-- curl@16-18 -->

Use 'AT+CPIN?' to check if the SIM is ready to use. As the 1NCE SIM do not have a PIN set by default the modem should return '+CPIN: READY'.

If an error is returned, please check the SIM is inserted correctly or try the SIM in a smartphone.

# PLMN Query

<!-- curl@21-23 -->

Use 'AT+COPS=?' to query all Public Land Mobile Networks that can be received with the SIM7000G at the given location. Note this scan for operators can take some time to respond. In the returned result, all avaliable network operators are listed with the long, short an numeric identifiers and avaliable Radio Access Technologies.

# PLMN Automatic Selection

<!-- curl@26-27 -->

To let the SIM7000G automatically choose which operator to connect to, issue 'AT+COPS=0,0'. This sets the registration process to automatic. The preferred RAT selection will still apply.

# PLMN Manual/Automatic Selection

<!-- curl@30-31 -->

Manual operator selection with a fallback to automatic is a good choice to ensure automatic failover in case of an outage. With 'AT+COPS=4,2,"26202"', manual/automatic mode (4) is selected and the numeric identifier setting (2) is used to set operator (26202). The numeric id of the operator needs to be set based on the preferred network from 'AT+COPS=?'.

# PLMN Manual Selection

<!-- curl@34-35 -->

Manual operator selection without a fallback to automatic is generally not recommended due to the missing failover in case of an outage. With 'AT+COPS=1,2,"26201"', manual mode (1) is selected and the numeric identifier setting (2) is used to set operator (26201). The numeric id of the operator needs to be set based on the preferred network from 'AT+COPS=?'.

# PLMN Connection Process

<!-- curl@38-44 -->

After setting a registration process with 'AT+COPS=...', the modem will try to connect to the Public Land Mobile Network. This can take some time to respond with 'OK'. Afterwards, the connection can be checked with 'AT+COPS?' and 'AT+CGREG?' for GSM or 'AT+CEREG?' for LTE as usual. 'AT+CPSI?' can also be used to check the current connection.

# PLMN Format Selection

<!-- curl@47-53 -->

The format of the current operator listing returned by 'AT+COPS?' can be set with 'AT+COPS=3,`<format>`'. Valid formats are (0) long, (1) short, (2) numeric.

# Wrap Up



The SIM7000G can be configured for manual, automatic or manual/automatic network registration. For more details see the SIM700G AT Command manual from the manufacturer.
