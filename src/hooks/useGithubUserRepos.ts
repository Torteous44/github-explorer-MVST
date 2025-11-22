import { useState } from "react";
import { fetchGithubUserWithRepos, GithubApiError } from "../api/github";
import type { GithubUserWithRepos } from "../api/github";

export interface UseGithubUserReposResult {
  data: GithubUserWithRepos | null;
  loading: boolean;
  error: GithubApiError | null;
  load: (username: string) => Promise<void>;
}

/**
 * Simple hook encapsulating loading logic for fetching GitHub user + repos.
 */
export function useGithubUserRepos(): UseGithubUserReposResult {
  const [data, setData] = useState<GithubUserWithRepos | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<GithubApiError | null>(null);

  const load = async (username: string) => {
    const normalizedUsername = username.trim();
    if (!normalizedUsername) {
      setData(null);
      setError(
        new GithubApiError("Please enter a GitHub username", "UNKNOWN"),
      );
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await fetchGithubUserWithRepos(normalizedUsername);
      setData(result);
    } catch (err) {
      if (err instanceof GithubApiError) {
        setError(err);
      } else {
        setError(new GithubApiError("Unknown error", "UNKNOWN"));
      }
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, load };
}
