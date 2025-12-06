/**
 * Server-side function to generate TOC entries for a service.
 *
 * @param {string} service - The service name (e.g., 'GameStatAPIService')
 * @param {object} siteConfig - The Docusaurus site config
 * @returns {Array} Array of TOC entries
 */
export function generateServiceTOC(service, siteConfig) {
  const services = siteConfig?.customFields?.docs?.services || []
  const serviceData = services.find(s => s.name === service)

  if (!serviceData || !serviceData.routes) {
    return []
  }

  const slugify = (text) => {
    if (typeof text !== 'string' || text.length === 0) {
      return ''
    }
    let slug = text.toLowerCase().replace(/[^a-z0-9\s-]/g, '')
    slug = slug.replace(/[\s-]+/g, '-')
    slug = slug.replace(/^-+|-+$/g, '')
    return slug
  }

  const getSortOrder = (method) => {
    return ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].indexOf(method)
  }

  const getRouteTitle = (route) => {
    return route.description?.split('\n')[0] ?? 'No title'
  }

  return serviceData.routes
    .sort((a, b) => getSortOrder(a.method) - getSortOrder(b.method))
    .map(route => ({
      value: getRouteTitle(route),
      id: slugify(getRouteTitle(route)),
      level: 3
    }))
}
