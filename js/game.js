import {
  SPECIES,
  buildBackground,
  drawDino,
  drawShadow,
  preloadSprites,
  spriteSize,
} from "./sprites.js";

// Score gained equals the eaten dinosaur's mass (rounded to a whole point).
// Body mass grows by GROWTH * sqrt(prey mass): the same meal is a big step
// for a small dinosaur and a small step once you are huge.
const START_MASS = 12;
const GROWTH = 1.12;
const EVOLVE_AT = [0, 22, 52, 100];
const MASS_EPS = 0.35;
const TARGET_AI = 21;
const WORLD_W = 3400;
const WORLD_H = 2000;
const PAD = 56;
const SCENE_Y = WORLD_H * 0.6;
const HAB_TOP = 1120;
const HAB_BOT = 1580;

// Pixel scale inside one species. The window is that species' mass range.
const SIZE_WINDOW = [
  [4, 18],
  [18, 52],
  [50, 112],
  [110, 260],
];

const TIERS = [
  { species: 0, weight: 0.5, mass: [4.2, 9.6], speed: [148, 174] },
  { species: 1, weight: 0.28, mass: [24, 48], speed: [108, 134] },
  { species: 2, weight: 0.15, mass: [55, 100], speed: [74, 96] },
  { species: 3, weight: 0.07, mass: [112, 210], speed: [46, 66] },
];

function clamp(v, a, b) {
  return Math.max(a, Math.min(b, v));
}

