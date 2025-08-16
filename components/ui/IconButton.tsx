import { cn } from "@/lib/utils"

export default function IconButton({
  active,
  className,
  ...props
}: {
  active?: boolean
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={cn(
        "h-11 w-11 rounded-2xl grid place-items-center border transition-all duration-200",
        active
          ? "bg-[rgba(59,130,246,.12)] border-[rgba(59,130,246,.35)] text-[var(--primary)]"
          : "bg-[var(--surface-2)] border-[var(--border)] text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface)]",
        className
      )}
    />
  )
}
