"use client";

import type { CSSProperties } from "react";

import { cn } from "@/lib/utils";

import { SketchStage, useSketchStage } from "./sketch-stage";

/* ─────────────────────────────────────────────────────────
 * STORYBOARD (Receipt Flow, plays once on first view)
 *
 *    0ms   a Tesco receipt is on the desk; the ledger holds three entries
 *  150ms   the scanner sweeps down the receipt (900ms)
 * 1050ms   its entry posts to the top of the ledger, older rows shift down
 * 1400ms   it is filed under Food
 * 1700ms   the Reviewed stamp lands on it
 * ───────────────────────────────────────────────────────── */

const TIMELINE = [150, 1050, 1400, 1700] as const;

const STAGE = {
  scan: 1,
  post: 2,
  category: 3,
  stamp: 4,
} as const;

/** The product's own palette: ledger paper, ink, and rubber-stamp colours. */
const PALETTE = {
  "--desk": "#e9e1cb",
  "--paper": "#fcfaf1",
  "--ink": "#17140d",
  "--graphite": "#7a715f",
  "--rule": "#d9cfb5",
  "--blue": "#2b4c9b",
  "--red": "#c22f1a",
  "--row": "3.25rem",
} as CSSProperties;

const RECEIPT_LINES = [
  ["Meal deal", "3.85"],
  ["Coffee beans", "7.50"],
  ["Olive oil", "6.49"],
  ["Chicken thighs", "5.98"],
  ["Household", "8.65"],
] as const;

type Category = "food" | "travel";
type Status = "reviewed" | "pending";

const EARLIER_ENTRIES: {
  merchant: string;
  receipt: string;
  date: string;
  category: Category;
  amount: string;
  status: Status;
}[] = [
  {
    merchant: "Blue Bottle Coffee",
    receipt: "RCPT-0181",
    date: "2026-10-22",
    category: "food",
    amount: "$8.25",
    status: "reviewed",
  },
  {
    merchant: "Uber",
    receipt: "RCPT-0177",
    date: "2026-10-21",
    category: "travel",
    amount: "$24.60",
    status: "pending",
  },
  {
    merchant: "Vueling Airlines",
    receipt: "RCPT-0164",
    date: "2026-10-16",
    category: "travel",
    amount: "$118.40",
    status: "reviewed",
  },
];

const MONO = "font-mono uppercase tracking-[0.12em]";

export function ReceiptFlowSketch({ href }: { href?: string }) {
  const { ref, at } = useSketchStage(TIMELINE);

  return (
    <SketchStage
      href={href}
      label="Open the Receipt Flow live demo"
      stageRef={ref}
      palette={PALETTE}
      className="bg-(--desk) text-(--ink)"
    >
      <div className="flex h-full gap-6 p-6 sm:p-8">
        <Receipt scan={at(STAGE.scan)} />

        {/* The ledger. */}
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden border border-(--rule) bg-(--paper)">
          <div
            className={`${MONO} flex items-center justify-between border-b border-(--rule) px-4 py-3 text-[9px] leading-none text-(--graphite)`}
          >
            <span className="flex items-center gap-2">
              <span className="size-1.5 bg-(--red)" />
              Recent expenses
            </span>
            <span>4 shown</span>
          </div>

          {/* Starts one row up, so posting the new entry pushes the rest
              down. */}
          <ul
            className="sk-post"
            style={{ "--shift": "calc(-1 * var(--row))" } as CSSProperties}
            {...at(STAGE.post)}
          >
            <LedgerRow
              merchant="Tesco Express"
              receipt="RCPT-0182"
              date="2026-10-27"
              amount="$32.47"
              className="sk-fade"
              rowProps={at(STAGE.post)}
              category={
                <CategoryTag
                  category="food"
                  className="sk-fade"
                  {...at(STAGE.category)}
                />
              }
              status={
                <StatusStamp
                  status="reviewed"
                  className="sk-stamp -rotate-6"
                  {...at(STAGE.stamp)}
                />
              }
            />

            {EARLIER_ENTRIES.map((entry) => (
              <LedgerRow
                key={entry.receipt}
                {...entry}
                category={<CategoryTag category={entry.category} />}
                status={<StatusStamp status={entry.status} />}
              />
            ))}
          </ul>
        </div>
      </div>
    </SketchStage>
  );
}

