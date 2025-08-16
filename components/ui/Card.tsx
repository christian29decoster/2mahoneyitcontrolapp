import { cn } from "@/lib/utils"

export default function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={cn(
        "rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[0_6px_24px_rgba(0,0,0,.25)]",
        className
      )}
    />
  )
}
