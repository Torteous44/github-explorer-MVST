/**
 * React hook for fetching GitHub user data and repositories.
 * @module hooks/useGithubUserRepos
 */

import { useState } from "react";
import { fetchGithubUserWithRepos, GithubApiError } from "../api/github";
import type { GithubUserWithRepos } from "../api/github";

/** Return type for the useGithubUserRepos hook. */
export interface UseGithubUserReposResult {
  data: GithubUserWithRepos | null;
  loading: boolean;
  error: GithubApiError | null;
  load: (username: string) => Promise<void>;
}

/**
 * Hook for fetching and managing GitHub user data and repositories.
 * Handles loading states, error handling, and data caching.
 *
 * @returns Object containing data, loading state, error, and load function
 *
 * @example
 * ```tsx
 * const { data, loading, error, load } = useGithubUserRepos();
 *
 * const handleSearch = (username: string) => {
 *   load(username);
 * };
 *
 * if (loading) return <Spinner />;
 * if (error) return <Error message={error.message} />;
 * if (data) return <UserProfile user={data.user} repos={data.repos} />;
 * ```
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
