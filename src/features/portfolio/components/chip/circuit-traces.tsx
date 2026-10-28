"use client";

import { useEffect, useRef, useState } from "react";

import { SECTION_IDS, useSectionSpy } from "@/components/section-nav";
import { SECTIONS } from "@/config/sections";
import { getGlide, subscribeToGlide } from "@/lib/page-glide";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────────────────
 * STORYBOARD (circuit traces; wide screens, where the margin has room)
 *
 *  always      the chip's four section pins drop through the board at a
 *              row of vias under it; their traces run left under the
 *              hero as one bus, turn down the page margin and peel off,
 *              one by one, into the pad of the section they lead to
 *  scroll      the trace of the section being read carries current
 *              (signal green); sticky titles drag their trace along
 *  pin click   a pulse runs the length of that trace while the page
 *              glides, landing as the pad flashes
 * ───────────────────────────────────────────────────────── */

/** Narrower than this, the page margin is too thin for the bus. */
const MIN_WIDTH = 1280;

const TRACE = {
  /** Distance between neighbouring traces in the bus. */
  pitch: 8,
  /** Gap between the innermost trace and the content edge. */
  laneGap: 30,
  /** Size of the 45° cut on the innermost corner of each bend. */
  chamfer: 10,
  /** Vias sit this far below the chip's caption; the bus this far below them. */
  viaDrop: 28,
  busDrop: 22,
};

const PULSE = {
  duration: 820,
  easing: "cubic-bezier(0.65, 0, 0.35, 1)",
  /** Pulse length as a fraction of the trace. */
  length: 0.05,
  /** Extra offset past either end, so the round caps never peek out. */
  margin: 0.02,
};

/** Dash offset that parks the pulse just before the start of its trace. */
const PULSE_PARKED = PULSE.length + PULSE.margin;

/*
 * Outer traces in a bend take a longer chamfer, so the bus keeps the same
 * spacing through the 45° cut instead of opening up at each corner.
 */
const CHAMFER_STEP = (2 - Math.SQRT2) * TRACE.pitch;

type Geometry = {
  width: number;
  height: number;
  traces: { d: string; via: { x: number; y: number } }[];
};

function measure(container: HTMLElement): Geometry | null {
  if (window.innerWidth < MIN_WIDTH) return null;

  const pkg = document.querySelector(".chip-package");
  const caption = document.querySelector("[data-chip] + figcaption");
  const pads = SECTIONS.map(({ id }) =>
    document.querySelector(`#${id} [data-pin-pad]`)
  );
  if (!pkg || !caption || pads.some((pad) => !pad)) return null;

  // Everything in the container's coordinates, so the SVG scrolls with it.
  const origin = container.getBoundingClientRect();
  const chip = pkg.getBoundingClientRect();
  const viaY =
    caption.getBoundingClientRect().bottom - origin.top + TRACE.viaDrop;
  const busTop = viaY + TRACE.busDrop;
  const centerX = chip.left + chip.width / 2 - origin.left;
  const contentLeft = pads[0]!.getBoundingClientRect().left - origin.left;
  const last = SECTIONS.length - 1;

  const traces = SECTIONS.map((_, index) => {
    // Pin 1 takes the lane nearest the content, so it can peel off first
    // without crossing the others. Following the bus back, that puts it at
    // the bottom of the bus under the hero and its via furthest east.
    const reversed = last - index;
    const viaX = centerX + (reversed - last / 2) * TRACE.pitch;
    const busY = busTop + reversed * TRACE.pitch;
    const laneX = contentLeft - TRACE.laneGap - index * TRACE.pitch;

    const pad = pads[index]!.getBoundingClientRect();
    const padY = pad.top + pad.height / 2 - origin.top;
    const padX = pad.left - origin.left;

    // The inside of the first bend is pin 4's corner, of the second pin 1's.
    const turnWest = TRACE.chamfer + reversed * CHAMFER_STEP;
    const turnSouth = TRACE.chamfer + index * CHAMFER_STEP;
    const c = TRACE.chamfer;

    const points = [
      [viaX, viaY],
      [viaX, busY - turnWest],
      [viaX - turnWest, busY],
      [laneX + turnSouth, busY],
      [laneX, busY + turnSouth],
      [laneX, padY - c],
      [laneX + c, padY],
      [padX, padY],
    ];

    return {
      d: points
        .map(
          ([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`
        )
        .join(""),
      via: { x: viaX, y: viaY },
    };
  });

  return {
    width: container.scrollWidth,
    height: container.scrollHeight,
    traces,
  };
}

export function CircuitTraces() {
  const ref = useRef<SVGSVGElement>(null);
  const pulseRefs = useRef<(SVGPathElement | null)[]>([]);
  const [geometry, setGeometry] = useState<Geometry | null>(null);
  const activeId = useSectionSpy(SECTION_IDS);

  // Re-measure on layout changes, and on scroll for the sticky titles.
  useEffect(() => {
    const container = ref.current?.parentElement;
    if (!container) return;

    let frame = 0;
    let previous = "";
    const update = () => {
      frame = 0;
      const next = measure(container);
      // Most scroll frames change nothing; skip those renders.
      const key = JSON.stringify(next);
      if (key === previous) return;
      previous = key;
      setGeometry(next);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    const observer = new ResizeObserver(schedule);
    observer.observe(container);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    document.fonts?.ready.then(schedule);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  // A glide towards one of the four sections sends a pulse down its trace.
  useEffect(() => {
    let lastTarget: string | null = null;

    return subscribeToGlide(() => {
      const target = getGlide()?.sectionId ?? null;
      if (target === lastTarget) return;
      lastTarget = target;

      const index = SECTIONS.findIndex(({ id }) => id === target);
      const pulse = pulseRefs.current[index];
      if (!pulse) return;

      pulse.animate(
        // Start and end just past the path, so the round caps stay hidden.
        [
          { strokeDashoffset: PULSE_PARKED },
          { strokeDashoffset: -1 - PULSE.margin },
        ],
        { duration: PULSE.duration, easing: PULSE.easing }
      );
    });
  }, []);

  return (
    <svg
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute top-0 left-0 max-xl:hidden"
      width={geometry?.width ?? 0}
      height={geometry?.height ?? 0}
      fill="none"
    >
      {geometry?.traces.map((trace, index) => {
        const isLive = activeId === SECTIONS[index].id;

        return (
          <g
            key={SECTIONS[index].id}
            data-live={isLive}
            className="group/trace"
          >
            <path
              d={trace.d}
              strokeWidth={1.5}
              strokeLinejoin="round"
              className={cn(
                "stroke-(--trace) transition-[stroke] duration-300",
                "group-data-[live=true]/trace:stroke-success"
              )}
            />
            <path
              ref={(node) => {
                pulseRefs.current[index] = node;
              }}
              d={trace.d}
              pathLength={1}
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={`${PULSE.length} 2`}
              strokeDashoffset={PULSE_PARKED}
              className="stroke-success"
            />
            <circle
              cx={trace.via.x}
              cy={trace.via.y}
              r={2.5}
              strokeWidth={1.5}
              className={cn(
                "fill-background stroke-(--trace) transition-[stroke] duration-300",
                "group-data-[live=true]/trace:stroke-success"
              )}
            />
          </g>
        );
      })}
    </svg>
  );
}
