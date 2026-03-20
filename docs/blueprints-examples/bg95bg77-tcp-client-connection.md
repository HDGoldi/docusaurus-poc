---
title: BG95&BG77 TCP Client Connection
---
```powershell PowerShell
/* connect to TCP server */
> AT+QIOPEN=1,0,"TCP","<tcp_server_url/ip>",<tcp_port>
OK
+QIOPEN: 0,0
+QIURC: "recv",0

> AT+QIRD=1
+QIRD: <length>
<incomming_data>
OK


> AT+QISEND=0
> Welcome to 1NCE OS
SEND OK

> AT+QICLOSE=0

OK
```

# Start a TCP Connection

<!-- powershell@1-5 -->

A TCP connection towards a server with a given TCP port can be started with 'AT+QIOPEN=1,0,"TCP",'. The AT Command needs to list the TCP protocol, the target URL or IP and the used TCP Port. If the connection is successfully opened, '+QIOPEN: 0,0' is returned.

# Receive TCP Data



By default, the modem will indicate any incomming TCP data with '+QIURC: "recv",1'. The received data can be read by issuing the 'AT+QIRD=1' command.

# Send TCP Data

<!-- powershell@13-15 -->

With 'AT+QISEND=1' the data send mode is activated. Any input send to the modem will be forwarded via the tcp connection. To deactivate the send mode, '1A' encoded as a HEX value needs to be send to the BG95. The modem will acknowledge the sent message

# Close TCP Connection

<!-- powershell@17-19 -->

An active TCP connection can be closed with 'AT+QICLOSE=1'. The modem will close the TCP connection and respond with '+QIURC: "closed",1'.
