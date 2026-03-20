---
title: Users & Organisation
description: Managing Users and Suborganizations.
---
# User Management

The 1NCE Customer Portal offers the option to create multiple user accounts which allows for different user roles and access rights. In the "User" tab a root owner of the account can create and edit new user accounts. A general overview of all current users of the 1NCE organization is provided in a list view.

<div style={{textAlign: 'center'}}>
<img src="/img/1nce-portal/portal-users-organisations/50d19d6-1NCE_User_List.PNG" alt="1NCE_User_List.PNG" width="80%" />
</div>

## User Roles

The following roles for additional user accounts are available:

<Table align={["left","left"]}>
  <thead>
    <tr>
      <th>
        Role
      </th>

      <th>
        Description
      </th>
    </tr>
  </thead>

  <tbody>
    <tr>
      <td>
        Owner
      </td>

      <td>
        Initial user of the organization that cannot be changed. Includes all functionalities and access to the entire organization. New users can have the Owner role assigned as well. The owner also has access to the Management API. Can administer users with Admin, User, API User, Read Only, and 3rd party access role. *To administer Owner, please submit a service request.*
      </td>
    </tr>

    <tr>
      <td>
        Admin
      </td>

      <td>
        Includes all functionalities and access to the entire organization.  Can administer users with User, API User, Read Only, and 3rd party access role. This user role has no access the Management API.
      </td>
    </tr>

    <tr>
      <td>
        User
      </td>

      <td>
        Can manage SIM Cards in the Portal, but has no access to orders and top-ups, and cannot trigger new orders or manage users. This user role has no access to the Mangement API.
      </td>
    </tr>

    <tr>
      <td>
        API User
      </td>

      <td>
        User role only for accessing the 1NCE API. Uses client\_secret and client\_id as username and password for the API authentication. Has the account number as prefix in the client\_id.\
        All endpoints are available for this role including new orders.  
      </td>
    </tr>

    <tr>
      <td>
        Read Only
      </td>

      <td>
        User role designed to allow Read-only access to the Portal. This user role has no access to the Mangement API.
      </td>
    </tr>

    <tr>
      <td>
        3rd party access
      </td>

      <td>
        User role designed for allowing 3rd Party Users limited access to the Portal. This user role has no access to the Mangement API.
      </td>
    </tr>
  </tbody>
</Table>

### User Roles Details

See the following table for an exact overview of the roles and the permissions for each component of the 1NCE Portal.

