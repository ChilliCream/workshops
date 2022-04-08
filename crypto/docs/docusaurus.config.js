// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'workshop',
  tagline: 'Building Modern Applications with GraphQL',
  url: 'https://ccc-workshop-eu-web-docs.azurewebsites.net',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'ChilliCream',
  projectName: 'crypto-workshop',

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          breadcrumbs: false,
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/ChilliCream/workshops/tree/main/crypto/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        logo: {
          alt: 'crypto logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'doc',
            docId: 'intro',
            position: 'left',
            label: 'Docs',
          },
          {
            href: 'https://github.com/ChilliCream/workshops/tree/main/crypto/',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'light',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Workshop',
                to: '/docs/intro',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Stack Overflow',
                href: 'https://stackoverflow.com/questions/tagged/hotchocolate',
              },
              {
                label: 'Twitter',
                href: 'https://twitter.com/Chilli_Cream',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'ChilliCream',
                href: 'https://chillicream.com/',
              },
              {
                label: 'React',
                href: 'https://reactjs.org/',
              },
              {
                label: 'Relay',
                href: 'https://relay.dev/',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} crypto - workshop.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ['csharp'],
      },
    }),
};

module.exports = config;
