import type { GithubApiError, GithubRepo } from "@/api/github";
import { IndeterminateProgress } from "./IndeterminateProgress";
import { ErrorMessage } from "./ErrorMessage";

interface RepoSectionProps {
  loading: boolean;
  error: GithubApiError | null;
  repos: GithubRepo[];
  totalRepos: number;
}

export function RepoSection({ loading, error, repos, totalRepos }: RepoSectionProps) {
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
      <p className="text-sm text-zinc-500">
        This user has no public repositories.
      </p>
    );
  }

  if (repos.length === 0) {
    return (
      <p className="text-sm text-zinc-500">
        No repositories match your filters.
      </p>
    );
  }

  return <RepoList repos={repos} />;
}

function RepoList({ repos }: { repos: GithubRepo[] }) {
  return (
    <section className="divide-y divide-zinc-100">
      {repos.map((repo) => (
        <RepoCard key={repo.id} repo={repo} />
      ))}
    </section>
  );
}

function RepoCard({ repo }: { repo: GithubRepo }) {
  return (
    <a
      href={repo.html_url}
      target="_blank"
      rel="noreferrer"
      className="group block py-3 transition-colors hover:bg-zinc-50/50 -mx-2 px-2 rounded-lg"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-medium text-zinc-900 group-hover:text-zinc-600 truncate">
            {repo.name}
          </h3>
          {repo.description && (
            <p className="mt-1 text-xs text-zinc-500 line-clamp-2">
              {repo.description}
            </p>
          )}
          <div className="mt-2 flex items-center gap-3 text-[11px] text-zinc-400">
            {repo.language && (
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-zinc-300" />
                {repo.language}
              </span>
            )}
            <span>★ {repo.stargazers_count}</span>
            <span>⑂ {repo.forks_count}</span>
          </div>
        </div>
        <span className="shrink-0 text-[10px] text-zinc-300">
          {new Date(repo.updated_at).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
        </span>
      </div>
    </a>
  );
}

function RepoListSkeleton() {
  return (
    <section className="divide-y divide-zinc-100">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="py-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-2">
              <div className="h-4 w-32 rounded bg-zinc-200/60 animate-pulse" />
              <div className="h-3 w-full max-w-xs rounded bg-zinc-100 animate-pulse" />
              <div className="flex gap-3">
                <div className="h-3 w-16 rounded bg-zinc-100 animate-pulse" />
                <div className="h-3 w-12 rounded bg-zinc-100 animate-pulse" />
              </div>
            </div>
            <div className="h-3 w-12 rounded bg-zinc-100 animate-pulse" />
          </div>
        </div>
      ))}
    </section>
  );
}
