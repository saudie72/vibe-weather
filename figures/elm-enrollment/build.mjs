// PeopleSoft ELM 9.2 class enrollment, drawn as an accumulation conveyor.
// node build.mjs [--light]  →  elm-enrollment.html / elm-enrollment-light.html
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as k from "../../.claude/skills/anatomy/kit/iso-kit.mjs";
import { kitScript } from "../../.claude/skills/anatomy/scripts/inline-kit.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const theme = process.argv.includes("--light") ? "light" : "dark";

const WIDTH = 640;
const HEIGHT = 330;

// The class: the model every part and the readout come from.
const MAX_ENROLL = 8;
const MAX_WAIT = 4;
const MIN_ENROLL = 3;
const SLOTS = MAX_ENROLL + MAX_WAIT;

// World layout (x along the belt toward the end stop, y across it, z up).
const PLATE = { x: -122, y: -36, w: 292, d: 92, r: 8 };
const PLATE_H = 12;
const FOOT_H = 5;

const TOKEN_R = 6;
const TOKEN_H = 3;
const PITCH = 13;
const BELT_TOP = 13;
const BELT_HALF = 8;
const RAIL_W = 4;
const BELT0 = -65;
const STOP_X = 150;
const PAD_FACE = STOP_X - 1.5;
const slotX = (i) => PAD_FACE - TOKEN_R - PITCH * i;
const BOUND = slotX(MAX_ENROLL - 1) - PITCH / 2;
const MIN_BOUND = slotX(MIN_ENROLL - 1) - PITCH / 2;

const HX = -75;
const STROKE = 14;
const GX = -30;
const WAIT_X = GX - 9;
const POST_TOP = 46;
const GATE_Z = BELT_TOP + 0.6;
const GATE_H = 18;
const GATE_LIFT = 13;
const DROP_Y = 28;

const P = k.fitProjection(
  [...k.boxCorners(PLATE, -PLATE_H - FOOT_H, 0), [GX, 0, 63], [HX, 0, 44], [STOP_X + 10, 14, 22]],
  WIDTH,
  HEIGHT,
  { pad: 30, azimuth: 55 },
);

const at = (point) => k.iso(point, P);
const S = (paths, style) => k.solidSvg(paths, style);
const L = (d, style) => k.lineSvg(d, style);
const D = (points, style) => k.dotsSvg(points, style);
const byDepth = (points) => [...points].sort((a, b) => k.depthOf([a[0], a[1], 0], P) - k.depthOf([b[0], b[1], 0], P));

