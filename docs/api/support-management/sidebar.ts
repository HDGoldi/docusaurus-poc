import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebar: SidebarsConfig = {
  apisidebar: [
    {
      type: "doc",
      id: "support-management/support-management",
    },
    {
      type: "category",
      label: "Service Requests",
      link: {
        type: "doc",
        id: "support-management/service-requests",
      },
      items: [
        {
          type: "doc",
          id: "support-management/get-service-requests-using-get",
          label: "Get Service Requests",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "support-management/create-service-request-using-post",
          label: "Create Service Request",
          className: "api-method post",
        },
      ],
    },
  ],
};

export default sidebar.apisidebar;
