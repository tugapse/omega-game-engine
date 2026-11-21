/** An element of a parsed XML document. */
export interface XmlElement {
  tag: string;
  attrs: Record<string, string>;
  children: XmlElement[];
  /** The element's own text (not its children's), entities decoded. */
  text: string;
}

const ENTITIES: Record<string, string> = { lt: '<', gt: '>', amp: '&', quot: '"', apos: "'" };

function decode(s: string): string {
  if (s.indexOf('&') < 0) return s;
  return s.replace(/&(#x[0-9a-f]+|#\d+|\w+);/gi, (m, e: string) => {
    if (e[0] === '#') return String.fromCodePoint(e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10));
    return ENTITIES[e] ?? m;
  });
}

/**
 * A small, forgiving XML parser: elements, attributes, text, comments,
 * CDATA, processing instructions. Enough for COLLADA files, with no DOM
 * needed (works the same in the browser and in Node tests).
 */
export function parseXml(source: string): XmlElement {
  const root: XmlElement = { tag: '#document', attrs: {}, children: [], text: '' };
  const stack: XmlElement[] = [root];
  const texts: string[][] = [[]];
  const n = source.length;
  let i = 0;
  const closeTop = () => {
    const el = stack.pop()!;
    el.text = decode(texts.pop()!.join(''));
  };
  while (i < n) {
    const lt = source.indexOf('<', i);
    if (lt < 0) { texts[texts.length - 1].push(source.slice(i)); break; }
    if (lt > i) texts[texts.length - 1].push(source.slice(i, lt));
    if (source.startsWith('<!--', lt)) { const e = source.indexOf('-->', lt + 4); i = e < 0 ? n : e + 3; continue; }
    if (source.startsWith('<![CDATA[', lt)) {
      const e = source.indexOf(']]>', lt + 9);
      texts[texts.length - 1].push(source.slice(lt + 9, e < 0 ? n : e));
      i = e < 0 ? n : e + 3;
      continue;
    }
    if (source[lt + 1] === '?' || source[lt + 1] === '!') { const e = source.indexOf('>', lt); i = e < 0 ? n : e + 1; continue; }
    const gt = findTagEnd(source, lt);
    if (source[lt + 1] === '/') {
      const tag = source.slice(lt + 2, gt).trim();
      // Close up to the matching element (tolerates unclosed children).
      while (stack.length > 1) {
        const top = stack[stack.length - 1];
        closeTop();
        if (top.tag === tag) break;
      }
      i = gt + 1;
      continue;
    }
    const selfClosing = source[gt - 1] === '/';
    const body = source.slice(lt + 1, selfClosing ? gt - 1 : gt);
    const nameMatch = /^\s*([^\s/>]+)/.exec(body);
    const el: XmlElement = { tag: nameMatch ? nameMatch[1] : '', attrs: {}, children: [], text: '' };
    const attrRe = /([^\s=]+)\s*=\s*("([^"]*)"|'([^']*)')/g;
    const rest = body.slice(nameMatch ? nameMatch[0].length : 0);
    for (let m = attrRe.exec(rest); m; m = attrRe.exec(rest)) el.attrs[m[1]] = decode(m[3] ?? m[4] ?? '');
    stack[stack.length - 1].children.push(el);
    if (!selfClosing) { stack.push(el); texts.push([]); }
    i = gt + 1;
  }
  while (stack.length > 1) closeTop();
  return root;
}

/** The `>` that ends the tag starting at `lt`, skipping `>` inside quoted attributes. */
function findTagEnd(s: string, lt: number): number {
  let quote = '';
  for (let j = lt + 1; j < s.length; j++) {
    const c = s[j];
    if (quote) { if (c === quote) quote = ''; }
    else if (c === '"' || c === "'") quote = c;
    else if (c === '>') return j;
  }
  return s.length - 1;
}

/** The first child element called `tag`. */
export function xmlChild(el: XmlElement | undefined, tag: string): XmlElement | undefined {
  return el?.children.find((c) => c.tag === tag);
}

/** The child elements called `tag`. */
export function xmlChildren(el: XmlElement | undefined, tag: string): XmlElement[] {
  return el ? el.children.filter((c) => c.tag === tag) : [];
}

/** Every descendant element called `tag`, depth first. */
export function xmlDescendants(el: XmlElement | undefined, tag: string, out: XmlElement[] = []): XmlElement[] {
  for (const c of el?.children ?? []) {
    if (c.tag === tag) out.push(c);
    xmlDescendants(c, tag, out);
  }
  return out;
}
