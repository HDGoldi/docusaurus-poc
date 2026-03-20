---
title: API Rate Limits
description: Know the Limits of the API.
---
The 1NCE API can be used by any customer to query and configure settings of 1NCE SIMs, products and related services. To protect the API from misusage and overloading, certain rate limits for the endpoints are set. The rate limits are derived from analyzing the existing application case patterns of 1NCE customers. Therefore, the API rate limits should not interfere with common use cases for monitoring or controlling 1NCE services.  
Listed below are the current rate limits for all endpoints available through the 1NCE Management API.

<Table align={["left","left"]}>
  <thead>
    <tr>
      <th style={{ textAlign: "left" }}>
        Endpoint
      </th>

      <th style={{ textAlign: "left" }}>
        API Rate Limit
      </th>
    </tr>
  </thead>

  <tbody>
    <tr>
      <td style={{ textAlign: "left" }}>
        _Authorization:_
        /oauth
      </td>

      <td style={{ textAlign: "left" }}>
        600 requests per IP address per minutes
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        _SIM Management:_  
        /sims
      </td>

      <td style={{ textAlign: "left" }}>
        10 requests per second per Customer
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        _Order Management:_  
        /orders
      </td>

      <td style={{ textAlign: "left" }}>
        100 requests per IP address per 5 minutes
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        _Product Information:_  
        /products
      </td>

      <td style={{ textAlign: "left" }}>
        100 requests per IP address per 5 minutes
      </td>
    </tr>

    <tr>
      <td style={{ textAlign: "left" }}>
        _Support Management:_  
        /support
      </td>

      <td style={{ textAlign: "left" }}>
        100 requests per IP address per 5 minutes
      </td>
    </tr>
  </tbody>
</Table>

***

# Large SIM Batch Monitoring

Despite the SIM Management endpoints not having any rate limit set, it is advised to be gentle with the SIM Management API usage. 1NCE recommends to avoid very regular, high frequency API access with large number of requests for monitoring. The 1NCE API is a great tool for monitoring and querying data, but for regular monitoring of large SIM batches 1NCE recommends to use the Data Streamer Service. The streaming service allows to monitor SIM Events and Usages as it offers near real-time monitoring without the need to query the API regularly.

If there are any issues or questions regarding the API integration, feel free to contact our <a href="[https://1nce.com/en/help-center/support/]([https://1nce.com/en-eu/support](https://1nce.com/en-eu/support/contact))" target="_blank">1NCE Support</a> for technical guidance.
