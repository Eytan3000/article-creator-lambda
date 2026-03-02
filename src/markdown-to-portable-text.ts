/**
 * Converts markdown string to Sanity Portable Text (block content).
 * Simple implementation: each paragraph (split by double newline) becomes one block.
 */

export interface PortableTextBlock {
  _type: 'block'
  _key: string
  style: 'normal'
  children: Array<{_type: 'span'; _key: string; text: string; marks: string[]}>
  markDefs: unknown[]
}

function key(): string {
  return Math.random().toString(36).slice(2, 10)
}

export function markdownToPortableText(markdown: string): PortableTextBlock[] {
  const paragraphs = markdown.trim().split(/\n\n+/)
  return paragraphs.map((para) => ({
    _type: 'block' as const,
    _key: key(),
    style: 'normal' as const,
    children: [{_type: 'span' as const, _key: key(), text: para.replace(/\n/g, ' '), marks: []}],
    markDefs: [],
  }))
}
