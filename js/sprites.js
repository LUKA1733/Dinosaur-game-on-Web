// Pixel dinosaurs face right. "." is empty.
// k outline, b body, d shade, l belly, e eye, p pupil, t tooth, a accent, c claw.

const INK = "#241910";
const EYE = "#f7f3e8";

function palette(colors) {
  return {
    k: INK,
    e: EYE,
    p: INK,
    t: EYE,
    c: "#3a2718",
    ...colors,
  };
}

const RAW = [
  {
    name: "美颌龙",
    pixel: 5,
    bulk: 1,
    originX: 0.55,
    originY: 0.62,
    palette: palette({
      b: "#c6e25a",
      d: "#6f9a2c",
      l: "#e7f3b4",
      a: "#f2f6a8",
    }),
    frames: [
      [
        "......................",
        "...............kk.....",
        "..............kbbk....",
        ".............kbepk....",
        "........kkkkkbbbbk....",
        ".......kbbbbbblllk....",
        "......kbbbbbbk.a......",
        ".....kbbbkk.k..k......",
        "....kbbk.k.k...k......",
        "...kbk...k............",
        "..k......k............",
        ".k....................",
      ],
      [
        "......................",
        "...............kk.....",
        "..............kbbk....",
        ".............kbepk....",
        "........kkkkkbbbbk....",
        ".......kbbbbbblllk....",
        "......kbbbbbbk..a.....",
        ".....kbbbkkk.k.k......",
        "....kbbk.k.k..k.......",
        "...kbk...k...k........",
        "..k.........k.........",
        ".k....................",
      ],
    ],
  },
  {
    name: "迅猛龙",
    pixel: 5,
    bulk: 1.22,
    originX: 0.52,
    originY: 0.58,
    palette: palette({
      b: "#e0923f",
      d: "#b25a22",
      l: "#f6d2a4",
      a: "#3eafa6",
    }),
    frames: [
      [
        "..........................",
        "..................kkk.....",
        ".................kbbbk....",
        "................kbepbbk...",
        "...............kbbbbddk...",
        "..........kkkkkbbbbbdk....",
        ".........kbbbbbbbbbbk.a...",
        "........kbbbbbbbbk.aaak...",
        ".......kbbbbbbkkkk........",
        "......kbbbk.k..k.k........",
        ".....kbbbk.k...kck........",
        "....kbbk..k...............",
        "...kbk....................",
        "..kk......................",
      ],
      [
        "..........................",
        "..................kkk.....",
        ".................kbbbk....",
        "................kbepbbk...",
        "...............kbbbbddk...",
        "..........kkkkkbbbbbdk....",
        ".........kbbbbbbbbbbk..a..",
        "........kbbbbbbbbk.aaa....",
        ".......kbbbbbbkkkk........",
        "......kbbbk.k.k..k........",
        ".....kbbbk..k..kck........",
        "....kbbbkk.k..............",
        "...kbbk...k...............",
        "..kk..k...................",
      ],
    ],
  },
  {
    name: "异特龙",
    pixel: 5,
    bulk: 1.38,
    originX: 0.5,
    originY: 0.56,
    palette: palette({
      b: "#d15b3e",
      d: "#8d3428",
      l: "#f0c0a4",
      a: "#f0c84a",
    }),
    frames: [
      [
        "..............................",
        ".......................a.a....",
        "......................kkkk....",
        ".....................klbbbk...",
        "....................kbepbbbk..",
        "...................kbbbbddbk..",
        "..............kkkkkbbbbbddk...",
        ".............kbbbbbbbbbbbk.c..",
        "............kbbbbbbbbbk.ccc...",
        "...........kbbbbbbbbkkkk......",
        "..........kbbbbbbk.k.kk.......",
        ".........kbbbbbk.k..kck.......",
        "........kbbbbk.k...k..........",
        ".......kbbbk..k...............",
        "......kbbk....................",
        ".....kk.......................",
      ],
      [
        "..............................",
        ".......................a.a....",
        "......................kkkk....",
        ".....................klbbbk...",
        "....................kbepbbbk..",
        "...................kbbbbddbk..",
        "..............kkkkkbbbbbddk...",
        ".............kbbbbbbbbbbk.ccc.",
        "............kbbbbbbbbk.ck.....",
        "...........kbbbbbbbbkk.k......",
        "..........kbbbbbbk.k..kk......",
        ".........kbbbbbk..k.kck.......",
        "........kbbbbkk.k.............",
        ".......kbbbk...k..............",
        "......kbbk....................",
        ".....kk.......................",
      ],
    ],
  },
  {
    name: "霸王龙",
    pixel: 5,
    bulk: 1.72,
    originX: 0.48,
    originY: 0.55,
    palette: palette({
      b: "#8aaa4a",
      d: "#3e5c30",
      l: "#ead7b0",
      a: "#c4553a",
    }),
    frames: [
      [
        "................................",
        "...................kkkkkk.......",
        "..................klllllbk......",
        ".................kbbbbbbbbk.....",
        "................kbbeppbbbbbk....",
        "...............kbbbbbbbbbbdk....",
        "..............kbbbbbbbbbddk.tt..",
        ".............kbbbbbbbbddk.ttk...",
        "............kbbbbbbbbk..kk......",
        "...........kbbbbbbbk..aak.......",
        "..........kbbbbbbbbkkkk.........",
        ".........kbbbbbbk.k.kk..........",
        "........kbbbbbbk.k..ck..........",
        ".......kbbbbbk.k..kck...........",
        "......kbbbbk..kk................",
        ".....kbbbk....k.................",
        "....kbbk........................",
        "...kk...........................",
      ],
      [
        "................................",
        "...................kkkkkk.......",
        "..................klllllbk......",
        ".................kbbbbbbbbk.....",
        "................kbbeppbbbbbk....",
        "...............kbbbbbbbbbbdk....",
        "..............kbbbbbbbbbddk.....",
        ".............kbbbbbbbbddk.ttk...",
        "............kbbbbbbbbk.ttk......",
        "...........kbbbbbbbk..kk........",
        "..........kbbbbbbbk.aak.........",
        ".........kbbbbbbbbk.kk..........",
        "........kbbbbbbk.k..kk..........",
        ".......kbbbbbk.k...ck...........",
        "......kbbbbbk..k.kck............",
        ".....kbbbbkk.k..................",
        "....kbbbk...k...................",
        "...kk...........................",
      ],
    ],
  },
];

