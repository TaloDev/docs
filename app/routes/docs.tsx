import type { TOCItemType } from 'fumadocs-core/toc'
import { useFumadocsLoader } from 'fumadocs-core/source/client'
import { DocsLayout } from 'fumadocs-ui/layouts/docs'
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/layouts/docs/page'
import { use } from 'react'
import { redirect } from 'react-router'
import { Breadcrumb } from '@/components/breadcrumb'
import { Feedback } from '@/components/feedback/client'
import { useMDXComponents } from '@/components/mdx'
import { onPageFeedback } from '@/lib/feedback'
import { baseOptions } from '@/lib/layout.shared'
import { docs, source } from '@/lib/source'
import type { Route } from './+types/docs'

// Pre-versioning paths (e.g. /docs/godot/install) redirect to the default version.
const DEFAULT_VERSION = '1.x'
const LEGACY_SECTIONS = ['godot', 'unity', 'http', 'sockets', 'selfhosting', 'integrations']
const VERSION_REDIRECTS: Record<string, string> = {
  '1.0': '1.x',
  '0.49': 'pre-1.0',
  '0.60': 'pre-1.0',
}

export async function loader({ params }: Route.LoaderArgs) {
  const slugs = params['*'].split('/').filter((v) => v.length > 0)
  const page = source.getPage(slugs)
  if (!page) {
    const first = slugs[0] ?? ''
    if (LEGACY_SECTIONS.includes(first)) {
      throw redirect(`/docs/${DEFAULT_VERSION}/${slugs.join('/')}`)
    }
    if (VERSION_REDIRECTS[first]) {
      throw redirect(`/docs/${VERSION_REDIRECTS[first]}/${slugs.slice(1).join('/')}`)
    }
    throw new Response('Not found', { status: 404 })
  }
  // Default the docs root to the default version.
  if (slugs.length === 0) {
    throw redirect(`/docs/${DEFAULT_VERSION}`)
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
