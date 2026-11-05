// Three.js scene for the process story: one persistent scene, one fixed
// camera (straight-on, no movement). Everything is a pure function of
// t ∈ [0, 4] (the scrubbed scroll position, one unit per 100vh), so
// scrolling back reverses it exactly.
//
// ONE production axis: every stream, intake, outlet and the bottle neck sit
// on x = AXIS_X (the horizontal centre of the canvas). Machines move along
// that axis, in and out through the top/bottom edges; the axis never moves.
//
// Machines are drawn like engineering drawings: flat toon fills, ink
// outlines and edge lines, no shine. They are self-contained housings (no
// legs or rails).
//
//   01 (0–1)  a whole coconut rises in from the bottom and stops at the
//             centre; it swells, pops open, and shavings come off the white
//             flesh and gather into one stream down the axis. The halves
//             leave through the top.
//   02 (1–2)  the tank hydraulic press rises in from the bottom; its hopper
//             catches the stream through the platen's feed tube, the twin
//             rams pull the platen down into the tank, and coconut milk drips
//             from the bottom outlet.
//   03 (2–3)  the press leaves through the top while the milk keeps
//             dripping; the open-top transparent centrifuge rises in, fills,
//             spins, and the milk separates into water, cream and oil. Oil
//             runs down the central standpipe and out of the bottom outlet.
//   04 (3–4)  the centrifuge leaves through the top while the oil keeps
//             running; the 1 L bottle rises in with its neck under the
//             stream (visible inside the glass), fills, the cap drops on and
//             the label is pasted on.
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

export type SceneColors = { machine: string; shave: string; oil: string; glass: string; cap: string };

export const STORY_TOTAL = 4;
export const STORY_STEPS_AT = [0, 1, 2, 3];

// ── the production axis ───────────────────────────────────────────
const AXIS_X = 0;

// ── layout (world units; the camera sees y ∈ ≈ [-3.74, 3.74]) ─────
const CAM_Z = 15;
const SRC_MAX = 5; // a stream source above this is off screen
const COCO_Y = 0; // coconut rests at the centre
const PRESS_Y = 0;
const PRESS_HOPPER = 1.95; // hopper rim, relative to the press origin
const PRESS_OUT = -1.68; // milk outlet
const PRESS_STROKE = 0.72; // platen travel into the tank
const FUGE_Y = 0.4;
const FUGE_FLOOR = -0.88; // inside bottom of the drum
const FUGE_OUT = -1.9; // oil outlet
const FUGE_LIQ = 1.5; // full liquid height
const LAYERS = [0.45, 0.25, 0.3]; // water, cream, oil (fractions of the fill)

// 1 L bottle, built around the label (224 × 477 artwork). Neck top = 0.
const LABEL_W = 1.0;
const LABEL_H = LABEL_W * (477 / 224);
const BOT = { w: 1.2, d: 0.92, r: 0.11, top: -0.55, bottom: -3.05 };
const BOTTLE_Y = 0.15;
const BOTTLE_FLOOR = BOT.bottom + 0.05;
const BOTTLE_FULL = 2.25;

// ── timing (t units, 1 = one 100vh section) ───────────────────────
const CRACK = 0.34;
const T = {
  cocoIn: [0, 0.22],
  swell: [0.24, CRACK],
  pop: [CRACK, CRACK + 0.1],
  cocoOut: [0.85, 1.05],
  shaves: [CRACK + 0.02, 1.45],
  pressIn: [0.95, 1.3],
  compress: [1.62, 1.9],
  pressOut: [1.95, 2.18],
  milk: [1.66, 2.12],
  fugeIn: [2.0, 2.3],
  fugeFill: [2.15, 2.5],
  spin: [2.5, 2.88],
  separate: [2.58, 2.86],
  drain: [2.84, 3.1],
  fugeOut: [2.92, 3.15],
  oil: [2.84, 3.32],
  bottleIn: [3.0, 3.25],
  fill: [3.25, 3.7],
  cap: [3.72, 3.8],
  label: [3.8, 3.97],
} as const;

const V_SHAVE = 14; // fall speed, world units per t
const V_OIL = 18;
const G_BURST = 110;
const GATHER = 0.09; // time for a shaving to reach the axis

