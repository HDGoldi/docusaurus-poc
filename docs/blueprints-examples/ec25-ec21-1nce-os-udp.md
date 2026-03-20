---
title: EC25 & EC21 1NCE OS UDP
---
```powershell PowerShell
AT+QIOPEN=1,1,"UDP","udp.os.1nce.com",4445

OK

+QIOPEN: 1,0
AT+QISEND=1,17

> Welcome to 1NCEOS
SEND OK
AT+QICLOSE=1

OK
```

# Preparation



Configure the EC25/EC21 module with the appropriate network settings, such as the APN and operator ID, and ensure that it is connected to the cellular network.

# Open socket

<!-- powershell@1-5 -->

Use the AT+QIOPEN command to open a UDP socket and establish a connection with the remote server.

# Send the message to 1NCEOS

<!-- powershell@6-9 -->

For Send After receiving ">", input data (TEST), the maximum length of the data is 1460, the data beyond 1460 will be omitted. Then use <CTRL+Z> to send data. When receive SEND OK means the data has been sent, or you can specify number of Byte you want to send

# Close the Socket

<!-- powershell@10-12 -->

AT+QICLOSE command is used to close a socket connection established with a remote server using a TCP or UDP protocol. The command requires specifying the socket ID that was assigned when the connection was opened.
