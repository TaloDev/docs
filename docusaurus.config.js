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
    title: 'Talo',
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
            title: 'Docs',
            items: [
              {
                label: 'Unity package',
                to: '/docs/unity/install'
              },
              {
                label: 'Godot plugin',
                to: '/docs/godot/install'
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
                label: 'Dashboard',
                href: 'https://github.com/TaloDev/frontend'
              },
              {
                label: 'Unity package',
                href: 'https://github.com/TaloDev/unity'
              },
              {
                label: 'Godot plugin',
                href: 'https://github.com/TaloDev/godot'
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
        theme: prisma.themes.github,
        darkTheme: prisma.themes.nightOwl,
        additionalLanguages: ['csharp', 'gdscript']
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
    ],
    customFields: {
      docs: {
        baseUrl,
        services
      }
    },
    scripts: [
      {
        src: 'https://p.trytalo.com/js/script.js',
        defer: true,
        'data-domain': 'docs.trytalo.com'
      }
    ]
  }
}
