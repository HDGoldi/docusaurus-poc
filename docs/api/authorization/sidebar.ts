import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebar: SidebarsConfig = {
  apisidebar: [
    {
      type: "doc",
      id: "authorization/authorization",
    },
    {
      type: "category",
      label: "Bearer Authorization",
      link: {
        type: "doc",
        id: "authorization/bearer-authorization",
      },
      items: [
        {
          type: "doc",
          id: "authorization/post-access-token-post",
          label: "Obtain Access Token",
          className: "api-method post",
        },
      ],
    },
  ],
};

export default sidebar.apisidebar;
