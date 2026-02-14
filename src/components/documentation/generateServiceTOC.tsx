import config from '@generated/docusaurus.config'
import { Docs, ServiceRoute } from './useServiceDocs'

export function generateServiceTOC(service: string) {
  const siteConfig = config
  const services = (siteConfig.customFields.docs as Docs).services
  const serviceData = services.find((s) => s.name === service)

  if (!serviceData?.routes) {
    return []
  }

  const slugify = (text: string) => {
    if (typeof text !== 'string' || text.length === 0) {
      return ''
    }

    const slug = text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/[\s-]+/g, '-')
      .replace(/^-+|-+$/g, '')

    return slug
  }

  const getSortOrder = (method: string) => {
    return ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].indexOf(method.toUpperCase())
  }

  const getRouteTitle = (route: ServiceRoute) => {
    return route.description?.split('\n')[0] ?? 'Missing title'
  }

  return serviceData.routes
    .sort((a, b) => getSortOrder(a.method) - getSortOrder(b.method))
    .map((route) => ({
      value: getRouteTitle(route),
      id: slugify(getRouteTitle(route)),
      level: 3,
    }))
}
