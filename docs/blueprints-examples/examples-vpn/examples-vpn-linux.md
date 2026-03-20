---
title: VPN Setup Linux
description: Setup of 1NCE VPN using Linux.
---
<HTMLBlock>{`
<center><img src="/img/blueprints-examples/examples-vpn/examples-vpn-linux/001.png" style="cursor:pointer;max-width:100%;" onclick="(function(img){if(img.wnd!=null&&!img.wnd.closed){img.wnd.focus();}else{var r=function(evt){if(evt.data=='ready'&&evt.source==img.wnd){img.wnd.postMessage(decodeURIComponent(img.getAttribute('src')),'*');window.removeEventListener('message',r);}};window.addEventListener('message',r);img.wnd=window.open('https://viewer.diagrams.net/?client=1&page=0&edit=_blank');}})(this);"/></center>
`}</HTMLBlock>

Linux is very popular as a server operating system, thus it is used in many production systems for running applications. The 1NCE VPN service can be used with the OpenVPN client for Linux. This section covers the general installation and operation procedure of OpenVPN using the 1NCE VPN Service. Please note that due to the many flavors of the Linux operating system, the install procedure might be different for other Linux flavors. In the example, Ubuntu is used as operating system and the install process is carried out via Command Line Interface (CLI).

Please keep the `xx-region-x-client.conf` and the `credentials.txt` file downloaded from the 1NCE Portal at hand to get started. A current version of the OpenVPN client for Windows needs to be installed. For this please download the latest version from the <a href="https://openvpn.net/community-downloads/" target="_blank">OpenVPN Download Portal</a>.

***

# Linux Routing & Interface

Each 1NCE SIM has a fixed IP from the private IP space (RFC 1597) allocated. The connected VPN client also has a static address from the private IP space assigned. Please note that these addresses might not necessarily be from the same subnet, which has no impact on the functionality. 

> 📘 Pushed Routes and Updates
>
> The routing for all assigned SIM IP Subnets is pushed during the initialization of the connection. If new IP spaces are assigned as a result of a larger SIM order, please restart the VPN connection to obtain the latest routes.

The customer specific traffic routing from the VPN terminating client to the specific applications/servers interfaces needs to be set up on configured by the customer and is specific to the application case. An example of IP routes pushed from the VPN server to the client are listed below. Please note that the IP addresses in the following examples are just illustrative and may not be the same as in your configuration. A short snippet from the OpenVPN log file obtained during the start of a VPN connection. It shows the routes being pushed towards the Linux VPN interface.

```text
Fri Jan 28 08:42:19 2022 /sbin/ip link set dev tun0 up mtu 1500
Fri Jan 28 08:42:19 2022 /sbin/ip addr add dev tun0 local x.x.x.x peer x.x.x.x
Fri Jan 28 08:42:19 2022 /sbin/ip route add x.x.x.x/32 via x.x.x.x
Fri Jan 28 08:42:19 2022 /sbin/ip route add x.x.x.x/24 via x.x.x.x
```

Tunnel Adapter of the OpenVPN connection in Linux shows the VPN client IP address. This address should be used to connect with a SIM card to the VPN client/customer server.

```text
tun0: flags=4305<UP,POINTOPOINT,RUNNING,NOARP,MULTICAST>  mtu 1500
        inet 10.66.x.x  netmask 255.255.255.255  destination 10.66.x.x
        inet6 fe80::dde8:427c:xxxx:xxxx  prefixlen 64  scopeid 0x20<link>
        unspec 00-00-00-00-00-00-00-00-00-00-00-00-00-00-00-00  txqueuelen 100  (UNSPEC)
        RX packets 0  bytes 0 (0.0 B)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 1  bytes 48 (48.0 B)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0
```

Output of `route` in Linux CLI shows the current routes configured on the system. OpenVPN pushed the routes towards the SIMs after a VPN connection has been established. Please ensure that there are not local IP address conflicts within the network and SIM IP ranges.

```text
Kernel IP routing table
Destination     Gateway         Genmask         Flags Metric Ref    Use Iface
10.64.x.x       10.66.x.x    255.255.255.255 UGH   0      0        0 tun0
10.66.x.x       0.0.0.0      255.255.255.255 UH    0      0        0 tun0
10.210.x.x      10.66x.x     255.255.255.0   UG    0      0        0 tun0
```

Connecting the VPN client on Linux machine creates a separate tunnel network interface. All mobile originated and mobile terminated data traffic is sent through this tunnel interface and will be routed according to the destination IP address. When using the 1NCE VPN Service, the device with the 1NCE SIM can reach the customer VPN endpoint by addressing the static IP of the client application. In the other way, the application server can reach each individual device by addressing the static IP of the SIM.

***

# Linux VPN Client Setup

> 📘 VPN Connection Limit
>
> Please note that only once OpenVPN client towards the 1NCE Network connection at a time can be open at any given time. If multiple OpenVPN client connect with the same credentials at the same time, the connectivity will be inconsistent and dropped. Ensure to terminate any unused OpenVPN client connection before establishing a new connection.

