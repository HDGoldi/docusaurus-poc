---
title: OpenVPN Files
description: Detailed description of the OpenVPN Files for the 1NCE VPN Service.
---
> 📘 OpenVPN Files Download
>
> Both the configuration and credential file can be downloaded from the configuration page of the <a href="https://portal.1nce.com/portal/customer/configuration\" target="_blank\">1NCE Portal</a>.

This section provides a general description of the tunnel interface of the VPN Service as well as an overview of the configuration and credential files. For setup and testing guides for different operating systems, please refer to the <a href="examples-vpn">VPN Setup Guide</a>.

***

Tunnel Interface

Connecting the VPN client on PC or server creates a separate tunnel network interface. All mobile originated and mobile terminated data traffic is sent through this tunnel interface and will be routed according to the destination IP address. When using the 1NCE VPN Service, the device with the 1NCE SIM can reach the customer VPN endpoint by addressing the static IP of the client application. In the other way, the application server can reach each individual device by addressing the static IP of the SIM. For opening or pinging a server to SIM device connection it is important that the SIM is attached to the network and the device modem has an active PDP data session open.

***

# OpenVPN Configuration Files

VPN Client File

When downloading the VPN configuration file (see extract below), two different file formats for Windows and Linux are available. The content of both files is almost identical. The only difference is the `auth-user-pass` entry in the file. This line points the VPN client towards the `credentials.txt` file for authenticating the user on the VPN server. The default path is different for the two operating systems but can be changed to the specific of the operating system or VPN client. The `remote` address and port of the VPN server should not be changed. It has to be ensured that both the domain address and the given port are configured in any firewall or access system to allow a connection towards the 1NCE VPN server. The table below shows the default config provided by 1NCE. Some parameters can be **adapted** (✔) while others should be **not changed** (❌). 1NCE does not recommend changing or altering the default configuration and does not guarantee that changes in the configuration will provide the expected connectivity.

| Config Parameter                                                                                                                                                                                                                                                                                                                                       |          Default Value          | Customizable |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :-----------------------------: | :----------: |
| **client** <br /> Indicates that the `xx-region-x-client.ovpn` file is a client configuration.                                                                                                                                                                                                                                                         |                                 |       ❌      |
| **dev** <br /> Virtual network device set to Tunnel (TUN), simulates a network layer device and operates with layer 3 IPv4 and IPv6 packets. Tunnel interface name can be changed to `tun<x>` where `<x>` is a integer number.                                                                                                                         |              `tun`              |       ✔      |
| **proto** <br /> Protocol setting for communicating with remote host.                                                                                                                                                                                                                                                                                  |              `udp`              |       ❌      |
| **remote** <br /> Remote host name or IP address.                                                                                                                                                                                                                                                                                                      |          `<url> <port>`         |       ❌      |
| **resolv-retry** <br /> If hostname resolve fails for –remote, retry resolve for n seconds before failing.                                                                                                                                                                                                                                             |            `infinite`           |       ✔      |
| **nobind** <br /> Do not bind to local address and port. The IP stack will allocate a dynamic port for returning packets.                                                                                                                                                                                                                              |                                 |       ❌      |
| **explicit-exit-notify** <br /> Send server an exit notification if tunnel is restarted or OpenVPN process is exited. Number of attempts that the client will try to resend the exit notification.                                                                                                                                                     |               `3`               |       ❌      |
| **keepalive** <br /> Simplification of –ping and –ping-restart. Checks the current connection state by ICMP PING. Settings are `<Interval Timeout>`.                                                                                                                                                                                                   |              `5 30`             |       ✔      |
| **(user)** <br /> Change the user ID of the OpenVPN process after initialization, dropping privileges in the process. This option is useful to protect the system in the event that some hostile party was able to gain control of an OpenVPN session. This is option only included in the `xx-region-x-client.conf` file for Linux operating systems. |              `root`             |       ✔      |
| **(group)** <br /> Optional group to be owner of this tunnel. This is option only included in the `xx-region-x-client.conf` file for Linux operating systems.                                                                                                                                                                                          |            `nogroup`            |       ✔      |
| **persist-key** <br /> Don't re-read key files across SIGUSR1 or --ping-restart.                                                                                                                                                                                                                                                                       |                                 |       ❌      |
| **persist-tun** <br /> Don't close and reopen TUN/TAP device or run up/down scripts across SIGUSR1 or --ping-restart restarts.                                                                                                                                                                                                                         |                                 |       ❌      |
| **remote-cert-tls** <br /> Require that peer certificate was signed with an explicit key usage and extended key usage based on RFC3280 TLS rules.                                                                                                                                                                                                      |             `server`            |       ❌      |
| **verb** <br /> Set output verbosity. Level 3 is recommended if you want a good summary of what’s happening without being swamped by output.                                                                                                                                                                                                           |               `3`               |       ✔      |
| **auth-nocache** <br />VPN client will not cache the username and password needed for authentication in virtual memory. This will prevent the log entry "WARNING: this configuration may cache passwords in memory -- use the auth-nocache option to prevent this" upon connection establishment.                                                      |                                 |       ✔      |
| **auth-user-pass** <br /> Authenticate with server using username/password from a file containing username/password on 2 lines.                                                                                                                                                                                                                        | ` /etc/openvpn/credentials.txt` |       ✔      |
| **auth-retry** <br /> Controls how OpenVPN responds to username/password verification errors such as the client-side response to an AUTH_FAILED message from the server or verification failure of the private key password.                                                                                                                           |           `nointeract`          |       ✔      |
| **tun-mtu** <br /> Optional parameter Maximum Transmission Units. In most cases, leave this parameter set to its default value. In case of issues with HTTPS or SSH connections, try lowering this value.                                                                                                                                              |              `1500`             |       ✔      |
| **certificates** <br /> Certificates included in the config file.                                                                                                                                                                                                                                                                                      |                                 |       ❌      |

More information about the configuration options can be found in the <a href="https://openvpn.net/community-resources/reference-manual-for-openvpn-2-4/" target="_blank">OpenVPN Reference Manual</a>.

Password Cache Warning

If detailed logging is setup for the OpenVPN client, the following warning might appear when the OpenVPN client is started:

_WARNING: this configuration may cache passwords in memory -- use the auth-nocache option to prevent this._

This warning can be avoided by adding the `auth-nocache` parameter into the OpenVPN client configuration file. This should usually have no side affects, nevertheless the [official documentation](https://community.openvpn.net) states:
“If specified, this directive will cause OpenVPN to immediately forget username/password inputs after they are used. As a result, when OpenVPN needs a username/password, it will prompt for input from `stdin`, which may be multiple times during the duration of an OpenVPN session.“

VPN Credential File

The `credentials.txt` file downloaded from the CMP (see extract below) contains a user id as username and an access token as password for the 1NCE VPN server. The content of this file does not need to be modified. The location of this file needs to be set in the VPN Config File `xx-region-x-client.ovpn`.

```text credentials.txt
<customer_id>
<vpn_access_token>
```
