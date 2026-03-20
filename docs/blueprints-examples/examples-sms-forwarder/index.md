---
title: SMS Forwarder Service
description: Examples for using and testing the SMS Forwarder.
---
<HTMLBlock>{`
<center><img src="/img/blueprints-examples/examples-sms-forwarder/001.png" style="cursor:pointer;max-width:100%;" onclick="(function(img){if(img.wnd!=null&&!img.wnd.closed){img.wnd.focus();}else{var r=function(evt){if(evt.data=='ready'&&evt.source==img.wnd){img.wnd.postMessage(decodeURIComponent(img.getAttribute('src')),'*');window.removeEventListener('message',r);}};window.addEventListener('message',r);img.wnd=window.open('https://viewer.diagrams.net/?client=1&page=0&edit=_blank');}})(this);"/></center>
`}</HTMLBlock>

With the SMS Forwarding Service, Mobile Originated SMS (MO-SMS) messages and Delivery Reports (DLR) for Mobile Terminated SMS (MT-SMS) are forwarded to a customer-specified HTTP REST endpoint as JSON objects. This example section will outline the general requirements for the HTTP endpoint and provide guides for the configuration and implementation.

***

# REST Interface

The receiving server needs to provide a REST Interface, which accepts HTTP Post/Patch requests issued from the 1NCE SMS Forwarding Service. MO-SMS from a SIM device are issued using HTTP Post. For MT-SMS towards a SIM device, Delivery Reports are issued with HTTP Patch requests. The server should reply with a HTTP 200 status code. This indicates that the forwarded SMS event was received and will not be repeated afterwards. In case another HTTP status code is returned, the SMS event will be repeated until it is successfully received or a 24-hour timeout is reached. 

## Endpoint URL

The endpoint URL for receiving SMS messages configured in the 1NCE Portal Configuration needs to be valid. URLs with public IP addresses (`https://<server-ip>:<port>/<endpoint>/`) are not supported. Custom ports for the endpoint can be configured via the URL (`https://<server-domain>:<port>/<endpoint>/`). 

## Certificate

The endpoint server needs to have a valid SSL/TLS certificate. A self-signed certificate will not work in this application case. 1NCE recommends using [Let's Encrypt](https://letsencrypt.org/de/) certificates. 

## Warnings & Errors

A warning event record (e.g., HTTP 500) is written in the Data Streamer and 1NCE Portal SIM Event Log if an event delivery to the specified server was unsuccessful. In this case, verify that the endpoint is reachable and returns HTTP 200 to the incoming HTTP Post/HTTP Patch request.

***

# SMS Forwarder Sequence Diagrams

The two sequence diagrams below show the MT-SMS DLR and the MO-SMS delivery using the SMS Forwarding Service. These diagrams provide a basic overview of the working principle of the SMS Forwarding Service.

## MO-SMS Delivery

The figure shows a successful and failed flow of an MO-SMS delivery using the SMS Forwarder. The MO-SMS is always provided via the 1NCE Portal and the 1NCE API. The status of a MO-SMS can be queried in the Portal and the API. The delivery failed error message is delivered via the Data Streamer and also shown in the 1NCE Portal.

<HTMLBlock>{`
<center><img src="/img/blueprints-examples/examples-sms-forwarder/002.png" style="cursor:pointer;max-width:100%;" onclick="(function(img){if(img.wnd!=null&&!img.wnd.closed){img.wnd.focus();}else{var r=function(evt){if(evt.data=='ready'&&evt.source==img.wnd){img.wnd.postMessage(decodeURIComponent(img.getAttribute('src')),'*');window.removeEventListener('message',r);}};window.addEventListener('message',r);img.wnd=window.open('https://viewer.diagrams.net/?client=1&page=0&edit=_blank');}})(this);"/></center>
`}</HTMLBlock>

## MT-SMS DLR

The figure below shows the flow of a Delivery Report for a MT-SMS. Once a mobile terminated SMS is issued via the API or 1NCE Portal, it will be delivered to the SIM device. Once received by the device, a delivery report (DLR) is issued from the 1NCE network using the SMS Forwarder webhook integration. The DLR indicates that the SMS was delivered to the targeted SIM device. If no webhook / HTTP endpoint is configured, the delivery of the DLR will fail resulting in an event shown in the data streamer and 1NCE Portal.

<HTMLBlock>{`
<center><img src="/img/blueprints-examples/examples-sms-forwarder/003.png" style="cursor:pointer;max-width:100%;" onclick="(function(img){if(img.wnd!=null&&!img.wnd.closed){img.wnd.focus();}else{var r=function(evt){if(evt.data=='ready'&&evt.source==img.wnd){img.wnd.postMessage(decodeURIComponent(img.getAttribute('src')),'*');window.removeEventListener('message',r);}};window.addEventListener('message',r);img.wnd=window.open('https://viewer.diagrams.net/?client=1&page=0&edit=_blank');}})(this);"/></center>
`}</HTMLBlock>
