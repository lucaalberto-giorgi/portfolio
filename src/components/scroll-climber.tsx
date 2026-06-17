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
 * three-act story as you scroll:
 *
 *  1. coding     — sits hunched over a laptop at the top of the ladder
 *  2. climbing   — descends the ladder as you scroll down
 *  3. bottomIdle — rests at the bottom, then after a pause...
 *  4. jetpack    — boosts back up to the top and resumes coding
 *
 * After flying home he stays coding and won't climb again until you scroll
 * back up near the top, so he never snaps out of sync with the scrollbar.
 *
 * Everything is driven by refs + motion values inside one animation frame
 * loop, so changing acts never triggers a React re-render. Limbs (and the
 * leaning head/torso) are posed by endpoint coordinates — no fragile SVG
 * transform-origin. Decorative: hidden below xl, aria-hidden,
 * pointer-events-none, static "coding" pose under prefers-reduced-motion.
 */

// SVG geometry (user units).
const VB_W = 64;
const VB_H = 760;
const RAIL_L = 20;
const RAIL_R = 44;
const RUNG_GAP = 36;

// Ladder is capped at the climber's seat — no rails above him at the top.
const LADDER_TOP = 54;
const RUNG_COUNT = 19;
const RAIL_BOTTOM = LADDER_TOP + (RUNG_COUNT - 1) * RUNG_GAP; // 702

// Where the climber's hip travels between (local origin y = 0 at the hip).
const TRAVEL_TOP = 44; // seated on the top rung
const TRAVEL_BOTTOM = 696;

// Climb gait + smoothing.
const CYCLE_MS = 1100;
const ARM_THROW = 5;
const LEG_THROW = 4;
const SMOOTH_TAU = 70; // limb-pose blend (ms)
const OPACITY_TAU = 120; // laptop / jetpack fade (ms)
const POS_TAU = 170; // descent follows scroll
const POS_TAU_JET = 300; // jetpack ascent

// Scroll-position thresholds that drive the acts.
const T1 = 0.12; // scroll past here → start climbing down
const CODE_AT = 0.06; // scroll back above here → sit and code again
const BOTTOM_AT = 0.97; // reached the bottom
const BOTTOM_EXIT = 0.9; // scroll back above here → cancel jetpack, climb
const REARM_AT = 0.08; // back near the top → allow climbing again after a flight
const JETPACK_DELAY_MS = 3000; // rest at the bottom before launching

type Mode = "coding" | "climbing" | "bottomIdle" | "jetpack";

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

