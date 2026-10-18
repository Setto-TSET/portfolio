"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import Cat from "./Cat";
import { useEgg } from "./Chrome";
import { site } from "@/lib/site";

const StarField = dynamic(() => import("./StarField"), { ssr: false });

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 30, filter: "blur(8px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  transition: { duration: 1, delay, ease: [0.2, 0.7, 0.2, 1] as const },
});
const MEOWS = ["Meow ~", "เมี้ยว! ลูบอีกสิ", "ไปดูผลงานสิ 🐾", "ป่ะ… อีกนิดเดียว ✦"];

export default function Hero() {
  const calm = useReducedMotion() ?? false;
  const { scrollY } = useScroll();
  const px = useSpring(useMotionValue(0), { stiffness: 60, damping: 20 });
  // each hill layer moves at its own speed -> depth
  const far = useTransform(() => `translate(${px.get() * -10}px, ${scrollY.get() * -0.08}px)`);
  const mid = useTransform(() => `translate(${px.get() * -22}px, ${scrollY.get() * -0.18}px)`);
  const moonY = useTransform(scrollY, (y) => y * 0.35);
  const moonX = useTransform(px, (x) => x * 14);
  const fade = useTransform(scrollY, [0, 500], [1, 0]);

  const openEgg = useEgg();
  const [pets, setPets] = useState(0);
  const [say, setSay] = useState<string | null>(null);
  const pet = () => {
    const n = pets + 1;
    if (n >= 5) { setPets(0); setSay(null); openEgg(); return; }
    setPets(n);
    setSay(MEOWS[(n - 1) % MEOWS.length]);
    setTimeout(() => setSay(null), 2000);
  };

  return (
    <div className="hero" onPointerMove={(e) => px.set(e.clientX / innerWidth - 0.5)}>
      <div className="canvas" aria-hidden="true"><StarField calm={calm} /></div>
      <motion.div className="moon-big" aria-hidden="true" style={{ y: moonY, x: moonX }}
        initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1.6, ease: "easeOut" }} />

      <motion.div className="wrap content" style={{ opacity: fade }}>
        <motion.p className="eyebrow" {...rise(0)}>Portfolio · {site.role}</motion.p>
        <h1>
          <motion.span style={{ display: "block" }} {...rise(0.1)}>สวัสดี ฉันชื่อ {site.name},</motion.span>
          <motion.span className="serif" {...rise(0.3)}>building in moonlight.</motion.span>
        </h1>
        <motion.p className="lead" {...rise(0.45)}>
          นักพัฒนาที่ชอบความสงบ สร้างเว็บและระบบที่ใช้งานง่าย ตั้งแต่ระบบจองห้องประชุมไปจนถึง mockup สำหรับองค์กร
          ไม่ต้องสมบูรณ์แบบ แค่ทำให้ดีที่สุดในแบบของตัวเอง
        </motion.p>
        <motion.div className="btns" {...rise(0.6)}>
          <Link className="btn dark" href="/projects">ดูผลงาน →</Link>
          <Link className="btn light" href="/playground">เข้า Playground ✦</Link>
        </motion.div>
      </motion.div>

      <svg className="hills" viewBox="0 0 1440 260" preserveAspectRatio="none" aria-hidden="true">
        <motion.g style={{ transform: far }}>
          <path d="M-40 120 L180 60 L340 130 L520 40 L700 120 L880 50 L1060 130 L1260 70 L1480 120 V300 H-40Z" fill="var(--hill-1)" opacity=".55" />
        </motion.g>
        <motion.g style={{ transform: mid }}>
          <path d="M-60 170 L220 110 L420 180 L640 100 L860 170 L1080 110 L1300 170 L1500 140 V300 H-60Z" fill="var(--hill-2)" opacity=".75" />
        </motion.g>
        <path d="M0 210 Q360 160 720 205 T1440 200 V260 H0Z" fill="var(--hill-3)" />
        <path d="M0 240 Q360 225 720 240 T1440 238 V260 H0Z" fill="var(--bg)" />
      </svg>

      <motion.button className="hero-cat" onClick={pet} aria-label="ลูบแมว" whileTap={{ scale: 0.9 }}
        animate={pets ? { y: [0, -22, 0], rotate: [0, -8, 0] } : {}} key={pets} transition={{ duration: 0.5 }}>
        <AnimatePresence>
          {say && (
            <motion.span className="bubble" role="status" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {say}
            </motion.span>
          )}
        </AnimatePresence>
        <Cat happy={!!say} />
      </motion.button>

      <motion.a className="scroll-hint" href="#featured" style={{ opacity: fade }}
        animate={calm ? {} : { y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.8 }}>
        เลื่อนลง<span aria-hidden="true">↓</span>
      </motion.a>
    </div>
  );
}
