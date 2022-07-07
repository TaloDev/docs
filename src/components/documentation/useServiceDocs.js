import useDocusaurusContext from '@docusaurus/useDocusaurusContext'

export default function useServiceDocs(serviceName) {
  const { siteConfig } = useDocusaurusContext()
  const { services } = siteConfig.customFields.docs

  return services.find((service) => service.name === serviceName)
}
