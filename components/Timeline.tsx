"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "motion/react";

type Item = { when: string; icon: string; title: string; text: string };

/** Vertical timeline; the rail draws itself as you scroll through it. */
export default function Timeline({ items }: { items: Item[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 60%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });
  return (
    <div className="timeline" ref={ref}>
      <div className="rail"><motion.i style={{ scaleY }} /></div>
      {items.map((it) => (
        <motion.div key={it.title} className="tl-item"
          initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.7, ease: [0.2, 0.7, 0.2, 1] }}>
          <motion.span className="node" initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true, amount: 0.6 }}
            transition={{ type: "spring", stiffness: 300, damping: 14, delay: 0.15 }}>{it.icon}</motion.span>
          <time>{it.when}</time>
          <h3>{it.title}</h3>
          <p>{it.text}</p>
        </motion.div>
      ))}
    </div>
  );
}

export function SkillBars({ items }: { items: [string, number][] }) {
  return (
    <div className="skillbars">
      {items.map(([name, pct], i) => (
        <div key={name}>
          <div className="row"><span>{name}</span><span>{pct}%</span></div>
          <div className="track">
            <motion.div className="fill" style={{ width: `${pct}%` }} initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }}
              viewport={{ once: true }} transition={{ duration: 1, delay: i * 0.1, ease: "easeOut" }} />
          </div>
        </div>
      ))}
    </div>
  );
}