function base() {
  const out = [`<path class="iso-halo" d="${k.haloOf(PLATE, -PLATE_H - FOOT_H, PLATE_H, P)}"/>`];
  for (const [x, y] of byDepth(k.corners(PLATE, 22))) {
    out.push(S(k.cylinder(x, y, 7, -PLATE_H - FOOT_H, 1.6, P, 28), { tone: "lo" }));
    out.push(S(k.cylinder(x, y, 5.4, -PLATE_H - FOOT_H + 1.6, FOOT_H - 1.6, P, 28), { tone: "mid" }));
  }
  out.push(S(k.slabOf(PLATE, -PLATE_H, PLATE_H, P, 8, 1.6), { tone: "mid" }));
  out.push(L(k.planOutline(k.insetPlan(PLATE, 5), 0, P), { tone: "lo" }));
  const screws = k.corners(PLATE, 10);
  out.push(L(screws.map(([x, y]) => k.ring(x, y, 2.2, 0, P, 16)).join(""), { tone: "lo" }));
  out.push(D(screws.map(([x, y]) => at([x, y, 0])), { size: 0.5 }));

  // Ruler under the slots: a major tick at every slot boundary.
  const from = slotX(SLOTS - 1) - PITCH / 2;
  const strip = { x: from - 3, y: 44, w: PAD_FACE - from + 6, d: 7, r: 1 };
  out.push(S(k.slabOf(strip, 0, 0.6, P, 3), { tone: "lo", crease: "none" }));
  const ticks = k.topTicks(from, PAD_FACE, PITCH / 2, 2, strip.y + 0.8, 0.6, [2, 3.6], P);
  out.push(L(ticks.minor, { tone: "lo" }), L(ticks.major, { tone: "mid" }));
  out.push(L(k.lineOnTop([BOUND, strip.y + 0.8], [BOUND, strip.y + 5.6], 0.6, P), { tone: "hi" }));
  out.push(D([at([strip.x + 1.5, strip.y + 3.5, 0.6]), at([strip.x + strip.w - 1.5, strip.y + 3.5, 0.6])], { size: 0.45 }));

  // Drop pad in front of the belt: where a dropped learner's token lands.
  const pad = { x: from - 1, y: DROP_Y - 8, w: PAD_FACE - from + 2, d: 16, r: 2 };
  out.push(S(k.slabOf(pad, 0, 0.8, P, 4, 0.4), { tone: "lo" }));
  out.push(L(k.planOutline(k.insetPlan(pad, 2), 0.8, P, 4), { tone: "faint" }));
  out.push(D(k.corners(pad, 3.5).map(([x, y]) => at([x, y, 0.8])), { size: 0.4 }));

  // Label plate with the one engraved label.
  const label = { x: -104, y: 22, w: 46, d: 18, r: 1.5 };
  out.push(S(k.slabOf(label, 0, 0.8, P, 4), { tone: "lo" }));
  out.push(L(k.planOutline(k.insetPlan(label, 1.6), 0.8, P, 4), { tone: "faint" }));
  out.push(k.faceTextSvg(k.topMatrix([label.x + 5, label.y + 7.4], 0.8, P, "x"), "ELM 9.2", { size: 3.4, tone: "mid" }));
  [[30, 10.6], [22, 13], [26, 15.4]].forEach(([length, y]) => {
    out.push(L(k.lineOnTop([label.x + 5, label.y + y], [label.x + 5 + length, label.y + y], 0.8, P), { tone: "lo", free: true }));
  });
  out.push(D([at([label.x + 42, label.y + 3.5, 0.8]), at([label.x + 42, label.y + 14.5, 0.8])], { size: 0.45 }));
  return out.join("");
}

function legs(side) {
  const y = side < 0 ? -BELT_HALF - RAIL_W : BELT_HALF;
  return [-56, -6, 44, 94, 136]
    .map((x) => S(k.slabOf({ x: x - 3, y: y + 0.5, w: 6, d: RAIL_W - 1, r: 0.8 }, 0, 4, P, 2), { tone: "lo" }))
    .join("");
}

function rail(side) {
  const y = side < 0 ? -BELT_HALF - RAIL_W : BELT_HALF;
  const out = [];
  // Two sections: waitlist rail, then roster rail, with a joint at the capacity boundary.
  for (const [x0, x1] of [[BELT0, BOUND - 0.3], [BOUND + 0.3, STOP_X]]) {
    out.push(S(k.slabOf({ x: x0, y, w: x1 - x0, d: RAIL_W, r: 0.8 }, 4, BELT_TOP - 4, P, 3, 0.4), { tone: "mid" }));
    out.push(D([x0 + 4, x1 - 4].map((x) => at([x, y + RAIL_W / 2, BELT_TOP])), { size: 0.4 }));
  }
  if (side > 0) out.push(D([-50, -20, 10, 40, 70, 100, 130].map((x) => at([x, y + RAIL_W, (4 + BELT_TOP) / 2])), { size: 0.45, tone: "lo" }));
  // Slot marks on the rail top, edge to edge.
  const marks = [];
  for (let i = 0; i <= SLOTS; i++) {
    const x = slotX(i) + PITCH / 2;
    if (Math.abs(x - BOUND) > 0.5 && x > BELT0 + 1 && x < STOP_X - 1) marks.push(k.lineOnTop([x, y], [x, y + RAIL_W], BELT_TOP, P));
  }
  out.push(L(marks.join(""), { tone: "faint" }));
  return out.join("");
}

