"use client";

import { useEffect, useRef, ReactNode } from "react";
import "./ScrollReveal.css";

interface ScrollRevealProps {
  children: ReactNode;
  delay?: number;       // ms
  direction?: "up" | "left" | "right" | "fade";
  className?: string;
}

export default function ScrollReveal({
  children,
  delay = 0,
  direction = "up",
  className = "",
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => el.classList.add("sr-visible"), delay);
          obs.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className={`sr-root sr-${direction} ${className}`}>
      {children}
    </div>
  );
}