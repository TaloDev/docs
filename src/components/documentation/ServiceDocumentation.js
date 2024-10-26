import React from 'react'
import useServiceDocs from './useServiceDocs'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import styles from './ServiceDocumentation.module.css'
import clsx from 'clsx'
import Sample from './Sample'
import Head from '@docusaurus/Head'

export default function ServiceDocumentation({ service, metaDescription }) {
  const { siteConfig } = useDocusaurusContext()
  const { routes } = useServiceDocs(service)

  const getParamRequiredText = (requiredType) => {
    if (requiredType === 'YES') return <span><span>✅</span> Yes</span>
    if (requiredType === 'NO') return <span><span>❌</span> No</span>
    if (requiredType === 'SOMETIMES') return <span><span>⚠️</span> Sometimes</span>
  }

  const getParamDescriptionText = (description) => {
    let transformed = description

    const parts = description.split(' ')
    for (const part of parts) {
      if (part.startsWith('@type')) {
        const innerMatch = part.match(/[^\(]*\:([^\)]*)/)[0]
        const fullMatch = part.match(/@type\((.*)\:(.*)\)/)[0]
        const matchParts = innerMatch.split(':')

        transformed = transformed.replace(fullMatch, `<a href='#${matchParts[1]}'>${matchParts[0]}</a>`)
      }
    }

    return transformed
  }

  const getSortOrder = (method) => {
    return ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].indexOf(method)
  }

  const getRouteTitle = (route) => {
    return <h3>{route.description?.split('\n')[0] ?? 'No title'}</h3>
  }

  const getRouteDescription = (route) => {
    return route.description?.split('\n').map((part, idx) => {
      if (idx === 0) return null
      return <p key={idx} className={styles.descriptionText}>{part}</p>
    }) ?? null
  }

  return (
    <>
      <Head>
        <meta name="description" content={metaDescription} />
        <meta name="og:description" content={metaDescription} />
      </Head>

      <hr />

      {routes.sort((a, b) => getSortOrder(a.method) - getSortOrder(b.method)).map((route, idx) => {
        const headers = route.params.filter(({ type }) => type === 'headers')
        const routeParams = route.params.filter(({ type }) => type === 'route')
        const queryParams = route.params.filter(({ type }) => type === 'query')
        const bodyParams = route.params.filter(({ type }) => type === 'body')

        const sections = [
          { title: 'Headers', params: headers },
          { title: 'Route params', params: routeParams },
          { title: 'Query keys', params: queryParams },
          { title: 'Body keys', params: bodyParams }
        ]

        return (
          <React.Fragment key={idx}>
            {getRouteTitle(route)}

            <code className={styles.url}>
              <span className={clsx(styles.methodTag, styles[route.method.toLowerCase()])}>{route.method}</span> <code>{siteConfig.customFields.docs.baseUrl}{route.path}</code>
            </code>

            {getRouteDescription(route)}

            {sections.filter((section) => section.params.length > 0).map((section) => {
              return (
                <React.Fragment key={section.title}>
                  <h4 className={styles.sectionTitle}>{section.title}</h4>
                  <table>
                    <thead>
                      <tr>
                        <th>Key</th>
                        <th>Required</th>
                        <th>Description</th>
                      </tr>
                    </thead>

                    <tbody>
                      {section.params.sort((a, b) => a.name.localeCompare(b.name)).map((param, idx) => (
                        <tr key={idx}>
                          <td className={styles.nameCell}><code>{param.name}</code></td>
                          <td className={styles.requiredCell}>{getParamRequiredText(param.required)}</td>
                          <td className={styles.descriptionCell} dangerouslySetInnerHTML={{ __html: getParamDescriptionText(param.description) }} />
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </React.Fragment>
              )
            })}

            {route.samples.map((sample) => <Sample key={sample.title} sample={sample} route={route} />)}

            <hr />
          </React.Fragment>
        )
      })}
    </>
  )
}