// Per-mode target pose as a function of elapsed time (for the oscillations).
function poseFor(mode: Mode, t: number): Pose {
  switch (mode) {
    case "coding": {
      const k = Math.sin(t / 130); // tapping fingers
      const k2 = Math.sin(t / 130 + 2.1);
      return {
        lean: 6, // hunched forward over the laptop
        headDown: 4, // looking at the screen
        lhx: 38,
        lhy: -4 + k * 0.8, // both hands out front on the keyboard
        rhx: 44,
        rhy: -5 + k2 * 0.8,
        lfx: 30,
        lfy: 11, // legs hang off the rung
        rfx: 35,
        rfy: 12,
        body: 2,
      };
    }
    case "bottomIdle": {
      const d = Math.sin((t / 900) * Math.PI * 2); // dangle
      return {
        lean: 0,
        headDown: 0,
        lhx: 26,
        lhy: -20,
        rhx: 38,
        rhy: -20,
        lfx: 28 + d * 3,
        lfy: 15,
        rfx: 36 + d * 3,
        rfy: 15,
        body: 3,
      };
    }
    case "jetpack": {
      const sh = Math.sin(t / 55) * 0.7; // thrust shake
      return {
        lean: -2, // tipped back a touch as he launches
        headDown: 0,
        lhx: 27 + sh,
        lhy: -16, // hands gripping the pack
        rhx: 37 + sh,
        rhy: -16,
        lfx: 31,
        lfy: 12, // legs together, pointing down
        rfx: 33,
        rfy: 12,
        body: -2,
      };
    }
    default: {
      // climbing — contralateral down-climb, facing the ladder
      const s = Math.sin(((t % CYCLE_MS) / CYCLE_MS) * Math.PI * 2);
      return {
        lean: 0,
        headDown: 0,
        lhx: 22,
        lhy: -26 + s * ARM_THROW,
        rhx: 42,
        rhy: -26 - s * ARM_THROW,
        lfx: 24,
        lfy: 8 - s * LEG_THROW,
        rfx: 40,
        rfy: 8 + s * LEG_THROW,
        body: -Math.abs(s) * 1.4,
      };
    }
  }
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
  const jetpackOpacity = useMotionValue(0);
  const flameY = useMotionValue(12);

  // Derived joints (head + torso top + shoulders track the lean).
  const shoulderX = useTransform(lean, shoulderXAt);
  const headX = useTransform(lean, headXAt);
  const headY = useTransform(headDown, headYAt);

  const modeRef = useRef<Mode>("coding");
  const armedRef = useRef(true);
  const bottomTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const transition = useCallback((m: Mode) => {
    if (modeRef.current === m) return;
    modeRef.current = m;
    if (bottomTimer.current) {
      clearTimeout(bottomTimer.current);
      bottomTimer.current = null;
    }
    if (m === "bottomIdle") {
      bottomTimer.current = setTimeout(() => {
        modeRef.current = "jetpack";
        armedRef.current = false;
      }, JETPACK_DELAY_MS);
    }
    if (m === "jetpack") armedRef.current = false;
  }, []);

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    if (p <= REARM_AT) armedRef.current = true;
    const m = modeRef.current;
    if (m === "coding") {
      if (armedRef.current && p > T1) transition("climbing");
    } else if (m === "climbing") {
      if (p >= BOTTOM_AT) transition("bottomIdle");
      else if (p <= CODE_AT) transition("coding");
    } else if (m === "bottomIdle") {
      if (p < BOTTOM_EXIT) transition("climbing");
    }
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
    const p = poseFor(m, t);
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

    let posTarget = TRAVEL_TOP;
    if (m === "climbing") {
      const pr = scrollYProgress.get();
      const u = Math.min(1, Math.max(0, (pr - T1) / (BOTTOM_AT - T1)));
      posTarget = TRAVEL_TOP + (TRAVEL_BOTTOM - TRAVEL_TOP) * u;
    } else if (m === "bottomIdle") {
      posTarget = TRAVEL_BOTTOM;
    }
    const pa = 1 - Math.exp(-delta / (m === "jetpack" ? POS_TAU_JET : POS_TAU));
    ease(posY, posTarget, pa);
    if (m === "jetpack" && posY.get() <= TRAVEL_TOP + 2) transition("coding");

    const oa = 1 - Math.exp(-delta / OPACITY_TAU);
    ease(laptopOpacity, m === "coding" ? 1 : 0, oa);
    ease(jetpackOpacity, m === "jetpack" ? 1 : 0, oa);
    const flameTarget =
      m === "jetpack" ? 16 + 8 * Math.abs(Math.sin(t / 45)) : 8;
    ease(flameY, flameTarget, 1 - Math.exp(-delta / 40));
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
        {/* Ladder (capped at the top rung — nothing above his seat) */}
        <g
          className="text-edge"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
        >
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
            {/* Jetpack pack + thrust flames (behind the body) */}
            <motion.g style={{ opacity: reduce ? 0 : jetpackOpacity }}>
              <rect
                x={26}
                y={-18}
                width={12}
                height={13}
                rx={3}
                fill="currentColor"
                stroke="none"
              />
              <motion.line
                x1={29}
                y1={-4}
                x2={29}
                y2={flameY}
                strokeWidth={4}
              />
              <motion.line
                x1={35}
                y1={-4}
                x2={35}
                y2={flameY}
                strokeWidth={4}
              />
            </motion.g>

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

            {/* Laptop (open, on his lap) */}
            <motion.g style={{ opacity: reduce ? 1 : laptopOpacity }}>
              <line x1={35} y1={-2} x2={46} y2={-3} />
              <line x1={46} y1={-3} x2={43} y2={-13} />
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
