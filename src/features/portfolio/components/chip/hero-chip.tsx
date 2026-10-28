"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import type { CSSProperties, PointerEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { SectionLink } from "@/components/same-page-link";
import { SECTIONS } from "@/config/sections";
import { SOCIAL_LINKS_BY_KEY } from "@/features/portfolio/data/social-links";
import { USER } from "@/features/portfolio/data/user";
import { useIsClient } from "@/hooks/use-is-client";
import { cn } from "@/lib/utils";
import { copyText } from "@/utils/copy";
import { decodeEmail } from "@/utils/string";

import { CV_DOWNLOAD_NAME, CV_FILE } from "../profile-actions";
import { ChipDie, PIN_FAR, PIN_NEAR } from "./chip-die";

/* ─────────────────────────────────────────────────────────
 * STORYBOARD (hero chip; CSS, so it stays smooth while the page hydrates)
 *
 *    0ms   the package sits on the page, unpowered, pins retracted
 *  120ms   pins extend from the package, 1 → 8 counterclockwise, 45ms apart
 *  460ms   pin labels fade in, same order
 *  820ms   the spark at the core switches on and its glow blooms
 *
 * INTERACTION
 *  hover pin       current runs down the leg into the package, the pin's
 *                  number lights, the spark brightens
 *  pointer over    an X-ray loupe opens (spring) and follows the pointer,
 *                  magnifying the die under the lid
 *  tap (touch)     opens the loupe where tapped; tap it again to close
 *
 *  Pins 1-4 are the sections (and the 1-4 shortcuts); 5-8 are the ways to
 *  reach Luca. Inputs on one side, outputs on the other, as on a pinout.
 * ───────────────────────────────────────────────────────── */

const LENS = {
  /** Radius on screen, as a fraction of the package's width. */
  radius: 0.27,
  zoom: 1.8,
  follow: { stiffness: 420, damping: 38, mass: 0.6 },
  open: { type: "spring", visualDuration: 0.28, bounce: 0 } as const,
};

type PinSide = "left" | "bottom" | "right" | "top";

type PinAction =
  | { kind: "section"; sectionId: string }
  | { kind: "email" }
  | { kind: "cv" }
  | { kind: "external"; href: string };

type Pin = {
  number: number;
  label: string;
  side: PinSide;
  /** Fraction along the side, top to bottom or left to right. */
  at: number;
  action: PinAction;
};

// Numbered counterclockwise from the top-left, like a real package.
const SECTION_PIN_PLACES: { side: PinSide; at: number }[] = [
  { side: "left", at: PIN_NEAR },
  { side: "left", at: PIN_FAR },
  { side: "bottom", at: PIN_NEAR },
  { side: "bottom", at: PIN_FAR },
];

const PINS: Pin[] = [
  ...SECTIONS.map((section, index) => ({
    number: index + 1,
    label: section.label,
    ...SECTION_PIN_PLACES[index],
    action: { kind: "section", sectionId: section.id } as const,
  })),
  {
    number: 5,
    label: "Email",
    side: "right",
    at: PIN_FAR,
    action: { kind: "email" },
  },
  {
    number: 6,
    label: "CV",
    side: "right",
    at: PIN_NEAR,
    action: { kind: "cv" },
  },
  {
    number: 7,
    label: "LinkedIn",
    side: "top",
    at: PIN_FAR,
    action: { kind: "external", href: SOCIAL_LINKS_BY_KEY.linkedin.href },
  },
  {
    number: 8,
    label: "GitHub",
    side: "top",
    at: PIN_NEAR,
    action: { kind: "external", href: SOCIAL_LINKS_BY_KEY.github.href },
  },
];

const DEFAULT_CAPTION = (
  <>
    <span className="font-semibold text-foreground">Figure 1.</span> Pins 1 to 4
    go to a section below; 5 to 8 open email, my CV and profiles.
  </>
);

export function HeroChip({
  marking = `${USER.firstName} ${USER.lastName}`,
  caption = DEFAULT_CAPTION,
  className,
}: {
  /** The laser marking on the lid. */
  marking?: string;
  /** Says what the pins do here; the hint to look inside follows it. */
  caption?: React.ReactNode;
  className?: string;
}) {
  return (
    <figure className={cn("flex flex-col items-center", className)}>
      <div
        data-chip
        className={cn(
          // Package size, leg length and pin thickness scale together. On
          // the narrowest phones the package gives way so the labels fit.
          "[--body:clamp(7rem,100vw-13.5rem,9.5rem)] [--leg:1.25rem] [--pin-w:0.5rem] sm:[--body:13rem] sm:[--leg:1.625rem] sm:[--pin-w:0.6875rem] lg:[--body:16.5rem] lg:[--leg:2rem] lg:[--pin-w:0.8125rem]",
          // Room for the labels around the legs. On phones "Experience" may
          // hang a little past this box; the column is centred, so it has room.
          "px-[calc(var(--leg)+3rem)] py-[calc(var(--leg)+2rem)] sm:px-[calc(var(--leg)+6rem)] sm:py-[calc(var(--leg)+2.25rem)]"
        )}
      >
        <div className="relative size-(--body)">
          <Package marking={marking} />

          {PINS.map((pin) => (
            <PinLink key={pin.number} pin={pin} />
          ))}
        </div>
      </div>

      <figcaption className="max-w-[23rem] text-center text-sm leading-6 text-muted-foreground">
        {caption}{" "}
        <span className="[@media(hover:none)]:hidden">
          Hover the chip to look inside.
        </span>
        <span className="[@media(hover:hover)]:hidden">
          Tap the chip to look inside.
        </span>
      </figcaption>
    </figure>
  );
}

