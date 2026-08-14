import { cn } from 'cnfast'
import { Heading } from 'fumadocs-ui/components/heading'
import type { ServiceRoute } from '@/lib/api-docs'
import { getService, slugify } from '@/lib/api-docs'
import { baseApiUrl } from '@/lib/shared'
import { Samples } from './Sample'
import { ScopeBadges } from './ScopeBadges'

type ScopeMap = {
  [scope: string]: {
    read: boolean
    write: boolean
  }
}

function normaliseMethod(method: string) {
  return method.toUpperCase()
}

const methodColours: Record<string, string> = {
  get: 'bg-green-800',
  post: 'bg-blue-800',
  put: 'bg-fuchsia-800',
  patch: 'bg-amber-700',
  delete: 'bg-red-800',
}

export function ServiceDocumentation({
  service,
  metaDescription,
}: {
  service: string
  metaDescription: string
}) {
  const serviceData = getService(service)

  if (!serviceData) {
    return <div>"{service}" not found</div>
  }

  const { routes } = serviceData

  const getParamRequiredText = (required: boolean) => {
    return (
      <span>
        <span>{required ? '✅' : '❌'}</span> {required ? 'Yes' : 'No'}
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

  const getSortOrder = (method: ServiceRoute['method']) => {
    return ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].indexOf(normaliseMethod(method))
  }

  const getRouteDescription = (route: ServiceRoute) => {
    return (
      route.description?.split('\n').map((part, idx) => {
        if (idx === 0) {
          return null
        }
        return <p key={idx}>{part}</p>
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
      <meta name='description' content={metaDescription} />
      <meta property='og:description' content={metaDescription} />
      {routes
        .sort((a, b) => getSortOrder(a.method) - getSortOrder(b.method))
        .map((route, idx) => {
          const sections = [
            { title: 'Headers', params: extractParamTypes(route.params, 'headers') },
            { title: 'Route params', params: extractParamTypes(route.params, 'route') },
            { title: 'Query params', params: extractParamTypes(route.params, 'query') },
            { title: 'Body params', params: extractParamTypes(route.params, 'body') },
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

          const routeDescription = getRouteDescription(route)
          const hasRouteDescription = routeDescription.filter((line) => !!line).length > 0

          return (
            <div key={idx}>
              <Heading as='h3' id={slugify(routeTitle)}>
                {routeTitle}
              </Heading>

              <div className='rounded-xl border border-fd-border p-4 [&>:last-child]:mb-0 [&>:last-child_table]:mb-0'>
                <div className='inline-block break-all'>
                  <code className='p-2 rounded-lg'>
                    <span
                      className={cn(
                        'mr-3 rounded px-1 py-0.5 text-sm font-bold text-white align-middle',
                        methodColours[route.method.toLowerCase()],
                      )}
                    >
                      {normaliseMethod(route.method)}
                    </span>
                    {baseApiUrl}
                    {route.path}
                  </code>
                </div>

                {scopes.length > 0 && (
                  <>
                    <Heading as='h4' id={slugify(`${routeTitle}-scopes`)}>
                      {scopes.length > 1 ? 'Required scopes' : 'Required scope'}
                    </Heading>
                    {Object.entries(scopeMap).map(([scope, { read, write }]) => (
                      <ScopeBadges key={scope} scope={scope} read={read} write={write} />
                    ))}
                  </>
                )}

                {hasRouteDescription && (
                  <>
                    <Heading as='h4' id={slugify(`${routeTitle}-description`)}>
                      Notes
                    </Heading>
                    {routeDescription}
                  </>
                )}

                {sections
                  .filter((section) => {
                    if (section.params.length === 0) {
                      return false
                    }

                    if (normaliseMethod(route.method) === 'GET') {
                      return section.title !== 'Body keys'
                    }

                    return true
                  })
                  .map((section) => {
                    return (
                      <div key={section.title}>
                        <Heading as='h4' id={slugify(`${routeTitle}-${section.title}`)}>
                          {section.title}
                        </Heading>

                        <table className='mt-0'>
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
                                  <td className='min-w-36'>
                                    <code>{param.name}</code>
                                  </td>
                                  <td className='min-w-36'>
                                    {getParamRequiredText(param.required)}
                                  </td>
                                  <td className='w-full' aria-label={param.description}>
                                    <span
                                      dangerouslySetInnerHTML={{
                                        __html: getParamDescriptionText(param.description),
                                      }}
                                    />
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    )
                  })}

                {route.samples && (
                  <>
                    <Heading as='h4' id={slugify(`${routeTitle}-samples`)}>
                      Samples
                    </Heading>
                    <Samples samples={route.samples} />
                  </>
                )}
              </div>
            </div>
          )
        })}
    </>
  )
}
