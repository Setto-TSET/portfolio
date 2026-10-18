"use client";

import { useEffect, useRef } from "react";

/** Cute black cat. Pupils follow the pointer, tail swishes, eyes blink. */
export default function Cat({ happy = false, className = "" }: { happy?: boolean; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const move = (e: PointerEvent) => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const dx = Math.max(-2.5, Math.min(2.5, (e.clientX - r.left - r.width / 2) / 60));
      const dy = Math.max(-2, Math.min(2, (e.clientY - r.top - r.height / 2) / 60));
      el.style.setProperty("--px", `${dx}px`);
      el.style.setProperty("--py", `${dy}px`);
    };
    addEventListener("pointermove", move);
    return () => removeEventListener("pointermove", move);
  }, []);

  const pupil = { transform: "translate(var(--px, 0), var(--py, 0))" };
  return (
    <span ref={ref} className={`cat ${happy ? "happy" : ""} ${className}`} aria-hidden="true">
      <svg viewBox="0 0 100 100">
        <path className="tail" d="M70 78 C92 76 96 52 84 44" stroke="#15131a" strokeWidth="8" fill="none" strokeLinecap="round" />
        <ellipse cx="50" cy="76" rx="26" ry="20" fill="#15131a" />
        <path d="M24 40 L22 14 L40 28 Z M76 40 L78 14 L60 28 Z" fill="#15131a" />
        <path d="M27 34 L26 21 L35 29 Z M73 34 L74 21 L65 29 Z" fill="#5b4a8a" />
        <circle cx="50" cy="46" r="27" fill="#15131a" />
        <ellipse cx="39" cy="46" rx="6" ry="7" fill="#b9a6ff" />
        <ellipse cx="61" cy="46" rx="6" ry="7" fill="#b9a6ff" />
        <ellipse style={pupil} cx="39" cy="47" rx="2.2" ry="4.5" fill="#15131a" />
        <ellipse style={pupil} cx="61" cy="47" rx="2.2" ry="4.5" fill="#15131a" />
        <circle cx="41" cy="43" r="1.6" fill="#fff" />
        <circle cx="63" cy="43" r="1.6" fill="#fff" />
        <rect className="lid" x="32" y="38" width="36" height="16" fill="#15131a" />
        <path d="M47 55 L53 55 L50 58 Z" fill="#c4b8e0" />
        <path d="M44 60 Q47 63 50 60 Q53 63 56 60" stroke="#c4b8e0" strokeWidth="1.4" fill="none" strokeLinecap="round" />
        <path d="M42 66 Q50 72 58 66 L57 70 Q50 75 43 70 Z" fill="#5b4a8a" />
        <circle cx="50" cy="72" r="2.6" fill="#e8d98a" />
      </svg>
    </span>
  );
}
