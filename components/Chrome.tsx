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
export function watchTheme(cb: () => void) {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => mo.disconnect();
}

export function ThemeToggle() {
  const night = useSyncExternalStore(watchTheme, () => document.documentElement.dataset.theme === "night", () => false);
  const flip = (e: React.MouseEvent<HTMLButtonElement>) => {
    const t = night ? "day" : "night";
    const apply = () => {
      document.documentElement.dataset.theme = t;
      try { localStorage.theme = t; } catch {}
    };
    // the new theme spreads out from the toggle, like moonlight falling over the page
    if (!document.startViewTransition || matchMedia("(prefers-reduced-motion: reduce)").matches) return apply();
    const r = e.currentTarget.getBoundingClientRect();
    const x = r.left + r.width / 2, y = r.top + r.height / 2;
    const end = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    document.startViewTransition(apply).ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${end}px at ${x}px ${y}px)`] },
        { duration: 650, easing: "cubic-bezier(0.16, 1, 0.3, 1)", pseudoElement: "::view-transition-new(root)" },
      );
    });
  };
  return (
    <button className="icon-btn" onClick={flip} aria-label="สลับธีมกลางวัน/กลางคืน">
      <motion.span key={String(night)} initial={{ rotate: -120, scale: 0.5, opacity: 0 }} animate={{ rotate: 0, scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }} style={{ display: "inline-block" }}>
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
          <motion.div className="panel" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0, transition: { duration: 0.18 } }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>
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

/* ---------- logo: just the cat's face, coloured by theme (black at night, Siamese by day) ---------- */
function CatFace() {
  return (
    <svg className="logo-face" viewBox="0 0 64 64" aria-hidden="true">
      <path d="M11 30 L9 6 L28 20 Z M53 30 L55 6 L36 20 Z" fill="var(--cat-point)" />
      <path d="M15 24 L14 13 L23 20 Z M49 24 L50 13 L41 20 Z" fill="#e7b3a6" />
      <ellipse cx="32" cy="36" rx="25" ry="22" fill="var(--cat-fur)" />
      <ellipse cx="32" cy="39" rx="18" ry="15" fill="var(--cat-point)" opacity="var(--cat-mask)" />
      <circle cx="22" cy="35" r="8.5" fill="#fbf4e6" />
      <circle cx="42" cy="35" r="8.5" fill="#fbf4e6" />
      <circle cx="22" cy="35.5" r="6" fill="var(--cat-eye)" />
      <circle cx="42" cy="35.5" r="6" fill="var(--cat-eye)" />
      <ellipse cx="22" cy="35.5" rx="2" ry="3.6" fill="#15131a" />
      <ellipse cx="42" cy="35.5" rx="2" ry="3.6" fill="#15131a" />
      <circle cx="24.5" cy="32" r="1.8" fill="#fff" />
      <circle cx="44.5" cy="32" r="1.8" fill="#fff" />
      <ellipse cx="13" cy="45" rx="4" ry="2.4" fill="#f29a9a" opacity=".75" />
      <ellipse cx="51" cy="45" rx="4" ry="2.4" fill="#f29a9a" opacity=".75" />
      <path d="M29 47 Q32 51 35 47 Z" fill="#e2667a" />
    </svg>
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
          <Link className="logo" href="/" aria-label={`${site.name} หน้าแรก`}><CatFace /></Link>
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
