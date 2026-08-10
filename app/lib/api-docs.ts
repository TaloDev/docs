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

export function generateServiceTOC(serviceName: string) {
  const serviceData = getService(serviceName)

  if (!serviceData?.routes) {
    return []
  }

  const order = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']

  return [...serviceData.routes]
    .sort((a, b) => order.indexOf(a.method.toUpperCase()) - order.indexOf(b.method.toUpperCase()))
    .map((route) => {
      const title = route.description?.split('\n')[0] ?? 'No title'
      return { title, url: `#${slugify(title)}`, depth: 3 }
    })
}
