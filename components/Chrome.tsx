"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "motion/react";
import Cat from "./Cat";
import { nav, site } from "@/lib/site";

/* ---------- easter egg (the moon & shadow character) ---------- */
const EggCtx = createContext<() => void>(() => {});
export const useEgg = () => useContext(EggCtx);

export function EggProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    addEventListener("keydown", esc);
    return () => removeEventListener("keydown", esc);
  }, []);
  return (
    <EggCtx.Provider value={() => setOpen(true)}>
      {children}
      <AnimatePresence>
        {open && (
          <motion.div className="egg" role="dialog" aria-modal="true" aria-label="ตัวละครลับ"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={(e) => e.target === e.currentTarget && setOpen(false)}>
            <motion.div className="egg-card"
              initial={{ scale: 0.6, rotateY: -90, rotateZ: -6 }} animate={{ scale: 1, rotateY: 0, rotateZ: 0 }}
              exit={{ scale: 0.8, rotateY: 90, opacity: 0 }} transition={{ type: "spring", stiffness: 180, damping: 16 }}>
              <div className="art" role="img" aria-label="แมววิญญาณแห่งจันทราและเงา" />
              <h3>แมววิญญาณแห่งจันทราและเงา</h3>
              <p>เจอตัวละครลับแล้ว! ✦ ร่างจริงของแมวเฝ้าเว็บ</p>
              <button className="btn dark" onClick={() => setOpen(false)}>กลับร่างแมว</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </EggCtx.Provider>
  );
}

/* ---------- theme ---------- */
function watchTheme(cb: () => void) {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => mo.disconnect();
}

export function ThemeToggle() {
  const night = useSyncExternalStore(watchTheme, () => document.documentElement.dataset.theme === "night", () => false);
  const flip = () => {
    const t = night ? "day" : "night";
    document.documentElement.dataset.theme = t;
    try { localStorage.theme = t; } catch {}
  };
  return (
    <button className="icon-btn" onClick={flip} aria-label="สลับธีมกลางวัน/กลางคืน">
      <motion.span key={String(night)} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} style={{ display: "inline-block" }}>
        {night ? "☀" : "☾"}
      </motion.span>
    </button>
  );
}

// runs before paint so the saved theme never flashes
export const themeScript = `try{var t=localStorage.theme||(matchMedia('(prefers-color-scheme: dark)').matches?'night':'day');document.documentElement.dataset.theme=t}catch(e){}`;

/* ---------- notch nav with the cat ---------- */
const CAT_STATES = [
  ["กำลังนอน", "แมวเฝ้าเว็บนอนอยู่… กดอีกทีเพื่อปลุก"],
  ["ตื่นแล้ว", "เมี้ยว! ยินดีต้อนรับสู่พอร์ตของฉัน ✦"],
  ["หิว", "ขอปลาหนึ่งตัว แล้วจะพาไปดูผลงาน 🐟"],
] as const;

export function Notch() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [st, setSt] = useState(0);
  const click = () => {
    if (!open) return setOpen(true);
    const next = (st + 1) % CAT_STATES.length;
    setSt(next);
    if (next === 0) setOpen(false);
  };
  const active = (href: string) => (href === "/" ? path === "/" : path.startsWith(href));

  return (
    <motion.div className="notch" layout transition={{ type: "spring", stiffness: 300, damping: 30 }}>
      <nav aria-label="เมนูหลัก">
        {nav.map((n) => (
          <Link key={n.href} href={n.href} className={active(n.href) ? "active" : ""}>
            {active(n.href) && <motion.i className="pill" layoutId="nav-pill" transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
            <span>{n.label}</span>
          </Link>
        ))}
      </nav>
      <button className="cat-btn" onClick={click} aria-expanded={open} aria-label="เปิดแผงสถานะของแมว">
        <Cat happy={open} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div className="panel" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
            <div style={{ padding: "4px 0" }} role="status">
              <span className="status">{CAT_STATES[st][0]}</span>
              {CAT_STATES[st][1]}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ---------- top bar + scroll progress ---------- */
export function TopBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });
  return (
    <>
      <motion.div className="progress" style={{ scaleX }} aria-hidden="true" />
      <header className="topbar">
        <div className="wrap">
          <Link className="logo" href="/"><span className="moon" /><span>{site.name}</span></Link>
          <ThemeToggle />
        </div>
      </header>
      <Notch />
    </>
  );
}

export function Footer() {
  const openEgg = useEgg();
  return (
    <footer>
      <div className="wrap">
        <span>© 2026 {site.name}</span>
        <button className="egg-hint" onClick={openEgg}>Less drama. More style. ☾</button>
      </div>
    </footer>
  );
}
