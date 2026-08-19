import type { BreadcrumbItem } from 'fumadocs-core/breadcrumb'
import type { BreadcrumbProps } from 'fumadocs-ui/layouts/docs/page/slots/breadcrumb'
import { cn } from 'cnfast'
import Link from 'fumadocs-core/link'
import { useTreeContext, useTreePath } from 'fumadocs-ui/contexts/tree'
import { ChevronRight } from 'lucide-react'
import { Fragment, useMemo, type ReactNode } from 'react'

export function Breadcrumb({
  includeRoot,
  includeSeparator,
  includePage,
  ...props
}: BreadcrumbProps) {
  const path = useTreePath()
  const { root } = useTreeContext()

  const items = useMemo(() => {
    const items: (BreadcrumbItem & { icon?: ReactNode })[] = []

    for (let i = 0; i < path.length; i++) {
      const item = path[i]
      switch (item.type) {
        case 'page':
          if (includePage) {
            items.push({ name: item.name, url: item.url, icon: item.icon })
          }
          break
        case 'folder':
          if (item.root) {
            items.length = 0
            if (includeRoot) {
              items.push({
                name: root.name,
                url: typeof includeRoot === 'object' ? includeRoot.url : item.index?.url,
                icon: item.icon,
              })
            }
            break
          }
          if (i === path.length - 1 || item.index !== path[i + 1]) {
            items.push({ name: item.name, url: item.index?.url, icon: item.icon })
          }
          break
        case 'separator':
          if (item.name && includeSeparator) {
            items.push({ name: item.name })
          }
          break
      }
    }

    return items
  }, [path, includePage, includeRoot, includeSeparator, root])

  if (items.length === 0) {
    return null
  }

  return (
    <div
      {...props}
      className={cn('flex items-center gap-1.5 text-sm text-fd-muted-foreground', props.className)}
    >
      {items.map((item, i) => {
        const className = cn('truncate', i === items.length - 1 && 'text-fd-primary font-medium')
        const content = (
          <span className='inline-flex items-center gap-1.5 [&_svg]:size-4'>
            {item.icon}
            {item.name}
          </span>
        )

        return (
          <Fragment key={i}>
            {i !== 0 && <ChevronRight className='size-3.5 shrink-0' />}
            {item.url ? (
              <Link
                href={item.url}
                className={cn(className, 'transition-opacity hover:opacity-80')}
              >
                {content}
              </Link>
            ) : (
              <span className={className}>{content}</span>
            )}
          </Fragment>
        )
      })}
    </div>
  )
}
