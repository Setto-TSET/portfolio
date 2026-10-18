"use client";

import { motion } from "motion/react";
import { EASE } from "@/components/Motion";

// re-mounts on every navigation -> page enter transition
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: EASE }}>
      {children}
    </motion.div>
  );
}
