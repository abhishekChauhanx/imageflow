"use client";

import { useEffect, useRef, useState } from "react";

interface CountUpProps {
  end: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  duration?: number;   // ms
  className?: string;
}

export default function CountUp({
  end,
  suffix = "",
  prefix = "",
  decimals = 0,
  duration = 1800,
  className = "",
}: CountUpProps) {
  const [value, setValue] = useState(0);
  const ref    = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          obs.unobserve(el);

          const startTime = performance.now();
          const step = (now: number) => {
            const t = Math.min((now - startTime) / duration, 1);
            // ease out quart
            const eased = 1 - Math.pow(1 - t, 4);
            setValue(parseFloat((eased * end).toFixed(decimals)));
            if (t < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [end, duration, decimals]);

  return (
    <span ref={ref} className={className}>
      {prefix}{value.toFixed(decimals)}{suffix}
    </span>
  );
}