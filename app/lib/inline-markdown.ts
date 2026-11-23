const CODE_SPAN = /(`[^`]+`)/

const BOLD = /\*\*([^*]+)\*\*/g

const escapeHtml = (text: string) => {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

// Render the subset of markdown used in API notes: `code` and **bold**.
// Code spans are rendered first so "**" inside them stays literal.
// e.g. 'Send the `x-talo-id` header, **required**' ->
//      'Send the <code>x-talo-id</code> header, <strong>required</strong>'
export function inlineMarkdownToHtml(text: string) {
  return text
    .split(CODE_SPAN)
    .map((part) => {
      if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
        return `<code>${escapeHtml(part.slice(1, -1))}</code>`
      }

      return escapeHtml(part).replace(BOLD, '<strong>$1</strong>')
    })
    .join('')
}
