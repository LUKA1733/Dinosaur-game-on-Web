import { Game } from "./game.js";

const BEST_KEY = "dino-eat-dino-highscore";
const canvas = document.getElementById("game");
const hud = document.getElementById("hud");
const hudScore = document.getElementById("hud-score");
const hudSpecies = document.getElementById("hud-species");
const hudBest = document.getElementById("hud-best");
const banner = document.getElementById("banner");
const screenStart = document.getElementById("screen-start");
const screenOver = document.getElementById("screen-over");
const overScore = document.getElementById("over-score");
const overBest = document.getElementById("over-best");
const btnAgain = document.getElementById("btn-again");

const held = new Set();
const mouse = { x: 0, y: 0, moved: false };
let audioCtx = null;

function readBest() {
  try {
    const n = Number(localStorage.getItem(BEST_KEY));
    return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
  } catch (err) {
    return 0;
  }
}

function writeBest(n) {
  try {
    localStorage.setItem(BEST_KEY, String(Math.floor(n)));
  } catch (err) {
    /* storage can be blocked; the in-memory score still shows */
  }
}

function audio() {
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return null;
  if (!audioCtx) audioCtx = new Ctx();
  if (audioCtx.state === "suspended") audioCtx.resume();
  return audioCtx;
}

function tone(ctx, freq, when, dur, type, vol) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, when);
  gain.gain.setValueAtTime(vol, when);
  gain.gain.exponentialRampToValueAtTime(0.001, when + dur);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(when);
  osc.stop(when + dur + 0.02);
}

function playEat() {
  try {
    const ctx = audio();
    if (!ctx) return;
    const t = ctx.currentTime;
    tone(ctx, 520, t, 0.07, "square", 0.06);
    tone(ctx, 780, t + 0.06, 0.09, "square", 0.05);
  } catch (err) {
    /* ignore audio failures */
  }
}

function playEvolve() {
  try {
    const ctx = audio();
    if (!ctx) return;
    const t = ctx.currentTime;
    [523, 659, 784, 1046].forEach((freq, i) => {
      tone(ctx, freq, t + i * 0.09, 0.12, "square", 0.06);
    });
  } catch (err) {
    /* ignore audio failures */
  }
}

function playDie() {
  try {
    const ctx = audio();
    if (!ctx) return;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(240, t);
    osc.frequency.exponentialRampToValueAtTime(70, t + 0.42);
    gain.gain.setValueAtTime(0.05, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.42);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.46);
  } catch (err) {
    /* ignore audio failures */
  }
}

const game = new Game(canvas, readBest());
game.onEat = playEat;
game.onEvolve = playEvolve;
game.onDie = playDie;
game.onBest = writeBest;

function dirFromEvent(e) {
  const code = e.code;
  const key = (e.key || "").toLowerCase();
  if (code === "ArrowLeft" || code === "KeyA" || key === "a" || key === "arrowleft") return "left";
  if (code === "ArrowRight" || code === "KeyD" || key === "d" || key === "arrowright") return "right";
  if (code === "ArrowUp" || code === "KeyW" || key === "w" || key === "arrowup") return "up";
  if (code === "ArrowDown" || code === "KeyS" || key === "s" || key === "arrowdown") return "down";
  return null;
}

function inputState() {
  let kx = 0;
  let ky = 0;
  if (held.has("left")) kx -= 1;
  if (held.has("right")) kx += 1;
  if (held.has("up")) ky -= 1;
  if (held.has("down")) ky += 1;
  return {
    keyboard: kx !== 0 || ky !== 0,
    kx,
    ky,
    mouseX: mouse.x,
    mouseY: mouse.y,
    hasMouse: mouse.moved,
  };
}

function startGame() {
  audio();
  mouse.moved = false;
  held.clear();
  game.start();
}

window.addEventListener("keydown", (e) => {
  const dir = dirFromEvent(e);
  if (dir || e.code === "Space") e.preventDefault();
  if (dir) held.add(dir);
  if (e.code === "Space" && (game.mode === "menu" || game.mode === "over")) startGame();
});

window.addEventListener("keyup", (e) => {
  const dir = dirFromEvent(e);
  if (dir) held.delete(dir);
});

window.addEventListener("blur", () => held.clear());

window.addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect();
  mouse.x = e.clientX - rect.left;
  mouse.y = e.clientY - rect.top;
  mouse.moved = true;
});

screenStart.addEventListener("click", startGame);
btnAgain.addEventListener("click", (e) => {
  e.stopPropagation();
  startGame();
});

function resize() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = window.innerWidth;
  const h = window.innerHeight;
  canvas.width = Math.max(1, Math.floor(w * dpr));
  canvas.height = Math.max(1, Math.floor(h * dpr));
  game.setView(w, h, dpr);
}

window.addEventListener("resize", resize);
resize();

function syncUI() {
  const mode = game.mode;
  document.body.classList.toggle("menu", mode === "menu");
  document.body.classList.toggle("over", mode === "over");
  screenStart.hidden = mode !== "menu";
  screenOver.hidden = mode !== "over";
  hud.hidden = !(mode === "play" || mode === "evolve");
  banner.hidden = mode !== "evolve";
  if (mode === "evolve") banner.textContent = `进化成了${game.evolveName}`;
  hudScore.textContent = String(game.score);
  hudSpecies.textContent = game.speciesName;
  hudBest.textContent = String(game.best);
  if (mode === "over") {
    overScore.textContent = String(game.score);
    overBest.textContent = String(game.best);
  }
}

let last = performance.now();
function frame(now) {
  const dt = Math.min(0.033, (now - last) / 1000);
  last = now;
  game.update(dt, inputState());
  game.render();
  syncUI();
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

window.__dino = { game, held, mouse, startGame };
