import type { ExportedHandler } from '@cloudflare/workers-types'
import { isMarkdownPreferred } from 'fumadocs-core/negotiation'
import { createRequestHandler } from 'react-router'
import { markdownRoute } from '../app/lib/shared'

// `env.ASSETS` is undefined in `pnpm dev` and during prerender.
type Env = { ASSETS?: Fetcher }

// Pre-versioning paths (e.g. /docs/godot/install) redirect to the default version.
const DEFAULT_VERSION = '1.x'
const LEGACY_SECTIONS = ['godot', 'unity', 'http', 'sockets', 'selfhosting', 'integrations']
const INTRO_SEGMENT = 'intro'
// React Router sets this while prerendering the SPA fallback during `pnpm build`.
// That request must render the shell, so it must skip the `/` redirect below.
const SPA_FALLBACK_HEADER = 'X-React-Router-SPA-Mode'
// `/1.x` ends with a dot, so testing for an extension would skip page requests.
const ASSET_PATH = /\.(?:js|mjs|css|json|xml|txt|md|map|data|png|jpe?g|gif|svg|webp|ico|woff2?)$/i
const MARKDOWN_EXTENSION = '.md'

const requestHandler = createRequestHandler(
  () => import('virtual:react-router/server-build'),
  import.meta.env.MODE,
)

function respond(request: Request, env: Env) {
  // Without the binding, React Router renders the response itself.
  if (env.ASSETS) {
    return env.ASSETS.fetch(request)
  }

  return requestHandler(request)
}

export default {
  async fetch(request, env) {
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
    if (isMarkdownPreferred(request) && !ASSET_PATH.test(pathname)) {
      const markdown = new URL(`${markdownRoute}${pathname}${MARKDOWN_EXTENSION}`, origin)
      const response = await respond(new Request(markdown, request), env)
      if (response.ok) {
        return response
      }
    }

    const response = await respond(request, env)
    // Assets answer 404 for a path with no file, which is a page React Router renders.
    if (env.ASSETS && response.status === 404) {
      return requestHandler(request)
    }

    return response
  },
} satisfies ExportedHandler<Env>
