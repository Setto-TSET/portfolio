"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { site } from "@/lib/site";
import { EASE } from "./Motion";

const StarField = dynamic(() => import("./StarField"), { ssr: false });

// moonrise: the moon climbs first, then each headline line surfaces from below its own baseline
const rise = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay, ease: EASE },
});
// same on server and client (no reduced-motion branch) so hydration matches; MotionConfig drops the y for reduced motion
const surface = (delay: number) => ({
  initial: { opacity: 0, y: "0.45em", clipPath: "inset(100% -10% -30% -10%)" },
  animate: { opacity: 1, y: 0, clipPath: "inset(-30% -10% -30% -10%)" },
  transition: { duration: 1, delay, ease: EASE },
});

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

  return (
    <div className="hero" onPointerMove={(e) => px.set(e.clientX / innerWidth - 0.5)}>
      <div className="canvas" aria-hidden="true"><StarField calm={calm} /></div>
      <motion.div className="moon-orbit" aria-hidden="true" style={{ y: moonY, x: moonX }}>
        <motion.div className="moon-big"
          initial={{ y: 220, opacity: 0, boxShadow: "0 0 0px 0px rgba(244, 240, 255, 0)" }}
          animate={{ y: 0, opacity: 1, boxShadow: "0 0 60px 20px rgba(244, 240, 255, 0.45)" }}
          transition={{ duration: 1.8, ease: EASE, boxShadow: { duration: 1.4, delay: 1.1 } }} />
      </motion.div>

      <motion.div className="wrap content" style={{ opacity: fade }}>
        <motion.p className="eyebrow" {...rise(0.25)}>Portfolio · {site.role}</motion.p>
        <h1>
          <motion.span style={{ display: "block" }} {...surface(0.4)}>สวัสดี ฉันชื่อ {site.name},</motion.span>
          <motion.span className="serif" {...surface(0.58)}>building in moonlight.</motion.span>
        </h1>
        <motion.p className="lead" {...rise(0.85)}>
          นักศึกษาวิศวกรรมคอมพิวเตอร์ปี 3 สาย Full-Stack ใช้ React, Node.js และ Python สร้างเว็บและระบบที่ใช้งานง่าย
          ตั้งแต่ระบบจองห้องพักไปจนถึงระบบจองห้องประชุม
        </motion.p>
        <motion.div className="btns" {...rise(1)}>
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

      <motion.a className="scroll-hint" href="#featured" style={{ opacity: fade }}
        animate={calm ? {} : { y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut", delay: 1.6 }}>
        เลื่อนลง<span aria-hidden="true">↓</span>
      </motion.a>
    </div>
  );
}
