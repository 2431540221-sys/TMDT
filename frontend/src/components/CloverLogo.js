import React from "react";

// Logo cỏ 4 lá (SVG, không cần file ảnh): 4 lá hình trái tim xoay quanh tâm + cuống
const LEAF =
  "M0 0 C-9 -3 -12 -10 -8 -14 C-4 -17 0 -13 0 -9 C0 -13 4 -17 8 -14 C12 -10 9 -3 0 0Z";

export default function CloverLogo({ size = 36, color = "#ffffff" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-label="Cỏ 4 lá">
      <g fill={color} transform="translate(32 28)">
        {[45, 135, 225, 315].map((deg) => (
          <path key={deg} d={LEAF} transform={`rotate(${deg}) translate(0 -2)`} />
        ))}
      </g>
      <path
        d="M32 30 C33 42 38 50 46 58"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
