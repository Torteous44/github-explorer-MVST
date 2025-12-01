import type { FormEvent } from "react";
import { ArrowUpIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

interface SearchSectionProps {
  username: string;
  onUsernameChange: (value: string) => void;
  onSubmitUsername: (value: string) => void;
  loading: boolean;
}

export function SearchSection({
  username,
  onUsernameChange,
  onSubmitUsername,
  loading,
}: SearchSectionProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmitUsername(username);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex items-center gap-3 rounded-full bg-white dark:bg-zinc-800 px-3 py-2.5 shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-700 transition-all focus-within:ring-2 focus-within:ring-zinc-300 dark:focus-within:ring-zinc-600">
        <MagnifyingGlassIcon className="h-5 w-5 text-zinc-400" />
        <input
          type="text"
          className="flex-1 bg-transparent text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none"
          placeholder="Search GitHub username..."
          value={username}
          onChange={(event) => onUsernameChange(event.target.value)}
        />
        <button
          type="submit"
          disabled={loading}
          className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 transition hover:bg-zinc-700 dark:hover:bg-zinc-300 disabled:bg-zinc-300 dark:disabled:bg-zinc-700"
        >
          {loading ? (
            <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white dark:border-zinc-900 border-t-transparent" />
          ) : (
            <ArrowUpIcon className="h-3.5 w-3.5" />
          )}
        </button>
      </div>
    </form>
  );
}