function bake(def) {
  const frames = def.frames.map((frame, index) => {
    const width = frame[0].length;
    return frame.map((row, rowIndex) => {
      if (row.length !== width) {
        throw new Error(`${def.name} frame ${index} row ${rowIndex} is ${row.length}, expected ${width}`);
      }
      return row;
    });
  });
  const rows = frames[0].length;
  for (let i = 1; i < frames.length; i++) {
    if (frames[i].length !== rows) {
      throw new Error(`${def.name} frame ${i} height ${frames[i].length} != ${rows}`);
    }
    if (frames[i][0].length !== frames[0][0].length) {
      throw new Error(`${def.name} frame ${i} width differs`);
    }
  }
  return {
    name: def.name,
    pixel: def.pixel,
    bulk: def.bulk,
    originX: def.originX,
    originY: def.originY,
    palette: def.palette,
    frames,
    cols: frames[0][0].length,
    rows,
  };
}

export const SPECIES = RAW.map(bake);

const rasterCache = new Map();

function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function raster(speciesIndex, frameIndex) {
  const key = `${speciesIndex}:${frameIndex}`;
  const cached = rasterCache.get(key);
  if (cached) return cached;
  const sp = SPECIES[speciesIndex];
  const grid = sp.frames[frameIndex];
  const canvas = document.createElement("canvas");
  canvas.width = sp.cols;
  canvas.height = sp.rows;
  const ctx = canvas.getContext("2d");
  const image = ctx.createImageData(sp.cols, sp.rows);
  const data = image.data;
  for (let y = 0; y < sp.rows; y++) {
    const row = grid[y];
    for (let x = 0; x < sp.cols; x++) {
      const color = sp.palette[row[x]];
      if (!color) continue;
      const rgb = hexToRgb(color);
      const i = (y * sp.cols + x) * 4;
      data[i] = rgb[0];
      data[i + 1] = rgb[1];
      data[i + 2] = rgb[2];
      data[i + 3] = 255;
    }
  }
  ctx.putImageData(image, 0, 0);
  rasterCache.set(key, canvas);
  return canvas;
}

export function preloadSprites() {
  for (let i = 0; i < SPECIES.length; i++) {
    raster(i, 0);
    raster(i, 1);
  }
}

export function spriteSize(speciesIndex, mul) {
  const sp = SPECIES[speciesIndex];
  const dw = sp.cols * sp.pixel * sp.bulk * mul;
  const dh = sp.rows * sp.pixel * sp.bulk * mul;
  return { dw, dh, r: (dw + dh) * 0.23 };
}

export function drawShadow(ctx, x, y, rx) {
  const step = 4;
  const ry = Math.max(step, rx * 0.3);
  ctx.fillStyle = "rgba(28, 22, 14, 0.3)";
  for (let iy = -ry; iy <= ry; iy += step) {
    const t = 1 - (iy * iy) / (ry * ry);
    if (t <= 0) continue;
    const hw = Math.sqrt(t) * rx;
    ctx.fillRect(x - hw, y + iy, hw * 2, step);
  }
}