function belt() {
  const plan = { x: BELT0, y: -BELT_HALF, w: STOP_X - BELT0, d: BELT_HALF * 2, r: 0.4 };
  return S(k.slabOf(plan, 4, BELT_TOP - 4, P, 2), { tone: "lo", crease: "none" });
}

const ribsAt = (phase) => {
  const span = 144 - (BELT0 + 2);
  const out = [];
  for (let x0 = 0; x0 < span; x0 += 6) {
    const x = BELT0 + 2 + ((x0 + phase) % span + span) % span;
    out.push(k.lineOnTop([x, -BELT_HALF], [x, BELT_HALF], BELT_TOP, P));
  }
  return out.join("");
};

function endStop() {
  const out = [];
  const block = { x: STOP_X, y: -14, w: 10, d: 28, r: 1.5 };
  out.push(S(k.slabOf(block, 0, 22, P, 4, 0.6), { tone: "mid", inner: L(k.sideSeam(block, 6, P, 4), { tone: "faint" }) }));
  out.push(D([[STOP_X + 5, -9], [STOP_X + 5, 9]].map(([x, y]) => at([x, y, 22])), { size: 0.5 }));
  out.push(L([[STOP_X + 5, -9], [STOP_X + 5, 9]].map(([x, y]) => k.ring(x, y, 1.6, 22, P, 12)).join(""), { tone: "lo" }));
  out.push(S(k.slabOf({ x: PAD_FACE, y: -7, w: 1.5, d: 14, r: 0.5 }, BELT_TOP + 0.2, 6, P, 2), { tone: "lo" }));
  return out.join("");
}

function markers() {
  const out = [];
  const y = -BELT_HALF - RAIL_W / 2;
  // Minimum enrollment: a short post.
  out.push(S(k.cylinder(MIN_BOUND, y, 1.1, BELT_TOP, 13, P, 16), { tone: "lo", crease: "none" }));
  out.push(S(k.cylinder(MIN_BOUND, y, 1.8, BELT_TOP + 13, 1.6, P, 16), { tone: "lo" }));
  // Maximum enrollment: the capacity post with an arm reaching over the belt.
  out.push(S(k.cylinder(BOUND, y, 2.6, BELT_TOP, 1.4, P, 20), { tone: "mid" }));
  out.push(S(k.cylinder(BOUND, y, 1.3, BELT_TOP + 1.4, 22, P, 16), { tone: "mid", crease: "none" }));
  out.push(L(k.sideArc(BOUND, y, 1.3, BELT_TOP + 12, P, 10), { tone: "faint" }));
  const arm = { x: BOUND - 1.6, y: y - 1.6, w: 3.2, d: 8.6, r: 0.8 };
  out.push(S(k.slabOf(arm, BELT_TOP + 23.4, 3, P, 2, 0.3), { tone: "hi", crease: "lo" }));
  out.push(D([at([BOUND, y, BELT_TOP + 26.4])], { size: 0.45, tone: "lo" }));
  return out.join("");
}

