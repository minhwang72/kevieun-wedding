import fs from "fs";
import opentype from "opentype.js";

const fontPath = process.argv[2];     // 예: public/fonts/Allura-Regular.ttf
const text = process.argv[3];         // 예: "Fall in Love"
const fontSize = Number(process.argv[4] || 180);

if (!fontPath || !text) {
  console.log("Usage: node scripts/gen-svg-path.mjs <font.ttf> <text> [fontSize]");
  process.exit(1);
}

if (!fs.existsSync(fontPath)) {
  console.error(`Font file not found: ${fontPath}`);
  process.exit(1);
}

const font = await opentype.load(fontPath);

// (0,0) 기준으로 path 만들고, 보기 좋게 약간 아래로 내림
const x = 50;
const y = 180;

const path = font.getPath(text, x, y, fontSize);
const d = path.toPathData(2);

// viewBox 계산(대충 넉넉히)
const box = path.getBoundingBox();
const pad = 40;
const viewBox = [
  Math.floor(box.x1 - pad),
  Math.floor(box.y1 - pad),
  Math.ceil((box.x2 - box.x1) + pad * 2),
  Math.ceil((box.y2 - box.y1) + pad * 2),
].join(" ");

console.log(JSON.stringify({ text, fontPath, fontSize, viewBox, d }, null, 2));
