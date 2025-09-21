import { Loader2 } from "lucide-react"

export default function Loading({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="p-4 flex flex-col items-center justify-center gap-4">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
      <p className="text-muted-foreground text-sm">{text}</p>
    </div>
  )
}
