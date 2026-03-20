---
title: SIM7000G UDP Client Connection
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


> AT+CPSI?
+CPSI: GSM,Online,262-01,0x972d,5559,79 EGSM 900,-83,0,24-24
 
 
> AT+COPS?
+COPS: 0,0,"Telekom.de 1nce.net",3
OK
  
  
> AT+CSTT="iot.1nce.net","",""
OK


> AT+CIICR
OK


> AT+CIFSR
x.x.x.x


> AT+CIPSTART="UDP","<udp_server_url/ip>",<udp_port>
OK
CONNECT OK


> AT+cipsend
> <udp_data_to_send>

> 1a
SEND OK


This is a UDP response message from my server!


> AT+CIPCLOSE
CLOSED


> AT+CIPSHUT
SHUT OK
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

# PLMN Selection

<!-- curl@21-22 -->

Use 'AT+COPS=0,0' to set the Public Land Mobile Network selection of the modem to automatic. This will ensure that the modem will pick the best operator based on the currently available selection at the given location.

# Network Registration

<!-- curl@25-42 -->

With 'AT+CEREG?' or 'AT+CGREG?' the network registration status can be queried denpendent on the used RAT (LTE or GSM). '+C(E/G)REG: 0,2' indicates that the device is still searching for a network. Use this command to query the status repeatedly until '+C(E/G)REG: 0,5' indicates that the modem is connected to a network and is roaming. 
1NCE SIMs are always roaming as they do not have a home country set for the IoT use case. 
If the modem does not connect within a couple of minutes, please check the response code in the AT Command manual of the SIM7000G and possibly test the SIM in a smartphone to check the coverage.

# Check Registered Network

<!-- curl@45-51 -->

With 'AT+CPSI?' the RAT and current status of the connection can be viewed. Futher, with 'AT+COPS?' it can be checked to which network the modem is currently attached. In the shown case the modem is attached to the Telekom Germany network.

# Configure APN

<!-- curl@54-55 -->

Next, the APN needs to be set for the Data Session. Using the 'AT+CSTT="iot.1nce.net","",""' command the 1NCE APN can be set.

# Start PDP Session

<!-- curl@58-59 -->

With 'AT+CIICR' the PDP Session is started.

# Get IP Address

<!-- curl@62-63 -->

With 'AT+CIFSR' the obtained local IP of the modem can be queried.
The response is the IP obtained from the network.

# Start a UDP Connection

<!-- curl@66-68 -->

A UDP connection towards a server with a given UDP port can be started with 'AT+CIPSTART=...'. The AT Command needs to list the UDP protocol, the target URL or IP and the used UDP Port. If the connection is successfully opened, 'CONNECT OK' is returned.

# Send UDP Data

<!-- curl@71-75 -->

With 'AT+CIPSEND' the data send mode is activated. Any input send to the modem will be forwarded via the UDP connection. To deactivate the send mode, '1A' encoded as a HEX value needs to be send to the SIM7000G. The modem will acknowledge the sent message with 'SEND OK'.

# Receive UDP Data

<!-- curl@78 -->

By default, the modem will forward any incomming UDP data while the connection is open to the serial output interface.

# Close UDP Connection

<!-- curl@81-82 -->

An active UDP connection can be closed with 'AT+CIPCLOSE'. The modem will close the UDP connection and respond with 'CLOSED'.

# Close Data Session

<!-- curl@85-86 -->

To close the entire data session that was opened with 'AT+CIICR', 'AT+CIPSHUT' needs to be used. The command will respond with 'SHUT OK'. Afterwards a new session can be started at any point.

# Wrap Up



This guide showed the basic setup of a SIM7000G with a 1NCE SIM to send and receive data using a UDP connection.

For more details and documentation please refer to the AT Command manual of the SIM7000G.
