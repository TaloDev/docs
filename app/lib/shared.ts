export const appName = 'Talo'
export const docsRoute = '/'

export const siteOrigin = 'https://docs.trytalo.com'

// Markdown copies of pages live under this prefix, e.g. /llms.mdx/1.x/http/player-api.md
export const markdownRoute = '/llms.mdx'

export const baseApiUrl = import.meta.env.DEV ? 'http://localhost:3000' : 'https://api.trytalo.com'
