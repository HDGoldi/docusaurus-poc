import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebar: SidebarsConfig = {
  apisidebar: [
    {
      type: "doc",
      id: "1nce-os/1-nce-os",
    },
    {
      type: "category",
      label: "IoT Integrator",
      link: {
        type: "doc",
        id: "1nce-os/io-t-integrator",
      },
      items: [
        {
          type: "doc",
          id: "1nce-os/get-device-endpoints",
          label: "Get device endpoints",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "1nce-os/get-single-device-endpoint",
          label: "Get single device endpoint",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "1nce-os/patch-single-device-endpoint",
          label: "Patch single device endpoint",
          className: "api-method patch",
        },
        {
          type: "doc",
          id: "1nce-os/get-device-action-requests",
          label: "Get device action requests",
          className: "menu__list-item--deprecated api-method get",
        },
        {
          type: "doc",
          id: "1nce-os/get-active-device-action-requests",
          label: "Get active device action requests",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "1nce-os/get-archived-device-action-requests",
          label: "Get archived device action requests",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "1nce-os/cancel-all-device-action-requests",
          label: "Cancel all device action requests",
          className: "api-method delete",
        },
        {
          type: "doc",
          id: "1nce-os/cancel-single-device-action-request",
          label: "Cancel single device action request",
          className: "api-method delete",
        },
        {
          type: "doc",
          id: "1nce-os/get-single-device-action-request",
          label: "Get single device action request",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "1nce-os/create-pre-shared-device-key",
          label: "Create Pre-Shared Device Key",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "1nce-os/pre-shared-devices-keys-import-job-status",
          label: "Pre-Shared Devices Keys Import Job Status",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "1nce-os/import-pre-shared-devices-keys",
          label: "Import Pre-Shared Devices Keys",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "1nce-os/create-pre-shared-device-key",
          label: "Create Pre-Shared Device Key",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "1nce-os/get-pre-shared-device-key",
          label: "Get Pre-Shared Device Key",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "1nce-os/pre-shared-devices-keys-import-job-status",
          label: "Pre-Shared Devices Keys Import Job Status",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "1nce-os/import-pre-shared-devices-keys",
          label: "Import Pre-Shared Devices Keys",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "1nce-os/create-action-request-on-specific-lw-m-2-m-device",
          label: "Create Action Request On Specific LwM2M Device.",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "1nce-os/create-action-requests-for-lw-m-2-m-devices",
          label: "Create Action Requests for LwM2M Devices.",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "1nce-os/create-action-request-on-specific-co-ap-device",
          label: "Create Action Request On Specific CoAP Device.",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "1nce-os/create-action-requests-for-co-ap-devices",
          label: "Create Action Requests for CoAP Devices.",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "1nce-os/create-action-request-on-specific-udp-device",
          label: "Create Action Request On Specific UDP Device.",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "1nce-os/create-action-requests-for-udp-devices",
          label: "Create Action Requests for UDP Devices.",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "1nce-os/get-cloud-formation-parameters",
          label: "Get CloudFormation Parameters",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "1nce-os/restart-aws-integration",
          label: "Restart AWS Integration",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "1nce-os/test-aws-integration",
          label: "Test AWS Integration",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "1nce-os/create-aws-integration",
          label: "Create AWS Integration",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "1nce-os/delete-integration",
          label: "Delete Integration",
          className: "api-method delete",
        },
        {
          type: "doc",
          id: "1nce-os/get-customer-integration",
          label: "Get Customer Integration",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "1nce-os/patch-customer-integration",
          label: "Patch Customer Integration",
          className: "api-method patch",
        },
        {
          type: "doc",
          id: "1nce-os/get-all-customer-integrations",
          label: "Get All Customer Integrations",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "1nce-os/get-integration-event-types",
          label: "Get Integration Event Types",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "1nce-os/create-webhook-integration",
          label: "Create Webhook Integration",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "1nce-os/patch-customer-webhook-integration",
          label: "Patch Customer Webhook Integration",
          className: "api-method patch",
        },
        {
          type: "doc",
          id: "1nce-os/restart-webhook-integration",
          label: "Restart Webhook Integration",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "1nce-os/test-webhook-integration",
          label: "Test Webhook Integration",
          className: "api-method post",
        },
      ],
    },
    {
      type: "category",
      label: "Optimizer",
      link: {
        type: "doc",
        id: "1nce-os/optimizer",
      },
      items: [
        {
          type: "doc",
          id: "1nce-os/test-template",
          label: "Test template",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "1nce-os/get-savings",
          label: "Get savings",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "1nce-os/get-optimizer-templates",
          label: "Get Optimizer Templates",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "1nce-os/create-optimizer-template",
          label: "Create Optimizer Template",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "1nce-os/delete-optimizer-template",
          label: "Delete Optimizer Template",
          className: "api-method delete",
        },
        {
          type: "doc",
          id: "1nce-os/update-optimizer-template",
          label: "Update Optimizer Template",
          className: "api-method patch",
        },
      ],
    },
    {
      type: "category",
      label: "Device Inspector",
      link: {
        type: "doc",
        id: "1nce-os/device-inspector",
      },
      items: [
        {
          type: "doc",
          id: "1nce-os/get-all-devices",
          label: "Get All Devices",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "1nce-os/get-single-device",
          label: "Get Single Device",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "1nce-os/get-device-telemetry",
          label: "Get Device Telemetry",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "1nce-os/get-device-historian-messages",
          label: "Get Device Historian Messages",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "1nce-os/get-historian-messages",
          label: "Get Historian Messages",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "1nce-os/get-device-historian-insights",
          label: "Get Device Historian Insights",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "1nce-os/get-historian-insights",
          label: "Get Historian Insights",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Device Locator",
      link: {
        type: "doc",
        id: "1nce-os/device-locator",
      },
      items: [
        {
          type: "doc",
          id: "1nce-os/get-device-positions",
          label: "Get Device Positions",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "1nce-os/get-latest-devices-positions",
          label: "Get Latest Devices Positions",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "1nce-os/get-device-celltower-location-resolutions",
          label: "Get Device Celltower location resolutions",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "1nce-os/get-all-geofences",
          label: "Get all geofences",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "1nce-os/create-geofence",
          label: "Create geofence",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "1nce-os/delete-geofence",
          label: "Delete geofence",
          className: "api-method delete",
        },
        {
          type: "doc",
          id: "1nce-os/get-a-geofence",
          label: "Get a geofence",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "1nce-os/patch-a-geofence",
          label: "Patch a geofence",
          className: "api-method patch",
        },
      ],
    },
    {
      type: "category",
      label: "Agreements",
      link: {
        type: "doc",
        id: "1nce-os/agreements",
      },
      items: [
        {
          type: "doc",
          id: "1nce-os/accept-1-nce-os-agreements",
          label: "Accept 1NCE OS Agreements",
          className: "api-method post",
        },
      ],
    },
    {
      type: "category",
      label: "Administration Logs",
      link: {
        type: "doc",
        id: "1nce-os/administration-logs",
      },
      items: [
        {
          type: "doc",
          id: "1nce-os/get-administration-logs",
          label: "Get Administration Logs",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "1nce-os/get-administration-logs-statistics",
          label: "Get Administration Logs Statistics",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "1nce-os/get-administration-log-payload",
          label: "Get Administration Log Payload",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Devices",
      link: {
        type: "doc",
        id: "1nce-os/devices",
      },
      items: [
        {
          type: "doc",
          id: "1nce-os/create-action-request-on-specific-lw-m-2-m-device",
          label: "Create Action Request On Specific LwM2M Device.",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "1nce-os/get-devices-statistics",
          label: "Get Devices Statistics",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Settings",
      link: {
        type: "doc",
        id: "1nce-os/settings",
      },
      items: [
        {
          type: "doc",
          id: "1nce-os/patch-settings",
          label: "Patch Settings",
          className: "api-method patch",
        },
        {
          type: "doc",
          id: "1nce-os/get-customer-settings",
          label: "Get customer settings",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Plugin system",
      link: {
        type: "doc",
        id: "1nce-os/plugin-system",
      },
      items: [
        {
          type: "doc",
          id: "1nce-os/install-datacake-plugin-for-1-nce-os",
          label: "Install Datacake plugin for 1NCE OS",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "1nce-os/install-mender-plugin-for-1-nce-os",
          label: "Install Mender plugin for 1NCE OS",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "1nce-os/install-tartabit-plugin-for-1-nce-os",
          label: "Install Tartabit plugin for 1NCE OS",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "1nce-os/install-memfault-plugin-for-1-nce-os",
          label: "Install Memfault plugin for 1NCE OS",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "1nce-os/uninstall-a-specific-plugin-by-id",
          label: "Uninstall a specific plugin by ID",
          className: "api-method delete",
        },
        {
          type: "doc",
          id: "1nce-os/get-details-about-a-specific-plugin-installation",
          label: "Get details about a specific plugin installation",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "1nce-os/restart-a-failed-plugin-by-installation-id",
          label: "Restart a failed plugin by installation ID",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "1nce-os/get-a-list-of-plugin-installations",
          label: "Get a list of plugin installations",
          className: "api-method get",
        },
      ],
    },
  ],
};

export default sidebar.apisidebar;
