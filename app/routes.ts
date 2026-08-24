import { index, route, type RouteConfig } from '@react-router/dev/routes'

export default [
  index('routes/home.tsx'),
  route('intro', 'routes/intro-redirect.tsx'),
  route('api/search', 'routes/search.ts'),
  route(':version/*', 'routes/docs.tsx'),
] satisfies RouteConfig
