---
title: SARA-R410M Network Registration
sidebar_position: 35
---
```powershell PowerShell
> AT 
OK

> AT+CFUN?

+CFUN: 1

OK

> AT+CFUN=1

OK

> AT+CPIN?

+CPIN: READY
OK

> AT+ICCID
ICCID: 8988XXXX66602XXX3347

> ATI 

Manufacturer: u-blox
Model: SARA-R410M-02B
Revision: L0.0.00.00.05.06 [Feb 03 2018 13:00:41]
SVN: 02
IMEI: 352753097892796

OK

> ATI9

L0.0.00.00.05.06,A.02.01

OK

> AT+CEREG=1

OK

> AT+COPS=0

OK
> AT+CEREG?

+CEREG: 1,5

OK

+CEREG: 2

+CEREG: 3

+CEREG: 5

> AT+CGDCONT= 1,"IP","iot.1nce.net","10.209.106.8",0,0,0,0

OK


```

# Preparation



For testing purposes, connect the SARA-R410M to a computer. The commands used in this guide will be issued via the serial interface towards the modem. Please setup the specific hardware device that these AT Commands can be sent to the device serial interface.
Further ensure that the 1NCE SIM is inserted correctly into the device.

# Check Module Communication

<!-- powershell@1-2 -->

Check that the module response to a basic 'AT' command. The device should return 'OK' as answer.

# Check Functionality

<!-- powershell@4-8 -->

Use 'AT+CFUN?' to check the functionality setting of the modem. '+CFUN: 1' should be returned, indicating that the modem is in the full operating mode.

# Activate Functionality

<!-- powershell@10-12 -->

If the prior command returns '+CFUN: 0', use 'AT+CFUN=1' to activate the full modem functionality.

# Check SIM PIN

<!-- powershell@14-17 -->

Use 'AT+CPIN?' to check if the SIM is ready to use. As the 1NCE SIM do not have a PIN set by default the modem should return '+CPIN: READY'.

If an error is returned, please check the SIM is inserted correctly or try the SIM in a smartphone.

# Check your ICCID

<!-- powershell@19,20 -->

The ICCID is a unique identifier that is assigned to every SIM card and is used to identify and authenticate the card with the mobile network.
N.B: your ICCID without the last digit "7"

# Check the modem version

<!-- powershell@24-36 -->

to request the firmware revision identification of a module. When you send this command to a module, it will respond with information about the firmware version and other details.

# Enable network registration status reports

<!-- powershell@38-40 -->

When enabled, the module will report its current registration status to the host device whenever it changes.

# Automatic network selection

<!-- powershell@42-44 -->

In this mode, the module will scan all available networks and automatically select the one with the strongest signal.

# Check the network registration status

<!-- powershell@45-55 -->

The response to these commands indicates different registration status.

# Set the APN

<!-- powershell@57-59 -->

set the Access Point Name (APN) for the network connection.