function Receipt({ scan }: { scan: { "data-on": boolean } }) {
  return (
    // The drop shadow sits on a wrapper because the torn-edge mask would
    // clip a shadow on the receipt itself.
    <div className="relative hidden w-40 shrink-0 self-start drop-shadow-[0_8px_12px_rgb(23_20_13/0.22)] @[34rem]:block">
      <div className="sk-receipt relative overflow-hidden bg-(--paper) px-3 pt-3.5 pb-6 font-mono text-[9.5px] leading-[1.6]">
        <p className="text-center font-semibold tracking-[0.08em]">
          TESCO EXPRESS
        </p>
        <p className="text-center text-(--graphite)">Camden High St</p>
        <p className="text-center text-(--graphite) tabular-nums">
          27/10/26 08:41
        </p>

        <div className="my-2 border-t border-dashed border-(--rule)" />

        {RECEIPT_LINES.map(([item, price]) => (
          <p key={item} className="flex justify-between tabular-nums">
            <span>{item}</span>
            <span>{price}</span>
          </p>
        ))}

        <div className="my-2 border-t border-dashed border-(--rule)" />

        <p className="flex justify-between font-semibold tabular-nums">
          <span>TOTAL</span>
          <span>32.47</span>
        </p>

        {/* Scanner light: a line with a soft wash trailing behind it. */}
        <div className="sk-scan pointer-events-none absolute inset-0" {...scan}>
          <div className="absolute inset-x-0 bottom-0 h-10 bg-linear-to-b from-transparent to-(--blue)/15" />
          <div className="absolute inset-x-0 bottom-0 h-0.5 bg-(--blue) shadow-[0_0_8px_var(--blue)]" />
        </div>
      </div>
    </div>
  );
}

function LedgerRow({
  merchant,
  receipt,
  date,
  amount,
  category,
  status,
  className,
  rowProps,
}: {
  merchant: string;
  receipt: string;
  date: string;
  amount: string;
  category: React.ReactNode;
  status: React.ReactNode;
  className?: string;
  rowProps?: { "data-on": boolean };
}) {
  return (
    <li
      className={cn(
        "flex h-(--row) items-center gap-2 border-b border-(--rule) px-3 @[26rem]:gap-3 @[26rem]:px-4",
        className
      )}
      {...rowProps}
    >
      <span className="hidden size-6 shrink-0 items-center justify-center border border-(--rule) bg-(--desk)/50 font-mono text-[10px] @[26rem]:flex">
        {merchant[0]}
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate text-[12.5px] leading-4 font-semibold">
          {merchant}
        </p>
        <p
          className={`${MONO} mt-0.5 truncate text-[8px] leading-3 text-(--graphite) tabular-nums`}
        >
          {receipt}&ensp;{date}
        </p>
      </div>

      <div className="hidden @[28rem]:block">{category}</div>
      <span className="w-15 text-right font-mono text-[12px] font-semibold tabular-nums">
        {amount}
      </span>
      <div className="flex w-16 justify-end @[26rem]:w-17">{status}</div>
    </li>
  );
}

function CategoryTag({
  category,
  className,
  ...props
}: {
  category: Category;
  className?: string;
  "data-on"?: boolean;
}) {
  return (
    <span
      className={cn(
        MONO,
        "inline-block border px-1.5 py-1 text-[8px] leading-none",
        category === "food"
          ? "border-[#d9c66f] bg-[#f1e3a3] text-[#6b5a12]"
          : "border-(--blue)/30 bg-[#d6e0ee] text-(--blue)",
        className
      )}
      {...props}
    >
      {category}
    </span>
  );
}

function StatusStamp({
  status,
  className,
  ...props
}: {
  status: Status;
  className?: string;
  "data-on"?: boolean;
}) {
  return (
    <span
      className={cn(
        MONO,
        "inline-block border px-1.5 py-1 text-[8px] leading-none font-semibold",
        status === "reviewed"
          ? "border-(--blue)/50 bg-[#dfe7f3] text-(--blue)"
          : "border-(--red)/40 bg-[#f6d9d3] text-(--red)",
        className
      )}
      {...props}
    >
      {status}
    </span>
  );
}
