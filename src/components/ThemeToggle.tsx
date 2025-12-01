import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-2 transition-all duration-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 shadow-sm"
      aria-label="Toggle theme"
    >
      {theme === "light" ? (
        <Moon className="h-5 w-5 text-zinc-900 dark:text-zinc-100" />
      ) : (
        <Sun className="h-5 w-5 text-zinc-900 dark:text-zinc-100" />
      )}
    </button>
  );
}
