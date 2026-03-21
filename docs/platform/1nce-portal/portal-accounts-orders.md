---
title: Account & Orders
description: Account & Order Management
sidebar_position: 4
---
# Account

The "Account" tab allows the customer to view and edit their personal/company data, billing and shipping addresses as well as to manage the Auto-Top-Up payment.

> ❗️ Non-Changeable Data Fields
>
> Due to legal reasons we cannot allow to change the company name or billing country of the billing address. For assistance please contact our support.

In the Customer and User Data dropdown, the contact information and account details for the root organization and for the logged-in user can be viewed and changed. Note that the e-mail address shown in the Customer Data column is the main contact where all invoices are being sent to digitally. An additional e-mail address can be stored which receives the invoices in copy, for example the accounting department. Please select the category "Invoice" for that.\
Furthermore the category "Volume Notifications" can be selected. This includes all e-mails on volume notifications for data/SMS as well as reaching the monthly set volume limit.\
The language selection defines the contact language meaning e-mails, invoices and service notifications. 

In the User Data column information regarding the currently logged-in user data can be viewed and changed. The logged-in user (no matter which role) can change their personal details like name and e-mail address as well as password. These details can also be changed by an Admin or Owner via the "Users" tab except the password for the roles Owner, Admin and User.

The Billing and Shipping Addresses dropdown shows all saved billing and shipping addresses. Existing entries can be changed and new addresses can be added by the customer for future orders. The addresses are stored and will appear each time the user orders additional SIM cards or Top-Ups.

The Payment Details Auto-Top-Up dropdown allows to save/delete credit card details if the customer wishes to activate Auto-Top-Up for single or all SIMs. The Auto-Top-Up feature can be enabled for particular SIMs in the "My SIMs" tab or for all SIMs in the "Configuration" tab. An API call is also available. 

<div style={{textAlign: 'center'}}>
<img src="/img/1nce-portal/portal-accounts-orders/c341635-220422_Account_tab.PNG" alt="220422_Account_tab.PNG" width="80%" />
</div>

***

# Orders

In the "Orders" tab, all orders from the organization's 1NCE account are listed. The table provides an overview of the important order parameters as well as the current status of an order. The status indicator (completed, in preparation or cancelled) can be used to monitor pending orders.\
On this page, previous invoices of specific orders can be downloaded. Additionally, a CSV list of all SIMs of a particular order can be downloaded using the link in the "Affected SIMs" column. This list for a dedicated order consists of ICCID, label, IMSI and MSISDN of the SIMs. In case there has been any correction to the order, the corrected or updated invoices can be downloaded in the column "Additional Documents".

<div style={{textAlign: 'center'}}>
![20220218_Orders.PNG](/img/1nce-portal/portal-accounts-orders/9242b3a-20220218_Orders.PNG)
</div>
