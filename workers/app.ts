import type { ExportedHandler } from '@cloudflare/workers-types'
import { createRequestHandler } from 'react-router'

type Env = {}

// Pre-versioning paths (e.g. /docs/godot/install) redirect to the 1.x version.
const LEGACY_SECTIONS = ['godot', 'unity', 'http', 'sockets', 'selfhosting', 'integrations']
const VERSION_REDIRECTS: Record<string, string> = {
  '1.0': '1.x',
  '0.49': 'pre-1.0',
  '0.60': 'pre-1.0',
}

const requestHandler = createRequestHandler(
  () => import('virtual:react-router/server-build'),
  import.meta.env.MODE,
)

export default {
  async fetch(request) {
    const { pathname, origin } = new URL(request.url)
    const match = pathname.match(/^\/docs\/([^/]+)(\/.*)?$/)
    if (match) {
      const [, first, rest = ''] = match
      let target: string | null = null
      if (LEGACY_SECTIONS.includes(first)) {
        target = `/docs/1.x/${first}${rest}`
      } else if (VERSION_REDIRECTS[first]) {
        target = `/docs/${VERSION_REDIRECTS[first]}${rest}`
      }
      if (target) {
        return Response.redirect(`${origin}${target}`, 301)
      }
    }
    return requestHandler(request)
  },
} satisfies ExportedHandler<Env>
