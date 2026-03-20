---
title: SIM7000G 1NCE OS COAP
---
```powershell PowerShell
AT+CNACT=1,"iot.1nce.net"

OK

+APP PDP: ACTIVE
AT+CCOAPINIT

OK
AT+CCOAPURL="coap://coap.os.1nce.com:5683"

OK
AT+CCOAPPARA=code,1,type,"NON",uri-query,0,"t=1",payload,0,"hello world"

OK
AT+CCOAPACTION

+CCOAPACTION: 0,1

OK

+CCOAPRECV: 1,14,9
AT+CCOAPACTION=4

+CCOAPACTION: 4,1,1

OK
AT+CCOAPHEAD=1,1

+CCOAPHEAD: 1,1,2,0,4.04,1,,,,,,,0,,,,,,,,,,,

OK
AT+CCOAPREAD=1

+CCOAPREAD: 5,Not Found

OK
AT+CCOAPTERM

OK
AT+CNACT=0

OK

+APP PDP: ACTIVE
```

# Preparation



Configure the SIM7000 module with the appropriate network settings, operator ID, and ensure that it is connected to the cellular network.

# Open data connection

<!-- powershell@1-5 -->

Open data connection, the parameter is APN. This parameter needs to set different APN values according to 1nce sim card.

# Create CoAP object

<!-- powershell@6-8 -->

To create a CoAP object, one can use the CoAP Client destination we use AT+CCOAPINIT

# Configure CoAP URL

<!-- powershell@9-11 -->

Use the AT+CCOAPURL command to setup a URL and establish a connection with the 1NCE endpoint.

# Assembling CoAP data packet

<!-- powershell@12-14 -->

Assembling CoAP data packet with these parameters 
 code,<hex_value>
type,(("CON"),("NON"),("ACK"),("RST"))
mid,<dec_value>
token, ((0-ascii code),(1-hex code)),<value>
content-format,<dec_value>
accept,<dec_value>
uri-path,((0-ascii code),(1-hex code)),<value>
uri-query, ((0-ascii code),(1-hex code)),<value>
etag, ((0-ascii code),(1-hex code)),<value>
observe,<dec_value>
max-age,<dec_value>
size,<dec_value>
payload, ((0-ascii code),(1-hex code)),<value>

# Send Data

<!-- powershell@15-21 -->

Received data, Message id is 1, data lengthis14bytes, data payload is 9 bytes

# Get receive queen

<!-- powershell@22-26 -->

The current receive queue has a total of 1datapacket, and the first packet id is 1.

# Read header

<!-- powershell@27-31 -->

Read the packet header with messageidof 1and print it parsed

# Read the recieve

<!-- powershell@32-36 -->

Read the receive packet payload with messageid of 1.
The total byte length is 9 and the content is Not Found.

# Delete CoAP Object

<!-- powershell@37-39 -->



# Disconnect data connection

<!-- powershell@40-44 -->