function hopperBack() {
  const out = [];
  const platform = { x: HX - 10, y: -10, w: 20, d: 20, r: 1.5 };
  out.push(S(k.slabOf(platform, 0, BELT_TOP, P, 4, 0.6), { tone: "mid", inner: L(k.sideSeam(platform, 4, P, 4), { tone: "faint" }) }));
  out.push(L(k.lineOnTop([HX + 10, -6.5], [HX - 10, -6.5], BELT_TOP, P) + k.lineOnTop([HX + 10, 6.5], [HX - 10, 6.5], BELT_TOP, P), { tone: "faint" }));
  // Pusher actuator.
  const body = { x: -112, y: -6, w: 20, d: 12, r: 2 };
  out.push(S(k.slabOf(body, 0, 18, P, 4, 0.6), { tone: "mid", inner: L(k.sideSeam(body, 9, P, 4), { tone: "faint" }) }));
  out.push(D([[-108, -3], [-108, 3], [-96, -3], [-96, 3]].map(([x, y]) => at([x, y, 18])), { size: 0.4 }));
  out.push(S(k.cylinder(-102, 0, 2, 18, 1.6, P, 16), { tone: "lo" }));
  // Back guide rod of the magazine.
  out.push(S(k.cylinder(HX, -8.5, 1.3, BELT_TOP, 27, P, 16), { tone: "mid", crease: "none" }));
  return out.join("");
}

// The pusher: rod and shoe, built at rest and moved along x. The rod is clipped at the actuator face.
function pusher() {
  const clip = k.slabOf({ x: -92, y: -4, w: 40, d: 8, r: 0 }, 10, 12, P, 1).fill;
  const rod = S(k.slabOf({ x: -112, y: -1, w: 24, d: 2, r: 0.8 }, 14, 1.6, P, 2), { tone: "mid", crease: "none" });
  const shoe = S(k.slabOf({ x: HX - 6.5 - 6, y: -5.5, w: 6, d: 11, r: 1 }, BELT_TOP + 0.2, TOKEN_H, P, 3, 0.3), { tone: "mid" });
  return `<clipPath id="elm-rod"><path d="${clip}"/></clipPath><g clip-path="url(#elm-rod)"><g data-part="rod">${rod}</g></g><g data-part="shoe">${shoe}</g>`;
}

function gateBack() {
  const out = [];
  const post = { x: GX - 2.5, y: -BELT_HALF - RAIL_W - 5, w: 5, d: 5, r: 0.8 };
  out.push(S(k.slabOf({ x: GX - 5, y: post.y - 1, w: 10, d: 7, r: 1 }, 0, 3, P, 3), { tone: "lo" }));
  out.push(S(k.slabOf(post, 3, POST_TOP - 3, P, 3, 0.4), { tone: "mid" }));
  return out.join("");
}

function gateFront() {
  const out = [];
  // Front guide rod and cap of the magazine.
  out.push(S(k.cylinder(HX, 8.5, 1.3, BELT_TOP, 27, P, 16), { tone: "mid", crease: "none" }));
  const cap = { x: HX - 3, y: -10.5, w: 6, d: 21, r: 1 };
  out.push(S(k.slabOf(cap, BELT_TOP + 27, 3, P, 3, 0.4), { tone: "mid" }));
  out.push(D([at([HX, -8.5, BELT_TOP + 30]), at([HX, 8.5, BELT_TOP + 30])], { size: 0.45 }));
  // Gate plate (moving), front post, head, approval box and lamp.
  const plate = { x: GX - 1.2, y: -BELT_HALF - RAIL_W + 0.5, w: 2.4, d: (BELT_HALF + RAIL_W - 0.5) * 2, r: 0.4 };
  out.push(`<g data-part="gate">${S(k.slabOf(plate, GATE_Z, GATE_H, P, 2, 0.3), { tone: "hi", crease: "lo" })}</g>`);
  const post = { x: GX - 2.5, y: BELT_HALF + RAIL_W, w: 5, d: 5, r: 0.8 };
  out.push(S(k.slabOf({ x: GX - 5, y: post.y - 1, w: 10, d: 7, r: 1 }, 0, 3, P, 3), { tone: "lo" }));
  out.push(S(k.slabOf(post, 3, POST_TOP - 3, P, 3, 0.4), { tone: "mid", inner: L(k.sideSeam(post, GATE_Z, P, 3), { tone: "faint" }) }));
  const head = { x: GX - 4, y: -BELT_HALF - RAIL_W - 5, w: 8, d: (BELT_HALF + RAIL_W + 5) * 2, r: 1 };
  out.push(S(k.slabOf(head, POST_TOP, 6, P, 3, 0.5), { tone: "mid" }));
  out.push(D([at([GX, head.y + 2.5, POST_TOP + 6]), at([GX, -head.y - 2.5, POST_TOP + 6])], { size: 0.45 }));
  const box = { x: GX - 5, y: -8, w: 10, d: 16, r: 1.5 };
  out.push(S(k.slabOf(box, POST_TOP + 6, 8, P, 4, 0.6), { tone: "mid", inner: L(k.sideSeam(box, POST_TOP + 10, P, 4), { tone: "faint" }) }));
  out.push(L(k.planOutline(k.insetPlan(box, 1.8), POST_TOP + 14, P, 4), { tone: "faint" }));
  out.push(D(k.corners(box, 2.6).filter(([, y]) => y < 0).map(([x, y]) => at([x, y, POST_TOP + 14])), { size: 0.4 }));
  const lamp = (lit) => S(k.cylinder(GX, 3.5, 2.2, POST_TOP + 14, 2.4, P, 20), lit ? { tone: "hi", lit: true } : { tone: "lo" });
  out.push(`<g data-part="lamp-off">${lamp(false)}</g><g data-part="lamp-on" style="display:none">${lamp(true)}</g>`);
  return out.join("");
}

