import useDocusaurusContext from '@docusaurus/useDocusaurusContext'

export type Sample = {
  title: string
  sample: object
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

export type Docs = {
  baseUrl: string
  services: TaloService[]
}

export function useServiceDocs(serviceName: string) {
  const { siteConfig } = useDocusaurusContext()
  const { services } = siteConfig.customFields.docs as Docs

  return services.find((service) => service.name === serviceName)
}
