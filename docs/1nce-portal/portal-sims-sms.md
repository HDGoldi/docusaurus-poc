---
title: My SIMs & SMS Console
description: Management of the 1NCE SIMs
---
The "My SIMs" tab provides an overview of all SIMs currently attached to the specific organization. This page is used as an overview and to configure all SIM functionalities from the 1NCE Portal.

<Image align="center" alt={1354} border={false} caption="Overview of the My SIMs page, showing all SIMs of the organization." title="20220214_SIM List.PNG" src="/img/1nce-portal/portal-sims-sms/73e4c9a-20220214_SIM_List.PNG" />

***

# SIM Overview

The view of all SIMs can be customized by altering the filter options or by using the search function to filter for specific parameters. The search option allows the user to search for a certain SIM by IMSI, Label, ICCID or MSISDN. The search supports a partial search as well. Basic global filtering for data and SMS volume and SIM card status can be applied. The values in the columns can be sorted in an ascending or descending order. By default the table is sorted by ICCID.  
The table can be sorted and filtered via the column titles. When a column is sorted or filtered an icon becomes visible.  
Further, the shown columns can be (de-)activated to select only the ones of interest using the "Adjust Columns" feature. Note, that for large number of SIM Cards there can be multiple pages of the list view. The number of SIMs per page can be set manually and has a maximum number of 500. Below, an explanation of all available columns to select from:

## Status

| Parameter     | Description                                                                                                                                                                                                                                                                                                                                                                         |
| :------------ | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Activated`   | Green checkmark, indicating that full SIM functionality is activated and the SIM can connect to the 1NCE services.                                                                                                                                                                                                                                                                  |
| `Deactivated` | Black cross, indicating that the SIM is deactivated. The SIM cannot connect to the 1NCE network.                                                                                                                                                                                                                                                                                    |
| `Expired`     | The `Expired` status indicates that the SIM card has reached the end of its lifetime and is no longer active. This means the SIM is fully suspended in the network and cannot connect anymore. Using a <Anchor label="Lifetime Extension" target="_blank" href="https://help.1nce.com/dev-hub/reference/extendsimsusingpost#/">Lifetime Extension</Anchor> can reactivate the SIM.  |

## Session

| Parameter  | Description                                                                                                                                                                                                     |
| :--------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Online`   | Green Light: The SIM has established a data session. When a SIM device does not properly close the PDP data session, this status will remain until the device is flushed from the network.                      |
| `Offline`  | Red Light: The SIM device is not connected to the 1NCE network.                                                                                                                                                 |
| `Attached` | Amber Light: The SIM is attached to a mobile network, but has no active data session. When a SIM is not properly detached from a network, this status will remain until the device is flushed from the network. |

## SIM Details

