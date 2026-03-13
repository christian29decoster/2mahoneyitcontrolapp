export default function NexusLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-[#0c1222] text-white antialiased">
      {children}
    </div>
  )
}