/** The lid, with the die under it, seen through a loupe that follows the pointer. */
function Package({ marking }: { marking: string }) {
  const reduceMotion = !!useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [radius, setRadius] = useState(0);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const followX = useSpring(x, LENS.follow);
  const followY = useSpring(y, LENS.follow);
  const lensX = reduceMotion ? x : followX;
  const lensY = reduceMotion ? y : followY;

  const open = useMotionValue(0);
  const openSpring = useSpring(open, LENS.open);
  const openness = reduceMotion ? open : openSpring;

  // The die layer is scaled around the pointer, so its clip is drawn in
  // unscaled units: radius / zoom on the layer is radius on screen.
  const clipRadius = useTransform(
    openness,
    (value) => (value * radius) / LENS.zoom
  );
  const clipPath = useMotionTemplate`circle(${clipRadius}px at ${lensX}px ${lensY}px)`;
  const origin = useMotionTemplate`${lensX}px ${lensY}px`;
  const ringX = useTransform(lensX, (value) => value - radius);
  const ringY = useTransform(lensY, (value) => value - radius);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const measure = () => setRadius(node.offsetWidth * LENS.radius);
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const pointAt = (event: PointerEvent<HTMLDivElement>, jump: boolean) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const px = event.clientX - rect.left;
    const py = event.clientY - rect.top;

    if (jump) {
      x.jump(px);
      y.jump(py);
      followX.jump(px);
      followY.jump(py);
    } else {
      x.set(px);
      y.set(py);
    }

    return { px, py };
  };

  return (
    <div
      ref={ref}
      className={cn(
        "chip-package absolute inset-0 overflow-hidden rounded-[18%] select-none",
        "touch-manipulation"
      )}
      onPointerEnter={(event) => {
        if (event.pointerType === "touch") return;
        pointAt(event, true);
        open.set(1);
      }}
      onPointerMove={(event) => {
        if (event.pointerType === "touch") return;
        pointAt(event, false);
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === "touch") return;
        open.set(0);
      }}
      onPointerDown={(event) => {
        if (event.pointerType !== "touch") return;

        // Tapping inside an open loupe closes it; anywhere else moves it there.
        const rect = event.currentTarget.getBoundingClientRect();
        const distance = Math.hypot(
          event.clientX - rect.left - x.get(),
          event.clientY - rect.top - y.get()
        );

        if (open.get() === 1 && distance < radius) {
          open.set(0);
          return;
        }

        pointAt(event, open.get() === 0);
        open.set(1);
      }}
    >
      <Lid marking={marking} />

      {/* The die, magnified around the pointer and clipped to the loupe. */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          clipPath,
          transformOrigin: origin,
          scale: LENS.zoom,
        }}
      >
        <ChipDie />
      </motion.div>

      {/* The loupe's rim. */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute top-0 left-0 rounded-full border border-white/45 shadow-[inset_0_0_0_1px_rgb(0_0_0/0.35),inset_0_0_18px_rgb(255_255_255/0.12),0_6px_18px_rgb(0_0_0/0.4)]"
        style={{
          width: radius * 2,
          height: radius * 2,
          x: ringX,
          y: ringY,
          scale: openness,
          opacity: openness,
        }}
      />
    </div>
  );
}

/** The top of the package: heat spreader, pin-1 dimple, marking, spark. */
function Lid({ marking }: { marking: string }) {
  return (
    <div aria-hidden className="absolute inset-0">
      <div className="chip-spreader absolute inset-[11%] rounded-[12%]" />
      <div className="absolute top-[17%] left-[17%] size-[5.5%] rounded-full bg-black/35 shadow-[inset_0_1px_2px_rgb(0_0_0/0.6),0_1px_0_rgb(255_255_255/0.08)]" />

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-[6%]">
        <div className="relative size-[30%]">
          <div className="chip-glow absolute -inset-[48%] rounded-full" />
          <svg
            viewBox="90 90 76 76"
            className="chip-spark relative size-full"
            aria-hidden
          >
            <path
              fill="currentColor"
              d="M128 90Q135.6 120.4 166 128Q135.6 135.6 128 166Q120.4 135.6 90 128Q120.4 120.4 128 90Z"
            />
          </svg>
        </div>
      </div>

      <p className="chip-marking absolute inset-x-0 bottom-[19%] text-center">
        {marking}
      </p>
    </div>
  );
}

