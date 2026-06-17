"use client";

import type { MotionValue } from "motion/react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { useCallback, useEffect, useRef } from "react";

/**
 * A stickman who lives in the homepage left gutter and acts out a little
 * scroll story:
 *
 *  1. coding     — sits at a desk at the very top, hacking on a laptop
 *  2. jumping    — leaps off the desk and catches the top of the ladder
 *  3. climbing   — climbs the rungs down as you scroll; the ladder hangs in
 *                  the lower half (its top rung is around the mid-page stripe)
 *  4. bottomIdle — dangles off the lowest rung, then after a pause...
 *  5. roping     — a rope drops from the top and hauls him hand-over-hand
 *                  back up to the desk, where he resumes coding
 *
 * Scrolling back toward the top while climbing makes him climb up the rungs
 * and hop from the ladder back onto the desk. The rope is only present during
 * the climb back up; it fades away once he is coding again. After flying home
 * he won't leap again until you scroll back near the top, so he never snaps
 * out of sync with the scrollbar.
 *
 * Everything is driven by refs + motion values inside one animation frame
 * loop, so changing acts never triggers a React re-render. Limbs (and the
 * leaning head/torso) are posed by endpoint coordinates — no fragile SVG
 * transform-origin. The rope path is written straight to the DOM each frame.
 * Decorative: hidden below xl, aria-hidden, pointer-events-none, static
 * "coding" pose under prefers-reduced-motion.
 */

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v));

// SVG geometry (user units).
const VB_W = 64;
const VB_H = 760;

// Ladder only occupies the lower half — its top rung sits around the mid-page
// striped separator and the rails run to the bottom. Up top, by his desk,
// there is no ladder at all.
const RAIL_L = 20;
const RAIL_R = 44;
const RUNG_GAP = 34;
const LADDER_TOP = 356;
const RUNG_COUNT = 10;
const RAIL_BOTTOM = LADDER_TOP + (RUNG_COUNT - 1) * RUNG_GAP; // 662

// Desk shelf he sits on at the very top.
const DESK_Y = 84;

// Where the climber's hip travels (local origin y = 0 at the hip).
const TRAVEL_TOP = 60; // seated at the desk
const TRAVEL_BOTTOM = 650; // hanging off the lowest rung
const LADDER_HIP_TOP = 380; // hip height when his hands reach the top rung

// Jump (desk ↔ ladder). Time-driven, decoupled from scroll.
const JUMP_MS = 1100; // a slow, deliberate leap (slower reads better)
const HOP_DOWN = 26; // leap arc height, desk → ladder
const HOP_UP = 18; // leap arc height, ladder → desk

// Rope (ascent only) hangs from a fixed anchor near the very top.
const ROPE_ANCHOR_Y = 26;
const ROPE_SWAY = 7;
const ROPE_SEGMENTS = 12;
const GRIP_DY = -26; // his hands grip the rope this far above the hip

// Gait + smoothing.
const CYCLE_MS = 1000;
const ARM_THROW = 5;
const LEG_THROW = 4;
const SMOOTH_TAU = 70; // limb-pose blend (ms)
const OPACITY_TAU = 140; // laptop / rope fade (ms)
const POS_TAU = 170; // descent follows scroll
const POS_TAU_ROPE = 240; // rope ascent

// Scroll-position thresholds that drive the acts.
const T1 = 0.12; // scroll past here → start climbing down
const CODE_AT = 0.06; // scroll back above here → sit and code again
const BOTTOM_AT = 0.97; // reached the bottom
const BOTTOM_EXIT = 0.9; // scroll back above here → cancel ascent, climb
const REARM_AT = 0.08; // back near the top → allow climbing again after a trip
const ASCENT_DELAY_MS = 2600; // rest at the bottom before grabbing the rope

type Mode =
  | "coding"
  | "jumping"
  | "climbing"
  | "bottomIdle"
  | "roping"
  | "jumpingUp";

type Pose = {
  lean: number; // upper-body lean (+ = forward/right)
  headDown: number; // head dip (+ = looking down)
  lhx: number;
  lhy: number;
  rhx: number;
  rhy: number;
  lfx: number;
  lfy: number;
  rfx: number;
  rfy: number;
  body: number;
};

