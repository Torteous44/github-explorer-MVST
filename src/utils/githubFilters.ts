import type { GithubRepo } from "../api/github";

export function filterReposBySearchTerm(
  repos: GithubRepo[],
  searchTerm: string,
): GithubRepo[] {
  const normalizedTerm = searchTerm.trim().toLowerCase();
  if (!normalizedTerm) {
    return repos;
  }
  return repos.filter((repo) =>
    repo.name.toLowerCase().includes(normalizedTerm),
  );
}

export function filterReposByLanguage(
  repos: GithubRepo[],
  language: string | null,
): GithubRepo[] {
  if (!language) {
    return repos;
  }

  return repos.filter((repo) => repo.language === language);
}

export function applyRepoFilters(
  repos: GithubRepo[],
  searchTerm: string,
  language: string | null,
): GithubRepo[] {
  let filtered = filterReposBySearchTerm(repos, searchTerm);
  filtered = filterReposByLanguage(filtered, language);
  return filtered;
}

export function extractLanguages(repos: GithubRepo[]): string[] {
  const languages = new Set<string>();
  repos.forEach((repo) => {
    if (repo.language) {
      languages.add(repo.language);
    }
  });
  return Array.from(languages).sort((a, b) => a.localeCompare(b));
}
