import type { ExportedHandler } from '@cloudflare/workers-types'
import { createRequestHandler } from 'react-router'

type Env = {}

// Pre-versioning paths (e.g. /docs/godot/install) redirect to the default version.
const DEFAULT_VERSION = '1.x'
const LEGACY_SECTIONS = ['godot', 'unity', 'http', 'sockets', 'selfhosting', 'integrations']

const requestHandler = createRequestHandler(
  () => import('virtual:react-router/server-build'),
  import.meta.env.MODE,
)

export default {
  async fetch(request) {
    const { pathname, origin } = new URL(request.url)
    // Old `/docs/*` URLs redirect to the prefix-less paths.
    if (pathname === '/docs' || pathname === '/docs/') {
      return Response.redirect(`${origin}/${DEFAULT_VERSION}`, 301)
    }
    const match = pathname.match(/^\/docs\/(.+)$/)
    if (match) {
      const rest = match[1]
      const [first] = rest.split('/')
      const target = LEGACY_SECTIONS.includes(first) ? `/${DEFAULT_VERSION}/${rest}` : `/${rest}`
      return Response.redirect(`${origin}${target}`, 301)
    }
    return requestHandler(request)
  },
} satisfies ExportedHandler<Env>
