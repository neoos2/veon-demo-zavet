// One-off image pipeline: client product photos (veon/research/img) -> trimmed WebP set in public/img.
// Run: node scripts/images.mjs  (sharp from site/node_modules). Prints a JSON manifest of sizes.
import sharp from "sharp";
import { mkdir, writeFile, copyFile } from "node:fs/promises";

const SRC = new URL("../../veon/research/img/", import.meta.url).pathname;
const OUT = new URL("../public/img/", import.meta.url).pathname;
await mkdir(OUT, { recursive: true });

// name, source file, target widths, optional white mask [x, y, w, h] (to hide a badge)
const jobs = [
  ["sm3-5", "sm-3(5)-web-1.jpg", [240, 400, 600]],
  ["kp-euro", "krp(evro)-7.jpg", [360, 560, 840], [730, 760, 215, 185]],
  ["gp", "2.4-380x380.png", [200, 300], null, 60],
  ["sm3-2", "sm3-2(euro)-1.jpg", [320, 520, 800]],
  ["sm3-4", "sm-3-4(euro)-1.jpg", [320, 520, 800]],
  ["recirc", "z4.png", [320, 560, 840]],
  ["kg-1m", "kg-1m-web.jpg", [320, 560, 840]],
  ["bags", "sumki-3.jpg", [320, 560, 840]],
  ["sur", "sur(pixel)-1.jpg", [240, 400, 600]],
  ["shm-1", "shm-1-web-1.jpg", [240, 400, 600]],
  ["kf-2m", "kf-2m-web-2.jpg", [360, 560, 840]],
  ["m-4", "mc-1000x1000.jpg", [320, 560, 840]],
  ["ork-021m", "ork-021m-1.jpg", [200, 320, 480]],
  ["ns-1", "ns-1-web-1.jpg", [360, 560, 840]],
  // crop to the device only: no area badge, CE mark, Wi-Fi and phone icons
  ["aereks-pro", "aereks-profeshin360se.png", [160, 240, 300], null, 18, [390, 215, 230, 675], true],
];

const manifest = {};
for (const [name, file, widths, mask, threshold = 18, crop, deepen] of jobs) {
  let flat = sharp(SRC + file).flatten({ background: "#ffffff" });
  if (crop) { const [left, top, width, height] = crop; flat = sharp(await flat.png().toBuffer()).extract({ left, top, width, height }); }
  // deepen: a white product on white; stretch light greys darker, pure white stays white (reads on the steel band)
  if (deepen) flat = sharp(await flat.png().toBuffer()).linear(1.8, -0.8 * 255);
  let img = sharp(await flat.png().toBuffer());
  if (mask) {
    const [x, y, w, h] = mask;
    const white = await sharp({ create: { width: w, height: h, channels: 3, background: "#ffffff" } }).png().toBuffer();
    img = sharp(await img.composite([{ input: white, left: x, top: y }]).png().toBuffer());
  }
  const trimmed = await img.trim({ background: "#ffffff", threshold }).png().toBuffer({ resolveWithObject: true });
  const { width: tw, height: th } = trimmed.info;
  // small even margin so edges are not cut
  const pad = Math.round(Math.max(tw, th) * 0.01);
  const base = await sharp(trimmed.data).extend({ top: pad, bottom: 0, left: pad, right: pad, background: "#ffffff" }).png().toBuffer({ resolveWithObject: true });
  const W = base.info.width, H = base.info.height;
  const out = [];
  for (const w of widths.filter((w) => w <= W).concat(widths.some((w) => w > W) ? [W] : [])) {
    const f = `${name}-${w}.webp`;
    await sharp(base.data).resize({ width: w }).webp({ quality: 80, effort: 5 }).toFile(OUT + f);
    out.push(w);
  }
  manifest[name] = { w: W, h: H, ratio: +(W / H).toFixed(4), widths: [...new Set(out)] };
}
await copyFile(SRC + "logo_6h5u-us.png", OUT + "logo-zapovit.png");
await sharp(SRC + "logo_6h5u-us.png").webp({ quality: 90, alphaQuality: 100 }).toFile(OUT + "logo-zapovit.webp");
// favicon: the heart of the logo
await sharp(SRC + "logo_6h5u-us.png").extract({ left: 163, top: 14, width: 62, height: 65 }).resize(64, 64, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toFile(OUT + "favicon.png");
await writeFile(new URL("../src/data/images.json", import.meta.url), JSON.stringify(manifest, null, 2));
console.log(JSON.stringify(manifest, null, 1));
