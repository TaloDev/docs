import { loader } from 'fumadocs-core/source'
import { pageSchema } from 'fumadocs-core/source/schema'
import { defineDocs } from 'fumadocs-mdx/macro'
import { z } from 'zod'
import { docsRoute } from './shared'
import { resolveIcon } from './sidebar-icons'

export const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    async: true,
    // `seoTitle` overrides only the SERP <title>; `title` stays the page name
    // used by the sidebar, H1 and search.
    schema: pageSchema.extend({ seoTitle: z.string().optional() }),
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
})

export const source = loader({
  source: docs.toFumadocsSource(),
  baseUrl: docsRoute,
  icon: resolveIcon,
})
