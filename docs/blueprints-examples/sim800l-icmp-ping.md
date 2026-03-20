---
title: SIM800L ICMP Ping
---
```c AT-Commands
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
  
> AT+CSTT="iot.1nce.net","",""
OK


> AT+CIICR
OK


> AT+CIFSR
x.x.x.x


> AT+CIPPING="www.1nce.net"
+CIPPING: 1,"142.250.186.99",1,112
+CIPPING: 2,"142.250.186.99",1,112
+CIPPING: 3,"142.250.186.99",1,112
+CIPPING: 4,"142.250.186.99",1,112


> AT+CIPSHUT
SHUT OK
```

# Preperation



For testing purposes, connect the SIM800L (1418B05SIM800L24) to a computer. The commands used in this guide will be issued via the serial interface towards the modem. Please setup the specific hardware device that these AT Commands can be sent to the device serial interface.
Further ensure that the 1NCE SIM is inserted correctly into the device.

# Check Module Communication

<!-- c@1-2 -->

Check that the module response to a basic 'AT' command. The device should return 'OK' as answer.

# Check Functionality

<!-- c@5-6 -->

Use 'AT+CFUN?' to check the functionality setting of the modem. '+CFUN: 1' should be returned, indicating that the modem is in the full operating mode.

# Activate Functionality

<!-- c@9-13 -->

If the prior command returns '+CFUN: 0', use 'AT+CFUN=1' to activate the full modem functionality.

# Check SIM PIN

<!-- c@16-18 -->

Use 'AT+CPIN?' to check if the SIM is ready to use. As the 1NCE SIM do not have a PIN set by default the modem should return '+CPIN: READY'.

If an error is returned, please check the SIM is inserted correctly or try the SIM in a smartphone.

# PLMN Selection

<!-- c@21-22 -->

Use 'AT+COPS=0,0' to set the Public Land Mobile Network selection of the modem to automatic. This will ensure that the modem will pick the best operator based on the currently available selection at the given location.

# Network Registration

<!-- c@25-32 -->

With 'AT+CREG?' the network registration status can be queried. '+CREG: 0,2' indicates that the device is still searching for a network. Use this command to query the status repeatedly until '+CREG: 0,5' indicates that the modem is connected to a network and is roaming. 
1NCE SIMs are always roaming as they do not have a home country set for the IoT use case. 
If the modem does not connect within a couple of minutes, please check the response code in the AT Command manual of the SIM800L and possibly test the SIM in a smartphone to check the coverage.

# Check Registered Network

<!-- c@35-37 -->

With 'AT+COPS?' it can be checked to which network the modem is currently attached. In the shown case the modem is attached to the Telekom Germany network.

# Configure APN

<!-- c@39-40 -->

Next, the APN needs to be set for the Data Session. Using the 'AT+CSTT="iot.1nce.net","",""' command specifically for the SIM800L the 1NCE APN can be set.

# Start GPRS Connection

<!-- c@43-44 -->

With 'AT+CIICR' the GPRS connection is started.

# Get IP Address

<!-- c@47-48 -->

With 'AT+CIFSR' the obtained local IP of the modem can be queried.
The response is the IP obtained from the network.

# ICMP Ping

<!-- c@51-55 -->

After the successful setup of the data session, with 'AT+CIPPING="www.1nce.net"' any URL or IP address can be pinged. The responses '+CIPPING: 1,"142.250.186.99",1,112' show the resolved IP address and the ping time.

# Data Session Close

<!-- c@58-59 -->

With 'AT+CIPSHUT' the data session of the modem is closed.

# Wrap Up



This guide showed the basic setup of a SIM800L with a 1NCE SIM to get an ICMP Ping request working.

For more details and documentation please refer to the AT Command manual of the SIM800L.
