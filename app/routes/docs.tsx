import type { TOCItemType } from 'fumadocs-core/toc'
import { useFumadocsLoader } from 'fumadocs-core/source/client'
import { DocsLayout } from 'fumadocs-ui/layouts/docs'
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/layouts/docs/page'
import { use } from 'react'
import { Breadcrumb } from '@/components/breadcrumb'
import { Feedback } from '@/components/feedback/client'
import { useMDXComponents } from '@/components/mdx'
import { onPageFeedback } from '@/lib/feedback'
import { baseOptions } from '@/lib/layout.shared'
import { docs, source } from '@/lib/source'
import type { Route } from './+types/docs'

export async function loader({ params }: Route.LoaderArgs) {
  const slugs = params['*'].split('/').filter((v) => v.length > 0)
  const page = source.getPage(slugs)
  if (!page) {
    throw new Response('Not found', { status: 404 })
  }

  return {
    path: page.path,
    pageTree: await source.serializePageTree(source.getPageTree()),
  }
}

function Content({ path }: { path: string }) {
  const page = docs.getPage(path)
  if (!page) {
    throw new Error(`unknown page: ${path}`)
  }

  const data = use(page.load())
  const Mdx = page.body

  // custom TOC for endpoint headings
  const toc: TOCItemType[] = (data._exports.pageToc as TOCItemType[] | undefined) ?? data.toc

  return (
    <DocsPage
      toc={toc}
      footer={path === 'index.mdx' ? { className: 'mt-8' } : {}}
      slots={{ breadcrumb: Breadcrumb }}
    >
      <title>
        {path === 'index.mdx' ? 'Talo - open source, self-hostable game backend' : page.title}
      </title>
      <meta name='description' content={page.description} />
      <DocsTitle>{page.title}</DocsTitle>
      <DocsDescription>{page.description}</DocsDescription>
      <DocsBody>
        <Mdx components={useMDXComponents()} />
      </DocsBody>
      {path !== 'index.mdx' && (
        <Feedback className='mt-4' key={path} onSendAction={onPageFeedback} />
      )}
    </DocsPage>
  )
}

export default function Page({ loaderData }: Route.ComponentProps) {
  const { path, pageTree } = useFumadocsLoader(loaderData)

  return (
    <DocsLayout {...baseOptions()} tree={pageTree}>
      <Content path={path} />
    </DocsLayout>
  )
}
