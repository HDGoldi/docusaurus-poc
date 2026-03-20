---
title: EC25 ICMP Ping
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
  
  
> AT+CGDCONT=1,"IP","iot.1nce.net"
OK


> AT+CGACT=1,1
OK


> AT+CGPADDR=1
+CGPADDR: 1,"10.37.41.5"
OK

> AT+QPING=1,"8.8.8.8",1,4
OK
+QPING: 0,"8.8.8.8",32,468,255
+QPING: 0,"8.8.8.8",32,138,255
+QPING: 0,"8.8.8.8",32,178,255
+QPING: 0,"8.8.8.8",32,121,255
+QPING: 0,4,4,0,121,468,226


> AT+CGACT=0,1
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

# Configure APN

<!-- curl@47-48 -->

Next, the APN needs to be set for the Data Session. Using the 'AT+CGDCONT=1,"IP","iot.1nce.net"' command the 1NCE APN can be set.

# Start PDP Session

<!-- curl@51-52 -->

With 'AT+CGACT=1,1' the PDP session for CID one is started. A PDP data session is needed to transfer any sort of data.

# Get IP Address

<!-- curl@55-57 -->

With 'AT+CGPADDR=1' the obtained local IP of the modem can be queried.
The response is the IP obtained from the network.

# ICMP Ping

<!-- curl@59-65 -->

After the successful setup of the data session, with 'AT+QPING=1,"8.8.8.8",1,4' any URL or IP address can be pinged. The responses '+QPING: 0,"8.8.8.8",32,468,255' show the resolved IP address and the ping time.

# Data Session Close

<!-- curl@68-69 -->

With 'AT+CGACT=0,1' the entire PDP data session of the modem is closed.

# Wrap Up



This guide showed the basic setup of a EC25 with a 1NCE SIM to get an ICMP Ping request working.

For more details and documentation please refer to the AT Command manual of the EC25.