<HTMLBlock>{`
<style type="text/css">
.tg  {border-collapse:collapse;border-spacing:0;}
.tg td{border-color:black;border-style:solid;border-width:1px;font-family:Arial, sans-serif;font-size:14px;
  overflow:hidden;padding:10px 5px;word-break:normal;}
.tg th{border-color:black;border-style:solid;border-width:1px;font-family:Arial, sans-serif;font-size:14px;
  font-weight:normal;overflow:hidden;padding:10px 5px;word-break:normal;}
.tg .tg-cly1{text-align:left;vertical-align:middle}
.tg .tg-0lax{text-align:left;vertical-align:top}
</style>
<table class="tg">
<thead>
  <tr>
    <th class="tg-0lax" colspan="2">Portal Areas</th>
    <th class="tg-0lax">Owner</th>
    <th class="tg-0lax">Admin</th>
    <th class="tg-0lax">User</th>
    <th class="tg-0lax">Read Only</th>
    <th class="tg-0lax">3rd Party Access</th>
    <th class="tg-0lax">API User</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td class="tg-cly1" rowspan="3">Dashboard</td>
    <td class="tg-0lax">See All</td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax" rowspan="42"><span style="font-weight:400;font-style:normal">❌</span></td>
  </tr>
  <tr>
    <td class="tg-0lax">Reorder Button</td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">❌</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">❌</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">❌</span></td>
  </tr>
  <tr>
    <td class="tg-0lax">Latest Order Widget</td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">❌</span></td>
  </tr>
  <tr>
    <td class="tg-cly1" rowspan="8">My SIMs</td>
    <td class="tg-0lax">See All</td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
  </tr>
  <tr>
    <td class="tg-0lax">SIM State</td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">❌</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">❌</span></td>
  </tr>
  <tr>
    <td class="tg-0lax">IMEI Lock</td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">❌</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">❌</span></td>
  </tr>
  <tr>
    <td class="tg-0lax">Auto-Top-Up</td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">❌</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">❌</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">❌</span></td>
  </tr>
  <tr>
    <td class="tg-0lax">Reset Connectivity</td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">❌</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
  </tr>
  <tr>
    <td class="tg-0lax">SIM List Export</td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">❌</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
  </tr>
  <tr>
    <td class="tg-0lax">Reorder / Top-Up</td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">❌</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">❌</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">❌</span></td>
  </tr>
  <tr>
    <td class="tg-0lax">Send SMS</td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">❌</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
  </tr>
  <tr>
    <td class="tg-cly1" rowspan="9">Configuration</td>
    <td class="tg-0lax">Network Settings</td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">❌</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
  </tr>
  <tr>
    <td class="tg-0lax">Breakout Settings</td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">❌</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">❌</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
  </tr>
  <tr>
    <td class="tg-0lax">Monthly Limit</td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">❌</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
  </tr>
  <tr>
    <td class="tg-0lax">IMEI Lock</td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">❌</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">❌</span></td>
  </tr>
  <tr>
    <td class="tg-0lax">Auto-Top-Up</td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">❌</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">❌</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">❌</span></td>
  </tr>
  <tr>
    <td class="tg-0lax">Data Streams</td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">❌</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">❌</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
  </tr>
  <tr>
    <td class="tg-0lax">SMS Forwarder</td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">❌</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
  </tr>
  <tr>
    <td class="tg-0lax">OpenVPN</td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">❌</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
  </tr>
  <tr>
    <td class="tg-0lax">Management API</td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">❌</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
  </tr>
  <tr>
    <td class="tg-0lax">1NCE OS</td>
    <td class="tg-0lax">Tab Available</td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
  </tr>
  <tr>
    <td class="tg-cly1" rowspan="6">Account</td>
    <td class="tg-0lax">See All</td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
  </tr>
  <tr>
    <td class="tg-0lax">Customer Data</td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">❌</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">❌</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">❌</span></td>
  </tr>
  <tr>
    <td class="tg-0lax">User Data</td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
  </tr>
  <tr>
    <td class="tg-0lax">Add New E-Mail</td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">❌</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">❌</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">❌</span></td>
  </tr>
  <tr>
    <td class="tg-0lax">Billing and Shipping Address</td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">❌</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">❌</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">❌</span></td>
  </tr>
  <tr>
    <td class="tg-0lax">Payment Details</td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">❌</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">❌</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">❌</span></td>
  </tr>
  <tr>
    <td class="tg-cly1" rowspan="4">Orders</td>
    <td class="tg-0lax">See All</td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">❌</span></td>
  </tr>
  <tr>
    <td class="tg-0lax">Download Invoices</td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">❌</span></td>
  </tr>
  <tr>
    <td class="tg-0lax">Trigger New Order</td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">❌</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">❌</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">❌</span></td>
  </tr>
  <tr>
    <td class="tg-0lax">Download Affected SIMs</td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">❌</span></td>
  </tr>
  <tr>
    <td class="tg-cly1" rowspan="5">Users</td>
    <td class="tg-0lax">See All</td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
  </tr>
  <tr>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">Administer Own User</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
  </tr>
  <tr>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">Administer Owner</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">❌</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">❌</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">❌</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">❌</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">❌</span></td>
  </tr>
  <tr>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">Administer Admin</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">❌</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">❌</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">❌</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">❌</span></td>
  </tr>
  <tr>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">Administer User</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">❌</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">❌</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">❌</span></td>
  </tr>
  <tr>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">Administer API User</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">❌</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">❌</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">❌</span></td>
  </tr>
  <tr>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">Administer Read Only</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">❌</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">❌</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">❌</span></td>
  </tr>
  <tr>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">Administer 3rd party access</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">❌</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">❌</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">❌</span></td>
  </tr>
  <tr>
    <td class="tg-cly1" rowspan="3">Organisation</td>
    <td class="tg-0lax">See All</td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
  </tr>
  <tr>
    <td class="tg-0lax">Add Organisation</td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">❌</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">❌</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">❌</span></td>
  </tr>
  <tr>
    <td class="tg-0lax">SIM Transfer</td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">❌</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">❌</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">❌</span></td>
  </tr>
  <tr>
    <td class="tg-0lax">Performance</td>
    <td class="tg-0lax">See All</td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
  </tr>
  <tr>
    <td class="tg-cly1" rowspan="2">Support</td>
    <td class="tg-0lax">See All</td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">❌</span></td>
  </tr>
  <tr>
    <td class="tg-0lax">New Service Request</td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">❌</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">❌</span></td>
  </tr>
  <tr>
    <td class="tg-0lax">API Access</td>
    <td class="tg-0lax"></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">❌</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">❌</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">❌</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">❌</span></td>
    <td class="tg-0lax"><span style="font-weight:400;font-style:normal">✅</span></td>
  </tr>
</tbody>
</table>
`}</HTMLBlock>

