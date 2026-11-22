// Builds every game in games/<name>/ into docs/games/<name>/ (GitHub Pages).
// Each game has src/main.ts and index.html; an assets/ folder is copied as is.
import { build } from 'esbuild';
import { cpSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const only = process.argv[2];
for (const name of readdirSync('games')) {
  if (only && name !== only) continue;
  const src = join('games', name);
  if (!existsSync(join(src, 'src/main.ts'))) continue;
  const out = join('docs/games', name);
  mkdirSync(out, { recursive: true });
  await build({
    entryPoints: [join(src, 'src/main.ts')],
    outfile: join(out, 'game.js'),
    bundle: true,
    format: 'esm',
    minify: true,
    keepNames: true,
    target: 'es2020',
    logLevel: 'warning',
  });
  cpSync(join(src, 'index.html'), join(out, 'index.html'));
  if (existsSync(join(src, 'assets'))) cpSync(join(src, 'assets'), join(out, 'assets'), { recursive: true });
  console.log(`built ${out}`);
}