To install and operate the Linux OpenVPN client, the example uses the Command Line Interface (CLI) to configure the 1NCE VPN Service. Please keep the configuration and credentials file from the 1NCE Portal at hand.

1. Ensure that the operating system is up-to-date and the latest package sources are available.

```text Ubuntu Update
sudo apt update
sudo apt upgrade
```

2. Install OpenVPN using the system packet manager. Optionally a custom OpenVPN version can be build from source code if needed.

```text Open VPN Install
sudo apt install openvpn
```

3. Log into the **1NCE Portal**. Navigate to the **Configuration** tab and open the **OpenVPN Configuration** dropdown. Select **Linux/MacOS** as configuration medium and download the OpenVPN *xx-region-x-client.conf* and *credentials.txt* files.

<div style={{textAlign: 'center'}}>
<img src="/img/blueprints-examples/examples-vpn/examples-vpn-linux/d5055b7-1nce-vpn-linux.png" alt="1nce-vpn-linux.png" width="80%" />
</div>

4. Place the *xx-region-x-client.conf* and *credentials.txt* in the OpenVPN configuration folder, typically */etc/openvpn/*.
5. Optionally rename the *xx-region-x-client.conf* and *credentials.txt* files to make their names unique and more transparent.
6. If required, change the path of the *credentials.txt* file in the *xx-region-x-client.conf* on line *auth-user-pass*. This is needed if the credentials file is placed somewhere else besides the default location or if the files were renamed.
7. Make any alterations to the VPN configuration (e.g. add logging or custom parameters) before starting the client the first time. 
8. As a first run, start the VPN client directly in the CLI and not as a service. This will provide a direct output of the logs and makes debugging easier. Adapt the path to the configuration file to the location and filename of the used config files.

```text OpenVPN Start
sudo openvpn --config /etc/openvpn/1nce-conf.conf
```

```text OpenVPN Connection Log
Fri Jan 28 08:42:12 2022 OpenVPN 2.4.7 x86_64-pc-linux-gnu [SSL (OpenSSL)] [LZO] [LZ4] [EPOLL] [PKCS11] [MH/PKTINFO] [AEAD] built on Jul 19 2021
Fri Jan 28 08:42:12 2022 library versions: OpenSSL 1.1.1f  31 Mar 2020, LZO 2.10
Fri Jan 28 08:42:12 2022 TCP/UDP: Preserving recently used remote address: [AF_INET]x.x.x.x:1194
Fri Jan 28 08:42:12 2022 Socket Buffers: R=[212992->212992] S=[212992->212992]
Fri Jan 28 08:42:12 2022 UDP link local: (not bound)
Fri Jan 28 08:42:12 2022 UDP link remote: [AF_INET]x.x.x.x:1194
Fri Jan 28 08:42:12 2022 NOTE: UID/GID downgrade will be delayed because of --client, --pull, or --up-delay
Fri Jan 28 08:42:12 2022 TLS: Initial packet from [AF_INET]x.x.x.x:1194
Fri Jan 28 08:42:12 2022 VERIFY OK: depth=1, C=de, ST=North Rhine-Westphalia, L=Cologne, O=1nce, OU=1nce Operations, CN=x, name=1nce
Fri Jan 28 08:42:12 2022 VERIFY KU OK
Fri Jan 28 08:42:12 2022 Validating certificate extended key usage
Fri Jan 28 08:42:12 2022 ++ Certificate has EKU (str) TLS Web Server Authentication, expects TLS Web Server Authentication
Fri Jan 28 08:42:12 2022 VERIFY EKU OK
Fri Jan 28 08:42:12 2022 VERIFY OK: depth=0, C=de, ST=North Rhine-Westphalia, L=Cologne, O=1nce, OU=1nce Operations, CN=x, name=1nce
Fri Jan 28 08:42:13 2022 Control Channel: TLSv1.3, cipher TLSv1.3 TLS_AES_256_GCM_SHA384, 2048 bit RSA
Fri Jan 28 08:42:13 2022 [x] Peer Connection Initiated with [AF_INET]x.x.x.x:1194
Fri Jan 28 08:42:14 2022 SENT CONTROL [x]: 'PUSH_REQUEST' (status=1)
Fri Jan 28 08:42:19 2022 SENT CONTROL [x]: 'PUSH_REQUEST' (status=1)
Fri Jan 28 08:42:19 2022 PUSH: Received control message: 'PUSH_REPLY,route x.x.x.x,topology net30,ping 5,ping-restart 30,route x.x.x.x x.x.x.x,ifconfig x.x.x.x x.x.x.x,peer-id 322,cipher AES-256-GCM'
Fri Jan 28 08:42:19 2022 OPTIONS IMPORT: timers and/or timeouts modified
Fri Jan 28 08:42:19 2022 OPTIONS IMPORT: --ifconfig/up options modified
Fri Jan 28 08:42:19 2022 OPTIONS IMPORT: route options modified
Fri Jan 28 08:42:19 2022 OPTIONS IMPORT: peer-id set
Fri Jan 28 08:42:19 2022 OPTIONS IMPORT: adjusting link_mtu to 1624
Fri Jan 28 08:42:19 2022 OPTIONS IMPORT: data channel crypto options modified
Fri Jan 28 08:42:19 2022 Data Channel: using negotiated cipher 'AES-256-GCM'
Fri Jan 28 08:42:19 2022 Outgoing Data Channel: Cipher 'AES-256-GCM' initialized with 256 bit key
Fri Jan 28 08:42:19 2022 Incoming Data Channel: Cipher 'AES-256-GCM' initialized with 256 bit key
Fri Jan 28 08:42:19 2022 ROUTE_GATEWAY x.x.x.x/x.x.x.x IFACE=ens3
Fri Jan 28 08:42:19 2022 TUN/TAP device tun0 opened
Fri Jan 28 08:42:19 2022 TUN/TAP TX queue length set to 100
Fri Jan 28 08:42:19 2022 /sbin/ip link set dev tun0 up mtu 1500
Fri Jan 28 08:42:19 2022 /sbin/ip addr add dev tun0 local x.x.x.x peer x.x.x.x
Fri Jan 28 08:42:19 2022 /sbin/ip route add x.x.x.x/32 via x.x.x.x
Fri Jan 28 08:42:19 2022 /sbin/ip route add x.x.x.x/24 via x.x.x.x
Fri Jan 28 08:42:19 2022 GID set to nogroup
Fri Jan 28 08:42:19 2022 UID set to root
Fri Jan 28 08:42:19 2022 Initialization Sequence Completed
^C
Fri Jan 28 08:42:21 2022 event_wait : Interrupted system call (code=4)
Fri Jan 28 08:42:21 2022 SIGTERM received, sending exit notification to peer
Fri Jan 28 08:42:24 2022 /sbin/ip route del x.x.x.x/32
Fri Jan 28 08:42:24 2022 /sbin/ip route del x.x.x.x/24
Fri Jan 28 08:42:24 2022 Closing TUN/TAP interface
Fri Jan 28 08:42:24 2022 /sbin/ip addr del dev tun0 local x.x.x.x peer x.x.x.x
Fri Jan 28 08:42:24 2022 SIGTERM[soft,exit-with-notification] received, process exiting
```

9. OpenVPN will start and try to connect to the VPN server. The logs (see second tab) will be printed to the CLI and show the current connection status. If there are any unexpected errors, check the configuration and setup and please try again. 
10. The connection can be closed by CTRL+C.
11. To run the 1NCE VPN with OpenVPN client as a system service in the background, use the `sytemctl` commands. Ensure that the config name provided to start the VPN client matches the filename in `/etc/openvpn/`. Note that the `.conf` extension needs to be omitted.

```text
sudo systemctl start openvpn@1nce-conf

sudo systemctl status openvpn@1nce-conf

sudo systemctl restart openvpn@1nce-conf

sudo systemctl stop openvpn@1nce-conf
```

12. Once the service is up and running, the status can be queried to see the current VPN connection status.
13. To restart or stop the VPN client, use the `restart` or `stop` command.

If a successful connection is established, the Linux system should now be ready to ping and establish connection towards active/connected 1NCE SIM with an open PDP data session.

***

# Monitoring and Logging

The 1NCE VPN Service on Linux with OpenVPN allows for easy monitoring and optional logging. This is especially useful for debugging the VPN setup in case of connectivity issues. By default, the VPN connection towards the 1NCE Network is updated once per hour. This renewal process should be logged in the monitoring. If this renewal happens very frequently, it might point towards an unstable connection or two VPN clients fighting for the same single connection.

## Extended Logging

For extended logging over longer periods of time or with a defined information granularity, the *xx-region-x-client.conf* configuration needs to be adapted. The example below shows possible configuration parameters.\
The Verbosity *verb\<log\_level>* defines the amount of detail included in the log file. The default value of 3 offers a good mix between detail and abstraction. The settable range is 1 to 4. Please note that setting the log level to 4 will generate larger log files.\
The path where a log file will be saved is specified by *log\<path\_to\_log\_file>/openvpn.log*. Please adapt the path to a valid place in Linux to store the logs.\
Log files can be automatically rotated. The example shown below provides a basic starting point for weekly log file rotation. For more information please see <a target="_blank" href="https://openvpn.net/community-resources/reference-manual-for-openvpn-2-4/">OpenVPN Documentation</a>.

```text
verb <log_level>

log <path_to_log_file>/openvpn.log

<path_to_log_file>/openvpn.log {
    weekly
    rotate 12
    copytruncate
    compress
    delaycompress
    missingok
    notifempty
}
```
