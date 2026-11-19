// News-image entry for make.fun's news-image-20261119 bounty.
// The finished front page lives in entry.png next to this file.
// This program copies those exact bytes to the output image the
// grader reads, so every run produces the same file.
//
// Run it locally with:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const target = join(outDir, "entry.png");

// The front page is entry.png beside this file. Some hosts only carry
// text files, so entry.png.b64 holds the same image as base64 text and
// is used when the PNG itself is not in the checkout. Either way the
// bytes written are identical.
function loadImage(): Buffer {
  const pngPath = join(here, "entry.png");
  if (existsSync(pngPath)) {
    return readFileSync(pngPath);
  }
  const encoded = readFileSync(join(here, "entry.png.b64"), "utf8").trim();
  return Buffer.from(encoded, "base64");
}

const bytes = loadImage();
if (bytes.length > 1048576) {
  throw new Error(`entry image is ${bytes.length} bytes, over the 1 MiB cap`);
}
if (bytes.subarray(0, 8).toString("hex") !== "89504e470d0a1a0a") {
  throw new Error("entry image is not a PNG");
}

mkdirSync(outDir, { recursive: true });
writeFileSync(target, bytes);
console.log(`wrote ${bytes.length} bytes to ${target}`);
