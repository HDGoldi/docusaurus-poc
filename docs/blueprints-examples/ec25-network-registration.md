---
title: EC25 Network Registration
---
```curl AT Commands
> AT
OK


> AT+CFUN?
+CFUN: 1


> AT+CFUN=1
OK


> AT+CPIN?
+CPIN: READY
OK


> AT+COPS=?
+COPS: (1,"Telekom.de","TDG","26201",0),(1,"o2 - de","o2 - de","26203",0),(1,"Vodafone.de","Vodafone","26202",0),(1,"o2 - de","o2 - de","26203",2),(1,"o2 - de","o2 - de","26203",7),(2,"Telekom.de","TDG","26201",7),,(0-4),(0-2)
OK


> AT+COPS=0,0
OK


> AT+COPS=4,2,"26202"
OK


> AT+COPS=1,2,"26201"
OK


> AT+COPS?
+COPS: 1,2,"26201",7
OK


> AT+CREG?
+CREG: 0,5
OK


> AT+COPS=3,0
OK


> AT+COPS?
+COPS: 1,0,"Telekom.de 1nce.net",0
OK
```

# Preperation



For testing purposes, connect the EC25 (EC25EFAR06A08M4G) to a computer. The commands used in this guide will be issued via the serial interface towards the modem. Please setup the specific hardware device that these AT Commands can be sent to the device serial interface.
Further ensure that the 1NCE SIM is inserted correctly into the device.

# Check Module Communication

<!-- curl@1-2 -->

Check that the module response to a basic 'AT' command. The device should return 'OK' as answer.

# Check Functionality

<!-- curl@5-6 -->

Use 'AT+CFUN?' to check the functionality setting of the modem. '+CFUN: 1' should be returned, indicating that the modem is in the full operating mode.

# Activate Functionality

<!-- curl@9-10 -->

If the prior command returns '+CFUN: 0', use 'AT+CFUN=1' to activate the full modem functionality.

# Check SIM PIN

<!-- curl@13-15 -->

Use 'AT+CPIN?' to check if the SIM is ready to use. As the 1NCE SIM do not have a PIN set by default the modem should return '+CPIN: READY'.

If an error is returned, please check the SIM is inserted correctly or try the SIM in a smartphone.

# PLMN Query

<!-- curl@18-20 -->

Use 'AT+COPS=?' to query all Public Land Mobile Networks that can be received with the EC25 at the given location. Note this scan for operators can take some time to respond. In the returned result, all avaliable network operators are listed with the long, short an numeric identifiers and avaliable Radio Access Technologies.

# PLMN Automatic Selection

<!-- curl@23-24 -->

To let the EC25 automatically choose which operator to connect to, issue 'AT+COPS=0,0'. This sets the registration process to automatic. The preferred RAT selection will still apply.

# PLMN Manual/Automatic Selection

<!-- curl@27-28 -->

Manual operator selection with a fallback to automatic is a good choice to ensure automatic failover in case of an outage. With 'AT+COPS=4,2,"26202"', manual/automatic mode (4) is selected and the numeric identifier setting (2) is used to set operator (26202). The numeric id of the operator needs to be set based on the preferred network from 'AT+COPS=?'.

# PLMN Manual Selection

<!-- curl@31-32 -->

Manual operator selection without a fallback to automatic is generally not recommended due to the missing failover in case of an outage. With 'AT+COPS=1,2,"26201"', manual mode (1) is selected and the numeric identifier setting (2) is used to set operator (26201). The numeric id of the operator needs to be set based on the preferred network from 'AT+COPS=?'.

# PLMN Connection Process

<!-- curl@35-42 -->

After setting a registration process with 'AT+COPS=...', the modem will try to connect to the Public Land Mobile Network. This can take some time to respond with 'OK'. Afterwards, the connection can be checked with 'AT+COPS?', 'AT+CREG?' and 'AT+CGREG?' specific for GSM or 'AT+CEREG?' for LTE.

# PLMN Format Selection

<!-- curl@45-51 -->

The format of the current operator listing returned by 'AT+COPS?' can be set with 'AT+COPS=3,`<format>`'. Valid formats are (0) long, (1) short, (2) numeric.

# Wrap Up



The EC25 can be configured for manual, automatic or manual/automatic network registration. For more details and options see the EC25 AT Command manual from the manufacturer.
