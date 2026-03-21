import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebar: SidebarsConfig = {
  apisidebar: [
    {
      type: "doc",
      id: "sim-management/sim-management",
    },
    {
      type: "category",
      label: "General SIMs",
      link: {
        type: "doc",
        id: "sim-management/general-si-ms",
      },
      items: [
        {
          type: "doc",
          id: "sim-management/get-sims-using-get",
          label: "Get All SIMs",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "sim-management/update-sims-using-post",
          label: "Create Multiple SIM Configuration",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "sim-management/get-sim-using-get",
          label: "Get Single SIM",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "sim-management/update-sim-using-put",
          label: "Create Single SIM Configuration",
          className: "api-method put",
        },
        {
          type: "doc",
          id: "sim-management/get-status-for-sim-using-get",
          label: "Get SIM Status",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "sim-management/sim-transfer-using-post",
          label: "Create SIM Transfer",
          className: "api-method post",
        },
      ],
    },
    {
      type: "category",
      label: "SMS",
      link: {
        type: "doc",
        id: "sim-management/sms",
      },
      items: [
        {
          type: "doc",
          id: "sim-management/get-sms-for-sim-using-get",
          label: "Get MT/MO-SMS",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "sim-management/send-sms-to-sim-using-post",
          label: "Create SMS",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "sim-management/get-sms-of-sim-using-get",
          label: "Get SMS Details",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "sim-management/cancel-sms-for-sim-using-delete",
          label: "Delete SMS",
          className: "api-method delete",
        },
      ],
    },
    {
      type: "category",
      label: "Connectivity",
      link: {
        type: "doc",
        id: "sim-management/connectivity",
      },
      items: [
        {
          type: "doc",
          id: "sim-management/get-connectivity-info-for-sim-using-get",
          label: "Get SIM Connectivity",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "sim-management/reset-connectivity-using-post",
          label: "Create Connectivity Reset",
          className: "api-method post",
        },
      ],
    },
    {
      type: "category",
      label: "SIM Events",
      link: {
        type: "doc",
        id: "sim-management/sim-events",
      },
      items: [
        {
          type: "doc",
          id: "sim-management/get-events-for-sim-using-get",
          label: "Get SIM Events",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "SIM Usage",
      link: {
        type: "doc",
        id: "sim-management/sim-usage",
      },
      items: [
        {
          type: "doc",
          id: "sim-management/get-usage-for-sim-using-get",
          label: "Get SIM Usage",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "sim-management/get-data-quota-for-sim-using-get",
          label: "Get SIM Data Quota",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "sim-management/get-sms-quota-for-sim-using-get",
          label: "Get SIM SMS Quota",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Volume Limits",
      link: {
        type: "doc",
        id: "sim-management/volume-limits",
      },
      items: [
        {
          type: "doc",
          id: "sim-management/get-limits-using-get",
          label: "Get Global Limits",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "sim-management/set-limits-using-post",
          label: "Create Global Limits",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "sim-management/get-selectable-limits-using-get",
          label: "Get SIM Limits",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Volume Top Up",
      link: {
        type: "doc",
        id: "sim-management/volume-top-up",
      },
      items: [
        {
          type: "doc",
          id: "sim-management/top-up-using-post",
          label: "Create Single Top Up",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "sim-management/top-up-multiple-using-post",
          label: "Create Multiple Top Up",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "sim-management/auto-topup-using-post",
          label: "Enable Auto Top Up",
          className: "api-method post",
        },
      ],
    },
    {
      type: "category",
      label: "SIM Extension",
      link: {
        type: "doc",
        id: "sim-management/sim-extension",
      },
      items: [
        {
          type: "doc",
          id: "sim-management/extend-sims-using-post",
          label: "Create SIM Extension",
          className: "api-method post",
        },
      ],
    },
  ],
};

export default sidebar.apisidebar;
