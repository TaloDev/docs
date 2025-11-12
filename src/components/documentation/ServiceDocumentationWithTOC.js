import React from 'react'
import ServiceDocumentation, { generateTOCForService } from './ServiceDocumentation'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import TOCInline from '@theme/TOCInline'

/**
 * Wrapper component that renders ServiceDocumentation with an inline TOC
 * This allows the dynamically generated headings to appear in the right sidebar
 */
export default function ServiceDocumentationWithTOC({ service, metaDescription }) {
  const { siteConfig } = useDocusaurusContext()
  const toc = generateTOCForService(service, siteConfig)

  return (
    <>
      <TOCInline toc={toc} />
      <ServiceDocumentation service={service} metaDescription={metaDescription} />
    </>
  )
}
