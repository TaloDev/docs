import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared'
import { IconBrandDiscord, IconExternalLink } from '@tabler/icons-react'
import { appName } from './shared'

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <>
          <img src='/img/logo.svg' alt='Talo logo' className='h-6 w-auto' />
          <span>{appName}</span>
        </>
      ),
    },
    links: [
      { text: 'Talo Dashboard', url: 'https://dashboard.trytalo.com', icon: <IconExternalLink /> },
      { text: 'trytalo.com', url: 'https://trytalo.com', icon: <IconExternalLink /> },
      { text: 'Discord', url: 'https://trytalo.com/discord', icon: <IconBrandDiscord /> },
    ],
    themeSwitch: { enabled: false },
  }
}
