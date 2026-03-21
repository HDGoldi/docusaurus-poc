import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebar: SidebarsConfig = {
  apisidebar: [
    {
      type: "doc",
      id: "order-management/order-management",
    },
    {
      type: "category",
      label: "Orders",
      link: {
        type: "doc",
        id: "order-management/orders",
      },
      items: [
        {
          type: "doc",
          id: "order-management/get-orders-using-get",
          label: "Get All Orders",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "order-management/post-order-using-post",
          label: "Create Order",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "order-management/get-order-using-get",
          label: "Get Single Order",
          className: "api-method get",
        },
      ],
    },
  ],
};

export default sidebar.apisidebar;
