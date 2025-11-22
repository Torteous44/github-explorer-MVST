import { useMemo, useState } from "react";
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
      <div className="flex min-h-screen items-center justify-center bg-zinc-100 px-4">
        <div className="w-full max-w-md space-y-4">
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
