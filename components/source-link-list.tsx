import Link from "next/link"
import { ExternalLinkIcon } from "lucide-react"
import { PLATFORM_META } from "@/lib/constants"
import type { SourceLink } from "@/lib/types"
import { Badge } from "@/components/ui/badge"

export function SourceLinkList({
  sourceLinks,
  compact = false,
}: {
  sourceLinks: SourceLink[]
  compact?: boolean
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {sourceLinks.map((link) => {
        const meta = PLATFORM_META[link.platform]

        return (
          <Link
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex"
          >
            <Badge
              variant="secondary"
              className={[
                "rounded-full border border-border/70 bg-background/80 px-3 py-1.5 text-foreground transition hover:border-primary/30 hover:bg-background",
                compact ? "text-[0.72rem]" : "text-xs",
              ].join(" ")}
            >
              <span>{meta.emoji}</span>
              <span>{compact ? meta.shortLabel : link.label}</span>
              <ExternalLinkIcon className="size-3.5" />
            </Badge>
          </Link>
        )
      })}
    </div>
  )
}
