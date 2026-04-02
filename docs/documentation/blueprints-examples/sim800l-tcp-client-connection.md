---
title: SIM800L TCP Client Connection
sidebar_position: 7
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
  
  
> AT+CSTT="iot.1nce.net","",""
OK


> AT+CIICR
OK


> AT+CIFSR
x.x.x.x


> AT+CIPSTART="TCP","<tcp_server_url/ip>",<tcp_port>
OK
CONNECT OK


> AT+cipsend
> <tcp_data_to_send>

> 1a
SEND OK


This is a TCP response message from my server!


> AT+CIPCLOSE
CLOSED


> AT+CIPSHUT
SHUT OK
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

# Configure APN

<!-- curl@40-41 -->

Next, the APN needs to be set for the TCP Data Session. Using the 'AT+CGDCONT=1,"IP","iot.1nce.net"' command, the 1NCE APN can be set.

# Bring Up GPRS

<!-- curl@44-45 -->

After the APN was set, the GPRS connection needs to be activated.

# Check IP Address

<!-- curl@48-49 -->

The local IP address of the SIM800L can be checked with 'AT+CIFSR'. This IP should match the statically aissigned 1NCE SIM IP.

# Start a TCP Connection

<!-- curl@52-54 -->

A TCP connection towards a server with a given TCP port can be started with 'AT+CIPSTART=...'. The AT Command needs to list the TCP protocol, the target URL or IP and the used TCP Port. If the connection is successfully opened, 'CONNECT OK' is returned.

# Send TCP Data

<!-- curl@57-61 -->

With 'AT+CIPSEND' the data send mode is activated. Any input send to the modem will be forwarded via the tcp connection. To deactivate the send mode, '1A' encoded as a HEX value needs to be send to the SIM800L. The modem will acknowledge the sent message with 'SEND OK'.

# Receive TCP Data

<!-- curl@64 -->

By default, the modem will forward any incomming TCP data while the connection is open to the serial output interface.

# Close TCP Connection

<!-- curl@67-68 -->

An active TCP connection can be closed with 'AT+CIPCLOSE'. The modem will close the TCP connection and respond with 'CLOSED'.

# Close Data Session

<!-- curl@71-72 -->

To close the entire data session that was opened with 'AT+CIICR', 'AT+CIPSHUT' needs to be used. The command will respond with 'SHUT OK'. Afterwards a new session can be started at any point.

# Wrap Up



Using the default TCP connection cpabilites of the SIM800L to send and receive data is a fairly easy process. For more advanced features and configurations please refer to the AT Command manual of the SIM800L.
