/**
 * A node of a binary FBX file: a name, a list of properties and child nodes.
 *
 * Array properties are typed arrays; 64-bit integers are read as numbers
 * (FBX ids and times fit in a double); `R` (raw) properties are Uint8Arrays.
 */
export interface FbxNode {
  name: string;
  props: FbxProp[];
  children: FbxNode[];
}

export type FbxProp =
  | number
  | boolean
  | string
  | Uint8Array
  | Int32Array
  | Float32Array
  | Float64Array
  | boolean[];

const MAGIC = 'Kaydara FBX Binary  ';

/** The FBX version of a file (7400 for 7.4), or null when it is not binary FBX. */
export function fbxVersion(buffer: ArrayBuffer): number | null {
  if (buffer.byteLength < 27) return null;
  const head = new TextDecoder('ascii').decode(new Uint8Array(buffer, 0, MAGIC.length));
  if (head !== MAGIC) return null;
  return new DataView(buffer).getUint32(23, true);
}

/** Compressed arrays found while reading, inflated in one go afterwards. */
interface PendingArray {
  props: FbxProp[];
  index: number;
  type: string;
  length: number;
  bytes: Uint8Array;
}

/** Whether the bytes are an FBX file, binary or ASCII. */
export function isFbx(buffer: ArrayBuffer): boolean {
  return fbxVersion(buffer) !== null || isAsciiFbx(buffer);
}

function isAsciiFbx(buffer: ArrayBuffer): boolean {
  const head = new TextDecoder('utf-8').decode(new Uint8Array(buffer, 0, Math.min(buffer.byteLength, 1024)));
  return /^\s*;\s*FBX\s/.test(head) || head.includes('FBXHeaderExtension:');
}

/**
 * Reads an FBX file (version 7.x, binary or ASCII) into its node tree. Both
 * give the same tree, so the converter does not care which it was.
 *
 * Binary arrays compressed with zlib are inflated with `DecompressionStream`,
 * which the browser and Node 18+ provide, hence the Promise.
 */
export async function readFbx(buffer: ArrayBuffer): Promise<{ version: number; nodes: FbxNode[] }> {
  if (fbxVersion(buffer) === null && isAsciiFbx(buffer)) return readAsciiFbx(new TextDecoder('utf-8').decode(buffer));
  const version = fbxVersion(buffer);
  if (version === null) throw new Error('Not an FBX file.');
  if (version < 7000) {
    throw new Error(`FBX ${version / 1000} is not supported: export as FBX 7.x binary (Mixamo: "FBX Binary").`);
  }
  const reader = new Reader(buffer, version >= 7500);
  const nodes = reader.readNodes(27, buffer.byteLength);
  await Promise.all(reader.pending.map(inflateInto));
  return { version, nodes };
}

class Reader {
  private readonly view: DataView;
  private readonly bytes: Uint8Array;
  private readonly text = new TextDecoder('utf-8');
  readonly pending: PendingArray[] = [];

  constructor(buffer: ArrayBuffer, private readonly wide: boolean) {
    this.view = new DataView(buffer);
    this.bytes = new Uint8Array(buffer);
  }

  readNodes(start: number, end: number): FbxNode[] {
    const nodes: FbxNode[] = [];
    let p = start;
    const headerSize = this.wide ? 25 : 13;
    while (p + headerSize <= end) {
      const endOffset = this.wide ? Number(this.view.getBigUint64(p, true)) : this.view.getUint32(p, true);
      const propCount = this.wide ? Number(this.view.getBigUint64(p + 8, true)) : this.view.getUint32(p + 4, true);
      const propBytes = this.wide ? Number(this.view.getBigUint64(p + 16, true)) : this.view.getUint32(p + 8, true);
      const nameLength = this.bytes[p + headerSize - 1];
      if (endOffset === 0) break; // the null record that closes a list
      const nameStart = p + headerSize;
      const name = this.text.decode(this.bytes.subarray(nameStart, nameStart + nameLength));
      const propsStart = nameStart + nameLength;
      const props = this.readProps(propsStart, propCount);
      const childrenStart = propsStart + propBytes;
      const children = childrenStart < endOffset ? this.readNodes(childrenStart, endOffset) : [];
      nodes.push({ name, props, children });
      p = endOffset;
    }
    return nodes;
  }