function PinLink({ pin }: { pin: Pin }) {
  const { side, at, number, label, action } = pin;
  const horizontal = side === "left" || side === "right";

  const isNear = at < 0.5;

  // Left and right pins sit at --at down their side. Top and bottom pins sit
  // at --at across theirs, labels centred over the leg; on phones a pair's
  // labels would touch, so they splay outward from their legs instead.
  const placement: Record<PinSide, string> = {
    left: "right-full top-[calc(var(--at)*100%)] -translate-y-1/2 flex-row-reverse py-1.5",
    right:
      "left-full top-[calc(var(--at)*100%)] -translate-y-1/2 flex-row py-1.5",
    top: "bottom-full flex-col-reverse",
    bottom: "top-full flex-col",
  };

  const acrossPlacement = isNear
    ? "right-[calc((1_-_var(--at))_*_100%_-_var(--pin-w)_/_2)] items-end"
    : "left-[calc(var(--at)_*_100%_-_var(--pin-w)_/_2)] items-start";

  // The pin number sits on the package, just inside where the leg enters.
  const numberPlacement: Record<PinSide, string> = {
    left: "left-full ml-[calc(var(--body)*0.04)] top-1/2 -translate-y-1/2",
    right: "right-full mr-[calc(var(--body)*0.04)] top-1/2 -translate-y-1/2",
    top: "top-full mt-[calc(var(--body)*0.03)] left-1/2 -translate-x-1/2",
    bottom: "bottom-full mb-[calc(var(--body)*0.03)] left-1/2 -translate-x-1/2",
  };

  const className = cn(
    "group/pin absolute z-10 flex items-center gap-2 outline-none sm:gap-2.5",
    placement[side],
    !horizontal && [
      acrossPlacement,
      "sm:right-auto sm:left-[calc(var(--at)*100%)] sm:-translate-x-1/2 sm:items-center",
    ]
  );

  const style = { "--at": at, "--i": number - 1 } as CSSProperties;

  const content = (
    <>
      <span className="relative flex shrink-0">
        <span
          className={cn(
            "chip-leg relative overflow-hidden",
            horizontal ? "h-(--pin-w) w-(--leg)" : "h-(--leg) w-(--pin-w)",
            {
              left: "rounded-l-full",
              right: "rounded-r-full",
              top: "rounded-t-full",
              bottom: "rounded-b-full",
            }[side]
          )}
          data-side={side}
        />

        <span
          aria-hidden
          className={cn(
            "chip-number pointer-events-none absolute text-[9px] leading-none font-semibold tabular-nums sm:text-[10px] lg:text-[11px]",
            numberPlacement[side]
          )}
        >
          {number}
        </span>
      </span>

      <span
        className={cn(
          "chip-label text-[13px] leading-5 font-medium whitespace-nowrap text-foreground sm:text-[15px]",
          "decoration-foreground/30 underline-offset-4 group-hover/pin:underline",
          "rounded-sm group-focus-visible/pin:ring-2 group-focus-visible/pin:ring-ring group-focus-visible/pin:ring-offset-2 group-focus-visible/pin:ring-offset-background"
        )}
      >
        {label}
      </span>
    </>
  );

  if (action.kind === "section") {
    return (
      <SectionLink
        sectionId={action.sectionId}
        className={className}
        style={style}
        data-pin={number}
      >
        {content}
      </SectionLink>
    );
  }

  if (action.kind === "email") {
    return (
      <EmailPin className={className} style={style}>
        {content}
      </EmailPin>
    );
  }

  if (action.kind === "cv") {
    return (
      <a
        href={CV_FILE}
        download={CV_DOWNLOAD_NAME}
        className={className}
        style={style}
        data-pin={number}
      >
        {content}
        <span className="sr-only"> (PDF file)</span>
      </a>
    );
  }

  return (
    <a
      href={action.href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      style={style}
      data-pin={number}
    >
      {content}
    </a>
  );
}

/** Opens the mail app and copies the address, like Get in touch. */
function EmailPin({
  className,
  style,
  children,
}: {
  className: string;
  style: CSSProperties;
  children: React.ReactNode;
}) {
  // Decoded on the client only, so the address never ships in the HTML.
  const isClient = useIsClient();
  const email = decodeEmail(USER.email);

  return (
    <a
      href={isClient ? `mailto:${email}` : "#"}
      className={className}
      style={style}
      data-pin={5}
      onClick={() => {
        copyText(email);
        toast.success("Email address copied", { description: email });
      }}
    >
      {children}
    </a>
  );
}
