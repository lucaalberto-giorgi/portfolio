/*
 * What the X-ray lens shows under the package: the lead frame, the bond
 * wires, and the die, annotated like a keynote die shot whose functional
 * blocks are the stack. AI sits at the centre, under the green spark on the
 * lid, as it does in the brand icon. Drawn on a 100-unit grid that matches
 * the package, so the wires meet the pins.
 */

/** Where each pin meets the package, as a fraction along its side. */
export const PIN_NEAR = 0.32;
export const PIN_FAR = 0.68;

const PIN_POINTS = [PIN_NEAR, PIN_FAR].map((at) => at * 100);

const DIE = { from: 24, to: 76 };

type Block = {
  name: string;
  items: string[];
  x: number;
  y: number;
  width: number;
  height: number;
  /** Fill pattern id, so neighbouring blocks read as different circuitry. */
  pattern: "rows" | "cols" | "cells" | "mesh";
  /** Stack the items under the name instead of beside it. */
  stacked?: boolean;
};

const BLOCKS: Block[] = [
  {
    name: "Frontend",
    items: ["React", "TypeScript", "Next.js"],
    x: 26,
    y: 26,
    width: 48,
    height: 10,
    pattern: "cols",
  },
  {
    name: "Backend",
    items: ["FastAPI", "Python", "REST"],
    x: 26,
    y: 38,
    width: 13,
    height: 24,
    pattern: "rows",
    stacked: true,
  },
  {
    name: "Data",
    items: ["Supabase", "Postgres", "Sanity"],
    x: 61,
    y: 38,
    width: 13,
    height: 24,
    pattern: "rows",
    stacked: true,
  },
  {
    name: "Tools",
    items: ["Git", "Vite", "Vercel"],
    x: 26,
    y: 64,
    width: 48,
    height: 10,
    pattern: "cells",
  },
];

const AI_BLOCK = { x: 41, y: 38, width: 18, height: 24 };

export function ChipDie() {
  return (
    <svg
      viewBox="0 0 100 100"
      className="size-full"
      fontFamily="inherit"
      aria-hidden
    >
      <defs>
        <pattern
          id="die-rows"
          width="1.2"
          height="1.2"
          patternUnits="userSpaceOnUse"
        >
          <rect width="1.2" height="0.45" fill="#5b6c9c" opacity="0.45" />
        </pattern>
        <pattern
          id="die-cols"
          width="1.2"
          height="1.2"
          patternUnits="userSpaceOnUse"
        >
          <rect width="0.45" height="1.2" fill="#6f7fb0" opacity="0.4" />
        </pattern>
        <pattern
          id="die-cells"
          width="2"
          height="2"
          patternUnits="userSpaceOnUse"
        >
          <rect width="1.4" height="1.4" fill="#7a86a6" opacity="0.32" />
        </pattern>
        <pattern
          id="die-mesh"
          width="1.6"
          height="1.6"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="0.8" cy="0.8" r="0.38" fill="#4ade80" opacity="0.55" />
        </pattern>
        <pattern
          id="die-vias"
          width="2.4"
          height="2.4"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="1.2" cy="1.2" r="0.32" fill="#243050" />
        </pattern>
        <radialGradient id="die-sheen" cx="0.3" cy="0.2" r="0.9">
          <stop offset="0" stopColor="#3a4870" />
          <stop offset="1" stopColor="#1a2340" />
        </radialGradient>
      </defs>

      {/* Substrate */}
      <rect width="100" height="100" fill="#0b0f1a" />
      <rect width="100" height="100" fill="url(#die-vias)" />

      {/* The paddle the die is bonded to. */}
      <rect
        x="19.5"
        y="19.5"
        width="61"
        height="61"
        rx="2"
        fill="#131a2b"
        stroke="#2b3756"
        strokeWidth="0.4"
      />

      <LeadFrame />

      {/* Chip art: the small print engineers hide on a die. */}
      <text
        x="78.4"
        y="78.6"
        textAnchor="end"
        fontSize="1.5"
        fontWeight="600"
        letterSpacing="0.12"
        fill="#5d6b92"
      >
        Made in London, 2026
      </text>

      {/* The die */}
      <rect
        x={DIE.from}
        y={DIE.from}
        width={DIE.to - DIE.from}
        height={DIE.to - DIE.from}
        rx="1.2"
        fill="url(#die-sheen)"
        stroke="#56658f"
        strokeWidth="0.3"
      />

      {BLOCKS.map((block) => (
        <DieBlock key={block.name} {...block} />
      ))}

      {/* The AI block: the "neural engine", under the spark. */}
      <g>
        <rect
          {...AI_BLOCK}
          rx="0.8"
          fill="#0f2a1c"
          stroke="#22c55e"
          strokeWidth="0.35"
        />
        <rect {...AI_BLOCK} rx="0.8" fill="url(#die-mesh)" />
        <text
          x={AI_BLOCK.x + AI_BLOCK.width / 2}
          y={AI_BLOCK.y + 9.6}
          textAnchor="middle"
          fontSize="4.2"
          fontWeight="700"
          fill="#dcfce7"
        >
          AI
        </text>
        {["LLM APIs", "Structured", "outputs"].map((line, index) => (
          <text
            key={line}
            x={AI_BLOCK.x + AI_BLOCK.width / 2}
            y={AI_BLOCK.y + 14 + index * 2.9}
            textAnchor="middle"
            fontSize="2.25"
            fontWeight="500"
            fill="#bbf7d0"
          >
            {line}
          </text>
        ))}
      </g>
    </svg>
  );
}