const token = (lit) =>
  S(k.cylinder(0, 0, TOKEN_R, 0, TOKEN_H, P, 40, 0.5), lit ? { tone: "hi", lit: true } : { tone: "hi", crease: "lo" }) +
  L(k.ring(0, 0, TOKEN_R - 1.8, TOKEN_H, P, 32), { tone: lit ? "hi" : "lo" }) +
  D([at([0, 0, TOKEN_H])], { size: 0.5, tone: lit ? "hi" : "mid" });

const svg = k.figureSvg({
  width: WIDTH,
  height: HEIGHT,
  label:
    "An accumulation conveyor on a bench plate, standing for a PeopleSoft ELM 9.2 class. Learner tokens wait in a magazine, a pusher feeds them to an approval gate, and when the gate lifts the belt carries each token until it rests against the tokens ahead. The first eight places against the end stop are the class roster; a capacity post marks the boundary, and the four places behind it are the waitlist. When a token is lifted off onto the drop pad, everything behind it slides forward one place.",
  body: [
    base(),
    legs(-1),
    rail(-1),
    belt(),
    `<path data-part="ribs" class="iso-line" data-tone="faint" d="${ribsAt(0)}"/>`,
    legs(1),
    rail(1),
    markers(),
    gateBack(),
    hopperBack(),
    pusher(),
    `<g data-layer="back"></g>`,
    gateFront(),
    `<g data-layer="front"></g>`,
    endStop(),
    `<g data-layer="drop"></g>`,
    `<g data-template="token" style="display:none"><g data-look="plain">${token(false)}</g><g data-look="lit" style="display:none">${token(true)}</g></g>`,
  ],
});

const C = { MAX_ENROLL, MAX_WAIT, SLOTS, TOKEN_H, PITCH, BELT_TOP, BELT_HALF, BELT0, PAD_FACE, TOKEN_R, HX, STROKE, GX, WAIT_X, GATE_LIFT, DROP_Y, BOUND };

