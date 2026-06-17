export function BrandWordmark(props: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 1024 256"
      {...props}
    >
      <text
        x="512"
        y="128"
        fontSize="140"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontWeight="600"
        fill="currentColor"
        textAnchor="middle"
        dominantBaseline="central"
      >
        Luca Giorgi
      </text>
    </svg>
  );
}

export function getWordmarkSVG(color: string) {
  return `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 1024 256"><text x="512" y="128" fontSize="140" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="600" fill="${color}" textAnchor="middle" dominantBaseline="central">Luca Giorgi</text></svg>`;
}
