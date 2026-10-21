import { readFileSync, writeFileSync } from "node:fs";
import sharp from "sharp";
// The displayed brand component remains the source of truth for the vector paths.
const mark = readFileSync(
  new URL("../src/components/brand/panorama-mark.tsx", import.meta.url),
  "utf8",
);
const paths = [...mark.matchAll(/<path d="([^"]+)"/g)]
  .map((m) => `<path d="${m[1]}"/>`)
  .join("");
if (paths.length === 0) throw new Error("No brand paths found");
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500"><rect width="500" height="500" rx="104" fill="#130d20"/><defs><linearGradient id="brand" x1="0" y1="57" x2="0" y2="452" gradientUnits="userSpaceOnUse"><stop stop-color="#fff"/><stop offset=".39" stop-color="#fa00f5"/><stop offset=".72" stop-color="#00eced"/><stop offset="1" stop-color="#00eced"/></linearGradient></defs><g fill="url(#brand)">${paths}</g></svg>`;
writeFileSync(new URL("../src/app/icon.svg", import.meta.url), svg + "\n");
await sharp(Buffer.from(svg))
  .resize(180, 180)
  .png()
  .toFile(new URL("../src/app/apple-icon.png", import.meta.url).pathname);
