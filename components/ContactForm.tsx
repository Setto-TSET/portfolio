"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Tilt } from "./Motion";
import { site } from "@/lib/site";

export default function ContactForm() {
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState(false);

  // No backend: opens the visitor's mail app with the message filled in.
  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const subject = `ติดต่อจากพอร์ต: ${f.get("name")}`;
    const body = `${f.get("message")}\n\n— ${f.get("name")} (${f.get("email")})`;
    location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };
  const copy = async () => {
    try { await navigator.clipboard.writeText(site.email); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch {}
  };

  return (
    <div className="contact-grid">
      <motion.form className="form" onSubmit={submit} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <label>ชื่อ<input name="name" required autoComplete="name" /></label>
        <label>อีเมลของคุณ<input name="email" type="email" required autoComplete="email" /></label>
        <label>ข้อความ<textarea name="message" required /></label>
        <motion.button className="btn dark" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} type="submit">ส่งข้อความ ✦</motion.button>
        <AnimatePresence>
          {sent && (
            <motion.p className="hint" role="status" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
              เปิดแอปอีเมลให้แล้ว กดส่งในแอปอีเมลได้เลย 🐾
            </motion.p>
          )}
        </AnimatePresence>
      </motion.form>

      <div className="channels">
        <Tilt delay={0.1}>
          <span className="big" aria-hidden="true">✉</span>
          <div style={{ flex: 1 }}><b>อีเมล</b><small>{site.email}</small></div>
          <button className="btn light" onClick={copy} style={{ position: "relative", zIndex: 2 }}>{copied ? "คัดลอกแล้ว ✓" : "คัดลอก"}</button>
        </Tilt>
        <Tilt delay={0.18}>
          <a className="card-link" href={`https://github.com/${site.github}`} target="_blank" rel="noopener" aria-label="GitHub" />
          <span className="big" aria-hidden="true">⌘</span>
          <div><b>GitHub</b><small>@{site.github}</small></div>
        </Tilt>
        {site.linkedin && (
          <Tilt delay={0.26}>
            <a className="card-link" href={site.linkedin} target="_blank" rel="noopener" aria-label="LinkedIn" />
            <span className="big" aria-hidden="true">in</span>
            <div><b>LinkedIn</b><small>เชื่อมต่อกันได้</small></div>
          </Tilt>
        )}
      </div>
    </div>
  );
}
