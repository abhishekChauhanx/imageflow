"use client";

import React from "react";
import "./IFLoader.css";

interface IFLoaderProps {
  size?:      number;
  duration?:  number;
  label?:     string;
  dotRadius?: number;
}

/**
 * IFLoader
 *
 * Uses native SVG <animate> / <animateTransform> — NOT CSS keyframes.
 * This is the only cross-browser reliable way to animate
 * stroke-dashoffset on an SVG rect.
 *
 * Props
 *   size      — square px size   (default 200)
 *   duration  — loop seconds     (default 3)
 *   label     — centre text      (default "IF")
 *   dotRadius — corner dot size  (default 2.5)
 */
const IFLoader: React.FC<IFLoaderProps> = ({
  size      = 200,
  duration  = 3,
  label     = "IF",
  dotRadius = 2.5,
}) => {
  const outerInset = 8;
  const innerInset = 18;
  const outerSize  = size - outerInset * 2;   // e.g. 184 at size=200
  const innerSize  = size - innerInset * 2;   // e.g. 164 at size=200
  const perimeter  = innerSize * 4;           // e.g. 656 at size=200
  const dur        = `${duration}s`;

  return (
    <div className="if-loader-wrapper">
      <svg
        className="if-loader-svg"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Loading"
        role="img"
      >
        {/* ── dark background ── */}
        <rect className="if-bg" width={size} height={size} rx="2" />

        {/* ── outer decorative border ── */}
        <rect
          className="if-border-outer"
          x={outerInset} y={outerInset}
          width={outerSize} height={outerSize}
        />

        {/* ── inner dim static track ── */}
        <rect
          className="if-border-inner"
          x={innerInset} y={innerInset}
          width={innerSize} height={innerSize}
        />

        {/* ── centre label ── */}
        <text
          className="if-label"
          x={size / 2}
          y={size / 2}
          fontSize={size * 0.18}
          letterSpacing={size * 0.03}
        >
          {label}
        </text>

        {/*
          ── Animated border ──
          strokeDasharray  = perimeter  → whole border = one dash
          strokeDashoffset = perimeter  → dash starts fully offset (invisible)
          <animate> drives offset from perimeter → 0 → border draws itself
          This uses native SVG SMIL animation — works in all browsers,
          no CSS var-in-keyframes bug.
        */}
        <rect
          className="if-border-animated"
          x={innerInset} y={innerInset}
          width={innerSize} height={innerSize}
          strokeDasharray={perimeter}
          strokeDashoffset={perimeter}
        >
          <animate
            attributeName="stroke-dashoffset"
            from={perimeter}
            to={0}
            dur={dur}
            repeatCount="indefinite"
            calcMode="linear"
          />
        </rect>

        {/* ── bottom-left corner dot — pulses in ── */}
        <circle
          className="if-dot-bl"
          cx={innerInset}
          cy={size - innerInset}
          r={dotRadius}
        >
          <animate
            attributeName="opacity"
            values="0.3;1;0.3"
            dur={dur}
            repeatCount="indefinite"
          />
        </circle>

        {/* ── bottom-right corner dot — pulses out of phase ── */}
        <circle
          className="if-dot-br"
          cx={size - innerInset}
          cy={size - innerInset}
          r={dotRadius}
        >
          <animate
            attributeName="opacity"
            values="1;0.3;1"
            dur={dur}
            repeatCount="indefinite"
          />
        </circle>
      </svg>
    </div>
  );
};

export default IFLoader;