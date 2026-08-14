# Talo docs

This website is built using [Fumadocs](https://fumadocs.dev) on [React Router](https://reactrouter.com), a documentation framework that composes into your React framework.

## Installation

```console
pnpm install
```

## Local Development

```console
pnpm dev
```

This command starts a local development server (port 5173). Most changes are reflected live without having to restart the server.

The API documentation routes are fetched from the Talo backend at build time (`https://api.trytalo.com/public/docs`, or `http://localhost:3000` in development) and stored in the gitignored `app/lib/api-docs.json`.

## Build

```console
pnpm build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service (React Router SPA mode with prerendered pages).

## Typecheck

```console
pnpm typecheck
```
