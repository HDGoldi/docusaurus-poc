import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import devHubRefRedirects from './scripts/dev-hub-reference-redirects.json';

const isGitHubPages = process.env.DEPLOY_TARGET === 'gh-pages';

const config: Config = {
  title: '1NCE Developer Hub',
  tagline: 'Documentation for 1NCE IoT connectivity services',
  favicon: 'img/favicon.png',

  customFields: {
    n8nChatUsername: process.env.N8N_CHAT_USERNAME || 'master',
    n8nChatPassword: process.env.N8N_CHAT_PASSWORD || '',
  },

  future: {
    v4: true,
    experimental_faster: true,
  },

  url: isGitHubPages ? 'https://hdgoldi.github.io' : 'https://help.1nce.com',
  baseUrl: isGitHubPages ? '/docusaurus-poc/' : '/',
  trailingSlash: true,

  stylesheets: [
    {
      href: 'https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600&display=swap',
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
          sidebarItemsGenerator: async ({defaultSidebarItemsGenerator, ...args}) => {
            const items = await defaultSidebarItemsGenerator(args);
            return items.map(item => {
              if (item.type === 'category' && item.label === 'Troubleshooting') {
                return {
                  ...item,
                  items: [
                    {
                      type: 'link' as const,
                      label: '1NCE Technical Support',
                      href: 'https://www.1nce.com/en-eu/support',
                    },
                  ],
                };
              }
              return item;
            });
          },
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  headTags: isGitHubPages ? [] : [
    // Google Tag Manager (per D-19)
    {
      tagName: 'script',
      attributes: {},
      innerHTML: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-NS9K9DT');`,
    },
    // PostHog EU instance (per D-21)
    {
      tagName: 'script',
      attributes: {},
      innerHTML: `!function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init capture register register_once register_for_session unregister unregister_for_session getFeatureFlag getFeatureFlagPayload isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty createPersonProfile opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing debug getPageViewId".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);posthog.init('phc_M08s2Nrlv1o0bUfZ88Jo81VQqutezzTXDbIXEuavfh0',{api_host:'https://eu.i.posthog.com',person_profiles:'identified_only',});`,
    },
  ],

  scripts: isGitHubPages ? [] : [
    {
      src: 'https://scripts.simpleanalyticscdn.com/latest.js',
      async: true,
      'data-collect-dnt': 'true',
    },
  ],

  clientModules: isGitHubPages ? [] : ['./src/clientModules/routeTracking.ts'],

  plugins: [
    ['@docusaurus/plugin-content-docs', {
      id: 'api',
      path: 'docs/api',
      routeBasePath: '/api',
      sidebarPath: './sidebars/api.ts',
      docItemComponent: '@theme/ApiItem',
    }],
    ['docusaurus-plugin-openapi-docs', {
      id: 'openapi',
      docsPluginId: 'api',
      config: {
        authorization: {
          specPath: 'specs/authorization.json',
          outputDir: 'docs/api/authorization',
          sidebarOptions: { groupPathsBy: 'tag', categoryLinkSource: 'tag' },
        },
        'sim-management': {
          specPath: 'specs/sim-management.json',
          outputDir: 'docs/api/sim-management',
          sidebarOptions: { groupPathsBy: 'tag', categoryLinkSource: 'tag' },
        },
        'order-management': {
          specPath: 'specs/order-management.json',
          outputDir: 'docs/api/order-management',
          sidebarOptions: { groupPathsBy: 'tag', categoryLinkSource: 'tag' },
        },
        'product-information': {
          specPath: 'specs/product-information.json',
          outputDir: 'docs/api/product-information',
          sidebarOptions: { groupPathsBy: 'tag', categoryLinkSource: 'tag' },
        },
        'support-management': {
          specPath: 'specs/support-management.json',
          outputDir: 'docs/api/support-management',
          sidebarOptions: { groupPathsBy: 'tag', categoryLinkSource: 'tag' },
        },
        '1nce-os': {
          specPath: 'specs/1nce-os.json',
          outputDir: 'docs/api/1nce-os',
          sidebarOptions: { groupPathsBy: 'tag', categoryLinkSource: 'tag' },
        },
      },
    }],
    ['@docusaurus/plugin-client-redirects', {
      redirects: [
        // Old ReadMe welcome page
        { from: '/dev-hub/docs/introduction-welcome', to: '/docs/' },
        // Old ReadMe dev-hub root
        { from: '/dev-hub', to: '/docs/' },
        // Old ReadMe dev-hub/docs index (HIGH -- linked from 100+ pages on 1nce.com)
        { from: '/dev-hub/docs', to: '/docs/' },
        // Old ReadMe slug renamed pages
        { from: '/dev-hub/docs/introduction-1nce-sim-card', to: '/docs/sim-cards/sim-cards-knowledge/' },
        { from: '/dev-hub/docs/modems', to: '/docs/blueprints-examples/examples-hardware-guides/' },
        // Old starting-guide path prefix
        { from: '/starting-guide/docs/apn-overview', to: '/docs/connectivity-services/connectivity-services-data-services/data-services-apn/' },
        // Old ReadMe static reference pages
        { from: '/dev-hub/reference/api-welcome', to: '/docs/' },
        { from: '/dev-hub/reference/api-authorization', to: '/api/authorization/authorization/' },
        { from: '/dev-hub/reference/api-best-practices', to: '/docs/' },
        { from: '/dev-hub/reference/api-rate-limits', to: '/docs/' },
        { from: '/dev-hub/reference/mcp', to: '/docs/' },
        // Old ReadMe API reference endpoints (/dev-hub/reference/{operationId} -> /api/{spec}/{slug})
        ...Object.entries(devHubRefRedirects).map(([from, to]) => ({
          from,
          to: `${to}/`,
        })),
      ],
      createRedirects(existingPath) {
        const redirects: string[] = [];

        // Platform sections: /platform/{section}/* was moved to /docs/{section}/*
        if (existingPath.match(/\/docs\/(1nce-os|1nce-portal|platform-services)(\/|$)/)) {
          redirects.push(existingPath.replace('/docs/', '/platform/'));
        }
        // Blueprints: /blueprints/blueprints-examples/* was moved to /docs/blueprints-examples/*
        if (existingPath.includes('/docs/blueprints-examples/')) {
          const slug = existingPath.split('/docs/blueprints-examples/').pop();
          const topLevelFiles = ['quectel-bg95-m3', 'quectel-ec25-ec21', 'recipes', 'sara-r410m', 'sim7000g', 'simcom-7020g-simcom800l'];
          if (topLevelFiles.some(f => slug?.startsWith(f))) {
            redirects.push(existingPath.replace('/docs/blueprints-examples/', '/blueprints/'));
          } else {
            redirects.push(existingPath.replace('/docs/blueprints-examples/', '/blueprints/blueprints-examples/'));
          }
        }
        // Terms: /terms/terms-abbreviations and /docs/terms-abbreviations redirect to /terms-abbreviations
        if (existingPath.includes('/terms-abbreviations')) {
          redirects.push('/terms/terms-abbreviations', '/docs/terms-abbreviations');
        }

        // === Old ReadMe /dev-hub/ redirects ===
        const cleanPath = existingPath.replace(/\/$/, '');
        const lastSegment = cleanPath.split('/').pop();

        // Docs pages: /dev-hub/docs/{slug} -> current nested path
        if (existingPath.startsWith('/docs/') && lastSegment && lastSegment !== 'docs') {
          redirects.push(`/dev-hub/docs/${lastSegment}`);
        }

        // Old ReadMe "Pages" section: /dev-hub/{slug} (no /docs/ or /reference/ prefix)
        const devHubTopLevelPages = new Set([
          'quectel-bg95-m3', 'quectel-ec25-ec21', 'recipes',
          'sara-r410m', 'sim7000g', 'simcom-7020g-simcom800l',
        ]);
        if (lastSegment && devHubTopLevelPages.has(lastSegment)) {
          redirects.push(`/dev-hub/${lastSegment}`);
        }
        if (existingPath.includes('/terms-abbreviations')) {
          redirects.push('/dev-hub/terms-abbreviations');
        }

        return redirects.length > 0 ? redirects : undefined;
      },
    }],
    'docusaurus-plugin-sass',
    './plugins/llms-txt-plugin.ts',
    function polyfillNodeModules() {
      return {
        name: 'polyfill-node-modules',
        configureWebpack() {
          return {
            resolve: {
              fallback: {
                path: require.resolve('path-browserify'),
              },
            },
          };
        },
      };
    },
  ],

  themes: ['docusaurus-theme-openapi-docs'],

  themeConfig: {
    image: 'img/1nce-social-card.png',
    docs: {
      sidebar: {
        autoCollapseCategories: true,
      },
    },
    colorMode: {
      defaultMode: 'light',
      disableSwitch: true,
      respectPrefersColorScheme: false,
    },
    navbar: {
      title: '',
      logo: {
        alt: '1NCE Developer Hub',
        src: 'img/1nce-dev-hub-logo.svg',
      },
      items: [
        {
          href: 'https://1nce.com',
          label: '1NCE Home',
          position: 'right',
          target: '_blank',
        },
        {
          href: 'https://portal.1nce.com/portal/shop/cart',
          label: '1NCE Shop',
          position: 'right',
          target: '_blank',
        },
        {
          href: 'https://portal.1nce.com/portal/customer/login',
          label: '1NCE Portal',
          position: 'right',
          target: '_blank',
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