// Contralateral down-climb on the rungs. `rail` widens his grip from narrow
// (just caught the ladder) to the full rail width (x = 20 / 44).
function climbPose(t: number, hipY: number): Pose {
  const s = Math.sin(((t % CYCLE_MS) / CYCLE_MS) * Math.PI * 2);
  const rail = clamp((hipY - (LADDER_TOP - 28)) / 44, 0, 1);
  const spread = 5 + rail * 7; // 5 (centered) → 12 (rails)
  const foot = 4 + rail * 8;
  return {
    lean: 0,
    headDown: 0,
    lhx: 32 - spread,
    lhy: -25 + s * ARM_THROW,
    rhx: 32 + spread,
    rhy: -25 - s * ARM_THROW,
    lfx: 32 - foot,
    lfy: 8 - s * LEG_THROW,
    rfx: 32 + foot,
    rfy: 8 + s * LEG_THROW,
    body: -Math.abs(s) * 1.4,
  };
}

// Per-mode target pose as a function of elapsed time (for the oscillations).
function poseFor(mode: Mode, t: number): Pose {
  switch (mode) {
    case "coding": {
      const tap1 = Math.sin(t / 95); // fingers tapping the keys
      const tap2 = Math.sin(t / 95 + 2.3);
      const bob = Math.sin(t / 620); // thinking head-bob
      return {
        lean: 6 + bob * 0.7, // hunched forward over the laptop
        headDown: 4 + bob * 1.2, // looking at the screen
        lhx: 37,
        lhy: -3 + Math.max(0, tap1) * 1.8, // both hands on the keyboard
        rhx: 43,
        rhy: -4 + Math.max(0, tap2) * 1.8,
        lfx: 29,
        lfy: 12, // legs dangle off the desk
        rfx: 35,
        rfy: 13,
        body: 2,
      };
    }
    case "bottomIdle": {
      const d = Math.sin((t / 950) * Math.PI * 2); // dangle
      return {
        lean: 0,
        headDown: 0,
        lhx: 20,
        lhy: -22, // hanging from the lowest rung
        rhx: 44,
        rhy: -22,
        lfx: 30 + d * 3,
        lfy: 16,
        rfx: 36 + d * 3,
        rfy: 16,
        body: 2 + d * 0.6,
      };
    }
    case "roping": {
      const c = Math.sin((t / 520) * Math.PI * 2); // hand-over-hand cycle
      const sway = Math.sin(t / 480) * 2; // body swings with the rope
      const kick = Math.abs(c) * 2;
      return {
        lean: sway * 0.4,
        headDown: 1,
        lhx: 31 + sway,
        lhy: -28 + c * 6, // one hand reaches up while the other holds
        rhx: 33 + sway,
        rhy: -28 - c * 6,
        lfx: 30 + sway,
        lfy: 12 + kick, // legs bent, feet pressing the rope
        rfx: 34 + sway,
        rfy: 12 + kick,
        body: sway * 0.5,
      };
    }
    default:
      return climbPose(t, TRAVEL_TOP);
  }
}

// In-flight poses (arms thrown up to reach/catch, knees tucked at the apex).
function jumpDownFlight(prog: number): Pose {
  const tuck = Math.sin(prog * Math.PI);
  return {
    lean: 3,
    headDown: 1,
    lhx: 25,
    lhy: -30, // reaching down for the rungs
    rhx: 39,
    rhy: -30,
    lfx: 30,
    lfy: 6 - tuck * 4,
    rfx: 34,
    rfy: 6 - tuck * 4,
    body: -tuck * 2,
  };
}

function jumpUpFlight(prog: number): Pose {
  const tuck = Math.sin(prog * Math.PI);
  return {
    lean: -2,
    headDown: 0,
    lhx: 28,
    lhy: -30, // reaching up for the desk
    rhx: 36,
    rhy: -30,
    lfx: 30,
    lfy: 8 - tuck * 3,
    rfx: 34,
    rfy: 8 - tuck * 3,
    body: -tuck * 2,
  };
}

function lerpPose(a: Pose, b: Pose, k: number): Pose {
  const m = (x: number, y: number) => x + (y - x) * k;
  return {
    lean: m(a.lean, b.lean),
    headDown: m(a.headDown, b.headDown),
    lhx: m(a.lhx, b.lhx),
    lhy: m(a.lhy, b.lhy),
    rhx: m(a.rhx, b.rhx),
    rhy: m(a.rhy, b.rhy),
    lfx: m(a.lfx, b.lfx),
    lfy: m(a.lfy, b.lfy),
    rfx: m(a.rfx, b.rfx),
    rfy: m(a.rfy, b.rfy),
    body: m(a.body, b.body),
  };
}

