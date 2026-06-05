/* eslint-disable react-hooks/immutability */
"use client";

import { useRef, useEffect, useCallback } from "react";
import "./FallingText.css";

interface FallingLine {
  text: string;
  em?: boolean;
}

interface FallingTextProps {
  lines: FallingLine[];
  gravity?: number;
  stiffness?: number;
}

interface CharData {
  el: HTMLSpanElement;
  ox: number; oy: number;
  x: number;  y: number;
  vx: number; vy: number;
  w: number;  h: number;
  fallen: boolean;
  isSpace: boolean;
}

export default function FallingText({
  lines,
  gravity = 0.23,
  stiffness = 0.06,
}: FallingTextProps) {
  const stageRef  = useRef<HTMLHeadingElement>(null);
  const chars     = useRef<CharData[]>([]);
  const rafRef    = useRef<number>(0);
  const simActive = useRef(false);

  // ── record original positions after paint ──
  const recordOrigins = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const sr = stage.getBoundingClientRect();
    chars.current.forEach(c => {
      const r = c.el.getBoundingClientRect();
      c.ox = r.left - sr.left + r.width / 2;
      c.oy = r.top  - sr.top  + r.height / 2;
      c.x  = c.ox; c.y = c.oy;
      c.vx = 0;    c.vy = 0;
      c.w  = r.width; c.h = r.height;
      c.fallen = false;
    });
  }, []);

  // ── scatter on hover ──
  const scatter = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const sr = stage.getBoundingClientRect();

    chars.current.forEach(c => {
      if (c.isSpace || c.fallen) return;
      c.fallen = true;
      const r  = c.el.getBoundingClientRect();
      c.x  = r.left - sr.left + r.width / 2;
      c.y  = r.top  - sr.top  + r.height / 2;
      c.vx = (Math.random() - 0.5) * 14;
      c.vy = Math.random() * -6 - 2;

      c.el.style.position = "absolute";
      c.el.style.left     = (c.x - c.w / 2) + "px";
      c.el.style.top      = (c.y - c.h / 2) + "px";
      c.el.style.width    = c.w + "px";
      c.el.style.transform = `rotate(${(Math.random() - 0.5) * 30}deg)`;
    });
  }, []);

  // ── physics tick ──
  const tick = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const stageH = stage.offsetHeight;
    const stageW = stage.offsetWidth;
    let any = false;

    chars.current.forEach(c => {
      if (!c.fallen || c.isSpace) return;
      c.vy += gravity;
      c.x  += c.vx;
      c.y  += c.vy;

      const floor = stageH - c.h / 2 - 20;
      if (c.y >= floor) {
        c.y = floor; c.vy *= -0.28; c.vx *= 0.82;
        if (Math.abs(c.vy) < 0.8) c.vy = 0;
      }
      if (c.x < c.w / 2)          { c.x = c.w / 2;          c.vx *= -0.4; }
      if (c.x > stageW - c.w / 2) { c.x = stageW - c.w / 2; c.vx *= -0.4; }

      c.el.style.left = (c.x - c.w / 2) + "px";
      c.el.style.top  = (c.y - c.h / 2) + "px";
      if (Math.abs(c.vx) + Math.abs(c.vy) > 0.2) any = true;
    });

    if (any) rafRef.current = requestAnimationFrame(tick);
    else simActive.current = false;
  }, [gravity]);

  // ── spring back on leave ──
  const springTick = useCallback(() => {
    let any = false;
    chars.current.forEach(c => {
      if (!c.fallen) return;
      const dx = c.ox - c.x; const dy = c.oy - c.y;
      c.vx += dx * stiffness; c.vy += dy * stiffness;
      c.vx *= 0.82;           c.vy *= 0.82;
      c.x  += c.vx;           c.y  += c.vy;
      if (Math.sqrt(dx * dx + dy * dy) > 0.5 ||
          Math.abs(c.vx) + Math.abs(c.vy) > 0.3) any = true;

      c.el.style.left = (c.x - c.w / 2) + "px";
      c.el.style.top  = (c.y - c.h / 2) + "px";
    });

    if (any) {
      rafRef.current = requestAnimationFrame(springTick);
    } else {
      // snap back to flow
      chars.current.forEach(c => {
        c.el.style.position  = "";
        c.el.style.left      = "";
        c.el.style.top       = "";
        c.el.style.width     = "";
        c.el.style.transform = "";
        c.fallen = false;
      });
      simActive.current = false;
    }
  }, [stiffness]);

  const handleEnter = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    scatter();
    simActive.current = true;
    rafRef.current = requestAnimationFrame(tick);
  }, [scatter, tick]);

  const handleLeave = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(springTick);
  }, [springTick]);

  // ── build char refs on mount ──
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    chars.current = Array.from(
      stage.querySelectorAll<HTMLSpanElement>(".falling-char")
    ).map(el => ({
      el,
      ox:0, oy:0, x:0, y:0, vx:0, vy:0,
      w:0, h:0,
      fallen: false,
      isSpace: el.dataset.space === "1",
    }));
    setTimeout(recordOrigins, 80);
    return () => cancelAnimationFrame(rafRef.current);
  }, [recordOrigins]);

  let globalIdx = 0;

  return (
    <h1
      ref={stageRef}
      className="falling-text"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      style={{ position: "relative", cursor: "default" }}
    >
      {lines.map(({ text, em }, li) => (
        <span key={li} className="falling-line">
          {text.split("").map(ch => {
            const i = globalIdx++;
            return (
              <span
                key={i}
                className="falling-char"
                data-space={ch === " " ? "1" : "0"}
                style={{
                  color:      em ? "var(--accent)" : undefined,
                  fontStyle:  em ? "italic" : undefined,
                  whiteSpace: ch === " " ? "pre" : undefined,
                }}
              >
                {ch}
              </span>
            );
          })}
        </span>
      ))}
    </h1>
  );
}