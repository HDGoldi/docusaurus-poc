import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebar: SidebarsConfig = {
  apisidebar: [
    {
      type: "doc",
      id: "product-information/product-information",
    },
    {
      type: "category",
      label: "Products",
      link: {
        type: "doc",
        id: "product-information/products",
      },
      items: [
        {
          type: "doc",
          id: "product-information/get-products-using-get",
          label: "Get All Products",
          className: "api-method get",
        },
      ],
    },
  ],
};

export default sidebar.apisidebar;
