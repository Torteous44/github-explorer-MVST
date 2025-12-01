import type { GithubApiError } from "@/api/github";

interface ErrorMessageProps {
  error: GithubApiError;
}

export function ErrorMessage({ error }: ErrorMessageProps) {
  let message = error.message;
  if (error.type === "USER_NOT_FOUND") {
    message = "User not found. Please check the username and try again.";
  } else if (error.type === "RATE_LIMIT") {
    message = "GitHub API rate limit exceeded. Please try again later.";
  } else if (error.type === "NETWORK") {
    message = "Network error while contacting GitHub. Please retry.";
  }

  return <div className="py-3 text-xs text-red-700 dark:text-red-400 text-center">{message}</div>;
}
