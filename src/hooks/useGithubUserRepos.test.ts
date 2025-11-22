import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { useGithubUserRepos } from "./useGithubUserRepos";
import * as githubApi from "@/api/github";

const mockUser = {
  login: "octocat",
  id: 1,
  avatar_url: "https://github.com/images/octocat.png",
  html_url: "https://github.com/octocat",
  name: "The Octocat",
  company: "GitHub",
  blog: "https://github.blog",
  location: "San Francisco",
  bio: "A cat that codes",
  public_repos: 10,
  followers: 1000,
  following: 5,
  created_at: "2008-01-14T04:33:35Z",
};

const mockRepos = [
  {
    id: 1,
    name: "hello-world",
    full_name: "octocat/hello-world",
    html_url: "https://github.com/octocat/hello-world",
    description: "My first repository",
    language: "JavaScript",
    stargazers_count: 100,
    forks_count: 50,
    archived: false,
    fork: false,
    updated_at: "2024-01-01T00:00:00Z",
  },
];

describe("useGithubUserRepos", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("initializes with default state", () => {
    const { result } = renderHook(() => useGithubUserRepos());

    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(typeof result.current.load).toBe("function");
  });

  it("loads user data successfully", async () => {
    vi.spyOn(githubApi, "fetchGithubUserWithRepos").mockResolvedValueOnce({
      user: mockUser,
      repos: mockRepos,
    });

    const { result } = renderHook(() => useGithubUserRepos());

    await act(async () => {
      await result.current.load("octocat");
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual({
      user: mockUser,
      repos: mockRepos,
    });
    expect(result.current.error).toBeNull();
  });

  it("sets loading state during fetch", async () => {
    let resolvePromise: (value: githubApi.GithubUserWithRepos) => void;
    const promise = new Promise<githubApi.GithubUserWithRepos>((resolve) => {
      resolvePromise = resolve;
    });

    vi.spyOn(githubApi, "fetchGithubUserWithRepos").mockReturnValueOnce(promise);

    const { result } = renderHook(() => useGithubUserRepos());

    act(() => {
      result.current.load("octocat");
    });

    expect(result.current.loading).toBe(true);

    await act(async () => {
      resolvePromise!({ user: mockUser, repos: mockRepos });
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });

  it("handles API errors", async () => {
    const apiError = new githubApi.GithubApiError(
      "User not found",
      "USER_NOT_FOUND",
      404
    );
    vi.spyOn(githubApi, "fetchGithubUserWithRepos").mockRejectedValueOnce(apiError);

    const { result } = renderHook(() => useGithubUserRepos());

    await act(async () => {
      await result.current.load("nonexistent");
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toEqual(apiError);
    expect(result.current.data).toBeNull();
  });

  it("handles empty username", async () => {
    const { result } = renderHook(() => useGithubUserRepos());

    await act(async () => {
      await result.current.load("");
    });

    expect(result.current.error).toBeInstanceOf(githubApi.GithubApiError);
    expect(result.current.error?.message).toBe("Please enter a GitHub username");
  });

  it("handles whitespace-only username", async () => {
    const { result } = renderHook(() => useGithubUserRepos());

    await act(async () => {
      await result.current.load("   ");
    });

    expect(result.current.error).toBeInstanceOf(githubApi.GithubApiError);
  });

  it("clears previous error on new load", async () => {
    const apiError = new githubApi.GithubApiError(
      "User not found",
      "USER_NOT_FOUND",
      404
    );
    vi.spyOn(githubApi, "fetchGithubUserWithRepos")
      .mockRejectedValueOnce(apiError)
      .mockResolvedValueOnce({ user: mockUser, repos: mockRepos });

    const { result } = renderHook(() => useGithubUserRepos());

    // First load - error
    await act(async () => {
      await result.current.load("nonexistent");
    });

    expect(result.current.error).not.toBeNull();

    // Second load - success
    await act(async () => {
      await result.current.load("octocat");
    });

    await waitFor(() => {
      expect(result.current.error).toBeNull();
      expect(result.current.data).not.toBeNull();
    });
  });
});
