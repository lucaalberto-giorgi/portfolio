"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTime,
  useTransform,
} from "motion/react";

/**
 * A stickman that continuously climbs a ladder in the left gutter (Option A).
 *
 * - The climbing gait runs on its own time loop, so he's always climbing —
 *   alive even when you're not scrolling.
 * - His vertical position still tracks page scroll progress, so he doubles
 *   as a "you are here" indicator.
 *
 * Limbs are animated by their endpoint coordinates (not CSS rotation), which
 * sidesteps the cross-browser quirks of SVG `transform-origin`. Decorative:
 * hidden below xl, aria-hidden, pointer-events-none, and frozen to a static
 * gripping pose under prefers-reduced-motion.
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

// Gait timing + limb throw.
const CYCLE_MS = 1100; // one full climb stride
const ARM_THROW = 5;
const LEG_THROW = 4;
const BOB = 1.4;

export function ScrollClimber() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const time = useTime();

  // Vertical position, smoothed so the climb glides between scroll deltas.
  const yRaw = useTransform(
    scrollYProgress,
    [0, 1],
    [TRAVEL_TOP, TRAVEL_BOTTOM]
  );
  const y = useSpring(yRaw, { stiffness: 110, damping: 22, mass: 0.4 });

  // -1..1 oscillation advanced by the time loop → the climbing gait.
  const swing = useTransform(time, (t) =>
    Math.sin(((t % CYCLE_MS) / CYCLE_MS) * Math.PI * 2)
  );

  // Contralateral gait: left hand rises with the right foot, and vice versa.
  const leftHandY = useTransform(swing, (s) => -26 + s * ARM_THROW);
  const rightHandY = useTransform(swing, (s) => -26 - s * ARM_THROW);
  const leftFootY = useTransform(swing, (s) => 8 - s * LEG_THROW);
  const rightFootY = useTransform(swing, (s) => 8 + s * LEG_THROW);

  // Slight upper-body bob at each reach.
  const bob = useTransform(swing, (s) => -Math.abs(s) * BOB);

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

        {/* Climber: outer group = scroll position, inner group = gait bob */}
        <motion.g style={{ y: reduce ? TRAVEL_TOP : y }}>
          <motion.g
            className="text-foreground"
            stroke="currentColor"
            strokeWidth={2.4}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ y: reduce ? 0 : bob }}
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
            {/* arms (shoulder → hands on the rails) */}
            <motion.line
              x1={32}
              y1={-22}
              x2={22}
              y2={reduce ? -28 : leftHandY}
            />
            <motion.line
              x1={32}
              y1={-22}
              x2={42}
              y2={reduce ? -24 : rightHandY}
            />
            {/* legs (hip → feet on the rungs) */}
            <motion.line x1={32} y1={-4} x2={24} y2={reduce ? 8 : leftFootY} />
            <motion.line x1={32} y1={-4} x2={40} y2={reduce ? 8 : rightFootY} />
          </motion.g>
        </motion.g>
      </svg>
    </div>
  );
}
