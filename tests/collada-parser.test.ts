import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { mat4, vec3 } from 'gl-matrix';
import { parseCollada } from '../src/parsers/collada/collada-parser';
import { SkinnedMeshData } from '../src/core/model/model-data';
import { parseXml, xmlChild } from '../src/parsers/xml';

describe('XML parser', () => {
  it('reads elements, attributes, text, comments and entities', () => {
    const doc = parseXml('<?xml version="1.0"?><!-- c --><a x="1" y=\'2\'><b>1 2 &amp; 3</b><c/><![CDATA[<raw>]]></a>');
    const a = xmlChild(doc, 'a')!;
    expect(a.attrs).toEqual({ x: '1', y: '2' });
    expect(xmlChild(a, 'b')!.text).toBe('1 2 & 3');
    expect(xmlChild(a, 'c')).toBeDefined();
    expect(a.text).toBe('<raw>');
  });
});

// Mixamo files are not committed (licence): tests/fixtures/local/*.dae, git-ignored.
const dir = process.env.OMEGA_FBX_DIR ?? join(__dirname, 'fixtures', 'local');
const file = existsSync(dir) ? readdirSync(dir).find((f) => /\.dae$/i.test(f)) : undefined;

describe.skipIf(!file)('COLLADA parser (Mixamo)', () => {
  const model = file ? parseCollada(readFileSync(join(dir, file), 'utf8')) : undefined!;

  it('reads skinned meshes, joints, materials, external images and the clip', () => {
    expect(model.unitScale).toBeCloseTo(0.01);
    expect(model.skins).toHaveLength(1);
    expect(model.skins[0].joints.length).toBeGreaterThan(60);
    expect(model.meshes.length).toBeGreaterThanOrEqual(1);
    for (const mesh of model.meshes as SkinnedMeshData[]) {
      expect(mesh).toBeInstanceOf(SkinnedMeshData);
      for (let v = 0; v < mesh.vertices.length; v++) {
        const w = mesh.weights.subarray(v * 4, v * 4 + 4);
        expect(w[0] + w[1] + w[2] + w[3]).toBeCloseTo(1, 4);
      }
    }
    expect(model.images.length).toBeGreaterThan(0);
    expect(model.images.every((i) => !i.data && /^textures\//.test(i.path!))).toBe(true);
    expect(model.materials[0].albedo).toBeDefined();
    expect(model.materials[0].normal).toBeDefined();
    expect(model.clips).toHaveLength(1);
    expect(model.clips[0].duration).toBeGreaterThan(0.5);
  });

  it('first animation key equals the scene pose', () => {
    const clip = model.clips[0];
    let worst = 0;
    for (const c of clip.channels) {
      const node = model.nodes.find((n) => n.name === c.target)!;
      const ref = c.property === 'translation' ? node.translation : c.property === 'scale' ? node.scale : node.rotation;
      const size = c.property === 'rotation' ? 4 : 3;
      const sign = c.property === 'rotation' && Math.sign(c.values[3]) !== Math.sign(ref[3]) ? -1 : 1;
      for (let k = 0; k < size; k++) worst = Math.max(worst, Math.abs(c.values[k] * sign - ref[k]) / (c.property === 'translation' ? 100 : 1));
    }
    expect(worst).toBeLessThan(1e-3);
  });

  it('skinned at the scene pose, the feet rest on the ground', () => {
    const globals = model.nodes.map(() => mat4.create());
    model.nodes.forEach((n, i) => {
      mat4.fromRotationTranslationScale(globals[i], n.rotation, n.translation, n.scale);
      if (n.parent >= 0) mat4.multiply(globals[i], globals[n.parent], globals[i]);
    });
    const meshNode = model.nodes.findIndex((n) => n.skin !== undefined);
    const mesh = model.meshes[model.nodes[meshNode].mesh!] as SkinnedMeshData;
    const skin = model.skins[0];
    const meshInverse = mat4.invert(mat4.create(), globals[meshNode])!;
    const joint = skin.joints.map((j, k) => mat4.multiply(mat4.create(), mat4.multiply(mat4.create(), meshInverse, globals[j]), skin.inverseBindMatrices[k]));
    // Feet only: the skirt bones go through the floor when crouching (no collision in the clip).
    const isFoot = skin.joints.map((j) => /Foot|Toe/.test(model.nodes[j].name));
    let minY = Infinity, maxY = -Infinity;
    const p = vec3.create(), q = vec3.create();
    for (let v = 0; v < mesh.vertices.length; v++) {
      if (!isFoot[mesh.joints[v * 4]]) continue;
      vec3.set(p, 0, 0, 0);
      for (let k = 0; k < 4; k++) {
        const w = mesh.weights[v * 4 + k];
        if (!w) continue;
        vec3.transformMat4(q, mesh.vertices[v], joint[mesh.joints[v * 4 + k]]);
        vec3.scaleAndAdd(p, p, q, w);
      }
      vec3.transformMat4(p, p, globals[meshNode]);
      minY = Math.min(minY, p[1]); maxY = Math.max(maxY, p[1]);
    }
    expect(minY * model.unitScale).toBeGreaterThan(-0.1);
    expect(minY * model.unitScale).toBeLessThan(0.1);
    expect(maxY * model.unitScale).toBeLessThan(0.4);
  });
});
