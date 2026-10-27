"use client";

import type { CSSProperties } from "react";

import { CountUp, SketchStage, useSketchStage } from "./sketch-stage";

/* ─────────────────────────────────────────────────────────
 * STORYBOARD (CV matcher, plays once on first view)
 *
 *    0ms   an empty desk
 *  150ms   the CV and the job description slide in (staggered)
 *  450ms   the match report rises in
 *  700ms   the score counts to 82 and both meters fill
 * 1500ms   the "Strong match" stamp lands
 * 1700ms   matched and missing skills appear (staggered 50ms)
 * ───────────────────────────────────────────────────────── */

const TIMELINE = [150, 450, 700, 1500, 1700] as const;

const STAGE = {
  exhibits: 1,
  report: 2,
  score: 3,
  verdict: 4,
  skills: 5,
} as const;

/** The product's own palette: typeset paper, ink, and a red seal. */
const PALETTE = {
  "--desk": "#ede7d9",
  "--paper": "#fbf8f1",
  "--ink": "#1d1a15",
  "--graphite": "#6e665a",
  "--rule": "#ddd4c2",
  "--seal": "#bf3f1d",
} as CSSProperties;

const SCORE = 82;

const METERS = [
  { label: "Semantic similarity", value: 0.86 },
  { label: "Keyword coverage", value: 0.74 },
];

const MATCHED = ["React", "TypeScript", "FastAPI", "REST APIs"];
const MISSING = ["Docker"];

const SERIF = "sk-serif";
const MONO = "font-mono tracking-[0.14em] uppercase";

export function CvMatcherSketch({ href }: { href?: string }) {
  const { ref, stage, at } = useSketchStage(TIMELINE);

  return (
    <SketchStage
      href={href}
      label="Open the AI CV & Job Matching System live demo"
      stageRef={ref}
      palette={PALETTE}
      className="bg-(--desk) text-(--ink)"
    >
      <div className="flex h-full gap-6 p-6 sm:p-8">
        {/* Exhibits A and B: the two documents being compared. */}
        <div className="relative hidden w-44 shrink-0 @[34rem]:block">
          <Exhibit
            tab="Curriculum vitae"
            lines={[70, 92, 84, 90, 60, 88]}
            className="top-0 left-0 -rotate-2"
            {...at(STAGE.exhibits)}
          />
          {/* Laid on top, lower down, so both tabs show. */}
          <Exhibit
            tab="Job description"
            lines={[92, 80, 88, 64, 86, 72]}
            className="top-28 left-4 rotate-[2.5deg]"
            style={{ "--d": "90ms" } as CSSProperties}
            {...at(STAGE.exhibits)}
          />
        </div>

        {/* The match report. */}
        <div
          className="sk-rise flex min-w-0 flex-1 flex-col rounded-[3px] border border-(--rule) bg-(--paper) p-5 shadow-[0_1px_0_var(--rule)]"
          {...at(STAGE.report)}
        >
          <div className="flex items-start justify-between gap-3">
            <p className={`${SERIF} text-[15px] leading-5`}>Match report</p>
            <span
              className={`sk-stamp ${MONO} inline-block -rotate-6 rounded-[3px] border-[1.5px] border-(--seal) px-2 py-1 text-[9px] leading-none font-semibold text-(--seal)`}
              {...at(STAGE.verdict)}
            >
              Strong match
            </span>
          </div>

          <p className={`${SERIF} mt-1 flex items-baseline gap-1.5`}>
            <CountUp
              to={SCORE}
              on={stage >= STAGE.score}
              className="text-[3.25rem] leading-none tracking-[-0.03em]"
            />
            <span className="text-sm text-(--graphite)">/ 100</span>
          </p>

          <div className="mt-4 space-y-2.5">
            {METERS.map((meter, index) => (
              <div key={meter.label}>
                <div className="flex justify-between text-[11px] leading-4 text-(--graphite)">
                  <span>{meter.label}</span>
                  <span className="tabular-nums">{meter.value.toFixed(2)}</span>
                </div>
                <div className="mt-1 h-1 bg-(--rule)">
                  <div
                    className="sk-fill h-full bg-(--ink)"
                    style={
                      {
                        "--v": meter.value,
                        "--d": `${index * 120}ms`,
                      } as CSSProperties
                    }
                    {...at(STAGE.score)}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-auto flex flex-wrap gap-1.5 pt-4">
            {MATCHED.map((skill, index) => (
              <Chip key={skill} index={index} {...at(STAGE.skills)}>
                {skill}
              </Chip>
            ))}
            {MISSING.map((skill) => (
              <Chip
                key={skill}
                index={MATCHED.length}
                missing
                {...at(STAGE.skills)}
              >
                {skill}
              </Chip>
            ))}
          </div>
        </div>
      </div>
    </SketchStage>
  );
}

function Exhibit({
  tab,
  lines,
  className,
  style,
  ...props
}: {
  tab: string;
  lines: number[];
  className?: string;
  style?: CSSProperties;
  "data-on": boolean;
}) {
  return (
    <div
      className={`sk-rise absolute w-40 ${className}`}
      style={style}
      {...props}
    >
      <span
        className={`${MONO} inline-block bg-(--ink) px-2 py-1 text-[7.5px] leading-none text-(--paper)`}
      >
        {tab}
      </span>
      <div className="space-y-2 border border-(--rule) bg-(--paper) px-3 pt-3 pb-6 shadow-[0_8px_20px_-12px_rgb(29_26_21/0.35)]">
        <div className="mb-3 h-2 w-16 bg-(--ink)/80" />
        {lines.map((width, index) => (
          <div
            key={index}
            className="h-1 bg-(--rule)"
            style={{ width: `${width}%` }}
          />
        ))}
      </div>
    </div>
  );
}

function Chip({
  index,
  missing = false,
  children,
  ...props
}: {
  index: number;
  missing?: boolean;
  children: React.ReactNode;
  "data-on": boolean;
}) {
  return (
    <span
      className={
        missing
          ? "sk-rise rounded-full border border-dashed border-(--seal) px-2 py-0.5 text-[11px] leading-4 text-(--seal)"
          : "sk-rise rounded-full border border-(--ink)/20 px-2 py-0.5 text-[11px] leading-4"
      }
      style={{ "--d": `${index * 50}ms` } as CSSProperties}
      {...props}
    >
      {missing ? `Missing: ${children}` : children}
    </span>
  );
}
