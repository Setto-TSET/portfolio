"use client";

import { motion } from "motion/react";
import { LANG_COLOR } from "@/lib/repo";

/** Language share bar that grows in segment by segment. */
export default function LangBar({ languages }: { languages: Record<string, number> }) {
  const total = Object.values(languages).reduce((a, b) => a + b, 0);
  if (!total) return null;
  const rows = Object.entries(languages).map(([name, bytes]) => ({ name, pct: (bytes / total) * 100 }));
  return (
    <>
      <div className="langbar" role="img" aria-label={rows.map((r) => `${r.name} ${r.pct.toFixed(1)}%`).join(", ")}>
        {rows.map((r, i) => (
          <motion.span key={r.name} style={{ background: LANG_COLOR[r.name] || "#8b78c4" }}
            initial={{ width: 0 }} whileInView={{ width: `${r.pct}%` }} viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.2 + i * 0.12, ease: "easeOut" }} />
        ))}
      </div>
      <div className="legend">
        {rows.map((r) => (
          <span key={r.name}><i className="dot" style={{ background: LANG_COLOR[r.name] || "#8b78c4" }} />{r.name} {r.pct.toFixed(1)}%</span>
        ))}
      </div>
    </>
  );
}
