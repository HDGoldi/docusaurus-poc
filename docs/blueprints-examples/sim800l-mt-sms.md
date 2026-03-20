---
title: SIM800L MT-SMS
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


> AT+COPS=0,0
OK


> AT+CREG?
+CREG: 0,2
OK
  

> AT+CREG?
+CREG: 0,5
OK  
 
 
> AT+COPS?
+COPS: 0,0,"D1"
OK
  
  
> AT+CMGF=1
OK


> AT+CSCS="GSM"
OK

  
+CMTI: "SM",1

+CMTI: "SM",2


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



For testing purposes, connect the SIM800L (1418B05SIM800L24) to a computer. The commands used in this guide will be issued via the serial interface towards the modem. Please setup the specific hardware device that these AT Commands can be sent to the device serial interface.
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

# PLMN Selection

<!-- curl@21-22 -->

Use 'AT+COPS=0,0' to set the Public Land Mobile Network selection of the modem to automatic. This will ensure that the modem will pick the best operator based on the currently available selection at the given location.

# Network Registration

<!-- curl@25-32 -->

With 'AT+CREG?' the network registration status can be queried. '+CREG: 0,2' indicates that the device is still searching for a network. Use this command to query the status repeatedly until '+CREG: 0,5' indicates that the modem is connected to a network and is roaming. 
1NCE SIMs are always roaming as they do not have a home country set for the IoT use case. 
If the modem does not connect within a couple of minutes, please check the response code in the AT Command manual of the SIM800L and possibly test the SIM in a smartphone to check the coverage.

# Check Registered Network

<!-- curl@35-37 -->

With 'AT+COPS?' it can be checked to which network the modem is currently attached. In the shown case the modem is attached to the Telekom Germany network.
It is always recommended to check the network registration before running further commands to ensure the modem is connected.

# Set SMS Format

<!-- curl@40-45 -->

Specify the format and RAT for SMS.

# Issue MT-SMS



A SMS destined for a specifc device with a 1NCE SIM can be send using the Connectivity Management Platform website or through an API call. See the Developer Hub Guide for how to issue a MT-SMS. A SMS can be send while the device is not connected to the network. It will be delivered and received as soon as the device reconnects to the network. In this example, the source address was '123'.

# Receive MT-SMS

<!-- curl@48-50 -->

After connecting to the network, wait until the issued MT-SMS is received by the device. By default this is indicated by '+CMTI: "SM",`<number_unread>`' returned from the SIM800L.

# Read All MT-SMS

<!-- curl@53-61 -->

All SMS messages stored can be listed through 'AT+CMGL="ALL"'. The 'ALL' parameter can be changed according to the AT Command manual.

# Read Specific MT-SMS

<!-- curl@64-69 -->

One specific MT-SMS can be read using 'AT+CMGR=`<sms_id>`,0', where the `<sms_id>` is the storage id of the message of interest.

# Delete Specific MT-SMS

<!-- curl@72-73 -->

Stored SMS messages can be deleted using 'AT+CMGD=`<sms_id>`,0'

# Wrap Up



MT-SMS messages issued through the API of 1NCE portal, received by the SIM800L can be read using a few simple AT Commands. Setting up the APN is not required for using SMS.
