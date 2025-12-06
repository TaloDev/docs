import React from 'react'
import useServiceDocs from './useServiceDocs'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import styles from './ServiceDocumentation.module.css'
import clsx from 'clsx'
import Sample from './Sample'
import Head from '@docusaurus/Head'
import Heading from '@theme/Heading'
import { ScopeBadges } from '../ScopeBadges'

function slugify(text) {
  if (typeof text !== 'string' || text.length === 0) {
      return '';
  }

  // 1. Remove characters that are not a-z, 0-9, space, or dash
  let slug = text.toLowerCase().replace(/[^a-z0-9\s-]/g, '');

  // 2. Replace all remaining spaces and multiple dashes with a single dash
  slug = slug.replace(/[\s-]+/g, '-');

  // 3. Trim leading/trailing dashes
  slug = slug.replace(/^-+|-+$/g, '');

  return slug;
}

export default function ServiceDocumentation({ service, metaDescription }) {
  const { siteConfig } = useDocusaurusContext()
  const serviceData = useServiceDocs(service)

  if (!serviceData) {
    return <div>Service "{service}" not found</div>
  }

  const { routes } = serviceData

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

  const getRouteDescription = (route) => {
    return route.description?.split('\n').map((part, idx) => {
      if (idx === 0) return null
      return <p key={idx} className={styles.descriptionText}>{part}</p>
    }) ?? null
  }

  const getRouteTitle = (route) => {
    return route.description?.split('\n')[0] ?? 'No title'
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

        const routeTitle = getRouteTitle(route)

        const scopes = route.scopes || []
        const scopeMap = scopes.reduce((acc, scopeString) => {
          const [action, scope] = scopeString.split(':')
          if (!acc[scope]) {
            acc[scope] = { read: false, write: false }
          }
          if (action === 'read') acc[scope].read = true
          if (action === 'write') acc[scope].write = true
          return acc
        }, {})

        return (
          <React.Fragment key={idx}>
            <Heading id={slugify(routeTitle)} as='h3'>{routeTitle}</Heading>

            {Object.entries(scopeMap).map(([scope, { read, write }]) => (
              <ScopeBadges key={scope} scope={scope} read={read} write={write} />
            ))}

            <code className={styles.url}>
              <span className={clsx(styles.methodTag, styles[route.method.toLowerCase()])}>{route.method}</span> <code>{siteConfig.customFields.docs.baseUrl}{route.path}</code>
            </code>

            {getRouteDescription(route)}

            {sections.filter((section) => {
              if (route.method === 'GET') {
                return section.title !== 'Body keys'
              }
            }).map((section) => {
              return (
                <div key={section.title} className={styles.section}>
                  <Heading
                    as='h4'
                    id={slugify(`${routeTitle}-${section.title}`)}
                    className={styles.sectionTitle}
                  >
                    {section.title}
                  </Heading>

                  <div className={styles.sectionContent}>
                    {section.params.length === 0 && <p className={styles.sectionEmptyText}>None available</p>}

                    {section.params.length > 0 &&
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
                    }
                  </div>
                </div>
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
