---
title: SIM7020E 1NCE OS CoAP
---
```powershell PowerShell
/*Create client instance with coap.os.1nce.com via IP address*/
> AT+CCOAPNEW="10.60.2.219",5683,1
+CCOAPNEW: 1

OK

/*Send hex data to server Hi 1NCEOS */ 
> AT+CCOAPCSEND=1,1,0,0,2,,,9,"486920314E43454F53"

/* Release Client instance */
> AT+CCOAPDEL=1
OK

```

# Preparation



Configure the SIM7020E module with the appropriate network settings, such as the APN and operator ID, and ensure that it is connected to the cellular network.

# Create CoAP Client

<!-- powershell@1-5 -->

creates a new CoAP client instance with the 1nce os endpoint and port number 5683

# Send CoAP data

<!-- powershell@7-8 -->

sends a CoAP message to the server using the client instance created in the previous command. The first parameter "1" specifies the client instance ID. The second parameter "1" specifies the CoAP method (GET, POST, etc.). The third and fourth parameters are the message ID and token, respectively. The fifth parameter "2" specifies the CoAP message type (CON, NON, ACK, RST). The eighth parameter "9" specifies the length of the payload in bytes. The ninth parameter is the payload itself, which is the hex-encoded string "486920314E43454F53" (which translates to "Hi 1NCEOS" in ASCII).

# Release the CoAP Client instance

<!-- powershell@10-13 -->

releases the CoAP client instance with ID "1", freeing up any resources associated with it.
