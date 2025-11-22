import type { FormEvent } from "react";
import { ArrowUpIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { LanguageDropdown } from "./LanguageDropdown";

interface RepoFiltersProps {
  username: string;
  onUsernameChange: (value: string) => void;
  onSubmitUsername: (value: string) => void;
  loading: boolean;
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  languages: string[];
  selectedLanguage: string | null;
  onLanguageChange: (language: string | null) => void;
  repoCount: number;
  totalRepos: number;
}

export function RepoFilters({
  username,
  onUsernameChange,
  onSubmitUsername,
  loading,
  searchTerm,
  onSearchTermChange,
  languages,
  selectedLanguage,
  onLanguageChange,
  repoCount,
  totalRepos,
}: RepoFiltersProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmitUsername(username);
  };

  return (
    <div className="sticky top-0 z-20 -mx-4 px-4 -mt-8 pt-8 pb-2 bg-zinc-100">
      <div className="space-y-3">
        {/* Search new user */}
        <form onSubmit={handleSubmit}>
          <div className="flex items-center gap-2 rounded-full bg-white px-2 pl-3 py-1.5 shadow-sm ring-1 ring-zinc-200 transition-shadow focus-within:ring-2 focus-within:ring-zinc-300">
            <MagnifyingGlassIcon className="h-4 w-4 text-zinc-400" />
            <input
              type="text"
              className="w-full bg-transparent text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none"
              placeholder="Search another user..."
              value={username}
              onChange={(event) => onUsernameChange(event.target.value)}
            />
            <button
              type="submit"
              disabled={loading}
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-white transition hover:bg-zinc-700 disabled:bg-zinc-300"
            >
              {loading ? (
                <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <ArrowUpIcon className="h-3 w-3" />
              )}
            </button>
          </div>
        </form>

        {/* Filter repos */}
        <div className="flex items-center gap-3">
          <div className="flex flex-1 items-center gap-2 rounded-lg px-3 py-2 ring-1 ring-zinc-100">
            <MagnifyingGlassIcon className="h-3 w-3 text-zinc-400" />
            <input
              type="text"
              className="w-full bg-transparent text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none"
              placeholder="Filter repositories..."
              value={searchTerm}
              onChange={(event) => onSearchTermChange(event.target.value)}
            />
          </div>

          <LanguageDropdown
            languages={languages}
            selectedLanguage={selectedLanguage}
            onSelect={onLanguageChange}
          />

          <span className="text-xs text-zinc-400 tabular-nums pr-1">
            {repoCount}/{totalRepos}
          </span>
        </div>
      </div>
      {/* Fade gradient */}
      <div className="absolute left-0 right-0 bottom-0 h-4 bg-gradient-to-b from-zinc-100 to-transparent translate-y-full pointer-events-none" />
    </div>
  );
}
