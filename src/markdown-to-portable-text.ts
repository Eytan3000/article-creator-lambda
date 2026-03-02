/**
 * Converts markdown string to Sanity Portable Text (block content).
 * Parses headings, code blocks, blockquotes, and paragraphs; supports inline links, bold, italic, and code.
 */

export type BlockStyle = 'h1' | 'h2' | 'h3' | 'h4' | 'normal' | 'blockquote';

export interface PortableTextSpan {
  _type: 'span';
  _key: string;
  text: string;
  marks: string[];
}

export interface PortableTextLinkDef {
  _type: 'link';
  _key: string;
  href: string;
}

export interface PortableTextBlock {
  _type: 'block';
  _key: string;
  style: BlockStyle;
  children: PortableTextSpan[];
  markDefs: PortableTextLinkDef[];
}

function key(): string {
  return Math.random().toString(36).slice(2, 10);
}

/** Parses inline markdown (bold, italic, code, link) into spans and markDefs */
function parseInline(
  text: string,
  linkDefs: PortableTextLinkDef[]
): { children: PortableTextSpan[]; markDefs: PortableTextLinkDef[] } {
  const children: PortableTextSpan[] = [];
  const regex =
    /(\*\*([^*]+)\*\*|__([^_]+)__|\*([^*]+)\*|_([^_]+)_|`([^`]+)`|\[([^\]]+)\]\(([^)]+)\))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    const [full, , bold1, bold2, em1, em2, code, linkText, href] = match;
    if (match.index > lastIndex) {
      const plain = text.slice(lastIndex, match.index);
      if (plain) {
        children.push({ _type: 'span', _key: key(), text: plain, marks: [] });
      }
    }
    if (bold1 !== undefined || bold2 !== undefined) {
      children.push({
        _type: 'span',
        _key: key(),
        text: bold1 ?? bold2 ?? '',
        marks: ['strong'],
      });
    } else if (em1 !== undefined || em2 !== undefined) {
      children.push({
        _type: 'span',
        _key: key(),
        text: em1 ?? em2 ?? '',
        marks: ['em'],
      });
    } else if (code !== undefined) {
      children.push({
        _type: 'span',
        _key: key(),
        text: code,
        marks: ['code'],
      });
    } else if (linkText !== undefined && href !== undefined) {
      const linkKey = key();
      linkDefs.push({ _type: 'link', _key: linkKey, href });
      children.push({
        _type: 'span',
        _key: key(),
        text: linkText,
        marks: [linkKey],
      });
    }
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) {
    const plain = text.slice(lastIndex);
    if (plain) {
      children.push({ _type: 'span', _key: key(), text: plain, marks: [] });
    }
  }
  if (children.length === 0 && text) {
    children.push({ _type: 'span', _key: key(), text, marks: [] });
  }
  return { children, markDefs: linkDefs };
}

/** Classify and split markdown into block descriptors */
function splitBlocks(
  markdown: string
): Array<{ style: BlockStyle; content: string; preserveNewlines?: boolean }> {
  const blocks: Array<{ style: BlockStyle; content: string; preserveNewlines?: boolean }> = [];
  const lines = markdown.split(/\n/);
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed.startsWith('```')) {
      const codeLines: string[] = [];
      i += 1;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i += 1;
      }
      if (i < lines.length) i += 1;
      const codeContent = codeLines.join('\n');
      blocks.push({
        style: 'normal',
        content: codeContent,
        preserveNewlines: true,
      });
      continue;
    }

    if (/^#{1,4}\s/.test(trimmed)) {
      const level = (trimmed.match(/^(#+)/)?.[1].length ?? 1) as 1 | 2 | 3 | 4;
      const content = trimmed.replace(/^#+\s*/, '');
      blocks.push({
        style: (`h${level}` as BlockStyle),
        content,
      });
      i += 1;
      continue;
    }

    if (trimmed.startsWith('> ')) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('> ')) {
        quoteLines.push(lines[i].replace(/^>\s?/, ''));
        i += 1;
      }
      blocks.push({ style: 'blockquote', content: quoteLines.join('\n') });
      continue;
    }

    if (trimmed === '') {
      i += 1;
      continue;
    }

    const paraLines: string[] = [trimmed];
    i += 1;
    while (i < lines.length && lines[i].trim() !== '' && !lines[i].trim().startsWith('```') && !/^#{1,4}\s/.test(lines[i].trim()) && !lines[i].trim().startsWith('> ')) {
      paraLines.push(lines[i]);
      i += 1;
    }
    blocks.push({ style: 'normal', content: paraLines.join('\n') });
  }

  return blocks;
}

export function markdownToPortableText(markdown: string): PortableTextBlock[] {
  const rawBlocks = splitBlocks(markdown.trim());
  return rawBlocks.map(({ style, content, preserveNewlines }) => {
    if (preserveNewlines) {
      return {
        _type: 'block',
        _key: key(),
        style,
        children: [{ _type: 'span', _key: key(), text: content || ' ', marks: [] }],
        markDefs: [],
      };
    }
    const linkDefs: PortableTextLinkDef[] = [];
    const { children, markDefs } = parseInline(content.replace(/\n/g, ' '), linkDefs);
    return {
      _type: 'block',
      _key: key(),
      style,
      children: children.length > 0 ? children : [{ _type: 'span', _key: key(), text: content.replace(/\n/g, ' ') || ' ', marks: [] }],
      markDefs,
    };
  });
}
