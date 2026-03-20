---
title: LwM2M Service Client Example
description: LwM2M Client Example for the 1NCE LwM2M Service.
---
> ❗️ 1NCE SIM Connectivity
>
> For running the examples, a device/system with a 1NCE SIM that has an active data session connection needs to be used to send the request towards the 1NCE Services. The data traffic needs to be issued via the mobile network connection.

Two commonly used LwM2M Clients are Eclipse Leshan (JAVA) and Eclipse Wakaama (C). This example section covers a basic guide for both LwM2M implementations on how to use them with the 1NCE LwM2M Service.

# Eclipse Leshan

Please review the <a target="_blank" href="https://github.com/eclipse/leshan">Leshan GitHub</a> page for reference. The <a target="_blank" href="https://github.com/eclipse-leshan/leshan/tree/master/leshan-demo-client">Leshan Client Demo</a> can be built as a Java Maven project. The JAVA client can be started with the following settings:

```shell
java -jar ./target/leshan-client-demo-2.0.0-SNAPSHOT-jar-with-dependencies.jar -b -u lwm2m.os.1nce.com:5683
```

To emulate a Send Operation, enter the `send 6` operation.

To change the frequency of registration updates, in the Leshan client `DefaultRegistrationEngineFactory` should be updated with a specific communication period (example, make registration update trigger every 30 seconds):

```java
LeshanClientBuilder builder = new LeshanClientBuilder(cli.main.endpoint);

...
  
// Configure Registration Engine
DefaultRegistrationEngineFactory engineFactory = new DefaultRegistrationEngineFactory();

...
  
engineFactory.setCommunicationPeriod(30000);

...
  
builder.setRegistrationEngineFactory(engineFactory);
```

***

# Eclipse Wakaama

Please review the <a target="_blank" href="https://github.com/eclipse/wakaama">Wakaama GitHub</a> page for reference.\
Wakaama has a <a target="_blank" href="https://github.com/eclipse/wakaama#test-client-example">Client Example GitHub</a> which should be built as instructed and started with:

```shell
./lwm2mclient -b -h lwm2m.os.1nce.com -p 5683 -4
```
