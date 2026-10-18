// Shared by server and client code (no server-only imports here).
export type Repo = {
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  html_url: string;
  homepage: string | null;
  pushed_at: string;
  created_at: string;
  topics: string[];
  fork: boolean;
  archived: boolean;
};

export type Commit = { sha: string; html_url: string; commit: { message: string; author: { date: string } } };

// Thai descriptions that override (or fill in) the GitHub description.
export const NOTES: Record<string, string> = {};

// Repos kept off the site even though they are public on GitHub.
export const HIDDEN = new Set(["Nexus_Mockup_V2"]);

export const LANG_COLOR: Record<string, string> = {
  TypeScript: "#3178c6", JavaScript: "#f1e05a", Python: "#3572A5", HTML: "#e34c26", CSS: "#563d7c",
  Solidity: "#AA6746", Java: "#b07219", PHP: "#4F5D95", "C#": "#178600", Dart: "#00B4AB",
};

export function describe(r: Repo) {
  return NOTES[r.name] || r.description || "ยังไม่มีคำอธิบาย";
}

export function prettyName(name: string) {
  return name.replace(/[-_]/g, " ");
}
