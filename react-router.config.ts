import type { Config } from '@react-router/dev/config'
import { createGetUrl, getSlugs } from 'fumadocs-core/source'
import { glob } from 'node:fs/promises'
import { markdownRoute } from './app/lib/shared'

const getUrl = createGetUrl('/')

const MARKDOWN_EXTENSION = '.md'

export default {
  ssr: false,
  async prerender({ getStaticPaths }) {
    const paths: string[] = []

    for (const path of getStaticPaths()) {
      if (path !== '/') {
        paths.push(path)
      }
    }

    for await (const entry of glob('**/*.mdx', { cwd: 'content/docs' })) {
      const slugs = getSlugs(entry)
      const url = getUrl(slugs)
      paths.push(url)
      paths.push(`${markdownRoute}${url}${MARKDOWN_EXTENSION}`)
    }

    paths.push('/sitemap.xml')

    return paths
  },
} satisfies Config
