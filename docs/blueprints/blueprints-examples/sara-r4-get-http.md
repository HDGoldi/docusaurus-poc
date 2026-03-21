---
title: SARA-R4 GET HTTP
sidebar_position: 37
---
```powershell PowerShell
// Set APN
AT+CGDCONT=1,"IP","iot.1nce.net"
OK

AT+CGACT=1,1
OK

// Configure HTTP parameters
AT+UHTTP=0
OK

AT+UHTTP=1,1,"https://www.example.com"
OK

AT+UHTTP=2,1
OK

AT+UHTTP=3,0,"User-Agent: MyClient"
OK

// Initiate HTTP GET request
AT+UHTTPC=0,5,"/api/data"
OK

// Read HTTP response
AT+UHTTPC=0,6
+UHTTPCR: 0,200,185
OK

// Retrieve response data
AT+URDFILE="response.txt",185
OK

// Close HTTP connection
AT+UHTTP=0
OK
```

# Preparation



Open a serial terminal and connect to the SARA-R4 module using the AT command interface.

# Network Registration



Ensure that the module is registered to the cellular network if not, check the recipe SARA-R Network registration

# Configure the APN

<!-- powershell@1-3 -->



# Activate PDP context

<!-- powershell@5-6 -->

This command activates the PDP (Packet Data Protocol) context for data communication.

# Configure HTTP parameters

<!-- powershell@9-19 -->

AT+UHTTP=0: This command initializes the HTTP profile. It prepares the module for HTTP communication.

AT+UHTTP=1,1,"`<URL>`": Here, you need to replace `<URL>` with the URL of the web page you want to retrieve. This parameter sets the URL for the HTTP request.

AT+UHTTP=2,1: This command configures the HTTP method. The value 1 specifies that you want to use the GET method. If you want to use a different method like POST, you can adjust the value accordingly.

AT+UHTTP=3,0,"`<request_header>`": This optional parameter allows you to include request headers in the HTTP request. Request headers provide additional information to the server. For example, you can set the User-Agent header to specify the client making the request.

`<request_header>` should be replaced with the desired request header. For example, you can use "User-Agent: MyClient" to set the User-Agent header to "MyClient". You can include multiple request headers by separating them with line breaks ("\r\n").

# Initiate the HTTP GET request

<!-- powershell@21-23 -->

The 5 represents the timeout value in seconds.

# Read the HTTP response

<!-- powershell@25-28 -->



# Retrieve the response data

<!-- powershell@30-32 -->



# Close the HTTP connection

<!-- powershell@34-36 -->



# Warp Up



Please note that the actual AT command set and syntax may vary based on the specific firmware version and configuration of your SARA-R410M module. Refer to the u-blox documentation and AT command guide for your specific module version for accurate and detailed command information.