export class Game {
  constructor(canvas, best) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d", { alpha: false }) || canvas.getContext("2d");
    this.viewW = 1280;
    this.viewH = 720;
    this.dpr = 1;
    this.best = best || 0;
    this.onEat = () => {};
    this.onEvolve = () => {};
    this.onDie = () => {};
    this.onBest = () => {};
    this.bg = buildBackground(WORLD_W, WORLD_H);
    preloadSprites();
    this.cam = { x: 0, y: 0, zoom: 1.9, snap: true };
    this.reset(false);
    this.mode = "menu";
  }

  get speciesName() {
    if (!this.player) return SPECIES[0].name;
    return SPECIES[this.player.species].name;
  }

  setView(w, h, dpr) {
    this.viewW = w;
    this.viewH = h;
    this.dpr = dpr;
  }

  start() {
    this.reset(true);
    this.mode = "play";
  }

  reset(withPlayer) {
    this.ais = [];
    this.particles = [];
    this.floaters = [];
    this.score = 0;
    this.flash = 0;
    this.flashColor = "140, 32, 24";
    this.shake = 0;
    this.evolveT = 0;
    this.evolveName = "";
    this.player = null;
    if (withPlayer) {
      this.player = {
        x: WORLD_W * 0.5,
        y: SCENE_Y,
        vx: 0,
        vy: 0,
        species: 0,
        mass: START_MASS,
        facing: 1,
        anim: 0,
        alive: true,
        isPlayer: true,
        pop: 0,
      };
    }
    for (let i = 0; i < TARGET_AI; i++) this.ais.push(this.makeAI(false));
    this.cam.snap = true;
  }

  pickTier() {
    let roll = Math.random();
    for (const tier of TIERS) {
      roll -= tier.weight;
      if (roll <= 0) return tier;
    }
    return TIERS[0];
  }

  makeAI(fromEdge) {
    const tier = this.pickTier();
    const mass = tier.mass[0] + Math.random() * (tier.mass[1] - tier.mass[0]);
    const speed = tier.speed[0] + Math.random() * (tier.speed[1] - tier.speed[0]);
    const player = this.player;
    let x = WORLD_W * 0.5;
    let y = WORLD_H * 0.64;
    let dir = Math.random() < 0.5 ? -1 : 1;
    for (let attempt = 0; attempt < 14; attempt++) {
      if (fromEdge) {
        const left = Math.random() < 0.5;
        x = left ? PAD + 8 : WORLD_W - PAD - 8;
        dir = left ? 1 : -1;
        y = HAB_TOP + Math.random() * (HAB_BOT - HAB_TOP);
      } else if (player && Math.random() < 0.62) {
        x = player.x + (Math.random() - 0.5) * 1200;
        y = player.y + (Math.random() - 0.5) * 700;
        dir = Math.random() < 0.5 ? -1 : 1;
      } else {
        x = PAD + Math.random() * (WORLD_W - PAD * 2);
        y = HAB_TOP + Math.random() * (HAB_BOT - HAB_TOP);
        dir = Math.random() < 0.5 ? -1 : 1;
      }
      x = clamp(x, PAD, WORLD_W - PAD);
      y = clamp(y, HAB_TOP, HAB_BOT);
      if (!player || Math.hypot(x - player.x, y - player.y) > 280) break;
    }
    if (player && Math.hypot(x - player.x, y - player.y) < 280) {
      x = player.x < WORLD_W / 2 ? WORLD_W - PAD - 8 : PAD + 8;
      y = clamp(player.y, HAB_TOP, HAB_BOT);
      dir = x < player.x ? 1 : -1;
    }
    return {
      x,
      y,
      baseY: y,
      vx: dir * speed,
      species: tier.species,
      mass,
      facing: dir,
      anim: Math.random() * 10,
      bobT: Math.random() * Math.PI * 2,
      bobF: 0.7 + Math.random() * 0.9,
      bobA: 16 + Math.random() * 26,
      turnIn: 3 + Math.random() * 6,
      alive: true,
      isPlayer: false,
      pop: 0,
    };
  }

  growthMul(species, mass) {
    const [lo, hi] = SIZE_WINDOW[species];
    const t = clamp((mass - lo) / (hi - lo), 0, 1);
    return 0.84 + t * 0.36;
  }

  speciesForMass(mass) {
    let species = 0;
    for (let i = 1; i < EVOLVE_AT.length; i++) {
      if (mass >= EVOLVE_AT[i]) species = i;
    }
    return species;
  }

  radiusOf(dino) {
    return spriteSize(dino.species, this.growthMul(dino.species, dino.mass)).r;
  }

  update(dt, input) {
    if (this.mode === "over") {
      this.updateFx(dt);
      return;
    }
    if (this.mode === "evolve") {
      this.evolveT -= dt;
      if (this.player) this.player.anim += dt * 8;
      if (this.evolveT <= 0) this.mode = "play";
      this.updateFx(dt);
      this.updateCamera(dt);
      return;
    }
    this.updateAI(dt);
    if (this.mode === "play" && this.player) this.updatePlayer(dt, input);
    if (this.mode === "play" || this.mode === "menu") this.handleCollisions();
    if (this.mode === "over") {
      this.updateFx(dt);
      return;
    }
    this.replenish();
    this.updateFx(dt);
    this.updateCamera(dt);
  }

  updateAI(dt) {
    for (const ai of this.ais) {
      ai.bobT += dt * ai.bobF;
      ai.turnIn -= dt;
      if (ai.turnIn <= 0) {
        if (Math.random() < 0.35) ai.vx *= -1;
        ai.turnIn = 3.5 + Math.random() * 6;
      }
      ai.x += ai.vx * dt;
      ai.y = ai.baseY + Math.sin(ai.bobT) * ai.bobA;
      if (ai.x < PAD) {
        ai.x = PAD;
        ai.vx = Math.abs(ai.vx);
      } else if (ai.x > WORLD_W - PAD) {
        ai.x = WORLD_W - PAD;
        ai.vx = -Math.abs(ai.vx);
      }
      if (ai.y < PAD) ai.baseY += PAD - ai.y;
      else if (ai.y > WORLD_H - PAD) ai.baseY -= ai.y - (WORLD_H - PAD);
      ai.y = ai.baseY + Math.sin(ai.bobT) * ai.bobA;
      ai.facing = ai.vx >= 0 ? 1 : -1;
      ai.anim += dt * (7 + Math.abs(ai.vx) / 38);
    }
  }

  updatePlayer(dt, input) {
    const player = this.player;
    const speed = 215 * Math.pow(START_MASS / player.mass, 0.1);
    let vx = 0;
    let vy = 0;
    if (input.keyboard) {
      const len = Math.hypot(input.kx, input.ky) || 1;
      vx = (input.kx / len) * speed;
      vy = (input.ky / len) * speed;
    } else if (input.hasMouse) {
      const target = this.screenToWorld(input.mouseX, input.mouseY);
      const dx = target.x - player.x;
      const dy = target.y - player.y;
      const dist = Math.hypot(dx, dy);
      if (dist > 14) {
        vx = (dx / dist) * speed;
        vy = (dy / dist) * speed;
      }
    }
    player.vx = vx;
    player.vy = vy;
    player.x = clamp(player.x + vx * dt, PAD, WORLD_W - PAD);
    player.y = clamp(player.y + vy * dt, PAD, WORLD_H - PAD);
    if (vx > 10) player.facing = 1;
    else if (vx < -10) player.facing = -1;
    const moving = Math.hypot(vx, vy);
    player.anim += dt * (moving > 8 ? 8 + moving / 40 : 3);
  }

  handleCollisions() {
    const list = this.player && this.player.alive ? this.ais.concat(this.player) : this.ais.slice();
    if (list.length < 2) return;
    const planned = [];
    for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length; j++) {
        const a = list[i];
        const b = list[j];
        const ra = this.radiusOf(a);
        const rb = this.radiusOf(b);
        let dx = b.x - a.x;
        let dy = b.y - a.y;
        let dist = Math.hypot(dx, dy);
        if (dist < 1e-4) {
          dx = 1;
          dy = 0;
          dist = 1;
        }
        const reach = ra + rb;
        if (dist >= reach) continue;
        if (Math.abs(a.mass - b.mass) <= MASS_EPS) {
          this.separate(a, b, dx / dist, dy / dist, reach - dist);
          continue;
        }
        const winner = a.mass > b.mass ? a : b;
        const loser = winner === a ? b : a;
        planned.push({ winner, loser });
      }
    }
    const eaten = new Set(planned.map((pair) => pair.loser));
    planned.sort((a, b) => Number(b.winner.isPlayer) - Number(a.winner.isPlayer));
    const consumed = new Set();
    let died = false;
    for (const { winner, loser } of planned) {
      if (eaten.has(winner) || consumed.has(loser)) continue;
      consumed.add(loser);
      if (loser.isPlayer) {
        died = true;
        this.growAI(winner, loser);
        continue;
      }
      this.devour(winner, loser);
    }
    if (consumed.size) this.ais = this.ais.filter((ai) => !consumed.has(ai));
    if (died) {
      this.die();
      return;
    }
    if (this.player && this.player.alive && this.speciesForMass(this.player.mass) > this.player.species) {
      this.beginEvolve();
    }
  }

  separate(a, b, nx, ny, overlap) {
    const push = (overlap + 1) * 0.5;
    a.x = clamp(a.x - nx * push, PAD, WORLD_W - PAD);
    a.y = clamp(a.y - ny * push, PAD, WORLD_H - PAD);
    b.x = clamp(b.x + nx * push, PAD, WORLD_W - PAD);
    b.y = clamp(b.y + ny * push, PAD, WORLD_H - PAD);
    if (!a.isPlayer) a.baseY = a.y;
    if (!b.isPlayer) b.baseY = b.y;
  }

  growAI(winner, loser) {
    if (!winner || winner.isPlayer) return;
    const cap = TIERS[winner.species].mass[1];
    const gain = Math.sqrt(loser.mass) * GROWTH * 0.3;
    winner.mass = Math.min(cap, winner.mass + gain);
  }

  devour(winner, loser) {
    const gain = Math.sqrt(loser.mass) * GROWTH;
    if (winner.isPlayer) {
      winner.mass += gain;
      winner.pop = 1;
      const points = Math.max(1, Math.round(loser.mass));
      this.score += points;
      if (this.score > this.best) {
        this.best = this.score;
        this.onBest(this.best);
      }
      this.floaters.push({
        x: loser.x,
        y: loser.y - 24,
        text: `+${points}`,
        life: 0.9,
      });
      this.spawnBurst(loser.x, loser.y, SPECIES[loser.species].palette.b, 8);
      this.shake = Math.max(this.shake, 3);
      this.onEat();
    } else {
      this.growAI(winner, loser);
      this.spawnBurst(loser.x, loser.y, SPECIES[loser.species].palette.b, 5);
    }
  }

  beginEvolve() {
    const next = this.speciesForMass(this.player.mass);
    this.player.species = next;
    this.player.pop = 1;
    this.evolveName = SPECIES[next].name;
    this.evolveT = 1.2;
    this.mode = "evolve";
    this.shake = Math.max(this.shake, 6);
    this.flash = 0.38;
    this.flashColor = "232, 190, 80";
    this.onEvolve(this.evolveName);
  }

  die() {
    if (!this.player || this.mode === "over") return;
    this.player.alive = false;
    this.mode = "over";
    this.shake = 12;
    this.flash = 0.55;
    this.flashColor = "140, 32, 24";
    this.spawnBurst(this.player.x, this.player.y, "#f3ead8", 16);
    this.onDie();
  }

  replenish() {
    let guard = 3;
    while (this.ais.length < TARGET_AI && guard-- > 0) {
      this.ais.push(this.makeAI(true));
    }
  }

  spawnBurst(x, y, color, count) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 40 + Math.random() * 150;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0.28 + Math.random() * 0.28,
        color,
        s: 4 + Math.random() * 5,
      });
    }
    if (this.particles.length > 120) this.particles.splice(0, this.particles.length - 120);
  }

  updateFx(dt) {
    if (this.player) this.player.pop = Math.max(0, this.player.pop - dt * 2.5);
    this.flash = Math.max(0, this.flash - dt * 1.3);
    this.shake = Math.max(0, this.shake - dt * 18);
    for (const p of this.particles) {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life -= dt;
    }
    this.particles = this.particles.filter((p) => p.life > 0);
    for (const f of this.floaters) {
      f.y -= 40 * dt;
      f.life -= dt;
    }
    this.floaters = this.floaters.filter((f) => f.life > 0);
  }

  updateCamera(dt) {
    let focusX = WORLD_W * 0.5;
    let focusY = SCENE_Y;
    let mass = START_MASS;
    if (this.player && this.mode !== "menu") {
      focusX = this.player.x;
      focusY = this.player.y;
      mass = this.player.mass;
    }
    const targetZoom = clamp(1.9 / Math.pow(mass / START_MASS, 0.22), 0.95, 1.9);
    const blend = (a, b, k) => a + (b - a) * Math.min(1, k);
    if (this.cam.snap) {
      this.cam.zoom = targetZoom;
    } else {
      this.cam.zoom = blend(this.cam.zoom, targetZoom, dt * 1.35);
    }
    const viewWorldW = this.viewW / this.cam.zoom;
    const viewWorldH = this.viewH / this.cam.zoom;
    let tx = focusX - viewWorldW / 2;
    let ty = focusY - viewWorldH / 2;
    tx = clamp(tx, 0, Math.max(0, WORLD_W - viewWorldW));
    ty = clamp(ty, 0, Math.max(0, WORLD_H - viewWorldH));
    if (this.cam.snap) {
      this.cam.x = tx;
      this.cam.y = ty;
      this.cam.snap = false;
    } else {
      this.cam.x = blend(this.cam.x, tx, dt * 4.5);
      this.cam.y = blend(this.cam.y, ty, dt * 4.5);
    }
  }

  screenToWorld(sx, sy) {
    return {
      x: sx / this.cam.zoom + this.cam.x,
      y: sy / this.cam.zoom + this.cam.y,
    };
  }

  worldToScreen(wx, wy) {
    return {
      x: (wx - this.cam.x) * this.cam.zoom,
      y: (wy - this.cam.y) * this.cam.zoom,
    };
  }

  render() {
    const ctx = this.ctx;
    const dpr = this.dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = "#67b6d6";
    ctx.fillRect(0, 0, this.viewW, this.viewH);

    const z = this.cam.zoom;
    const shakeX = this.shake ? (Math.random() - 0.5) * this.shake : 0;
    const shakeY = this.shake ? (Math.random() - 0.5) * this.shake : 0;
    ctx.setTransform(z * dpr, 0, 0, z * dpr, Math.round((-this.cam.x * z + shakeX) * dpr), Math.round((-this.cam.y * z + shakeY) * dpr));
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(this.bg, 0, 0);

    const herd = this.ais.slice().sort((a, b) => a.y - b.y);
    for (const ai of herd) this.drawOne(ctx, ai);
    if (this.player && this.player.alive) this.drawOne(ctx, this.player);

    for (const p of this.particles) {
      ctx.globalAlpha = clamp(p.life * 3, 0, 1);
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, p.s, p.s);
    }
    ctx.globalAlpha = 1;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingEnabled = false;
    if (this.flash > 0) {
      ctx.fillStyle = `rgba(${this.flashColor}, ${this.flash})`;
      ctx.fillRect(0, 0, this.viewW, this.viewH);
    }
    ctx.font = "bold 22px SimSun, Microsoft YaHei, monospace";
    ctx.textAlign = "center";
    ctx.lineWidth = 3;
    for (const floater of this.floaters) {
      const s = this.worldToScreen(floater.x, floater.y);
      ctx.strokeStyle = "#1a120c";
      ctx.fillStyle = "#fff6d0";
      ctx.strokeText(floater.text, s.x, s.y);
      ctx.fillText(floater.text, s.x, s.y);
    }
  }

  drawOne(ctx, dino) {
    const mul = this.growthMul(dino.species, dino.mass) * (dino.pop ? 1 + dino.pop * 0.14 : 1);
    const { dw } = spriteSize(dino.species, mul);
    drawShadow(ctx, dino.x, dino.y + dw * 0.05, dw * 0.32);
    const frame = Math.floor(dino.anim) % 2;
    const bounds = drawDino(ctx, dino.species, frame, dino.x, dino.y, mul, dino.facing < 0);
    if (!dino.isPlayer) return;
    ctx.fillStyle = "#ffd56a";
    const s = 5;
    const top = bounds.top - 8;
    ctx.fillRect(dino.x - s / 2, top - 12, s, s);
    ctx.fillRect(dino.x - s * 1.6, top - 7, s, s);
    ctx.fillRect(dino.x + s * 0.6, top - 7, s, s);
  }
}
