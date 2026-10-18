import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Ago, Reveal } from "@/components/Motion";
import LangBar from "@/components/LangBar";
import { describe, getRepoDetail, getRepos, prettyName } from "@/lib/github";

export async function generateStaticParams() {
  const repos = await getRepos();
  // Cache Components needs at least one param at build time
  return repos.length ? repos.map((r) => ({ repo: r.name })) : [{ repo: "emeeting-system" }];
}

export async function generateMetadata({ params }: PageProps<"/projects/[repo]">): Promise<Metadata> {
  const { repo } = await params;
  return { title: prettyName(repo) };
}

async function Detail({ params }: { params: Promise<{ repo: string }> }) {
  const { repo: name } = await params;
  const { repo, languages, commits, readme } = await getRepoDetail(name);
  if (!repo) notFound();

  return (
    <>
      <div className="detail-head">
        <Reveal><h1>{prettyName(repo.name)}</h1></Reveal>
        <Reveal delay={0.1} className="btns">
          <a className="btn dark" href={repo.html_url} target="_blank" rel="noopener">ดูโค้ดบน GitHub ↗</a>
          {repo.homepage && <a className="btn light" href={repo.homepage} target="_blank" rel="noopener">เปิดเดโม ↗</a>}
        </Reveal>
      </div>
      <Reveal delay={0.15}><p className="lead" style={{ marginTop: 14 }}>{describe(repo)}</p></Reveal>
      <LangBar languages={languages} />

      <div className="detail-grid">
        <Reveal className="readme" delay={0.1}>
          {readme ? <div dangerouslySetInnerHTML={{ __html: readme }} /> : <p>repo นี้ยังไม่มี README</p>}
        </Reveal>
        <aside className="side">
          <Reveal className="box" delay={0.2}>
            <h3>ข้อมูล</h3>
            <div className="foot" style={{ margin: 0 }}>
              <span>★ {repo.stargazers_count}</span><span>⑂ {repo.forks_count}</span>
              <span>สร้าง <Ago date={repo.created_at} /></span>
            </div>
          </Reveal>
          {commits.length > 0 && (
            <Reveal className="box" delay={0.3}>
              <h3>Commit ล่าสุด</h3>
              <ul className="commits">
                {commits.map((c) => (
                  <li key={c.sha}>
                    <a href={c.html_url} target="_blank" rel="noopener">{c.commit.message.split("\n")[0]}</a>
                    <small><Ago date={c.commit.author.date} /></small>
                  </li>
                ))}
              </ul>
            </Reveal>
          )}
        </aside>
      </div>
    </>
  );
}

export default function RepoPage({ params }: PageProps<"/projects/[repo]">) {
  return (
    <section className="page-top">
      <div className="wrap">
        <Link className="back" href="/projects">← ผลงานทั้งหมด</Link>
        <Suspense fallback={<div className="skeleton" style={{ marginTop: 24, minHeight: 320 }} />}>
          <Detail params={params} />
        </Suspense>
      </div>
    </section>
  );
}
