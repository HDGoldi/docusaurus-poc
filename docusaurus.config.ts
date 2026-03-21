import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: '1NCE Developer Hub',
  tagline: 'Documentation for 1NCE IoT connectivity services',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
    experimental_faster: true,
  },

  url: 'https://help.1nce.com',
  baseUrl: '/',

  stylesheets: [
    {
      href: 'https://fonts.googleapis.com/css2?family=Barlow:wght@400;500&display=swap',
      type: 'text/css',
    },
  ],

  onBrokenLinks: 'warn',

  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'throw',
    },
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          path: 'docs/documentation',
          sidebarPath: './sidebars/documentation.ts',
          routeBasePath: '/docs',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    ['@docusaurus/plugin-content-docs', {
      id: 'platform',
      path: 'docs/platform',
      routeBasePath: '/platform',
      sidebarPath: './sidebars/platform.ts',
    }],
    ['@docusaurus/plugin-content-docs', {
      id: 'blueprints',
      path: 'docs/blueprints',
      routeBasePath: '/blueprints',
      sidebarPath: './sidebars/blueprints.ts',
    }],
    ['@docusaurus/plugin-content-docs', {
      id: 'terms',
      path: 'docs/terms',
      routeBasePath: '/terms',
      sidebarPath: './sidebars/terms.ts',
    }],
  ],

  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: '1NCE Developer Hub',
      logo: {
        alt: '1NCE Logo',
        src: 'img/1nce-logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          label: 'Documentation',
          position: 'left',
        },
        {
          to: '/api',
          label: 'API Explorer',
          position: 'left',
        },
        {
          type: 'docSidebar',
          sidebarId: 'platformSidebar',
          label: '1NCE Platform',
          position: 'left',
          docsPluginId: 'platform',
        },
        {
          type: 'docSidebar',
          sidebarId: 'blueprintsSidebar',
          label: 'Blueprints & Examples',
          position: 'left',
          docsPluginId: 'blueprints',
        },
        {
          type: 'docSidebar',
          sidebarId: 'termsSidebar',
          label: 'Terms & Abbreviations',
          position: 'left',
          docsPluginId: 'terms',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {label: 'FAQ', href: 'https://1nce.com/en-eu/support/faq'},
        {label: 'Imprint', href: 'https://1nce.com/en-eu/imprint'},
        {label: 'Terms and Conditions', href: 'https://1nce.com/en-eu/terms-conditions'},
        {label: 'Privacy Policy', href: 'https://1nce.com/en-eu/privacy-policy'},
      ],
      copyright: 'Copyright &copy; 2026 1NCE GmbH',
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
