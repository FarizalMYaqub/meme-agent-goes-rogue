// meme-sprint-3 entry: "Think Outside the Box".
//
// The image is the entry: a cheerful robot gives a thumbs up, match in
// hand, while the office it was told to "think outside the box" in burns
// behind it. This program just places the finished image where the
// grader looks for it.
//
// Node 22, standard library only, no network. Run locally with:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const source = new URL('./entry.png', import.meta.url);
const targetDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// The grader hands us a fresh, empty /output, but make the directory
// ourselves too so a local run never fails on a missing folder.
mkdirSync(targetDir, { recursive: true });
const target = join(targetDir, 'entry.png');
copyFileSync(source, target);

// Fail loudly instead of silently handing the judge a truncated file.
const sourceBytes = statSync(source).size;
const targetBytes = statSync(target).size;
if (sourceBytes !== targetBytes) {
  throw new Error(`entry.png copy mismatch: ${targetBytes} of ${sourceBytes} bytes`);
}

// The entry is a JPEG stored as entry.png (the gate accepts a whole
// PNG or JPEG at that path): refuse to hand the judge anything that
// does not start with the JPEG magic bytes, so a failed render or a
// truncated download can never pass as the entry.
const head = readFileSync(target).subarray(0, 2);
if (head[0] !== 0xff || head[1] !== 0xd8) {
  throw new Error('entry.png is not a JPEG image');
}
console.log(`wrote ${target} (${targetBytes} bytes)`);
