/**
 * GitHub API wrapper module.
 * Provides typed functions for fetching GitHub user and repository data.
 * @module api/github
 */

/** Minimal shape of a GitHub repository. */
export interface GithubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  archived: boolean;
  fork: boolean;
  updated_at: string;
}

/** Shape of a GitHub user profile. */
export interface GithubUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name: string | null;
  company: string | null;
  blog: string | null;
  location: string | null;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
}

const GITHUB_API_BASE = "https://api.github.com";

/**
 * Error types for GitHub API failures.
 * Used to provide specific error handling in the UI.
 */
export type GithubApiErrorType =
  | "USER_NOT_FOUND"
  | "RATE_LIMIT"
  | "NETWORK"
  | "UNKNOWN";

/**
 * Custom error class for GitHub API failures.
 * Includes error type for UI-specific error handling.
 */
export class GithubApiError extends Error {
  type: GithubApiErrorType;
  status?: number;

  /**
   * @param message - Human-readable error message
   * @param type - Error type for programmatic handling
   * @param status - HTTP status code (if applicable)
   */
  constructor(message: string, type: GithubApiErrorType, status?: number) {
    super(message);
    this.name = "GithubApiError";
    this.type = type;
    this.status = status;
  }
}

/**
 * Handles GitHub API response and converts errors to GithubApiError.
 * @param res - Fetch Response object
 * @returns Parsed JSON response
 * @throws {GithubApiError} On non-OK response
 */
async function handleGithubResponse<T>(res: Response): Promise<T> {
  if (res.ok) {
    return (await res.json()) as T;
  }

  if (res.status === 404) {
    throw new GithubApiError("User not found", "USER_NOT_FOUND", res.status);
  }

  if (res.status === 403) {
    // GitHub often uses 403 for rate limiting (with X-RateLimit headers)
    throw new GithubApiError(
      "GitHub API rate limit exceeded",
      "RATE_LIMIT",
      res.status,
    );
  }

  throw new GithubApiError(
    `GitHub API error: ${res.status} ${res.statusText}`,
    "UNKNOWN",
    res.status,
  );
}

/**
 * Fetches a GitHub user's profile data.
 * @param username - GitHub username to fetch
 * @returns User profile data
 * @throws {GithubApiError} On API or network failure
 * @example
 * const user = await fetchGithubUser('octocat');
 * console.log(user.name); // "The Octocat"
 */
export async function fetchGithubUser(username: string): Promise<GithubUser> {
  const url = `${GITHUB_API_BASE}/users/${encodeURIComponent(username)}`;

  try {
    const res = await fetch(url);
    return await handleGithubResponse<GithubUser>(res);
  } catch (err) {
    if (err instanceof GithubApiError) {
      throw err;
    }
    throw new GithubApiError(
      "Network error while fetching GitHub user",
      "NETWORK",
    );
  }
}

/** Parameters for fetching repositories. */
export interface FetchReposParams {
  /** GitHub username */
  username: string;
  /** Results per page (default: 100, max: 100) */
  perPage?: number;
  /** Page number for pagination (default: 1) */
  page?: number;
}

/**
 * Fetches a user's public repositories.
 * Results are sorted by last update date (descending).
 * @param params - Fetch parameters including username and pagination
 * @returns Array of repository data
 * @throws {GithubApiError} On API or network failure
 */
export async function fetchGithubRepos(
  params: FetchReposParams,
): Promise<GithubRepo[]> {
  const { username, perPage = 100, page = 1 } = params;

  const url = new URL(
    `${GITHUB_API_BASE}/users/${encodeURIComponent(username)}/repos`,
  );
  url.searchParams.set("sort", "updated");
  url.searchParams.set("direction", "desc");
  url.searchParams.set("per_page", String(perPage));
  url.searchParams.set("page", String(page));

  try {
    const res = await fetch(url.toString());
    return await handleGithubResponse<GithubRepo[]>(res);
  } catch (err) {
    if (err instanceof GithubApiError) {
      throw err;
    }
    throw new GithubApiError(
      "Network error while fetching GitHub repositories",
      "NETWORK",
    );
  }
}

/** Combined user profile and repositories data. */
export interface GithubUserWithRepos {
  user: GithubUser;
  repos: GithubRepo[];
}

/**
 * Fetches both user profile and repositories in parallel.
 * More efficient than sequential calls for initial page load.
 * @param username - GitHub username to fetch
 * @returns Combined user and repository data
 * @throws {GithubApiError} If either request fails
 */
export async function fetchGithubUserWithRepos(
  username: string,
): Promise<GithubUserWithRepos> {
  // Run requests in parallel for better UX.
  const [user, repos] = await Promise.all([
    fetchGithubUser(username),
    fetchGithubRepos({ username }),
  ]);

  return { user, repos };
}
