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
        // Old ReadMe OpenAPI page
        { from: '/dev-hub/openapi', to: '/api/' },
        // Old /blueprints-examples/ leaf pages -> parent module pages
        { from: '/blueprints-examples/bg95-m3-1nce-os-udp', to: '/docs/blueprints-examples/quectel-bg95-m3/' },
        { from: '/blueprints-examples/bg95-m3-icmp-ping', to: '/docs/blueprints-examples/quectel-bg95-m3/' },
        { from: '/blueprints-examples/bg95-m3-network-registration', to: '/docs/blueprints-examples/quectel-bg95-m3/' },
        { from: '/blueprints-examples/bg95bg77-tcp-client-connection', to: '/docs/blueprints-examples/quectel-bg95-m3/' },
        { from: '/blueprints-examples/ec25-ec21-1nce-os-udp', to: '/docs/blueprints-examples/quectel-ec25-ec21/' },
        { from: '/blueprints-examples/ec25-icmp-ping', to: '/docs/blueprints-examples/quectel-ec25-ec21/' },
        { from: '/blueprints-examples/ec25-mo-sms', to: '/docs/blueprints-examples/quectel-ec25-ec21/' },
        { from: '/blueprints-examples/ec25-mt-sms', to: '/docs/blueprints-examples/quectel-ec25-ec21/' },
        { from: '/blueprints-examples/ec25-network-registration', to: '/docs/blueprints-examples/quectel-ec25-ec21/' },
        { from: '/blueprints-examples/ec25-rat-configuration', to: '/docs/blueprints-examples/quectel-ec25-ec21/' },
        { from: '/blueprints-examples/ec25-tcp-client-connection', to: '/docs/blueprints-examples/quectel-ec25-ec21/' },
        { from: '/blueprints-examples/sara-r4-get-http', to: '/docs/blueprints-examples/sara-r410m/' },
        { from: '/blueprints-examples/sara-r410m-1nce-os-udp', to: '/docs/blueprints-examples/sara-r410m/' },
        { from: '/blueprints-examples/sara-r410m-network-registration', to: '/docs/blueprints-examples/sara-r410m/' },
        { from: '/blueprints-examples/sim7000g-1nce-os-coap', to: '/docs/blueprints-examples/simcom-7020g-simcom800l/' },
        { from: '/blueprints-examples/sim7000g-icmp-ping', to: '/docs/blueprints-examples/sim7000g/' },
        { from: '/blueprints-examples/sim7000g-mo-sms', to: '/docs/blueprints-examples/sim7000g/' },
        { from: '/blueprints-examples/sim7000g-mt-sms', to: '/docs/blueprints-examples/sim7000g/' },
        { from: '/blueprints-examples/sim7000g-network-registration', to: '/docs/blueprints-examples/sim7000g/' },
        { from: '/blueprints-examples/sim7000g-rat-configuration', to: '/docs/blueprints-examples/sim7000g/' },
        { from: '/blueprints-examples/sim7000g-tcp-client-connection', to: '/docs/blueprints-examples/sim7000g/' },
        { from: '/blueprints-examples/sim7000g-udp-client-connection', to: '/docs/blueprints-examples/sim7000g/' },
        { from: '/blueprints-examples/sim7020e-1nce-os-coap-1', to: '/docs/blueprints-examples/sim7000g/' },
        { from: '/blueprints-examples/sim800l-http-get', to: '/docs/blueprints-examples/simcom-7020g-simcom800l/' },
        { from: '/blueprints-examples/sim800l-http-post', to: '/docs/blueprints-examples/simcom-7020g-simcom800l/' },
        { from: '/blueprints-examples/sim800l-icmp-ping', to: '/docs/blueprints-examples/simcom-7020g-simcom800l/' },
        { from: '/blueprints-examples/sim800l-mo-sms', to: '/docs/blueprints-examples/simcom-7020g-simcom800l/' },
        { from: '/blueprints-examples/sim800l-mt-sms', to: '/docs/blueprints-examples/simcom-7020g-simcom800l/' },
        { from: '/blueprints-examples/sim800l-network-registration', to: '/docs/blueprints-examples/simcom-7020g-simcom800l/' },
        { from: '/blueprints-examples/sim800l-tcp-client-connection', to: '/docs/blueprints-examples/simcom-7020g-simcom800l/' },
        { from: '/blueprints-examples/sim800l-udp-client-connection', to: '/docs/blueprints-examples/simcom-7020g-simcom800l/' },
        { from: '/blueprints-examples/1nce-vpn-linux-client', to: '/docs/blueprints-examples/recipes/' },
        { from: '/blueprints-examples/wvdial-tutorial', to: '/docs/blueprints-examples/recipes/' },
        // Wrong /docs/1nce-os/ plugin paths (missing /1nce-os-plugins/ segment)
        { from: '/docs/1nce-os/1nce-os-plugins-device-observability-memfault', to: '/docs/1nce-os/1nce-os-plugins/1nce-os-plugins-device-observability-memfault/' },
        { from: '/docs/1nce-os/1nce-os-plugins-fota-management-mender', to: '/docs/1nce-os/1nce-os-plugins/1nce-os-plugins-fota-management-mender/' },
        // Deep SDK blueprints path
        { from: '/docs/1nce-os/1nce-os-sdk-blueprints/sdk-blueprints-zephyr/plugin_system/nce_debug_memfault_demo', to: '/docs/1nce-os/1nce-os-sdk-blueprints/sdk-blueprints-zephyr/' },
        // Old /blueprints-examples/examples-sms/ sub-paths
        { from: '/blueprints-examples/examples-sms/examples-mo-sms', to: '/docs/blueprints-examples/examples-sms/examples-mo-sms/' },
        { from: '/blueprints-examples/examples-sms/examples-mt-sms', to: '/docs/blueprints-examples/examples-sms/examples-mt-sms/' },
        // Root shortcut paths
        { from: '/examples-data-streamer', to: '/docs/blueprints-examples/examples-data-streamer/' },
        { from: '/examples-sms', to: '/docs/blueprints-examples/examples-sms/' },
        { from: '/examples-sms-forwarder', to: '/docs/blueprints-examples/examples-sms-forwarder/' },
        { from: '/examples-vpn', to: '/docs/blueprints-examples/examples-vpn/' },
        { from: '/recipes', to: '/docs/blueprints-examples/recipes/' },
      ],
      createRedirects(existingPath) {
        const redirects: string[] = [];

        // Safety net: /{section}/... -> /docs/{section}/... for any doc page
        // Catches external links/bookmarks using old paths without /docs/ prefix
        const docSections = ['1nce-os', 'network-services', 'platform-services', '1nce-portal', 'connectivity-services', 'sim-cards'];
        for (const section of docSections) {
          if (existingPath.startsWith(`/docs/${section}/`) || existingPath === `/docs/${section}`) {
            redirects.push(existingPath.replace('/docs/', '/'));
          }
        }

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

        // Old ReadMe /index/ suffix: /{section}/.../index/ -> /docs/{section}/.../
        const indexSections = ['1nce-os', 'network-services', 'platform-services', 'blueprints-examples'];
        for (const section of indexSections) {
          if (existingPath.startsWith(`/docs/${section}/`)) {
            const withoutDocs = existingPath.replace('/docs/', '/');
            const withoutTrailing = withoutDocs.replace(/\/$/, '');
            redirects.push(`${withoutTrailing}/index`);
          }
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

  themes: [
    'docusaurus-theme-openapi-docs',
    ['@easyops-cn/docusaurus-search-local', {
      // Core indexing
      indexDocs: true,
      indexBlog: false,
      indexPages: false,

      // Multi-instance: CRITICAL — both docs plugin instances
      docsRouteBasePath: ['/docs', '/api'],
      docsDir: ['docs/documentation', 'docs/api'],

      // Language
      language: ['en'],

      // Caching — content-hashed filenames for CloudFront
      hashed: 'filename',

      // UI behavior — plugin defaults per D-10
      searchBarShortcutHint: true,
      searchBarPosition: 'right',
      searchResultLimits: 8,
      explicitSearchResultPath: true,

      // Target page highlighting: mark.js highlights matched terms after navigation (D-05)
      highlightSearchTermsOnTargetPage: true,
      // Path-based search context: auto-detects docs vs API from URL (D-06 revised)
      // On /docs/* pages: only docs results. On /api/* pages: only API results.
      // On other pages (homepage): all results shown.
      searchContextByPaths: [
        { label: 'Docs', path: '/docs' },
        { label: 'API', path: '/api' },
      ],
      useAllContextsWithNoSearchContext: true,

      // Exclude redirect stub pages from search index (D-07)
      // plugin-client-redirects generates meta-refresh HTML stubs at these paths.
      // The search plugin indexes from MDX source (not built HTML), so these are
      // defensive — they prevent indexing if the plugin behavior ever changes.
      ignoreFiles: [
        // Old ReadMe /dev-hub/ paths (281 stubs)
        /\/dev-hub\//,
        // Old /starting-guide/ path
        /\/starting-guide\//,
        // Old /platform/ prefix (not /docs/platform-services/)
        /^\/platform\//,
        // Old /blueprints/ and /blueprints-examples/ top-level
        /^\/blueprints\//,
        /^\/blueprints-examples\//,
        // Old /terms/ prefix
        /^\/terms\//,
        // Root shortcut redirects (/examples-*, /recipes)
        /^\/examples-/,
        /^\/recipes$/,
        // Section-level redirects without /docs/ prefix
        /^\/1nce-os\//,
        /^\/network-services\//,
        /^\/platform-services\//,
        /^\/1nce-portal\//,
        /^\/connectivity-services\//,
        /^\/sim-cards\//,
      ],
    }],
  ],

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