const smooth = (x: number) => x * x * (3 - 2 * x);
const backOut = (x: number) => {
  const c1 = 1.70158;
  return 1 + (c1 + 1) * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
};
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const span = (t: number, [a, b]: readonly [number, number]) => clamp01((t - a) / (b - a));

// Enter from `from`, rest at `rest`, leave towards `to`.
const travel = (t: number, from: number, rest: number, to: number, inS: readonly [number, number], outS: readonly [number, number]) =>
  rest + (from - rest) * (1 - smooth(span(t, inS))) + (to - rest) * smooth(span(t, outS));

const cocoY = (t: number) => travel(t, -6, COCO_Y, 6, T.cocoIn, T.cocoOut);
const pressY = (t: number) => travel(t, -9, PRESS_Y, 9, T.pressIn, T.pressOut);
const fugeY = (t: number) => travel(t, -10, FUGE_Y, 12, T.fugeIn, T.fugeOut);
const bottleY = (t: number) => travel(t, -9, BOTTLE_Y, BOTTLE_Y, T.bottleIn, [99, 100]);

// centrifuge liquid: total height, oil part drains down the standpipe
const fugeMix = (t: number) => FUGE_LIQ * span(t, T.fugeFill);
const fugeDrain = (t: number) => smooth(span(t, T.drain)) * 0.9;
const fugeLiquid = (t: number) => fugeMix(t) * (LAYERS[0] + LAYERS[1] + LAYERS[2] * (1 - fugeDrain(t)));
const fugeSurface = (t: number) => fugeY(t) + FUGE_FLOOR + fugeLiquid(t);
const bottleOil = (t: number) => BOTTLE_FULL * span(t, T.fill);

// stream sources, all on the axis
const milkSrc = (t: number) => pressY(t) + PRESS_OUT;
const oilSrc = (t: number) => Math.min(SRC_MAX, fugeY(t) + FUGE_OUT);

// First moment a falling item is inside [lo, hi] (a machine took it in).
function captureTime(te: number, yAt: (t: number) => number, lo: (t: number) => number, hi: (t: number) => number) {
  for (let tt = te; tt < te + 1.5; tt += 0.002) {
    const y = yAt(tt);
    if (y < -7) return Infinity;
    if (y >= lo(tt) && y <= hi(tt)) return tt;
  }
  return Infinity;
}

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

// Fibrous husk texture, drawn once.
function huskTexture() {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 256;
  const g = c.getContext("2d")!;
  g.fillStyle = "#5c3319";
  g.fillRect(0, 0, 512, 256);
  const r = seeded(11);
  for (let i = 0; i < 1600; i++) {
    const x = r() * 512;
    const y = r() * 256;
    const l = 10 + r() * 42;
    const a = Math.PI / 2 + (r() - 0.5) * 0.7;
    g.strokeStyle = r() < 0.55 ? `rgba(160,98,48,${0.3 + r() * 0.45})` : `rgba(38,19,8,${0.3 + r() * 0.4})`;
    g.lineWidth = 0.6 + r() * 1.8;
    g.beginPath();
    g.moveTo(x, y);
    g.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l);
    g.stroke();
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = THREE.RepeatWrapping;
  return t;
}

// Teardrop, point up, centred on its round bottom half.
function teardrop(r: number) {
  const pts: THREE.Vector2[] = [];
  for (let i = 0; i <= 24; i++) {
    const a = (i / 24) * Math.PI;
    pts.push(new THREE.Vector2(r * Math.sin(a) * Math.pow(Math.sin(a / 2), 1.3), r * 1.5 * Math.cos(a)));
  }
  return new THREE.LatheGeometry(pts, 20);
}

