import { describe, it, expect } from "vitest";
import {
  filterReposBySearchTerm,
  filterReposByLanguage,
  applyRepoFilters,
  extractLanguages,
} from "./githubFilters";
import type { GithubRepo } from "@/api/github";

const mockRepos: GithubRepo[] = [
  {
    id: 1,
    name: "react-app",
    full_name: "user/react-app",
    html_url: "https://github.com/user/react-app",
    description: "A React application",
    language: "TypeScript",
    stargazers_count: 100,
    forks_count: 50,
    archived: false,
    fork: false,
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: 2,
    name: "python-scripts",
    full_name: "user/python-scripts",
    html_url: "https://github.com/user/python-scripts",
    description: "Python utilities",
    language: "Python",
    stargazers_count: 50,
    forks_count: 10,
    archived: false,
    fork: false,
    updated_at: "2024-01-02T00:00:00Z",
  },
  {
    id: 3,
    name: "react-components",
    full_name: "user/react-components",
    html_url: "https://github.com/user/react-components",
    description: "Reusable React components",
    language: "TypeScript",
    stargazers_count: 200,
    forks_count: 80,
    archived: false,
    fork: false,
    updated_at: "2024-01-03T00:00:00Z",
  },
  {
    id: 4,
    name: "docs",
    full_name: "user/docs",
    html_url: "https://github.com/user/docs",
    description: "Documentation",
    language: null,
    stargazers_count: 5,
    forks_count: 2,
    archived: false,
    fork: false,
    updated_at: "2024-01-04T00:00:00Z",
  },
];

describe("githubFilters", () => {
  describe("filterReposBySearchTerm", () => {
    it("returns all repos when search term is empty", () => {
      const result = filterReposBySearchTerm(mockRepos, "");
      expect(result).toHaveLength(4);
    });

    it("returns all repos when search term is whitespace", () => {
      const result = filterReposBySearchTerm(mockRepos, "   ");
      expect(result).toHaveLength(4);
    });

    it("filters repos by name (case-insensitive)", () => {
      const result = filterReposBySearchTerm(mockRepos, "REACT");
      expect(result).toHaveLength(2);
      expect(result.map((r) => r.name)).toEqual([
        "react-app",
        "react-components",
      ]);
    });

    it("filters repos by partial name match", () => {
      const result = filterReposBySearchTerm(mockRepos, "script");
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("python-scripts");
    });

    it("returns empty array when no repos match", () => {
      const result = filterReposBySearchTerm(mockRepos, "nonexistent");
      expect(result).toHaveLength(0);
    });
  });

  describe("filterReposByLanguage", () => {
    it("returns all repos when language is null", () => {
      const result = filterReposByLanguage(mockRepos, null);
      expect(result).toHaveLength(4);
    });

    it("filters repos by exact language match", () => {
      const result = filterReposByLanguage(mockRepos, "TypeScript");
      expect(result).toHaveLength(2);
      expect(result.every((r) => r.language === "TypeScript")).toBe(true);
    });

    it("filters repos by Python language", () => {
      const result = filterReposByLanguage(mockRepos, "Python");
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("python-scripts");
    });

    it("returns empty array for non-existent language", () => {
      const result = filterReposByLanguage(mockRepos, "Rust");
      expect(result).toHaveLength(0);
    });
  });

  describe("applyRepoFilters", () => {
    it("applies both search and language filters", () => {
      const result = applyRepoFilters(mockRepos, "react", "TypeScript");
      expect(result).toHaveLength(2);
    });

    it("applies only search filter when language is null", () => {
      const result = applyRepoFilters(mockRepos, "react", null);
      expect(result).toHaveLength(2);
    });

    it("applies only language filter when search is empty", () => {
      const result = applyRepoFilters(mockRepos, "", "Python");
      expect(result).toHaveLength(1);
    });

    it("returns all repos when both filters are empty/null", () => {
      const result = applyRepoFilters(mockRepos, "", null);
      expect(result).toHaveLength(4);
    });

    it("returns empty when filters exclude all repos", () => {
      const result = applyRepoFilters(mockRepos, "react", "Python");
      expect(result).toHaveLength(0);
    });
  });

  describe("extractLanguages", () => {
    it("extracts unique languages from repos", () => {
      const languages = extractLanguages(mockRepos);
      expect(languages).toEqual(["Python", "TypeScript"]);
    });

    it("excludes null languages", () => {
      const languages = extractLanguages(mockRepos);
      expect(languages).not.toContain(null);
    });

    it("returns sorted languages alphabetically", () => {
      const languages = extractLanguages(mockRepos);
      expect(languages).toEqual([...languages].sort());
    });

    it("returns empty array for empty repos", () => {
      const languages = extractLanguages([]);
      expect(languages).toEqual([]);
    });

    it("returns empty array when all repos have null language", () => {
      const reposWithoutLanguage = [mockRepos[3]];
      const languages = extractLanguages(reposWithoutLanguage);
      expect(languages).toEqual([]);
    });
  });
});
