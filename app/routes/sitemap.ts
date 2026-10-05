import { siteOrigin } from '@/lib/shared'
import { source } from '@/lib/source'

export function loader() {
  const urls = source.getPages().map((page) => `<url><loc>${siteOrigin}${page.url}</loc></url>`)
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`

  return new Response(body, {
    headers: { 'content-type': 'application/xml; charset=utf-8' },
  })
}