// Parabolic leap with a little push-off pop. The ease accelerates toward the
// target — gravity on the way down, a spring that settles on the way up.
function jumpY(from: number, to: number, prog: number): number {
  const down = to > from;
  const ease = down ? prog * prog : 1 - (1 - prog) * (1 - prog);
  const hop = (down ? HOP_DOWN : HOP_UP) * Math.sin(prog * Math.PI);
  return from + (to - from) * ease - hop;
}

const CODE_POSE = poseFor("coding", 0);

// Lean → joint positions.
const shoulderXAt = (lean: number) => 32 + lean * 0.55;
const headXAt = (lean: number) => 32 + lean * 0.9;
const headYAt = (headDown: number) => -32 + headDown;

export function ScrollClimber() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();

  // Position + limb-endpoint + apparatus motion values, eased every frame.
  const posY = useMotionValue(TRAVEL_TOP);
  const lean = useMotionValue(CODE_POSE.lean);
  const headDown = useMotionValue(CODE_POSE.headDown);
  const lhx = useMotionValue(CODE_POSE.lhx);
  const lhy = useMotionValue(CODE_POSE.lhy);
  const rhx = useMotionValue(CODE_POSE.rhx);
  const rhy = useMotionValue(CODE_POSE.rhy);
  const lfx = useMotionValue(CODE_POSE.lfx);
  const lfy = useMotionValue(CODE_POSE.lfy);
  const rfx = useMotionValue(CODE_POSE.rfx);
  const rfy = useMotionValue(CODE_POSE.rfy);
  const bodyOff = useMotionValue(CODE_POSE.body);
  const laptopOpacity = useMotionValue(1);
  const ropeOpacity = useMotionValue(0);
  const screenGlow = useMotionValue(0.22);
  const bitY = useMotionValue(-16);
  const bitOpacity = useMotionValue(0);
  const bit2Y = useMotionValue(-16);
  const bit2Opacity = useMotionValue(0);

  // Derived joints (head + torso top + shoulders track the lean).
  const shoulderX = useTransform(lean, shoulderXAt);
  const headX = useTransform(lean, headXAt);
  const headY = useTransform(headDown, headYAt);

  const ropeRef = useRef<SVGPathElement>(null);
  const modeRef = useRef<Mode>("coding");
  const armedRef = useRef(true);
  const bottomTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const jumpFromRef = useRef(TRAVEL_TOP);
  const jumpToRef = useRef(LADDER_HIP_TOP);
  const jumpElapsedRef = useRef(0);
  const jumpNextRef = useRef<Mode>("climbing");

  const transition = useCallback(
    (m: Mode) => {
      if (modeRef.current === m) return;
      modeRef.current = m;
      if (bottomTimer.current) {
        clearTimeout(bottomTimer.current);
        bottomTimer.current = null;
      }
      if (m === "jumping" || m === "jumpingUp") {
        jumpFromRef.current = posY.get();
        jumpToRef.current = m === "jumping" ? LADDER_HIP_TOP : TRAVEL_TOP;
        jumpElapsedRef.current = 0;
        jumpNextRef.current = m === "jumping" ? "climbing" : "coding";
      }
      if (m === "bottomIdle") {
        bottomTimer.current = setTimeout(() => {
          modeRef.current = "roping";
          armedRef.current = false;
        }, ASCENT_DELAY_MS);
      }
      if (m === "roping") armedRef.current = false;
    },
    [posY]
  );

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    if (p <= REARM_AT) armedRef.current = true;
    const m = modeRef.current;
    if (m === "coding") {
      if (armedRef.current && p > T1) transition("jumping");
    } else if (m === "climbing") {
      if (p >= BOTTOM_AT) transition("bottomIdle");
      else if (p <= CODE_AT) transition("jumpingUp");
    } else if (m === "bottomIdle") {
      if (p < BOTTOM_EXIT) transition("climbing");
    }
    // "jumping" / "jumpingUp" are time-driven; they ignore scroll until done.
  });

  useEffect(() => {
    return () => {
      if (bottomTimer.current) clearTimeout(bottomTimer.current);
    };
  }, []);

  useAnimationFrame((t, delta) => {
    if (reduce) return;
    const m = modeRef.current;
    const ease = (mv: MotionValue<number>, to: number, a: number) =>
      mv.set(mv.get() + (to - mv.get()) * a);

    const sa = 1 - Math.exp(-delta / SMOOTH_TAU);

    // Jumps are time-driven (the hip is set straight to the leap arc); every
    // other act eases its hip toward a scroll- or rest-derived target.
    let p: Pose;
    if (m === "jumping" || m === "jumpingUp") {
      jumpElapsedRef.current += delta;
      const prog = clamp(jumpElapsedRef.current / JUMP_MS, 0, 1);
      posY.set(jumpY(jumpFromRef.current, jumpToRef.current, prog));
      const down = m === "jumping";
      const flight = down ? jumpDownFlight(prog) : jumpUpFlight(prog);
      const land = down ? climbPose(t, LADDER_HIP_TOP) : poseFor("coding", t);
      const cb = clamp((prog - 0.7) / 0.3, 0, 1); // settle into the catch
      p = lerpPose(flight, land, cb);
      if (prog >= 1) transition(jumpNextRef.current);
    } else {
      p = m === "climbing" ? climbPose(t, posY.get()) : poseFor(m, t);
      let posTarget = TRAVEL_TOP;
      if (m === "climbing") {
        const pr = scrollYProgress.get();
        const u = clamp((pr - T1) / (BOTTOM_AT - T1), 0, 1);
        posTarget = LADDER_HIP_TOP + (TRAVEL_BOTTOM - LADDER_HIP_TOP) * u;
      } else if (m === "bottomIdle") {
        posTarget = TRAVEL_BOTTOM;
      }
      const pa =
        1 - Math.exp(-delta / (m === "roping" ? POS_TAU_ROPE : POS_TAU));
      ease(posY, posTarget, pa);
      if (m === "roping" && posY.get() <= TRAVEL_TOP + 2) transition("coding");
    }

    ease(lean, p.lean, sa);
    ease(headDown, p.headDown, sa);
    ease(lhx, p.lhx, sa);
    ease(lhy, p.lhy, sa);
    ease(rhx, p.rhx, sa);
    ease(rhy, p.rhy, sa);
    ease(lfx, p.lfx, sa);
    ease(lfy, p.lfy, sa);
    ease(rfx, p.rfx, sa);
    ease(rfy, p.rfy, sa);
    ease(bodyOff, p.body, sa);

    const oa = 1 - Math.exp(-delta / OPACITY_TAU);
    ease(laptopOpacity, m === "coding" ? 1 : 0, oa);
    ease(ropeOpacity, m === "roping" ? 1 : 0, oa);

    // Laptop life: flickering screen glow + little glyphs floating up.
    screenGlow.set(0.16 + 0.13 * (0.5 + 0.5 * Math.sin(t / 110)));
    const f1 = (t % 1700) / 1700;
    bitY.set(-15 - f1 * 13);
    bitOpacity.set((1 - f1) * 0.55);
    const f2 = ((t + 850) % 1700) / 1700;
    bit2Y.set(-15 - f2 * 13);
    bit2Opacity.set((1 - f2) * 0.55);

    // Rope: a swaying line from the top anchor down to his hands.
    const rope = ropeRef.current;
    if (rope) {
      const top = ROPE_ANCHOR_Y;
      const bottom = posY.get() + GRIP_DY;
      let d = `M 32 ${top}`;
      for (let i = 1; i <= ROPE_SEGMENTS; i++) {
        const f = i / ROPE_SEGMENTS;
        const y = top + (bottom - top) * f;
        const env = Math.sin(f * Math.PI); // anchored at both ends
        const x = 32 + env * ROPE_SWAY * Math.sin(t / 230 - f * 3.2);
        d += ` L ${x.toFixed(2)} ${y.toFixed(2)}`;
      }
      rope.setAttribute("d", d);
    }
  });

  const rungs = Array.from(
    { length: RUNG_COUNT },
    (_, i) => LADDER_TOP + i * RUNG_GAP
  );

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed top-1/2 left-[calc(50%_-_35rem)] z-40 hidden h-[78vh] -translate-y-1/2 xl:block"
    >
      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        fill="none"
        className="h-full w-auto"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Desk shelf + ladder (the static "furniture", in the edge colour) */}
        <g
          className="text-edge"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
        >
          {/* Desk shelf at the very top */}
          <line x1={8} y1={DESK_Y} x2={52} y2={DESK_Y} />
          <line x1={12} y1={DESK_Y} x2={12} y2={DESK_Y + 8} />
          <line x1={48} y1={DESK_Y} x2={48} y2={DESK_Y + 8} />

          {/* Ladder — lower half only */}
          <line
            x1={RAIL_L}
            y1={LADDER_TOP - 2}
            x2={RAIL_L}
            y2={RAIL_BOTTOM + 2}
          />
          <line
            x1={RAIL_R}
            y1={LADDER_TOP - 2}
            x2={RAIL_R}
            y2={RAIL_BOTTOM + 2}
          />
          {rungs.map((ry) => (
            <line key={ry} x1={RAIL_L} y1={ry} x2={RAIL_R} y2={ry} />
          ))}
        </g>

        {/* Rope (ascent only) — a swaying line drawn straight to the DOM */}
        <motion.g
          className="text-foreground"
          style={{ opacity: reduce ? 0 : ropeOpacity }}
        >
          <path
            ref={ropeRef}
            d={`M 32 ${ROPE_ANCHOR_Y} L 32 ${TRAVEL_TOP + GRIP_DY}`}
            stroke="currentColor"
            strokeWidth={1.6}
            strokeLinecap="round"
            fill="none"
          />
          {/* anchor peg */}
          <circle cx={32} cy={ROPE_ANCHOR_Y} r={2} fill="currentColor" />
        </motion.g>

        {/* Climber: outer group = position, inner group = body offset */}
        <motion.g style={{ y: reduce ? TRAVEL_TOP : posY }}>
          <motion.g
            className="text-foreground"
            stroke="currentColor"
            strokeWidth={2.4}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ y: reduce ? CODE_POSE.body : bodyOff }}
          >
            {/* legs */}
            <motion.line
              x1={32}
              y1={-4}
              x2={reduce ? CODE_POSE.lfx : lfx}
              y2={reduce ? CODE_POSE.lfy : lfy}
            />
            <motion.line
              x1={32}
              y1={-4}
              x2={reduce ? CODE_POSE.rfx : rfx}
              y2={reduce ? CODE_POSE.rfy : rfy}
            />

            {/* Laptop (open, on his lap) with a flickering screen + glyphs */}
            <motion.g style={{ opacity: reduce ? 1 : laptopOpacity }}>
              {/* screen glow (behind the outline) */}
              <motion.polygon
                points="47,-2.5 45,-13 42.5,-12 44.5,-1.5"
                fill="currentColor"
                stroke="none"
                style={{ opacity: reduce ? 0.2 : screenGlow }}
              />
              {/* keyboard base + screen lid */}
              <line x1={33} y1={0} x2={47} y2={-2} />
              <line x1={47} y1={-2} x2={45} y2={-13} />
              {/* glyphs floating up out of the screen */}
              <motion.circle
                cx={45}
                cy={reduce ? -16 : bitY}
                r={1}
                fill="currentColor"
                stroke="none"
                style={{ opacity: reduce ? 0 : bitOpacity }}
              />
              <motion.circle
                cx={49}
                cy={reduce ? -16 : bit2Y}
                r={1}
                fill="currentColor"
                stroke="none"
                style={{ opacity: reduce ? 0 : bit2Opacity }}
              />
            </motion.g>

            {/* torso (leans with the upper body) */}
            <motion.line
              x1={reduce ? shoulderXAt(CODE_POSE.lean) : shoulderX}
              y1={-26}
              x2={32}
              y2={-4}
            />
            {/* head */}
            <motion.circle
              cx={reduce ? headXAt(CODE_POSE.lean) : headX}
              cy={reduce ? headYAt(CODE_POSE.headDown) : headY}
              r={5.5}
              fill="currentColor"
              stroke="none"
            />
            {/* arms */}
            <motion.line
              x1={reduce ? shoulderXAt(CODE_POSE.lean) : shoulderX}
              y1={-22}
              x2={reduce ? CODE_POSE.lhx : lhx}
              y2={reduce ? CODE_POSE.lhy : lhy}
            />
            <motion.line
              x1={reduce ? shoulderXAt(CODE_POSE.lean) : shoulderX}
              y1={-22}
              x2={reduce ? CODE_POSE.rhx : rhx}
              y2={reduce ? CODE_POSE.rhy : rhy}
            />
          </motion.g>
        </motion.g>
      </svg>
    </div>
  );
}
