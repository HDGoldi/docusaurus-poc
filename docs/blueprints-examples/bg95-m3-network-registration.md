---
title: BG95-M3 Network Registration
---
```powershell PowerShell
> AT
OK


> AT+CFUN?
+CFUN: 1


> AT+CFUN=1
OK


> AT+CPIN?
+CPIN: READY
OK

> AT+QCCID
+QCCID: xxxxxx8066602774xxxx

> AT+COPS=?
+COPS: (2,"Telekom.de","TDG","26201",9),(2,"Telekom.de","TDG","26201",9),(2,"Telekom.de","TDG","26201",9),,(0,1,2,3,4),(0,1,2)

OK

> AT+COPS=0
OK

>AT+COPS=4,2,"26202"
OK

> AT+COPS=1,2,"26201"
OK

> AT+COPS?
+COPS: 0,0,"Telekom.de",9

> AT+CEREG?
+CEREG: 0,5

> AT+CREG?
+CREG: 0,5

> AT+CGREG?
+CGREG: 0,4

> AT+CSQ
+CSQ: 2,99

> AT+COPS?
+COPS: 0,0,"Telekom.de",9

> AT+QICSGP=1,1,"iot.1nce.net","","",0
OK

> AT+QIACT?
OK

> AT+QIACT=1
OK

> AT+QIACT?
+QIACT: 1,1,1,"10.209.106.8"
OK

/* connect to UDP server */
> AT+QIOPEN=1,0,"UDP","udp.os.1nce.com",4445,0,1
OK
+QIOPEN: 0,0

> AT+QISEND=0
> Welcome to 1NCE OS
SEND OK

```

# Preparation



For testing purposes, connect the BG95 to a computer. The commands used in this guide will be issued via the serial interface towards the modem. Please setup the specific hardware device that these AT Commands can be sent to the device serial interface.
Further ensure that the 1NCE SIM is inserted correctly into the device.

# Check Module Communication

<!-- powershell@1,2 -->

Check that the module response to a basic 'AT' command. The device should return 'OK' as answer.

# Check Functionality

<!-- powershell@5,6 -->

Use 'AT+CFUN?' to check the functionality setting of the modem. '+CFUN: 1' should be returned, indicating that the modem is in the full operating mode.

# Activate Functionality

<!-- powershell@9,10 -->

If the prior command returns '+CFUN: 0', use 'AT+CFUN=1' to activate the full modem functionality.

# Check SIM PIN

<!-- powershell@13,14,15 -->

Use 'AT+CPIN?' to check if the SIM is ready to use. As the 1NCE SIM do not have a PIN set by default the modem should return '+CPIN: READY'.

If an error is returned, please check the SIM is inserted correctly or try the SIM in a smartphone.

# Check your ICCID

<!-- powershell@17,18 -->

The ICCID is a unique identifier that is assigned to every SIM card and is used to identify and authenticate the card with the mobile network.

# PLMN Query

<!-- powershell@20-23 -->

Use 'AT+COPS=?' to query all Public Land Mobile Networks that can be received at the given location. Note this scan for operators can take some time to respond. In the returned result, all available network operators are listed with the long, short an numeric identifiers.

# PLMN Automatic Selection

<!-- powershell@25,26 -->

To let the BG95 automatically choose which operator to connect to, issue 'AT+COPS=0'. This sets the registration process to automatic.

# PLMN Manual/Automatic Selection

<!-- powershell@28,29 -->

Manual operator selection with a fallback to automatic is a good choice to ensure automatic failover in case of an outage. With 'AT+COPS=4,2,"26202"', manual/automatic mode (4) is selected and the numeric identifier setting (2) is used to set operator (26202). The numeric id of the operator needs to be set based on the preferred network from 'AT+COPS=?'.

# PLMN Manual Selection

<!-- powershell@31,32 -->

Manual operator selection without a fallback to automatic is generally not recommended due to the missing failover in case of an outage. With 'AT+COPS=1,2,"26201"', manual mode (1) is selected and the numeric identifier setting (2) is used to set operator (26201). The numeric id of the operator needs to be set based on the preferred network from 'AT+COPS=?'.

# PLMN Connection Process

<!-- powershell@34,35 -->

After setting a registration process with 'AT+COPS=...', the modem will try to connect to the Public Land Mobile Network. This can take some time to respond. Afterwards, the connection can be checked with 'AT+COPS?' and 'AT+CREG?' as usual.

# Warm Up



The BG95 can be configured for manual, automatic or manual/automatic network registration. For more details see the BG95 AT Command manual from the manufacturer.

# Check Signal Quality

<!-- powershell@46,47 -->

+CSQ: <rssi>,<cber>
<rssi> is the received signal strength indication, expressed in dBm. The higher the value, the stronger the signal.
<cber> is the channel bit error rate, expressed as a percentage. The lower the value, the better the channel quality.

# Check the network registration status

<!-- powershell@37-45 -->

The response to these commands indicates whether the module is registered with the network or not.

# Check Network Operator

<!-- powershell@34,35 -->

This command returns the current operators and their status, and allows automatic network
selection.

# Set the APN

<!-- powershell@52-53 -->

Set the Access Point Name (APN) for the network connection.

# 1NCE OS UDP

<!-- powershell@65-73 -->

To connect to the 1NCEOS network and send a UDP message using AT commands
for Send After receiving ">", input data (TEST), the maximum length of the data is 1460, the data beyond 1460 will be omitted. Then use <CTRL+Z> to send data. When receive SEND OK means the data has been sent