export function createProcessScene(container: HTMLElement, colors: SceneColors) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.domElement.style.display = "block";
  renderer.domElement.style.width = "100%";
  renderer.domElement.style.height = "100%";
  container.appendChild(renderer.domElement);

  const disposables: { dispose: () => void }[] = [];
  const keep = <T extends { dispose: () => void }>(x: T) => (disposables.push(x), x);

  const scene = new THREE.Scene();

  // Fixed camera, straight on, centred on the axis.
  const camera = new THREE.PerspectiveCamera(28, 4 / 3, 0.1, 100);
  camera.position.set(AXIS_X, 0, CAM_Z);
  camera.lookAt(AXIS_X, 0, 0);

  scene.add(new THREE.HemisphereLight(0xffffff, 0x0f2a66, 1.2));
  const key = new THREE.DirectionalLight(0xffffff, 1.8);
  key.position.set(4, 7, 8);
  scene.add(key);

  // ── engineering-drawing kit: toon fills, ink outline, edge lines ─
  const INK = "#0a1a44";
  const grad = keep(new THREE.DataTexture(new Uint8Array([150, 205, 255]), 3, 1, THREE.RedFormat));
  grad.minFilter = grad.magFilter = THREE.NearestFilter;
  grad.needsUpdate = true;
  const drawnMats = new Set<THREE.Material>();
  const toon = (c: THREE.ColorRepresentation, side: THREE.Side = THREE.FrontSide) => {
    const m = keep(new THREE.MeshToonMaterial({ color: c, gradientMap: grad, side }));
    drawnMats.add(m);
    return m;
  };
  const fillMain = toon(colors.machine);
  const fillDark = toon(new THREE.Color(colors.machine).multiplyScalar(0.72));
  const fillLight = toon("#eef2f7");
  const fillMetal = toon("#c9d2dc");
  const fillHopper = toon(colors.machine, THREE.DoubleSide);
  const hullMat = keep(new THREE.MeshBasicMaterial({ color: INK, side: THREE.BackSide }));
  hullMat.onBeforeCompile = (sh) => {
    sh.vertexShader = sh.vertexShader.replace("#include <begin_vertex>", "#include <begin_vertex>\ntransformed += normalize(normal) * 0.022;");
  };
  const inkLine = keep(new THREE.LineBasicMaterial({ color: INK }));
  const softLine = keep(new THREE.LineBasicMaterial({ color: colors.glass }));

  // Drawn parts get an ink outline (hull) and edge lines; open shells and
  // tubes skip what would look messy on them.
  const mesh = (geo: THREE.BufferGeometry, mat: THREE.Material) => {
    keep(geo);
    const m = new THREE.Mesh(geo, mat);
    if (!drawnMats.has(mat)) return m;
    const g = new THREE.Group();
    g.add(m);
    const curved = geo instanceof THREE.TorusGeometry || geo instanceof THREE.TubeGeometry;
    if (mat !== fillHopper) g.add(new THREE.Mesh(geo, hullMat));
    if (!curved) g.add(new THREE.LineSegments(keep(new THREE.EdgesGeometry(geo, 25)), inkLine));
    return g;
  };
  const at = <O extends THREE.Object3D>(o: O, x: number, y: number, z = 0) => (o.position.set(x, y, z), o);
  const Cyl = (rt: number, rb: number, h: number, seg = 40, open = false) => new THREE.CylinderGeometry(rt, rb, h, seg, 1, open);
  const Box = (w: number, h: number, d: number) => new THREE.BoxGeometry(w, h, d);
  const ring = (r: number, tube: number, mat: THREE.Material) => {
    const m = mesh(new THREE.TorusGeometry(r, tube, 8, 48), mat);
    m.rotation.x = Math.PI / 2;
    return m;
  };
  const ringLine = (r: number, y: number) => {
    const pts = Array.from({ length: 65 }, (_, i) => {
      const a = (i / 64) * Math.PI * 2;
      return new THREE.Vector3(Math.cos(a) * r, y, Math.sin(a) * r);
    });
    return new THREE.Line(keep(new THREE.BufferGeometry().setFromPoints(pts)), softLine);
  };
  // Silhouette of a symmetric body seen straight on (both sides).
  const profileLine = (profile: [number, number][]) => {
    const right = profile.map(([r, y]) => new THREE.Vector3(r, y, 0));
    const left = [...profile].reverse().map(([r, y]) => new THREE.Vector3(-r, y, 0));
    return new THREE.LineLoop(keep(new THREE.BufferGeometry().setFromPoints([...right, ...left])), softLine);
  };

  // ── liquids and organics ──────────────────────────────────────
  const shaveMat = keep(new THREE.MeshLambertMaterial({ color: colors.shave }));
  const milkMat = keep(new THREE.MeshLambertMaterial({ color: "#fbf8f1" }));
  const oilMat = keep(new THREE.MeshLambertMaterial({ color: colors.oil, emissive: colors.oil, emissiveIntensity: 0.3, transparent: true, opacity: 0.92 }));
  const glassMat = keep(new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.1, depthWrite: false, side: THREE.DoubleSide }));
  const huskMat = keep(new THREE.MeshStandardMaterial({ map: keep(huskTexture()), roughness: 0.95 }));
  const shellMat = keep(new THREE.MeshStandardMaterial({ color: "#3a2110", roughness: 0.8, side: THREE.DoubleSide }));
  const meatMat = keep(new THREE.MeshStandardMaterial({ color: "#f7f4ee", emissive: "#f7f4ee", emissiveIntensity: 0.55, roughness: 0.9, side: THREE.DoubleSide }));

  const loader = new THREE.TextureLoader();
  let onTexture = () => {};
  const tex = (url: string) => {
    const t = loader.load(url, () => onTexture());
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 4;
    return keep(t);
  };

  // ── 01 coconut: whole and solid, then two halves after the pop ─
  const R = 1;
  const MEAT_R = R * 0.86;
  const coco = new THREE.Group();
  const whole = mesh(new THREE.SphereGeometry(R, 48, 32), huskMat);
  coco.add(whole);
  const halves = new THREE.Group();
  const makeHalf = (side: -1 | 1) => {
    const half = new THREE.Group();
    const dome = mesh(new THREE.SphereGeometry(R, 48, 32, side < 0 ? -Math.PI / 2 : Math.PI / 2, Math.PI), huskMat);
    const shell = mesh(new THREE.CircleGeometry(R, 48), shellMat);
    const meat = mesh(new THREE.CircleGeometry(MEAT_R, 48), meatMat);
    // cut faces point at the other half (+x for the left half); flesh is solid
    shell.rotation.y = meat.rotation.y = side < 0 ? Math.PI / 2 : -Math.PI / 2;
    shell.position.x = -side * 0.001;
    meat.position.x = -side * 0.004;
    half.add(dome, shell, meat);
    halves.add(half);
    return half;
  };
  const halfL = makeHalf(-1);
  const halfR = makeHalf(1);
  coco.add(halves);
  scene.add(coco);

  // Coconut pose at time t (used by the render and to find flesh points).
  function poseCoconut(t: number) {
    coco.position.set(AXIS_X, cocoY(t), 0);
    const sw = span(t, T.swell);
    const popped = t >= CRACK;
    whole.visible = !popped;
    halves.visible = popped;
    coco.rotation.z = popped ? 0 : Math.sin(sw * 40) * 0.05 * sw;
    const bulge = popped ? 1 : 1 + 0.08 * sw * sw;
    coco.scale.set(bulge, 1.12 * bulge, bulge);
    const open = popped ? backOut(span(t, T.pop)) : 0;
    halfL.position.x = -0.75 * open;
    halfR.position.x = 0.75 * open;
    // cut faces turn to the camera and tip down to pour
    halfL.rotation.set(0, -0.6 * open, -0.4 * open);
    halfR.rotation.set(0, 0.6 * open, 0.4 * open);
  }
  // A point on the white flesh of one half, in world space, at time t.
  function fleshPoint(t: number, side: -1 | 1, a: number, r: number, out: THREE.Vector3) {
    poseCoconut(t);
    coco.updateMatrixWorld(true);
    out.set(-side * 0.01, Math.sin(a) * r, Math.cos(a) * r);
    return (side < 0 ? halfL : halfR).localToWorld(out);
  }

  // ── shavings: scraped off the flesh, gathering into one stream ─
  const pressLo = (t: number) => pressY(t) + PRESS_OUT;
  const pressHi = (t: number) => pressY(t) + PRESS_HOPPER - 0.2;
  const rnd = seeded(7);
  type Shave = { te: number; p: THREE.Vector3; vel: THREE.Vector3; jx: number; jz: number; burst: boolean; rest: THREE.Euler; spin: THREE.Vector3; tCap: number };
  const shaveY = (s: Shave, t: number) => {
    const u = t - s.te;
    return s.burst ? s.p.y + s.vel.y * u - 0.5 * G_BURST * u * u : s.p.y - V_SHAVE * u;
  };
  const shaves: Shave[] = [];
  const NB = 110;
  const NS = 650;
  for (let i = 0; i < NB + NS; i++) {
    const burst = i < NB;
    const side: -1 | 1 = rnd() < 0.5 ? -1 : 1;
    const te = burst ? CRACK + 0.005 + rnd() * 0.02 : T.shaves[0] + ((i - NB + rnd() * 0.8) / NS) * (T.shaves[1] - T.shaves[0]);
    const p = fleshPoint(te, side, rnd() * Math.PI * 2, Math.sqrt(rnd()) * MEAT_R * 0.92, new THREE.Vector3());
    const s: Shave = {
      te,
      p,
      // burst: flung off the flesh, outward and towards the camera
      vel: new THREE.Vector3(side * (0.4 + rnd() * 1.6), 0.5 + rnd() * 2.5, 0.3 + rnd() * 1.0),
      jx: (rnd() - 0.5) * 0.14,
      jz: (rnd() - 0.5) * 0.14,
      burst,
      rest: new THREE.Euler(rnd() * Math.PI, rnd() * Math.PI, rnd() * Math.PI),
      spin: new THREE.Vector3(rnd() * 30, rnd() * 30, rnd() * 30),
      tCap: Infinity,
    };
    s.tCap = captureTime(s.te, (t) => shaveY(s, t), pressLo, pressHi);
    shaves.push(s);
  }
  const shaveMesh = new THREE.InstancedMesh(keep(new THREE.BoxGeometry(0.12, 0.022, 0.05)), shaveMat, shaves.length);
  shaveMesh.frustumCulled = false;
  scene.add(shaveMesh);

  // ── 02 tank hydraulic press ───────────────────────────────────
  const press = new THREE.Group();
  press.add(at(mesh(Box(3.0, 0.16, 1.3), fillDark), 0, -0.99)); // base plate
  // press tank with hoops, drain cone and outlet on the axis
  press.add(at(mesh(Cyl(0.85, 0.85, 1.6, 48), fillMain), 0, -0.1));
  for (const y of [-0.7, -0.1, 0.5]) press.add(at(ring(0.87, 0.035, fillDark), 0, y));
  press.add(at(mesh(Cyl(0.9, 0.9, 0.08, 48), fillDark), 0, 0.68)); // tank lip
  press.add(at(mesh(Cyl(0.6, 0.14, 0.4), fillMain), 0, -1.27));
  press.add(at(mesh(Cyl(0.07, 0.06, 0.22, 16), fillMetal), 0, PRESS_OUT + 0.11));
  // twin hydraulic cylinders on the base
  for (const sx of [-1, 1]) {
    press.add(at(mesh(Cyl(0.17, 0.17, 1.5, 24), fillDark), sx * 1.2, -0.17));
    press.add(at(mesh(Cyl(0.21, 0.21, 0.1, 24), fillMain), sx * 1.2, 0.6));
    press.add(at(mesh(Cyl(0.21, 0.21, 0.1, 24), fillMain), sx * 1.2, -0.88));
    // hydraulic hose from the bottom port to the top port
    const hose = new THREE.CatmullRomCurve3([
      new THREE.Vector3(sx * 1.2, -0.75, 0.2),
      new THREE.Vector3(sx * 1.45, -0.5, 0.25),
      new THREE.Vector3(sx * 1.45, 0.3, 0.25),
      new THREE.Vector3(sx * 1.2, 0.5, 0.2),
    ]);
    press.add(mesh(new THREE.TubeGeometry(hose, 40, 0.035, 8), fillLight));
  }
  // pressure gauge on the left cylinder
  const gauge = mesh(Cyl(0.13, 0.13, 0.04, 24), fillLight);
  gauge.rotation.x = Math.PI / 2;
  press.add(at(gauge, -1.2, 0.15, 0.2));
  const needle = mesh(Box(0.015, 0.1, 0.01), fillDark);
  press.add(at(needle, -1.2, 0.15, 0.23));
  // moving head: crosshead, rods, platen, feed tube and hopper on the axis
  const head = new THREE.Group();
  head.add(at(mesh(Box(2.75, 0.22, 0.5), fillMain), 0, 1.35));
  for (const sx of [-1, 1]) head.add(at(mesh(Cyl(0.07, 0.07, 0.75, 16), fillMetal), sx * 1.2, 0.95));
  head.add(at(mesh(Cyl(0.8, 0.8, 0.12, 48), fillMetal), 0, 0.82)); // platen
  head.add(at(mesh(Cyl(0.16, 0.16, 0.6, 24), fillMetal), 0, 1.1)); // feed tube
  head.add(at(mesh(Cyl(0.75, 0.18, 0.55, 48, true), fillHopper), 0, 1.68)); // hopper
  head.add(at(ring(0.75, 0.035, fillMain), 0, PRESS_HOPPER));
  press.add(head);
  press.position.x = AXIS_X;
  scene.add(press);

  // ── milk drips (instanced teardrops) ──────────────────────────
  const ND = 70;
  const FORM = 0.04;
  const dripY = (te: number, t: number) => {
    const w = t - te - FORM;
    return milkSrc(te) - 0.08 - (6 * w + 40 * w * w);
  };
  const fugeLo = (t: number) => fugeY(t) + FUGE_OUT;
  const drips = Array.from({ length: ND }, (_, i) => {
    const te = T.milk[0] + (i / ND) * (T.milk[1] - T.milk[0]);
    return { te, tCap: captureTime(te + FORM, (t) => dripY(te, t), fugeLo, fugeSurface) };
  });
  const dripMesh = new THREE.InstancedMesh(keep(teardrop(0.07)), milkMat, ND);
  dripMesh.frustumCulled = false;
  scene.add(dripMesh);

  // ── 03 centrifuge: open top, transparent drum, solid base ──────
  const fuge = new THREE.Group();
  fuge.add(at(mesh(Cyl(1.55, 1.55, 0.7, 48), fillMain), 0, -1.25)); // base housing
  fuge.add(at(mesh(Cyl(1.6, 1.6, 0.1, 48), fillDark), 0, -0.95)); // base band
  for (const x of [-0.6, -0.3, 0, 0.3, 0.6]) fuge.add(at(mesh(Box(0.08, 0.32, 0.04), fillDark), x, -1.3, 1.54)); // vents
  fuge.add(at(mesh(Cyl(0.1, 0.07, 0.3, 16), fillMetal), 0, FUGE_OUT + 0.15)); // outlet
  const drumH = 2.0;
  const drumY = FUGE_FLOOR + drumH / 2;
  const drum = mesh(Cyl(1.4, 1.4, drumH, 64, true), glassMat);
  drum.position.y = drumY;
  drum.renderOrder = 3;
  fuge.add(drum, ringLine(1.4, FUGE_FLOOR + drumH), ringLine(1.4, FUGE_FLOOR), profileLine([[1.4, FUGE_FLOOR], [1.4, FUGE_FLOOR + drumH]]));
  fuge.add(at(ring(1.42, 0.05, fillMain), 0, FUGE_FLOOR + drumH)); // open lip
  const rotor = new THREE.Group();
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2;
    rotor.add(at(mesh(Box(0.06, drumH - 0.1, 0.06), fillLight), Math.cos(a) * 1.36, drumY, Math.sin(a) * 1.36));
  }
  fuge.add(rotor);
  fuge.add(at(mesh(Cyl(0.09, 0.09, 2.2, 16), fillMetal), 0, -0.6)); // standpipe
  const layerGeo = keep(Cyl(1.32, 1.32, 1, 64));
  layerGeo.translate(0, 0.5, 0);
  const MIX = new THREE.Color("#efe9dc");
  const layerTo = [new THREE.Color("#9cc2e8"), new THREE.Color("#f6f1e6"), new THREE.Color(colors.oil)];
  const layers = layerTo.map(() => {
    const m = new THREE.Mesh(layerGeo, keep(new THREE.MeshLambertMaterial({ color: MIX, transparent: true, opacity: 0.88 })));
    m.renderOrder = 1;
    fuge.add(m);
    return m;
  });
  fuge.position.x = AXIS_X;
  scene.add(fuge);

  // oil stream (top-anchored) with teardrops at a free head and a tail
  const streamGeo = keep(Cyl(0.045, 0.045, 1, 12));
  streamGeo.translate(0, -0.5, 0);
  const stream = new THREE.Mesh(streamGeo, oilMat);
  stream.position.x = AXIS_X;
  stream.renderOrder = 1;
  const oilDropGeo = keep(teardrop(0.075));
  const headDrop = new THREE.Mesh(oilDropGeo, oilMat);
  const tailDrop = new THREE.Mesh(oilDropGeo, oilMat);
  scene.add(stream, headDrop, tailDrop);

  // ── 04 the 1 L bottle, sized to its label ─────────────────────
  const bottle = new THREE.Group();
  const bodyH = BOT.top - BOT.bottom;
  const bodyY = (BOT.top + BOT.bottom) / 2;
  const body = mesh(new RoundedBoxGeometry(BOT.w, bodyH, BOT.d, 4, BOT.r), glassMat);
  body.position.y = bodyY;
  const shoulder = mesh(Cyl(0.27, BOT.w / 2, 0.35, 40, true), glassMat);
  shoulder.scale.z = BOT.d / BOT.w;
  shoulder.position.y = BOT.top + 0.175;
  const neck = mesh(Cyl(0.27, 0.27, 0.2, 32, true), glassMat);
  neck.position.y = -0.1;
  body.renderOrder = shoulder.renderOrder = neck.renderOrder = 3;
  bottle.add(
    body,
    shoulder,
    neck,
    profileLine([
      [0, BOT.bottom],
      [BOT.w / 2 - BOT.r, BOT.bottom],
      [BOT.w / 2, BOT.bottom + BOT.r],
      [BOT.w / 2, BOT.top],
      [0.27, BOT.top + 0.35],
      [0.27, 0],
    ]),
  );
  const bottleOilGeo = keep(new RoundedBoxGeometry(BOT.w - 0.08, 1, BOT.d - 0.08, 3, 0.04));
  bottleOilGeo.translate(0, 0.5, 0);
  const oil = new THREE.Mesh(bottleOilGeo, oilMat);
  oil.position.y = BOTTLE_FLOOR;
  oil.renderOrder = 1;
  const cap = new THREE.Group();
  cap.add(mesh(Cyl(0.3, 0.3, 0.3, 32), toon(colors.cap)));
  cap.add(at(mesh(Cyl(0.31, 0.31, 0.05, 32), fillLight), 0, -0.13));
  // label, sized to the artwork, on the front face
  const labelTex = tex("/images/story/label-vco-1l.webp");
  const label = new THREE.Mesh(keep(new THREE.PlaneGeometry(LABEL_W, LABEL_H)), keep(new THREE.MeshBasicMaterial({ map: labelTex })));
  const labelY = BOT.bottom + 0.07 + LABEL_H / 2;
  label.renderOrder = 4;
  bottle.add(oil, cap, label);
  bottle.position.x = AXIS_X;
  scene.add(bottle);

  // ── state as a function of t ──────────────────────────────────
  const m4 = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const e = new THREE.Euler();
  const v = new THREE.Vector3();
  const one = new THREE.Vector3(1, 1, 1);
  const zero = new THREE.Vector3(0, 0, 0);
  const sc = new THREE.Vector3();
  const hide = () => m4.compose(zero, q.identity(), zero);

  let current = -1;
  function apply(t: number) {
    current = t;

    // 01 coconut: rise in, swell and shake, pop open, leave up
    poseCoconut(t);

    // shavings: off the flesh, then gathered into one stream on the axis
    for (let i = 0; i < shaves.length; i++) {
      const s = shaves[i];
      const u = t - s.te;
      const y = shaveY(s, t);
      if (u < 0 || y < -6 || t >= s.tCap) hide();
      else {
        e.set(s.rest.x + s.spin.x * u, s.rest.y + s.spin.y * u, s.rest.z + s.spin.z * u);
        q.setFromEuler(e);
        if (s.burst) {
          v.set(s.p.x + s.vel.x * u, y, s.p.z + s.vel.z * u);
        } else {
          const g = smooth(clamp01(u / GATHER));
          v.set(s.p.x + (AXIS_X + s.jx - s.p.x) * g, y, s.p.z + (s.jz - s.p.z) * g);
        }
        m4.compose(v, q, one);
      }
      shaveMesh.setMatrixAt(i, m4);
    }
    shaveMesh.instanceMatrix.needsUpdate = true;

    // 02 press: rise in, rams pull the platen into the tank, leave up
    press.position.y = pressY(t);
    head.position.y = -PRESS_STROKE * smooth(span(t, T.compress));
    needle.rotation.z = -2.2 * span(t, T.compress) + 1.1;

    // milk teardrops from the outlet, into the open drum
    for (let i = 0; i < ND; i++) {
      const d = drips[i];
      const u = t - d.te;
      if (u < 0 || t >= d.tCap) hide();
      else if (u < FORM) {
        const k = u / FORM; // forming at the outlet
        m4.compose(v.set(AXIS_X, milkSrc(t) - 0.08 * k, 0), q.identity(), sc.set(k, k, k));
      } else {
        const y = dripY(d.te, t);
        if (y < -6) hide();
        else m4.compose(v.set(AXIS_X, y, 0), q.identity(), one);
      }
      dripMesh.setMatrixAt(i, m4);
    }
    dripMesh.instanceMatrix.needsUpdate = true;

    // 03 centrifuge: rise in, fill, spin and separate, drain oil, leave up
    fuge.position.y = fugeY(t);
    const sp = span(t, T.spin);
    rotor.rotation.y = (sp < 0.5 ? 2 * sp * sp : 1 - Math.pow(-2 * sp + 2, 2) / 2) * Math.PI * 12;
    const mix = fugeMix(t);
    const sep = smooth(span(t, T.separate));
    const drain = fugeDrain(t);
    let base = FUGE_FLOOR;
    layers.forEach((m, k) => {
      const h = mix * LAYERS[k] * (k === 2 ? 1 - drain : 1);
      m.visible = h > 0.002;
      m.position.y = base;
      m.scale.y = Math.max(0.0001, h);
      (m.material as THREE.MeshLambertMaterial).color.copy(MIX).lerp(layerTo[k], sep);
      base += h;
    });

    // oil stream on the axis; inside the bottle it runs down to the oil
    const bY = bottleY(t);
    const [o0, o1] = T.oil;
    const headY = oilSrc(o0) - V_OIL * (t - o0);
    const top = t < o1 ? oilSrc(t) : oilSrc(o1) - V_OIL * (t - o1);
    const surface = bY + BOTTLE_FLOOR + bottleOil(t);
    const bottom = Math.max(headY, surface, -6);
    const flowing = t > o0 && top > bottom;
    stream.visible = flowing;
    stream.position.y = top;
    stream.scale.set(1, Math.max(0.0001, top - bottom), 1);
    headDrop.visible = flowing && headY >= surface && headY > -6;
    headDrop.position.set(AXIS_X, headY - 0.06, 0);
    tailDrop.visible = flowing && t >= o1;
    tailDrop.position.set(AXIS_X, top + 0.02, 0);

    // 04 bottle: rise in, fill, cap; the label comes round from the
    // bottle's right side face onto the front and is pressed on
    bottle.position.y = bY;
    oil.scale.y = Math.max(0.0001, bottleOil(t));
    oil.visible = t > T.fill[0];
    const c = span(t, T.cap);
    cap.position.y = 0.11 + (1 - c * c) * 1.8;
    cap.visible = c > 0;
    const ls = smooth(span(t, T.label));
    const settle = span(t, [3.93, 4]);
    // θ: π/2 = flat on the side face, 0 = flat on the front; the path bulges
    // mid-way so the label clears the rounded corner
    const th = (1 - ls) * (Math.PI / 2);
    const bulge = 1 + 0.45 * Math.sin(2 * th);
    label.position.set(Math.sin(th) * (BOT.w / 2 + 0.008) * bulge, labelY, Math.cos(th) * (BOT.d / 2 + 0.008) * bulge);
    label.rotation.set(0, th, 0);
    const squash = 1 + Math.sin(settle * Math.PI) * 0.03;
    label.scale.set(squash, squash, 1);
    label.visible = ls > 0;

    render();
  }

  let raf = 0;
  function render() {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = 0;
      renderer.render(scene, camera);
    });
  }
  onTexture = render;

  const ro = new ResizeObserver(() => {
    const w = container.clientWidth;
    const h = container.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    render();
  });
  ro.observe(container);
  apply(0);

  return {
    setT: (t: number) => {
      if (t !== current) apply(t);
    },
    dispose() {
      cancelAnimationFrame(raf);
      ro.disconnect();
      disposables.forEach((d) => d.dispose());
      shaveMesh.dispose();
      dripMesh.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
