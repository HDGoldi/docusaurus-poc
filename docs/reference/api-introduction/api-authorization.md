---
title: API Authorization
description: Using the Access Token for API Queries.
---
The 1NCE API uses the commonly applied Open Authorization (OAuth) to manage access to the general API resources. Please note that this API reference uses the actual provided 1NCE user account to execute the requests.

**Auth Request:**

* Use 1NCE Connectivity Management Platform (CMP) or API user credentials.
* Base64 encoded username/password using basic authentication in the request header.

**Auth Response:**

* Response contains the status code, token, type, validity timer, user id and scope.
* Returned token is of type String with a length of about 3000 characters.
* Use the token for any following 1NCE API requests.
* Token needs to be renewed after token timer expires. Default validity of a token is 3600 seconds (one hour).
* Auth responses are cached server-side. Repeated requests with the same credentials will return a cached token with a recalculated expires_in reflecting the remaining validity.

To give the Auth authentication a try, go to the [Create Access Token](ref:postaccesstokenpost) API Explorer page. Insert the 1NCE user credentials (username/password) into the API Explorer on the right side of the documentation. Afterwards, by clicking the _Try It_ button, the API request is send and the response with the Access Token will be shown.

Copy the response token for future usage of the following API requests.

***

# 1NCE API Bearer Access Token

Besides, the initial OAuth requests, every other 1NCE API call requires authorization with the obtained Bearer Access Token.

**1NCE API Requests:**

* Use Authorization Bearer Header with the obtained OAuth token.
* The token needs to be valid and not expired.
* Renew expired token with [Create Access Token](ref:postaccesstokenpost).
* Request Body and Parameters according to API Explorer documentation.

**1NCE API Responses:**

* 1NCE API returns valid JSON objects.
* API Explorer shows examples of JSON and return codes.

To give the API Explorer a try and to complete the code samples, insert the Access Bearer Token obtained from the [Create Access Token](ref:postaccesstokenpost) API call in the _OAuth2 Auth Bearer_ field. Afterwards, any API requests in the API Explorer as well as the code samples can be used to try the functionality.

![1139](/img/reference/api-introduction/api-authorization/31edaa2-api_explorer_bearer_auth.png "api_explorer_bearer_auth.png")
