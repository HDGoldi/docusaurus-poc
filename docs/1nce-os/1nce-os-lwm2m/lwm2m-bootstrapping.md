---
title: Bootstrapping
description: >-
  The 1NCE LwM2M client bootstrapping process, needed to register a device to
  the LwM2M server.
---
To use the 1NCE LwM2M Service, every time a client IoT device with a 1NCE SIM wants to connect or reattach, the bootstrap server needs to be contacted at first. A direct connection to the LwM2M server without prior communication towards the bootstrap service is not possible. 

The task at hand for the bootstrap server is to accept the initial connection, handle the authorization of the SIM device using the SIM-as-an-Identity service and provide LwM2M server connectivity instructions with one-time specific security credentials. 

There are two possible methods to bootstrap a device. The bootstrapping can be performed either by encrypted DTLS communication (using PSK) or by using Plain COAP. 

DTLS is using pre-shared key (PSK) provided by client device and identity of device (deviceId-iccid). If device is bootstrapping to secure server, the LWM2M server priority is changed to also secure server to be first. 

The PSK can be set:

* using 1NCE OS API endpoint described in [API Explorer](https://help.1nce.com/dev-hub/reference/post_v1-integrate-devices-deviceid-psk)
* in 1NCE OS portal Device Integrator when [testing lwm2m endpoint](doc:device-integrator-test-endpoints#testing-the-endpoint)

Using [leshan client](https://github.com/eclipse/leshan#test-leshan-demos-locally) there is 2 examples to bootstrap:

1. **DTLS** `java -jar .\leshan-client.jar -b -u lwm2m.os.1nce.com:5684 -p <secret key in HEX> -i <identity>`
2. **PLAIN** `java -jar .\leshan-client.jar -b -u lwm2m.os.1nce.com:5683`

The following figure illustrates this process in detail.

<HTMLBlock>{`
<center><img src="/img/1nce-os/1nce-os-lwm2m/lwm2m-bootstrapping/001.png" style="cursor:pointer;max-width:100%;" onclick="(function(img){if(img.wnd!=null&&!img.wnd.closed){img.wnd.focus();}else{var r=function(evt){if(evt.data=='ready'&&evt.source==img.wnd){img.wnd.postMessage(decodeURIComponent(img.getAttribute('src')),'*');window.removeEventListener('message',r);}};window.addEventListener('message',r);img.wnd=window.open('https://viewer.diagrams.net/?client=1&page=0&edit=_blank');}})(this);"/></center>
`}</HTMLBlock>

### The shown steps are the following (plain connection):

1. The LwM2M client calls the bootstrap server at `lwm2m.os.1nce.com:5683` using plain CoAP.

2. The bootstrap server responds with a data message containing all the necessary information for the client to connect to the actual LwM2M server.

   > LwM2M Server

   <Table align={["left","left","left","left"]}>
     <thead>
       <tr>
         <th style={{ textAlign: "left" }}>
           Resource
         </th>

         <th style={{ textAlign: "left" }}>
           Description
         </th>

         <th style={{ textAlign: "left" }}>
           Type
         </th>

         <th style={{ textAlign: "left" }}>
           Value
         </th>
       </tr>
     </thead>

     <tbody>
       <tr>
         <td style={{ textAlign: "left" }}>
           0/0/0
         </td>

         <td style={{ textAlign: "left" }}>
           LWM2M Server URI
         </td>

         <td style={{ textAlign: "left" }}>
           String
         </td>

         <td style={{ textAlign: "left" }}>
           Example:\
           `coap://1.2.3.4:5683`
         </td>
       </tr>

       <tr>
         <td style={{ textAlign: "left" }}>
           0/0/1
         </td>

         <td style={{ textAlign: "left" }}>
           Bootstrap-Server
         </td>

         <td style={{ textAlign: "left" }}>
           Boolean
         </td>

         <td style={{ textAlign: "left" }}>
           false
         </td>
       </tr>

       <tr>
         <td style={{ textAlign: "left" }}>
           0/0/2
         </td>

         <td style={{ textAlign: "left" }}>
           Security Mode
         </td>

         <td style={{ textAlign: "left" }}>
           Integer
         </td>

         <td style={{ textAlign: "left" }}>
           3 (NoSec)
         </td>
       </tr>

       <tr>
         <td style={{ textAlign: "left" }}>
           0/0/10
         </td>

         <td style={{ textAlign: "left" }}>
           Server Id
         </td>

         <td style={{ textAlign: "left" }}>
           Integer
         </td>

         <td style={{ textAlign: "left" }}>
           1111
         </td>
       </tr>

       <tr>
         <td style={{ textAlign: "left" }}>
           1/0/0
         </td>

         <td style={{ textAlign: "left" }}>
           Short Server ID
         </td>

         <td style={{ textAlign: "left" }}>
           Integer
         </td>

         <td style={{ textAlign: "left" }}>
           1111
         </td>
       </tr>

       <tr>
         <td style={{ textAlign: "left" }}>
           1/0/1
         </td>

         <td style={{ textAlign: "left" }}>
           Lifetime (s)
         </td>

         <td style={{ textAlign: "left" }}>
           Integer
         </td>

         <td style={{ textAlign: "left" }}>
           86400
         </td>
       </tr>

       <tr>
         <td style={{ textAlign: "left" }}>
           1/0/2
         </td>

         <td style={{ textAlign: "left" }}>
           Default Minimum Period (s)
         </td>

         <td style={{ textAlign: "left" }}>
           Integer
         </td>

         <td style={{ textAlign: "left" }}>
           1
         </td>
       </tr>
     </tbody>
   </Table>

   > Bootstrap Server

   <Table align={["left","left","left","left"]}>
     <thead>
       <tr>
         <th>
           Resource
         </th>

         <th>
           Description
         </th>

         <th>
           Type
         </th>

         <th>
           Value
         </th>
       </tr>
     </thead>

     <tbody>
       <tr>
         <td>
           0/1/0
         </td>

         <td>
           Bootstrap Server URI
         </td>

         <td>
           String
         </td>

         <td>
           Example:\
           `coap://lwm2m.os.1nce.com:5683`
         </td>
       </tr>

       <tr>
         <td>
           0/1/1
         </td>

         <td>
           Bootstrap-Server
         </td>

         <td>
           Boolean
         </td>

         <td>
           yes
         </td>
       </tr>

       <tr>
         <td>
           0/1/2
         </td>

         <td>
           Security Mode
         </td>

         <td>
           Integer
         </td>

         <td>
           3 (NoSec)
         </td>
       </tr>

       <tr>
         <td>
           0/1/10
         </td>

         <td>
           Server Id
         </td>

         <td>
           Integer
         </td>

         <td>
           2222
         </td>
       </tr>
     </tbody>
   </Table>

3. The LwM2M client device uses this information to trigger the registration on the LwM2M server using CoAP.

### The shown steps are the following (with DTLS):

1. The LwM2M client calls the bootstrap server at lwm2m.os.1nce.com:5684 using CoAPs.

2. The bootstrap server responds with a data message containing all the necessary information for the client to connect to the actual LwM2M server.

   > LwM2M DTLS Server

   <Table align={["left","left","left","left"]}>
     <thead>
       <tr>
         <th style={{ textAlign: "left" }}>
           Resource
         </th>

         <th style={{ textAlign: "left" }}>
           Description
         </th>

         <th style={{ textAlign: "left" }}>
           Type
         </th>

         <th style={{ textAlign: "left" }}>
           Value
         </th>
       </tr>
     </thead>

     <tbody>
       <tr>
         <td style={{ textAlign: "left" }}>
           0/0/0
         </td>

         <td style={{ textAlign: "left" }}>
           LWM2M Server URI
         </td>

         <td style={{ textAlign: "left" }}>
           String
         </td>

         <td style={{ textAlign: "left" }}>
           Example:\
           `coaps://1.2.3.4:5684`
         </td>
       </tr>

       <tr>
         <td style={{ textAlign: "left" }}>
           0/0/1
         </td>

         <td style={{ textAlign: "left" }}>
           Bootstrap-Server
         </td>

         <td style={{ textAlign: "left" }}>
           Boolean
         </td>

         <td style={{ textAlign: "left" }}>
           false
         </td>
       </tr>

       <tr>
         <td style={{ textAlign: "left" }}>
           0/0/2
         </td>

         <td style={{ textAlign: "left" }}>
           Security Mode
         </td>

         <td style={{ textAlign: "left" }}>
           Integer
         </td>

         <td style={{ textAlign: "left" }}>
           0 (Pre-Shared Key)
         </td>
       </tr>

       <tr>
         <td style={{ textAlign: "left" }}>
           0/0/3
         </td>

         <td style={{ textAlign: "left" }}>
           Identity
         </td>

         <td style={{ textAlign: "left" }}>
           Opaque
         </td>

         <td style={{ textAlign: "left" }}>
           *Identity as binary data*
         </td>
       </tr>

       <tr>
         <td style={{ textAlign: "left" }}>
           0/0/5
         </td>

         <td style={{ textAlign: "left" }}>
           Secret Key
         </td>

         <td style={{ textAlign: "left" }}>
           Opaque
         </td>

         <td style={{ textAlign: "left" }}>
           *Private key for LwM2M Server as binary data*
         </td>
       </tr>

       <tr>
         <td style={{ textAlign: "left" }}>
           0/0/10
         </td>

         <td style={{ textAlign: "left" }}>
           Server Id
         </td>

         <td style={{ textAlign: "left" }}>
           Integer
         </td>

         <td style={{ textAlign: "left" }}>
           1111
         </td>
       </tr>

       <tr>
         <td style={{ textAlign: "left" }}>
           1/0/0
         </td>

         <td style={{ textAlign: "left" }}>
           Short Server ID
         </td>

         <td style={{ textAlign: "left" }}>
           Integer
         </td>

         <td style={{ textAlign: "left" }}>
           1111
         </td>
       </tr>

       <tr>
         <td style={{ textAlign: "left" }}>
           1/0/1
         </td>

         <td style={{ textAlign: "left" }}>
           Lifetime (s)
         </td>

         <td style={{ textAlign: "left" }}>
           Integer
         </td>

         <td style={{ textAlign: "left" }}>
           86400
         </td>
       </tr>

       <tr>
         <td style={{ textAlign: "left" }}>
           1/0/2
         </td>

         <td style={{ textAlign: "left" }}>
           Default Minimum Period (s)
         </td>

         <td style={{ textAlign: "left" }}>
           Integer
         </td>

         <td style={{ textAlign: "left" }}>
           1
         </td>
       </tr>
     </tbody>
   </Table>

   > Bootstrap DTLS Server

   <Table align={["left","left","left","left"]}>
     <thead>
       <tr>
         <th>
           Resource
         </th>

         <th>
           Description
         </th>

         <th>
           Type
         </th>

         <th>
           Value
         </th>
       </tr>
     </thead>

     <tbody>
       <tr>
         <td>
           0/1/0
         </td>

         <td>
           Bootstrap Server URI
         </td>

         <td>
           String
         </td>

         <td>
           Example:\
           `coaps://lwm2m.os.1nce.com:5684`
         </td>
       </tr>

       <tr>
         <td>
           0/1/1
         </td>

         <td>
           Bootstrap-Server
         </td>

         <td>
           Boolean
         </td>

         <td>
           yes
         </td>
       </tr>

       <tr>
         <td>
           0/1/2
         </td>

         <td>
           Security Mode
         </td>

         <td>
           Integer
         </td>

         <td>
           0 (Pre-Shared Key)
         </td>
       </tr>

       <tr>
         <td>
           0/1/3
         </td>

         <td>
           Identity
         </td>

         <td>
           Opaque
         </td>

         <td>
           *Identity as binary data*
         </td>
       </tr>

       <tr>
         <td>
           0/1/5
         </td>

         <td>
           Secret Key
         </td>

         <td>
           Opaque
         </td>

         <td>
           *Private key for LwM2M Bootstrap Server as binary data*
         </td>
       </tr>

       <tr>
         <td>
           0/1/10
         </td>

         <td>
           Server Id
         </td>

         <td>
           Integer
         </td>

         <td>
           2222
         </td>
       </tr>
     </tbody>
   </Table>

3. The LwM2M client device uses this information to trigger the registration on the LwM2M server using CoAPs. The DTLS Pre Shared Key (PSK) that is provided by the bootstrap server and used for the registration is regenerated on every bootstrap request.
