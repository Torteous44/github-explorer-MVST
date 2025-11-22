import { useMemo, useState } from "react";
import { ArrowDownIcon } from "@heroicons/react/24/outline";
import { useGithubUserRepos } from "@/hooks/useGithubUserRepos";
import { applyRepoFilters, extractLanguages } from "@/utils/githubFilters";
import { SearchSection } from "@/components/SearchSection";
import { UserProfile } from "@/components/UserProfile";
import { RepoFilters } from "@/components/RepoFilters";
import { RepoSection } from "@/components/RepoSection";
import { ErrorMessage } from "@/components/ErrorMessage";
import { IndeterminateProgress } from "@/components/IndeterminateProgress";

function App() {
  const [usernameInput, setUsernameInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const { data, loading, error, load } = useGithubUserRepos();

  const repos = useMemo(() => data?.repos ?? [], [data?.repos]);

  const languages = useMemo(() => extractLanguages(repos), [repos]);

  const filteredRepos = useMemo(
    () => applyRepoFilters(repos, searchTerm, selectedLanguage),
    [repos, searchTerm, selectedLanguage],
  );

  const handleUsernameChange = (value: string) => {
    setUsernameInput(value);
  };

  const handleUsernameSubmit = (value: string) => {
    setHasSubmitted(true);
    setSearchTerm("");
    setSelectedLanguage(null);
    load(value);
  };

  const showResults = hasSubmitted && data?.user;

  // Centered spotlight view (initial state)
  if (!showResults) {
    return (
      <div className="bg-zinc-100">
        {/* Hero Section - Full viewport */}
        <div className="relative flex min-h-screen items-center justify-center px-4 overflow-hidden">
          {/* Background MVST text */}
          <div
            className="pointer-events-none absolute inset-0 flex items-center justify-center select-none"
            aria-hidden="true"
            style={{
              maskImage:
                "linear-gradient(to bottom, black 0%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, black 0%, transparent 100%)",
            }}
          >
            <span
              className="text-[20rem] font-black leading-none tracking-normal text-zinc-200"
              style={{ fontFamily: '"Instrument Sans", sans-serif' }}
            >
              MVST
            </span>
          </div>

          {/* Content */}
          <div className="relative z-10 w-full max-w-md space-y-4">
            <SearchSection
              username={usernameInput}
              onUsernameChange={handleUsernameChange}
              onSubmitUsername={handleUsernameSubmit}
              loading={loading}
            />

            {loading && (
              <div className="space-y-3 pt-4">
                <IndeterminateProgress className="h-0.5" />
              </div>
            )}

            {error && (
              <div className="pt-2">
                <ErrorMessage error={error} />
              </div>
            )}
          </div>

          {/* Down arrow at bottom left */}
          <div className="absolute bottom-6 left-8">
            <ArrowDownIcon className="h-6 w-6 text-zinc-400" />
          </div>

          {/* GitHub repo link at bottom */}
          <div className="absolute bottom-6 left-0 right-0 flex items-center justify-center">
            <a
              href="https://github.com/Torteous44/github-explorer-MVST/"
              target="_blank"
              rel="noreferrer"
              className="text-xs text-zinc-400 hover:text-zinc-600 transition-colors"
            >
              github.com/Torteous44/github-explorer-MVST
            </a>
          </div>
        </div>
        {/* About Section */}
        <div className="flex justify-center px-4 py-8">
          <p className="text-sm text-zinc-400">
            MVST internship application. Search GitHub users. React, TypeScript,
            Tailwind.{" "}
            <a
              href="https://github.com/Torteous44"
              target="_blank"
              rel="noreferrer"
              className="hover:text-zinc-600 transition-colors"
            >
              Matthew Porteous
            </a>
          </p>
        </div>
      </div>
    );
  }

  // Results view (two-column layout)
  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-900">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="lg:sticky lg:top-8 lg:self-start">
            <UserProfile user={data.user} />
          </aside>

          <main className="flex flex-col gap-4">
            <RepoFilters
              username={usernameInput}
              onUsernameChange={handleUsernameChange}
              onSubmitUsername={handleUsernameSubmit}
              loading={loading}
              searchTerm={searchTerm}
              onSearchTermChange={(value) => setSearchTerm(value)}
              languages={languages}
              selectedLanguage={selectedLanguage}
              onLanguageChange={(lang) => setSelectedLanguage(lang)}
              repoCount={filteredRepos.length}
              totalRepos={repos.length}
            />

            <RepoSection
              loading={loading}
              error={error}
              repos={filteredRepos}
              totalRepos={repos.length}
            />
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
