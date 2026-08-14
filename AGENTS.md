# AGENTS.md

## Project Overview

This is the **Talo documentation website**, built with **Fumadocs** on **React Router** (SPA mode with prerendering). Talo is an open-source game backend that provides features like player management, event tracking, leaderboards, game saves, stats, and feedback for Godot and Unity games.

The documentation is organized into several main sections:

- **Unity**: Unity package documentation (`content/docs/unity/`)
- **Godot**: Godot plugin documentation (`content/docs/godot/`)
- **HTTP API**: REST API reference documentation (`content/docs/http/`)
- **Sockets**: WebSocket API documentation (`content/docs/sockets/`)
- **Self-hosting**: Self-hosting guides (`content/docs/selfhosting/`)
- **Integrations**: Third-party integrations like Steamworks (`content/docs/integrations/`)

## Development Commands

**Start development server:**

```bash
pnpm dev
```

This starts a local development server on port 5173 with live reload.

**Build for production:**

```bash
pnpm build
```

Generates static content in the `build/` directory (React Router SPA mode with all docs pages prerendered to static HTML).

**Typecheck:**

```bash
pnpm typecheck
```

**Lint / format:**

```bash
pnpm lint
pnpm fmt
```

## Architecture

### Framework

- **React Router SPA** (`react-router.config.ts`: `ssr: false`) with prerendering of all `content/docs/**` pages into static HTML.
- **Vite** (`vite.config.ts`) with the `fumadocs-mdx` and `tailwindcss` plugins.
- **Fumadocs UI** layouts: `DocsLayout`/`DocsPage` for docs, `HomeLayout` for the homepage and 404.
- Routes are declared in `app/routes.ts`: `routes/home.tsx` (`/`), `routes/docs.tsx` (`/docs/*`), `routes/search.ts` (`/api/search`), `routes/not-found.tsx`.

### Content Source

Content lives in `content/docs/` as MDX files processed by **Fumadocs MDX**:

- `app/lib/source.ts`: `defineDocs()` + `loader()` build the content source and page tree.
- **`meta.json`** files control the sidebar order and folder labels (one per folder).
- Page **frontmatter** uses `title` and `description`; the H1 heading inside the page is optional.
- Fumadocs' default MDX components include `<Callout>` (use `<Callout type="warn">` etc. instead of Docusaurus `:::` admonitions) and syntax-highlighted code blocks via Rehype Code.
- `remarkImage` is configured with `useImport: false` (`vite.config.ts`) so `/img/*` images are served as plain URLs from `public/`.

### Dynamic API Documentation

The HTTP API documentation (`docs/http/*.mdx`) uses a unique architecture that fetches live API route definitions from the Talo backend:

1. **`vite.config.ts`**: The `taloApiDocs()` plugin fetches route metadata from `https://api.trytalo.com/public/docs` (or `http://localhost:3000` in development) at build/dev time and writes it to the gitignored `app/lib/api-docs.json`.

2. **`app/lib/api-docs.ts`**: Imports that JSON and exposes the `ServiceRoute`/`TaloService` types, `getService()`, `slugify()`, and `generateServiceTOC()`.

3. **`app/components/documentation/ServiceDocumentation.tsx`**: React component that renders API routes as interactive documentation (scope badges, method tags, param tables, code samples).

4. **MDX Files** (`content/docs/http/*.mdx`): Use the `<ServiceDocumentation service='ServiceName' />` component to render live API docs. They also `export const pageToc` (built from `generateServiceTOC()`) which `app/routes/docs.tsx` merges into the page TOC, since endpoint headings are rendered at runtime and unknown to the build-time TOC.

The benefit of this architecture is that API documentation automatically stays in sync with the backend code, as route definitions are pulled directly from the running API.

## Documentation Conventions

- Use frontmatter for page metadata:

  ```yaml
  ---
  title: Page title
  description: Page description for SEO
  ---
  ```

- Cross-reference other docs using absolute paths: `/docs/unity/install`
- Include code samples in fenced code blocks with language identifiers (e.g., ` ```csharp `, ` ```gdscript `, ` ```bash `)
- Content under `content/` and `public/` is excluded from oxfmt formatting (`.oxfmtrc.json`)