  private readProps(start: number, count: number): FbxProp[] {
    const props: FbxProp[] = [];
    const v = this.view;
    let p = start;
    for (let i = 0; i < count; i++) {
      const type = String.fromCharCode(this.bytes[p++]);
      switch (type) {
        case 'Y': props.push(v.getInt16(p, true)); p += 2; break;
        case 'C': props.push(this.bytes[p] !== 0); p += 1; break;
        case 'I': props.push(v.getInt32(p, true)); p += 4; break;
        case 'F': props.push(v.getFloat32(p, true)); p += 4; break;
        case 'D': props.push(v.getFloat64(p, true)); p += 8; break;
        case 'L': props.push(Number(v.getBigInt64(p, true))); p += 8; break;
        case 'S':
        case 'R': {
          const length = v.getUint32(p, true);
          const data = this.bytes.subarray(p + 4, p + 4 + length);
          props.push(type === 'S' ? this.text.decode(data) : data.slice());
          p += 4 + length;
          break;
        }
        case 'f': case 'd': case 'l': case 'i': case 'b': {
          const length = v.getUint32(p, true);
          const encoding = v.getUint32(p + 4, true);
          const byteLength = v.getUint32(p + 8, true);
          const data = this.bytes.subarray(p + 12, p + 12 + byteLength);
          p += 12 + byteLength;
          if (encoding === 1) {
            props.push(new Uint8Array(0)); // filled by inflateInto
            this.pending.push({ props, index: props.length - 1, type, length, bytes: data.slice() });
          } else {
            props.push(decodeArray(type, data.slice(), length));
          }
          break;
        }
        default:
          throw new Error(`Unknown FBX property type '${type}' at byte ${p - 1}.`);
      }
    }
    return props;
  }
}

async function inflateInto(item: PendingArray): Promise<void> {
  const stream = new Blob([item.bytes as BlobPart]).stream().pipeThrough(new DecompressionStream('deflate'));
  const raw = new Uint8Array(await new Response(stream).arrayBuffer());
  item.props[item.index] = decodeArray(item.type, raw, item.length);
}

/** Copies the bytes into an aligned typed array of the property's type. */
function decodeArray(type: string, data: Uint8Array, length: number): FbxProp {
  const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
  switch (type) {
    case 'f': { const a = new Float32Array(length); for (let i = 0; i < length; i++) a[i] = view.getFloat32(i * 4, true); return a; }
    case 'd': { const a = new Float64Array(length); for (let i = 0; i < length; i++) a[i] = view.getFloat64(i * 8, true); return a; }
    case 'i': { const a = new Int32Array(length); for (let i = 0; i < length; i++) a[i] = view.getInt32(i * 4, true); return a; }
    // int64 arrays hold FBX times and ids: doubles keep them exact.
    case 'l': { const a = new Float64Array(length); for (let i = 0; i < length; i++) a[i] = Number(view.getBigInt64(i * 8, true)); return a; }
    case 'b': { const a: boolean[] = []; for (let i = 0; i < length; i++) a.push(data[i] !== 0); return a; }
  }
  throw new Error(`Unknown FBX array type '${type}'.`);
}

/** The first child called `name`. */
export function fbxChild(node: FbxNode | undefined, name: string): FbxNode | undefined {
  return node?.children.find((c) => c.name === name);
}

/** The first property of child `name` (e.g. a node's `Vertices` array). */
export function fbxValue<T extends FbxProp>(node: FbxNode | undefined, name: string): T | undefined {
  return fbxChild(node, name)?.props[0] as T | undefined;
}

// --- ASCII FBX ------------------------------------------------------------------

/** Arrays read as Int32Array (indices); every other array is Float64Array. */
const INT_ARRAYS = /(Index|Indexes|Indices)$/;

/**
 * Reads an ASCII FBX file (7.x) into the same node tree as the binary reader:
 * `Name: value, value { children }`, arrays as `*N { a: 1,2,3 }`, `;` comments.
 * Embedded files (`Content`) are base64 strings and become bytes.
 */
export function readAsciiFbx(text: string): { version: number; nodes: FbxNode[] } {
  const tokens = new AsciiTokens(text);
  const nodes = parseAsciiNodes(tokens, false);
  const header = nodes.find((n) => n.name === 'FBXHeaderExtension');
  const version = Number(fbxValue(header, 'FBXVersion') ?? 7000);
  if (version < 7000) {
    throw new Error(`FBX ${version / 1000} is not supported: export as FBX 7.x (Mixamo: "FBX Binary").`);
  }
  return { version, nodes };
}

