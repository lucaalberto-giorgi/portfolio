"use client";

import type { MotionValue } from "motion/react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * A stickman that climbs a ladder in the homepage left gutter and reacts to
 * where you settle:
 *
 * - scrolling      → contralateral climbing gait
 * - idle near top  → "summit": pulls up tall and waves hello
 * - idle near bottom → "rest": sits on a rung with legs dangling
 * - idle mid-ladder  → "breathe": gentle hang so he never looks frozen
 *
 * Limbs are animated by their endpoint coordinates (no fragile SVG
 * transform-origin). Each frame eases the limbs toward the current pose, so
 * mode changes blend smoothly. Decorative: hidden below xl, aria-hidden,
 * pointer-events-none, and a static pose under prefers-reduced-motion.
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

// Behaviour tuning.
const CYCLE_MS = 1100; // one full climb stride
const ARM_THROW = 5;
const LEG_THROW = 4;
const SMOOTH_TAU = 70; // pose-blend time constant (ms); lower = snappier
const VEL_THRESHOLD = 0.004; // |scroll-progress / s| above which he's climbing
const SETTLE_MS = 280; // idle time before he settles into an end pose
const TOP_AT = 0.04;
const BOTTOM_AT = 0.96;

type Mode = "climbing" | "top" | "bottom" | "breathe";

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
    case "top": {
      // One hand holds the ladder; the other waves hello high above the head.
      const w = Math.sin((t / 540) * Math.PI * 2); // friendly wave cadence
      return {
        lhx: 22,
        lhy: -20, // left hand grips the rail, anchored
        rhx: 46 + w * 8, // right hand sweeps side to side...
        rhy: -47, // ...held high over the head
        lfx: 27,
        lfy: 5,
        rfx: 37,
        rfy: 5, // feet planted on the rung
        body: -2, // standing tall
      };
    }
    case "bottom": {
      const d = Math.sin((t / 900) * Math.PI * 2); // dangle
      return {
        lhx: 26,
        lhy: -20, // hands resting on a rung
        rhx: 38,
        rhy: -20,
        lfx: 28 + d * 3,
        lfy: 15, // legs hang and swing together
        rfx: 36 + d * 3,
        rfy: 15,
        body: 3, // sits lower
      };
    }
    case "breathe": {
      const b = Math.sin((t / 2200) * Math.PI * 2); // slow breath
      return {
        lhx: 24,
        lhy: -27, // hands holding a rung overhead
        rhx: 40,
        rhy: -27,
        lfx: 25,
        lfy: 8,
        rfx: 39,
        rfy: 8,
        body: b * 0.8,
      };
    }
    default: {
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

const REST_POSE = poseFor("breathe", 0);

export function ScrollClimber() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const velocity = useVelocity(scrollYProgress);

  // Vertical position, smoothed so the climb glides between scroll deltas.
  const yRaw = useTransform(
    scrollYProgress,
    [0, 1],
    [TRAVEL_TOP, TRAVEL_BOTTOM]
  );
  const y = useSpring(yRaw, { stiffness: 110, damping: 22, mass: 0.4 });

  // Limb endpoint + body-offset motion values, eased toward the active pose.
  const lhx = useMotionValue(REST_POSE.lhx);
  const lhy = useMotionValue(REST_POSE.lhy);
  const rhx = useMotionValue(REST_POSE.rhx);
  const rhy = useMotionValue(REST_POSE.rhy);
  const lfx = useMotionValue(REST_POSE.lfx);
  const lfy = useMotionValue(REST_POSE.lfy);
  const rfx = useMotionValue(REST_POSE.rfx);
  const rfy = useMotionValue(REST_POSE.rfy);
  const body = useMotionValue(REST_POSE.body);

  const [mode, setMode] = useState<Mode>("top");
  const modeRef = useRef<Mode>("top");
  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  // Settle into an end pose once scrolling stops.
  const settleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scheduleSettle = useCallback(() => {
    if (settleTimer.current) clearTimeout(settleTimer.current);
    settleTimer.current = setTimeout(() => {
      const p = scrollYProgress.get();
      setMode(p <= TOP_AT ? "top" : p >= BOTTOM_AT ? "bottom" : "breathe");
    }, SETTLE_MS);
  }, [scrollYProgress]);

  useMotionValueEvent(velocity, "change", (v) => {
    if (Math.abs(v) > VEL_THRESHOLD) setMode("climbing");
    scheduleSettle();
  });

  useEffect(() => {
    scheduleSettle(); // settle on load (page opens at the top)
    return () => {
      if (settleTimer.current) clearTimeout(settleTimer.current);
    };
  }, [scheduleSettle]);

  useAnimationFrame((t, delta) => {
    if (reduce) return;
    const alpha = 1 - Math.exp(-delta / SMOOTH_TAU);
    const p = poseFor(modeRef.current, t);
    const ease = (mv: MotionValue<number>, to: number) =>
      mv.set(mv.get() + (to - mv.get()) * alpha);
    ease(lhx, p.lhx);
    ease(lhy, p.lhy);
    ease(rhx, p.rhx);
    ease(rhy, p.rhy);
    ease(lfx, p.lfx);
    ease(lfy, p.lfy);
    ease(rfx, p.rfx);
    ease(rfy, p.rfy);
    ease(body, p.body);
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
        {/* Ladder */}
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

        {/* Climber: outer group = scroll position, inner group = body offset */}
        <motion.g style={{ y: reduce ? TRAVEL_TOP : y }}>
          <motion.g
            className="text-foreground"
            stroke="currentColor"
            strokeWidth={2.4}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ y: reduce ? 0 : body }}
          >
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
            {/* arms (shoulder → hands) */}
            <motion.line
              x1={32}
              y1={-22}
              x2={reduce ? REST_POSE.lhx : lhx}
              y2={reduce ? REST_POSE.lhy : lhy}
            />
            <motion.line
              x1={32}
              y1={-22}
              x2={reduce ? REST_POSE.rhx : rhx}
              y2={reduce ? REST_POSE.rhy : rhy}
            />
            {/* legs (hip → feet) */}
            <motion.line
              x1={32}
              y1={-4}
              x2={reduce ? REST_POSE.lfx : lfx}
              y2={reduce ? REST_POSE.lfy : lfy}
            />
            <motion.line
              x1={32}
              y1={-4}
              x2={reduce ? REST_POSE.rfx : rfx}
              y2={reduce ? REST_POSE.rfy : rfy}
            />
          </motion.g>
        </motion.g>
      </svg>
    </div>
  );
}
