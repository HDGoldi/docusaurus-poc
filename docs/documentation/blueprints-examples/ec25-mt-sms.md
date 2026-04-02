---
title: EC25 MT-SMS
sidebar_position: 25
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


> AT+COPS=0,0
OK


> AT+CEREG?
+CREG: 0,2
OK
  

> AT+CEREG?
+CREG: 0,5
OK  


> AT+CGREG?
+CREG: 0,5
OK 


> AT+CGREG?
+CREG: 0,5
OK 

 
> AT+COPS?
+COPS: 0,0,"Telekom.de 1nce.net",7
OK
  
  
> AT+CMGL="ALL"

+CMGL: 1,"REC UNREAD","123","","21/06/22,10:13:29+00"
MT-SMS 01 Test

+CMGL: 2,"REC UNREAD","123","","21/06/22,10:13:45+00"
MT-SMS 02

OK


> AT+CMGR=1,0

+CMGR: "REC READ","123","","21/06/22,10:13:29+00"
MT-SMS 01 Test

OK


> AT+CMGD=1,0

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

# PLMN Selection

<!-- curl@18-19 -->

Use 'AT+COPS=0,0' to set the Public Land Mobile Network selection of the modem to automatic. This will ensure that the modem will pick the best operator based on the currently available selection at the given location.

# Network Registration

<!-- curl@22-39 -->

With 'AT+CEREG?' or 'AT+CGREG?' the network registration status can be queried denpendent on the used RAT (LTE or GSM). '+C(E/G)REG: 0,2' indicates that the device is still searching for a network. Use this command to query the status repeatedly until '+C(E/G)REG: 0,5' indicates that the modem is connected to a network and is roaming. 
1NCE SIMs are always roaming as they do not have a home country set for the IoT use case. 
If the modem does not connect within a couple of minutes, please check the response code in the AT Command manual of the EC25 and possibly test the SIM in a smartphone to check the coverage.

# Check Registered Network

<!-- curl@42-44 -->

With 'AT+COPS?' it can be checked to which network the modem is currently attached. In the shown case the modem is attached to the Telekom Germany network.

# Issue MT-SMS



A SMS destined for a specifc device with a 1NCE SIM can be send using the Connectivity Management Platform website or through an API call. See the Developer Hub Guide for how to issue a MT-SMS. A SMS can be send while the device is not connected to the network. It will be delivered and received as soon as the device reconnects to the network. In this example, the source address was '123'.

# Receive MT-SMS



After connecting to the network, wait until the issued MT-SMS is received by the device.

# Read All MT-SMS

<!-- curl@47-55 -->

All SMS messages stored can be listed through 'AT+CMGL="ALL"'. The 'ALL' parameter can be changed according to the AT Command manual.

# Read Specific MT-SMS

<!-- curl@58-63 -->

One specific MT-SMS can be read using 'AT+CMGR=`<sms_id>`,0', where the `<sms_id>` is the storage id of the message of interest.

# Delete Specific MT-SMS

<!-- curl@66-68 -->

Stored SMS messages can be deleted using 'AT+CMGD=`<sms_id>`,0'

# Wrap Up



MT-SMS messages issued through the API of 1NCE portal, received by the EC25 can be read using a few simple AT Commands. Setting up the APN is not required for using SMS.