export function drawDino(ctx, speciesIndex, frame, x, y, mul, flip) {
  const sp = SPECIES[speciesIndex];
  const img = raster(speciesIndex, frame & 1);
  const { dw, dh } = spriteSize(speciesIndex, mul);
  ctx.save();
  ctx.translate(x, y);
  if (flip) ctx.scale(-1, 1);
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(img, -dw * sp.originX, -dh * sp.originY, dw, dh);
  ctx.restore();
  return {
    dw,
    dh,
    top: y - dh * sp.originY,
  };
}

function hash(n) {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
}

function snap(v, p) {
  return Math.round(v / p) * p;
}

export function buildBackground(worldW, worldH) {
  const canvas = document.createElement("canvas");
  canvas.width = worldW;
  canvas.height = worldH;
  const ctx = canvas.getContext("2d");
  const P = 8;
  const horizon = Math.floor(worldH * 0.54 / P) * P;

  const sky = ["#5aaed0", "#67b6d6", "#7ac4de", "#96d0e4", "#b7dcd4", "#d7dcb8", "#ead3a0", "#f0c48a"];
  for (let y = 0; y < horizon; y += P) {
    const idx = Math.min(sky.length - 1, Math.floor((y / horizon) * sky.length));
    ctx.fillStyle = sky[idx];
    ctx.fillRect(0, y, worldW, P);
  }

  fillDisc(ctx, worldW * 0.78, horizon - 150, 54, "#ffe7a0", P);
  fillDisc(ctx, worldW * 0.78, horizon - 150, 32, "#ffd56a", P);

  drawCloud(ctx, worldW * 0.12, horizon - 210, P);
  drawCloud(ctx, worldW * 0.34, horizon - 160, P);
  drawCloud(ctx, worldW * 0.58, horizon - 230, P);
  drawCloud(ctx, worldW * 0.9, horizon - 140, P);

  for (let i = 0; i < 7; i++) {
    drawBird(ctx, worldW * (0.08 + i * 0.11), horizon - 250 + (i % 3) * 36);
  }

  drawHill(ctx, horizon, worldW * 0.02, worldW * 0.28, 70, "#7f8f72");
  drawHill(ctx, horizon, worldW * 0.24, worldW * 0.55, 54, "#8b9a7c");
  drawHill(ctx, horizon, worldW * 0.62, worldW * 0.98, 80, "#738468");

  drawVolcano(ctx, worldW * 0.22, horizon + 8, 180, 200, P);
  drawVolcano(ctx, worldW * 0.5, horizon + 12, 120, 150, P);
  drawVolcano(ctx, worldW * 0.7, horizon + 8, 90, 120, P);

  ctx.fillStyle = "#6e9460";
  ctx.fillRect(0, horizon, worldW, P * 3);
  ctx.fillStyle = "#5d7a52";
  ctx.fillRect(0, horizon + P * 3, worldW, worldH - horizon - P * 3);
  ctx.fillStyle = "#8d6b45";
  ctx.fillRect(0, horizon + P * 14, worldW, P * 2);
  ctx.fillStyle = "#3e5640";
  ctx.fillRect(0, worldH - P * 8, worldW, P * 8);

  for (let y = horizon; y < worldH; y += P) {
    for (let x = 0; x < worldW; x += P) {
      const n = hash(x * 0.013 + y * 0.017);
      if (n > 0.86) {
        ctx.fillStyle = "#7f9a68";
        ctx.fillRect(x, y, P, P);
      } else if (n < 0.06) {
        ctx.fillStyle = "#3c5340";
        ctx.fillRect(x, y, P, P);
      }
    }
  }

  for (let x = 24; x < worldW; x += 48) {
    const n = hash(x * 0.02);
    const h = 40 + Math.floor(n * 36);
    const y = horizon + 36 + Math.floor(hash(x * 0.07) * 520);
    if (n > 0.72) drawCycad(ctx, x, y, h + 30, P);
    else drawFern(ctx, x, y, h, P);
    if (hash(x * 0.11) > 0.82) drawBone(ctx, x + 18, y + 8);
    if (hash(x * 0.09) > 0.9) drawRock(ctx, x - 10, y + 16, P);
  }

  // Lava trickle down the big volcano onto the plain.
  ctx.fillStyle = "#e85d04";
  const lavaX = snap(worldW * 0.2, P);
  for (let i = 0; i < 8; i++) {
    ctx.fillRect(lavaX + (i % 2) * P, horizon + i * P * 2, P, P * 2);
  }

  drawCliffs(ctx, worldW, worldH, P);
  return canvas;
}

function fillDisc(ctx, cx, cy, r, color, p) {
  ctx.fillStyle = color;
  for (let y = -r; y <= r; y += p) {
    const span = Math.sqrt(Math.max(0, r * r - y * y));
    const x = snap(cx - span, p);
    const w = Math.max(p, snap(span * 2, p));
    ctx.fillRect(x, snap(cy + y, p), w, p);
  }
}

