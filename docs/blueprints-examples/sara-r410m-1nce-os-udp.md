---
title: SARA-R410M 1NCE OS UDP
---
```powershell PowerShell
> AT+USOCR=17

+USOCR: 0

OK

/*IP address of udp.os.1nce.com for this example is 10.60.8.90 */
> AT+USOST=0,"10.60.8.90",4445,18,"Hello from 1NCE OS"

+USOST: 0,18

OK

> AT+USOCL=0

OK
```

# Preparation



Configure the SARA-R410M module with the appropriate network settings, such as the APN and operator ID, and ensure that it is connected to the cellular network.

# create a new socket for communication

<!-- powershell@1-5 -->

The module will respond with the socket identifier (socket ID) if the command is successful.

# Send the message to 1NCEOS

<!-- powershell@7-12 -->

This command would send the string "Hello from 1NCE OS" over socket ID 0 to the remote server with the IP address "10.60.8.90" on port 4445.
 response indicates that the "AT+USOST" command was successful, and it provides the socket ID and the number of bytes sent.

# Close the Socket

<!-- powershell@14-16 -->

This command would close the socket connection with socket ID 0.
After sending the command, the module should respond with an "OK" response indicating that the socket was successfully closed.
