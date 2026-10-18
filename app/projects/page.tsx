import type { Metadata } from "next";
import { Suspense } from "react";
import ProjectGrid from "@/components/ProjectGrid";
import { CountUp, Reveal } from "@/components/Motion";
import { getProfile, getRepos } from "@/lib/github";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "ผลงาน" };

async function Projects() {
  const [repos, profile] = await Promise.all([getRepos(), getProfile()]);
  const langs = new Set(repos.map((r) => r.language).filter(Boolean));
  return (
    <>
      <Reveal className="gh-head" delay={0.2}>
        {profile && <img src={profile.avatar_url} alt="" width={48} height={48} />}
        <div>
          <a href={`https://github.com/${site.github}`} target="_blank" rel="noopener">@{site.github} ↗</a>
          <br /><small style={{ color: "var(--ink-soft)" }}>ดึงข้อมูลจาก GitHub · อัปเดตทุกชั่วโมง</small>
        </div>
        <div className="gh-stats">
          <div><CountUp to={repos.length} /><span>repositories</span></div>
          <div><CountUp to={langs.size} /><span>ภาษา</span></div>
          <div><CountUp to={repos.reduce((n, r) => n + r.stargazers_count, 0)} /><span>stars</span></div>
        </div>
      </Reveal>
      <ProjectGrid repos={repos} />
    </>
  );
}

export default function ProjectsPage() {
  return (
    <section className="page-top">
      <div className="wrap">
        <Reveal><p className="eyebrow">Projects</p></Reveal>
        <Reveal delay={0.08}><h2>ผลงานทั้งหมด <span className="serif">and still growing.</span></h2></Reveal>
        <Reveal delay={0.16}><p className="lead">ทุกโปรเจกต์ public บน GitHub กรองตามภาษา แล้วกดการ์ดเพื่อดูรายละเอียด</p></Reveal>
        <Suspense fallback={<div className="grid"><div className="skeleton" /><div className="skeleton" /><div className="skeleton" /></div>}>
          <Projects />
        </Suspense>
      </div>
    </section>
  );
}
