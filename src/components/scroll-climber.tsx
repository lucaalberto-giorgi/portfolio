"use client";

import type { MotionValue } from "motion/react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "motion/react";
import { useCallback, useEffect, useRef } from "react";

/**
 * A stickman who lives in the homepage left gutter and acts out a little
 * three-act story as you scroll:
 *
 *  1. coding     — sits at the top of the ladder typing on a laptop
 *  2. climbing   — descends the (persistent) ladder as you scroll down
 *  3. bottomIdle — rests at the bottom, then after a pause...
 *  4. jetpack    — straps on a jetpack and boosts back up to the top
 *
 * After flying home he stays coding and won't climb again until you scroll
 * back up near the top, so he never snaps out of sync with the scrollbar.
 *
 * Everything is driven by refs + motion values inside one animation frame
 * loop, so changing acts never triggers a React re-render. Limbs are posed
 * by their endpoint coordinates (no fragile SVG transform-origin).
 * Decorative: hidden below xl, aria-hidden, pointer-events-none, and a
 * static "coding" pose under prefers-reduced-motion.
 */

// SVG geometry (user units).
const VB_W = 64;
const VB_H = 760;
const RAIL_L = 20;
const RAIL_R = 44;
const RUNG_TOP = 28;
const RUNG_GAP = 36;
const RUNG_COUNT = Math.floor((VB_H - RUNG_TOP * 2) / RUNG_GAP) + 1;

// Where the climber's hip travels between (local origin y = 0 at the hip).
const TRAVEL_TOP = 44;
const TRAVEL_BOTTOM = VB_H - 64;

// Climb gait + smoothing.
const CYCLE_MS = 1100;
const ARM_THROW = 5;
const LEG_THROW = 4;
const SMOOTH_TAU = 70; // limb-pose blend (ms)
const OPACITY_TAU = 120; // laptop / jetpack fade (ms)
const POS_TAU = 170; // descent follows scroll
const POS_TAU_JET = 300; // jetpack ascent (a touch slower = a clear "boost")

// Scroll-position thresholds that drive the acts.
const T1 = 0.12; // scroll past here → start climbing down
const CODE_AT = 0.06; // scroll back above here → sit and code again
const BOTTOM_AT = 0.97; // reached the bottom
const BOTTOM_EXIT = 0.9; // scroll back above here → cancel the jetpack, climb
const REARM_AT = 0.08; // back near the top → allow climbing again after a flight
const JETPACK_DELAY_MS = 3000; // rest at the bottom before launching ("not immediately")

type Mode = "coding" | "climbing" | "bottomIdle" | "jetpack";

