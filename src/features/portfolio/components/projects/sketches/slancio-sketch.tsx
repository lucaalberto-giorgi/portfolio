"use client";

import { CheckIcon, SparklesIcon } from "lucide-react";
import type { CSSProperties } from "react";

import { cn } from "@/lib/utils";

import { SketchStage, useSketchStage } from "./sketch-stage";

/*
 * Slancio is not on the market yet, so this sketch shows the AI at work
 * without showing what it works on: the drafts are lines, not words.
 */

/* ─────────────────────────────────────────────────────────
 * STORYBOARD (Slancio, plays once on first view)
 *
 *    0ms   the mark rests beside an empty panel
 *  150ms   the ring around the mark starts turning: Slancio is reading
 *  400ms   three drafts stream in, 250ms apart, their lines writing
 *          themselves left to right
 * 1600ms   the ring stops; the status reads "3 drafts ready"
 * 1900ms   the first draft opens its actions
 * 2700ms   the coach presses Approve
 * 2850ms   it reads Approved
 * ───────────────────────────────────────────────────────── */

const TIMELINE = [150, 400, 1600, 1900, 2700, 2850] as const;

const STAGE = {
  reading: 1,
  drafts: 2,
  ready: 3,
  actions: 4,
  press: 5,
  approved: 6,
} as const;

/** The product's own palette: near-black, warm cream, and a hot orange. */
const PALETTE = {
  "--night": "#0b0a09",
  "--panel": "#141110",
  "--raised": "#1c1716",
  "--line": "#2a2421",
  "--cream": "#f5f1e8",
  "--dim": "#9b9087",
  "--flame": "#ff4a1c",
} as CSSProperties;

const DRAFT_STAGGER_MS = 250;

/** Initials and line lengths (percent) for each draft: content stays private. */
const DRAFTS = [
  { initials: "GB", lines: [46, 82] },
  { initials: "MR", lines: [38, 70] },
  { initials: "AC", lines: [52, 64] },
];

export function SlancioSketch({ href }: { href?: string }) {
  const { ref, stage, at } = useSketchStage(TIMELINE);
  const approved = stage >= STAGE.approved;

  return (
    <SketchStage
      href={href}
      label="Open the Slancio live demo"
      stageRef={ref}
      palette={PALETTE}
      className="bg-(--night) bg-[radial-gradient(120%_90%_at_0%_50%,rgb(255_74_28/0.14),transparent_55%)] text-(--cream)"
    >
      <div className="flex h-full items-center gap-8 p-6">
        {/* The mark, with a ring that turns while Slancio reads. */}
        <div className="relative hidden size-36 shrink-0 items-center justify-center @[34rem]:flex">
          <div className="absolute size-28 rounded-full bg-(--flame)/20 blur-2xl" />
          <div className="sk-fade absolute inset-5" {...at(STAGE.reading)}>
            <div className="sk-out size-full" {...at(STAGE.ready)}>
              <div className="sk-orbit size-full rounded-full" />
            </div>
          </div>
          <SlancioMark className="relative size-16" />
        </div>

        <div className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-2xl border border-(--line) bg-(--panel)">
          <div className="flex items-center gap-2 px-4 py-3">
            <SparklesIcon
              className="size-3.5 shrink-0 text-(--flame)"
              strokeWidth={2}
            />
            <p className="grid text-[13px] leading-5 font-semibold">
              <span
                className="sk-out sk-shimmer col-start-1 row-start-1"
                {...at(STAGE.ready)}
              >
                Reading your clients&apos; updates
              </span>
              <span
                className="sk-fade col-start-1 row-start-1"
                // Waits for the old status to clear, so the two never overlap.
                style={{ "--d": "180ms" } as CSSProperties}
                {...at(STAGE.ready)}
              >
                3 drafts ready
              </span>
            </p>
          </div>

          {DRAFTS.map((draft, index) => {
            const delay = index * DRAFT_STAGGER_MS;

            return (
              <div
                key={draft.initials}
                className="sk-rise flex gap-3 border-t border-(--line) px-4 py-3"
                style={{ "--d": `${delay}ms` } as CSSProperties}
                {...at(STAGE.drafts)}
              >
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-(--line) bg-(--raised) text-[8.5px] font-semibold text-(--flame)">
                  {draft.initials}
                </span>

                <div className="min-w-0 flex-1 space-y-2 pt-1">
                  {draft.lines.map((width, line) => (
                    <div
                      key={line}
                      className="h-1.5"
                      style={{ width: `${width}%` }}
                    >
                      {/* Writes itself left to right; the orange tip is the
                          "pen", and fades once every draft is written. */}
                      <div
                        className={cn(
                          "sk-fill relative h-full rounded-full",
                          line === 0 ? "bg-(--cream)/75" : "bg-(--dim)/40"
                        )}
                        style={
                          {
                            "--d": `${delay + 120 + line * 160}ms`,
                          } as CSSProperties
                        }
                        {...at(STAGE.drafts)}
                      >
                        <div
                          className="sk-out absolute inset-0 rounded-full bg-linear-to-r from-transparent from-60% to-(--flame)"
                          {...at(STAGE.ready)}
                        />
                      </div>
                    </div>
                  ))}

                  {index === 0 && (
                    <div
                      className="sk-rise flex gap-1.5 pt-1 text-[10px] leading-none font-medium"
                      {...at(STAGE.actions)}
                    >
                      <span
                        data-pressed={stage === STAGE.press}
                        className={cn(
                          "sk-press inline-flex items-center gap-1 rounded-full px-2.5 py-1.5",
                          approved
                            ? "bg-(--cream) text-(--night)"
                            : "bg-(--flame) text-(--night)"
                        )}
                      >
                        {approved && (
                          <CheckIcon className="size-3" strokeWidth={3} />
                        )}
                        {approved ? "Approved" : "Approve"}
                      </span>
                      <span className="rounded-full border border-(--line) px-2.5 py-1.5 text-(--dim)">
                        Edit
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </SketchStage>
  );
}

/** Slancio's mark: a lightning S on an orange tile (from the live app). */
function SlancioMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden>
      <rect width="64" height="64" rx="14.4" fill="var(--flame)" />
      <g transform="translate(15.42 8.96) scale(0.3315)">
        <path
          d="M91 0C78 9.5 0 28 0 56c0 9 4 17.5 13 18.5 17 2.5 39 6.5 53 13.5-16 3-46 7-57 51 13-9.5 91-28 91-56 0-9-4-17.5-13-18.5-17-2.5-39-6.5-53-13.5 16-3 46-7 57-51Z"
          fill="#0b0a09"
        />
        <path
          d="M13 74.5c17 2.5 39 6.5 53 13.5l21-23.5c-17-2.5-39-6.5-53-13.5Z"
          fill="#3a1508"
        />
      </g>
    </svg>
  );
}
