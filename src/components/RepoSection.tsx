import type { GithubApiError, GithubRepo } from "@/api/github";
import { IndeterminateProgress } from "./IndeterminateProgress";
import { ErrorMessage } from "./ErrorMessage";
import {
  Highlight,
  HighlightItem,
} from "@/components/animate-ui/primitives/effects/highlight";

interface RepoSectionProps {
  loading: boolean;
  error: GithubApiError | null;
  repos: GithubRepo[];
  totalRepos: number;
}

export function RepoSection({
  loading,
  error,
  repos,
  totalRepos,
}: RepoSectionProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        <IndeterminateProgress className="h-1" />
        <RepoListSkeleton />
      </div>
    );
  }

  if (error) {
    return <ErrorMessage error={error} />;
  }

  if (totalRepos === 0) {
    return (
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        This user has no public repositories.
      </p>
    );
  }

  if (repos.length === 0) {
    return (
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        No repositories match your filters.
      </p>
    );
  }

  return <RepoList repos={repos} />;
}

function RepoList({ repos }: { repos: GithubRepo[] }) {
  return (
    <Highlight
      mode="parent"
      hover
      click={false}
      className="bg-zinc-200/20 rounded-lg"
      controlledItems
    >
      <section>
        {repos.map((repo) => (
          <HighlightItem key={repo.id}>
            <a
              href={repo.html_url}
              target="_blank"
              rel="noreferrer"
              className="group block py-1.5 rounded-lg px-2 relative z-10"
            >
              <RepoCardContent repo={repo} />
            </a>
          </HighlightItem>
        ))}
      </section>
    </Highlight>
  );
}

function RepoCardContent({ repo }: { repo: GithubRepo }) {
  return (
    <div className="flex items-start justify-between gap-2">
      <div className="min-w-0 flex-1">
        <h3 className="text-sm font-medium truncate text-zinc-900 dark:text-zinc-900">
          {repo.name}
        </h3>
        {repo.description && (
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">
            {repo.description}
          </p>
        )}
        <div className="mt-2 flex items-center gap-3 text-[11px] text-zinc-400">
          {repo.language && (
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-zinc-300 dark:bg-zinc-600" />
              {repo.language}
            </span>
          )}
          <span>★ {repo.stargazers_count}</span>
          <span>⑂ {repo.forks_count}</span>
        </div>
      </div>
      <span className="shrink-0 text-[10px] text-zinc-300 dark:text-zinc-600">
        {new Date(repo.updated_at).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })}
      </span>
    </div>
  );
}

function RepoListSkeleton() {
  return (
    <section className="divide-y divide-zinc-100 dark:divide-zinc-800">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="py-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-2">
              <div className="h-4 w-32 rounded bg-zinc-200/60 dark:bg-zinc-800/60 animate-pulse" />
              <div className="h-3 w-full max-w-xs rounded bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
              <div className="flex gap-3">
                <div className="h-3 w-16 rounded bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
                <div className="h-3 w-12 rounded bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
              </div>
            </div>
            <div className="h-3 w-12 rounded bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
          </div>
        </div>
      ))}
    </section>
  );
}