<Table align={["left","left"]}>
  <thead>
    <tr>
      <th>
        Parameter
      </th>

      <th>
        Description
      </th>
    </tr>
  </thead>

  <tbody>
    <tr>
      <td>
        `ICCID`
      </td>

      <td>
        Unique serial of the SIM card.
      </td>
    </tr>

    <tr>
      <td>
        `MSISDN`
      </td>

      <td>
        Phone number of the SIM card. The SIM can not be used for voice services or to receive/send SMS to external parties. The chapters [SMS Services](https://help.1nce.com/dev-hub/docs/connectivity-services-sms-services) and [SMS Forwarding Service](https://help.1nce.com/dev-hub/docs/platform-services-sms-forwarder) provide more information.
      </td>
    </tr>

    <tr>
      <td>
        `IMEI(SV)`
      </td>

      <td>
        Identifier of the device the SIM is inserted into. The IMEI displayed in the 1NCE Portal is retrieved from the network during PDP context activation, the format is as follows: IMEI + SV (software version), based on the standard specification 3GPP TS23.003.  
        See the <a href="/dev-hub/docs/sim-cards-knowledge#international-mobile-equipment-identity-imei">IMEI Reference</a> for more information.
      </td>
    </tr>

    <tr>
      <td>
        `IMEI Lock`
      </td>

      <td>
        Status of the IMEI lock for this specific SIM. If enabled the SIM is bound to the current device.  
        See the <a href="/dev-hub/docs/sim-cards-knowledge#imei-lock">IMEI Lock Reference</a> for more information.
      </td>
    </tr>

    <tr>
      <td>
        `IP Address`
      </td>

      <td>
        Static IP address of the specific SIM. Used for accessing the SIM via 1NCE VPN Services.
      </td>
    </tr>

    <tr>
      <td>
        `SIM Type`
      </td>

      <td>
        Specific type of SIM card, FlexSIM or eSIM.
      </td>
    </tr>

    <tr>
      <td>
        `Tariff`
      </td>

      <td>
        Details about the tariff of the specific SIM showing the data and SMS volume.
      </td>
    </tr>

    <tr>
      <td>
        `Label`
      </td>

      <td>
        Self-set label text for the specific SIM card.
      </td>
    </tr>

    <tr>
      <td>
        `Auto-Top-Up`
      </td>

      <td>
        Indicator if Auto-Top-Up is enabled for this SIM.
      </td>
    </tr>

    <tr>
      <td>
        `Data Usage`
      </td>

      <td>
        Colored indicator of the remaining data quota. Green > 20% remaining, Yellow \< 20% available, Red = 0 % remaining.
      </td>
    </tr>

    <tr>
      <td>
        `SMS Usage`
      </td>

      <td>
        Colored indicator of the remaining SMS quota. Green > 20% remaining, Yellow \< 20% available, Red = 0 % remaining.
      </td>
    </tr>
  </tbody>
</Table>

## SIM Export

The complete and customized SIM Card table can be exported as a CSV-file if needed by using the "Export SIMs" button. As it might take some time to export a larger list of SIMs, the user gets an e-mail notification as soon as the export is completed and can be downloaded from the SIM Export section underneath the SIM card table. This export also includes the PIN and PUK of each SIM which might be needed for certain devices.

<Image align="center" alt={1389} border={false} caption="SIM Export section below the SIM table" title="20220214_Downloads.PNG" src="/img/1nce-portal/portal-sims-sms/4137a69-20220214_Downloads.PNG" />

***

# SIM Management

Each SIM card in the list view can be selected using the checkbox on the left side of each list entry. By selecting one or several SIMs the user can perform different actions like (de-)activating SIMs, setting the IMEI lock, configuring Auto-Top-Ups or manually recharging the SIM data and SMS volume. These actions can be triggered for the selected SIMs using the buttons in the action bar appearing once SIMs are selected. Additional SIMs can be ordered from here as well with the "Reorder" button on the top right of the table.

<Image align="center" alt={1339} border={false} caption="Selected SIMs with open action bar" title="20220214_Action bar.PNG" src="/img/1nce-portal/portal-sims-sms/cb80c15-20220214_Action_bar.PNG" />

## SIM Top-Up

It is possible to manually book additional data and SMS volume for one or more selected SIM cards. With every Top-Up 500 MB and 250 SMS are added to the remaining volume. Top-Ups for single SIM cards can be booked in the detailed view of a card. More volume can be added by ordering multiple Top-Ups in a row. The booked volume is available as soon as the payment is received:

| Payment method | Duration          |
| :------------- | :---------------- |
| Bank transfer  | Two to three days |
| Credit card    | Immediately       |

For automatically booked volume, please refer to our [Auto-Top-Up-feature](https://help.1nce.com/dev-hub/docs/portal-configuration#auto-top-up).

## SIM Deactivation

The selected SIM can be deactivated to prevent an attachment to the 1NCE network. This feature is useful for disabling SIMs during shipping of devices or to force a reset of the connection. This function can also be used through the 1NCE API. Active attachments of SIMs will be purged and devices immediately disconnected.

Subsequent attempts of the device to re-register will be refused by the network until the SIM is re-activated.  
Depended on the device logic this blocking might force some devices to get into an error state and prevent them from reconnecting to any network even if the SIM has been re-activated again. Implementing a soft- or hard-restart with an **exponential back-off** timer as part of the connectivity procedure of the device firmware is advised. This procedure should circumvent the potential delay in attaching after a SIM reactivation where the device was stuck in an error state. Please implement a back-off algorithm with at least 5-20 minutes between reattempts to not overload the network with undesired attach requests during SIM deactivations. After reactivating the SIMs, the network will once again allow the SIM to attach to the 1NCE network and use all services as usual.

## IMEI Lock

The IMEI lock will only be set for the selected SIMs. It works by saving the IMEI of the device the SIM is installed in. With the feature enabled, the 1NCE network will only accept the saved device IMEI - SIM card combination to access the network resource. Any other IMEI - SIM combination will be refused. If this feature is activated, the IMEI lock will be set during the next network attach. As a consequence, the SIM card can only be used with the current device. To change the setting for all (future) SIM cards please navigate to the tab [Configuration](https://help.1nce.com/dev-hub/docs/portal-configuration#global-imei-lock).

## Auto-Top-Up

Automatic Top-Ups can be configured for all selected SIMs. The Top-Up will be automatically booked once a SIM card has \<20 % data and/or SMS volume. The check for low volume and potential Top-Up process if the SIM volume is less than 20%, are performed every four hours at 0:00,  4:00,  8:00,  12:00,  16:00, and 20:00 CET. To use this feature the customer has to add their credit card details to the account via the "Account" tab.  
To activate this for all (future) SIM cards please navigate to the tab [Configuration](https://help.1nce.com/dev-hub/docs/portal-configuration#auto-top-up). By ticking the check-box it is possible to activate the Auto-Top-Up for all future SIM orders by default.

## SIM Extension

If your SIM cards are close to expiring, you will see an extra column in your SIM table called "Extendable". Three months before the end of your activation period you will be notified by e-mail and it will be visible in your SIM table which SIM cards can be extended. You can extend a single SIM card or filter for all extendable SIM cards. After selecting all relevant SIM cards, click on "Extend SIMs". You will be able to review your selected SIMs and the tariff details for the extension in the shopping cart. All of remaining data, SMS, and time will be transferred. The new activation period starts on the order day (when bank transfer is used, it starts as soon as the payment is received.

After your expiry date has been reached you have 18 months to extend your SIM cards. The SIMs will not be usable in that transition period but you can extend them anytime. After 18 months the SIM cards will be irreversibly deleted.

<Image align="center" alt={826} border={false} caption="SIM Extension" title="220824_SIM List_Extensionpng.png" src="/img/1nce-portal/portal-sims-sms/687f26f-220824_SIM_List_Extensionpng.png" />

***

# SIM Detail Page

By clicking on one of the SIMs in the list, a detailed view of the SIM status and configuration is shown. The top section of this view includes basics stats of the selected SIM. In the first column, the ICCID, IMSI, MSISDN and LABEL is shown. The LABEL field is editable and can help to assort the SIMs. The second column presents all lifetime data like time passed in %, the time left and the end date of the contract. The third column on the right shows all relevant network data, like the static IP-address, the IMEI of the connected device, the session-status, location of the device, the operator and the network bearer the SIM currently is attached to.

## SIM Configuration

On the SIM detail page, the specific SIM can be (de-)activated, the IMEI lock set, Auto-Top-Up (de-)activated and additionally the SIM connection can be reset.

<Image align="center" alt={826} border={false} caption="Detail page of an example SIM Card." title="1NCE_SIM_Details.PNG" src="/img/1nce-portal/portal-sims-sms/2b5c709fcd688db4f57134d5de1a9cceb4460cfe3cb683cd14ec382b8185cb18-CleanShot_2025-10-08_at_11.28.332x.png" />

## Reset Connection

By using "Reset Connection", the SIM is automatically deactivated and afterwards reactivated. This will force the SIM to disconnect from the current network operator and reattach. This feature is useful if the SIM is stuck in an unwanted connection.

In the lower section, detailed logs of events and usage in chronological order are presented. Please note that this data is only retained for seven days due to the 1NCE data retention policy. The data in the Events tab is identical to the data found in the 1NCE Data Streamer. These events are very useful for debugging devices and seeing the current network events of a device.

The Usage tab shows both the SMS and data usage of the last eight weeks, the available quota and the remaining volume for SMS and Data of this particular SIM.

***

# SMS Console

The SMS tab of the detailed SIM page can be used to exchange SMS messages with the device using the particular SIM. With the Source Address and Payload fields, a SMS can be prepared and send to the device. Please note that the device needs to be attached to a network in order to receive the message.

In the table view below the sent SMS form, an overview of the Mobile Originated (MO) and Mobile Terminated (MT) SMS messages of the last seven days can be seen. To properly receive and process MT messages, review the [SMS Forwarder Service](doc:platform-services-sms-forwarder) guide. Besides the messages itself, the current status of the MO-/MT-SMS, the payload and type is listed.  
The list shows the type of SMS (MT or MO), the current status (Pending, OK, Failed), the timestamp the message was submitted and finally, the source address and the actual payload. Please note that MT-SMS will stay in the Pending state until the device has attached to the network and the message was delivered. For MO-SMS the state will remain in "pending" if no SMS Forwarding Service is setup as only this service will consume the SMS messages and properly acknowledge them. If a SMS message fails this is most likely due to reaching the delivery retry timeout. After a certain time of trying to deliver a message, the service will put the SMS into the failed state.

<Image align="center" alt={1620} border={false} caption="Overview of the SMS Console." title="1NCE_SMS_Console.png" src="/img/1nce-portal/portal-sims-sms/9ff2e66-1NCE_SMS_Console.png" />
