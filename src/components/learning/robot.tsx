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
        {/* Head (antenna, head and face) is its own group so it can nod or shake. */}
        <g className="robot-head">
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
          <g className="robot-face">
            <ellipse cx="118" cy="112" rx="11" ry="14" fill="#e2ffd3" />
            <ellipse cx="183" cy="112" rx="11" ry="14" fill="#e2ffd3" />
            <path
              className="robot-smile"
              d="M132 140Q151 158 170 140"
              fill="none"
              stroke="#e2ffd3"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <path
              className="robot-frown"
              d="M136 148Q151 139 166 148"
              fill="none"
              stroke="#e2ffd3"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <circle cx="101" cy="141" r="9" fill="#ed9292" opacity=".75" />
            <circle cx="201" cy="141" r="9" fill="#ed9292" opacity=".75" />
          </g>
        </g>
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
        {/* Arms hang down; raised arms are the same arms flipped up at the
            shoulder. The palm (light patch) is on the inner side of each hand. */}
        <g className="robot-arm robot-arm-left">
          <path
            d="M69 173Q52 178 48 192"
            fill="none"
            stroke="#286453"
            strokeWidth="15"
            strokeLinecap="round"
          />
          <g>
            <path
              d="M48 192L45 208"
              fill="none"
              stroke="#286453"
              strokeWidth="15"
              strokeLinecap="round"
            />
            <ellipse cx="45" cy="216" rx="9" ry="11" fill="#286453" />
            {/* Palm: lighter patch on the inner side of the hand */}
            <ellipse cx="49.5" cy="216" rx="3.5" ry="6.5" fill="#a8dcc8" />
          </g>
        </g>
        <g className="robot-arm robot-arm-right">
          <path
            d="M235 171Q252 176 256 190"
            fill="none"
            stroke="#286453"
            strokeWidth="15"
            strokeLinecap="round"
          />
          <g>
            <path
              d="M256 190L258 206"
              fill="none"
              stroke="#286453"
              strokeWidth="15"
              strokeLinecap="round"
            />
            <ellipse cx="258" cy="214" rx="9" ry="11" fill="#286453" />
            {/* Palm: lighter patch on the inner side of the hand */}
            <ellipse cx="253.5" cy="214" rx="3.5" ry="6.5" fill="#a8dcc8" />
          </g>
        </g>
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
