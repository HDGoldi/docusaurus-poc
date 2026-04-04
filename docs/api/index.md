---
title: API Explorer
description: Getting to know the 1NCE API.
slug: /
---

# Welcome to the 1NCE API

:::info Download YAML Files
To download the latest OpenAPI files for the 1NCE API please visit: [/api/](https://help.1nce.com/dev-hub/openapi).
:::

:::warning 'Try It' Feature
Please note that the 'Try It' function can be used only with a valid 1NCE customer account. All queries are made towards the customer account. Be careful with trying out features like orders, top ups, etc. as these API calls will trigger the actual process.

**Known limitation:** The 1NCE API (`api.1nce.com`) does not include CORS headers in its responses, so the interactive Try It panel will return CORS errors when called from the browser. To test API calls, copy the generated curl command or code snippet and execute it locally.
:::

Welcome to the 1NCE API documentation. This documentation covers the ins and outs of the API for managing, controlling, and monitoring the 1NCE SIM cards and the related services. This guide is divided into chapters, which group individual, logical topics together.

As the 1NCE API requires users to authorize in order to use the interface, we strongly suggest starting with the authorization chapters first.

The API is structured into different categories:

- **Authorization** - Authentication and token management
- **SIM Management** - SIM card operations and monitoring
- **Order Management** - Order placement and tracking
- **Product Information** - Product catalog and details
- **Support Management** - Support ticket management
- **1NCE OS** - 1NCE Operating System APIs

These groups are created according to the features of the 1NCE products.

Besides documenting the functionality of the possible API requests, this guide offers the opportunity for existing customers to try out the calls with their personal 1NCE account. As an additional feature, the guide offers ready-to-use code snippets for each query in a wide variety of programming languages. These samples ease the transition from testing out the API to integrating the interfaces into an automated production environment.

If there are any issues or questions regarding the 1NCE services, feel free to contact our [technical support](https://1nce.com/en-eu/support/contact).