type AsciiToken = { kind: 'key' | 'string' | 'number' | 'word' | 'count' | '{' | '}' | ','; value: string };

class AsciiTokens {
  private i = 0;
  private peeked: AsciiToken | null = null;
  constructor(private readonly s: string) {}

  peek(): AsciiToken | null {
    if (!this.peeked) this.peeked = this.read();
    return this.peeked;
  }

  next(): AsciiToken | null {
    const t = this.peek();
    this.peeked = null;
    return t;
  }

  private read(): AsciiToken | null {
    const s = this.s;
    for (;;) {
      while (this.i < s.length && s.charCodeAt(this.i) <= 32) this.i++;
      if (this.i >= s.length) return null;
      if (s[this.i] !== ';') break;
      while (this.i < s.length && s[this.i] !== '\n') this.i++; // comment
    }
    const c = s[this.i];
    if (c === '{' || c === '}' || c === ',') { this.i++; return { kind: c, value: c }; }
    if (c === '"') {
      const end = s.indexOf('"', this.i + 1);
      const value = s.slice(this.i + 1, end < 0 ? s.length : end).replace(/&quot;/g, '"');
      this.i = end < 0 ? s.length : end + 1;
      return { kind: 'string', value };
    }
    if (c === '*') {
      let j = this.i + 1;
      while (j < s.length && /[0-9]/.test(s[j])) j++;
      const value = s.slice(this.i + 1, j);
      this.i = j;
      return { kind: 'count', value };
    }
    let j = this.i;
    while (j < s.length && /[^\s,{}":;]/.test(s[j])) j++;
    if (j === this.i) j++; // a stray character: skip it as a word
    const value = s.slice(this.i, j);
    this.i = j;
    if (s[j] === ':') { this.i++; return { kind: 'key', value }; }
    return { kind: /^[-+]?(\d|\.\d)/.test(value) ? 'number' : 'word', value };
  }
}

function parseAsciiNodes(tokens: AsciiTokens, nested: boolean): FbxNode[] {
  const nodes: FbxNode[] = [];
  for (;;) {
    const t = tokens.peek();
    if (!t) break;
    if (t.kind === '}') { if (nested) tokens.next(); break; }
    tokens.next();
    if (t.kind !== 'key') continue; // tolerate stray values
    nodes.push(parseAsciiNode(t.value, tokens));
  }
  return nodes;
}

function parseAsciiNode(name: string, tokens: AsciiTokens): FbxNode {
  const props: FbxProp[] = [];
  let children: FbxNode[] = [];
  let expectValue = true;
  for (;;) {
    const t = tokens.peek();
    if (!t || t.kind === 'key' || t.kind === '}') break;
    if (t.kind === ',') { tokens.next(); expectValue = true; continue; }
    if (t.kind === '{') { tokens.next(); children = parseAsciiNodes(tokens, true); break; }
    if (!expectValue) break; // a value on the next line without a comma: a new node starts
    tokens.next();
    expectValue = false;
    if (t.kind === 'count') {
      props.push(parseAsciiArray(name, Number(t.value), tokens));
      break;
    }
    props.push(t.kind === 'number' ? Number(t.value) : t.value);
  }
  if (name === 'Content') {
    // Embedded file: several quoted base64 strings, each encoded on its own.
    const parts = props.filter((p): p is string => typeof p === 'string' && p.length > 0).map(decodeBase64);
    const bytes = new Uint8Array(parts.reduce((n, p) => n + p.length, 0));
    let offset = 0;
    for (const part of parts) { bytes.set(part, offset); offset += part.length; }
    return { name, props: bytes.length ? [bytes] : [], children };
  }
  return { name, props, children };
}

function parseAsciiArray(name: string, count: number, tokens: AsciiTokens): FbxProp {
  const out = INT_ARRAYS.test(name) ? new Int32Array(count) : new Float64Array(count);
  if (tokens.peek()?.kind !== '{') return out;
  tokens.next();
  let k = 0;
  for (;;) {
    const t = tokens.next();
    if (!t || t.kind === '}') break;
    if (t.kind === 'number' && k < count) out[k++] = Number(t.value);
  }
  return out;
}

function decodeBase64(base64: string): Uint8Array {
  const binary = atob(base64.replace(/[^A-Za-z0-9+/=]/g, ''));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}
