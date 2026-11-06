"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion, useInView } from "motion/react";

/**
 * A looping, drawn sketch of each project in use, inside a browser frame.
 * Each scene is a list of steps; the cursor and UI move between them.
 * Loops only while on screen; reduced motion shows one still frame.
 */

type Scene = { url: string; steps: number; still: number; tick: number; View: (p: { s: number }) => React.ReactNode; cursor: [number, number][] };

const ease = [0.16, 1, 0.3, 1] as const;

// Reduced-motion preference that renders as "motion allowed" on the server and during hydration,
// then switches, so server and client HTML always match.
const REDUCE = "(prefers-reduced-motion: reduce)";
const watchReduce = (cb: () => void) => {
  const mq = matchMedia(REDUCE);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
const useCalm = () => useSyncExternalStore(watchReduce, () => matchMedia(REDUCE).matches, () => false);

/* ---------- e-Meeting: book a room, then join the call ---------- */
const DAYS = ["จ", "อ", "พ", "พฤ", "ศ"];
const BUSY = new Set(["0-1", "1-3", "3-0", "4-2"]);

function Meeting({ s }: { s: number }) {
  const inCall = s >= 5;
  return (
    <div className="pv-app">
      <div className="pv-side">
        <i className="pv-logo" />
        <span className={!inCall ? "on" : ""} /><span className={inCall ? "on" : ""} /><span /><span />
      </div>
      <AnimatePresence mode="wait">
        {!inCall ? (
          <motion.div key="cal" className="pv-main" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.4 }}>
            <div className="pv-title">จองห้องประชุม <small>ห้อง A · สัปดาห์นี้</small></div>
            <div className="pv-cal">
              {DAYS.map((d) => <b key={d}>{d}</b>)}
              {Array.from({ length: 20 }, (_, i) => {
                const key = `${i % 5}-${Math.floor(i / 5)}`;
                const mine = key === "2-1" && s >= 4;
                const picked = key === "2-1" && s >= 2 && s < 4;
                return <i key={i} className={BUSY.has(key) ? "busy" : mine ? "mine" : picked ? "pick" : ""} />;
              })}
            </div>
            <AnimatePresence>
              {s >= 2 && s < 4 && (
                <motion.div className="pv-modal" initial={{ opacity: 0, y: 12, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.35, ease }}>
                  <b>จองห้อง A</b>
                  <small>พุธ · 10:00–11:00</small>
                  <span className="pv-line" /><span className="pv-line short" />
                  <motion.span className="pv-btn" animate={s === 3 ? { scale: [1, 0.92, 1] } : {}} transition={{ duration: 0.3, delay: 0.5 }}>ยืนยัน</motion.span>
                </motion.div>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {s === 4 && (
                <motion.div className="pv-toast" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>จองสำเร็จ ✓</motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div key="call" className="pv-main pv-call" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
            <div className="pv-tiles">
              {["#8b78c4", "#5b8fd8", "#d88b6f", "#6fb98f"].map((c, i) => (
                <div key={c} className="pv-tile" style={{ ["--c" as string]: c }}>
                  <i />
                  {i === 2 && s >= 6 && <motion.em initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 400, damping: 12 }}>
                    <svg viewBox="0 0 16 16"><path d="M5 15 C3 13 2 10 2.5 8 L3.5 6.5 L4.5 8.5 L4.5 3 L6 3 L6 7 L6.5 1.5 L8 1.5 L8 7 L8.8 2.2 L10.3 2.4 L9.8 7.4 L11.2 4 L12.6 4.6 L11.5 10 C11 13 9.5 15 7.5 15 Z" /></svg>
                  </motion.em>}
                </div>
              ))}
            </div>
            <div className="pv-sub">
              <motion.span key={s} initial={{ clipPath: "inset(0 100% 0 0)" }} animate={{ clipPath: "inset(0 0% 0 0)" }} transition={{ duration: 1.1, ease: "linear" }}>
                {s === 5 ? "สวัสดีครับทุกคน เริ่มประชุมกันเลย" : "มีคำถามยกมือได้เลยครับ"}
              </motion.span>
            </div>
            <div className="pv-bar"><span /><span /><span className="red" /><span /></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------- this portfolio: night hero, then project cards ---------- */
function Portfolio({ s }: { s: number }) {
  const scrolled = s >= 3;
  return (
    <div className="pv-site">
      <motion.div className="pv-scroll" animate={{ y: scrolled ? "-62%" : "0%" }} transition={{ duration: 0.9, ease }}>
        <div className="pv-hero">
          <i className="pv-moon" />
          {Array.from({ length: 14 }, (_, i) => <i key={i} className="pv-star" style={{ left: `${(i * 37) % 96}%`, top: `${(i * 23) % 55}%`, animationDelay: `${i * 0.2}s` }} />)}
          <span className="pv-h1" /><span className="pv-h1 serif" />
          <motion.span className="pv-cta" animate={s === 2 ? { scale: [1, 0.9, 1] } : {}} transition={{ duration: 0.3 }} />
          <svg className="pv-hills" viewBox="0 0 100 20" preserveAspectRatio="none"><path d="M0 12 L18 5 L34 13 L52 3 L70 12 L86 6 L100 11 V20 H0Z" /></svg>
        </div>
        <div className="pv-cards">
          {[0, 1, 2].map((i) => (
            <motion.div key={i} className="pv-card" initial={false}
              animate={{ opacity: scrolled ? 1 : 0, y: scrolled ? 0 : 16, rotateY: s === 4 && i === 1 ? -8 : 0, rotateX: s === 4 && i === 1 ? 6 : 0 }}
              transition={{ duration: 0.6, delay: scrolled && s === 3 ? 0.15 + i * 0.1 : 0, ease }}>
              <span className="pv-line" /><span className="pv-line short" />
            </motion.div>
          ))}
        </div>
      </motion.div>
      <motion.i className="pv-cat" animate={{ left: s >= 1 ? "78%" : "6%" }} transition={{ duration: 3.6, ease: "linear" }} />
    </div>
  );
}

/* ---------- any other repo: terminal, then the page builds ---------- */
function Generic({ s }: { s: number }) {
  const lines = ["$ npm install", "$ npm run dev", "✓ ready on localhost:3000"];
  return (
    <div className="pv-term-wrap">
      <AnimatePresence mode="wait">
        {s < 3 ? (
          <motion.div key="t" className="pv-term" exit={{ opacity: 0 }}>
            {lines.slice(0, s + 1).map((l) => (
              <motion.div key={l} initial={{ clipPath: "inset(0 100% 0 0)" }} animate={{ clipPath: "inset(0 0% 0 0)" }} transition={{ duration: 0.6, ease: "linear" }}>{l}</motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div key="p" className="pv-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {[0, 1, 2, 3].map((i) => <motion.span key={i} className={`pv-block b${i}`} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: i * 0.15, duration: 0.5, ease }} />)}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const SCENES: Record<string, Scene> = {
  "emeeting-system": {
    url: "emeeting.app/booking", steps: 7, still: 2, tick: 1500, View: Meeting,
    // cursor [x%, y%] per step
    cursor: [[70, 70], [57, 47], [57, 47], [62, 74], [62, 74], [86, 88], [55, 52]],
  },
  portfolio: {
    url: "portfolio.vercel.app", steps: 6, still: 0, tick: 1400, View: Portfolio,
    cursor: [[30, 40], [50, 66], [50, 66], [50, 60], [52, 56], [80, 30]],
  },
};
const GENERIC: Scene = { url: "localhost:3000", steps: 5, still: 4, tick: 1100, View: Generic, cursor: [[85, 85], [85, 85], [85, 85], [40, 40], [60, 55]] };

export default function Preview({ repo, large = false }: { repo: string; large?: boolean }) {
  const scene = SCENES[repo] ?? GENERIC;
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { margin: "-10% 0px" });
  const calm = useCalm();
  const [s, setS] = useState(0);
  // reduced motion: still frame until the visitor asks to see it play
  const [play, setPlay] = useState(false);
  const moving = !calm || play;

  useEffect(() => {
    if (!seen || !moving) return;
    const id = setInterval(() => setS((n) => (n + 1) % scene.steps), scene.tick);
    return () => clearInterval(id);
  }, [seen, moving, scene]);

  const step = moving ? s : scene.still;
  const [cx, cy] = scene.cursor[step];
  const View = scene.View;
  return (
    <div ref={ref} className={`pv ${large ? "pv-large" : ""} ${play ? "pv-playing" : ""}`} role="img" aria-label={`ภาพจำลองการใช้งาน ${repo}`}>
      <div className="pv-chrome"><i /><i /><i /><span>{scene.url}</span></div>
      <div className="pv-screen">
        <View s={step} />
        {/* always rendered (hydration-safe); CSS hides it under reduced motion */}
        <motion.i className="pv-cursor" initial={false} animate={{ left: `${cx}%`, top: `${cy}%` }} transition={{ duration: 0.8, ease }} aria-hidden="true">
          <svg viewBox="0 0 12 16"><path d="M1 1 L1 13 L4 10 L6.5 15 L8.5 14 L6 9 L10.5 9 Z" /></svg>
        </motion.i>
        {calm && !play && (
          <button className="pv-play" onClick={() => setPlay(true)}>
            <svg viewBox="0 0 10 10" aria-hidden="true"><path d="M2 1 L9 5 L2 9 Z" /></svg>ดูการใช้งาน
          </button>
        )}
      </div>
    </div>
  );
}
