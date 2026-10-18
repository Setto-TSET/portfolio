"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { randomConstellation } from "./stars";

const Scene = dynamic(() => import("./PlaygroundScene"), {
  ssr: false,
  loading: () => <p style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", margin: 0 }}>กำลังจุดดาว…</p>,
});

export default function Playground() {
  const [links, setLinks] = useState<number[]>([]);
  const [auto, setAuto] = useState(true);

  const pick = (i: number) => setLinks((l) => (l[l.length - 1] === i ? l : [...l, i]));
  const random = () => setLinks(randomConstellation());

  return (
    <div className="play">
      <Scene links={links} onPick={pick} autoRotate={auto} />
      <div className="hud">
        <div>
          <h1>Playground <span className="serif">under the moon.</span></h1>
          <p>ลากเพื่อหมุนท้องฟ้า เลื่อนเพื่อซูม กดดาวทีละดวงเพื่อสร้างกลุ่มดาวของคุณเอง แล้วลองกดแมวบนพระจันทร์ดู</p>
        </div>
        <div className="btns">
          <AnimatePresence>
            {links.length > 0 && (
              <motion.span key="n" className="btn light" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} role="status">
                ✦ {links.length} ดวง
              </motion.span>
            )}
          </AnimatePresence>
          <button className="btn light" onClick={random}>สุ่มกลุ่มดาว</button>
          <button className="btn light" onClick={() => setLinks([])}>ล้าง</button>
          <button className="btn light" onClick={() => setAuto(!auto)} aria-pressed={auto}>{auto ? "หยุดหมุน" : "หมุนอัตโนมัติ"}</button>
        </div>
      </div>
    </div>
  );
}