const live = `
const P = ${JSON.stringify(P)};
const C = ${JSON.stringify(C)};
const ribsAt = ${ribsAt.toString().replaceAll("k.lineOnTop", "lineOnTop").replace(/BELT0|BELT_HALF|BELT_TOP/g, (name) => "C." + name)};
const slotX = (i) => C.PAD_FACE - C.TOKEN_R - C.PITCH * i;
const stage = document.querySelector(".iso-stage");
const svg = stage.querySelector("svg");
const part = (name) => svg.querySelector('[data-part="' + name + '"]');
const layers = { back: svg.querySelector('[data-layer="back"]'), front: svg.querySelector('[data-layer="front"]'), drop: svg.querySelector('[data-layer="drop"]') };
const layerOf = (t) => (t.state === "drop" ? "drop" : t.x < C.GX ? "back" : "front");
const template = svg.querySelector('[data-template="token"]');
const readout = document.querySelector("[data-readout]");
const still = matchMedia("(prefers-reduced-motion: reduce)");
const SPEED = 46;

let nextId = 1;
const tokens = [];
const make = (x, y, z) => {
  const el = template.cloneNode(true);
  el.removeAttribute("data-template");
  el.style.display = "";
  const t = { id: nextId++, x, y, z, alpha: 1, el, lit: false, layer: null, state: "stack", clock: 0 };
  el.setAttribute("data-token", String(t.id));
  tokens.push(t);
  return t;
};
const stack = [];
const belt = [];
let feeding = null, waiting = null, gate = { at: 0, target: 0 }, approval = 0, shoe = 0, shoeTarget = 0, phase = 0, notice = "", noticeClock = 0;
for (let i = 0; i < 6; i++) { const t = make(slotX(i), 0, C.BELT_TOP); t.state = "belt"; belt.push(t); }
for (let i = 0; i < 2; i++) { const t = make(C.HX, 0, C.BELT_TOP + C.TOKEN_H * i); stack.push(t); }

const follow = (value, target, dt, seconds, calm) => calm ? target : (Math.abs(target - value) < 0.01 ? target : value + (target - value) * (1 - Math.exp(-dt / seconds)));
const toward = (value, target, step) => Math.abs(target - value) <= step ? target : value + Math.sign(target - value) * step;
const pending = () => stack.length + (feeding ? 1 : 0) + (waiting ? 1 : 0);

function request() {
  if (belt.length + pending() >= C.SLOTS) { notice = "class and waitlist full"; noticeClock = 2.4; return false; }
  stack.push(make(C.HX, 0, C.BELT_TOP + C.TOKEN_H * stack.length + 14));
  return true;
}
function drop(t) {
  const index = belt.indexOf(t);
  if (index < 0) return;
  belt.splice(index, 1);
  t.state = "drop"; t.clock = 0; t.from = [t.x, t.y, t.z];
  notice = index < C.MAX_ENROLL ? (belt.length >= C.MAX_ENROLL ? "drop · first waitlisted promoted" : "drop · seat freed") : "left the waitlist";
  noticeClock = 2.6;
}

function step(dt, calm) {
  let moving = false;
  // Magazine: the pusher feeds the bottom token when the gate lane is clear.
  if (!feeding && !waiting && stack.length && belt.length < C.SLOTS && shoe === 0) {
    feeding = stack.shift(); feeding.state = "feed"; shoeTarget = C.STROKE;
  }
  if (feeding && shoeTarget > 0) {
    shoe = calm ? shoeTarget : toward(shoe, shoeTarget, 30 * dt);
    feeding.x = C.HX + shoe;
    if (shoe === shoeTarget) shoeTarget = 0;
  } else {
    shoe = calm ? 0 : toward(shoe, 0, 22 * dt);
  }
  stack.forEach((t, i) => { const z = C.BELT_TOP + C.TOKEN_H * i; t.z = calm ? z : toward(t.z, z, 40 * dt); });
  if (feeding && shoeTarget === 0) {
    feeding.x = calm ? C.WAIT_X : toward(feeding.x, C.WAIT_X, SPEED * dt);
    moving = true;
    if (feeding.x === C.WAIT_X) { waiting = feeding; feeding = null; waiting.state = "wait"; approval = 0; }
  }
  // Approval: the request waits Pending Approval, then the gate lifts.
  if (waiting && belt.length < C.SLOTS) {
    approval += dt;
    if (approval > 1.1 || calm) gate.target = 1;
    if (gate.at > 0.92) { waiting.state = "belt"; belt.push(waiting); waiting = null; }
  }
  const lead = belt.find((t) => t.lit);
  if (!waiting && (!lead || lead.x > C.GX + 9)) gate.target = 0;
  gate.at = follow(gate.at, gate.target, dt, 0.16, calm);
  // Belt: every token runs toward its place, against the end stop or the token ahead.
  belt.forEach((t, i) => {
    const target = slotX(i);
    const next = calm ? target : toward(t.x, target, SPEED * dt);
    if (next !== t.x) moving = true;
    t.x = next;
  });
  // Dropped tokens lift off and set down on the pad, then fade.
  for (const t of tokens) {
    if (t.state !== "drop") continue;
    t.clock += calm ? 2 : dt;
    const u = Math.min(1, t.clock / 0.9), e = u * u * (3 - 2 * u);
    t.y = t.from[1] + (C.DROP_Y - t.from[1]) * e;
    t.z = t.from[2] + (0.8 - t.from[2]) * e + Math.sin(Math.PI * u) * 10;
    t.alpha = t.clock < 1.3 ? 1 : Math.max(0, 1 - (t.clock - 1.3) / 0.7);
    if (t.alpha === 0) { t.state = "gone"; t.el.remove(); }
  }
  for (let i = tokens.length - 1; i >= 0; i--) if (tokens[i].state === "gone") tokens.splice(i, 1);
  if (moving) phase = (phase + SPEED * dt) % 1e6;
  return moving;
}

const enrolled = () => Math.min(belt.length, C.MAX_ENROLL);
const waitlisted = () => Math.max(0, belt.length - C.MAX_ENROLL);
let lastOrder = "";
function draw() {
  const watch = waiting || feeding || belt.filter((t) => t.x < slotX(belt.indexOf(t)) - 0.01 && t.lit).pop();
  for (const t of tokens) {
    const lit = t === watch || t.state === "drop" || (t.lit && t.state === "belt" && t.x !== slotX(belt.indexOf(t)));
    if (lit !== t.lit) { t.lit = lit; t.el.children[0].style.display = lit ? "none" : ""; t.el.children[1].style.display = lit ? "" : "none"; }
    t.el.setAttribute("transform", translateAlong(P, [t.x, t.y, t.z]));
    if (t.alpha < 1) t.el.setAttribute("opacity", t.alpha.toFixed(3));
  }
  const sorted = [...tokens].sort((a, b) => depthOf([a.x, a.y, a.z], P) - depthOf([b.x, b.y, b.z], P));
  const order = sorted.map((t) => t.id + layerOf(t)).join(",");
  if (order !== lastOrder) { lastOrder = order; for (const t of sorted) layers[layerOf(t)].appendChild(t.el); }
  part("ribs").setAttribute("d", ribsAt(phase));
  part("gate").setAttribute("transform", translateAlong(P, [0, 0, gate.at * C.GATE_LIFT]));
  const open = gate.at > 0.05;
  part("lamp-on").style.display = open ? "" : "none";
  part("lamp-off").style.display = open ? "none" : "";
  part("shoe").setAttribute("transform", translateAlong(P, [shoe, 0, 0]));
  part("rod").setAttribute("transform", translateAlong(P, [shoe, 0, 0]));
  const text = noticeClock > 0 ? notice : "enrolled " + enrolled() + "/" + C.MAX_ENROLL + " · waitlist " + waitlisted() + "/" + C.MAX_WAIT + " · pending " + pending();
  if (readout.textContent !== text) readout.textContent = text;
  stage.setAttribute("aria-valuenow", String(enrolled()));
  stage.setAttribute("aria-valuetext", text);
}

// Idle tour: requests arrive until the waitlist has two learners, then seats are dropped.
const TOUR_DROPS = [2, 5, 0, 4, 1, 6];
let tourClock = 0, tourStep = 0, touring = true, idleTimer = 0;
function tour(dt) {
  tourClock += dt;
  if (tourClock < 2.2) return;
  tourClock = 0;
  if (belt.length + pending() < C.MAX_ENROLL + 3) { request(); return; }
  const index = TOUR_DROPS[tourStep++ % TOUR_DROPS.length];
  if (belt[index]) drop(belt[index]);
}

let frame = 0, last = 0, visible = false;
function tick(now) {
  const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
  last = now;
  const calm = still.matches;
  if (touring && !calm) tour(dt);
  noticeClock = Math.max(0, noticeClock - dt);
  const moving = step(dt, calm);
  draw();
  const busy = moving || touring || feeding || waiting || gate.at !== gate.target || shoe !== 0 || noticeClock > 0 || tokens.some((t) => t.state === "drop");
  frame = visible && busy ? requestAnimationFrame(tick) : 0;
}
const run = () => { if (!frame && visible) { last = 0; frame = requestAnimationFrame(tick); } };
const hold = () => { touring = false; clearTimeout(idleTimer); idleTimer = setTimeout(() => { touring = !still.matches; tourClock = 0; run(); }, 9000); run(); };
new IntersectionObserver((entries) => { visible = entries[entries.length - 1].isIntersecting; if (visible) run(); }, { rootMargin: "120px 0px" }).observe(stage);
if (still.matches) touring = false;
stage.addEventListener("click", (event) => {
  hold();
  const hit = event.target.closest("[data-token]");
  const t = hit && tokens.find((item) => String(item.id) === hit.getAttribute("data-token"));
  if (t && t.state === "belt") drop(t); else request();
});
stage.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " " || event.key === "r") { event.preventDefault(); hold(); request(); }
  if (event.key === "d" || event.key === "Delete" || event.key === "Backspace") {
    event.preventDefault(); hold();
    const t = belt[Math.min(3, belt.length - 1)];
    if (t) drop(t);
  }
});
step(0, true);
draw();
`;

