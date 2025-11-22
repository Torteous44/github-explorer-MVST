/**
 * Utility functions for filtering GitHub repositories.
 * @module utils/githubFilters
 */

import type { GithubRepo } from "../api/github";

/**
 * Filters repositories by name matching a search term.
 * @param repos - Array of repositories to filter
 * @param searchTerm - Search term to match against repo names (case-insensitive)
 * @returns Filtered array of repositories
 */
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

/**
 * Filters repositories by programming language.
 * @param repos - Array of repositories to filter
 * @param language - Language to filter by, or null to include all
 * @returns Filtered array of repositories
 */
export function filterReposByLanguage(
  repos: GithubRepo[],
  language: string | null,
): GithubRepo[] {
  if (!language) {
    return repos;
  }

  return repos.filter((repo) => repo.language === language);
}

/**
 * Applies both search term and language filters to repositories.
 * @param repos - Array of repositories to filter
 * @param searchTerm - Search term to match against repo names
 * @param language - Language to filter by, or null to include all
 * @returns Filtered array of repositories
 */
export function applyRepoFilters(
  repos: GithubRepo[],
  searchTerm: string,
  language: string | null,
): GithubRepo[] {
  let filtered = filterReposBySearchTerm(repos, searchTerm);
  filtered = filterReposByLanguage(filtered, language);
  return filtered;
}

/**
 * Extracts unique programming languages from repositories.
 * @param repos - Array of repositories
 * @returns Alphabetically sorted array of unique language names
 */
export function extractLanguages(repos: GithubRepo[]): string[] {
  const languages = new Set<string>();
  repos.forEach((repo) => {
    if (repo.language) {
      languages.add(repo.language);
    }
  });
  return Array.from(languages).sort((a, b) => a.localeCompare(b));
}
