import { RootProvider } from 'fumadocs-ui/provider/react-router'
import { isRouteErrorResponse, Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router'
import SearchDialog from '@/components/search'
import './app.css'
import type { Route } from './+types/root'
import NotFound from './routes/not-found'

export const links: Route.LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
  },
]

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <meta property='og:image' content='https://trytalo.com/opengraph.png' />
        <meta name='twitter:image' content='https://trytalo.com/opengraph.png' />
        <link rel='icon' type='image/x-icon' href='/img/favicon.ico' />
        <Meta />
        <Links />
        <script
          defer
          data-domain='docs.trytalo.com'
          src='https://p.trytalo.com/js/script.outbound-links.js'
        />
      </head>
      <body className='flex flex-col min-h-screen'>
        <RootProvider
          search={{ SearchDialog }}
          theme={{ defaultTheme: 'dark', enableSystem: false, forcedTheme: 'dark' }}
        >
          {children}
        </RootProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  return <Outlet />
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = 'Oops!'
  let details = 'An unexpected error occurred.'
  let stack: string | undefined

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      return <NotFound />
    }
    message = 'Error'
    details = error.statusText
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message
    stack = error.stack
  }

  return (
    <main className='pt-16 p-4 w-full max-w-350 mx-auto'>
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className='w-full p-4 overflow-x-auto'>
          <code>{stack}</code>
        </pre>
      )}
    </main>
  )
}
