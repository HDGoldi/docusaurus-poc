---
title: AWS Configuration
sidebar_position: 2
---
## Prerequisites

### Security Token Service (STS) Endpoint

In your AWS account the Security Token Service (STS) Endpoint should be enabled for eu-central-1 region.

<div style={{textAlign: 'center'}}>
<img src="/img/1nce-os/1nce-os-cloud-integrator/cloud-integrator-aws-configuration/6e587165164e7c3323900b5638dfef7ed75ce3d264754f2e1ae6f3e278e7aed9-STS_Endpoint.jpg" alt="STS enabled for eu-central-1 region" width="70%" />
</div>

### iot:Data-ATS Endpoint

In your AWS account the iot:Data-ATS Endpoint should be enabled for region where you are rolling out AWS Integration.

<div style={{textAlign: 'center'}}>
<img src="/img/1nce-os/1nce-os-cloud-integrator/cloud-integrator-aws-configuration/1dee62128476dc673a4ab3e218636cf41cef9c552551c17338965c76525c184a-IoT_Endpoint.jpg" alt="iot:Data-ATS Endpoint enabled for the customer’s chosen region" width="70%" />
</div>

### IAM role permissions

To successfully roll out the CloudFormation (CFN) stack, the customer must ensure that all the permissions listed in [cfn stack description](/docs/1nce-os/1nce-os-cloud-integrator/cloud-integrator-aws-configuration#cfn-stack-description) are granted.

## Configuration via Frontend

For setting up the AWS integration, use the Cloud Integration Wizard in the 1NCE OS portal.\
Click 'New Integration' and select AWS integration as integration type.

Use a descriptive name and select the [event types](/docs/1nce-os/1nce-os-cloud-integrator/cloud-integrator-output-format) that you would like to receive.

<div style={{textAlign: 'center'}}>
<img src="/img/1nce-os/1nce-os-cloud-integrator/cloud-integrator-aws-configuration/8a9f1fde8ef85fbba5fb38c3fdb2de52215b5797c4731bedf0c60770fdb93938-integration-aws-creation.png" alt="Configuration of an AWS Integration in the 1NCE portal" width="70%" />
</div>

Be aware that integration with status ROLLOUT\_STARTED will be created in the Cloud Integrator and you will be taken to AWS to complete the configuration over there.\
This generates a JWT that is only valid for an hour. Once the JWT becomes invalid the rollout has to be restarted.

After the configuration click proceed and you will be prompted to go to the AWS console. Continue and now AWS should be open on the 'Quick Create Stack' page. Here you will see things such as the name that was previously given, integration token, etc. If this information is correct, acknowledge AWS requirements and press 'create stack'.

<div style={{textAlign: 'center'}}>
<img src="/img/1nce-os/1nce-os-cloud-integrator/cloud-integrator-aws-configuration/1639e0a-create_stack_1nceOS.png" alt="Creation of AWS stack" width="70%" />
</div>

It will take some time for the stack to be created. Nested stacks are shown by the filter option 'view nested' on the top. Once it is done, it should look like this in AWS and 1nceOS portal respectively:

<div style={{textAlign: 'center'}}>
<img src="/img/1nce-os/1nce-os-cloud-integrator/cloud-integrator-aws-configuration/ab1e780-stack_created_1nceOS.png" alt="AWS stack created" width="70%" />
</div>

<div style={{textAlign: 'center'}}>
<img src="/img/1nce-os/1nce-os-cloud-integrator/cloud-integrator-aws-configuration/d2bf0e4-rollout_done_1nceOS.png" alt="Integration rolled out" width="70%" />
</div>

### Validate Integration

*A device being able to send data is a prerequisite for this step. For more information refer to the cloud integrator[documentation](/docs/1nce-os/1nce-os-cloud-integrator/).*

Once your stack has been rolled out, you can test your integration using one of your devices or by using [Test AWS Integration](ref:post_v1-integrate-clouds-aws-integrationid-test) endpoint. In AWS go to the IoT Core service. Navigate to the MQTT test client and subscribe to # as shown below:

<div style={{textAlign: 'center'}}>
<img src="/img/1nce-os/1nce-os-cloud-integrator/cloud-integrator-aws-configuration/63a5103-MQTT_test_1nce_OS.png" alt="MQTT Test Client" width="70%" />
</div>

Doing this will subscribe to all topics so if the stack was successfully rolled out, you should see data show up as shown below:

<div style={{textAlign: 'center'}}>
<img src="/img/1nce-os/1nce-os-cloud-integrator/cloud-integrator-aws-configuration/8d01142-MQTT_response_1nceOS.png" alt="MQTT Test Client result" width="70%" />
</div>

If the integration was successfully created, rolled out and actived, *Integration Active* will appear.

<div style={{textAlign: 'center'}}>
<img src="/img/1nce-os/1nce-os-cloud-integrator/cloud-integrator-aws-configuration/88d06a18334489f9ca3f90a2eb3af8ee4f449ad4435b2f74d5772c74411d63f0-Screenshot_2025-02-28_103403_integration-active.png" alt="Integration Active" width="70%" />
</div>

### Edit AWS integration

It is possible to edit the 1nceOS integration options through the front-end by clicking the edit-button as shown below:

<div style={{textAlign: 'center'}}>
<img src="/img/1nce-os/1nce-os-cloud-integrator/cloud-integrator-aws-configuration/4e74076-change_configuration_integration_1nceOS.png" alt="1nceOS change integration" width="70%" />
</div>

### Restart AWS integration

There is a possibility that your integration fails. When this happens, it will be visible in the 1nceOS portal as shown below:

<div style={{textAlign: 'center'}}>
<img src="/img/1nce-os/1nce-os-cloud-integrator/cloud-integrator-aws-configuration/9890430dd449eae6721b2ee3f9e1f9e003172e979c13ae23e3adfa1164fda6f3-Screenshot_2025-02-28_101925_integration-restart-table.png" alt="1nceOS restart integration" width="70%" />
</div>

By clicking the restart button, there will be an attempt to verify the integration. During that time an event of type TEST\_MESSAGE will be sent out. For more information refer to [event-type documentation](/docs/1nce-os/1nce-os-cloud-integrator/cloud-integrator-output-format)

### Delete AWS Integration

There are two ways to delete the integration:

#### Front-end

You can delete your AWS Integration in the front-end of 1NCE OS or using API. In this case, you need to delete your AWS stack manually.

<div style={{textAlign: 'center'}}>
<img src="/img/1nce-os/1nce-os-cloud-integrator/cloud-integrator-aws-configuration/1a639ab-delete_integration_frontend_1nceOS.png" alt="1nceOS delete integration" width="70%" />
</div>

#### AWS

When the deletion is initiated from your AWS stack, there are no further actions needed. The callback function will automatically trigger the deletion of the AWS Integration in 1NCE OS.

<div style={{textAlign: 'center'}}>
<img src="/img/1nce-os/1nce-os-cloud-integrator/cloud-integrator-aws-configuration/994ba2a-image.png" alt="AWS delete stack" width="70%" />
</div>



### CFN stack description

The following section describes resources that will be deployed with the stack. Stack contains 3 nested stacks.

### AWS Integration Resource stack

#### IAM cross account role

Stack creates Cross Account IAM role with following permissions for 1NCE OS AWS account 672401624271:

* 'iot:DescribeEndpoint' - Retrieve the AWS IoT endpoint.
* 'iot:Publish' - Publish MQTT messages to AWS IoT Core.

<div style={{textAlign: 'center'}}>
<img src="/img/1nce-os/1nce-os-cloud-integrator/cloud-integrator-aws-configuration/23deb3b78f82df8d89d4f0d3deb473423b34348d8210978940cc786db0eff6a4-aws-integration-stack.png" alt="AWS Integration stack resources" width="70%" />
</div>

### Callback stacks

Two stacks are rolled out for callback operations:

* Callback 'create' stack: Provisions resources required to complete the integration with 1NCE OS.
* Callback 'delete' stack: Provisions resources that notify 1NCE OS when the stack is deleted from the customer's AWS account.

Both the 'create' and 'delete' stacks provision identical resources.

<div style={{textAlign: 'center'}}>
<img src="/img/1nce-os/1nce-os-cloud-integrator/cloud-integrator-aws-configuration/26a894ba3b54fe11b43cc71f50819e2aa3a7592776abfe5333f38a94e7210ebe-delete-callback-stack2.png" alt="Callback 'delete' stack resources" width="70%" />
</div>

#### Download code lambda function

A Lambda function that downloads the actual callback Lambda function.

#### Callback lambda function

The 'create' callback stack Lambda function notifies the 1NCE OS that the integration rollout has been successfully completed.\
The 'delete' callback stack Lambda function notifies the 1NCE OS when the CloudFormation stack is deleted from the customer's AWS account.

Notifications are sent via API calls.

#### S3 bucket

S3 buckets where the actual code for the 'create' and 'delete' callback Lambda functions are placed.

#### Stack execution IAM Role

For each stack execution IAM role with the following permissions is created:

Logs:

* 'logs:CreateLogGroup' - Allows creation of CloudWatch Log Groups.
* 'logs:CreateLogStream' - Allows creation of log streams within the created log groups.
* 'logs:PutLogEvents' - Allows publishing log events to the created log streams.

 Customers S3 bucket:

* 's3:DeleteObject' - Allows deletion of objects from the specified S3 bucket.
* 's3:GetObject' - Allows reading objects from the specified S3 bucket.
* 's3:ListBucket' - Allows listing objects in the specified S3 bucket.
* 's3:PutObject' - Allows uploading (writing) objects to the specified S3 bucket.
* 's3:GetBucketPolicy' - Allows retrieval of the bucket policy for the specified S3 bucket.
* 's3:PutObjectTagging' - Allows adding or updating tags on an S3 object.

 1NCE OS S3 bucket:

* 's3:GetObject' - Allows reading objects from 1NCE OS S3 bucket. 
* 's3:GetObjectTagging' - Allows retrieving tags associated with an 1NCE OS S3 object.
* 's3:ListBucket' - Allows listing objects in the 1NCE OS S3 bucket.

### Lambda runtime versions used in the different 1NCE OS customer stack versions

##### V1.0.0

* Download code lambda function: python3.9
* Callback lambda function: nodejs14.x

##### V1.1.0

* Download code lambda function: python3.9
* Callback lambda function: nodejs18.x

##### V1.2.0 (latest)

* Download code lambda function: python3.13
* Callback lambda function: nodejs22.x
