import { cloudflare } from '@cloudflare/vite-plugin'
import { reactRouter } from '@react-router/dev/vite'
import tailwindcss from '@tailwindcss/vite'
import { fumadocsMdx } from 'fumadocs-mdx/vite'
import { mkdir, writeFile } from 'node:fs/promises'
import { codeToHtml } from 'shiki'
import { defineConfig, type Plugin } from 'vite'
import type { TaloService } from './app/lib/api-docs.ts'

// Pre-render sample payloads as highlighted JSON so the client renders them
// synchronously (avoids async highlighting + hydration flicker).
async function highlightSamples(services: TaloService[]) {
  for (const service of services) {
    for (const route of service.routes ?? []) {
      for (const sample of route.samples ?? []) {
        sample.html = await codeToHtml(JSON.stringify(sample.sample, null, 2), {
          lang: 'json',
          themes: { light: 'github-light', dark: 'github-dark' },
          defaultColor: false,
        })
      }
    }
  }
}

// Fetch the live API route definitions from the Talo backend at build time and
// store them next to the app code, so `<ServiceDocumentation />` can render them.
function taloApiDocs(): Plugin {
  let started = false

  return {
    name: 'talo-api-docs',
    async buildStart() {
      if (started) {
        return
      }

      started = true

      const baseUrl =
        process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://api.trytalo.com'

      let services: TaloService[] = []
      try {
        const res = await fetch(`${baseUrl}/public/docs`)
        const data = await res.json()
        services = data.docs.services
        await highlightSamples(services)
      } catch (err) {
        console.error('Failed to fetch API docs:', (err as Error).message)
      }

      await mkdir('app/lib', { recursive: true })
      await writeFile('app/lib/api-docs.json', JSON.stringify(services, null, 2))
    },
  }
}

export default defineConfig({
  plugins: [
    fumadocsMdx({
      globalOptions: {
        mdxOptions: {
          preset: 'fumadocs',
          // Keep `/img/*` images as plain URLs served from `public/` (Vite
          // forbids importing assets inside the `public` directory).
          remarkImageOptions: { useImport: false },
        },
      },
    }),
    tailwindcss(),
    reactRouter(),
    taloApiDocs(),
    cloudflare({
      viteEnvironment: {
        name: 'ssr',
      },
    }),
  ],
  resolve: {
    alias: {
      '@': '/app',
    },
    tsconfigPaths: true,
  },
})
