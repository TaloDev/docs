import type { ExportedHandler } from '@cloudflare/workers-types'
import { createRequestHandler } from 'react-router'

type Env = {}

// Pre-versioning paths (e.g. /docs/godot/install) redirect to the default version.
const DEFAULT_VERSION = '1.x'
const LEGACY_SECTIONS = ['godot', 'unity', 'http', 'sockets', 'selfhosting', 'integrations']
const INTRO_SEGMENT = 'intro'
// React Router sets this while prerendering the SPA fallback during `pnpm build`.
// That request must render the shell, so it must skip the `/` redirect below.
const SPA_FALLBACK_HEADER = 'X-React-Router-SPA-Mode'

const requestHandler = createRequestHandler(
  () => import('virtual:react-router/server-build'),
  import.meta.env.MODE,
)

export default {
  async fetch(request) {
    const { pathname, origin } = new URL(request.url)
    // `/` carries no version, so send it to the default one.
    if (pathname === '/' && !request.headers.has(SPA_FALLBACK_HEADER)) {
      return Response.redirect(`${origin}/${DEFAULT_VERSION}`, 301)
    }
    // `/intro` pre-dates the versioned paths and now lives at `/1.x`.
    if (pathname === '/intro' || pathname === '/intro/') {
      return Response.redirect(`${origin}/${DEFAULT_VERSION}`, 301)
    }
    // Old `/docs/*` URLs redirect to the prefix-less paths.
    if (pathname === '/docs' || pathname === '/docs/') {
      return Response.redirect(`${origin}/${DEFAULT_VERSION}`, 301)
    }
    const match = pathname.match(/^\/docs\/(.+)$/)
    if (match) {
      const rest = match[1]
      const [first] = rest.split('/')
      if (first === INTRO_SEGMENT) {
        return Response.redirect(`${origin}/${DEFAULT_VERSION}`, 301)
      }
      const target = LEGACY_SECTIONS.includes(first) ? `/${DEFAULT_VERSION}/${rest}` : `/${rest}`
      return Response.redirect(`${origin}${target}`, 301)
    }
    return requestHandler(request)
  },
} satisfies ExportedHandler<Env>
