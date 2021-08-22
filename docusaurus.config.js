const lightCodeTheme = require('prism-react-renderer/themes/github')
const darkCodeTheme = require('prism-react-renderer/themes/nightOwl')

/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: 'Talo',
  url: 'https://docs.trytalo.com',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'TaloDev', // Usually your GitHub org/user name.
  projectName: 'docs', // Usually your repo name.
  themeConfig: {
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: true
    },
    navbar: {
      title: 'Talo',
      logo: {
        alt: 'Talo Logo',
        src: 'img/logo.svg'
      },
      items: [
        {
          type: 'doc',
          docId: 'intro',
          position: 'left',
          label: 'Docs'
        },
        {
          href: 'https://github.com/TaloDev',
          label: 'GitHub',
          position: 'left'
        },
        {
          href: 'https://dashboard.trytalo.com',
          label: 'Dashboard',
          position: 'right'
        }
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Unity SDK',
              to: '/docs/unity/install'
            },
            {
              label: 'Self-hosting',
              to: '/docs/selfhosting/overview'
            }
          ]
        },
        {
          title: 'Code',
          items: [
            {
              label: 'Backend',
              href: 'https://github.com/TaloDev/backend'
            },
            {
              label: 'Frontend',
              href: 'https://github.com/TaloDev/frontend'
            }
          ]
        },
        {
          title: 'Contact us',
          items: [
            {
              label: 'hello@trytalo.com',
              href: 'mailto:hello@trytalo.com'
            }
          ]
        }
      ],
      copyright: `<br/>Copyright © ${new Date().getFullYear()} Try Talo Limited. Built with Docusaurus.`
    },
    prism: {
      theme: lightCodeTheme,
      darkTheme: darkCodeTheme
    }
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl:
            'https://github.com/TaloDev/docs/edit/main/'
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl:
            'https://github.com/facebook/docusaurus/edit/master/website/blog/'
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css')
        }
      }
    ]
  ]
}
