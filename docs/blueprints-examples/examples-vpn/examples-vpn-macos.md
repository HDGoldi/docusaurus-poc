---
title: VPN Setup Mac OS
description: Setup of 1NCE VPN using Mac OS.
---
<HTMLBlock>{`
<center><img src="/img/blueprints-examples/examples-vpn/examples-vpn-macos/001.png" style="cursor:pointer;max-width:100%;" onclick="(function(img){if(img.wnd!=null&&!img.wnd.closed){img.wnd.focus();}else{var r=function(evt){if(evt.data=='ready'&&evt.source==img.wnd){img.wnd.postMessage(decodeURIComponent(img.getAttribute('src')),'*');window.removeEventListener('message',r);}};window.addEventListener('message',r);img.wnd=window.open('https://viewer.diagrams.net/?client=1&page=0&edit=_blank');}})(this);"/></center>
`}</HTMLBlock>

For using the 1NCE VPN Service with Mac OS, it is recommended to use the Tunnelblick application. If offers an easy to configure and use interface for OpenVPN client connectivity. Please refer to <a target="_blank" href="https://tunnelblick.net/">Tunnelblick</a> for more details about the Mac OS OpenVPN client.

***

# Mac OS VPN Client Setup

> 📘 VPN Connection Limit
>
> Please note that only once OpenVPN client towards the 1NCE Network connection at a time can be open at any given time. If multiple OpenVPN client connect with the same credentials at the same time, the connectivity will be inconsistent and dropped. Ensure to terminate any unused OpenVPN client connection before establishing a new connection.

1. Download the current version of the **Tunnelblick** client for Mac OS. (<a href="https://tunnelblick.net">Tunnelblick Download</a>
2. Install the the OpenVPN client for Mac OS. Follow the default install instructions.
3. Log into the **1NCE Portal**. Navigate to the **Configuration** tab and open the **OpenVPN Configuration** dropdown. Select **Mac OS** as configuration medium and download the OpenVPN *xx-region-x-client.conf* and *credentials.txt* files.

<div style={{textAlign: 'center'}}>
<img src="/img/blueprints-examples/examples-vpn/examples-vpn-macos/35112bd-1nce-vpn-linux.png" alt="1nce-vpn-linux.png" width="80%" />
</div>

4. Import the *xx-region-x-client.conf* and *credentials.txt* into Tunnelblick application. Refer to <a target="_blank" href="https://tunnelblick.net/czUsing.html">Tunnelblick Install Guide</a> for details about the setup.
5. Once the configuration is installed. The connection can be established by clicking on *Connect* inside the application.
6. A new pop-up will be shown for the client connecting. It shows the logs of the current connection attempt. After a few seconds the client should connect and the pop-up should be closed automatically.

The VPN connection can be terminated by clicking **Disconnect** in the OpenVPN task bar menu. If a successful connection is established, the computer should now be ready to ping and establish connection towards active/connected 1NCE SIM with an open PDP data session.
