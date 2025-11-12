const prisma = require('prism-react-renderer')
const axios = require('axios')

/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = async function configCreatorAsync() {
  const baseUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://api.trytalo.com'
  let services = []

  try {
    const res = await axios.get(`${baseUrl}/public/docs`)
    services = res.data.docs.services
  } catch (err) {
    console.error(err.message)
  }

  return {
    title: 'Talo - the open source game backend',
    url: 'https://docs.trytalo.com',
    baseUrl: '/',
    onBrokenLinks: 'throw',
    onBrokenMarkdownLinks: 'warn',
    favicon: 'img/favicon.ico',
    organizationName: 'TaloDev', // Usually your GitHub org/user name.
    projectName: 'docs', // Usually your repo name.
    themeConfig: {
      metadata: [
        { name: 'og:image', content: 'https://trytalo.com/opengraph.png' },
        { name: 'twitter:image', content: 'https://trytalo.com/opengraph.png' },
      ],
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
            title: 'Features',
            items: [
              {
                label: 'Player management',
                to: 'https://trytalo.com/players?utm_source=docs&utm_medium=footer'
              },
              {
                label: 'Event tracking',
                to: 'https://trytalo.com/events?utm_source=docs&utm_medium=footer'
              },
              {
                label: 'Leaderboards',
                to: 'https://trytalo.com/leaderboards?utm_source=docs&utm_medium=footer'
              },
              {
                label: 'Game saves',
                to: 'https://trytalo.com/saves?utm_source=docs&utm_medium=footer'
              },
              {
                label: 'Game stats',
                to: 'https://trytalo.com/stats?utm_source=docs&utm_medium=footer'
              },
              {
                label: 'Game feedback',
                to: 'https://trytalo.com/feedback?utm_source=docs&utm_medium=footer'
              },
              {
                label: 'Live config',
                to: 'https://trytalo.com/live-config?utm_source=docs&utm_medium=footer'
              }
            ]
          },
          {
            title: 'Docs',
            items: [
              {
                label: 'Godot plugin',
                to: '/docs/godot/install'
              },
              {
                label: 'Unity package',
                to: '/docs/unity/install'
              },
              {
                label: 'API reference',
                to: '/docs/http/authentication'
              },
              {
                label: 'Self-hosting',
                to: '/docs/selfhosting/overview'
              },
              {
                label: 'Steamworks integration',
                to: '/docs/integrations/steamworks'
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
                label: 'Dashboard',
                href: 'https://github.com/TaloDev/frontend'
              },
              {
                label: 'Godot plugin',
                href: 'https://github.com/TaloDev/godot'
              },
              {
                label: 'Unity package',
                href: 'https://github.com/TaloDev/unity'
              }
            ]
          },
          {
            title: 'Contact us',
            items: [
              {
                label: 'Discord',
                href: 'https://trytalo.com/discord'
              },
              {
                label: 'Email',
                href: 'mailto:hello@trytalo.com'
              },
              {
                label: 'Twitter',
                href: 'https://x.com/trytalo'
              },
              {
                label: 'Bluesky',
                href: 'https://bsky.app/profile/trytalo.com'
              }
            ]
          }
        ],
        copyright: `<br/>Copyright © ${new Date().getFullYear()} Talo Platform Ltd. Built with Docusaurus.`
      },
      prism: {
        theme: prisma.themes.github,
        darkTheme: prisma.themes.nightOwl,
        additionalLanguages: ['csharp', 'gdscript']
      },
      algolia: {
        appId: 'PRKSHSO6YK',
        apiKey: 'e2b359c956d71101043b3408dd704966',
        indexName: 'docs',
        searchParameters: {},
        searchPagePath: 'search',
        insights: true,
      },
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
    ],
    customFields: {
      docs: {
        baseUrl,
        services
      }
    },
    scripts: [
      {
        src: 'https://p.trytalo.com/js/script.outbound-links.js',
        defer: true,
        'data-domain': 'docs.trytalo.com'
      }
    ]
  }
}