const body = k.plateHtml({
  fig: "Fig 1",
  title: "ELM class enrollment",
  hint: "Click to request · click a token to drop",
  readout: `enrolled 6/${MAX_ENROLL} · waitlist 0/${MAX_WAIT} · pending 2`,
  keys: [
    { mark: "lit", label: "The learner being processed: pending approval, then placed" },
    { mark: "raised", label: `Roster: ${MAX_ENROLL} places against the end stop (maximum enrollment)` },
    { mark: "edge", label: `Capacity post; the ${MAX_WAIT} places behind it are the waitlist` },
  ],
  caption: `A PeopleSoft ELM 9.2 class (learning activity) has a maximum enrollment and a waitlist limit, here ${MAX_ENROLL} and ${MAX_WAIT}. A request waits as Pending Approval until the approval workflow lets it through the gate. It is Enrolled if it comes to rest within the first ${MAX_ENROLL} places, and Waitlisted, in the order requested, if it stops behind the capacity post. When an enrolled learner drops, every token behind slides forward one place, and the first waitlisted learner moves into the free seat. ELM can promote from the waitlist automatically or leave it to an administrator, depending on setup. The short post marks a minimum enrollment of ${MIN_ENROLL}. Keys: Enter requests a seat, D drops one.`,
  body: `<div class="iso-stage" tabindex="0" role="meter" aria-label="ELM class enrollment: Enter requests a seat, D drops an enrolled learner" aria-valuemin="0" aria-valuemax="${MAX_ENROLL}" aria-valuenow="6">${svg}</div>`,
});

const file = theme === "light" ? "elm-enrollment-light.html" : "elm-enrollment.html";
writeFileSync(join(HERE, file), k.pageHtml({ title: "ELM class enrollment", theme, body, script: kitScript() + live }));
console.log("wrote", file);
