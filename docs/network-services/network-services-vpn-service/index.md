---
title: VPN Service
description: Bidirectional Connections between 1NCE SIM and Server Application.
---
<HTMLBlock>{`
<center><img src="/img/network-services/network-services-vpn-service/001.png" style="cursor:pointer;max-width:100%;" onclick="(function(img){if(img.wnd!=null&&!img.wnd.closed){img.wnd.focus();}else{var r=function(evt){if(evt.data=='ready'&&evt.source==img.wnd){img.wnd.postMessage(decodeURIComponent(img.getAttribute('src')),'*');window.removeEventListener('message',r);}};window.addEventListener('message',r);img.wnd=window.open('https://viewer.diagrams.net/?client=1&page=0&edit=_blank');}})(this);"/></center>
`}</HTMLBlock>

Each 1NCE SIM has a private IP and is connected via the Internet Breakout using Network Address Translation to the public internet. By default the connection establishment is unidirectional from the SIM device to a server/service in the internet. The 1NCE VPN Service enables 1NCE customers to connect and transmit data bidirectional with their SIM devices via a Virtual Private Network (VPN) connection.

A VPN describes a technology that encapsulates and transmits Internet Protocol (IP) network data, over a separate network. Virtual Private Networks are commonly used to enable access to parts of a network that are otherwise inaccessible from the open internet. 1NCE uses the open-source implementation OpenVPN as the basis for the VPN Service. The Figure provides a high-level overview of the VPN Service. The VPN provides mutual communication between devices with a SIM and their application server endpoints with the VPN client. The 1NCE VPN Service is available in Manual Mode for the selected Breakout Setting and the usage of this service is optional and free of charge. Even if the VPN Service is used, the default NAT Internet Breakout is still available for requests towards the internet using.

1NCE provides three different OpenVPN Server Endpoints matching each available Breakout region that can be configured.
