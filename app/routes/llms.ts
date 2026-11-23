import { source } from '@/lib/source'
import type { Route } from './+types/llms'

const EXTENSION = /\.md$/

// Agents ask for these files, and the Worker rewrites `Accept: text/markdown`
// requests onto them (see workers/app.ts).
export async function loader({ params }: Route.LoaderArgs) {
  const url = `/${params['*'].replace(EXTENSION, '')}`
  const page = source.getPages().find((candidate) => candidate.url === url)
  if (!page) {
    throw new Response('Not found', { status: 404 })
  }

  const body = await page.data.getText('processed')

  return new Response(`# ${page.data.title}\n\n${body}`, {
    headers: { 'content-type': 'text/markdown; charset=utf-8' },
  })
}
