import type { MDXComponents } from 'mdx/types'
import defaultMdxComponents from 'fumadocs-ui/mdx'
import { Image } from '@/components/image'

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    img: Image,
    ...components,
  } satisfies MDXComponents
}

export const useMDXComponents = getMDXComponents

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>
}
