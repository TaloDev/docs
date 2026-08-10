import type { ReactNode } from 'react'
import { IconExchange, IconServer, IconTopologyBus, IconWorld } from '@tabler/icons-react'
import { GodotIcon, UnityIcon } from '@/components/brand-icons'

const icons: Record<string, ReactNode> = {
  godot: <GodotIcon />,
  unity: <UnityIcon />,
  http: <IconWorld />,
  sockets: <IconTopologyBus />,
  selfhosting: <IconServer />,
  integrations: <IconExchange />,
}

export function resolveIcon(icon: string | undefined) {
  return icon ? icons[icon] : undefined
}
