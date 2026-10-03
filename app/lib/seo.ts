const homepageTitle = 'Talo - open source, self-hostable game backend'

type PageTitles = { title: string; seoTitle?: string }

export function docTitle(page: PageTitles, isIndex: boolean): string {
  if (isIndex) {
    return homepageTitle
  }

  return `${page.seoTitle ?? page.title} | Talo docs`
}
