"use client";

import { useEffect, useRef } from "react";

/** Little wizard cat: patched hat, scarf, robe and a glowing star.
 *  Fur colours come from CSS vars, so it is a black cat at night and a Siamese by day.
 *  Pupils follow the pointer, tail swishes, eyes blink. */
export default function Cat({ happy = false, className = "" }: { happy?: boolean; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const move = (e: PointerEvent) => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const dx = Math.max(-1.8, Math.min(1.8, (e.clientX - r.left - r.width / 2) / 60));
      const dy = Math.max(-1.5, Math.min(1.5, (e.clientY - r.top - r.height / 2) / 60));
      el.style.setProperty("--px", `${dx}px`);
      el.style.setProperty("--py", `${dy}px`);
    };
    addEventListener("pointermove", move);
    return () => removeEventListener("pointermove", move);
  }, []);

  const look = { transform: "translate(var(--px, 0), var(--py, 0))" };
  return (
    <span ref={ref} className={`cat ${happy ? "happy" : ""} ${className}`} aria-hidden="true">
      <svg viewBox="0 0 100 100">
        <path className="tail" d="M66 86 C86 88 92 70 84 58" stroke="var(--cat-point)" strokeWidth="7" fill="none" strokeLinecap="round" />

        {/* paws + robe */}
        <ellipse cx="42" cy="96" rx="6" ry="4" fill="var(--cat-point)" />
        <ellipse cx="58" cy="96" rx="6" ry="4" fill="var(--cat-point)" />
        <path d="M34 66 Q50 60 66 66 L72 93 Q50 99 28 93 Z" fill="#8e62ad" stroke="#2a1a33" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M58 70 L64 69 L65 75 L59 76 Z" fill="#c9b0dc" />
        <circle cx="47" cy="78" r="2" fill="#c9b0dc" />
        <circle cx="47" cy="86" r="2" fill="#c9b0dc" />

        {/* head */}
        <circle cx="50" cy="50" r="19" fill="var(--cat-fur)" />
        <ellipse cx="50" cy="52" rx="14" ry="12" fill="var(--cat-point)" opacity="var(--cat-mask)" />

        {/* eyes: cream ring, iris + pupil look around */}
        <circle cx="42" cy="49" r="6.5" fill="#f4ead6" />
        <circle cx="58" cy="49" r="6.5" fill="#f4ead6" />
        <g style={look}>
          <circle cx="42" cy="49.5" r="4.4" fill="var(--cat-iris)" />
          <circle cx="58" cy="49.5" r="4.4" fill="var(--cat-iris)" />
          <ellipse cx="42" cy="49.5" rx="1.6" ry="3" fill="#15131a" />
          <ellipse cx="58" cy="49.5" rx="1.6" ry="3" fill="#15131a" />
        </g>
        <circle cx="43.6" cy="47" r="1.3" fill="#fff" />
        <circle cx="59.6" cy="47" r="1.3" fill="#fff" />
        <rect className="lid" x="34" y="42" width="32" height="14" rx="6" fill="var(--cat-lid)" />

        {/* scarf */}
        <path d="M31 58 Q50 67 69 58 L70 65 Q50 74 30 65 Z" fill="#c9a6e3" stroke="#2a1a33" strokeWidth="1.4" strokeLinejoin="round" />
        <path d="M62 64 L70 63 L73 78 L65 77 Z" fill="#b58fd3" stroke="#2a1a33" strokeWidth="1.4" strokeLinejoin="round" />

        {/* hat: brim, ears poking through, patched cone */}
        <ellipse cx="50" cy="36" rx="33" ry="7" fill="#6d3a6c" stroke="#2a1a33" strokeWidth="1.6" />
        <path d="M30 37 L27 21 L39 31 Z M70 37 L73 21 L61 31 Z" fill="var(--cat-point)" />
        <path d="M31 33 L29.5 25 L36 30 Z M69 33 L70.5 25 L64 30 Z" fill="#e7b3a6" />
        <path d="M36 35 Q39 18 50 10 Q56 4 66 -2 Q60 10 61 20 L64 35 Q50 39 36 35 Z" fill="#7d4a7c" stroke="#2a1a33" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M37 31 Q50 35 63 31 L64 35 Q50 39 36 35 Z" fill="#4f2a50" />
        <path d="M53 16 L59 15 L60 22 L54 23 Z" fill="#c9b0dc" stroke="#2a1a33" strokeWidth="1" />

        {/* the star it is holding */}
        <g className="star">
          <circle cx="24" cy="74" r="9" fill="#ffd27a" opacity=".28" />
          <path d="M24 67 L26 72 L31 72.5 L27 76 L28.5 81 L24 78 L19.5 81 L21 76 L17 72.5 L22 72 Z" fill="#fff1bf" stroke="#e8b64c" strokeWidth="0.8" strokeLinejoin="round" />
        </g>
        <ellipse cx="30" cy="76" rx="4" ry="3.4" fill="var(--cat-point)" />
      </svg>
    </span>
  );
}
