# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the **Talo documentation website**, built with Docusaurus. Talo is an open-source game backend that provides features like player management, event tracking, leaderboards, game saves, stats, and feedback for Godot and Unity games.

The documentation is organized into several main sections:

- **Unity**: Unity package documentation (`docs/unity/`)
- **Godot**: Godot plugin documentation (`docs/godot/`)
- **HTTP API**: REST API reference documentation (`docs/http/`)
- **Sockets**: WebSocket API documentation (`docs/sockets/`)
- **Self-hosting**: Self-hosting guides (`docs/selfhosting/`)
- **Integrations**: Third-party integrations like Steamworks (`docs/integrations/`)

## Development Commands

**Start development server:**

```bash
npm start
```

This starts a local development server on port 3009 with live reload.

**Build for production:**

```bash
npm run build
```

Generates static content in the `build/` directory.

**Clear cache:**

```bash
npm clear
```

Clears the Docusaurus cache (useful when experiencing build issues).

**Serve production build locally:**

```bash
npm run serve
```

## Architecture

### Dynamic API Documentation

The HTTP API documentation uses a unique architecture that fetches live API route definitions from the Talo backend:

1. **`docusaurus.config.ts`**: During build/start, fetches API route metadata from `https://api.trytalo.com/public/docs` (or `http://localhost:3000` in development) and stores it in `customFields.docs.services`

2. **Service Documentation Components** (`src/components/documentation/`):
   - `ServiceDocumentation.tsx`: React component that renders API routes from the fetched metadata as interactive documentation
   - `generateServiceTOC.ts`: Generates table of contents from service routes
   - `useServiceDocs.ts`: Hook to access service data from Docusaurus context
   - `Sample.tsx`: Renders code samples for API endpoints

3. **MDX Files** (`docs/http/*.mdx`): Use the `<ServiceDocumentation service='ServiceName' />` component to render live API docs. Examples: `event-api.mdx`, `game-channel-api.mdx`, etc.

The benefit of this architecture is that API documentation automatically stays in sync with the backend code, as route definitions are pulled directly from the running API.

### Content Organization

- **Markdown files** (`docs/**/*.md`): Standard documentation pages written in Markdown
- **MDX files** (`docs/**/*.mdx`): Documentation pages that use React components (primarily for API docs)
- **Sidebars** (`sidebars.ts`): Uses Docusaurus auto-generated sidebars from the directory structure
- **Static assets** (`static/`): Images and other static files referenced in docs

### Node Version

This project requires **Node.js 20.x** (specified in `package.json` engines field).

## Documentation Conventions

- Use frontmatter for page metadata:

  ```yaml
  ---
  sidebar_position: 1
  description: Page description for SEO
  ---
  ```

- Cross-reference other docs using relative paths: `/docs/unity/install`

- Include code samples in fenced code blocks with language identifiers (e.g., ` ```csharp `, ` ```gdscript `, ` ```bash `)

- The site supports C# and GDScript syntax highlighting via Prism (configured in `docusaurus.config.ts`)

## Important Notes

- The site uses **dark mode only** (disabled color mode switching in theme config)
- Algolia search is configured for the documentation
- Analytics tracking via Plausible is configured in the scripts section
- Edit links point to the GitHub repository: `https://github.com/TaloDev/docs/edit/main/`
