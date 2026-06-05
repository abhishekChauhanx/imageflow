"use client";

import "./BlurText.css";

interface BlurTextProps {
  text: string;
  delay?: number;       // ms before the first word starts
  stepDelay?: number;   // ms between each word
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
}

export default function BlurText({
  text,
  delay = 0,
  stepDelay = 80,
  className = "",
  as: Tag = "span",
}: BlurTextProps) {
  const words = text.split(" ");

  return (
    <Tag className={`blur-text ${className}`} aria-label={text}>
      {words.map((word, i) => (
        <span
          key={i}
          className="blur-word"
          style={{
            animationDelay: `${delay + i * stepDelay}ms`,
          }}
        >
          {word}
        </span>
      ))}
    </Tag>
  );
}