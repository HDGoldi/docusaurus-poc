---
title: SIM800L MO-SMS
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


> AT+CMGS="+49123456"
> Test SMS
> 1A		// HEX-Encoded followed by Newline

+CMGS: 25
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

# Select SMS Format

<!-- curl@40-41 -->

Specify the SMS format to 'Text Mode' using 'AT+CMGF=1'

# Start MO-SMS Message

<!-- curl@48 -->

Start the MO-SMS message by calling 'AT+CMGS="+49123456". This will start the SMS text mode to send a message. The target phonenumber can be left empty or filled with any number. The 1NCE SMS Service ignores this number and forwards the SMS via the SMS Forwarder. The command will not return an OK response, it waits for the message input.

# Write MO-SMS Message

<!-- curl@49 -->

The modem is now in the text mode an will accept ASCII Numeric values for the SMS. It will not return any response until the message is finished. Please keep the SMS size limitations in mind.

# Finish MO-SMS Message

<!-- curl@50-53 -->

To finish, exit the text mode and send the SMS message, '1a' needs to be send encoded as HEX towards the modem. The modem will respond with '+CMGS: <message_length>' and an OK if successful.

# Wrap Up



The MO-SMS was sent and can be received with the 1NCE SMS Forwarding service or viewed in the 1NCE Portal.