## User Creation

A new user can be created using the "New User" button on the top right. The mandatory details depend on the type of the user that needs to be created. The e-mail address is used for the confirmation of the account as well as the login name for the 1NCE services. Customers have to make sure that the entered e-mail address is valid and can receive messages. After creating a new user an e-mail is sent to the new mail address requesting to set an initial new password for the 1NCE Customer Portal.\
For the API role, the client\_id represents the username and the client\_secret the password. The client\_id has the account number with an underscore as prefix. The client\_secret needs to be set during the user creation as there is no e-mail address attached to this user role.

<div style={{textAlign: 'center'}}>
<img src="/img/1nce-portal/portal-users-organisations/8a31386-1NCE_Add_User.png" alt="1NCE_Add_User.png" width="80%" />
</div>

## User Account Alteration

By clicking on a user shown in the list of current users, the details of this account can be changed or deleted. Changes can be applied by editing the boxes in the form and saving the new data. A user can be deleted by clicking on the "Delete" button in the Edit User popup.

<div style={{textAlign: 'center'}}>
<img src="/img/1nce-portal/portal-users-organisations/c710909-1NCE_User_Edit.png" alt="1NCE_User_Edit.png" width="80%" />
</div>

***

# Organization Management

> ❗️ AWS Marketplace Accounts
>
> Please note that Organization Management is not available for AWS Marketplace accounts.

In the "Organisation" tab, a list of all sub-organizations of the main 1NCE user account are shown and can be managed. This feature enables a customer to create independent organizations, e.g., for their subsidiary or sub-contractor.

<div style={{textAlign: 'center'}}>
<img src="/img/1nce-portal/portal-users-organisations/9456a0d-1NCE_Org_List.PNG" alt="1NCE_Org_List.PNG" width="80%" />
</div>

## Organisation Creation

Creating a new organization requires the role Owner or Admin to be logged in. To create a new organization, users have to click on the "New Organisation" button in the top right corner of the page. The creation process of a new organization is structured in a few simple steps. All the required data have to be entered in the shown forms.

<div style={{textAlign: 'center'}}>
![1NCE_Org_Creation.png](/img/1nce-portal/portal-users-organisations/483feb5-1NCE_Org_Creation.png)
</div>

After validating the content summary and submitting the request, the new owner will be notified and asked to set up their password via e-mail, so that they can access the customer portal. Please note that the process of creating a sub-organization will not be finalized until the new owner has set the password.\
All existing features are active for the new organization. An order of SIM cards can be placed in the new organization by using the "Reorder" button on the dashboard and go through the regular ordering process. Alternatively, the master organization can order the SIM cards and transfer them to the sub-organization afterwards. The master organization can see the total number of SIMs ordered by each organization, but without having direct access unless a dedicated account has been created by the sub-org entity. 

## Organization SIM Transfer

If there are any sub-organizations, the "Organization" tab also offers the possibility to transfer SIMs from the master organization and vice versa. A direct transfer from sub- to sub-organization is not possible. The transfer of SIMs can also be done using the 1NCE API. Customers can transfer just one single SIM, a range of SIMs, or several ranges of SIMs. Here are some helpful tips for transferring several ranges:

* The file with the ranges can either be .CSV or .TXT format
* Single SIM ICCID, use the ICCID as Start- and End Range like “ICCID1;ICCID1”
* Ensure no duplicate ICCID in the file as this will lead to errors in processing
* Do not put a semicolon at the end of each line
* There is no need to use quotation marks at all (not mandatory)

<div style={{textAlign: 'center'}}>
<img src="/img/1nce-portal/portal-users-organisations/b0d5ae3-230203_Organisations_SIM_Transfer.PNG" alt="230203_Organisations_SIM Transfer.PNG" width="80%" />
</div>

## Sub-Organization Deletion

Sub-Organizations can be deleted directly from the portal. To delete an organization customers have to choose the respective sub-organization and click "Delete". A sub-organization can only be deleted after it is fully created and has no SIMs or open workflows running (e.g. open invoices or open SIM actions).
