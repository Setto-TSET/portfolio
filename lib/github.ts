import { cacheLife } from "next/cache";
import { site } from "./site";
import { HIDDEN, type Commit, type Repo } from "./repo";

export * from "./repo";

const API = "https://api.github.com";

async function gh<T>(path: string, accept = "application/vnd.github+json"): Promise<T | null> {
  const headers: Record<string, string> = { Accept: accept };
  // optional: a token raises the rate limit from 60 to 5000 requests/hour
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  try {
    const res = await fetch(API + path, { headers });
    if (!res.ok) return null;
    return (accept.includes("html") ? await res.text() : await res.json()) as T;
  } catch {
    return null;
  }
}

export async function getRepos(): Promise<Repo[]> {
  "use cache";
  cacheLife("hours");
  const list = await gh<Repo[]>(`/users/${site.github}/repos?sort=pushed&per_page=100`);
  return (list ?? []).filter((r) => !r.fork && !r.archived && !HIDDEN.has(r.name));
}

export async function getProfile() {
  "use cache";
  cacheLife("hours");
  return gh<{ avatar_url: string; name: string | null; bio: string | null; public_repos: number; followers: number }>(
    `/users/${site.github}`,
  );
}

export async function getRepoDetail(raw: string) {
  "use cache";
  cacheLife("hours");
  if (HIDDEN.has(raw)) return { repo: null, languages: {}, commits: [], readme: null };
  const name = encodeURIComponent(raw);
  const [repo, languages, commits, readme] = await Promise.all([
    gh<Repo>(`/repos/${site.github}/${name}`),
    gh<Record<string, number>>(`/repos/${site.github}/${name}/languages`),
    gh<Commit[]>(`/repos/${site.github}/${name}/commits?per_page=6`),
    // GitHub renders and sanitizes the README to HTML for us
    gh<string>(`/repos/${site.github}/${name}/readme`, "application/vnd.github.html+json"),
  ]);
  return { repo, languages: languages ?? {}, commits: commits ?? [], readme };
}
