import { ChevronDownIcon } from "@heroicons/react/24/outline";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/animate-ui/components/radix/dropdown-menu";

interface LanguageDropdownProps {
  languages: string[];
  selectedLanguage: string | null;
  onSelect: (language: string | null) => void;
}

export function LanguageDropdown({
  languages,
  selectedLanguage,
  onSelect,
}: LanguageDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-400 transition hover:bg-zinc-200 dark:hover:bg-zinc-700 focus:outline-none">
          <span className="h-2 w-2 rounded-full bg-zinc-400" />
          {selectedLanguage ?? "All"}
          <ChevronDownIcon className="h-3 w-3 text-zinc-400" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[140px]">
        <DropdownMenuItem
          onClick={() => onSelect(null)}
          className={selectedLanguage === null ? "bg-zinc-50 dark:bg-zinc-800" : ""}
        >
          All languages
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {languages.map((language) => (
          <DropdownMenuItem
            key={language}
            onClick={() => onSelect(language)}
            className={selectedLanguage === language ? "bg-zinc-50 dark:bg-zinc-800" : ""}
          >
            {language}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
