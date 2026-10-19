"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEgg, watchTheme } from "./Chrome";

const CatScene = dynamic(() => import("./CatScene"), { ssr: false });
const MEOWS = ["Meow ~", "เมี้ยว! ลูบอีกสิ", "ไปดูผลงานสิ 🐾", "ป่ะ… อีกนิดเดียว ✦"];

/** The 3D wizard cat that wanders along the bottom of every page. Pet it 5 times for the secret. */
export default function WalkingCat() {
  const wrap = useRef<HTMLDivElement>(null);
  const path = usePathname();
  const calm = useReducedMotion() ?? false;
  const night = useSyncExternalStore(watchTheme, () => document.documentElement.dataset.theme === "night", () => false);

  const openEgg = useEgg();
  const [pets, setPets] = useState(0);
  const [hops, setHops] = useState(0);
  const [say, setSay] = useState<string | null>(null);
  const pet = (e: React.MouseEvent) => {
    // The cat walks over the page, so it must never swallow a click meant for a control underneath.
    // e.detail === 0 means keyboard activation: that is always aimed at the cat.
    if (e.detail > 0) {
      const under = document.elementsFromPoint(e.clientX, e.clientY).find((el) => !wrap.current?.contains(el));
      const control = under?.closest<HTMLElement>("a, button, input, textarea, select, label, [role='button']");
      if (control) {
        control.focus();
        control.click();
        return;
      }
    }
    setHops((h) => h + 1);
    const n = pets + 1;
    if (n >= 5) { setPets(0); setSay(null); openEgg(); return; }
    setPets(n);
    setSay(MEOWS[(n - 1) % MEOWS.length]);
    setTimeout(() => setSay(null), 2000);
  };

  // Playground has its own cat on the moon; one WebGL scene there is enough
  if (path === "/playground") return null;

  return (
    <div className="walker" ref={wrap}>
      <CatScene night={night} calm={calm} wrap={wrap} hops={hops} />
      <button onClick={pet} aria-label="ลูบแมว">
        <AnimatePresence>
          {say && (
            <motion.span className="bubble" role="status" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {say}
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    </div>
  );
}
