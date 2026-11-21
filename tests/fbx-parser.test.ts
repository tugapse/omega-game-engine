import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { mat4 } from 'gl-matrix';
import { parseFbx } from '../src/parsers/fbx/fbx-parser';
import { SkinnedMeshData } from '../src/core/model/model-data';

/**
 * Mixamo files can't be committed (their licence forbids redistributing the
 * files), so these tests read them from tests/fixtures/local/ (git-ignored)
 * or OMEGA_FBX_DIR, and are skipped when none are there.
 */
const dir = process.env.OMEGA_FBX_DIR ?? join(__dirname, 'fixtures', 'local');
const files = existsSync(dir) ? readdirSync(dir).filter((f) => /\.fbx$/i.test(f)) : [];
const load = (name: string) => {
  const b = readFileSync(join(dir, name));
  return b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength);
};
const find = (part: string) => files.find((f) => f.toLowerCase().includes(part));

describe.skipIf(!find('skinning'))('FBX parser (Mixamo character)', () => {
  it('reads the skinned mesh, bones, textures and clip', async () => {
    const model = await parseFbx(load(find('skinning')!));
    expect(model.unitScale).toBeCloseTo(0.01);
    expect(model.meshes).toHaveLength(1);
    const mesh = model.meshes[0] as SkinnedMeshData;
    expect(mesh).toBeInstanceOf(SkinnedMeshData);
    expect(mesh.vertices.length).toBeGreaterThanOrEqual(7512);
    expect(mesh.indices.length % 3).toBe(0);
    expect(mesh.joints.length).toBe(mesh.vertices.length * 4);
    // Every vertex's weights sum to 1 and point at a real joint.
    const skin = model.skins[0];
    for (let v = 0; v < mesh.vertices.length; v++) {
      const w = mesh.weights.subarray(v * 4, v * 4 + 4);
      expect(w[0] + w[1] + w[2] + w[3]).toBeCloseTo(1, 4);
      for (let k = 0; k < 4; k++) expect(mesh.joints[v * 4 + k]).toBeLessThan(skin.joints.length);
    }
    expect(model.nodes.some((n) => n.name === 'mixamorig:Hips')).toBe(true);
    expect(model.images).toHaveLength(4);
    expect(model.images.every((i) => i.mimeType === 'image/png')).toBe(true);
    const material = model.materials[0];
    expect(material.albedo).toBeDefined();
    expect(model.clips).toHaveLength(1);
    expect(model.clips[0].duration).toBeCloseTo(2.27, 1);
  });

  it('node transforms rebuild the bind pose of every bone', async () => {
    const model = await parseFbx(load(find('skinning')!));
    const globals = model.nodes.map(() => mat4.create());
    model.nodes.forEach((n, i) => {
      mat4.fromRotationTranslationScale(globals[i], n.rotation, n.translation, n.scale);
      if (n.parent >= 0) mat4.multiply(globals[i], globals[n.parent], globals[i]);
    });
    const meshNode = model.nodes.findIndex((n) => n.skin !== undefined);
    const skin = model.skins[model.nodes[meshNode].skin!];
    const meshInverse = mat4.invert(mat4.create(), globals[meshNode])!;
    // At bind pose, mesh^-1 * bone * inverseBind is the identity for every joint.
    let worst = 0;
    skin.joints.forEach((joint, j) => {
      const m = mat4.multiply(mat4.create(), meshInverse, globals[joint]);
      mat4.multiply(m, m, skin.inverseBindMatrices[j]);
      const id = mat4.create();
      for (let k = 0; k < 16; k++) worst = Math.max(worst, Math.abs(m[k] - id[k]) / (k >= 12 ? 100 : 1));
    });
    expect(worst).toBeLessThan(1e-3);
  });

  it('puts the character about 1.8 m tall in bind pose', async () => {
    const model = await parseFbx(load(find('skinning')!));
    const mesh = model.meshes[0];
    let min = Infinity, max = -Infinity;
    for (const v of mesh.vertices) { min = Math.min(min, v[1]); max = Math.max(max, v[1]); }
    const metres = (max - min) * model.unitScale;
    expect(metres).toBeGreaterThan(1.4);
    expect(metres).toBeLessThan(2.2);
  });
});

describe.skipIf(!find('twist'))('FBX parser (Mixamo ASCII FBX)', () => {
  it('reads the same tree from an ASCII file, with embedded textures and a clean bind pose', async () => {
    const model = await parseFbx(load(find('twist')!));
    const mesh = model.meshes[0] as SkinnedMeshData;
    expect(mesh).toBeInstanceOf(SkinnedMeshData);
    expect(model.skins[0].joints.length).toBeGreaterThan(60);
    expect(model.images.length).toBeGreaterThan(0);
    expect(model.images.every((i) => i.data[0] === 0x89 && i.data[1] === 0x50)).toBe(true); // PNG signature
    expect(model.clips[0].duration).toBeGreaterThan(1);
    const globals = model.nodes.map(() => mat4.create());
    model.nodes.forEach((n, i) => {
      mat4.fromRotationTranslationScale(globals[i], n.rotation, n.translation, n.scale);
      if (n.parent >= 0) mat4.multiply(globals[i], globals[n.parent], globals[i]);
    });
    const meshNode = model.nodes.findIndex((n) => n.skin !== undefined);
    const skin = model.skins[model.nodes[meshNode].skin!];
    const meshInverse = mat4.invert(mat4.create(), globals[meshNode])!;
    let worst = 0;
    skin.joints.forEach((joint, j) => {
      const m = mat4.multiply(mat4.create(), meshInverse, globals[joint]);
      mat4.multiply(m, m, skin.inverseBindMatrices[j]);
      const id = mat4.create();
      for (let k = 0; k < 16; k++) worst = Math.max(worst, Math.abs(m[k] - id[k]) / (k >= 12 ? 100 : 1));
    });
    expect(worst).toBeLessThan(1e-3);
  });
});

describe.skipIf(!find('character'))('FBX parser (old FBX 6.1)', () => {
  it('rejects FBX 6.x with a clear message', async () => {
    await expect(parseFbx(load(find('character')!))).rejects.toThrow(/FBX 6\.1 is not supported/);
  });
});