type Pose = {
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
        lhx: 40,
        lhy: -5 + k * 0.9, // hands typing over the laptop
        rhx: 45,
        rhy: -5 + k2 * 0.9,
        lfx: 43,
        lfy: 5, // legs out front (seated)
        rfx: 47,
        rfy: 8,
        body: 3, // sits lower
      };
    }
    case "bottomIdle": {
      const d = Math.sin((t / 900) * Math.PI * 2); // dangle
      return {
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
        lhx: 28 + sh,
        lhy: -15, // hands braced on the straps
        rhx: 36 + sh,
        rhy: -15,
        lfx: 30,
        lfy: 11, // legs together, pointing down
        rfx: 34,
        rfy: 11,
        body: -1,
      };
    }
    default: {
      // climbing — contralateral down-climb
      const s = Math.sin(((t % CYCLE_MS) / CYCLE_MS) * Math.PI * 2);
      return {
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

export function ScrollClimber() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();

  // Position + limb-endpoint + apparatus motion values, eased every frame.
  const posY = useMotionValue(TRAVEL_TOP);
  const lhx = useMotionValue(CODE_POSE.lhx);
  const lhy = useMotionValue(CODE_POSE.lhy);
  const rhx = useMotionValue(CODE_POSE.rhx);
  const rhy = useMotionValue(CODE_POSE.rhy);
  const lfx = useMotionValue(CODE_POSE.lfx);
  const lfy = useMotionValue(CODE_POSE.lfy);
  const rfx = useMotionValue(CODE_POSE.rfx);
  const rfy = useMotionValue(CODE_POSE.rfy);
  const body = useMotionValue(CODE_POSE.body);
  const laptopOpacity = useMotionValue(1);
  const jetpackOpacity = useMotionValue(0);
  const flameY = useMotionValue(12);

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
      // Rest a beat at the bottom, then launch (not immediately).
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
    // jetpack: ignore scroll while boosting home
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

    // Limb pose.
    const sa = 1 - Math.exp(-delta / SMOOTH_TAU);
    const p = poseFor(m, t);
    ease(lhx, p.lhx, sa);
    ease(lhy, p.lhy, sa);
    ease(rhx, p.rhx, sa);
    ease(rhy, p.rhy, sa);
    ease(lfx, p.lfx, sa);
    ease(lfy, p.lfy, sa);
    ease(rfx, p.rfx, sa);
    ease(rfy, p.rfy, sa);
    ease(body, p.body, sa);

    // Vertical position.
    let posTarget = TRAVEL_TOP; // coding & jetpack home to the top
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

    // Apparatus.
    const oa = 1 - Math.exp(-delta / OPACITY_TAU);
    ease(laptopOpacity, m === "coding" ? 1 : 0, oa);
    ease(jetpackOpacity, m === "jetpack" ? 1 : 0, oa);
    const flameTarget =
      m === "jetpack" ? 14 + 6 * Math.abs(Math.sin(t / 45)) : 12;
    ease(flameY, flameTarget, 1 - Math.exp(-delta / 40));
  });

  const rungs = Array.from(
    { length: RUNG_COUNT },
    (_, i) => RUNG_TOP + i * RUNG_GAP
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
        {/* Ladder (always present) */}
        <g
          className="text-edge"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
        >
          <line
            x1={RAIL_L}
            y1={RUNG_TOP - 8}
            x2={RAIL_L}
            y2={VB_H - RUNG_TOP + 8}
          />
          <line
            x1={RAIL_R}
            y1={RUNG_TOP - 8}
            x2={RAIL_R}
            y2={VB_H - RUNG_TOP + 8}
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
            style={{ y: reduce ? CODE_POSE.body : body }}
          >
            {/* Jetpack pack + thrust flames */}
            <motion.g style={{ opacity: reduce ? 0 : jetpackOpacity }}>
              <rect
                x={36}
                y={-19}
                width={5}
                height={12}
                rx={1.5}
                fill="currentColor"
                stroke="none"
              />
              <motion.line x1={30} y1={12} x2={30} y2={flameY} />
              <motion.line x1={34} y1={12} x2={34} y2={flameY} />
            </motion.g>

            {/* Laptop (open) */}
            <motion.g style={{ opacity: reduce ? 1 : laptopOpacity }}>
              <line x1={37} y1={-2} x2={50} y2={-2} />
              <line x1={37} y1={-2} x2={41} y2={-11} />
            </motion.g>

            {/* head */}
            <circle
              cx={32}
              cy={-32}
              r={5.5}
              fill="currentColor"
              stroke="none"
            />
            {/* torso */}
            <line x1={32} y1={-26} x2={32} y2={-4} />
            {/* arms */}
            <motion.line
              x1={32}
              y1={-22}
              x2={reduce ? CODE_POSE.lhx : lhx}
              y2={reduce ? CODE_POSE.lhy : lhy}
            />
            <motion.line
              x1={32}
              y1={-22}
              x2={reduce ? CODE_POSE.rhx : rhx}
              y2={reduce ? CODE_POSE.rhy : rhy}
            />
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
          </motion.g>
        </motion.g>
      </svg>
    </div>
  );
}
