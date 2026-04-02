---
title: Welcome
description: Digging into the 1NCE Documentation Guide!
slug: /
sidebar_position: 1
---

import NavigationGrid from '@site/src/components/NavigationGrid';

This is the place to find the detailed technical documentation developers need to start digging into the 1NCE connectivity services. This guide focuses on general knowledge and technical application information for the sim services, connectivity services, platform services, network services, and API reference. If there are any issues or questions regarding the 1NCE services, feel free to contact our technical support (<a href="https://1nce.com/en-eu/support/contact/contact-form" target="_blank">1NCE Contact</a>). We are thankful for suggestions and feedback from our customers as we continue to improve and develop our services.

Find the most viewed and recommended documentation chapters in the excerpts below for getting started with 1NCE services. To explore more of the Developer Hub, browse the menu on the left side. For quickly finding specific details, the search function helps to get the needed information. Click on the box header titles to be redirected to the individual chapters.

<NavigationGrid items={[
  { title: "Access Point Name (APN)", description: "Connecting IoT devices using the 1NCE mobile services requires setting the APN. This chapter shows the basics about the Access Point Name used for the 1NCE services.", link: "/data-services-apn" },
  { title: "API Explorer", description: "Check the API Explorer to get to know the Management API and learn more about the usage and the general capacities.", link: "/api/" },
  { title: "1NCE Portal Guide", description: "The 1NCE Portal offers an easy-to-use web interface for managing all 1NCE SIMs and related services. The documentation guides show configuration possibilities and features of the 1NCE Portal.", link: "/portal-dashboard" },
  { title: "Data Services", description: "Data Services are essential for connecting devices to linked up cloud services. These guides provide an introduction into the data connectivity with 1NCE SIMs.", link: "/connectivity-services-data-services" },
  { title: "1NCE OS", description: "Connecting IoT devices with cloud services like AWS can be challenging. Our 1NCE OS offers several features to easily integrate 1NCE connectivity into cloud services.", link: "/1nce-os-services-overview" },
  { title: "SMS Services", description: "Many IoT solutions still use SMS for basic configuration and messaging. With the 1NCE products SMS messaging is included. Learn how to use these services.", link: "/connectivity-services-sms-services" },
  { title: "SMS Forwarder Service", description: "Planning to use the SMS Services and receiving messages from SIM devices (MO-SMS) in a publish-subscribe manner? The SMS Forwarder Service offers a Webhook integration to receive Mobile Originated SMS messages on a custom HTTP endpoint.", link: "/platform-services-sms-forwarder" },
  { title: "Data Streamer Service", description: "All SIM devices generate network event and usage records as part of their normal operation. These events are useful for monitoring and debugging device behavior and usage statistics. Learn more about the 1NCE Data Streamer Service.", link: "/platform-services-data-streamer" },
  { title: "VPN Service", description: "The VPN Service offers the passivity to bidirectionally connect to your 1NCE SIM card devices via a private network connection without using the public Internet Breakout.", link: "/network-services-vpn-service" }
]} />
