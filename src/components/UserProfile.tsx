import type { GithubUser } from "@/api/github";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  MapPinIcon,
  LinkIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";

interface UserProfileProps {
  user: GithubUser;
}

export function UserProfile({ user }: UserProfileProps) {
  const joinDate = new Date(user.created_at).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });

  const blogUrl = user.blog
    ? user.blog.startsWith("http")
      ? user.blog
      : `https://${user.blog}`
    : null;

  return (
    <div className="flex flex-col gap-4 items-center lg:items-start pb-6">
      <Avatar className="h-24 w-24 sm:h-32 sm:w-32 lg:h-48 lg:w-48 rounded-full border-4 border-white shadow-lg">
        <AvatarImage src={user.avatar_url} alt={user.login} />
        <AvatarFallback className="text-2xl sm:text-3xl lg:text-4xl">
          {user.login.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div className="space-y-1 text-center lg:text-left">
        {user.name && (
          <h2 className="text-xl font-semibold text-zinc-900">{user.name}</h2>
        )}
        <a
          href={user.html_url}
          target="_blank"
          rel="noreferrer"
          className="text-sm text-zinc-500 hover:text-zinc-700 hover:underline"
        >
          @{user.login}
        </a>
      </div>

      {user.bio && (
        <p className="text-sm text-zinc-700 text-center lg:text-left">
          {user.bio}
        </p>
      )}

      <div className="flex items-center justify-center lg:justify-start gap-4 text-sm text-zinc-600">
        <span>
          <strong className="text-zinc-900">{user.followers}</strong> followers
        </span>
        <span>
          <strong className="text-zinc-900">{user.following}</strong> following
        </span>
      </div>

      <div className="space-y-2 text-sm text-zinc-600">
        {user.location && (
          <div className="flex items-center gap-2">
            <MapPinIcon className="h-4 w-4 text-zinc-400" />
            <span>{user.location}</span>
          </div>
        )}

        {blogUrl && (
          <div className="flex items-center gap-2">
            <LinkIcon className="h-4 w-4 text-zinc-400" />
            <a
              href={blogUrl}
              target="_blank"
              rel="noreferrer"
              className="text-zinc-700 hover:underline truncate"
            >
              {user.blog}
            </a>
          </div>
        )}

        <div className="flex items-center gap-2">
          <CalendarIcon className="h-4 w-4 text-zinc-400" />
          <span>Joined {joinDate}</span>
        </div>
      </div>

      <div className="pt-2 border-t border-zinc-200">
        <span className="text-sm text-zinc-600">
          <strong className="text-zinc-900">{user.public_repos}</strong> public
          repositories
        </span>
      </div>
    </div>
  );
}
