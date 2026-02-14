import Head from '@docusaurus/Head'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import Heading from '@theme/Heading'
import clsx from 'clsx'
import React from 'react'
import { ScopeBadges } from '../ScopeBadges'
import { Sample } from './Sample'
import styles from './ServiceDocumentation.module.css'
import { Docs, ServiceRoute, useServiceDocs } from './useServiceDocs'

type ScopeMap = {
  [scope: string]: {
    read: boolean
    write: boolean
  }
}

function slugify(text?: string) {
  if (typeof text !== 'string' || text.length === 0) {
    return ''
  }

  // 1. Remove characters that are not a-z, 0-9, space, or dash
  let slug = text.toLowerCase().replace(/[^a-z0-9\s-]/g, '')

  // 2. Replace all remaining spaces and multiple dashes with a single dash
  slug = slug.replace(/[\s-]+/g, '-')

  // 3. Trim leading/trailing dashes
  slug = slug.replace(/^-+|-+$/g, '')

  return slug
}

function normaliseMethod(method: string) {
  return method.toUpperCase()
}

export function ServiceDocumentation({
  service,
  metaDescription,
}: {
  service: string
  metaDescription: string
}) {
  const { siteConfig } = useDocusaurusContext()
  const serviceData = useServiceDocs(service)

  if (!serviceData) {
    return <div>"{service}" not found</div>
  }

  const { routes } = serviceData

  const getParamRequiredText = (required: boolean) => {
    if (required) {
      return (
        <span>
          <span>✅</span> Yes
        </span>
      )
    }

    return (
      <span>
        <span>❌</span> No
      </span>
    )
  }

  const getParamDescriptionText = (description?: string) => {
    if (!description) {
      return ''
    }

    let transformed = description

    const parts = description.split(' ')
    for (const part of parts) {
      if (part.startsWith('@type')) {
        const innerMatch = part.match(/[^(]*:([^)]*)/)?.[0]
        const fullMatch = part.match(/@type\((.*):(.*)\)/)?.[0]
        if (innerMatch && fullMatch) {
          const matchParts = innerMatch.split(':')
          transformed = transformed.replace(
            fullMatch,
            `<a href='#${matchParts[1]}'>${matchParts[0]}</a>`,
          )
        }
      }
    }

    return transformed
  }

  const getSortOrder = (method) => {
    return ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].indexOf(normaliseMethod(method))
  }

  const getRouteDescription = (route: ServiceRoute) => {
    return (
      route.description?.split('\n').map((part, idx) => {
        if (idx === 0) {
          return null
        }
        return (
          <p key={idx} className={styles.descriptionText}>
            {part}
          </p>
        )
      }) ?? null
    )
  }

  const getRouteTitle = (route: ServiceRoute) => {
    return route.description?.split('\n')[0] ?? 'No title'
  }

  const extractParamTypes = (params: ServiceRoute['params'], paramType: string) => {
    return params.filter((param) => param.location === paramType)
  }

  return (
    <>
      <Head>
        <meta name='description' content={metaDescription} />
        <meta name='og:description' content={metaDescription} />
      </Head>

      <hr />

      {routes
        .sort((a, b) => getSortOrder(a.method) - getSortOrder(b.method))
        .map((route, idx) => {
          const sections = [
            { title: 'Headers', params: extractParamTypes(route.params, 'headers') },
            { title: 'Route params', params: extractParamTypes(route.params, 'route') },
            { title: 'Query keys', params: extractParamTypes(route.params, 'query') },
            { title: 'Body keys', params: extractParamTypes(route.params, 'body') },
          ]

          const routeTitle = getRouteTitle(route)

          const scopes = route.scopes || []
          const scopeMap = scopes.reduce((acc, scopeString) => {
            const [action, scope] = scopeString.split(':')
            if (!acc[scope]) {
              acc[scope] = { read: false, write: false }
            }
            if (action === 'read') {
              acc[scope].read = true
            }
            if (action === 'write') {
              acc[scope].write = true
            }
            return acc
          }, {} as ScopeMap)

          return (
            <React.Fragment key={idx}>
              <Heading id={slugify(routeTitle)} as='h3'>
                {routeTitle}
              </Heading>

              {Object.entries(scopeMap).map(([scope, { read, write }]) => (
                <ScopeBadges key={scope} scope={scope} read={read} write={write} />
              ))}

              <code className={styles.url}>
                <span className={clsx(styles.methodTag, styles[route.method.toLowerCase()])}>
                  {normaliseMethod(route.method)}
                </span>{' '}
                <code>
                  {(siteConfig.customFields.docs as Docs).baseUrl}
                  {route.path}
                </code>
              </code>

              {getRouteDescription(route)}

              {sections
                .filter((section) => {
                  if (normaliseMethod(route.method) === 'GET') {
                    return section.title !== 'Body keys'
                  }
                  return true
                })
                .map((section) => {
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
                        {section.params.length === 0 && (
                          <p className={styles.sectionEmptyText}>None available</p>
                        )}

                        {section.params.length > 0 && (
                          <table>
                            <thead>
                              <tr>
                                <th>Key</th>
                                <th>Required</th>
                                <th>Description</th>
                              </tr>
                            </thead>

                            <tbody>
                              {section.params
                                .sort((a, b) => a.name.localeCompare(b.name))
                                .map((param, idx) => (
                                  <tr key={idx}>
                                    <td className={styles.nameCell}>
                                      <code>{param.name}</code>
                                    </td>
                                    <td className={styles.requiredCell}>
                                      {getParamRequiredText(param.required)}
                                    </td>
                                    <td
                                      className={styles.descriptionCell}
                                      dangerouslySetInnerHTML={{
                                        __html: getParamDescriptionText(param.description),
                                      }}
                                    />
                                  </tr>
                                ))}
                            </tbody>
                          </table>
                        )}
                      </div>
                    </div>
                  )
                })}

              {route.samples?.map((sample) => (
                <Sample key={sample.title} sample={sample} />
              ))}

              <hr />
            </React.Fragment>
          )
        })}
    </>
  )
}
