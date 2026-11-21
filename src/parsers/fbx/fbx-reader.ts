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

/**
 * Reads a binary FBX file (version 7.x) into its node tree.
 *
 * Arrays compressed with zlib are inflated with `DecompressionStream`, which
 * the browser and Node 18+ provide, hence the Promise.
 */
export async function readFbx(buffer: ArrayBuffer): Promise<{ version: number; nodes: FbxNode[] }> {
  const version = fbxVersion(buffer);
  if (version === null) throw new Error('Not a binary FBX file (ASCII FBX is not supported).');
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
