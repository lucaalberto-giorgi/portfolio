export function ChanhDaiMark(props: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 512 256"
      {...props}
    >
      <text
        x="256"
        y="180"
        fontSize="200"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontWeight="600"
        fill="currentColor"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        LG
      </text>
    </svg>
  );
}

export function getMarkSVG(color: string) {
  return `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 256 128"><text x="128" y="90" fontSize="100" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="600" fill="${color}" textAnchor="middle" dominantBaseline="middle">LG</text></svg>`;
}
