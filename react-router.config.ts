import type { Config } from '@react-router/dev/config'
import { createGetUrl, getSlugs } from 'fumadocs-core/source'
import { glob } from 'node:fs/promises'

const getUrl = createGetUrl('/')

export default {
  ssr: false,
  async prerender({ getStaticPaths }) {
    const paths: string[] = []

    for (const path of getStaticPaths()) {
      // `/` navigates to the default version via the client component
      if (path !== '/') {
        paths.push(path)
      }
    }

    for await (const entry of glob('**/*.mdx', { cwd: 'content/docs' })) {
      const slugs = getSlugs(entry)
      paths.push(getUrl(slugs))
    }

    return paths
  },
} satisfies Config
