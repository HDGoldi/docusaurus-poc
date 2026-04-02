---
title: 1NCE VPN Linux Client
sidebar_position: 2
---
```powershell PowerShell
> sudo apt install openvpn


> sudo mv ./client.conf /etc/openvpn/client
> sudo mv ./credentials.txt /etc/openvpn/client


> sudo nano /etc/openvpn/client/client.conf

auth-user-pass /etc/openvpn/client/credentials.txt


> sudo systemctl start openvpn-client@client


> sudo systemctl status openvpn-client@client

openvpn-client@client.service - OpenVPN tunnel for 1nce_work
   Loaded: loaded (/lib/systemd/system/openvpn-client@.service; disabled; vendor preset: enabled)
   Active: active (running) since Mon 2021-07-05 14:26:42 CEST; 25s ago
     Docs: man:openvpn(8)
           https://community.openvpn.net/openvpn/wiki/Openvpn24ManPage
           https://community.openvpn.net/openvpn/wiki/HOWTO
 Main PID: 13170 (openvpn)
   Status: "Initialization Sequence Completed"
    Tasks: 1 (limit: 4915)
   CGroup: /system.slice/system-openvpn\x2dclient.slice/openvpn-client@client.service
           └─13170 /usr/sbin/openvpn --suppress-timestamps --nobind --config client.conf

Jul 05 14:26:43 host openvpn[13170]: Initialization Sequence Completed


> sudo systemctl stop openvpn-client@client


> ifconfig

inet 10.65.x.x  netmask 255.255.255.255  destination 10.65.x.x
inet6 x:x  prefixlen 64  scopeid 0x20<link>
RX packets 3078  bytes 193448 (188.9 KiB)
RX errors 0  dropped 0  overruns 0  frame 0
TX packets 2341  bytes 134700 (131.5 KiB)
TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0


> route

Destination     Gateway         Genmask         Flags Metric Ref    Use Iface
...
10.65.x.x    0.0.0.0         255.255.255.255 UH    0      0        0 tun0
100.97.x.x     10.65.x.x     255.255.255.0   UG    0      0        0 tun0
...


> ping x.x.x.x
```

# Requirements



In this recipe, the setup and usage of the 1NCE VPN client with OpenVPN on a Linux OS (here Raspberry Pi OS) is shown. The configuration is done via the Command Line Interface (CLI).
A Linux OS with CLI and Internet access is needed to follow this guide.

# Download Configuration and Credentials



As a first step, the 1NCE VPN configuration file for Linux OS needs to be downloaded from the 1NCE Portal. 
Please proceed to download the configuration and credential file and place them in an accessible folder on the Linux OS.

# Install OpenVPN

<!-- powershell@1 -->

Open a CLI on the Linux OS. Install the current OpenVPN client for the used flavor of Linux OS. In this guide Raspberry Pi OS is used. The command for installing the OpenVPN client might differ dependent on the used OS flavor.
Please wait until the VPN client is installed.

# Configure OpenVPN

<!-- powershell@4-5 -->

Move the downloaded configuration and credential file to the OpenVPN folder. Dependent on the Linux OS, the exact target place might differ for the OpenVPN version. It is assumed that the downloaded files are in the currently selected folder.

# Check Credentials Path

<!-- powershell@8-10 -->

Open the VPN configuration file and check that the location of the credentials file is set correctly that it matches the actual file location.

# Start OpenVPN

<!-- powershell@13 -->

There are multiple ways how to start the OpenVPN client. In this guide, systemctl is used.
Use the start command and the name of the configuration file to start the OpenVPN connection.

# Monitor OpenVPN

<!-- powershell@16-30 -->

The current state of the connection can be viewed by querying the VPN client status.

# Stop VPN Connection

<!-- powershell@33 -->

Similar to starting the VPN client, the connection can be stopped by the systemctl command with the stop option.

# Monitor VPN Connection

<!-- powershell@36-43 -->

With ifconfig, the created tunnel interface details can be viewed. This will show the interface IP address and the transmitted VPN data volume.

# Monitor IP Routes

<!-- powershell@46-52 -->

On VPN client connect, default routes will be added to the system to allow access to the customer 1NCE SIM pool. These routes can be listed and viewed.

# ICMP Ping towards SIM

<!-- powershell@55 -->

To test the 1NCE VPN connection, a simple Ping towards an active device with a 1NCE SIM that is connected to the network and has a open PDP data session can be issued. Please note that the device needs to accept and response to Ping requests. Use the static IP of the device with the 1NCE SIM as destination for the Ping.

# Wrap Up



This recipe showed how to setup and use the 1NCE VPN to connect to IoT devices with a 1NCE SIM.