function drawCloud(ctx, x, y, p) {
  ctx.fillStyle = "#f7f3e8";
  const blocks = [
    [0, 16, 40, 16],
    [12, 0, 48, 20],
    [28, 12, 36, 16],
    [8, 20, 56, 12],
  ];
  for (const [dx, dy, w, h] of blocks) {
    ctx.fillRect(snap(x + dx, p), snap(y + dy, p), w, h);
  }
}

function drawBird(ctx, x, y) {
  ctx.fillStyle = "#2c241c";
  ctx.fillRect(x, y, 4, 4);
  ctx.fillRect(x + 4, y + 4, 4, 4);
  ctx.fillRect(x + 8, y, 4, 4);
}

function drawHill(ctx, baseY, x0, x1, peak, color) {
  const p = 8;
  ctx.fillStyle = color;
  for (let x = x0; x < x1; x += p) {
    const u = (x - x0) / (x1 - x0);
    const h = Math.sin(u * Math.PI) * peak;
    ctx.fillRect(snap(x, p), snap(baseY - h, p), p, h + p);
  }
}

function drawVolcano(ctx, cx, baseY, halfW, height, p) {
  for (let y = 0; y < height; y += p) {
    const t = y / height;
    const half = Math.max(p * 2, halfW * t);
    const yy = baseY - height + y;
    ctx.fillStyle = y < height * 0.18 ? "#5c463c" : y % (p * 5) === 0 ? "#4a382f" : "#6b5346";
    ctx.fillRect(snap(cx - half, p), snap(yy, p), half * 2, p);
  }
  const top = baseY - height;
  ctx.fillStyle = "#ffb703";
  ctx.fillRect(snap(cx - 18, p), snap(top, p), 36, 12);
  ctx.fillStyle = "#e85d04";
  ctx.fillRect(snap(cx - 10, p), snap(top + 8, p), 20, 18);
  ctx.fillStyle = "#d9d3c7";
  ctx.fillRect(snap(cx - 6, p), snap(top - 28, p), 24, 12);
  ctx.fillRect(snap(cx + 14, p), snap(top - 46, p), 18, 12);
  ctx.fillStyle = "#eeeae2";
  ctx.fillRect(snap(cx + 4, p), snap(top - 58, p), 14, 10);
}

function drawFern(ctx, x, y, h, p) {
  ctx.fillStyle = "#1e4d30";
  ctx.fillRect(x, y - h, p, h);
  ctx.fillStyle = "#8ed36a";
  const fronds = 4;
  for (let i = 0; i < fronds; i++) {
    const fy = y - h + 6 + i * (h / fronds);
    const len = p * (fronds - i + 1);
    ctx.fillRect(x - len, fy, len, p);
    ctx.fillStyle = "#63b85a";
    ctx.fillRect(x + p, fy + p, len * 0.8, p);
    ctx.fillStyle = "#8ed36a";
  }
}

function drawCycad(ctx, x, y, h, p) {
  ctx.fillStyle = "#6a4a32";
  ctx.fillRect(x, y - h, p * 1.5, h);
  ctx.fillStyle = "#2f6b3a";
  ctx.beginPath();
  ctx.fillRect(x - p * 3, y - h, p * 7, p);
  ctx.fillRect(x - p * 2, y - h - p, p * 5, p);
  ctx.fillRect(x - p, y - h - p * 2, p * 3, p);
  ctx.fillStyle = "#8ed36a";
  ctx.fillRect(x - p * 2, y - h - p, p, p);
  ctx.fillRect(x + p * 2, y - h - p, p, p);
}

function drawBone(ctx, x, y) {
  ctx.fillStyle = "#f3ead8";
  ctx.fillRect(x, y, 22, 6);
  ctx.fillRect(x - 4, y - 4, 8, 8);
  ctx.fillRect(x + 16, y - 4, 8, 8);
}

function drawRock(ctx, x, y, p) {
  ctx.fillStyle = "#6e6258";
  ctx.fillRect(x, y, p * 3, p * 2);
  ctx.fillStyle = "#8a7d70";
  ctx.fillRect(x, y, p * 2, p);
}

function drawCliffs(ctx, worldW, worldH, p) {
  ctx.fillStyle = "#3a3228";
  for (let x = 0; x < worldW; x += p * 2) {
    const h = p * (2 + ((x / p) % 3));
    ctx.fillRect(x, 0, p * 2, h);
    ctx.fillRect(x, worldH - h, p * 2, h);
  }
  for (let y = 0; y < worldH; y += p * 2) {
    const w = p * (2 + ((y / p) % 3));
    ctx.fillRect(0, y, w, p * 2);
    ctx.fillRect(worldW - w, y, w, p * 2);
  }
}
