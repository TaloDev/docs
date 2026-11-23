import { index, route, type RouteConfig } from '@react-router/dev/routes'
import { markdownRoute } from './lib/shared'

export default [
  index('routes/home.tsx'),
  route('api/search', 'routes/search.ts'),
  route('sitemap.xml', 'routes/sitemap.ts'),
  route(`${markdownRoute}/*`, 'routes/llms.ts'),
  route(':version/*', 'routes/docs.tsx'),
] satisfies RouteConfig
