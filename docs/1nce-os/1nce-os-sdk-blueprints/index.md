---
title: 1NCE SDK & Blueprints
---
<HTMLBlock>{`
<center><img src="/img/1nce-os/1nce-os-sdk-blueprints/001.png" style="cursor:pointer;max-width:100%;" onclick="(function(img){if(img.wnd!=null&&!img.wnd.closed){img.wnd.focus();}else{var r=function(evt){if(evt.data=='ready'&&evt.source==img.wnd){img.wnd.postMessage(decodeURIComponent(img.getAttribute('src')),'*');window.removeEventListener('message',r);}};window.addEventListener('message',r);img.wnd=window.open('https://viewer.diagrams.net/?client=1&page=0&edit=_blank');}})(this);"/></center>
`}</HTMLBlock>

1NCE offers different Blueprints and SDKs to allow customers a seamless setup and use of all features as part of 1NCE OS.

## 1NCE SDK

The 1NCE SDK is an open-source, MIT-licensed, C SDK which can be integrated into the customer IoT devices firmware. It contains functions to authenticate against the 1NCE OS managed cloud service and to compress data for use with Energy Saver.\
The 1NCE SDK can be downloaded at: [https://github.com/1NCE-GmbH/1nce-iot-c-sdk](https://github.com/1NCE-GmbH/1nce-iot-c-sdk)

## Blueprints

Blueprints are open-source, MIT-licensed code repositories for embedded platforms. We offer onboarding scripts like the FreeRTOS onboarding blueprint to guide through all our features that 1NCE OS offers. With examples and code, we hope to make the setup smooth and simple. 

* [FreeRTOS Blueprint](doc:sdk-blueprints-freertos) 
* [Zephyr Blueprint](doc:sdk-blueprints-zephyr)
* [Arduino Blueprint](doc:sdk-blueprints-arduino)
