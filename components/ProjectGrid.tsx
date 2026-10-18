"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { Ago, Tilt } from "./Motion";
import { LANG_COLOR, describe, prettyName, type Repo } from "@/lib/repo";

const ICON: Record<string, string> = { TypeScript: "TS", JavaScript: "JS", Python: "Py", Solidity: "◆", HTML: "<>", CSS: "#" };
const ALL = "ทั้งหมด";

export function RepoCard({ r, i = 0 }: { r: Repo; i?: number }) {
  const lang = r.language || "Other";
  return (
    <Tilt delay={i * 0.08}>
      <Link className="card-link" href={`/projects/${r.name}`} aria-label={`รายละเอียด ${r.name}`} />
      <div className="meta">
        <span className="ic">{ICON[lang] || "◐"}</span>
        <div><b>{prettyName(r.name)}</b><small>{lang}</small></div>
        {r.homepage && <span className="badge b-done">มีเดโม</span>}
      </div>
      <p>{describe(r)}</p>
      <div className="foot">
        <span><i className="dot" style={{ background: LANG_COLOR[lang] || "#8b78c4" }} />{lang}</span>
        <span>★ {r.stargazers_count}</span>
        <span>อัปเดต <Ago date={r.pushed_at} /></span>
      </div>
      <div className="links">
        <Link href={`/projects/${r.name}`}>รายละเอียด →</Link>
        <a href={r.html_url} target="_blank" rel="noopener">GitHub ↗</a>
        {r.homepage && <a href={r.homepage} target="_blank" rel="noopener">เดโม ↗</a>}
      </div>
    </Tilt>
  );
}

export default function ProjectGrid({ repos }: { repos: Repo[] }) {
  const langs = [ALL, ...new Set(repos.map((r) => r.language || "Other"))];
  const [lang, setLang] = useState(ALL);
  const shown = lang === ALL ? repos : repos.filter((r) => (r.language || "Other") === lang);

  if (!repos.length)
    return <p className="lead" style={{ marginTop: 24 }}>ยังโหลดผลงานจาก GitHub ไม่ได้ ลองรีเฟรชอีกครั้งในภายหลัง</p>;

  return (
    <LayoutGroup>
      <div className="tabs" role="group" aria-label="กรองตามภาษา">
        {langs.map((l) => (
          <button key={l} className={l === lang ? "on" : ""} aria-pressed={l === lang} onClick={() => setLang(l)}>
            {l === lang && <motion.i className="pill" layoutId="tab-pill" transition={{ type: "spring", stiffness: 400, damping: 30 }} />}
            <span>{l} <small>{l === ALL ? repos.length : repos.filter((r) => (r.language || "Other") === l).length}</small></span>
          </button>
        ))}
      </div>
      <motion.div className="grid" layout>
        <AnimatePresence mode="popLayout">
          {shown.map((r, i) => (
            <motion.div key={r.name} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
              <RepoCard r={r} i={i} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </LayoutGroup>
  );
}
