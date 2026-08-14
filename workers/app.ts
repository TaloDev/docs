import type { ExportedHandler } from '@cloudflare/workers-types'
import { createRequestHandler } from 'react-router'

type Env = {}

const requestHandler = createRequestHandler(
  () => import('virtual:react-router/server-build'),
  import.meta.env.MODE,
)

export default {
  async fetch(request) {
    return requestHandler(request)
  },
} satisfies ExportedHandler<Env>
