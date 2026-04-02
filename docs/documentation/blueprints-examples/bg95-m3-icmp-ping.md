---
title: BG95-M3 ICMP Ping
sidebar_position: 28
---
```powershell PowerShell
> AT+CEREG?
+CEREG: 0,5

> AT+CREG?
+CREG: 0,5

> AT+CGREG?
+CGREG: 0,4

> AT+CSQ
+CSQ: 2,99

> AT+QICSGP=1,1,"iot.1nce.net","","",0
OK

> AT+CGATT=1
OK

> AT+CGPADDR
+CGPADDR: 1,x.x.x.x

OK

> AT+QPING=1,"www.1nce.net",5
OK

+QPING: 0,"15.197.142.173",32,459,255
+QPING: 0,"15.197.142.173",32,1312,255
+QPING: 0,"15.197.142.173",32,466,255
+QPING: 0,"15.197.142.173",32,449,255
 +QPING: 0,4,4,0,449,1312,671


```

# Preparation



Open a serial terminal and connect to the BG95-M3 module using the AT command interface.

# Network Registration

<!-- powershell@1-8 -->

Ensure that the module is registered to the cellular network if not check the recipe BG95-M3 Network registration

# Check Signal Quality

<!-- powershell@10,11 -->

+CSQ: ,
is the received signal strength indication, expressed in dBm. The higher the value, the stronger the signal.
is the channel bit error rate, expressed as a percentage. The lower the value, the better the channel quality.

# Set the APN

<!-- powershell@13,14 -->

Set the Access Point Name (APN) for the network connection.

# Activate the GPRS connection

<!-- powershell@16,17 -->

This command attaches the module to the GPRS network and activates the PDP context

# Get IP Address

<!-- powershell@19-22 -->

This command retrieves the IP address assigned to the module by the network operator

# ICMP Ping

<!-- powershell@24-31 -->

After the successful setup of the data session, with 'AT+QPING="www.1nce.net"' any URL or IP address can be pinged. The responses '+CIPPING: 0,"15.197.142.173",32,459,255 show the resolved IP address and the ping time.

# Wrap Up



This guide showed the basic setup of a BG95 with a 1NCE SIM to get an ICMP Ping request working.

For more details and documentation please refer to the AT Command manual of the BG95.
