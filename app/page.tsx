import Link from "next/link";
import { Suspense } from "react";
import Hero from "@/components/Hero";
import { RepoCard } from "@/components/ProjectGrid";
import { Reveal, Tilt } from "@/components/Motion";
import { getRepos } from "@/lib/github";

async function Featured() {
  const repos = (await getRepos()).slice(0, 3);
  if (!repos.length) return <p className="lead">ยังโหลดผลงานจาก GitHub ไม่ได้</p>;
  return <div className="grid">{repos.map((r, i) => <RepoCard key={r.name} r={r} i={i} />)}</div>;
}

const SKILLS = [
  { t: "Frontend", d: "Next.js, React, TypeScript, CSS", code: <><span className="k">const</span> me = {"{"}<br />&nbsp;&nbsp;stack: [<span className="s">&quot;Next.js&quot;</span>, <span className="s">&quot;TS&quot;</span>],<br />&nbsp;&nbsp;mood: <span className="s">&quot;calm&quot;</span><br />{"}"}</> },
  { t: "Backend", d: "Node.js, REST API, Database", code: <><span className="c">{"// GET /api/meetings"}</span><br />app.<span className="k">get</span>(<span className="s">&quot;/api&quot;</span>, handler)<br /><span className="c">{"// 200 OK · 12ms"}</span></> },
  { t: "UI / Prototype", d: "Mockup, Figma, Vercel", code: <><span className="k">deploy</span> portfolio<br /><span className="c">{"// ✓ ready on vercel.app"}</span><br /><span className="c">{"// ✦ looks good"}</span></> },
];

const EXPLORE = [
  { href: "/projects", big: "✦", t: "ผลงานทั้งหมด", d: "ทุก repo จาก GitHub พร้อมรายละเอียด" },
  { href: "/about", big: "☾", t: "เรื่องราวของฉัน", d: "timeline การเรียนและการฝึกงาน" },
  { href: "/playground", big: "◎", t: "Playground", d: "ท้องฟ้า 3D ที่ลากหมุนและสร้างกลุ่มดาวได้" },
  { href: "/contact", big: "🐾", t: "ติดต่อ", d: "ทักมาคุยเรื่องงานได้เลย" },
];

export default function Home() {
  return (
    <>
      <Hero />

      <section id="featured" className="tint">
        <div className="wrap">
          <Reveal><p className="eyebrow">Selected work</p></Reveal>
          <Reveal delay={0.08}><h2>ผลงานล่าสุด <span className="serif">from GitHub.</span></h2></Reveal>
          <Reveal delay={0.16}><p className="lead">ดึงสดจาก GitHub ทุกชั่วโมง กดการ์ดเพื่อดู README และ commit ล่าสุด</p></Reveal>
          <Suspense fallback={<div className="grid"><div className="skeleton" /><div className="skeleton" /></div>}>
            <Featured />
          </Suspense>
          <Reveal delay={0.1}><p style={{ marginTop: 28 }}><Link className="btn light" href="/projects">ดูผลงานทั้งหมด →</Link></p></Reveal>
        </div>
      </section>

      <section>
        <div className="wrap">
          <Reveal><p className="eyebrow">Skills</p></Reveal>
          <Reveal delay={0.08}><h2>เครื่องมือที่ใช้ทุกวัน</h2></Reveal>
          <div className="showcase">
            {SKILLS.map((s, i) => (
              <Reveal key={s.t} className="feat" delay={i * 0.12}>
                <div className="stage">
                  <Tilt className="win" max={16}>
                    <div className="dots"><i /><i /><i /></div>
                    <div>{s.code}</div>
                  </Tilt>
                </div>
                <h3>{s.t}</h3>
                <p>{s.d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="tint">
        <div className="wrap">
          <Reveal><p className="eyebrow">Explore</p></Reveal>
          <Reveal delay={0.08}><h2>ไปต่อที่ไหนดี, <span className="serif">pick a star.</span></h2></Reveal>
          <div className="explore">
            {EXPLORE.map((e, i) => (
              <Tilt key={e.href} delay={i * 0.08}>
                <Link className="card-link" href={e.href} aria-label={e.t} />
                <span className="big" aria-hidden="true">{e.big}</span>
                <h3>{e.t}</h3>
                <p>{e.d}</p>
              </Tilt>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
