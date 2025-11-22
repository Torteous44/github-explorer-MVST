// src/api/github.ts

// ----- Types -----

// Minimal shape of a GitHub repo we care about
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

// Minimal shape of a GitHub user
export interface GithubUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  public_repos: number;
  followers: number;
  following: number;
}

const GITHUB_API_BASE = "https://api.github.com";

// Custom error type so UI can switch on error.type
export type GithubApiErrorType =
  | "USER_NOT_FOUND"
  | "RATE_LIMIT"
  | "NETWORK"
  | "UNKNOWN";

export class GithubApiError extends Error {
  type: GithubApiErrorType;
  status?: number;

  constructor(message: string, type: GithubApiErrorType, status?: number) {
    super(message);
    this.name = "GithubApiError";
    this.type = type;
    this.status = status;
  }
}

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

export interface FetchReposParams {
  username: string;
  perPage?: number; // default 100
  page?: number; // for future pagination
}

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

export interface GithubUserWithRepos {
  user: GithubUser;
  repos: GithubRepo[];
}

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
