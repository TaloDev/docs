import services from './api-docs.json'

export type Sample = {
  title: string
  sample: object
  // pre-rendered shiki html, added at build time by the `taloApiDocs` plugin
  html: string
}

export type ServiceRoute = {
  method: 'get' | 'post' | 'put' | 'patch' | 'delete'
  path: string
  description: string
  params: {
    location: 'query' | 'body' | 'route' | 'headers'
    name: string
    required: boolean
    description?: string
    type: string
  }[]
  samples: Sample[] | null
  scopes?: string[]
}

export type TaloService = {
  name: string
  path: string
  routes: ServiceRoute[]
}

export const servicesData = services as TaloService[]

export function getService(serviceName: string) {
  return servicesData.find((service) => service.name === serviceName)
}

export function slugify(text?: string) {
  if (typeof text !== 'string' || text.length === 0) {
    return ''
  }

  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const METHOD_ORDER = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']

export function getRouteTitle(route: ServiceRoute) {
  return route.description?.split('\n')[0] ?? 'No title'
}

function methodRank(route: ServiceRoute) {
  const index = METHOD_ORDER.indexOf(route.method.toUpperCase())
  return index === -1 ? METHOD_ORDER.length : index
}

// Sorted by method, except a route whose title extends the title of a route on the
// same path is moved up next to it, so 'Identify a player' and 'Identify a player
// with a claim key' stay together instead of being split across GET and POST.
export function orderRoutes(routes: ServiceRoute[]) {
  const ordered: ServiceRoute[] = []

  for (const route of [...routes].sort((a, b) => methodRank(a) - methodRank(b))) {
    const title = getRouteTitle(route)
    const anchor = ordered.findIndex(
      (placed) => placed.path === route.path && title.startsWith(getRouteTitle(placed)),
    )

    if (anchor === -1) {
      ordered.push(route)
    } else {
      ordered.splice(anchor + 1, 0, route)
    }
  }

  return ordered
}

export function generateServiceTOC(serviceName: string) {
  const serviceData = getService(serviceName)

  if (!serviceData?.routes) {
    return []
  }

  return orderRoutes(serviceData.routes).map((route) => {
    const title = getRouteTitle(route)
    return { title, url: `#${slugify(title)}`, depth: 3 }
  })
}
