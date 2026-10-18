"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { animate, motion, useInView, useMotionTemplate, useMotionValue, useSpring } from "motion/react";

/** Expo-out: fast arrival, long settle. Shared by every entrance on the site. */
export const EASE = [0.16, 1, 0.3, 1] as const;

/** Fades + lifts its children in when scrolled into view. */
export function Reveal({ children, delay = 0, className, as = "div" }: { children: React.ReactNode; delay?: number; className?: string; as?: "div" | "p" | "h2" | "li" }) {
  const M = motion[as];
  return (
    <M className={className} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }} transition={{ duration: 0.7, delay, ease: EASE }}>
      {children}
    </M>
  );
}

/** Card that tilts in 3D toward the pointer, with a spotlight that follows it. */
export function Tilt({ children, className = "", max = 10, delay = 0, ...rest }: { children: React.ReactNode; className?: string; max?: number; delay?: number } & React.HTMLAttributes<HTMLDivElement>) {
  const rx = useSpring(0, { stiffness: 220, damping: 18 });
  const ry = useSpring(0, { stiffness: 220, damping: 18 });
  const mx = useMotionValue(50);
  const my = useMotionValue(50);
  const spot = useMotionTemplate`radial-gradient(280px circle at ${mx}% ${my}%, rgba(139,120,196,.22), transparent 65%)`;

  const move = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    mx.set(x * 100); my.set(y * 100);
    ry.set((x - 0.5) * max); rx.set((0.5 - y) * max);
  };
  const leave = () => { rx.set(0); ry.set(0); };

  return (
    <motion.div className={`tilt ${className}`} style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      onPointerMove={move} onPointerLeave={leave}
      initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }} transition={{ duration: 0.7, delay: Math.min(delay, 0.32), ease: EASE }}
      {...(rest as object)}>
      <motion.span className="spot" style={{ background: spot }} />
      {children}
    </motion.div>
  );
}

/** Number that counts up the first time it is seen. */
export function CountUp({ to }: { to: number }) {
  const ref = useRef<HTMLElement>(null);
  const seen = useInView(ref, { once: true });
  useEffect(() => {
    if (!seen || !ref.current) return;
    const c = animate(0, to, { duration: 1.1, ease: "easeOut", onUpdate: (v) => ref.current && (ref.current.textContent = String(Math.round(v))) });
    return () => c.stop();
  }, [seen, to]);
  return <b ref={ref}>0</b>;
}

/** "3 วันที่แล้ว" — relative time is computed on the client so cached pages never go stale. */
const noop = () => () => {};
function relative(date: string) {
  const days = Math.round((Date.now() - new Date(date).getTime()) / 864e5);
  const rtf = new Intl.RelativeTimeFormat("th", { numeric: "auto" });
  return days < 30 ? rtf.format(-days, "day") : days < 365 ? rtf.format(-Math.round(days / 30), "month") : rtf.format(-Math.round(days / 365), "year");
}
export function Ago({ date }: { date: string }) {
  const text = useSyncExternalStore(noop, () => relative(date), () => new Date(date).toLocaleDateString("th-TH", { dateStyle: "medium" }));
  return <>{text}</>;
}
