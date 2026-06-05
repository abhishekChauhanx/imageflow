"use client";

import {
  useRef,
  useState,
  useEffect,
  cloneElement,
  Children,
  ReactElement,
} from "react";
import "./TrueFocus.css";

interface TrueFocusProps {
  children: ReactElement; // single child: <a>, <button>, or <Link>
}

export default function TrueFocus({ children }: TrueFocusProps) {
  const wrapRef = useRef<HTMLSpanElement>(null);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const show = () => {
    if (!wrapRef.current) return;
    setRect(wrapRef.current.getBoundingClientRect());
    setVisible(true);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setVisible(false), 700);
  };

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const pad = 5;

  return (
    <>
      <span
        ref={wrapRef}
        className="true-focus-wrap"
        onMouseEnter={show}
        onMouseLeave={() => setVisible(false)}
      >
        {children}
      </span>

      {visible && rect && (
        <span
          className="true-focus-box"
          style={{
            left: rect.left - pad,
            top: rect.top + window.scrollY - pad,
            width: rect.width + pad * 2,
            height: rect.height + pad * 2,
          }}
        >
          {/* four corners */}
          <span className="tfc tfc-tl" />
          <span className="tfc tfc-tr" />
          <span className="tfc tfc-bl" />
          <span className="tfc tfc-br" />
        </span>
      )}
    </>
  );
}
