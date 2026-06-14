import React from "react";
import "./IFLoader.css";

interface IFLoaderProps {
  size?: number;
  color?: string;
  duration?: number;
  label?: string;
  dotRadius?: number;
}

const IFLoader: React.FC<IFLoaderProps> = ({
  size = 200,
  duration = 3,
  label = "IF",
  dotRadius = 2.5,
}) => {
  const outerInset = 8;
  const innerInset = 18;
  const outerSize = size - outerInset * 2;
  const innerSize = size - innerInset * 2;
  const perimeter = innerSize * 4;

  const cx = size / 2;
  const cy = size / 2;

  return (
    <div
      className="if-loader-wrapper"
      style={{ "--if-duration": `${duration}s`, "--if-perimeter": perimeter } as React.CSSProperties}
    >
      <svg
        className="if-loader-svg"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Loading"
        role="img"
      >
        {/* Dark background */}
        <rect
          width={size}
          height={size}
          rx="2"
          className="fill-[#111009]"
        />

        {/* Outer border */}
        <rect
          x={outerInset}
          y={outerInset}
          width={outerSize}
          height={outerSize}
          className="if-border-outer"
        />

        {/* Inner static dim border */}
        <rect
          x={innerInset}
          y={innerInset}
          width={innerSize}
          height={innerSize}
          className="if-border-inner"
        />

        {/* IF label */}
        <text
          x={cx}
          y={cy}
          className="if-label"
          fontSize={size * 0.18}
          letterSpacing={size * 0.03}
        >
          {label}
        </text>

        {/* Animated inner border */}
        <rect
          x={innerInset}
          y={innerInset}
          width={innerSize}
          height={innerSize}
          className="if-border-animated"
          strokeDasharray={perimeter}
          strokeDashoffset={perimeter}
        />

        {/* Bottom-left dot */}
        <circle
          cx={innerInset}
          cy={size - innerInset}
          r={dotRadius}
          className="if-dot-bl"
        />

        {/* Bottom-right dot */}
        <circle
          cx={size - innerInset}
          cy={size - innerInset}
          r={dotRadius}
          className="if-dot-br"
        />
      </svg>
    </div>
  );
};

export default IFLoader;