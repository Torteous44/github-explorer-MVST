import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  fetchGithubUser,
  fetchGithubRepos,
  fetchGithubUserWithRepos,
  GithubApiError,
} from "./github";

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

describe("GitHub API", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("fetchGithubUser", () => {
    it("fetches user data successfully", async () => {
      vi.spyOn(global, "fetch").mockResolvedValueOnce({
        ok: true,
        json: async () => mockUser,
      } as Response);

      const user = await fetchGithubUser("octocat");

      expect(user).toEqual(mockUser);
      expect(fetch).toHaveBeenCalledWith(
        "https://api.github.com/users/octocat"
      );
    });

    it("throws USER_NOT_FOUND error for 404", async () => {
      vi.spyOn(global, "fetch").mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: "Not Found",
      } as Response);

      await expect(fetchGithubUser("nonexistent")).rejects.toThrow(
        GithubApiError
      );

      try {
        await fetchGithubUser("nonexistent");
      } catch (error) {
        expect(error).toBeInstanceOf(GithubApiError);
        expect((error as GithubApiError).type).toBe("USER_NOT_FOUND");
      }
    });

    it("throws RATE_LIMIT error for 403", async () => {
      vi.spyOn(global, "fetch").mockResolvedValueOnce({
        ok: false,
        status: 403,
        statusText: "Forbidden",
      } as Response);

      try {
        await fetchGithubUser("octocat");
      } catch (error) {
        expect(error).toBeInstanceOf(GithubApiError);
        expect((error as GithubApiError).type).toBe("RATE_LIMIT");
      }
    });

    it("throws NETWORK error on fetch failure", async () => {
      vi.spyOn(global, "fetch").mockRejectedValueOnce(new Error("Network error"));

      try {
        await fetchGithubUser("octocat");
      } catch (error) {
        expect(error).toBeInstanceOf(GithubApiError);
        expect((error as GithubApiError).type).toBe("NETWORK");
      }
    });

    it("encodes username in URL", async () => {
      vi.spyOn(global, "fetch").mockResolvedValueOnce({
        ok: true,
        json: async () => mockUser,
      } as Response);

      await fetchGithubUser("user with spaces");

      expect(fetch).toHaveBeenCalledWith(
        "https://api.github.com/users/user%20with%20spaces"
      );
    });
  });

  describe("fetchGithubRepos", () => {
    it("fetches repos with default parameters", async () => {
      vi.spyOn(global, "fetch").mockResolvedValueOnce({
        ok: true,
        json: async () => mockRepos,
      } as Response);

      const repos = await fetchGithubRepos({ username: "octocat" });

      expect(repos).toEqual(mockRepos);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("per_page=100")
      );
    });

    it("applies custom pagination parameters", async () => {
      vi.spyOn(global, "fetch").mockResolvedValueOnce({
        ok: true,
        json: async () => mockRepos,
      } as Response);

      await fetchGithubRepos({ username: "octocat", perPage: 50, page: 2 });

      const calledUrl = (fetch as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(calledUrl).toContain("per_page=50");
      expect(calledUrl).toContain("page=2");
    });
  });

  describe("fetchGithubUserWithRepos", () => {
    it("fetches user and repos in parallel", async () => {
      vi.spyOn(global, "fetch")
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockUser,
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockRepos,
        } as Response);

      const result = await fetchGithubUserWithRepos("octocat");

      expect(result.user).toEqual(mockUser);
      expect(result.repos).toEqual(mockRepos);
      expect(fetch).toHaveBeenCalledTimes(2);
    });
  });
});