/** Lead fingers from each pin, and a bond wire from each to the die. */
function LeadFrame() {
  const fingers: { x1: number; y1: number; x2: number; y2: number }[] = [];
  const wires: string[] = [];

  for (const at of PIN_POINTS) {
    // Left, right, top, bottom: finger from the package edge to its tip.
    fingers.push(
      { x1: 0, y1: at, x2: 15, y2: at },
      { x1: 100, y1: at, x2: 85, y2: at },
      { x1: at, y1: 0, x2: at, y2: 15 },
      { x1: at, y1: 100, x2: at, y2: 85 }
    );

    // Wires arc gently from each finger tip to a pad just inside the die.
    const pad = at < 50 ? at + 4 : at - 4;
    wires.push(
      `M15 ${at} Q20 ${at - 2.5} 25.5 ${pad}`,
      `M85 ${at} Q80 ${at - 2.5} 74.5 ${pad}`,
      `M${at} 15 Q${at - 2.5} 20 ${pad} 25.5`,
      `M${at} 85 Q${at - 2.5} 80 ${pad} 74.5`
    );
  }

  return (
    <g>
      {fingers.map((finger, index) => (
        <line
          key={index}
          {...finger}
          stroke="#8e97a8"
          strokeWidth="4.6"
          strokeLinecap="round"
          opacity="0.9"
        />
      ))}
      {wires.map((d) => (
        <path
          key={d}
          d={d}
          fill="none"
          stroke="#e0bd62"
          strokeWidth="0.32"
          strokeLinecap="round"
        />
      ))}
    </g>
  );
}

function DieBlock({
  name,
  items,
  x,
  y,
  width,
  height,
  pattern,
  stacked,
}: Block) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx="0.6"
        fill="#1f2a4a"
        stroke="#47568a"
        strokeWidth="0.25"
      />
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx="0.6"
        fill={`url(#die-${pattern})`}
      />

      {stacked ? (
        <>
          <text
            x={x + width / 2}
            y={y + 5}
            textAnchor="middle"
            fontSize="2.6"
            fontWeight="700"
            fill="#eef1f7"
          >
            {name}
          </text>
          {items.map((item, index) => (
            <text
              key={item}
              x={x + width / 2}
              y={y + 10 + index * 3.6}
              textAnchor="middle"
              fontSize="2.2"
              fontWeight="500"
              fill="#c3cbe0"
            >
              {item}
            </text>
          ))}
        </>
      ) : (
        <>
          <text
            x={x + 2}
            y={y + height / 2 + 1}
            fontSize="2.8"
            fontWeight="700"
            fill="#eef1f7"
          >
            {name}
          </text>
          {items.map((item, index) => (
            <text
              key={item}
              x={x + 17 + index * 10.5}
              y={y + height / 2 + 0.9}
              fontSize="2.2"
              fontWeight="500"
              fill="#c3cbe0"
            >
              {item}
            </text>
          ))}
        </>
      )}
    </g>
  );
}
