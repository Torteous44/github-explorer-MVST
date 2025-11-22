import { cn } from "@/lib/utils";

interface IndeterminateProgressProps {
  className?: string;
}

export function IndeterminateProgress({ className }: IndeterminateProgressProps) {
  return (
    <div
      className={cn(
        "relative h-1 w-full overflow-hidden rounded-full bg-zinc-200",
        className
      )}
    >
      <div
        className="absolute h-full w-1/3 rounded-full bg-zinc-900 animate-[progress-slide_1.5s_ease-in-out_infinite]"
      />
    </div>
  );
}
