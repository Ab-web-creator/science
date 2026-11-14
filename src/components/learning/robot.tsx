export function Robot({ small = false }: { small?: boolean }) {
  return (
    <svg
      className={small ? "robot small" : "robot"}
      viewBox="0 0 300 290"
      role="img"
      aria-label="Orbit, your friendly mint green robot learning buddy"
    >
      <ellipse cx="152" cy="269" rx="73" ry="12" fill="#c5d9ca" opacity=".5" />
      <g className="robot-float">
        <path
          d="M150 49V24"
          stroke="#285c50"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <circle cx="150" cy="20" r="11" fill="#ffbd61" />
        <rect
          x="65"
          y="58"
          width="172"
          height="139"
          rx="47"
          fill="#7ec8ae"
          stroke="#286453"
          strokeWidth="4"
        />
        <rect x="83" y="78" width="136" height="89" rx="30" fill="#254d45" />
        <ellipse cx="118" cy="112" rx="11" ry="14" fill="#e2ffd3" />
        <ellipse cx="183" cy="112" rx="11" ry="14" fill="#e2ffd3" />
        <path
          d="M132 140Q151 158 170 140"
          fill="none"
          stroke="#e2ffd3"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <circle cx="101" cy="141" r="9" fill="#ed9292" opacity=".75" />
        <circle cx="201" cy="141" r="9" fill="#ed9292" opacity=".75" />
        <rect
          x="105"
          y="199"
          width="91"
          height="47"
          rx="20"
          fill="#7ec8ae"
          stroke="#286453"
          strokeWidth="4"
        />
        <circle cx="151" cy="220" r="9" fill="#fff2ba" />
        <path
          d="M69 173Q31 166 31 133M235 171Q269 156 266 124"
          fill="none"
          stroke="#286453"
          strokeWidth="15"
          strokeLinecap="round"
        />
        <path
          d="M123 247L116 258M178 247L185 258"
          stroke="#286453"
          strokeWidth="15"
          strokeLinecap="round"
        />
      </g>
      <path
        d="m247 44 5 12 13 2-10 9 2 13-11-7-12 5 4-13-8-10 13 1Z"
        fill="#f5ba55"
      />
      <path d="m39 64 3 7 8 1-6 5 1 8-7-4-6 3 2-7-5-6 7 1Z" fill="#b1a4df" />
    </svg>
  );
}
