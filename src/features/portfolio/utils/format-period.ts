const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

type PeriodPoint = { month?: string; year: string };

/** Parses the "MM.YYYY" or "YYYY" strings used in the portfolio data files. */
function parsePoint(value: string): PeriodPoint {
  const [first, second] = value.split(".");

  if (second) {
    return { month: MONTHS[Number(first) - 1], year: second };
  }

  return { year: first };
}

function formatPoint({ month, year }: PeriodPoint) {
  return month ? `${month} ${year}` : year;
}

/**
 * Formats a data-file period the way the CV does ("May–Jun 2026",
 * "Jan 2024 – 2026"). Ongoing periods (no `end`) read "Jan 2026 – Present".
 */
export function formatPeriod(start: string, end?: string) {
  const from = parsePoint(start);

  if (!end) {
    return `${formatPoint(from)} – Present`;
  }

  if (end === start) {
    return formatPoint(from);
  }

  const to = parsePoint(end);

  // Same-year ranges share the year: "Jan–May 2026".
  if (from.year === to.year && from.month && to.month) {
    return `${from.month}–${to.month} ${to.year}`;
  }

  return `${formatPoint(from)} – ${formatPoint(to)}`;
}
